"use server";

import { GoogleGenAI, Type } from "@google/genai";

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
  formData: FormData
): Promise<ParsePolicyResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { ok: false, message: "AI extraction is not configured." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "No file provided." };
  }
  if (file.type !== "application/pdf") {
    return { ok: false, message: "Auto-extract only supports PDF files." };
  }
  if (file.size > MAX_INLINE_BYTES) {
    return {
      ok: false,
      message: "PDF is too large to auto-extract — please fill the fields in.",
    };
  }

  let categories: string[] = [];
  try {
    const raw = formData.get("categories");
    if (typeof raw === "string" && raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) categories = parsed.map(String);
    }
  } catch {
    // Non-fatal: proceed with an empty category list.
  }

  const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");

  const stringField = { type: Type.STRING };
  try {
    const ai = new GoogleGenAI({ apiKey });
    const tGeminiStart = performance.now();
    const res = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          parts: [
            { inlineData: { mimeType: "application/pdf", data: base64 } },
            { text: buildPrompt(categories) },
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
    return { ok: false, message: "Auto-extract failed — please fill in manually." };
  }
}
