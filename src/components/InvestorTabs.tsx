"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { financials } from "@/data/financials";
import { disclosures, type DisclosureCategory } from "@/data/disclosures";
import {
  boardMembers,
  committees,
  policyDocuments,
} from "@/data/governance";

const TABS = [
  { id: "financials", label: "Financial Performance" },
  { id: "disclosures", label: "Exchange Disclosures" },
  { id: "governance", label: "Corporate Governance" },
] as const;

type TabId = (typeof TABS)[number]["id"];

/* ─── Formatting helpers ─────────────────────────────────────────── */

function fmt(n: number | null) {
  if (n === null) return "—";
  return `₹${n.toFixed(1)} Cr`;
}

function formatFY(year: string) {
  // "FY24-25" → "FY 2024–25"
  const match = year.match(/FY(\d{2})-(\d{2})/);
  if (!match) return year;
  return `FY 20${match[1]}–${match[2]}`;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return {
    day: d.getDate().toString().padStart(2, "0"),
    monthShort: d
      .toLocaleDateString("en-IN", { month: "short" })
      .toUpperCase(),
    year: d.getFullYear(),
  };
}

/* ═══════════════════════════════════════════════════════════════════
   Section header — the "razor-sharp" editorial section title
   used at the top of every content block on the page.
   ═══════════════════════════════════════════════════════════════════ */
