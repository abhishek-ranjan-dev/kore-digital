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
  /**
   * Absolute public path to the mirrored PDF filing.
   * Empty string means "on record with the exchange but the PDF is
   * not yet mirrored locally" — the UI shows this as an on-portal note
   * rather than rendering a broken download link.
   */
  fileUrl: string;
  exchange: "NSE" | "BSE" | "NSE & BSE";
}

/*
  ── NSE / Regulation 30 disclosures ─────────────────────────────────
  Only real filings — either mirrored as a PDF under `public/pdf-docs/`
  or authoritatively recorded by the Company Secretary. No fabricated
  entries. Ordered newest → oldest.

  Add new items via the /admin console (Upload → NSE Disclosure) or
  hand-edit this array once the source PDF is on the server.
*/
export const disclosures: Disclosure[] = [
  {
    id: "reg30-h2fy26-investor-presentation",
    title:
      "Disclosure under Regulation 30 — H2 FY26 Investor Presentation",
    date: "2026-06-15",
    category: "Investor Presentation",
    fileUrl: "",
    exchange: "NSE",
  },
  {
    id: "analyst-meet-conf-call-aug2025",
    title:
      "Analyst / Institutional Investor Meet — Conference Call Updates",
    date: "2025-08-15",
    category: "Analyst Meet",
    fileUrl: "",
    exchange: "NSE",
  },
  {
    id: "nse-analyst-meet-tigerassets-jun2024",
    title: "Intimation of Analyst / Investor Meet with Tiger Assets",
    date: "2024-06-12",
    category: "Analyst Meet",
    fileUrl: "/pdf-docs/nse-disclosures/NSE_Update_12062024.pdf",
    exchange: "NSE",
  },
];
