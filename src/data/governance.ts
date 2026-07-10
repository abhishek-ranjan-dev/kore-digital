export type MemberCategory = "Executive" | "Non-Executive" | "Independent";

export interface BoardMember {
  name: string;
  designation: string;
  category: MemberCategory;
  /** Optional: real DIN when known. Empty/undefined otherwise. */
  din?: string;
  qualifications?: string;
  experience?: string;
  since?: string;
}

export interface Committee {
  name: string;
  mandatoryUnder: string;
  /** Full statutory purpose text — used in drawer/detail views. */
  purpose: string;
  /** Short one-line description for dense grid layouts. */
  shortBlurb: string;
  chairman: string;
  members: string[];
}

export interface PolicyDocument {
  title: string;
  mandatoryUnder: string;
  description: string;
  fileUrl: string;
  lastUpdated: string;
}

/*
  ── Board of Directors ──────────────────────────────────────────────
  Names and designations are the actual composition disclosed by the
  Company. DINs, qualifications, experience, and appointment dates
  are omitted (optional fields) — populate from the Board's official
  register when those primary sources are available; do not fabricate.
*/
export const boardMembers: BoardMember[] = [
  {
    name: "Mr. Ravindra Doshi",
    designation: "Chairman & Managing Director",
    category: "Executive",
  },
  {
    name: "Mr. Chaitanya Doshi",
    designation: "Executive Director & CEO",
    category: "Executive",
  },
  {
    name: "Ms. Kashmira Doshi",
    designation: "Executive Director & CFO",
    category: "Executive",
  },
  {
    name: "Mr. Ajeet Kadam",
    designation: "Non-Executive Independent Director",
    category: "Independent",
  },
  {
    name: "Ms. Ruchi Gupta",
    designation: "Non-Executive Independent Director",
    category: "Independent",
  },
  {
    name: "Ms. Nishtha Pamnani",
    designation: "Additional Non-Executive Independent Director",
    category: "Independent",
  },
];

/*
  ── Statutory Committees ────────────────────────────────────────────
  The 4 mandatory committees under the Companies Act 2013 and SEBI
  LODR. `shortBlurb` powers the dense governance grid. Chairman and
  members are left empty until the Board's committee-composition
  minutes are on record — the dense grid does not render them.
*/
export const committees: Committee[] = [
  {
    name: "Audit Committee",
    mandatoryUnder: "Section 177, Companies Act 2013 & SEBI LODR Reg. 18",
    purpose:
      "Oversight of financial reporting, internal audit, risk management, and statutory compliance.",
    shortBlurb: "Financial reporting and internal oversight.",
    chairman: "",
    members: [],
  },
  {
    name: "Nomination & Remuneration Committee",
    mandatoryUnder: "Section 178, Companies Act 2013 & SEBI LODR Reg. 19",
    purpose:
      "Board succession planning, director/KMP appointment criteria, and remuneration policy formulation.",
    shortBlurb: "Board appointments and evaluations.",
    chairman: "",
    members: [],
  },
  {
    name: "Stakeholders Relationship Committee",
    mandatoryUnder: "Section 178, Companies Act 2013 & SEBI LODR Reg. 20",
    purpose:
      "Resolution of shareholder/investor grievances, transfer of shares, and investor service excellence.",
    shortBlurb: "Investor grievance and share transfers.",
    chairman: "",
    members: [],
  },
  {
    name: "CSR Committee",
    mandatoryUnder: "Section 135, Companies Act 2013",
    purpose:
      "Formulation and monitoring of CSR policy, annual CSR budget allocation, and activity oversight.",
    shortBlurb: "Corporate Social Responsibility frameworks.",
    chairman: "",
    members: [],
  },
];