function SectionHead({
  title,
  meta,
}: {
  title: string;
  meta?: string;
}) {
  return (
    <div className="flex items-baseline justify-between pb-4 border-b border-slate-800/40 mb-10 md:mb-12">
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
   TAB 1 — Financial Performance
   ═══════════════════════════════════════════════════════════════════ */
function FinancialsTab() {
  const latest = financials.find(
    (f) => !f.isProjected && f.revenue !== null
  );

  const summary = [
    { label: "Latest Revenue", value: fmt(latest?.revenue ?? null) },
    { label: "LT Borrowings", value: fmt(latest?.longTermBorrowings ?? null) },
    { label: "Work-in-Progress", value: fmt(latest?.workInProgress ?? null) },
    { label: "Net Worth", value: fmt(latest?.netWorth ?? null) },
  ];

  const historical = [...financials].reverse();
  const annualReports = [...financials]
    .reverse()
    .filter((f) => !f.isProjected);

  return (
    <div className="space-y-20 md:space-y-24">

      {/* ── Key figures — inline editorial row (no boxes) ─────────── */}
      <section>
        <p className="text-slate-600 text-[10px] font-mono tracking-[0.32em] uppercase mb-6">
          Key figures &nbsp;·&nbsp; {latest?.year ?? ""}
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-6 md:divide-x md:divide-slate-800/40">
          {summary.map((m, i) => (
            <div
              key={m.label}
              className={`space-y-2 ${i === 0 ? "" : "md:pl-8"}`}
            >
              <p className="text-slate-500 text-[10px] font-mono tracking-[0.25em] uppercase">
                {m.label}
              </p>
              <p className="text-3xl md:text-4xl font-bold text-slate-50 tracking-tighter">
                {m.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Historical summary — clean stripped table ─────────────── */}
      <section>
        <SectionHead title="Historical Summary" meta="Figures in ₹ Cr" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="border-b border-slate-800/40">
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
            <tbody className="divide-y divide-slate-800/40">
              {historical.map((row) => (
                <tr
                  key={row.year}
                  className={`transition-colors hover:bg-slate-900/40 ${
                    row.isProjected ? "opacity-60" : ""
                  }`}
                >
                  <td className="px-2 py-4 font-semibold text-slate-50 whitespace-nowrap tracking-tight">
                    {formatFY(row.year)}
                    {row.isProjected && (
                      <span className="ml-3 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                        ongoing
                      </span>
                    )}
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

      {/* ── Annual Reports — tabular row-by-row, not cards ─────────── */}
      <section>
        <SectionHead
          title="Annual Reports"
          meta={`${annualReports.length} filings`}
        />
        <div className="divide-y divide-slate-800/40">
          {annualReports.map((row) => (
            <article
              key={row.year}
              className="grid grid-cols-12 gap-4 py-7 md:py-9 items-baseline group"
            >
              {/* Left — massive Fiscal Year */}
              <div className="col-span-12 md:col-span-4 space-y-1">
                <p className="text-slate-600 text-[10px] font-mono tracking-[0.32em] uppercase">
                  Fiscal Year
                </p>
                <p className="text-slate-50 text-3xl md:text-4xl font-bold tracking-tighter">
                  {formatFY(row.year)}
                </p>
              </div>

              {/* Centre — inline document tags */}
              <div className="col-span-12 md:col-span-5 flex flex-wrap gap-x-5 gap-y-1.5">
                {[
                  "Annual Report",
                  "Auditor's Note",
                  "Notice of AGM",
                ].map((label) => (
                  <span
                    key={label}
                    className="text-slate-400 text-sm"
                  >
                    {label}
                  </span>
                ))}
              </div>

              {/* Right — opacity-hover text button */}
              <div className="col-span-12 md:col-span-3 flex md:justify-end">
                <a
                  href={row.annualReportUrl}
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
   TAB 2 — Exchange Disclosures
   ═══════════════════════════════════════════════════════════════════ */
function DisclosuresTab() {
  const allCategories = Array.from(
    new Set(disclosures.map((d) => d.category))
  ) as DisclosureCategory[];

  const [activeFilter, setActiveFilter] = useState<
    DisclosureCategory | "All"
  >("All");

  const filtered =
    activeFilter === "All"
      ? disclosures
      : disclosures.filter((d) => d.category === activeFilter);

  return (
    <div className="space-y-12">
      <SectionHead
        title="Regulation 30 Disclosures"
        meta={`${filtered.length} filings`}
      />

      {/* ── Filter row — text-only, opacity hover ─────────────────── */}
      <div className="flex items-baseline flex-wrap gap-x-5 gap-y-2 text-sm -mt-4">
        <p className="text-slate-600 text-[10px] font-mono tracking-[0.32em] uppercase mr-2">
          Filter
        </p>
        {(["All", ...allCategories] as const).map((cat) => {
          const isActive = activeFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`transition-opacity ${
                isActive
                  ? "text-slate-50 font-semibold"
                  : "text-slate-500 opacity-80 hover:opacity-100 hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* ── Row-by-row filings list ───────────────────────────────── */}
      <div className="divide-y divide-slate-800/40 pt-2">
        {filtered.map((item) => {
          const d = formatDate(item.date);
          return (
            <article
              key={item.id}
              className="grid grid-cols-12 gap-4 py-6 md:py-7 items-baseline"
            >
              {/* Date column */}
              <div className="col-span-12 md:col-span-2">
                <p className="text-slate-600 text-[10px] font-mono tracking-[0.32em] uppercase mb-1">
                  {d.monthShort}&nbsp;{d.year}
                </p>
                <p className="text-slate-50 text-2xl md:text-3xl font-bold tracking-tighter">
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

              {/* Download */}
              <div className="col-span-12 md:col-span-3 flex md:justify-end">
                <a
                  href={item.fileUrl}
                  className="text-sm text-slate-300 opacity-70 hover:opacity-100 hover:text-slate-50 transition-opacity"
                >
                  View PDF&nbsp;→
                </a>
              </div>
            </article>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-20 text-center text-slate-500 text-sm">
            No disclosures found for this category.
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TAB 3 — Corporate Governance
   ═══════════════════════════════════════════════════════════════════ */
function GovernanceTab() {
  const [openCommittee, setOpenCommittee] = useState<string | null>(null);
  const [openPolicy, setOpenPolicy] = useState<string | null>(null);

  return (
    <div className="space-y-24 md:space-y-28">

      {/* ── Board of Directors — editorial 2-column list ──────────── */}
      <section>
        <SectionHead
          title="Board of Directors"
          meta={`${boardMembers.length} members`}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-14">
          {boardMembers.map((member) => (
            <div key={member.din} className="space-y-2">
              <p className="text-slate-600 text-[10px] font-mono tracking-[0.32em] uppercase">
                {member.category}&nbsp;&nbsp;·&nbsp;&nbsp;DIN&nbsp;
                {member.din}
              </p>
              <h4 className="text-slate-50 text-xl md:text-2xl font-bold tracking-tighter">
                {member.name}
              </h4>
              <p className="text-slate-400 text-sm">{member.designation}</p>
              <p className="text-slate-500 text-sm leading-relaxed pt-2">
                {member.qualifications}. On the Board since {member.since}.
              </p>
              <p className="text-slate-500 text-sm leading-relaxed">
                {member.experience}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Committees — expandable left-accent rows ─────────────── */}
      <section>
        <SectionHead
          title="Board Committees"
          meta={`${committees.length} committees`}
        />
        <div className="space-y-3">
          {committees.map((c) => {
            const isOpen = openCommittee === c.name;
            return (
              <div
                key={c.name}
                className={`border-l-2 py-6 px-6 transition-colors ${
                  isOpen
                    ? "border-slate-400 bg-[#090d16]"
                    : "border-slate-700 hover:border-slate-500"
                }`}
              >
                <button
                  className="w-full text-left flex items-baseline justify-between gap-4"
                  onClick={() =>
                    setOpenCommittee(isOpen ? null : c.name)
                  }
                >
                  <div>
                    <p className="text-slate-50 font-bold text-lg md:text-xl tracking-tight">
                      {c.name}
                    </p>
                    <p className="text-slate-500 text-sm mt-1">
                      Chairperson:&nbsp;{c.chairman}
                    </p>
                  </div>
                  <span className="text-slate-500 text-xs font-mono uppercase tracking-[0.25em] opacity-70 hover:opacity-100 transition-opacity shrink-0">
                    {isOpen ? "Close" : "Expand"}
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100 mt-6"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-slate-600 text-[10px] font-mono tracking-[0.25em] uppercase mb-3">
                      {c.mandatoryUnder}
                    </p>
                    <p className="text-slate-300 text-sm leading-relaxed mb-5">
                      {c.purpose}
                    </p>
                    <p className="text-slate-600 text-[10px] font-mono tracking-[0.25em] uppercase mb-2">
                      Members
                    </p>
                    <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                      {c.members.map((m) => (
                        <span
                          key={m}
                          className={`text-sm ${
                            m === c.chairman
                              ? "text-slate-50 font-semibold"
                              : "text-slate-400"
                          }`}
                        >
                          {m}
                          {m === c.chairman && (
                            <span className="text-slate-500 ml-1">★</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Statutory Policies — expandable left-accent rows ─────── */}
      <section>
        <SectionHead
          title="Statutory Policies"
          meta={`${policyDocuments.length} documents`}
        />
        <div className="space-y-3">
          {policyDocuments.map((doc) => {
            const isOpen = openPolicy === doc.title;
            return (
              <div
                key={doc.title}
                className={`border-l-2 py-6 px-6 transition-colors ${
                  isOpen
                    ? "border-slate-400 bg-[#090d16]"
                    : "border-slate-700 hover:border-slate-500"
                }`}
              >
                <button
                  className="w-full text-left flex items-baseline justify-between gap-4"
                  onClick={() => setOpenPolicy(isOpen ? null : doc.title)}
                >
                  <p className="text-slate-50 font-bold text-lg md:text-xl tracking-tight">
                    {doc.title}
                  </p>
                  <span className="text-slate-500 text-xs font-mono uppercase tracking-[0.25em] opacity-70 hover:opacity-100 transition-opacity shrink-0">
                    {isOpen ? "Close" : "Expand"}
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100 mt-5"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-slate-600 text-[10px] font-mono tracking-[0.25em] uppercase mb-3">
                      {doc.mandatoryUnder}
                    </p>
                    <p className="text-slate-300 text-sm leading-relaxed mb-5">
                      {doc.description}
                    </p>
                    <div className="flex items-baseline justify-between">
                      <p className="text-slate-500 text-[11px] font-mono uppercase tracking-widest">
                        Last updated:&nbsp;{doc.lastUpdated}
                      </p>
                      <a
                        href={doc.fileUrl}
                        className="text-sm text-slate-300 opacity-70 hover:opacity-100 hover:text-slate-50 transition-opacity"
                      >
                        Download PDF&nbsp;→
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Main tab switcher
   ═══════════════════════════════════════════════════════════════════ */
export default function InvestorTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("financials");

  return (
    <div className="space-y-16 md:space-y-20">
      {/* Editorial tab bar — text-only, active tab has white underline */}
      <div className="flex flex-wrap gap-x-10 md:gap-x-14 gap-y-2 border-b border-slate-800/40">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-5 -mb-px border-b-2 text-sm md:text-base font-semibold tracking-tight transition-all ${
                isActive
                  ? "border-slate-50 text-slate-50"
                  : "border-transparent text-slate-500 opacity-80 hover:opacity-100 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div>
        {activeTab === "financials" && <FinancialsTab />}
        {activeTab === "disclosures" && <DisclosuresTab />}
        {activeTab === "governance" && <GovernanceTab />}
      </div>
    </div>
  );
}
