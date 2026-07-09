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

export const financials: FinancialYear[] = [
  {
    year: "FY19-20",
    revenue: 12.4,
    revenueGrowth: null,
    longTermBorrowings: 45.2,
    workInProgress: 38.1,
    netWorth: 28.6,
    annualReportUrl: "/reports/kore-digital-annual-report-fy2020.pdf",
    isProjected: false,
  },
  {
    year: "FY20-21",
    revenue: 8.7,
    revenueGrowth: -29.8,
    longTermBorrowings: 67.8,
    workInProgress: 52.3,
    netWorth: 31.2,
    annualReportUrl: "/reports/kore-digital-annual-report-fy2021.pdf",
    isProjected: false,
  },
  {
    year: "FY21-22",
    revenue: 34.2,
    revenueGrowth: 293.1,
    longTermBorrowings: 124.5,
    workInProgress: 187.6,
    netWorth: 58.4,
    annualReportUrl: "/reports/kore-digital-annual-report-fy2022.pdf",
    isProjected: false,
  },
  {
    year: "FY22-23",
    revenue: 89.4,
    revenueGrowth: 161.4,
    longTermBorrowings: 287.3,
    workInProgress: 453.8,
    netWorth: 127.6,
    annualReportUrl: "/reports/kore-digital-annual-report-fy2023.pdf",
    isProjected: false,
  },
  {
    year: "FY23-24",
    revenue: 167.8,
    revenueGrowth: 87.7,
    longTermBorrowings: 412.6,
    workInProgress: 734.2,
    netWorth: 243.8,
    annualReportUrl: "/reports/kore-digital-annual-report-fy2024.pdf",
    isProjected: false,
  },
  {
    year: "FY24-25",
    revenue: 243.5,
    revenueGrowth: 45.1,
    longTermBorrowings: 534.1,
    workInProgress: 1124.8,
    netWorth: 412.3,
    annualReportUrl: "/reports/kore-digital-annual-report-fy2025.pdf",
    isProjected: false,
  },
  {
    year: "FY25-26",
    revenue: null,
    revenueGrowth: null,
    longTermBorrowings: null,
    workInProgress: 1543.7,
    netWorth: null,
    annualReportUrl: "/reports/kore-digital-annual-report-fy2026.pdf",
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
