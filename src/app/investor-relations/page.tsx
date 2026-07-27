"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Building2,
  ShieldCheck,
  LifeBuoy,
  ArrowUpRight,
  FileText,
  X,
  Download,
  ExternalLink,
  Users,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/motion/Reveal";
import SectionBadge from "@/components/ui/SectionBadge";
import StatBlock from "@/components/ui/StatBlock";
import BentoCard from "@/components/ui/BentoCard";
import {
  financials,
  keyMetrics,
  type FinancialYear,
} from "@/data/financials";
import {
  boardMembers,
  committees,
  policyDocuments,
  type PolicyDocument,
} from "@/data/governance";

/* ─── Statutory policy taxonomy ─────────────────────────────────────
   Groups the 10 mandatory policies into 3 audit-friendly buckets by
   subject area. Matching is by case-insensitive title substring so
   new policies can be added to governance.ts and slotted in by
   choosing a title containing one of the keywords.
*/
const POLICY_GROUPS = [
  {
    heading: "Core Governance & Conduct",
    keywords: [
      "Code of Conduct for Senior Management",
      "Code of Conduct for Independent Directors",
      "Nomination & Remuneration",
      "Related Party Transaction",
    ],
  },
  {
    heading: "Operations & Materiality",
    keywords: [
      "Vigil Mechanism",
      "Whistle",
      "Risk Management",
      "Preservation of Documents",
      "Prevention of Sexual Harassment",
    ],
  },
  {
    heading: "Securities Compliance",
    keywords: ["Insider Trading", "Materiality of Events"],
  },
] as const;

