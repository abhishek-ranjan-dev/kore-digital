import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InvestorTabs from "@/components/InvestorTabs";
import { keyMetrics } from "@/data/financials";
import { Shield, Activity, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Investor Relations",
  description:
    "Kore Digital Limited investor relations hub — financial results, NSE stock exchange disclosures under Regulation 30, annual reports, corporate governance, and SEBI Regulation 46 compliance documents.",
};

const badges = [
  {
    icon: Activity,
    label: "NSE Listed",
    value: keyMetrics.ticker,
    color: "text-emerald-400",
    border: "border-emerald-400/25",
    bg: "bg-emerald-400/5",
  },
  {
    icon: Zap,
    label: "ISIN",
    value: keyMetrics.isin,
    color: "text-cyan-400",
    border: "border-cyan-400/25",
    bg: "bg-cyan-400/5",
  },
  {
    icon: Shield,
    label: "Regulation",
    value: "SEBI LODR 2015",
    color: "text-amber-400",
    border: "border-amber-400/25",
    bg: "bg-amber-400/5",
  },
];

export default function InvestorRelationsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-16">
        {/* Page hero */}
        <div className="bg-kd-surface border-b border-kd-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-6">
            {/* Breadcrumb */}
            <p className="text-slate-500 text-xs">
              <span className="hover:text-slate-300 transition-colors">
                Home
              </span>{" "}
              <span className="mx-2 text-slate-700">/</span>
              <span className="text-slate-300">Investor Relations</span>
            </p>

            <div className="space-y-3">
              <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase">
                NSE / SEBI Compliance Hub
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Investor Relations
              </h1>
              <p className="text-slate-400 leading-relaxed max-w-2xl">
                Access Kore Digital Limited&apos;s complete compliance
                repository — audited financial results, Regulation 30 stock
                exchange disclosures, annual reports, board composition, and all
                mandatory statutory policy documents under SEBI LODR Regulation
                46.
              </p>
            </div>

            {/* Listing badges */}
            <div className="flex flex-wrap gap-3">
              {badges.map((b) => {
                const Icon = b.icon;
                return (
                  <div
                    key={b.label}
                    className={`flex items-center gap-2.5 ${b.bg} border ${b.border} rounded-lg px-4 py-2.5`}
                  >
                    <Icon className={`w-4 h-4 ${b.color}`} />
                    <div>
                      <p className="text-slate-500 text-[10px] uppercase tracking-widest leading-none mb-0.5">
                        {b.label}
                      </p>
                      <p className={`font-mono font-bold text-sm ${b.color}`}>
                        {b.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Compliance disclaimer banner */}
        <div className="bg-amber-400/5 border-b border-amber-400/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <p className="text-amber-400/80 text-xs leading-relaxed">
              <strong className="text-amber-400">Regulatory Notice:</strong>{" "}
              All disclosures on this page are filed in compliance with SEBI
              (Listing Obligations and Disclosure Requirements) Regulations,
              2015. The information provided is for informational purposes only
              and does not constitute investment advice. Past performance is not
              indicative of future results.
            </p>
          </div>
        </div>

        {/* Main tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <InvestorTabs />
        </div>

        {/* Registrar information */}
        <div className="border-t border-kd-border bg-kd-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-slate-500 text-[10px] uppercase tracking-widest font-semibold">
                  Share Transfer Agent (STA / RTA)
                </p>
                <p className="text-white text-sm font-semibold">
                  KFin Technologies Limited
                </p>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Selenium Building, Tower B, Plot 31–32, Gachibowli,
                  Financial District, Hyderabad – 500 032
                </p>
                <p className="text-slate-400 text-xs">
                  Tel: +91 40 6716 2222
                </p>
                <a
                  href="https://www.kfintech.com"
                  className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.kfintech.com ↗
                </a>
              </div>
              <div className="space-y-2">
                <p className="text-slate-500 text-[10px] uppercase tracking-widest font-semibold">
                  Company Secretary & Compliance Officer
                </p>
                <p className="text-white text-sm font-semibold">
                  Ms. Kavita Rao (ACS)
                </p>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Kore Digital Limited<br />
                  Level 12, One BKC, Bandra Kurla Complex<br />
                  Mumbai – 400 051
                </p>
                <a
                  href="mailto:compliance@koredigital.in"
                  className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  compliance@koredigital.in
                </a>
              </div>
              <div className="space-y-2">
                <p className="text-slate-500 text-[10px] uppercase tracking-widest font-semibold">
                  Investor Grievance Redressal
                </p>
                <p className="text-slate-400 text-xs leading-relaxed">
                  For investor complaints, write to the Compliance Officer or
                  use the SEBI SCORES platform.
                </p>
                <a
                  href="https://scores.sebi.gov.in"
                  className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  SEBI SCORES Portal ↗
                </a>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  SEBI Toll Free Helpline: 1800 266 7575 / 1800 22 7575
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