/*
  ── Statutory policy repository ─────────────────────────────────────
  Every entry below is backed by a real PDF living under
  `public/documents/policies/`. The order roughly reflects governance
  hierarchy — foundational codes of conduct first, then compliance
  frameworks, then workplace policies.

  `lastUpdated` is set to "Current version" universally because the
  underlying PDFs don't carry a consistent revision date at their
  head. Update on a per-policy basis if/when board minutes provide it.
*/
export const policyDocuments: PolicyDocument[] = [
  {
    title: "Code of Conduct for Senior Management Personnel",
    mandatoryUnder: "SEBI LODR Regulation 17(5)",
    description:
      "Ethical standards and compliance obligations binding on the Board of Directors and Senior Management Personnel.",
    fileUrl:
      "/documents/policies/6.-Code-of-Conduct-for-Sr-Mgnt-Persnel-1.pdf",
    lastUpdated: "Current version",
  },
  {
    title: "Code of Conduct for Independent Directors",
    mandatoryUnder: "Schedule IV, Companies Act 2013",
    description:
      "Guidelines governing the role, responsibilities, and duties of Independent Directors on the Board.",
    fileUrl: "/documents/policies/7.-Code-For-Independent-Directors-1.pdf",
    lastUpdated: "Current version",
  },
  {
    title: "Nomination & Remuneration Policy",
    mandatoryUnder: "Section 178, Companies Act 2013 & SEBI LODR Reg. 19",
    description:
      "Framework for identifying persons qualified for appointment as directors and KMP, and for determining their remuneration.",
    fileUrl: "/documents/policies/11.-Nomination-and-Remuneration-Policy.pdf",
    lastUpdated: "Current version",
  },
  {
    title: "Related Party Transaction Policy",
    mandatoryUnder: "Section 188, Companies Act 2013 & SEBI LODR Reg. 23",
    description:
      "Policy governing identification, approval, and disclosure of transactions with related parties.",
    fileUrl:
      "/documents/policies/8.-Related-Party-Transaction-Policy-1.pdf",
    lastUpdated: "Current version",
  },
  {
    title: "Vigil Mechanism / Whistle-Blower Policy",
    mandatoryUnder: "Section 177(9), Companies Act 2013 & SEBI LODR Reg. 22",
    description:
      "Framework for reporting genuine concerns about unethical behaviour, fraud, or governance violations without fear of retaliation.",
    fileUrl: "/documents/policies/10.-Whistle-Blower-Policy-1.pdf",
    lastUpdated: "Current version",
  },
  {
    title:
      "Code of Conduct for Insider Trading & Legitimate Purpose of UPSI",
    mandatoryUnder: "SEBI (Prohibition of Insider Trading) Regulations, 2015",
    description:
      "Policy preventing insider trading and regulating the sharing of Unpublished Price Sensitive Information (UPSI) by designated persons.",
    fileUrl:
      "/documents/policies/1.-Code-of-Conduct-for-Insider-Trading-and-Legitimate-Purpose-of-UPSI-KORE.pdf",
    lastUpdated: "Current version",
  },
  {
    title: "Risk Management Policy",
    mandatoryUnder: "SEBI LODR Regulation 21",
    description:
      "Framework for identifying, assessing, mitigating, and monitoring key risks across the organisation.",
    fileUrl: "/documents/policies/9.-Risk-Management-Policy-1.pdf",
    lastUpdated: "Current version",
  },
  {
    title: "Policy for Determining Materiality of Events",
    mandatoryUnder: "SEBI LODR Regulation 30",
    description:
      "Criteria used to determine which events and information warrant disclosure to the stock exchanges.",
    fileUrl:
      "/documents/policies/4.-Policy-for-Determining-Materiality-of-Events-1.pdf",
    lastUpdated: "Current version",
  },
  {
    title: "Policy on Preservation of Documents",
    mandatoryUnder: "SEBI LODR Regulation 9",
    description:
      "Guidelines on categorisation and preservation timelines for corporate documents and records.",
    fileUrl:
      "/documents/policies/5.-Policy-for-Preservation-of-Documents-1.pdf",
    lastUpdated: "Current version",
  },
  {
    title: "Prevention of Sexual Harassment (POSH) Policy",
    mandatoryUnder:
      "Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013",
    description:
      "Zero-tolerance framework for prevention and redressal of sexual harassment at the workplace, including the Internal Complaints Committee constitution.",
    fileUrl:
      "/documents/policies/3.-Prevention-of-Sexual-Harressment-Policy-1.pdf",
    lastUpdated: "Current version",
  },
];
