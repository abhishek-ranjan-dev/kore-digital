"use server";

import { revalidatePath } from "next/cache";
import {
  ANNUAL_REPORTS_BUCKET,
  getSupabaseAdmin,
  isSupabaseAdminConfigured,
} from "@/lib/supabase/server";

/*
  Annual-report submission — Server Action.

  Persists a fiscal year's figures (standalone + consolidated) to the Supabase
  `annual_reports` table and, if a PDF is attached, uploads it to Supabase
  Storage. Upserts on `fiscal_year`, so re-submitting a year edits it. On
  success it revalidates the IR page so the change shows immediately.

  Auth: NONE — /admin is unauthenticated; protect it at the deployment layer.
  Writes use the service-role key, which never reaches the browser.
*/
const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;
const FY_RE = /^FY\d{2}-\d{2}$/;

const NUMERIC_FIELDS = [
  "revenue",
  "net_worth",
  "long_term_borrowings",
  "work_in_progress",
  "total_income",
  "operational_ebitda",
  "pat",
  "ebitda_margin",
  "pat_margin",
] as const;

export interface SubmitResult {
  ok: boolean;
  message: string;
}

export interface AnnualReportRow {
  fiscalYear: string;
  fiscalYearEnd: string | null;
  totalIncome: number | null;
  operationalEbitda: number | null;
  pat: number | null;
  revenue: number | null;
  netWorth: number | null;
  longTermBorrowings: number | null;
  workInProgress: number | null;
  pdfUrl: string | null;
  updatedAt: string;
}

/** The editable figures — everything except the fiscal year and the PDF. */
export interface UpdateReportInput {
  fiscalYear: string;
  total_income: string;
  operational_ebitda: string;
  pat: string;
  revenue: string;
  net_worth: string;
  long_term_borrowings: string;
  work_in_progress: string;
}

function parseNumber(raw: FormDataEntryValue | null): number | null | "invalid" {
  if (raw == null) return null;
  const s = String(raw).trim();
  if (s === "") return null;
  const n = Number(s.replace(/,/g, ""));
  return Number.isFinite(n) ? n : "invalid";
}

function fiscalYearEndFromLabel(fy: string): string | null {
  const m = fy.match(/FY(\d{2})-(\d{2})/);
  return m ? `20${m[2]}-03-31` : null;
}

export async function submitAnnualReport(
  formData: FormData
): Promise<SubmitResult> {
  if (!isSupabaseAdminConfigured) {
    return {
      ok: false,
      message:
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    };
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: false, message: "Supabase client unavailable." };
  }

  const fiscalYear = String(formData.get("fiscalYear") ?? "").trim();
  if (!FY_RE.test(fiscalYear)) {
    return {
      ok: false,
      message: 'Fiscal year must look like "FY24-25".',
    };
  }

  // One fiscal year, once — reject before touching Storage/DB.
  const { data: existing } = await supabase
    .from("annual_reports")
    .select("fiscal_year")
    .eq("fiscal_year", fiscalYear)
    .maybeSingle();
  if (existing) {
    return {
      ok: false,
      message: `${fiscalYear} already exists — each fiscal year can be submitted once.`,
    };
  }

  const endRaw = String(formData.get("fiscalYearEnd") ?? "").trim();
  const fiscalYearEnd = endRaw || fiscalYearEndFromLabel(fiscalYear);

  // Parse figures; reject non-numeric input.
  const row: Record<string, unknown> = {
    fiscal_year: fiscalYear,
    fiscal_year_end: fiscalYearEnd,
    is_projected: formData.get("isProjected") === "on",
  };
  for (const field of NUMERIC_FIELDS) {
    const v = parseNumber(formData.get(field));
    if (v === "invalid") {
      return { ok: false, message: `"${field}" must be a number.` };
    }
    row[field] = v;
  }

  // Consolidated trio is required (feeds the headline scorecard).
  for (const field of ["total_income", "operational_ebitda", "pat"] as const) {
    if (row[field] == null) {
      return {
        ok: false,
        message: "Total Income, Operational EBITDA and PAT are required.",
      };
    }
  }

  // Standalone figures are required (feed the historical table & chart).
  for (const field of [
    "revenue",
    "net_worth",
    "long_term_borrowings",
    "work_in_progress",
  ] as const) {
    if (row[field] == null) {
      return {
        ok: false,
        message:
          "Revenue, Net Worth, LT Borrowings and Work-in-Progress are required.",
      };
    }
  }

  // Margins are derived when not supplied.
  const ti = row.total_income as number;
  if (row.ebitda_margin == null && row.operational_ebitda != null) {
    row.ebitda_margin =
      Math.round(((row.operational_ebitda as number) / ti) * 10000) / 100;
  }
  if (row.pat_margin == null && row.pat != null) {
    row.pat_margin = Math.round(((row.pat as number) / ti) * 10000) / 100;
  }

  // Required PDF → Supabase Storage.
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "The annual-report PDF is required." };
  }
  if (file.type !== "application/pdf") {
    return { ok: false, message: "Report file must be a PDF." };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, message: "PDF exceeds the 25 MB limit." };
  }
  const objectPath = `${fiscalYear}.pdf`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: upErr } = await supabase.storage
    .from(ANNUAL_REPORTS_BUCKET)
    .upload(objectPath, buffer, {
      contentType: "application/pdf",
      upsert: true,
    });
  if (upErr) {
    return { ok: false, message: `Storage upload failed: ${upErr.message}` };
  }
  const { data: pub } = supabase.storage
    .from(ANNUAL_REPORTS_BUCKET)
    .getPublicUrl(objectPath);
  row.pdf_url = pub.publicUrl;
  row.pdf_filename = file.name;

  const { error } = await supabase.from("annual_reports").insert(row);
  if (error) {
    // 23505 = unique_violation — the year was inserted between our check and here.
    if (error.code === "23505") {
      return {
        ok: false,
        message: `${fiscalYear} already exists — each fiscal year can be submitted once.`,
      };
    }
    return { ok: false, message: `Save failed: ${error.message}` };
  }

  revalidatePath("/investor-relations");
  return { ok: true, message: `Saved ${fiscalYear}.` };
}

