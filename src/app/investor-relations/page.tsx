"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { financials, keyMetrics } from "@/data/financials";
import { disclosures } from "@/data/disclosures";
import { committees, policyDocuments } from "@/data/governance";

/* ═══════════════════════════════════════════════════════════════════
   Tab manager — programmatic, template-string driven, useState-backed
   ═══════════════════════════════════════════════════════════════════ */

const TABS = [
  { id: "financials", label: "Financial Performance" },
  { id: "disclosures", label: "Exchange Disclosures" },
  { id: "governance", label: "Corporate Governance" },
] as const;

type TabId = (typeof TABS)[number]["id"];

/* ═══════════════════════════════════════════════════════════════════
   Latest-cycle headline metrics (top of page)
   Sourced from the latest board-approved consolidated position.
   ═══════════════════════════════════════════════════════════════════ */

const HEADLINE_METRICS = [
  { value: "₹408.38 Cr", label: "Total Income / Revenue" },
  { value: "₹57.00 Cr", label: "Operational EBITDA" },
  { value: "₹36.91 Cr", label: "Profit After Tax (PAT)" },
  { value: "₹29.89", label: "Earnings Per Share (EPS)" },
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

function formatDate(iso: string) {
  const d = new Date(iso);
  return {
    day: d.getDate().toString().padStart(2, "0"),
    monthShort: d
      .toLocaleDateString("en-IN", { month: "short" })
      .toUpperCase(),
    monthLong: d.toLocaleDateString("en-IN", { month: "long" }),
    year: d.getFullYear(),
  };
}

/* ═══════════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════════ */

export default function InvestorRelationsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("financials");

  return (
    <>
      <Header />
      <main className="flex-1 pt-16 bg-[#030712] text-slate-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 space-y-24 md:space-y-28">

          {/* ── Micro-context strip ────────────────────────────────── */}
          <p className="text-slate-600 text-[10px] font-mono tracking-[0.32em] uppercase">
            [ NSE:&nbsp;{keyMetrics.ticker} &nbsp;|&nbsp; ISIN:&nbsp;
            {keyMetrics.isin} &nbsp;|&nbsp; SEBI LODR 2015 ]
          </p>

          {/* ── Editorial headline (clean, no decorative dot) ──────── */}
          <div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-slate-50 tracking-tighter leading-[0.92] mb-8">
              Investor
              <br />
              Relations
            </h1>
            <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl">
              Kore Digital Limited&apos;s complete compliance repository —
              audited financial results, Regulation 30 stock-exchange
              disclosures, annual reports, board composition, and every
              statutory policy document filed under SEBI LODR Regulation
              46.
            </p>
          </div>

          {/* ── Latest-cycle headline metric strip ─────────────────── */}
          <section className="border-t border-slate-800/30 pt-16 md:pt-20">
            <p className="text-slate-600 text-[10px] font-mono tracking-[0.32em] uppercase mb-10">
              Latest Financial Cycle &nbsp;·&nbsp; Consolidated Position
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6 md:divide-x md:divide-slate-800/30">
              {HEADLINE_METRICS.map((m, i) => (
                <div
                  key={m.label}
                  className={`space-y-3 ${i === 0 ? "" : "md:pl-8"}`}
                >
                  <p className="text-slate-500 text-[10px] font-mono tracking-[0.25em] uppercase">
                    {m.label}
                  </p>
                  <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-50 tracking-tighter tabular-nums">
                    {m.value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Tab switcher + panels ──────────────────────────────── */}
          <section className="border-t border-slate-800/30 pt-16 md:pt-20 space-y-16 md:space-y-20">
            <div>
              <p className="text-slate-600 text-[10px] font-mono tracking-[0.32em] uppercase mb-6">
                Filings &nbsp;·&nbsp; Governance &nbsp;·&nbsp; Statements
              </p>
              <div
                role="tablist"
                className="flex flex-wrap gap-x-10 md:gap-x-14 gap-y-2 border-b border-slate-800/30"
              >
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  // Programmatic template-string driven active state
                  const buttonClass = [
                    "pb-5 -mb-px border-b-2 text-sm md:text-base font-semibold tracking-tight transition-all",
                    isActive
                      ? "border-slate-50 text-slate-50"
                      : "border-transparent text-slate-500 opacity-80 hover:opacity-100 hover:text-slate-200",
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

            <div role="tabpanel" className="min-h-[400px]">
              {activeTab === "financials" && <FinancialsView />}
              {activeTab === "disclosures" && <DisclosuresView />}
              {activeTab === "governance" && <GovernanceView />}
            </div>
          </section>

          {/* ── Registered agents directory ────────────────────────── */}
          <section className="border-t border-slate-800/30 pt-16 md:pt-20 py-12">
            <p className="text-slate-600 text-[10px] font-mono tracking-[0.32em] uppercase mb-10">
              Contact &nbsp;&amp;&nbsp; Registered Agents
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-14 md:gap-x-16">

              {/* Share Transfer Agent — Bigshare Services Pvt Ltd */}
              <div className="space-y-2.5">
                <p className="text-slate-600 text-[10px] font-mono tracking-[0.25em] uppercase">
                  Share Transfer Agent
                </p>
                <p className="text-slate-50 text-base font-semibold tracking-tight">
                  Bigshare Services Private Limited
                </p>
                <p className="text-slate-500 text-sm leading-relaxed">
                  S6-2, 6th Floor, Pinnacle Business Park,
                  <br />
                  Mahakali Caves Road,
                  <br />
                  Andheri East, Mumbai – 400 093
                </p>
                <a
                  href="https://www.bigshareonline.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm text-slate-300 opacity-70 hover:opacity-100 hover:text-slate-50 transition-opacity pt-1"
                >
                  www.bigshareonline.com&nbsp;↗
                </a>
              </div>

              {/* Company Secretary & Compliance Officer — Ms. Purnima Maheshwari */}
              <div className="space-y-2.5">
                <p className="text-slate-600 text-[10px] font-mono tracking-[0.25em] uppercase">
                  Company Secretary &amp; Compliance Officer
                </p>
                <p className="text-slate-50 text-base font-semibold tracking-tight">
                  Ms. Purnima Maheshwari
                </p>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Kore Digital Limited
                  <br />
                  B 1107-1108, Shelton Sapphire,
                  <br />
                  CBD Belapur, Navi Mumbai – 400 614
                </p>
                <a
                  href="mailto:cs@koredigital.com"
                  className="inline-block text-sm text-slate-300 opacity-70 hover:opacity-100 hover:text-slate-50 transition-opacity pt-1"
                >
                  cs@koredigital.com
                </a>
              </div>

              {/* Investor Grievance Redressal — SEBI SCORES */}
              <div className="space-y-2.5">
                <p className="text-slate-600 text-[10px] font-mono tracking-[0.25em] uppercase">
                  Investor Grievance Redressal
                </p>
                <p className="text-slate-500 text-sm leading-relaxed">
                  For investor complaints, write to the Compliance Officer or
                  use the SEBI SCORES platform.
                </p>
                <a
                  href="https://scores.sebi.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm text-slate-300 opacity-70 hover:opacity-100 hover:text-slate-50 transition-opacity pt-1"
                >
                  SEBI SCORES Portal&nbsp;↗
                </a>
                <p className="text-slate-500 text-sm pt-1">
                  Toll-Free: 1800 266 7575 &nbsp;/&nbsp; 1800 22 7575
                </p>
              </div>

            </div>
          </section>

          {/* ── Compliance fine-print footer ───────────────────────── */}
          <div className="border-t border-slate-800/30 pt-12">
            <p className="text-slate-600 text-[11px] leading-relaxed max-w-3xl">
              All disclosures on this page are filed in compliance with SEBI
              (Listing Obligations and Disclosure Requirements) Regulations,
              2015. Information provided is for informational purposes only
              and does not constitute investment advice. Past performance is
              not indicative of future results.
            </p>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Reusable section-head primitive
   ═══════════════════════════════════════════════════════════════════ */

function SectionHead({ title, meta }: { title: string; meta?: string }) {
  return (
    <div className="flex items-baseline justify-between pb-4 border-b border-slate-800/30 mb-10 md:mb-12">
      <h3 className="text-slate-50 font-bold text-2xl md:text-3xl tracking-tighter">
        {title}
      </h3>
      {meta && (
        <span className="text-slate-500 text-[10px] font-mono uppercase tracking-[0.25em] shrink-0 ml-4">
          {meta}
        </span>
      )}
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

  return (
    <div className="space-y-24 md:space-y-28">

      {/* ── Historical progression table ─────────────────────────── */}
      <section>
        <SectionHead
          title="Historical Financial Progression"
          meta="Figures in ₹ Cr"
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="border-b border-slate-800/30">
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
                    className="px-2 py-4 text-left text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-[0.25em] whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {historical.map((row) => (
                <tr
                  key={row.year}
                  className="transition-colors hover:bg-slate-900/40"
                >
                  <td className="px-2 py-5 font-semibold text-slate-50 whitespace-nowrap tracking-tight">
                    {formatFY(row.year)}
                  </td>
                  <td className="px-2 py-5 text-slate-200 whitespace-nowrap tabular-nums">
                    {fmt(row.revenue)}
                  </td>
                  <td className="px-2 py-5 whitespace-nowrap tabular-nums">
                    {row.revenueGrowth === null ? (
                      <span className="text-slate-700">—</span>
                    ) : row.revenueGrowth > 0 ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400">
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
                  <td className="px-2 py-5 text-slate-200 whitespace-nowrap tabular-nums">
                    {fmt(row.longTermBorrowings)}
                  </td>
                  <td className="px-2 py-5 text-slate-200 whitespace-nowrap tabular-nums">
                    {fmt(row.workInProgress)}
                  </td>
                  <td className="px-2 py-5 text-slate-200 whitespace-nowrap tabular-nums">
                    {fmt(row.netWorth)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-slate-600 text-[10px] font-mono tracking-[0.25em] uppercase mt-6 max-w-2xl leading-relaxed">
          FY19-20 → FY23-24 figures are standalone (per audited annual
          reports). FY24-25 figures are consolidated (per latest
          board-approved position; audited report pending).
        </p>
      </section>

      {/* ── Annual Reports row list ──────────────────────────────── */}
      <section>
        <SectionHead
          title="Annual Reports"
          meta={`${reportsWithUrl.length} filings`}
        />
        <div className="divide-y divide-slate-800/30">
          {reportsWithUrl.map((row) => (
            <article
              key={row.year}
              className="grid grid-cols-12 gap-4 py-8 md:py-10 items-baseline"
            >
              <div className="col-span-12 md:col-span-4 space-y-1">
                <p className="text-slate-600 text-[10px] font-mono tracking-[0.32em] uppercase">
                  Fiscal Year
                </p>
                <p className="text-slate-50 text-3xl md:text-4xl font-bold tracking-tighter">
                  {formatFY(row.year)}
                </p>
              </div>

              <div className="col-span-12 md:col-span-5 flex flex-wrap gap-x-5 gap-y-1.5">
                {[
                  "Annual Report",
                  "Auditor's Note",
                  "Notice of AGM",
                ].map((label) => (
                  <span key={label} className="text-slate-400 text-sm">
                    {label}
                  </span>
                ))}
              </div>

              <div className="col-span-12 md:col-span-3 flex md:justify-end">
                <a
                  href={row.annualReportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-300 opacity-70 hover:opacity-100 hover:text-slate-50 transition-opacity"
                >
                  Download PDF&nbsp;→
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TAB VIEW 2 — Exchange Disclosures (reverse-chronological stream)
   Handles empty fileUrl gracefully (shows "on NSE portal" instead of
   a broken download link).
   ═══════════════════════════════════════════════════════════════════ */

function DisclosuresView() {
  const stream = [...disclosures].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  return (
    <div>
      <SectionHead
        title="Regulation 30 Filings"
        meta={`${stream.length} disclosures`}
      />

      <div className="divide-y divide-slate-800/30">
        {stream.map((item) => {
          const d = formatDate(item.date);
          return (
            <article
              key={item.id}
              className="grid grid-cols-12 gap-4 py-8 md:py-10 items-baseline"
            >
              {/* Date column */}
              <div className="col-span-12 md:col-span-2">
                <p className="text-slate-600 text-[10px] font-mono tracking-[0.32em] uppercase mb-1">
                  {d.monthShort}&nbsp;{d.year}
                </p>
                <p className="text-slate-50 text-3xl md:text-4xl font-bold tracking-tighter">
                  {d.day}
                </p>
              </div>

              {/* Title + meta */}
              <div className="col-span-12 md:col-span-7 space-y-2">
                <p className="text-slate-100 text-sm md:text-base leading-snug">
                  {item.title}
                </p>
                <p className="text-slate-500 text-[10px] font-mono uppercase tracking-[0.25em]">
                  {item.category}&nbsp;&nbsp;·&nbsp;&nbsp;{item.exchange}
                </p>
              </div>

              {/* View / on-portal note */}
              <div className="col-span-12 md:col-span-3 flex md:justify-end">
                {item.fileUrl ? (
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-300 opacity-70 hover:opacity-100 hover:text-slate-50 transition-opacity"
                  >
                    View PDF&nbsp;→
                  </a>
                ) : (
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-600">
                    Available on NSE
                  </span>
                )}
              </div>
            </article>
          );
        })}

        {stream.length === 0 && (
          <div className="py-20 text-center text-slate-500 text-sm">
            No disclosures currently on record.
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TAB VIEW 3 — Corporate Governance (3-column grid)
     COL 1: Board Committee structures
     COL 2: Compliance Officer seat (Ms. Purnima Maheshwari)
     COL 3: Selectable cards for mandatory policies
             (RPT · Whistleblower · Document Preservation)
   ═══════════════════════════════════════════════════════════════════ */

function GovernanceView() {
  // Pull the three specific policies the panel highlights
  const findPolicy = (needle: string) =>
    policyDocuments.find((p) =>
      p.title.toLowerCase().includes(needle.toLowerCase())
    );

  const highlightedPolicies = [
    findPolicy("Related Party"),
    findPolicy("Whistle"),
    findPolicy("Preservation"),
  ].filter(Boolean) as typeof policyDocuments;

  return (
    <div>
      <SectionHead title="Governance Framework" meta="3 pillars" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16 md:gap-x-16">

        {/* ── COL 1: Board Committee structures ──────────────────── */}
        <div>
          <p className="text-slate-600 text-[10px] font-mono tracking-[0.32em] uppercase mb-6">
            01 &nbsp;·&nbsp; Board Committees
          </p>
          <div className="divide-y divide-slate-800/30">
            {committees.map((c) => (
              <div key={c.name} className="py-5 first:pt-0">
                <p className="text-slate-50 text-base font-semibold tracking-tight leading-tight">
                  {c.name}
                </p>
                <p className="text-slate-500 text-xs mt-1.5">
                  Chairperson:&nbsp;{c.chairman}
                </p>
                <p className="text-slate-600 text-[10px] font-mono tracking-[0.25em] uppercase mt-2">
                  {c.members.length} members
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── COL 2: Compliance Officer seat ─────────────────────── */}
        <div>
          <p className="text-slate-600 text-[10px] font-mono tracking-[0.32em] uppercase mb-6">
            02 &nbsp;·&nbsp; Compliance Officer
          </p>
          <div className="border-l-2 border-slate-700 pl-6 py-2 space-y-3">
            <p className="text-slate-50 text-xl md:text-2xl font-bold tracking-tighter">
              Ms. Purnima Maheshwari
            </p>
            <p className="text-slate-400 text-sm">
              Company Secretary &amp; Compliance Officer
            </p>
            <p className="text-slate-500 text-[10px] font-mono tracking-[0.25em] uppercase">
              SEBI LODR Regulation 6
            </p>
            <p className="text-slate-500 text-sm leading-relaxed pt-2">
              Designated Compliance Officer under SEBI LODR Regulation 6.
              Responsible for all statutory filings, board minutes,
              investor grievance triage, and regulatory correspondence
              with the stock exchanges and SEBI.
            </p>
            <p className="text-slate-600 text-[10px] font-mono tracking-[0.25em] uppercase pt-2">
              Reachable at
            </p>
            <a
              href="mailto:cs@koredigital.com"
              className="inline-block text-sm text-slate-300 opacity-70 hover:opacity-100 hover:text-slate-50 transition-opacity"
            >
              cs@koredigital.com
            </a>
          </div>
        </div>

        {/* ── COL 3: Selectable policy cards ─────────────────────── */}
        <div>
          <p className="text-slate-600 text-[10px] font-mono tracking-[0.32em] uppercase mb-6">
            03 &nbsp;·&nbsp; Statutory Policies
          </p>
          <div className="space-y-4">
            {highlightedPolicies.map((p) => (
              <a
                key={p.title}
                href={p.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-slate-800/60 hover:border-slate-500 p-5 space-y-3 transition-colors group"
              >
                <p className="text-slate-50 text-base font-semibold tracking-tight leading-tight">
                  {p.title}
                </p>
                <p className="text-slate-600 text-[10px] font-mono tracking-[0.25em] uppercase">
                  {p.mandatoryUnder}
                </p>
                <p className="text-slate-300 text-xs opacity-70 group-hover:opacity-100 transition-opacity">
                  Download PDF&nbsp;→
                </p>
              </a>
            ))}
          </div>

          <p className="text-slate-600 text-[10px] font-mono tracking-[0.25em] uppercase mt-8 leading-relaxed">
            The full statutory library — {policyDocuments.length} policies —
            is maintained by the Company Secretary. Contact
            cs@koredigital.com for the complete archive.
          </p>
        </div>

      </div>
    </div>
  );
}
