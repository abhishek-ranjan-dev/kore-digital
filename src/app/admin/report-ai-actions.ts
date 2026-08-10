"use server";

import { GoogleGenAI, Type } from "@google/genai";
import { PDFDocument } from "pdf-lib";
import { extractText, getDocumentProxy } from "unpdf";
import { requireAdmin } from "@/lib/supabase/require-admin";

/*
  ── Gemini auto-extract for annual reports ──────────────────────────────
  Optional AI enhancement mirroring the policy flow: on file drop in the
  /admin annual-report form, the PDF's headline figures are extracted into a
  draft that pre-fills the form (highlighted for verification). The admin edits
  anything before submitting — nothing is persisted here.

  Smart page pipeline: an audited annual report can be 50–90 pages, but the
  figures we need live on ~3 pages (the Statement of Profit & Loss + the
  Balance Sheet). Rather than sending the whole PDF, we read the per-page text
  with `unpdf` (serverless pdf.js), locate those pages by keyword, and rebuild
  a tiny PDF of just those pages with `pdf-lib` before calling Gemini. This
  cuts the payload ~75–85% and sharpens extraction. If page-selection fails
  (scanned/encrypted PDF, no text layer), we fall back to the whole document.

  Fully optional: with no GEMINI_API_KEY the form works exactly as before.
  Uses the official @google/genai SDK with structured JSON output. Key is
  server-only.
*/

// `gemini-flash-latest` is an alias that tracks the current Flash model, so it
// won't 404 when a pinned version is retired. Override with GEMINI_MODEL.
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";
// We read+trim any source up to the upload cap; the trimmed payload sent to
// Gemini must stay under its ~20 MB inline ceiling (base64 inflates ~33%).
const MAX_SOURCE_BYTES = 25 * 1024 * 1024;
const MAX_INLINE_BYTES = 14 * 1024 * 1024;
// Documents at or below this many pages are small enough to send whole.
const MIN_PAGES_TO_TRIM = 6;
// Cap the pages we forward, so a keyword that appears everywhere can't defeat
// the point of trimming.
const MAX_SELECTED_PAGES = 8;

// Phrases that mark the Statement of Profit & Loss (revenue / EBITDA / PAT).
const PL_KEYS = [
  "statement of profit and loss",
  "revenue from operations",
  "profit for the year",
  "total income",
  "before tax",
];
// Phrases that mark the Balance Sheet (net worth / borrowings / WIP).
const BS_KEYS = [
  "balance sheet",
  "total equity",
  "other equity",
  "borrowings",
  "capital work-in-progress",
  "capital work in progress",
];

export interface ReportDraft {
  fiscalYear: string;
  totalIncome: string;
  operationalEbitda: string;
  pat: string;
  revenue: string;
  netWorth: string;
  longTermBorrowings: string;
  workInProgress: string;
}

export interface ParseReportResult {
  ok: boolean;
  draft?: ReportDraft;
  message?: string;
}

/*
  Locate the financial-statement pages and return a trimmed PDF of just those.
  Returns null (→ caller sends the whole doc) when the report is short, has no
  usable text layer, or anything goes wrong. `raw` is never mutated: each
  consumer gets its own copy, because pdf.js detaches the buffer it receives.
*/
async function selectRelevantPdf(
  raw: Buffer
): Promise<{ bytes: Uint8Array; pages: number[] } | null> {
  try {
    const proxy = await getDocumentProxy(new Uint8Array(raw));
    const { totalPages, text } = await extractText(proxy, {
      mergePages: false,
    });
    const pages = Array.isArray(text) ? text : [text];
    if (totalPages <= MIN_PAGES_TO_TRIM) return null;

    const scored = pages.map((t, i) => {
      const low = (t || "").toLowerCase();
      const count = (keys: string[]) =>
        keys.reduce((n, k) => n + (low.includes(k) ? 1 : 0), 0);
      // Consolidated statements are what the headline scorecard wants — bias
      // the ranking toward pages that mention "consolidated".
      const consolidated = low.includes("consolidated") ? 2 : 0;
      return { i, pl: count(PL_KEYS), bs: count(BS_KEYS), consolidated };
    });

    const topBy = (pick: (s: (typeof scored)[number]) => number) =>
      scored
        .filter((s) => pick(s) > 0)
        .sort((a, b) => pick(b) + b.consolidated - (pick(a) + a.consolidated))
        .slice(0, 3)
        .map((s) => s.i);

    const wanted = new Set<number>([
      ...topBy((s) => s.pl),
      ...topBy((s) => s.bs),
    ]);
    if (wanted.size === 0) return null;

    const indices = [...wanted].sort((a, b) => a - b).slice(0, MAX_SELECTED_PAGES);
    console.log(
      `[report-ai] ${totalPages}-page doc → selected ${indices.length} page(s): [${indices
        .map((i) => i + 1)
        .join(", ")}]`
    );

    const src = await PDFDocument.load(new Uint8Array(raw));
    const out = await PDFDocument.create();
    const copied = await out.copyPages(src, indices);
    copied.forEach((p) => out.addPage(p));
    const bytes = await out.save();

    return { bytes, pages: indices.map((i) => i + 1) };
  } catch (err) {
    console.error("[report-ai] page-selection failed, sending whole doc", err);
    return null;
  }
}

