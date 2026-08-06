import {
  financials as seedStandalone,
  type FinancialYear,
} from "@/data/financials";

/*
  Pure financial-data helpers — NO Supabase import, safe for client components.
  Holds the types, the seed rows/payload (fallback), and the derivation that
  turns raw `annual_reports` rows into the two shapes the IR page needs.
  The server-only Supabase read lives in `@/lib/financials`.

  One row per fiscal year holds BOTH bases (standalone + consolidated), each
  nullable. Growth %/deltas are DERIVED here (never stored), preserving the old
  data-discipline: a % only exists when the prior year is held.
*/
export type { FinancialYear };

/** Mirrors the `annual_reports` table (snake_case columns → camelCase). */
export interface RawFinancialRow {
  fiscalYear: string; // "FY24-25"
  fiscalYearEnd: string | null; // ISO date
  revenue: number | null;
  netWorth: number | null;
  longTermBorrowings: number | null;
  workInProgress: number | null;
  totalIncome: number | null;
  operationalEbitda: number | null;
  pat: number | null;
  ebitdaMargin: number | null;
  patMargin: number | null;
  pdfUrl: string | null;
  isProjected: boolean;
}

export interface ConsolidatedDeltas {
  totalIncome: number | null;
  operationalEbitda: number | null;
  pat: number | null;
}

export interface LatestConsolidated {
  fiscalYear: string;
  yearEndedLabel: string; // "year ended 31 March 2025"
  totalIncome: number;
  operationalEbitda: number;
  pat: number;
  ebitdaMargin: number | null;
  patMargin: number | null;
  deltas: ConsolidatedDeltas;
}

export interface FinancialsPayload {
  financials: FinancialYear[];
  latestConsolidated: LatestConsolidated | null;
  source: "supabase" | "seed";
}

/* ── Seed (fallback) ─────────────────────────────────────────────────────
   Consolidated figures the static `financials.ts` doesn't carry — the FY23-24
   comparatives and the FY24-25 headline that today live hardcoded on the
   IR/About pages. Used only when Supabase is unconfigured. */
type ConsolidatedSeed = Pick<
  RawFinancialRow,
  "totalIncome" | "operationalEbitda" | "pat" | "ebitdaMargin" | "patMargin"
>;

const CONSOLIDATED_SEED: Record<string, ConsolidatedSeed> = {
  "FY23-24": {
    totalIncome: 105.08,
    operationalEbitda: 17.08,
    pat: 11.49,
    ebitdaMargin: null,
    patMargin: null,
  },
  "FY24-25": {
    totalIncome: 327.82,
    operationalEbitda: 47.55,
    pat: 31.7,
    ebitdaMargin: 14.5,
    patMargin: 9.67,
  },
};

function fiscalYearEndFromLabel(fy: string): string | null {
  const m = fy.match(/FY(\d{2})-(\d{2})/);
  if (!m) return null;
  return `20${m[2]}-03-31`;
}

const SEED_ROWS: RawFinancialRow[] = (() => {
  const byYear = new Map<string, RawFinancialRow>();
  for (const f of seedStandalone) {
    byYear.set(f.year, {
      fiscalYear: f.year,
      fiscalYearEnd: fiscalYearEndFromLabel(f.year),
      revenue: f.revenue,
      netWorth: f.netWorth,
      longTermBorrowings: f.longTermBorrowings,
      workInProgress: f.workInProgress,
      totalIncome: null,
      operationalEbitda: null,
      pat: null,
      ebitdaMargin: null,
      patMargin: null,
      pdfUrl: f.annualReportUrl || null,
      isProjected: f.isProjected,
    });
  }
  for (const [year, c] of Object.entries(CONSOLIDATED_SEED)) {
    const existing =
      byYear.get(year) ??
      ({
        fiscalYear: year,
        fiscalYearEnd: fiscalYearEndFromLabel(year),
        revenue: null,
        netWorth: null,
        longTermBorrowings: null,
        workInProgress: null,
        totalIncome: null,
        operationalEbitda: null,
        pat: null,
        ebitdaMargin: null,
        patMargin: null,
        pdfUrl: null,
        isProjected: false,
      } satisfies RawFinancialRow);
    byYear.set(year, { ...existing, ...c });
  }
  return [...byYear.values()];
})();

