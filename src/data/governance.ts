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

export const policyDocuments: PolicyDocument[] = [
  {
    title: "Code of Conduct for Directors & Senior Management",
    mandatoryUnder: "SEBI LODR Regulation 17(5)",
    description:
      "Ethical standards and compliance obligations for the Board of Directors and Senior Management Personnel.",
    fileUrl: "/governance/code-of-conduct.pdf",
    lastUpdated: "April 2025",
  },
  {
    title: "Vigil Mechanism / Whistleblower Policy",
    mandatoryUnder: "Section 177(9), Companies Act 2013 & SEBI LODR Reg. 22",
    description:
      "Framework for reporting genuine concerns about unethical behavior, fraud, or governance violations.",
    fileUrl: "/governance/whistleblower-policy.pdf",
    lastUpdated: "April 2025",
  },
  {
    title: "Related Party Transaction (RPT) Policy",
    mandatoryUnder: "Section 188, Companies Act 2013 & SEBI LODR Reg. 23",
    description:
      "Policy governing identification, approval, and disclosure of transactions with related parties.",
    fileUrl: "/governance/rpt-policy.pdf",
    lastUpdated: "April 2025",
  },
  {
    title: "Policy on Preservation of Documents",
    mandatoryUnder: "SEBI LODR Regulation 9",
    description:
      "Guidelines on categorization and preservation timelines for corporate documents and records.",
    fileUrl: "/governance/document-preservation-policy.pdf",
    lastUpdated: "April 2025",
  },
  {
    title: "Policy for Determining Material Subsidiaries",
    mandatoryUnder: "SEBI LODR Regulation 16(1)(c)",
    description:
      "Framework to identify and categorize material subsidiaries based on prescribed financial thresholds.",
    fileUrl: "/governance/material-subsidiary-policy.pdf",
    lastUpdated: "April 2025",
  },
  {
    title: "Insider Trading Policy (PIT Regulations)",
    mandatoryUnder: "SEBI PIT Regulations 2015",
    description:
      "Policy to prevent insider trading and regulate trading by designated persons in company securities.",
    fileUrl: "/governance/insider-trading-policy.pdf",
    lastUpdated: "April 2025",
  },
];