const PROMPT = [
  "You are a financial analyst extracting headline figures from the audited",
  "annual report of an Indian company. The attached PDF has been trimmed to",
  "the financial-statement pages. Return every monetary figure in ₹ CRORE",
  'with two decimals, as a plain number string (e.g. "327.82"). If a figure',
  "is not present or you are unsure, return an empty string — never guess.",
  "Extract exactly these fields:",
  "",
  "SCALING — read carefully. Statements may be printed in rupees, thousands,",
  "lakhs, millions, or crore (check the '(Amount in ...)' / '(₹ in ...)'",
  "header above the columns). Convert to ₹ CRORE: 1 crore = 10,000,000 rupees",
  "= 100 lakh = 10 million. Double-check the decimal place — e.g. 87,61,248",
  "rupees = 0.88 crore (NOT 0.09), and 8,20,749 rupees = 0.08 crore.",
  "",
  "REVENUE — use the 'Revenue from Operations' line. Do NOT use any 'Total'",
  "row that folds in changes in inventory / closing stock / work-in-progress",
  "(some small-company P&Ls add 'Closing Stock - WIP' into a revenue total —",
  "ignore that; it is not income).",
  "",
  '- "fiscalYear": the reporting fiscal year in the form "FY24-25"',
  "  (April–March). Derive from the balance-sheet date if needed.",
  "",
  "CONSOLIDATED statement of profit & loss (prefer consolidated; if the",
  "report has ONLY standalone financials, use those instead):",
  '- "totalIncome": total income = revenue from operations + other income',
  "  ONLY (exclude any closing-stock / inventory-change adjustment).",
  '- "operationalEbitda": operating EBITDA (earnings before interest, tax,',
  "  depreciation & amortisation, excluding other income / exceptional items).",
  '- "pat": profit after tax (net profit for the year).',
  "",
  "STANDALONE figures:",
  '- "revenue": standalone revenue from operations (not any inflated total).',
  '- "netWorth": standalone net worth / total equity (equity share capital +',
  "  other equity).",
  '- "longTermBorrowings": standalone non-current (long-term) borrowings.',
  '- "workInProgress": standalone capital work-in-progress.',
  "",
  "Return only the JSON object.",
].join("\n");

export async function parseReportPdf(
  formData: FormData
): Promise<ParseReportResult> {
  await requireAdmin();
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { ok: false, message: "AI extraction is not configured." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "No file provided." };
  }
  if (file.type !== "application/pdf") {
    return { ok: false, message: "Auto-extract only supports PDF files." };
  }
  if (file.size > MAX_SOURCE_BYTES) {
    return {
      ok: false,
      message: "PDF is too large to auto-extract — please fill the figures in.",
    };
  }

  const raw = Buffer.from(await file.arrayBuffer());
  console.log(
    `[report-ai] parsing "${file.name}" (${(file.size / 1024 / 1024).toFixed(2)} MB)`
  );

  // Trim to the financial-statement pages when possible; else send the whole.
  const tParseStart = performance.now();
  let payload: Uint8Array = new Uint8Array(raw);
  const selection = await selectRelevantPdf(raw);
  if (selection) payload = selection.bytes;
  const parseMs = performance.now() - tParseStart;
  console.log(
    `[report-ai] PDF read + page-trim: ${parseMs.toFixed(0)} ms → ${
      selection ? "trimmed" : "whole doc"
    } payload ${(payload.byteLength / 1024 / 1024).toFixed(2)} MB` +
      (selection ? ` (pages [${selection.pages.join(", ")}])` : "")
  );
  if (payload.byteLength > MAX_INLINE_BYTES) {
    return {
      ok: false,
      message: "PDF is too large to auto-extract — please fill the figures in.",
    };
  }

  const base64 = Buffer.from(payload).toString("base64");

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
            { text: PROMPT },
          ],
        },
      ],
      config: {
        temperature: 0,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fiscalYear: stringField,
            totalIncome: stringField,
            operationalEbitda: stringField,
            pat: stringField,
            revenue: stringField,
            netWorth: stringField,
            longTermBorrowings: stringField,
            workInProgress: stringField,
          },
          required: [
            "fiscalYear",
            "totalIncome",
            "operationalEbitda",
            "pat",
            "revenue",
            "netWorth",
            "longTermBorrowings",
            "workInProgress",
          ],
        },
      },
    });
    console.log(
      `[report-ai] Gemini (${GEMINI_MODEL}) responded in ${(
        performance.now() - tGeminiStart
      ).toFixed(0)} ms`
    );

    const text = res.text;
    if (!text) return { ok: false, message: "Auto-extract returned nothing." };

    const p = JSON.parse(text) as Partial<ReportDraft>;
    const clean = (v: unknown) => String(v ?? "").trim();
    const draft: ReportDraft = {
      fiscalYear: clean(p.fiscalYear),
      totalIncome: clean(p.totalIncome),
      operationalEbitda: clean(p.operationalEbitda),
      pat: clean(p.pat),
      revenue: clean(p.revenue),
      netWorth: clean(p.netWorth),
      longTermBorrowings: clean(p.longTermBorrowings),
      workInProgress: clean(p.workInProgress),
    };
    if (Object.values(draft).every((v) => v === "")) {
      return { ok: false, message: "Could not read figures from this PDF." };
    }
    return { ok: true, draft };
  } catch (err) {
    console.error("[report-ai] parse error", err);
    return { ok: false, message: "Auto-extract failed — please fill in manually." };
  }
}
