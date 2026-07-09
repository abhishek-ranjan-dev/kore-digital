"use client";

import { useState } from "react";
import {
  Download,
  TrendingUp,
  TrendingDown,
  FileText,
  Filter,
  Users,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { financials } from "@/data/financials";
import { disclosures, type DisclosureCategory } from "@/data/disclosures";
import {
  boardMembers,
  committees,
  policyDocuments,
} from "@/data/governance";

const TABS = [
  { id: "financials", label: "Financial Performance", icon: TrendingUp },
  { id: "disclosures", label: "Stock Exchange Disclosures", icon: FileText },
  { id: "governance", label: "Corporate Governance", icon: Users },
] as const;

type TabId = (typeof TABS)[number]["id"];

const CATEGORY_COLORS: Record<DisclosureCategory, string> = {
  "Board Meeting": "bg-slate-700/60 text-slate-300",
  "Financial Results": "bg-emerald-400/10 text-emerald-400",
  "Analyst Meet": "bg-cyan-400/10 text-cyan-400",
  "Newspaper Ad": "bg-slate-600/60 text-slate-400",
  "Material Update": "bg-amber-400/10 text-amber-400",
  "AGM / EGM": "bg-purple-400/10 text-purple-400",
  "Investor Presentation": "bg-blue-400/10 text-blue-400",
  "Shareholding Pattern": "bg-indigo-400/10 text-indigo-400",
  "Corporate Action": "bg-pink-400/10 text-pink-400",
};

const MEMBER_CATEGORY_COLORS = {
  Executive: "bg-cyan-400/10 text-cyan-400 border border-cyan-400/20",
  "Non-Executive": "bg-slate-600/50 text-slate-300 border border-slate-500/30",
  Independent: "bg-amber-400/10 text-amber-400 border border-amber-400/20",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function fmt(n: number | null) {
  if (n === null) return "—";
  return `₹${n.toFixed(1)} Cr`;
}

/* ─── Tab 1: Financial Performance ─── */
function FinancialsTab() {
  const latest = financials.find((f) => !f.isProjected && f.revenue !== null);
  const prev = latest
    ? financials[financials.indexOf(latest) - 1]
    : null;

  const summaryMetrics = [
    {
      label: "Latest Revenue",
      value: fmt(latest?.revenue ?? null),
      sub: latest?.year ?? "",
      positive: true,
    },
    {
      label: "Long-Term Borrowings",
      value: fmt(latest?.longTermBorrowings ?? null),
      sub: latest?.year ?? "",
      positive: null,
    },
    {
      label: "Work-in-Progress",
      value: fmt(latest?.workInProgress ?? null),
      sub: latest?.year ?? "",
      positive: true,
    },
    {
      label: "Net Worth",
      value: fmt(latest?.netWorth ?? null),
      sub: latest?.year ?? "",
      positive: true,
    },
  ];

  return (
    <div className="space-y-10">
      {/* KPI summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryMetrics.map((m) => (
          <div
            key={m.label}
            className="bg-kd-card border border-kd-border rounded-xl p-5 space-y-2"
          >
            <p className="text-slate-500 text-xs uppercase tracking-widest">
              {m.label}
            </p>
            <p className="text-2xl font-bold text-white">{m.value}</p>
            <p className="text-slate-500 text-xs">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Financial history table */}
      <div>
        <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          Historical Financial Summary
          <span className="text-slate-600 font-normal text-xs ml-1">
            (All figures in ₹ Crores)
          </span>
        </h3>
        <div className="overflow-x-auto rounded-xl border border-kd-border">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="bg-kd-elevated border-b border-kd-border">
                {[
                  "Year",
                  "Revenue",
                  "YoY Growth",
                  "LT Borrowings",
                  "Work-in-Progress",
                  "Net Worth",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...financials].reverse().map((row, i) => (
                <tr
                  key={row.year}
                  className={`border-b border-kd-border last:border-0 transition-colors hover:bg-kd-elevated/60 ${
                    row.isProjected ? "opacity-60" : ""
                  }`}
                >
                  <td className="px-4 py-3.5 font-semibold text-white whitespace-nowrap">
                    {row.year}
                    {row.isProjected && (
                      <span className="ml-2 text-[10px] text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded px-1.5 py-0.5">
                        Ongoing
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-slate-300 whitespace-nowrap">
                    {fmt(row.revenue)}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {row.revenueGrowth === null ? (
                      <span className="text-slate-600">—</span>
                    ) : row.revenueGrowth > 0 ? (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <TrendingUp className="w-3.5 h-3.5" />
                        +{row.revenueGrowth.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-400">
                        <TrendingDown className="w-3.5 h-3.5" />
                        {row.revenueGrowth.toFixed(1)}%
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-slate-300 whitespace-nowrap">
                    {fmt(row.longTermBorrowings)}
                  </td>
                  <td className="px-4 py-3.5 text-slate-300 whitespace-nowrap">
                    {fmt(row.workInProgress)}
                  </td>
                  <td className="px-4 py-3.5 text-slate-300 whitespace-nowrap">
                    {fmt(row.netWorth)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Annual report cards */}
      <div>
        <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-400" />
          Annual Reports
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[...financials]
            .reverse()
            .filter((f) => !f.isProjected)
            .map((row) => (
              <a
                key={row.year}
                href={row.annualReportUrl}
                className="group flex flex-col gap-3 bg-kd-card border border-kd-border rounded-xl p-5 hover:border-amber-400/40 hover:bg-kd-elevated transition-all"
              >
                <FileText className="w-7 h-7 text-slate-500 group-hover:text-amber-400 transition-colors" />
                <div>
                  <p className="text-white font-semibold text-sm">{row.year}</p>
                  <p className="text-slate-500 text-xs">Annual Report</p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-medium mt-auto">
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </span>
              </a>
            ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Tab 2: Disclosures ─── */
function DisclosuresTab() {
  const allCategories = Array.from(
    new Set(disclosures.map((d) => d.category))
  ) as DisclosureCategory[];

  const [activeFilter, setActiveFilter] = useState<DisclosureCategory | "All">("All");

  const filtered =
    activeFilter === "All"
      ? disclosures
      : disclosures.filter((d) => d.category === activeFilter);

  return (
    <div className="space-y-6">
      {/* Filter pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-slate-500 shrink-0" />
        {(["All", ...allCategories] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
              activeFilter === cat
                ? "bg-cyan-400/15 border-cyan-400/50 text-cyan-300 font-semibold"
                : "bg-kd-card border-kd-border text-slate-400 hover:border-kd-border-hi hover:text-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Disclosure list */}
      <div className="rounded-xl border border-kd-border overflow-hidden">
        {filtered.map((item, i) => (
          <div
            key={item.id}
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-kd-elevated ${
              i < filtered.length - 1 ? "border-b border-kd-border" : ""
            }`}
          >
            <div className="flex items-start gap-4 min-w-0">
              {/* Date */}
              <div className="shrink-0 text-center min-w-[52px]">
                <p className="text-white text-sm font-bold leading-none">
                  {new Date(item.date).getDate().toString().padStart(2, "0")}
                </p>
                <p className="text-slate-500 text-[10px] uppercase tracking-wide">
                  {new Date(item.date).toLocaleDateString("en-IN", {
                    month: "short",
                  })}
                </p>
                <p className="text-slate-600 text-[10px]">
                  {new Date(item.date).getFullYear()}
                </p>
              </div>
              {/* Divider */}
              <div className="w-px self-stretch bg-kd-border shrink-0" />
              {/* Content */}
              <div className="min-w-0 space-y-1.5">
                <p className="text-slate-200 text-sm font-medium leading-snug">
                  {item.title}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      CATEGORY_COLORS[item.category]
                    }`}
                  >
                    {item.category}
                  </span>
                  <span className="text-[10px] text-slate-600 border border-kd-border rounded px-1.5 py-0.5">
                    {item.exchange}
                  </span>
                </div>
              </div>
            </div>
            {/* Download */}
            <a
              href={item.fileUrl}
              className="shrink-0 inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 border border-kd-border hover:border-cyan-400/40 px-3 py-2 rounded transition-all bg-kd-card hover:bg-kd-elevated"
            >
              <Download className="w-3.5 h-3.5" /> PDF
            </a>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="px-5 py-10 text-center text-slate-500 text-sm">
            No disclosures found for this category.
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Tab 3: Corporate Governance ─── */
function GovernanceTab() {
  const [openCommittee, setOpenCommittee] = useState<string | null>(null);

  return (
    <div className="space-y-12">
      {/* Board of Directors */}
      <div>
        <h3 className="text-white font-semibold text-sm mb-5 flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-400" />
          Board of Directors
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {boardMembers.map((member) => (
            <div
              key={member.din}
              className="bg-kd-card border border-kd-border rounded-xl p-5 space-y-3 hover:border-kd-border-hi transition-colors"
            >
              {/* Avatar placeholder */}
              <div className="w-10 h-10 rounded-full bg-kd-elevated border border-kd-border flex items-center justify-center text-sm font-bold text-slate-400">
                {member.name
                  .split(" ")
                  .filter((w) => w.match(/^[A-Z]/))
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join("")}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{member.name}</p>
                <p className="text-slate-500 text-xs mt-0.5">{member.designation}</p>
              </div>
              <span
                className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  MEMBER_CATEGORY_COLORS[member.category]
                }`}
              >
                {member.category}
              </span>
              <div className="space-y-1 pt-1 border-t border-kd-border">
                <p className="text-slate-500 text-[11px]">
                  <span className="text-slate-600">DIN: </span>
                  {member.din}
                </p>
                <p className="text-slate-500 text-[11px]">
                  <span className="text-slate-600">On Board since: </span>
                  {member.since}
                </p>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  {member.qualifications}
                </p>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                {member.experience}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Committees */}
      <div>
        <h3 className="text-white font-semibold text-sm mb-5 flex items-center gap-2">
          <Filter className="w-4 h-4 text-amber-400" />
          Board Committees
        </h3>
        <div className="space-y-3">
          {committees.map((c) => {
            const isOpen = openCommittee === c.name;
            return (
              <div
                key={c.name}
                className="bg-kd-card border border-kd-border rounded-xl overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-kd-elevated transition-colors"
                  onClick={() =>
                    setOpenCommittee(isOpen ? null : c.name)
                  }
                >
                  <div className="space-y-0.5">
                    <p className="text-white font-semibold text-sm">{c.name}</p>
                    <p className="text-slate-500 text-[11px]">
                      Chairperson: {c.chairman}
                    </p>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-2 border-t border-kd-border space-y-3">
                    <p className="text-slate-500 text-xs">
                      <span className="text-slate-600">Mandatory under: </span>
                      {c.mandatoryUnder}
                    </p>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {c.purpose}
                    </p>
                    <div>
                      <p className="text-slate-600 text-xs mb-2">Members:</p>
                      <div className="flex flex-wrap gap-2">
                        {c.members.map((m) => (
                          <span
                            key={m}
                            className={`text-[11px] px-2.5 py-1 rounded-full bg-kd-elevated border border-kd-border ${
                              m === c.chairman
                                ? "text-amber-400 border-amber-400/25"
                                : "text-slate-300"
                            }`}
                          >
                            {m}
                            {m === c.chairman && (
                              <span className="ml-1 text-amber-500/70">
                                ★
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Policy Documents */}
      <div>
        <h3 className="text-white font-semibold text-sm mb-5 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          Statutory Policy Documents
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {policyDocuments.map((doc) => (
            <div
              key={doc.title}
              className="flex gap-4 bg-kd-card border border-kd-border rounded-xl p-5 hover:border-indigo-400/30 hover:bg-kd-elevated transition-all group"
            >
              <FileText className="w-8 h-8 text-indigo-400/60 group-hover:text-indigo-400 transition-colors shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <p className="text-white font-medium text-sm leading-snug">
                  {doc.title}
                </p>
                <p className="text-slate-500 text-[10px] leading-snug">
                  {doc.mandatoryUnder}
                </p>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {doc.description}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <p className="text-slate-600 text-[10px]">
                    Updated: {doc.lastUpdated}
                  </p>
                  <a
                    href={doc.fileUrl}
                    className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                  >
                    <Download className="w-3 h-3" /> Download
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main InvestorTabs component ─── */
export default function InvestorTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("financials");

  return (
    <div className="space-y-8">
      {/* Tab switcher */}
      <div className="flex flex-wrap gap-2 border-b border-kd-border pb-0">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-all ${
                isActive
                  ? "border-cyan-400 text-cyan-300"
                  : "border-transparent text-slate-500 hover:text-slate-200 hover:border-slate-500"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">
                {tab.label.split(" ")[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab panels */}
      <div>
        {activeTab === "financials" && <FinancialsTab />}
        {activeTab === "disclosures" && <DisclosuresTab />}
        {activeTab === "governance" && <GovernanceTab />}
      </div>
    </div>
  );
}
