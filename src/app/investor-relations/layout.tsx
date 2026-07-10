import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investor Relations",
  description:
    "Kore Digital Limited investor relations hub — consolidated scale metrics, financial results, NSE stock exchange disclosures under Regulation 30, annual reports, and corporate governance documents filed under SEBI LODR Regulation 46.",
};

export default function InvestorRelationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
