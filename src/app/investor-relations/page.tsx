"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { financials, keyMetrics } from "@/data/financials";
import { disclosures } from "@/data/disclosures";
import {
  boardMembers,
  committees,
  policyDocuments,
} from "@/data/governance";

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
   Consolidated scale metrics (top of page — the "at-a-glance" block)
   Sourced from the latest board-approved consolidated position.
   ═══════════════════════════════════════════════════════════════════ */

const SCALE_METRICS = [
  { value: "₹408.38 Cr", label: "Consolidated Total Revenue" },
  { value: "₹57.00 Cr", label: "Operational EBITDA" },
  { value: "₹36.91 Cr", label: "Profit After Tax (PAT)" },
  { value: "1,560 MW", label: "AI Green Datacenter Framework Capacity" },
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
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">

          {/* ── Micro-context strip ────────────────────────────────── */}
          <p className="text-slate-600 text-[10px] font-mono tracking-[0.32em] uppercase mb-8">
            [ NSE:&nbsp;{keyMetrics.ticker} &nbsp;|&nbsp; ISIN:&nbsp;
            {keyMetrics.isin} &nbsp;|&nbsp; SEBI LODR 2015 ]
          </p>

          {/* ── Editorial headline (no trailing dot) ───────────────── */}
          <div className="mb-20 md:mb-28">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-slate-50 tracking-tighter leading-[0.92] mb-8">
              Investor
              <br />
              Relations
            </h1>
            <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl">
              Kore Digital Limited&apos;s complete compliance repository —
              consolidated scale metrics, audited financial results,
              Regulation 30 stock-exchange disclosures, annual reports,
              board composition, and every statutory policy document filed
              under SEBI LODR Regulation 46.
            </p>
          </div>

          <div className="border-t border-slate-800/30" />

          {/* ── Consolidated scale block ───────────────────────────── */}
          <section className="py-24 md:py-28">
            <p className="text-slate-600 text-[10px] font-mono tracking-[0.32em] uppercase mb-10">
              Consolidated Scale &nbsp;·&nbsp; Latest Board Update
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6 md:divide-x md:divide-slate-800/30">
              {SCALE_METRICS.map((m, i) => (
                <div
                  key={m.label}
                  className={`space-y-3 ${i === 0 ? "" : "md:pl-8"}`}
                >
                  <p className="text-slate-500 text-[10px] font-mono tracking-[0.25em] uppercase">
                    {m.label}
                  </p>
                  <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-50 tracking-tighter">
                    {m.value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div className="border-t border-slate-800/30" />

          {/* ── Tab switcher ───────────────────────────────────────── */}
          <div className="pt-24 md:pt-28 mb-14 md:mb-16">
            <p className="text-slate-600 text-[10px] font-mono tracking-[0.32em] uppercase mb-6">
              Filings &nbsp;·&nbsp; Governance &nbsp;·&nbsp; Statements
            </p>
            <div className="flex flex-wrap gap-x-10 md:gap-x-14 gap-y-2 border-b border-slate-800/30">
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

          {/* ── Tab panels ─────────────────────────────────────────── */}
          <div role="tabpanel" className="min-h-[400px]">
            {activeTab === "financials" && <FinancialsView />}
            {activeTab === "disclosures" && <DisclosuresView />}
            {activeTab === "governance" && <GovernanceView />}
          </div>

          <div className="border-t border-slate-800/30 mt-32 md:mt-40" />

          {/* ── Registered agents directory ────────────────────────── */}
          <section className="py-24 md:py-28">
            <p className="text-slate-600 text-[10px] font-mono tracking-[0.32em] uppercase mb-10">
              Contact &nbsp;&amp;&nbsp; Registered Agents
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-14 md:gap-x-16">

              <div className="space-y-2.5">
                <p className="text-slate-600 text-[10px] font-mono tracking-[0.25em] uppercase">
                  Share Transfer Agent
                </p>
                <p className="text-slate-50 text-base font-semibold tracking-tight">
                  KFin Technologies Limited
                </p>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Selenium Building, Tower B, Plot 31–32,
                  <br />
                  Gachibowli, Financial District,
                  <br />
                  Hyderabad – 500 032
                </p>
                <p className="text-slate-500 text-sm">Tel: +91 40 6716 2222</p>
                <a
                  href="https://www.kfintech.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm text-slate-300 opacity-70 hover:opacity-100 hover:text-slate-50 transition-opacity pt-1"
                >
                  www.kfintech.com&nbsp;↗
                </a>
              </div>

              <div className="space-y-2.5">
                <p className="text-slate-600 text-[10px] font-mono tracking-[0.25em] uppercase">
                  Company Secretary &amp; Compliance Officer
                </p>
                <p className="text-slate-50 text-base font-semibold tracking-tight">
                  Ms. Kavita Rao{" "}
                  <span className="text-slate-500 font-normal">(ACS)</span>
                </p>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Kore Digital Limited
                  <br />
                  Level 12, One BKC, Bandra Kurla Complex
                  <br />
                  Mumbai – 400 051
                </p>
                <a
                  href="mailto:compliance@koredigital.in"
                  className="inline-block text-sm text-slate-300 opacity-70 hover:opacity-100 hover:text-slate-50 transition-opacity pt-1"
                >
                  compliance@koredigital.in
                </a>
              </div>

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

          <div className="border-t border-slate-800/30" />

          {/* ── Compliance fine-print footer ───────────────────────── */}
          <div className="pt-16 md:pt-20">
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
   ═══════════════════════════════════════════════════════════════════ */

function FinancialsView() {
  const historical = [...financials].reverse();
  const reportsWithUrl = [...financials]
    .reverse()
    .filter((f) => !f.isProjected && f.annualReportUrl);

  return (
    <div className="space-y-24 md:space-y-32">

      {/* ── Historical summary table ─────────────────────────────── */}
      <section>
        <SectionHead
          title="Historical Standalone Summary"
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
                  <td className="px-2 py-4 font-semibold text-slate-50 whitespace-nowrap tracking-tight">
                    {formatFY(row.year)}
                  </td>
                  <td className="px-2 py-4 text-slate-200 whitespace-nowrap tabular-nums">
                    {fmt(row.revenue)}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap tabular-nums">
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
                  <td className="px-2 py-4 text-slate-200 whitespace-nowrap tabular-nums">
                    {fmt(row.longTermBorrowings)}
                  </td>
                  <td className="px-2 py-4 text-slate-200 whitespace-nowrap tabular-nums">
                    {fmt(row.workInProgress)}
                  </td>
                  <td className="px-2 py-4 text-slate-200 whitespace-nowrap tabular-nums">
                    {fmt(row.netWorth)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
   TAB VIEW 2 — Exchange Disclosures (chronological stream)
   ═══════════════════════════════════════════════════════════════════ */

function DisclosuresView() {
  // Chronological — newest first
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

              {/* View PDF */}
              <div className="col-span-12 md:col-span-3 flex md:justify-end">
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-300 opacity-70 hover:opacity-100 hover:text-slate-50 transition-opacity"
                >
                  View PDF&nbsp;→
                </a>
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
     COL 2: Compliance Officer seat
     COL 3: Mandatory policy download links
   ═══════════════════════════════════════════════════════════════════ */

function GovernanceView() {
  const complianceOfficer = boardMembers.find(
    (m) => m.name.toLowerCase().includes("kavita")
  );

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

        {/* ── COLUMN 1: Board Committee structures ───────────────── */}
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

        {/* ── COLUMN 2: Compliance Officer seat ──────────────────── */}
        <div>
          <p className="text-slate-600 text-[10px] font-mono tracking-[0.32em] uppercase mb-6">
            02 &nbsp;·&nbsp; Compliance Officer
          </p>
          <div className="border-l-2 border-slate-700 pl-6 py-2 space-y-3">
            <p className="text-slate-50 text-xl md:text-2xl font-bold tracking-tighter">
              Ms. Kavita Rao
            </p>
            <p className="text-slate-400 text-sm">
              Company Secretary &amp; Compliance Officer
            </p>
            {complianceOfficer && (
              <p className="text-slate-500 text-[10px] font-mono tracking-[0.25em] uppercase">
                DIN&nbsp;{complianceOfficer.din} &nbsp;·&nbsp;{" "}
                {complianceOfficer.category}
              </p>
            )}
            <p className="text-slate-500 text-sm leading-relaxed pt-2">
              Kavita Rao holds an ACS qualification and{" "}
              {complianceOfficer?.qualifications ??
                "an LLB from Mumbai University"}
              . She serves as the designated Compliance Officer under SEBI
              LODR Regulation 6 and is responsible for all filings, board
              minutes, and regulatory correspondence with the exchanges.
            </p>
            <p className="text-slate-600 text-[10px] font-mono tracking-[0.25em] uppercase pt-2">
              Reachable at
            </p>
            <a
              href="mailto:compliance@koredigital.in"
              className="inline-block text-sm text-slate-300 opacity-70 hover:opacity-100 hover:text-slate-50 transition-opacity"
            >
              compliance@koredigital.in
            </a>
          </div>
        </div>

        {/* ── COLUMN 3: Mandatory policy downloads ───────────────── */}
        <div>
          <p className="text-slate-600 text-[10px] font-mono tracking-[0.32em] uppercase mb-6">
            03 &nbsp;·&nbsp; Statutory Policies
          </p>
          <div className="divide-y divide-slate-800/30">
            {highlightedPolicies.map((p) => (
              <div key={p.title} className="py-5 first:pt-0">
                <p className="text-slate-50 text-base font-semibold tracking-tight leading-tight">
                  {p.title}
                </p>
                <p className="text-slate-600 text-[10px] font-mono tracking-[0.25em] uppercase mt-2 mb-3">
                  {p.mandatoryUnder}
                </p>
                <a
                  href={p.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-300 opacity-70 hover:opacity-100 hover:text-slate-50 transition-opacity"
                >
                  Download PDF&nbsp;→
                </a>
              </div>
            ))}
          </div>

          <p className="text-slate-600 text-[10px] font-mono tracking-[0.25em] uppercase mt-8 leading-relaxed">
            The full statutory library — {policyDocuments.length} policies —
            is maintained by the Company Secretary. Contact
            compliance@koredigital.in for the complete archive.
          </p>
        </div>

      </div>
    </div>
  );
}
