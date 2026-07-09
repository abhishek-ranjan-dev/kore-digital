export interface TimelineMedia {
  /** Absolute public path to the mp4 (or other browser-supported video). */
  src: string;
  /** Optional display duration string, e.g. "2:42". Omit if unknown — the
   * embedded <video> controls will still show the real duration. */
  duration?: string;
  /** Optional caption rendered above the player. */
  caption?: string;
  /** Optional poster image path. */
  poster?: string;
}

export interface TimelineDocument {
  /** Absolute public path to the PDF. */
  src: string;
  /** File name shown on the attachment card (e.g. "NSE_Update_12062024.pdf"). */
  fileName: string;
  /** Human-readable descriptor (e.g. "NSE Intimation · Regulation 30(6)"). */
  label: string;
  /** Optional reference number, e.g. "KDL/11/2024-25/NSE". */
  reference?: string;
  /** Optional pretty-printed size, e.g. "250 KB". */
  fileSize?: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  category: "Project Milestone" | "Corporate" | "Operational";
  pillar: "Telecom" | "Compute" | "Deep-Tech" | "General";
  description: string;
  status: "Completed" | "In Progress" | "Upcoming";
  video?: TimelineMedia;
  document?: TimelineDocument;
}

/**
 * timelineUpdates
 * ────────────────
 * Ordered from most recent → oldest so the timeline component can render
 * without a runtime sort. Only officially-sourced events belong here — do
 * not add events without a public disclosure or verified project record.
 */
export const timelineUpdates: TimelineEvent[] = [
  {
    id: "sam-3",
    date: "25 June 2025",
    title: "OFC Duct Phase 1 — Amne Interchange Progress",
    category: "Project Milestone",
    pillar: "Telecom",
    description:
      "OFC underground duct phase 1, patch of work in progress at Amne Interchange connecting point to Mumbai.",
    status: "In Progress",
    video: {
      src: "/videos/updates/samruddhi-amne-duct-phase1-2025-06-25.mp4",
      caption: "Field footage — Amne Interchange, Phase 1 duct works",
    },
  },
  {
    id: "sam-1",
    date: "18 June 2025",
    title: "Amne Interchange Connection Works",
    category: "Project Milestone",
    pillar: "Telecom",
    description:
      "OFC duct laying work being done near Amne interchange entry point from Mumbai. We expect the 1st phase up to Shirdi to be completed before end of 2025 and start generating revenue.",
    status: "In Progress",
    video: {
      src: "/videos/updates/samruddhi-amne-interchange-2025-06.mp4",
      duration: "2:42",
      caption: "Field footage — OFC duct laying, Amne Interchange",
    },
  },
  {
    id: "nse-analyst-meet-jun2024",
    date: "12 June 2024",
    title: "Intimation of Analyst/Investor Meet with Tiger Assets",
    category: "Corporate",
    pillar: "General",
    description:
      "Filed with NSE under Regulation 30(6) read with Para A of Schedule III of SEBI (LODR) Regulations, 2015 — intimation of a virtual management interaction with Tiger Assets scheduled for Sunday, 16 June 2024 at 11:00 AM. Discussions were confirmed to be based on generally available information, with no Unpublished Price Sensitive Information involved.",
    status: "Completed",
    document: {
      src: "/pdf-docs/nse-disclosures/NSE_Update_12062024.pdf",
      fileName: "NSE_Update_12062024.pdf",
      label: "NSE Intimation · SEBI LODR Regulation 30(6)",
      reference: "KDL/11/2024-25/NSE",
      fileSize: "250 KB",
    },
  },
];
