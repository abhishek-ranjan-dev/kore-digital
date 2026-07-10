export interface FinancialYear {
  year: string;
  revenue: number | null;
  revenueGrowth: number | null;
  longTermBorrowings: number | null;
  workInProgress: number | null;
  netWorth: number | null;
  annualReportUrl: string;
  isProjected: boolean;
}

/*
  ── Historical financials ─────────────────────────────────────────────
  Extracted verbatim from Kore Digital Limited's own annual reports
  living under `public/documents/annual-reports/`. Every figure below
  is sourced from the audited Balance Sheet or Statement of Profit &
  Loss in the referenced PDF, converted to ₹ Crores (2 decimals).

  Source map:
    FY18-19  →  comparatives in Annual-Report_2019-20.pdf
    FY19-20  →  Annual-Report_2019-20.pdf                (as Kore Digital Pvt Ltd)
    FY20-21  →  comparatives in Annual-Report_2021-22.pdf
    FY21-22  →  Annual-Report_2021-22.pdf
    FY22-23  →  KDL_Annual-Report-2.0.pdf                 (standalone)
    FY23-24  →  KDL_Annual-Report_2024.pdf                (standalone)
    FY24-25  →  audited annual report not yet released
    FY25-26  →  current year, not yet closed

  Notes:
    • FY19-20 and FY18-19 figures appeared in the report in rupees
      (₹ 43,54,919 style) — converted to Crores here.
    • FY21-22 and FY22-23 balance sheets do NOT itemise Work-in-Progress;
      those cells are null rather than zero.
    • Long-term borrowings for FY18-19 and FY19-20 shown as "Nil" in
      the report (private-limited stage) — recorded as 0.
    • FY23-24 has a large ₹24.45 Cr WIP consistent with the Samruddhi
      Mahamarg fibre-deployment stage of that year.
    • YoY growth computed from the raw figures with 1 decimal precision.
*/
export const financials: FinancialYear[] = [
  {
    year: "FY18-19",
    revenue: 0.44,
    revenueGrowth: null,
    longTermBorrowings: 0.00,
    workInProgress: 0.03,
    netWorth: 0.06,
    annualReportUrl: "/documents/annual-reports/Annual-Report_2019-20.pdf",
    isProjected: false,
  },
  {
    year: "FY19-20",
    revenue: 0.88,
    revenueGrowth: 101.2,
    longTermBorrowings: 0.00,
    workInProgress: 1.84,
    netWorth: 0.08,
    annualReportUrl: "/documents/annual-reports/Annual-Report_2019-20.pdf",
    isProjected: false,
  },
  {
    year: "FY20-21",
    revenue: 3.98,
    revenueGrowth: 354.1,
    longTermBorrowings: 0.22,
    workInProgress: null,
    netWorth: 0.34,
    annualReportUrl: "/documents/annual-reports/Annual-Report_2021-22.pdf",
    isProjected: false,
  },
  {
    year: "FY21-22",
    revenue: 16.94,
    revenueGrowth: 325.6,
    longTermBorrowings: 0.18,
    workInProgress: null,
    netWorth: 2.52,
    annualReportUrl: "/documents/annual-reports/Annual-Report_2021-22.pdf",
    isProjected: false,
  },
  {
    year: "FY22-23",
    revenue: 21.27,
    revenueGrowth: 25.6,
    longTermBorrowings: 1.75,
    workInProgress: null,
    netWorth: 5.74,
    annualReportUrl: "/documents/annual-reports/KDL_Annual-Report-2.0.pdf",
    isProjected: false,
  },
  {
    year: "FY23-24",
    revenue: 103.51,
    revenueGrowth: 386.7,
    longTermBorrowings: 0.11,
    workInProgress: 24.45,
    netWorth: 74.77,
    annualReportUrl: "/documents/annual-reports/KDL_Annual-Report_2024.pdf",
    isProjected: false,
  },
  {
    year: "FY24-25",
    revenue: null,
    revenueGrowth: null,
    longTermBorrowings: null,
    workInProgress: null,
    netWorth: null,
    annualReportUrl: "",
    isProjected: true,
  },
  {
    year: "FY25-26",
    revenue: null,
    revenueGrowth: null,
    longTermBorrowings: null,
    workInProgress: null,
    netWorth: null,
    annualReportUrl: "",
    isProjected: true,
  },
];

export const keyMetrics = {
  totalOrderBook: "₹1,500+ Cr",
  fiberKmDeployed: "701 km",
  datacenterCapacity: "1 GW",
  listingExchange: "NSE",
  isin: "INE0KDL01021",
  ticker: "KOREDIGIT",
};