export async function listAnnualReports(): Promise<AnnualReportRow[]> {
  if (!isSupabaseAdminConfigured) return [];
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("annual_reports")
    .select(
      "fiscal_year, fiscal_year_end, total_income, operational_ebitda, pat, revenue, net_worth, long_term_borrowings, work_in_progress, pdf_url, updated_at"
    )
    .eq("is_deleted", false)
    .order("fiscal_year_end", { ascending: false });
  if (error || !data) return [];
  const num = (v: unknown) => (v == null ? null : Number(v));
  return data.map((r) => ({
    fiscalYear: String(r.fiscal_year),
    fiscalYearEnd: r.fiscal_year_end ? String(r.fiscal_year_end) : null,
    totalIncome: num(r.total_income),
    operationalEbitda: num(r.operational_ebitda),
    pat: num(r.pat),
    revenue: num(r.revenue),
    netWorth: num(r.net_worth),
    longTermBorrowings: num(r.long_term_borrowings),
    workInProgress: num(r.work_in_progress),
    pdfUrl: r.pdf_url ? String(r.pdf_url) : null,
    updatedAt: String(r.updated_at),
  }));
}

/*
  Edit an existing report's FIGURES only — never the fiscal year, the year-end,
  or the PDF (those identify the row and the document). Upserts nothing new;
  updates the row matched by fiscal_year. Margins are re-derived. Revalidates
  the IR page on success.
*/
export async function updateAnnualReport(
  input: UpdateReportInput
): Promise<SubmitResult> {
  if (!isSupabaseAdminConfigured) {
    return {
      ok: false,
      message:
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    };
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, message: "Supabase client unavailable." };

  const fiscalYear = String(input.fiscalYear ?? "").trim();
  if (!FY_RE.test(fiscalYear)) {
    return { ok: false, message: "Invalid fiscal year." };
  }

  // Parse the editable numeric figures; reject non-numeric input.
  const editable = [
    "revenue",
    "net_worth",
    "long_term_borrowings",
    "work_in_progress",
    "total_income",
    "operational_ebitda",
    "pat",
  ] as const;
  const row: Record<string, unknown> = {};
  for (const field of editable) {
    const v = parseNumber(input[field]);
    if (v === "invalid") {
      return { ok: false, message: `"${field}" must be a number.` };
    }
    row[field] = v;
  }

  // Same required-field contract as a submission.
  for (const field of ["total_income", "operational_ebitda", "pat"] as const) {
    if (row[field] == null) {
      return {
        ok: false,
        message: "Total Income, Operational EBITDA and PAT are required.",
      };
    }
  }
  for (const field of [
    "revenue",
    "net_worth",
    "long_term_borrowings",
    "work_in_progress",
  ] as const) {
    if (row[field] == null) {
      return {
        ok: false,
        message:
          "Revenue, Net Worth, LT Borrowings and Work-in-Progress are required.",
      };
    }
  }

  // Re-derive margins from the edited figures.
  const ti = row.total_income as number;
  row.ebitda_margin =
    row.operational_ebitda != null
      ? Math.round(((row.operational_ebitda as number) / ti) * 10000) / 100
      : null;
  row.pat_margin =
    row.pat != null
      ? Math.round(((row.pat as number) / ti) * 10000) / 100
      : null;

  const { data, error } = await supabase
    .from("annual_reports")
    .update(row)
    .eq("fiscal_year", fiscalYear)
    .select("fiscal_year");
  if (error) {
    return { ok: false, message: `Update failed: ${error.message}` };
  }
  if (!data || data.length === 0) {
    return { ok: false, message: `${fiscalYear} not found.` };
  }

  revalidatePath("/investor-relations");
  return { ok: true, message: `Updated ${fiscalYear}.` };
}

/*
  Soft-delete a report — flips `is_deleted` so it drops off the site (admin list
  and public page) but the row + PDF stay in the DB for recovery. Revalidates
  the IR page on success.
*/
export async function deleteAnnualReport(
  fiscalYearRaw: string
): Promise<SubmitResult> {
  if (!isSupabaseAdminConfigured) {
    return {
      ok: false,
      message:
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    };
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, message: "Supabase client unavailable." };

  const fiscalYear = String(fiscalYearRaw ?? "").trim();
  if (!FY_RE.test(fiscalYear)) {
    return { ok: false, message: "Invalid fiscal year." };
  }

  const { data, error } = await supabase
    .from("annual_reports")
    .update({ is_deleted: true })
    .eq("fiscal_year", fiscalYear)
    .select("fiscal_year");
  if (error) {
    return { ok: false, message: `Delete failed: ${error.message}` };
  }
  if (!data || data.length === 0) {
    return { ok: false, message: `${fiscalYear} not found.` };
  }

  revalidatePath("/investor-relations");
  return { ok: true, message: `Deleted ${fiscalYear}.` };
}