/* ── Derivation ──────────────────────────────────────────────────────── */

const round = (n: number, d = 2) => {
  const p = 10 ** d;
  return Math.round(n * p) / p;
};

function pctChange(cur: number | null, prev: number | null): number | null {
  if (cur == null || prev == null || prev === 0) return null;
  return round(((cur - prev) / Math.abs(prev)) * 100, 1);
}

function yearEndedLabel(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return "";
  const month = d.toLocaleString("en-GB", { month: "long", timeZone: "UTC" });
  return `year ended ${d.getUTCDate()} ${month} ${d.getUTCFullYear()}`;
}

export function deriveFinancials(
  rows: RawFinancialRow[],
  source: "supabase" | "seed"
): FinancialsPayload {
  const sorted = [...rows].sort(
    (a, b) =>
      (a.fiscalYearEnd ?? "").localeCompare(b.fiscalYearEnd ?? "") ||
      a.fiscalYear.localeCompare(b.fiscalYear)
  );

  const standalone = sorted.filter((r) => r.revenue != null);
  const financials: FinancialYear[] = standalone.map((r, i) => {
    const prev = standalone[i - 1];
    return {
      year: r.fiscalYear,
      revenue: r.revenue,
      revenueGrowth: prev ? pctChange(r.revenue, prev.revenue) : null,
      longTermBorrowings: r.longTermBorrowings,
      workInProgress: r.workInProgress,
      netWorth: r.netWorth,
      annualReportUrl: r.pdfUrl ?? "",
      isProjected: r.isProjected,
    };
  });

  const consolidated = sorted.filter((r) => r.totalIncome != null);
  let latestConsolidated: LatestConsolidated | null = null;
  if (consolidated.length > 0) {
    const cur = consolidated[consolidated.length - 1];
    const prev = consolidated[consolidated.length - 2];
    const ti = cur.totalIncome as number;
    latestConsolidated = {
      fiscalYear: cur.fiscalYear,
      yearEndedLabel: yearEndedLabel(cur.fiscalYearEnd),
      totalIncome: ti,
      operationalEbitda: cur.operationalEbitda ?? 0,
      pat: cur.pat ?? 0,
      ebitdaMargin:
        cur.ebitdaMargin ??
        (cur.operationalEbitda != null && ti
          ? round((cur.operationalEbitda / ti) * 100, 2)
          : null),
      patMargin:
        cur.patMargin ??
        (cur.pat != null && ti ? round((cur.pat / ti) * 100, 2) : null),
      deltas: {
        totalIncome: prev ? pctChange(cur.totalIncome, prev.totalIncome) : null,
        operationalEbitda: prev
          ? pctChange(cur.operationalEbitda, prev.operationalEbitda)
          : null,
        pat: prev ? pctChange(cur.pat, prev.pat) : null,
      },
    };
  }

  return { financials, latestConsolidated, source };
}

/** Synchronous seed payload — the client's initial state. */
export const SEED_PAYLOAD: FinancialsPayload = deriveFinancials(
  SEED_ROWS,
  "seed"
);

/** Maps a raw DB row (snake_case) to `RawFinancialRow`. Pure. */
export function mapDbRow(r: Record<string, unknown>): RawFinancialRow {
  const num = (v: unknown) => (v == null ? null : Number(v));
  return {
    fiscalYear: String(r.fiscal_year),
    fiscalYearEnd: r.fiscal_year_end ? String(r.fiscal_year_end) : null,
    revenue: num(r.revenue),
    netWorth: num(r.net_worth),
    longTermBorrowings: num(r.long_term_borrowings),
    workInProgress: num(r.work_in_progress),
    totalIncome: num(r.total_income),
    operationalEbitda: num(r.operational_ebitda),
    pat: num(r.pat),
    ebitdaMargin: num(r.ebitda_margin),
    patMargin: num(r.pat_margin),
    pdfUrl: r.pdf_url ? String(r.pdf_url) : null,
    isProjected: Boolean(r.is_projected),
  };
}
