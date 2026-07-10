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
  Only years for which we hold a primary annual-report PDF are listed.
  Every figure is extracted verbatim from the audited Balance Sheet or
  Statement of Profit & Loss in the referenced PDF and converted to
  ₹ Crores (2 decimals).

  Source map:
    FY19-20  →  Annual-Report_2019-20.pdf                (as Kore Digital Pvt Ltd)
    FY21-22  →  Annual-Report_2021-22.pdf
    FY22-23  →  KDL_Annual-Report-2.0.pdf                 (standalone)
    FY23-24  →  KDL_Annual-Report_2024.pdf                (standalone)

  Notes:
    • YoY growth is only populated when the previous year is ALSO on
      this list (i.e. we hold its primary report). FY19-20 and FY21-22
      have their growth as null because we don't hold the FY18-19 or
      FY20-21 primary reports — even though those years appear as
      comparatives inside the newer reports, we treat comparatives as
      secondary data and don't derive growth from them here.
    • FY21-22 and FY22-23 balance sheets do NOT itemise Work-in-Progress
      as a separate line, so those cells are null.
    • Long-term borrowings for FY19-20 shown as "Nil" (private-limited
      stage) — recorded as 0.
    • FY23-24 has a large ₹24.45 Cr WIP consistent with the Samruddhi
      Mahamarg fibre-deployment stage of that year.
*/
export const financials: FinancialYear[] = [
  {
    year: "FY19-20",
    revenue: 0.88,
    revenueGrowth: null,
    longTermBorrowings: 0.00,
    workInProgress: 1.84,
    netWorth: 0.08,
    annualReportUrl: "/documents/annual-reports/Annual-Report_2019-20.pdf",
    isProjected: false,
  },
  {
    year: "FY21-22",
    revenue: 16.94,
    revenueGrowth: null,
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
];

export const keyMetrics = {
  totalOrderBook: "₹1,500+ Cr",
  fiberKmDeployed: "701 km",
  datacenterCapacity: "1 GW",
  listingExchange: "NSE",
  isin: "INE0KDL01021",
  ticker: "KOREDIGIT",
};
