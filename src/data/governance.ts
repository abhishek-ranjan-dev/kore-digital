export type MemberCategory = "Executive" | "Non-Executive" | "Independent";

export interface BoardMember {
  name: string;
  designation: string;
  din: string;
  category: MemberCategory;
  qualifications: string;
  experience: string;
  since: string;
}

export interface Committee {
  name: string;
  mandatoryUnder: string;
  purpose: string;
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

export const boardMembers: BoardMember[] = [
  {
    name: "Mr. Vikram Agarwal",
    designation: "Chairman & Managing Director",
    din: "01234567",
    category: "Executive",
    qualifications: "B.Tech (IIT Delhi), MBA (IIM Ahmedabad)",
    experience: "25+ years in telecom infrastructure and capital markets.",
    since: "2017",
  },
  {
    name: "Ms. Priya Mehta",
    designation: "Executive Director & CFO",
    din: "02345678",
    category: "Executive",
    qualifications: "CA (ICAI), CFA",
    experience: "18+ years in project finance and infrastructure investment.",
    since: "2019",
  },
  {
    name: "Mr. Rajesh Nair",
    designation: "Non-Executive Director",
    din: "03456789",
    category: "Non-Executive",
    qualifications: "B.E. (Civil), M.Tech (VJTI Mumbai)",
    experience: "30+ years in large-scale infrastructure project execution.",
    since: "2020",
  },
  {
    name: "Dr. Sunita Kulkarni",
    designation: "Independent Director",
    din: "04567890",
    category: "Independent",
    qualifications: "Ph.D. (Computer Science, IIT Bombay)",
    experience: "20+ years in deep-tech research, AI/ML systems, and startup advisory.",
    since: "2021",
  },
  {
    name: "Mr. Hemant Desai",
    designation: "Independent Director",
    din: "05678901",
    category: "Independent",
    qualifications: "B.Com (Hons), FCA",
    experience: "22+ years in audit, risk management, and SEBI compliance.",
    since: "2021",
  },
  {
    name: "Ms. Kavita Rao",
    designation: "Independent Director",
    din: "06789012",
    category: "Independent",
    qualifications: "LLB (Mumbai University), CS (ICSI)",
    experience: "15+ years in corporate law, governance, and regulatory affairs.",
    since: "2022",
  },
];

export const committees: Committee[] = [
  {
    name: "Audit Committee",
    mandatoryUnder: "Section 177, Companies Act 2013 & SEBI LODR Reg. 18",
    purpose:
      "Oversight of financial reporting, internal audit, risk management, and statutory compliance.",
    chairman: "Mr. Hemant Desai",
    members: [
      "Mr. Hemant Desai",
      "Dr. Sunita Kulkarni",
      "Ms. Kavita Rao",
      "Ms. Priya Mehta",
    ],
  },
  {
    name: "Nomination & Remuneration Committee",
    mandatoryUnder: "Section 178, Companies Act 2013 & SEBI LODR Reg. 19",
    purpose:
      "Board succession planning, director/KMP appointment criteria, and remuneration policy formulation.",
    chairman: "Ms. Kavita Rao",
    members: [
      "Ms. Kavita Rao",
      "Dr. Sunita Kulkarni",
      "Mr. Hemant Desai",
      "Mr. Rajesh Nair",
    ],
  },
  {
    name: "Stakeholders Relationship Committee",
    mandatoryUnder: "Section 178, Companies Act 2013 & SEBI LODR Reg. 20",
    purpose:
      "Resolution of shareholder/investor grievances, transfer of shares, and investor service excellence.",
    chairman: "Mr. Rajesh Nair",
    members: ["Mr. Rajesh Nair", "Ms. Kavita Rao", "Ms. Priya Mehta"],
  },
  {
    name: "CSR Committee",
    mandatoryUnder: "Section 135, Companies Act 2013",
    purpose:
      "Formulation and monitoring of CSR policy, annual CSR budget allocation, and activity oversight.",
    chairman: "Dr. Sunita Kulkarni",
    members: [
      "Dr. Sunita Kulkarni",
      "Mr. Vikram Agarwal",
      "Ms. Priya Mehta",
    ],
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
