export type DisclosureCategory =
  | "Board Meeting"
  | "Financial Results"
  | "Analyst Meet"
  | "Newspaper Ad"
  | "Material Update"
  | "AGM / EGM"
  | "Investor Presentation"
  | "Shareholding Pattern"
  | "Corporate Action";

export interface Disclosure {
  id: string;
  title: string;
  date: string;
  category: DisclosureCategory;
  fileUrl: string;
  exchange: "NSE" | "BSE" | "NSE & BSE";
}

export const disclosures: Disclosure[] = [
  {
    id: "D001",
    title: "Outcome of Board Meeting — Q3 FY25-26 Financial Results",
    date: "2026-01-30",
    category: "Financial Results",
    fileUrl: "/disclosures/D001-board-outcome-q3-fy2526.pdf",
    exchange: "NSE",
  },
  {
    id: "D002",
    title: "Notice of Board Meeting scheduled for 30 January 2026",
    date: "2026-01-23",
    category: "Board Meeting",
    fileUrl: "/disclosures/D002-board-meeting-notice-jan2026.pdf",
    exchange: "NSE",
  },
  {
    id: "D003",
    title: "Newspaper Advertisement — Financial Results Publication (Q3 FY25-26)",
    date: "2026-01-31",
    category: "Newspaper Ad",
    fileUrl: "/disclosures/D003-newspaper-ad-q3-fy2526.pdf",
    exchange: "NSE & BSE",
  },
  {
    id: "D004",
    title: "Investor Presentation — AI Datacenter Hub, NAINA Mumbai Project Update",
    date: "2025-12-15",
    category: "Investor Presentation",
    fileUrl: "/disclosures/D004-investor-presentation-datacenter-dec2025.pdf",
    exchange: "NSE",
  },
  {
    id: "D005",
    title: "Shareholding Pattern for quarter ending 31 December 2025",
    date: "2026-01-10",
    category: "Shareholding Pattern",
    fileUrl: "/disclosures/D005-shareholding-pattern-q3-fy2526.pdf",
    exchange: "NSE",
  },
  {
    id: "D006",
    title: "Outcome of Board Meeting — Q2 FY25-26 Financial Results",
    date: "2025-10-29",
    category: "Financial Results",
    fileUrl: "/disclosures/D006-board-outcome-q2-fy2526.pdf",
    exchange: "NSE",
  },
  {
    id: "D007",
    title: "Notice of Analyst Meet — Business Update & Q2 FY25-26 Performance",
    date: "2025-11-10",
    category: "Analyst Meet",
    fileUrl: "/disclosures/D007-analyst-meet-nov2025.pdf",
    exchange: "NSE",
  },
  {
    id: "D008",
    title: "Material Update — Award of Phase-2 Fiber Rollout Contract (₹480 Crores)",
    date: "2025-09-18",
    category: "Material Update",
    fileUrl: "/disclosures/D008-material-update-phase2-contract-sep2025.pdf",
    exchange: "NSE",
  },
  {
    id: "D009",
    title: "Outcome of Annual General Meeting — FY24-25",
    date: "2025-08-27",
    category: "AGM / EGM",
    fileUrl: "/disclosures/D009-agm-outcome-fy2425.pdf",
    exchange: "NSE",
  },
  {
    id: "D010",
    title: "Notice of 8th Annual General Meeting — FY24-25",
    date: "2025-08-05",
    category: "AGM / EGM",
    fileUrl: "/disclosures/D010-agm-notice-fy2425.pdf",
    exchange: "NSE",
  },
  {
    id: "D011",
    title: "Outcome of Board Meeting — Q1 FY25-26 Financial Results",
    date: "2025-07-29",
    category: "Financial Results",
    fileUrl: "/disclosures/D011-board-outcome-q1-fy2526.pdf",
    exchange: "NSE",
  },
  {
    id: "D012",
    title: "Material Update — MoU signed for 1 GW AI Datacenter Development, NAINA Mumbai",
    date: "2025-06-12",
    category: "Material Update",
    fileUrl: "/disclosures/D012-material-update-datacenter-mou-jun2025.pdf",
    exchange: "NSE",
  },
  {
    id: "D013",
    title: "Investor Presentation — Annual Analyst Day FY24-25",
    date: "2025-05-22",
    category: "Investor Presentation",
    fileUrl: "/disclosures/D013-investor-presentation-analyst-day-may2025.pdf",
    exchange: "NSE",
  },
  {
    id: "D014",
    title: "Outcome of Board Meeting — Q4 & Full Year FY24-25 Financial Results",
    date: "2025-04-30",
    category: "Financial Results",
    fileUrl: "/disclosures/D014-board-outcome-q4-fy2425.pdf",
    exchange: "NSE",
  },
  {
    id: "D015",
    title: "Corporate Action — Bonus Share Issue (1:2 ratio), Record Date 15 March 2025",
    date: "2025-02-28",
    category: "Corporate Action",
    fileUrl: "/disclosures/D015-corporate-action-bonus-shares-mar2025.pdf",
    exchange: "NSE",
  },
  {
    id: "D016",
    title: "Shareholding Pattern for quarter ending 30 September 2025",
    date: "2025-10-14",
    category: "Shareholding Pattern",
    fileUrl: "/disclosures/D016-shareholding-pattern-q2-fy2526.pdf",
    exchange: "NSE",
  },
  {
    id: "D017",
    title: "Material Update — Commencement of IIT Bombay SINE Incubation for Metal 3D Printing Division",
    date: "2024-11-08",
    category: "Material Update",
    fileUrl: "/disclosures/D017-material-update-iit-bombay-sine-nov2024.pdf",
    exchange: "NSE",
  },
];
