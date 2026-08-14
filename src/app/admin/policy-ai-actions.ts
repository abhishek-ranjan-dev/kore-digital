"use server";

import { GoogleGenAI, Type } from "@google/genai";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { parseStagedRef, type StagedRef } from "@/lib/supabase/staging-types";
import {
  downloadStagedFile,
  removeStagedFile,
} from "@/lib/supabase/staging";

/*
  ── Gemini auto-extract for statutory policies ──────────────────────────
  Optional AI enhancement: on file drop in the /admin policy form, the PDF is
  sent to Google Gemini, which extracts a draft {title, category,
  mandatoryUnder}. The draft pre-fills the form (highlighted for verification)
  and the admin can edit anything before submitting — nothing is persisted here.

  Fully optional: with no GEMINI_API_KEY the form works exactly as before
  (`policyAiEnabled()` returns false and the client never calls the parser).

  Uses the official @google/genai SDK with structured JSON output. The key is
  server-only and never reaches the browser bundle.
*/

// `gemini-flash-latest` is an alias that tracks the current Flash model, so it
// won't 404 when a pinned version is retired. Override with GEMINI_MODEL.
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";
// Inline PDF data rides in the request body; keep well under Gemini's ~20 MB
// inline request ceiling (base64 inflates ~33%). Larger files → manual entry.
const MAX_INLINE_BYTES = 12 * 1024 * 1024;

export interface PolicyDraft {
  title: string;
  category: string;
  mandatoryUnder: string;
}

export interface ParsePolicyResult {
  ok: boolean;
  draft?: PolicyDraft;
  message?: string;
}

/** True when Gemini auto-extract is configured. Cheap client-mount check. */
export async function policyAiEnabled(): Promise<boolean> {
  return Boolean(process.env.GEMINI_API_KEY);
}

function buildPrompt(categories: string[]): string {
  const list = categories.length
    ? categories.map((c) => `"${c}"`).join(", ")
    : "(no existing categories yet)";
  return [
    "You are a compliance analyst extracting metadata from a statutory or",
    "governance policy document of an Indian company listed under the SEBI",
    "LODR framework. From the attached PDF, extract exactly three fields:",
    "",
    '1. "title" — the official policy title in clean title case, WITHOUT any',
    "   leading file numbers, version tags, or the company name.",
    '   Example: "Risk Management Policy".',
    '2. "mandatoryUnder" — the specific statute or regulation under which this',
    "   policy is mandated, if stated in or clearly identifiable from the",
    '   document (e.g. "SEBI LODR Regulation 21", "Section 178, Companies Act',
    '   2013 & SEBI LODR Reg. 19"). If it is not stated or you are unsure,',
    '   return an empty string. Do NOT invent a reference.',
    '3. "category" — classify the policy into a SINGLE category. Strongly',
    "   prefer one of these existing categories, returned verbatim:",
    `   ${list}.`,
    "   Only if none reasonably fits, return a concise, professional new",
    "   category name of 2–4 words.",
    "",
    "Return only the JSON object.",
  ].join("\n");
}

export async function parsePolicyPdf(
  rawRef: StagedRef,
  categories: string[] = []
): Promise<ParsePolicyResult> {
  await requireAdmin();
  // Trim: a stray trailing space/newline in the env value (common when pasting
  // into a hosting dashboard) would otherwise be sent in the x-goog-api-key
  // header and Gemini rejects it with 401 ACCESS_TOKEN_TYPE_UNSUPPORTED.
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, message: "AI extraction is not configured." };
  }

  // The PDF was uploaded straight to Storage from the browser (bypassing the
  // 4.5 MB Server-Action body cap); we get only a reference to it here.
  const ref = parseStagedRef(rawRef);
  if (!ref) return { ok: false, message: "Invalid upload reference." };

  let bytes: Buffer;
  try {
    bytes = await downloadStagedFile(ref);
  } catch (err) {
    console.error("[policy-ai] staged download failed", err);
    return { ok: false, message: "Could not read the uploaded file." };
  }

  // Always drop the staged object — extraction is transient and never persists.
  try {
    if (bytes.byteLength === 0) {
      return { ok: false, message: "No file provided." };
    }
    if (bytes.byteLength > MAX_INLINE_BYTES) {
      return {
        ok: false,
        message: "PDF is too large to auto-extract — please fill the fields in.",
      };
    }

    const cats = Array.isArray(categories) ? categories.map(String) : [];
    const base64 = bytes.toString("base64");

    const stringField = { type: Type.STRING };
    const ai = new GoogleGenAI({ apiKey });
    const tGeminiStart = performance.now();
    const res = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          parts: [
            { inlineData: { mimeType: "application/pdf", data: base64 } },
            { text: buildPrompt(cats) },
          ],
        },
      ],
      config: {
        temperature: 0,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: stringField,
            category: stringField,
            mandatoryUnder: stringField,
          },
          required: ["title", "category", "mandatoryUnder"],
        },
      },
    });
    console.log(
      `[policy-ai] Gemini (${GEMINI_MODEL}) responded in ${(
        performance.now() - tGeminiStart
      ).toFixed(0)} ms`
    );

    const text = res.text;
    if (!text) {
      return { ok: false, message: "Auto-extract returned nothing." };
    }

    const parsed = JSON.parse(text) as Partial<PolicyDraft>;
    const draft: PolicyDraft = {
      title: String(parsed.title ?? "").trim(),
      category: String(parsed.category ?? "").trim(),
      mandatoryUnder: String(parsed.mandatoryUnder ?? "").trim(),
    };
    if (!draft.title && !draft.category && !draft.mandatoryUnder) {
      return { ok: false, message: "Could not read details from this PDF." };
    }
    return { ok: true, draft };
  } catch (err) {
    console.error("[policy-ai] parse error", err);
    const detail = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      message: `Auto-extract failed — please fill in manually. (${detail})`,
    };
  } finally {
    void removeStagedFile(ref);
  }
}