function policiesInGroup(keywords: readonly string[]) {
  return policyDocuments.filter((p) =>
    keywords.some((k) =>
      p.title.toLowerCase().includes(k.toLowerCase())
    )
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Tab manager — programmatic, template-string driven, useState-backed
   ═══════════════════════════════════════════════════════════════════ */

const TABS = [
  { id: "financials", label: "Financial Performance" },
  { id: "disclosures", label: "Exchange Disclosures" },
] as const;

type TabId = (typeof TABS)[number]["id"];

/*
  Latest-cycle headline metrics — sourced verbatim from the Q4 FY25
  Investor Presentation (public/pdf-docs/investor-presentations/KDL-Q4-2025-1.pdf,
  slide 5). Do not alter without pointing at a newer authoritative PDF.
*/
const HEADLINE_METRICS: { value: string; unit?: string; label: string }[] = [
  { value: "₹327.82", unit: "Cr", label: "Total Income" },
  { value: "₹47.55", unit: "Cr", label: "Operational EBITDA" },
  { value: "₹31.70", unit: "Cr", label: "Profit After Tax (PAT)" },
  { value: "14.50", unit: "%", label: "EBITDA Margin" },
];

/* ═══════════════════════════════════════════════════════════════════
   Formatting helpers
   ═══════════════════════════════════════════════════════════════════ */

function fmt(n: number | null) {
  if (n === null) return "—";
  return `₹${n.toFixed(2)} Cr`;
}

function formatFY(year: string) {
  const m = year.match(/FY(\d{2})-(\d{2})/);
  if (!m) return year;
  return `FY 20${m[1]}–${m[2]}`;
}


/* ═══════════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════════ */

export default function InvestorRelationsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("financials");

  return (
    <>
      <Header />
      <main className="flex-1 pt-16 bg-obsidian text-white">

        {/*
          ── Full-width parallax hero ────────────────────────────────
          Handshake photograph pinned to the viewport via `md:bg-fixed`
          on desktop. Obsidian scrim + emerald radial glow give it the
          landing-page HeroDark family look while retaining the photo.
        */}
        <section
          className="relative overflow-hidden
                     bg-[url('/images/investor-relations/investor_realtions_main.jpg')]
                     bg-cover bg-center md:bg-fixed"
        >
          <div className="absolute inset-0 bg-obsidian/70" aria-hidden="true" />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-obsidian/90 via-obsidian/60 to-obsidian/30"
          />
          <div className="dot-grid-obsidian absolute inset-0 pointer-events-none opacity-30" aria-hidden="true" />
          <div
            aria-hidden="true"
            className="absolute -left-40 top-1/3 w-[520px] h-[520px] rounded-full bg-emerald/10 blur-3xl pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-obsidian"
          />

          <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 min-h-[440px] sm:min-h-[520px] md:min-h-[620px] flex flex-col justify-between gap-16">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 self-start">
              <span className="ticker-pulse bg-emerald w-2 h-2 rounded-full" />
              <span className="text-[10px] text-white/60 uppercase tracking-widest font-medium">
                NSE Listed
              </span>
              <span className="text-white/20 text-xs">|</span>
              <span className="text-xs text-emerald font-mono">
                {keyMetrics.ticker}
              </span>
              <span className="text-white/20 text-xs">|</span>
              <span className="text-xs text-white/60 font-mono">
                {keyMetrics.isin}
              </span>
              <span className="text-white/20 text-xs">|</span>
              <span className="text-[10px] text-white/50 uppercase tracking-widest font-medium">
                SEBI LODR 2015
              </span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-[0.95] drop-shadow-lg">
                Investor
                <br />
                <span className="text-emerald">Relations</span>
              </h1>
              <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-2xl">
                Kore Digital Limited&apos;s complete compliance repository —
                audited financial results, Regulation 30 stock-exchange
                disclosures, annual reports, board composition, and every
                statutory policy document filed under SEBI LODR Regulation
                46.
              </p>
            </div>
          </div>
        </section>

        {/* ── Latest-cycle headline metrics — light mist section ── */}
        <section className="bg-mist border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-24">
            <div className="flex flex-col items-center text-center mb-14 gap-4">
              <SectionBadge icon={TrendingUp} label="Latest Financial Cycle" tone="light" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                Consolidated Highlights
              </h2>
              <p className="text-slate-500 text-[10px] font-mono tracking-[0.32em] uppercase">
                Source &nbsp;·&nbsp; Q4 FY25 Investor Presentation
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {HEADLINE_METRICS.map((m, i) => (
                <Reveal key={m.label} delay={i * 80} className="h-full">
                  <BentoCard tone="light" className="h-full min-h-[168px] justify-center">
                    <StatBlock
                      tone="light"
                      size="lg"
                      accent
                      value={m.value}
                      unit={m.unit}
                      label={m.label}
                    />
                  </BentoCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Filings & Financial Statements — dark obsidian section ── */}
        <section className="bg-obsidian relative overflow-hidden">
          <div className="dot-grid-obsidian absolute inset-0 pointer-events-none opacity-20" aria-hidden="true" />
          <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-24 space-y-14">
            <div className="flex flex-col gap-4">
              <SectionBadge icon={FileText} label="Filings · Financial Statements" tone="dark" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.05] max-w-3xl">
                Financial performance & exchange disclosures
              </h2>
            </div>

            <div>
              <div
                role="tablist"
                className="flex flex-wrap gap-x-10 md:gap-x-14 gap-y-2 border-b border-white/10"
              >
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const buttonClass = [
                    "pb-5 -mb-px border-b-2 text-sm md:text-base font-semibold tracking-tight transition-all",
                    isActive
                      ? "border-emerald text-white"
                      : "border-transparent text-white/50 hover:text-white/80",
                  ].join(" ");

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={buttonClass}
                      aria-selected={isActive}
                      role="tab"
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div role="tabpanel" className="relative min-h-[400px]">
              {activeTab === "financials" && <FinancialsView />}
              {activeTab === "disclosures" && <DisclosuresView />}
            </div>
          </div>
        </section>

        {/* ── Statutory Policies — light mist section ── */}
        <PoliciesSection />

        {/* ── Corporate Governance — full-viewport photograph band, dark ── */}
        <GovernanceSection />

        {/* ── Contact & Registered Agents — light mist section ── */}
        <section className="bg-mist border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-24">
            <div className="flex flex-col gap-4 mb-12">
              <SectionBadge icon={Building2} label="Contact & Registered Agents" tone="light" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-[1.05] max-w-3xl">
                Reach the desks that handle your holdings
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">

              {/* Share Transfer Agent — Bigshare Services Pvt Ltd */}
              <Reveal delay={0} className="h-full">
                <AgentCard
                  icon={Building2}
                  eyebrow="Share Transfer Agent"
                  name="Bigshare Services Private Limited"
                  address={
                    <>
                      S6-2, 6th Floor, Pinnacle Business Park,
                      <br />
                      Mahakali Caves Road,
                      <br />
                      Andheri East, Mumbai – 400 093
                    </>
                  }
                  action={{
                    href: "https://www.bigshareonline.com",
                    label: "www.bigshareonline.com",
                    external: true,
                  }}
                />
              </Reveal>

              {/* Company Secretary & Compliance Officer */}
              <Reveal delay={120} className="h-full">
                <AgentCard
                  icon={ShieldCheck}
                  eyebrow="Company Secretary & Compliance Officer"
                  name="Ms. Purnima Maheshwari"
                  address={
                    <>
                      Kore Digital Limited
                      <br />
                      B 1107-1108, Shelton Sapphire,
                      <br />
                      CBD Belapur, Navi Mumbai – 400 614
                    </>
                  }
                  action={{
                    href: "mailto:cs@koredigital.com",
                    label: "cs@koredigital.com",
                    external: false,
                  }}
                />
              </Reveal>

              {/* Investor Grievance Redressal — SEBI SCORES */}
              <Reveal delay={240} className="h-full">
                <AgentCard
                  icon={LifeBuoy}
                  eyebrow="Investor Grievance Redressal"
                  name="SEBI SCORES Platform"
                  address={
                    <>
                      For investor complaints, write to the Compliance
                      Officer or file directly on the SEBI SCORES portal.
                      <br />
                      Toll-Free: 1800 266 7575 &nbsp;/&nbsp; 1800 22 7575
                    </>
                  }
                  action={{
                    href: "https://scores.sebi.gov.in",
                    label: "SEBI SCORES Portal",
                    external: true,
                  }}
                />
              </Reveal>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Reusable section-head primitive (in-panel headers under tabs)
   ═══════════════════════════════════════════════════════════════════ */

function SectionHead({ title, meta }: { title: string; meta?: string }) {
  return (
    <div className="flex items-baseline justify-between pb-4 border-b border-white/10 mb-10 md:mb-12">
      <h3 className="text-white font-bold text-2xl md:text-3xl tracking-tight">
        {title}
      </h3>
      {meta && (
        <span className="text-white/50 text-[10px] font-mono uppercase tracking-[0.25em] shrink-0 ml-4">
          {meta}
        </span>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Registered-agent card — used in the Contact & Registered Agents
   grid at the bottom of the page. Light tone card on mist bg.
   ═══════════════════════════════════════════════════════════════════ */

type AgentCardProps = {
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  name: string;
  address: React.ReactNode;
  action: { href: string; label: string; external: boolean };
};

function AgentCard({
  icon: Icon,
  eyebrow,
  name,
  address,
  action,
}: AgentCardProps) {
  const isExternal = action.external;
  return (
    <div className="group relative h-full flex flex-col bg-white border border-slate-200 rounded-2xl p-6 md:p-8 bento-hover">
      <div className="w-11 h-11 rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center mb-6 group-hover:border-emerald/60 group-hover:bg-emerald/10 transition-colors">
        <Icon className="w-4 h-4 text-emerald-ink" />
      </div>

      <p className="text-slate-500 text-[10px] font-mono tracking-[0.25em] uppercase mb-3">
        {eyebrow}
      </p>

      <p className="text-slate-900 text-lg font-semibold tracking-tight mb-4">
        {name}
      </p>

      <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
        {address}
      </p>

      <a
        href={action.href}
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className="inline-flex items-center gap-1.5 text-sm text-slate-700 group-hover:text-emerald-ink transition-colors self-start w-full mt-auto pt-4 border-t border-slate-200 group-hover:border-emerald/40"
      >
        <span>{action.label}</span>
        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </a>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TAB VIEW 1 — Financial Performance
   Shows the scaling transition FY19-20 → FY24-25.
   ═══════════════════════════════════════════════════════════════════ */

function FinancialsView() {
  const historical = [...financials].reverse();
  const reportsWithUrl = [...financials]
    .reverse()
    .filter((f) => !f.isProjected && f.annualReportUrl);

  const [selectedReport, setSelectedReport] = useState<FinancialYear | null>(
    null
  );

  return (
    <div className="space-y-20 md:space-y-24">

      {/* ── Historical progression table ─────────────────────────── */}
      <section>
        <SectionHead
          title="Historical Financial Progression"
          meta="Figures in ₹ Cr"
        />
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="bg-white/[0.03] border-b border-white/10">
                {[
                  "Year",
                  "Revenue",
                  "YoY",
                  "LT Borrowings",
                  "Work-in-Progress",
                  "Net Worth",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-4 text-left text-[10px] font-semibold text-white/50 uppercase tracking-widest whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {historical.map((row) => (
                <tr
                  key={row.year}
                  className="transition-colors hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-5 font-semibold text-white whitespace-nowrap tracking-tight">
                    {formatFY(row.year)}
                  </td>
                  <td className="px-4 py-5 text-white/80 whitespace-nowrap tabular-nums">
                    {fmt(row.revenue)}
                  </td>
                  <td className="px-4 py-5 whitespace-nowrap tabular-nums">
                    {row.revenueGrowth === null ? (
                      <span className="text-white/40">—</span>
                    ) : row.revenueGrowth > 0 ? (
                      <span className="inline-flex items-center gap-1 text-emerald">
                        <TrendingUp className="w-3 h-3" />+
                        {row.revenueGrowth.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-400">
                        <TrendingDown className="w-3 h-3" />
                        {row.revenueGrowth.toFixed(1)}%
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-5 text-white/80 whitespace-nowrap tabular-nums">
                    {fmt(row.longTermBorrowings)}
                  </td>
                  <td className="px-4 py-5 text-white/80 whitespace-nowrap tabular-nums">
                    {fmt(row.workInProgress)}
                  </td>
                  <td className="px-4 py-5 text-white/80 whitespace-nowrap tabular-nums">
                    {fmt(row.netWorth)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-white/60 text-[10px] font-mono tracking-[0.25em] uppercase mt-6 max-w-2xl leading-relaxed">
          All figures are standalone, sourced verbatim from each year&apos;s
          audited annual report.
        </p>
      </section>

      {/* ── Annual Reports row list ──────────────────────────────── */}
      <section>
        <SectionHead
          title="Annual Reports"
          meta={`${reportsWithUrl.length} filings`}
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          {reportsWithUrl.map((row, i) => (
            <Reveal key={row.year} delay={i * 60} className="h-full">
              <button
                type="button"
                onClick={() => setSelectedReport(row)}
                className="text-left w-full group h-full flex flex-col bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-emerald/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald/10 transition-all duration-300 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg border border-white/10 bg-white/[0.03] flex items-center justify-center mb-5 group-hover:border-emerald/50 group-hover:bg-emerald/10 transition-colors">
                  <FileText className="w-4 h-4 text-emerald" />
                </div>

                <p className="text-white/50 text-[10px] font-mono tracking-[0.32em] uppercase mb-2">
                  Fiscal Year
                </p>

                <p className="text-white text-xl md:text-2xl font-bold tracking-tight mb-6">
                  {formatFY(row.year)}
                </p>

                <span className="mt-auto inline-flex items-center gap-1.5 text-xs text-white/70 group-hover:text-emerald transition-colors">
                  View Details
                  <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Side drawer — mounts at document scope, animates in/out ── */}
      <ReportDrawer
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Report side drawer — slides in from the right when a report card is
   clicked. Backdrop click, X button, and ESC key all dismiss. Body
   scroll locked while open.
   ═══════════════════════════════════════════════════════════════════ */

function ReportDrawer({
  report,
  onClose,
}: {
  report: FinancialYear | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!report) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [report, onClose]);

  const isOpen = report !== null;

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={
          report ? `Annual Report ${formatFY(report.year)}` : "Report drawer"
        }
        className={`fixed right-0 top-0 h-full w-full sm:max-w-[560px] lg:max-w-[920px] z-50 bg-obsidian border-l border-white/10 shadow-2xl shadow-black/70 transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {report && <ReportDrawerContent report={report} onClose={onClose} />}
      </aside>
    </>
  );
}

/* ─── Drawer content ───────────────────────────────────────────────── */

function ReportDrawerContent({
  report,
  onClose,
}: {
  report: FinancialYear;
  onClose: () => void;
}) {
  const filename = report.annualReportUrl.split("/").pop() ?? "report.pdf";

  const stats = [
    {
      label: "Revenue",
      value: fmt(report.revenue),
      delta: report.revenueGrowth,
    },
    {
      label: "Long-Term Borrowings",
      value: fmt(report.longTermBorrowings),
      delta: null,
    },
    {
      label: "Work-in-Progress",
      value: fmt(report.workInProgress),
      delta: null,
    },
    {
      label: "Net Worth",
      value: fmt(report.netWorth),
      delta: null,
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ───────────────────────────────────────────────── */}
      <header className="flex items-start justify-between gap-4 px-6 md:px-8 py-5 border-b border-white/10 bg-white/[0.03]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-emerald/10 border border-emerald/30 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-emerald" />
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">
              {filename}
            </p>
            <p className="text-white/60 text-xs mt-0.5">
              Kore Digital Limited &nbsp;·&nbsp; {formatFY(report.year)}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close report drawer"
          className="text-white/60 hover:text-white hover:bg-white/5 rounded p-2 transition-colors shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* ── Body: PDF preview + stats ────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid lg:grid-cols-5 gap-6 p-6 md:p-8">

          <div className="lg:col-span-3">
            <div className="text-white/50 text-[10px] font-mono tracking-[0.32em] uppercase mb-3">
              Document Preview
            </div>
            <div className="relative w-full aspect-[3/4] lg:aspect-auto lg:h-[500px] rounded-lg overflow-hidden border border-white/10 bg-slate-100">
              <iframe
                src={`${report.annualReportUrl}#view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                title={`Annual Report — ${formatFY(report.year)}`}
                className="w-full h-full"
                loading="lazy"
              />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="text-white/50 text-[10px] font-mono tracking-[0.32em] uppercase mb-3">
              Standalone Highlights
            </div>

            <div className="space-y-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="border border-white/10 rounded-lg p-4 bg-white/[0.03]"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-white/50 text-[10px] font-mono tracking-[0.25em] uppercase">
                      {s.label}
                    </p>
                    {typeof s.delta === "number" && (
                      <span
                        className={`inline-flex items-center gap-0.5 text-xs font-bold ${
                          s.delta > 0 ? "text-emerald" : "text-red-400"
                        }`}
                      >
                        {s.delta > 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {s.delta > 0 ? "+" : ""}
                        {s.delta.toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-bold tracking-tight tabular-nums text-white">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-white/50 text-[10px] leading-relaxed pt-2">
              All figures are standalone, sourced verbatim from the audited
              annual report for {formatFY(report.year)}. Refer to the full
              PDF for detailed segment reporting, cash-flow statement, and
              balance-sheet disclosures.
            </p>
          </div>

        </div>
      </div>

      {/* ── Footer actions ───────────────────────────────────────── */}
      <footer className="flex flex-col sm:flex-row items-stretch gap-3 px-6 md:px-8 py-5 border-t border-white/10 bg-white/[0.03]">
        <a
          href={report.annualReportUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald hover:brightness-110 text-obsidian font-bold text-sm px-4 py-3 rounded-lg transition"
        >
          <ExternalLink className="w-4 h-4" />
          Open in New Tab
        </a>
        <a
          href={report.annualReportUrl}
          download={filename}
          className="flex-1 inline-flex items-center justify-center gap-2 border border-white/20 text-white hover:border-emerald hover:text-emerald font-semibold text-sm px-4 py-3 rounded-lg transition"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </a>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TAB VIEW 2 — Exchange Disclosures
   Placeholder "Initializing" state. All disclosure entries will be
   streamed from the client database once documents are uploaded via
   the /admin console; there is no hardcoded mockup timeline here.
   ═══════════════════════════════════════════════════════════════════ */

function DisclosuresView() {
  return (
    <div className="glass-obsidian rounded-2xl p-8 md:p-12">
      <p className="text-emerald text-[10px] font-mono tracking-[0.25em] uppercase mb-6 inline-flex items-center gap-2">
        <span className="ticker-pulse bg-emerald w-1.5 h-1.5 rounded-full" />
        [ Pipeline Status: Active ]
      </p>

      <h3 className="text-white text-2xl md:text-3xl font-bold tracking-tight mb-4">
        Exchange Disclosures Feed
      </h3>

      <p className="text-white/70 text-sm leading-relaxed max-w-xl">
        This chronological framework is ready to dynamically stream live
        statutory communications filed with the National Stock Exchange under
        SEBI Regulation 30 upon client document upload.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Corporate Governance — full-width standalone section
   Photograph-backed with obsidian scrim. Editorial vertical stack of
   Board Composition, Statutory Committees, and Compliance Desk.
   ═══════════════════════════════════════════════════════════════════ */

function GovernanceSection() {
  const executiveMembers = boardMembers.filter((m) => m.category === "Executive");
  const independentMembers = boardMembers.filter(
    (m) => m.category === "Independent" || m.category === "Non-Executive"
  );

  return (
    <section
      className="relative overflow-hidden
                 bg-[url('/images/investor-relations/corporate_governance.jpg')]
                 bg-cover bg-center md:bg-fixed"
    >
      <div aria-hidden="true" className="absolute inset-0 bg-obsidian/80" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-obsidian/90 via-obsidian/65 to-obsidian/45"
      />
      <div className="dot-grid-obsidian absolute inset-0 pointer-events-none opacity-25" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="absolute -right-40 top-1/4 w-[520px] h-[520px] rounded-full bg-emerald/8 blur-3xl pointer-events-none"
      />

      <div
        className="relative max-w-7xl mx-auto
                   px-6 md:px-12 py-20 md:py-28
                   space-y-12 md:space-y-16"
      >

        <div className="flex flex-col gap-4">
          <SectionBadge icon={Users} label="Statutory Governance Framework" tone="dark" />
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[0.95] drop-shadow-lg">
            Corporate Governance
          </h2>
          <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-2xl">
            Board composition, statutory committees, and the office of the
            Compliance Officer — the complete governance surface required
            under SEBI LODR Regulation 46, at a single glance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

          {/* ─── Column 1 · Board Composition ─────────────── */}
          <div className="glass-obsidian rounded-2xl p-6 md:p-7">
            <p className="text-emerald text-[10px] font-mono tracking-[0.32em] uppercase mb-6 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="inline-block w-6 h-px bg-emerald/60"
              />
              01 · Board Composition
            </p>

            <p className="text-white/50 text-[10px] font-mono tracking-[0.28em] uppercase mb-2.5">
              Executive Leadership
            </p>
            <ul className="divide-y divide-white/10 border-y border-white/10 mb-6">
              {executiveMembers.map((m) => (
                <li key={m.name} className="py-2.5 leading-tight">
                  <p className="text-white text-sm font-semibold tracking-tight">
                    {m.name}
                  </p>
                  <p className="text-white/70 text-xs mt-0.5">
                    {m.designation}
                  </p>
                </li>
              ))}
            </ul>

            <p className="text-white/50 text-[10px] font-mono tracking-[0.28em] uppercase mb-2.5">
              Independent Oversight
            </p>
            <ul className="divide-y divide-white/10 border-y border-white/10">
              {independentMembers.map((m) => (
                <li key={m.name} className="py-2.5 leading-tight">
                  <p className="text-white text-sm font-semibold tracking-tight">
                    {m.name}
                  </p>
                  <p className="text-white/70 text-xs mt-0.5">
                    {m.designation}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* ─── Column 2 · Statutory Committees ──────────── */}
          <div className="glass-obsidian rounded-2xl p-6 md:p-7">
            <p className="text-emerald text-[10px] font-mono tracking-[0.32em] uppercase mb-6 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="inline-block w-6 h-px bg-emerald/60"
              />
              02 · Statutory Committees
            </p>

            <p className="text-white/50 text-[10px] font-mono tracking-[0.28em] uppercase mb-2.5">
              Mandatory Under Companies Act &amp; SEBI LODR
            </p>
            <ul className="divide-y divide-white/10 border-y border-white/10">
              {committees.map((c) => (
                <li key={c.name} className="py-3 leading-tight">
                  <p className="text-white text-sm font-semibold tracking-tight">
                    {c.name}
                  </p>
                  <p className="text-white/70 text-xs mt-1 leading-snug">
                    {c.shortBlurb}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* ─── Column 3 · Compliance Desk ───────────────── */}
          <div className="glass-obsidian rounded-2xl p-6 md:p-7">
            <p className="text-emerald text-[10px] font-mono tracking-[0.32em] uppercase mb-6 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="inline-block w-6 h-px bg-emerald/60"
              />
              03 · Compliance Desk
            </p>

            <div className="flex items-start gap-3 mb-4">
              <div
                aria-hidden="true"
                className="shrink-0 w-10 h-10 rounded-lg border border-emerald/40 bg-emerald/15 flex items-center justify-center"
              >
                <ShieldCheck className="w-4 h-4 text-emerald" />
              </div>
              <div className="min-w-0 leading-tight">
                <p className="text-white text-sm font-semibold tracking-tight">
                  Ms. Purnima Maheshwari
                </p>
                <p className="text-white/70 text-xs mt-0.5">
                  Company Secretary &amp; Compliance Officer
                </p>
              </div>
            </div>

            <p className="text-emerald text-[10px] font-mono tracking-[0.28em] uppercase mb-4">
              [ SEBI LODR Regulation 6 Compliant ]
            </p>

            <dl className="border-t border-white/10 pt-4 space-y-3">
              <div>
                <dt className="text-white/50 text-[10px] font-mono tracking-[0.28em] uppercase mb-1">
                  Email Desk
                </dt>
                <dd>
                  <a
                    href="mailto:cs@koredigital.com"
                    className="text-white text-sm hover:text-emerald transition-colors inline-flex items-center gap-1"
                  >
                    cs@koredigital.com
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </dd>
              </div>

              <div>
                <dt className="text-white/50 text-[10px] font-mono tracking-[0.28em] uppercase mb-1">
                  Registered Office
                </dt>
                <dd className="text-white/80 text-sm leading-snug">
                  Shelton Sapphire,
                  <br />
                  CBD Belapur,
                  <br />
                  Navi Mumbai
                </dd>
              </div>
            </dl>
          </div>

        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Statutory Policies — standalone light-mist section

   Structure:
     • Editorial section header (Compliance Library eyebrow + big title)
     • Three category groups stacked, each with a category eyebrow
       above a card grid
     • Side drawer (same behaviour as ReportDrawer)
   ═══════════════════════════════════════════════════════════════════ */

function PoliciesSection() {
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyDocument | null>(
    null
  );

  return (
    <section className="bg-mist border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28 space-y-16 md:space-y-20">

        <div className="flex flex-col gap-4">
          <SectionBadge
            icon={ShieldCheck}
            label={`Compliance Library · SEBI LODR Reg 46 · ${policyDocuments.length} documents`}
            tone="light"
          />
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 tracking-tight leading-[0.95]">
            Statutory Policies
          </h2>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-2xl">
            The complete mandatory policy library — every document filed under
            SEBI LODR Regulation 46, organised by regulatory subject area for
            audit-friendly retrieval.
          </p>
        </div>

        <div className="space-y-12 md:space-y-14">
          {POLICY_GROUPS.map((group) => {
            const items = policiesInGroup(group.keywords);
            if (items.length === 0) return null;
            return (
              <div key={group.heading}>
                <p className="text-emerald-ink text-[10px] font-mono tracking-[0.28em] uppercase mb-5 flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="inline-block w-6 h-px bg-emerald/60"
                  />
                  {group.heading}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
                  {items.map((policy, i) => (
                    <Reveal
                      key={policy.title}
                      delay={i * 60}
                      className="h-full"
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedPolicy(policy)}
                        className="text-left w-full group h-full flex flex-col bg-white border border-slate-200 rounded-2xl p-6 bento-hover cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center mb-5 group-hover:border-emerald/50 group-hover:bg-emerald/10 transition-colors">
                          <FileText className="w-4 h-4 text-emerald-ink" />
                        </div>

                        <p className="text-slate-900 text-sm md:text-base font-semibold tracking-tight leading-snug mb-6">
                          {policy.title}
                        </p>

                        <span className="mt-auto inline-flex items-center gap-1.5 text-xs text-slate-700 group-hover:text-emerald-ink transition-colors">
                          View Policy
                          <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </span>
                      </button>
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <PolicyDrawer
          policy={selectedPolicy}
          onClose={() => setSelectedPolicy(null)}
        />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Policy side drawer — mirrors the ReportDrawer pattern.
   ═══════════════════════════════════════════════════════════════════ */

function PolicyDrawer({
  policy,
  onClose,
}: {
  policy: PolicyDocument | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!policy) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [policy, onClose]);

  const isOpen = policy !== null;

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={policy ? policy.title : "Policy drawer"}
        className={`fixed right-0 top-0 h-full w-full sm:max-w-[560px] lg:max-w-[920px] z-50 bg-obsidian border-l border-white/10 shadow-2xl shadow-black/70 transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {policy && <PolicyDrawerContent policy={policy} onClose={onClose} />}
      </aside>
    </>
  );
}

function PolicyDrawerContent({
  policy,
  onClose,
}: {
  policy: PolicyDocument;
  onClose: () => void;
}) {
  const filename = policy.fileUrl.split("/").pop() ?? "policy.pdf";

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-start justify-between gap-4 px-6 md:px-8 py-5 border-b border-white/10 bg-white/[0.03]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-emerald/10 border border-emerald/30 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-emerald" />
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold leading-snug">
              {policy.title}
            </p>
            <p className="text-white/60 text-[10px] font-mono tracking-[0.25em] uppercase mt-1">
              {policy.mandatoryUnder}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close policy drawer"
          className="text-white/60 hover:text-white hover:bg-white/5 rounded p-2 transition-colors shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      <div className="flex-1 p-6 md:p-8 min-h-0">
        <div className="w-full h-full rounded-lg overflow-hidden border border-white/10 bg-slate-100">
          <iframe
            src={`${policy.fileUrl}#view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
            title={policy.title}
            className="w-full h-full"
            loading="lazy"
          />
        </div>
      </div>

      <footer className="flex flex-col sm:flex-row items-stretch gap-3 px-6 md:px-8 py-5 border-t border-white/10 bg-white/[0.03]">
        <a
          href={policy.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald hover:brightness-110 text-obsidian font-bold text-sm px-4 py-3 rounded-lg transition"
        >
          <ExternalLink className="w-4 h-4" />
          Open in New Tab
        </a>
        <a
          href={policy.fileUrl}
          download={filename}
          className="flex-1 inline-flex items-center justify-center gap-2 border border-white/20 text-white hover:border-emerald hover:text-emerald font-semibold text-sm px-4 py-3 rounded-lg transition"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </a>
      </footer>
    </div>
  );
}
