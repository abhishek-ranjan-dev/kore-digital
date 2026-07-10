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
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/motion/Reveal";
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
/*
  Each group carries a colour scheme (accent = cyan, alt = amber,
  success = emerald). Every card in a group inherits its palette so
  the eyebrow, border, icon, gradient overlay, and hover glow read
  as a coherent family — same technique as the Consolidated
  Highlights headline metric cards up top.

  Tailwind JIT needs full literal class strings, so we bake every
  colour variant into the object instead of interpolating a token.
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
    eyebrow: "text-accent",
    border: "border-accent/30",
    hoverBorder: "hover:border-accent/60",
    gradient: "from-accent/[0.12]",
    glow: "hover:shadow-accent/10",
    icon: "text-accent",
    iconHover: "group-hover:text-accent",
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
    eyebrow: "text-alt",
    border: "border-alt/30",
    hoverBorder: "hover:border-alt/60",
    gradient: "from-alt/[0.12]",
    glow: "hover:shadow-alt/10",
    icon: "text-alt",
    iconHover: "group-hover:text-alt",
  },
  {
    heading: "Securities Compliance",
    keywords: ["Insider Trading", "Materiality of Events"],
    eyebrow: "text-success",
    border: "border-success/30",
    hoverBorder: "hover:border-success/60",
    gradient: "from-success/[0.12]",
    glow: "hover:shadow-success/10",
    icon: "text-success",
    iconHover: "group-hover:text-success",
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
  ── Latest-cycle headline metrics ────────────────────────────────────
  Sourced verbatim from the Q4 FY25 Investor Presentation
  (public/pdf-docs/investor-presentations/KDL-Q4-2025-1.pdf, slide 5).
  Do not alter without pointing at a newer authoritative PDF.

  Card treatment mirrors the About page "Key Figures" grid:
  cyan / amber / green / cyan accent rotation with matching
  border, subtle gradient overlay, and coloured shadow glow.
*/
const HEADLINE_METRICS = [
  {
    value: "₹327.82 Cr",
    label: "Total Income",
    accent: "text-accent",
    border: "border-accent/30",
    gradient: "from-accent/[0.12]",
    glow: "shadow-accent/10",
  },
  {
    value: "₹47.55 Cr",
    label: "Operational EBITDA",
    accent: "text-alt",
    border: "border-alt/30",
    gradient: "from-alt/[0.12]",
    glow: "shadow-alt/10",
  },
  {
    value: "₹31.70 Cr",
    label: "Profit After Tax (PAT)",
    accent: "text-success",
    border: "border-success/30",
    gradient: "from-success/[0.12]",
    glow: "shadow-success/10",
  },
  {
    value: "14.50%",
    label: "EBITDA Margin",
    accent: "text-accent",
    border: "border-accent/30",
    gradient: "from-accent/[0.12]",
    glow: "shadow-accent/10",
  },
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
      <main className="flex-1 pt-16 bg-bg text-neutral-100">

        {/*
          ── Full-width parallax hero ────────────────────────────────
          Handshake photograph pinned to the viewport via `md:bg-fixed`
          on desktop (same technique as the About / Field Operations
          heroes). On mobile the parallax falls back to a normal
          scrolling bg — iOS Safari doesn't reliably honour bg-fixed.
        */}
        <section
          className="relative overflow-hidden
                     bg-[url('/images/investor-relations/investor_realtions_main.jpg')]
                     bg-cover bg-center md:bg-fixed"
        >
          {/* Text-readability overlays — flat scrim + directional gradient */}
          <div className="absolute inset-0 bg-bg/55" aria-hidden="true" />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-bg/85 via-bg/50 to-bg/20"
          />
          {/* Bottom fade so the hero blends into the container below */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-bg"
          />

          {/* Overlay content — flex column that distributes strip up top,
              headline down bottom. min-h on THIS container so the flex has
              a real height to divide. */}
          <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 min-h-[440px] sm:min-h-[520px] md:min-h-[620px] flex flex-col justify-between gap-16">
            <p className="text-neutral-100 text-[10px] font-mono tracking-[0.32em] uppercase opacity-85">
              [ NSE:&nbsp;{keyMetrics.ticker} &nbsp;|&nbsp; ISIN:&nbsp;
              {keyMetrics.isin} &nbsp;|&nbsp; SEBI LODR 2015 ]
            </p>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-neutral-50 tracking-tighter leading-[0.92] drop-shadow-lg">
              Investor
              <br />
              Relations
            </h1>
          </div>
        </section>

        {/*
          First container — from hero down to the Tabs section.
          Only top padding: the Governance photograph band that
          follows starts flush against the Tabs section's bottom.
          A `pb-*` here would open a dead navy gap identical to
          the one we removed below the image band.
        */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-24 space-y-24 md:space-y-28">

          {/* ── Description under the hero ─────────────────────────── */}
          <p className="text-neutral-300 text-base md:text-lg leading-relaxed max-w-2xl">
            Kore Digital Limited&apos;s complete compliance repository —
            audited financial results, Regulation 30 stock-exchange
            disclosures, annual reports, board composition, and every
            statutory policy document filed under SEBI LODR Regulation
            46.
          </p>

          {/* ── Latest-cycle headline metrics — card grid ──────────── */}
          <section className="border-t border-neutral-500/30 pt-16 md:pt-20">
            {/* Centered header block — mirrors About page "Key Figures" */}
            <div className="text-center mb-12">
              <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-3">
                Latest Financial Cycle
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-50 tracking-tight">
                Consolidated Highlights
              </h2>
              <p className="text-neutral-500 text-[10px] font-mono tracking-[0.32em] uppercase mt-4">
                Source &nbsp;·&nbsp; Q4 FY25 Investor Presentation
              </p>
            </div>

            {/* 4 metric cards — staggered scroll-reveal, colour-tinted glow */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {HEADLINE_METRICS.map((m, i) => (
                <Reveal key={m.label} delay={i * 80} className="h-full">
                  <div
                    className={`h-full relative overflow-hidden bg-surface border ${m.border} rounded-2xl p-6 sm:p-8 flex flex-col gap-3 hover:shadow-xl ${m.glow} transition-shadow duration-300`}
                  >
                    {/* Subtle diagonal accent-tinted gradient overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${m.gradient} to-transparent pointer-events-none`}
                      aria-hidden="true"
                    />
                    <p
                      className={`relative text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums ${m.accent}`}
                    >
                      {m.value}
                    </p>
                    <p className="relative text-neutral-200 text-xs sm:text-sm leading-snug">
                      {m.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/*
            ── Tab switcher + panels ──────────────────────────────
            Flat section — hairline top border separates it from
            the Consolidated Highlights above, generous top padding
            gives it breathing room. No card chrome; the tab strip
            and its panels do the visual work.
          */}
          <section className="border-t border-neutral-500/30 pt-16 md:pt-20 space-y-16 md:space-y-20">
            <div>
              <p className="text-accent text-[10px] font-mono tracking-[0.32em] uppercase mb-6 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="inline-block w-6 h-px bg-accent/60"
                />
                Filings &nbsp;·&nbsp; Financial Statements
              </p>
              <div
                role="tablist"
                className="flex flex-wrap gap-x-10 md:gap-x-14 gap-y-2 border-b border-neutral-500/30"
              >
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  // Programmatic template-string driven active state
                  const buttonClass = [
                    "pb-5 -mb-px border-b-2 text-sm md:text-base font-semibold tracking-tight transition-all",
                    isActive
                      ? "border-neutral-50 text-neutral-50"
                      : "border-transparent text-neutral-400 opacity-80 hover:opacity-100 hover:text-neutral-100",
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
          </section>

          {/* ── Statutory Policies — separate standalone section ───── */}
          <PoliciesSection />

        </div>

        {/*
          ── Corporate Governance — full-viewport photograph band ──
          Rendered outside the max-w-7xl container so the image
          reaches the true viewport edges. Its own inner content
          is re-centered inside a max-w-7xl wrapper.
        */}
        <GovernanceSection />

        {/*
          Container reopens after the Governance photograph band.
          Only bottom padding — Contact & Registered Agents has
          its own `border-t` + top padding.
        */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 pb-16 md:pb-24 space-y-24 md:space-y-28">

          {/* ── Registered agents directory — animated card grid ───── */}
          <section className="border-t border-neutral-500/30 pt-16 md:pt-20 py-12">
            <p className="text-neutral-500 text-[10px] font-mono tracking-[0.32em] uppercase mb-10">
              Contact &nbsp;&amp;&nbsp; Registered Agents
            </p>
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

              {/* Company Secretary & Compliance Officer — Ms. Purnima Maheshwari */}
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
          </section>

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
    <div className="flex items-baseline justify-between pb-4 border-b border-neutral-500/30 mb-10 md:mb-12">
      <h3 className="text-neutral-50 font-bold text-2xl md:text-3xl tracking-tighter">
        {title}
      </h3>
      {meta && (
        <span className="text-neutral-400 text-[10px] font-mono uppercase tracking-[0.25em] shrink-0 ml-4">
          {meta}
        </span>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Registered-agent card — used in the Contact & Registered Agents grid
   at the bottom of the page. Elevated surface, icon accent, hover lift,
   affordance arrow on the CTA link.
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
    <div className="group relative h-full flex flex-col bg-surface border border-neutral-500/40 rounded-lg p-6 md:p-8 hover:border-neutral-400 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 transition-all duration-300">
      {/* Icon square */}
      <div className="w-11 h-11 rounded border border-neutral-500/40 bg-elevated/60 flex items-center justify-center mb-6 group-hover:border-accent/60 group-hover:bg-elevated transition-colors">
        <Icon className="w-4 h-4 text-accent" />
      </div>

      {/* Eyebrow */}
      <p className="text-neutral-500 text-[10px] font-mono tracking-[0.25em] uppercase mb-3">
        {eyebrow}
      </p>

      {/* Name */}
      <p className="text-neutral-50 text-lg font-semibold tracking-tight mb-4">
        {name}
      </p>

      {/* Address */}
      <p className="text-neutral-400 text-sm leading-relaxed mb-6 flex-grow">
        {address}
      </p>

      {/* Action link */}
      <a
        href={action.href}
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className="inline-flex items-center gap-1.5 text-sm text-neutral-100 opacity-80 group-hover:opacity-100 transition-opacity self-start pt-1 border-t border-neutral-500/30 group-hover:border-accent/50 w-full mt-auto pt-4"
      >
        <span className="group-hover:text-accent transition-colors">
          {action.label}
        </span>
        <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
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
              <tr className="border-b border-neutral-500/30">
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
                    className="px-2 py-4 text-left text-[10px] font-mono font-semibold text-neutral-400 uppercase tracking-[0.25em] whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-500/30">
              {historical.map((row) => (
                <tr
                  key={row.year}
                  className="transition-colors hover:bg-elevated/40"
                >
                  <td className="px-2 py-5 font-semibold text-neutral-50 whitespace-nowrap tracking-tight">
                    {formatFY(row.year)}
                  </td>
                  <td className="px-2 py-5 text-neutral-100 whitespace-nowrap tabular-nums">
                    {fmt(row.revenue)}
                  </td>
                  <td className="px-2 py-5 whitespace-nowrap tabular-nums">
                    {row.revenueGrowth === null ? (
                      <span className="text-neutral-600">—</span>
                    ) : row.revenueGrowth > 0 ? (
                      <span className="inline-flex items-center gap-1 text-success">
                        <TrendingUp className="w-3 h-3" />+
                        {row.revenueGrowth.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-danger">
                        <TrendingDown className="w-3 h-3" />
                        {row.revenueGrowth.toFixed(1)}%
                      </span>
                    )}
                  </td>
                  <td className="px-2 py-5 text-neutral-100 whitespace-nowrap tabular-nums">
                    {fmt(row.longTermBorrowings)}
                  </td>
                  <td className="px-2 py-5 text-neutral-100 whitespace-nowrap tabular-nums">
                    {fmt(row.workInProgress)}
                  </td>
                  <td className="px-2 py-5 text-neutral-100 whitespace-nowrap tabular-nums">
                    {fmt(row.netWorth)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-neutral-500 text-[10px] font-mono tracking-[0.25em] uppercase mt-6 max-w-2xl leading-relaxed">
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
        {/* Small-card grid — click opens a side drawer with PDF preview
            + financial highlights for that year. Cards use the same
            accent-tinted border + diagonal gradient treatment as the
            Statutory Policies cards for visual consistency across the
            page's compliance-document surfaces. */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {reportsWithUrl.map((row, i) => (
            <Reveal key={row.year} delay={i * 60} className="h-full">
              <button
                type="button"
                onClick={() => setSelectedReport(row)}
                className="relative overflow-hidden text-left w-full group h-full flex flex-col bg-surface border border-accent/30 rounded-lg p-5 md:p-6 hover:border-accent/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 cursor-pointer"
              >
                {/* Diagonal accent-tinted gradient overlay */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-br from-accent/[0.12] to-transparent pointer-events-none"
                />

                <FileText className="relative w-4 h-4 text-accent mb-5" />

                <p className="relative text-neutral-500 text-[10px] font-mono tracking-[0.32em] uppercase mb-2">
                  Fiscal Year
                </p>

                <p className="relative text-neutral-50 text-xl md:text-2xl font-bold tracking-tighter mb-6">
                  {formatFY(row.year)}
                </p>

                <span className="relative mt-auto inline-flex items-center gap-1.5 text-xs text-neutral-300 group-hover:text-accent transition-colors">
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
   clicked. Shows:
     • Header with filename, fiscal year label, close button
     • Left column: inline PDF preview (iframe)
     • Right column: the fiscal year's key financial figures with
       colour-coded YoY growth arrow
     • Footer with Download PDF + Open in New Tab actions

   Backdrop click, X button, and ESC key all dismiss. Body scroll locked
   while open.
   ═══════════════════════════════════════════════════════════════════ */

function ReportDrawer({
  report,
  onClose,
}: {
  report: FinancialYear | null;
  onClose: () => void;
}) {
  // ESC key + body scroll lock while open
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
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={
          report ? `Annual Report ${formatFY(report.year)}` : "Report drawer"
        }
        className={`fixed right-0 top-0 h-full w-full sm:max-w-[560px] lg:max-w-[920px] z-50 bg-bg border-l border-neutral-500/40 shadow-2xl shadow-black/70 transition-transform duration-300 ease-out ${
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
      accent: "text-alt",
    },
    {
      label: "Long-Term Borrowings",
      value: fmt(report.longTermBorrowings),
      delta: null,
      accent: "text-accent",
    },
    {
      label: "Work-in-Progress",
      value: fmt(report.workInProgress),
      delta: null,
      accent: "text-accent",
    },
    {
      label: "Net Worth",
      value: fmt(report.netWorth),
      delta: null,
      accent: "text-success",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ───────────────────────────────────────────────── */}
      <header className="flex items-start justify-between gap-4 px-6 md:px-8 py-5 border-b border-neutral-500/30 bg-surface/60">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded bg-danger/10 border border-danger/30 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-danger" />
          </div>
          <div className="min-w-0">
            <p className="text-neutral-50 text-sm font-semibold truncate">
              {filename}
            </p>
            <p className="text-neutral-400 text-xs mt-0.5">
              Kore Digital Limited &nbsp;·&nbsp; {formatFY(report.year)}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close report drawer"
          className="text-neutral-400 hover:text-neutral-50 hover:bg-elevated rounded p-2 transition-colors shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* ── Body: PDF preview + stats ────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid lg:grid-cols-5 gap-6 p-6 md:p-8">

          {/* PDF preview */}
          <div className="lg:col-span-3">
            <div className="text-neutral-500 text-[10px] font-mono tracking-[0.32em] uppercase mb-3">
              Document Preview
            </div>
            <div className="relative w-full aspect-[3/4] lg:aspect-auto lg:h-[500px] rounded-lg overflow-hidden border border-neutral-500/30 bg-neutral-100">
              <iframe
                src={`${report.annualReportUrl}#view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                title={`Annual Report — ${formatFY(report.year)}`}
                className="w-full h-full"
                loading="lazy"
              />
            </div>
          </div>

          {/* Stats column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="text-neutral-500 text-[10px] font-mono tracking-[0.32em] uppercase mb-3">
              Standalone Highlights
            </div>

            <div className="space-y-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="border border-neutral-500/30 rounded-lg p-4 bg-surface/60"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-neutral-500 text-[10px] font-mono tracking-[0.25em] uppercase">
                      {s.label}
                    </p>
                    {typeof s.delta === "number" && (
                      <span
                        className={`inline-flex items-center gap-0.5 text-xs font-bold ${
                          s.delta > 0 ? "text-success" : "text-danger"
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
                  <p
                    className={`text-2xl font-bold tracking-tighter tabular-nums ${s.accent}`}
                  >
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-neutral-500 text-[11px] leading-relaxed pt-2">
              All figures are standalone, sourced verbatim from the audited
              annual report for {formatFY(report.year)}. Refer to the full
              PDF for detailed segment reporting, cash-flow statement, and
              balance-sheet disclosures.
            </p>
          </div>

        </div>
      </div>

      {/* ── Footer actions ───────────────────────────────────────── */}
      <footer className="flex flex-col sm:flex-row items-stretch gap-3 px-6 md:px-8 py-5 border-t border-neutral-500/30 bg-surface/60">
        <a
          href={report.annualReportUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-bg font-bold text-sm px-4 py-3 rounded transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Open in New Tab
        </a>
        <a
          href={report.annualReportUrl}
          download={filename}
          className="flex-1 inline-flex items-center justify-center gap-2 border border-neutral-500 text-neutral-100 hover:border-accent hover:text-accent font-semibold text-sm px-4 py-3 rounded transition-colors"
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
    <div className="bg-neutral-700/10 border border-neutral-700/40 rounded-lg p-8 md:p-12">
      {/* Micro-tracked monospace status badge */}
      <p className="text-success/80 text-[10px] font-mono tracking-[0.25em] uppercase mb-6">
        [ Pipeline Status: Active ]
      </p>

      {/* Crisp white header line */}
      <h3 className="text-neutral-50 text-2xl md:text-3xl font-bold tracking-tighter mb-4">
        Exchange Disclosures Feed
      </h3>

      {/* Heavily muted body copy */}
      <p className="text-neutral-300 text-sm leading-relaxed max-w-xl">
        This chronological framework is ready to dynamically stream live
        statutory communications filed with the National Stock Exchange under
        SEBI Regulation 30 upon client document upload.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Corporate Governance — full-width standalone section
   Mounted below the Financials/Disclosures tabs callout. Editorial
   vertical stack:
     • Section header
     • Board of Directors (row list, name+designation+DIN)
     • Board Committees   (row list, name+chairperson+members)
     • Compliance Officer (blockquote callout — Ms. Purnima Maheshwari)
     • Statutory Policies (row list, clickable → PDF download)
   ═══════════════════════════════════════════════════════════════════ */

function GovernanceSection() {
  const executiveMembers = boardMembers.filter((m) => m.category === "Executive");
  const independentMembers = boardMembers.filter(
    (m) => m.category === "Independent" || m.category === "Non-Executive"
  );

  return (
    /*
      ── Photograph-backed section — full viewport width ───────
      Section lives outside the max-w-7xl page container so the
      image spans the true viewport width, left edge to right
      edge, just like the IR hero. Content inside is re-centered
      in its own max-w-7xl wrapper. Dark scrim overlays keep the
      dense text readable on the photograph.
    */
    <section
      className="relative overflow-hidden
                 bg-[url('/images/investor-relations/corporate_governance.jpg')]
                 bg-cover bg-center md:bg-fixed"
    >
      {/* Readability overlays — flat scrim + diagonal gradient */}
      <div aria-hidden="true" className="absolute inset-0 bg-bg/70" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-bg/85 via-bg/55 to-bg/35"
      />

      {/* Inner content wrapper — max-w centred inside the wide image */}
      <div
        className="relative max-w-7xl mx-auto
                   px-6 md:px-12 py-16 md:py-24
                   space-y-10 md:space-y-12"
      >

        {/* ── Section header ─────────────────────────────────── */}
        <div>
          <p className="text-accent text-[10px] font-mono tracking-[0.32em] uppercase mb-4 flex items-center gap-3">
            <span
              aria-hidden="true"
              className="inline-block w-6 h-px bg-accent/60"
            />
            Statutory Governance Framework
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-50 tracking-tighter leading-[0.95] mb-6 drop-shadow-lg">
            Corporate Governance
          </h2>
          <p className="text-neutral-200 text-base md:text-lg leading-relaxed max-w-2xl">
            Board composition, statutory committees, and the office of the
            Compliance Officer — the complete governance surface required
            under SEBI LODR Regulation 46, at a single glance.
          </p>
        </div>

        {/* ── Dense 3-column grid ──────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* ─── Column 1 · Board Composition ─────────────── */}
          <div>
            <p className="text-accent text-[10px] font-mono tracking-[0.32em] uppercase mb-5">
              01 · Board Composition
            </p>

            <p className="text-neutral-400 text-[9px] font-mono tracking-[0.28em] uppercase mb-2.5">
              Executive Leadership
            </p>
            <ul className="divide-y divide-neutral-500/30 border-y border-neutral-500/30 mb-6">
              {executiveMembers.map((m) => (
                <li key={m.name} className="py-2.5 leading-tight">
                  <p className="text-neutral-50 text-sm font-semibold tracking-tight">
                    {m.name}
                  </p>
                  <p className="text-neutral-300 text-xs mt-0.5">
                    {m.designation}
                  </p>
                </li>
              ))}
            </ul>

            <p className="text-neutral-400 text-[9px] font-mono tracking-[0.28em] uppercase mb-2.5">
              Independent Oversight
            </p>
            <ul className="divide-y divide-neutral-500/30 border-y border-neutral-500/30">
              {independentMembers.map((m) => (
                <li key={m.name} className="py-2.5 leading-tight">
                  <p className="text-neutral-50 text-sm font-semibold tracking-tight">
                    {m.name}
                  </p>
                  <p className="text-neutral-300 text-xs mt-0.5">
                    {m.designation}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* ─── Column 2 · Statutory Committees ──────────── */}
          <div>
            <p className="text-accent text-[10px] font-mono tracking-[0.32em] uppercase mb-5">
              02 · Statutory Committees
            </p>

            <p className="text-neutral-400 text-[9px] font-mono tracking-[0.28em] uppercase mb-2.5">
              Mandatory Under Companies Act &amp; SEBI LODR
            </p>
            <ul className="divide-y divide-neutral-500/30 border-y border-neutral-500/30">
              {committees.map((c) => (
                <li key={c.name} className="py-3 leading-tight">
                  <p className="text-neutral-50 text-sm font-semibold tracking-tight">
                    {c.name}
                  </p>
                  <p className="text-neutral-300 text-xs mt-1 leading-snug">
                    {c.shortBlurb}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* ─── Column 3 · Compliance Desk ───────────────── */}
          <div>
            <p className="text-accent text-[10px] font-mono tracking-[0.32em] uppercase mb-5">
              03 · Compliance Desk
            </p>

            {/* Glass card sits above the image for premium readability */}
            <div className="border border-neutral-500/40 rounded-lg bg-bg/70 backdrop-blur-sm p-5 shadow-lg shadow-black/30">
              <div className="flex items-start gap-3 mb-4">
                <div
                  aria-hidden="true"
                  className="shrink-0 w-10 h-10 rounded border border-accent/40 bg-accent/15 flex items-center justify-center"
                >
                  <ShieldCheck className="w-4 h-4 text-accent" />
                </div>
                <div className="min-w-0 leading-tight">
                  <p className="text-neutral-50 text-sm font-semibold tracking-tight">
                    Ms. Purnima Maheshwari
                  </p>
                  <p className="text-neutral-300 text-xs mt-0.5">
                    Company Secretary &amp; Compliance Officer
                  </p>
                </div>
              </div>

              <p className="text-success text-[9px] font-mono tracking-[0.28em] uppercase mb-4">
                [ SEBI LODR Regulation 6 Compliant ]
              </p>

              <dl className="border-t border-neutral-500/30 pt-4 space-y-3">
                <div>
                  <dt className="text-neutral-400 text-[9px] font-mono tracking-[0.28em] uppercase mb-1">
                    Email Desk
                  </dt>
                  <dd>
                    <a
                      href="mailto:cs@koredigital.com"
                      className="text-neutral-100 text-sm hover:text-accent transition-colors"
                    >
                      cs@koredigital.com
                    </a>
                  </dd>
                </div>

                <div>
                  <dt className="text-neutral-400 text-[9px] font-mono tracking-[0.28em] uppercase mb-1">
                    Registered Office
                  </dt>
                  <dd className="text-neutral-200 text-sm leading-snug">
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

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Statutory Policies — standalone full-width section

   Structure:
     • Editorial section header (Compliance Library eyebrow + big title)
     • Three category groups stacked, each with a monospace category
       eyebrow above a card grid
     • Side drawer (same behaviour as ReportDrawer): opens on card click,
       shows full-height PDF preview, ESC/backdrop/X to close
   ═══════════════════════════════════════════════════════════════════ */

function PoliciesSection() {
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyDocument | null>(
    null
  );

  return (
    <section className="border-t border-neutral-500/30 pt-16 md:pt-20 space-y-16 md:space-y-20">

      {/* ── Editorial section header ────────────────────────────── */}
      <div>
        <p className="text-accent text-[10px] font-mono tracking-[0.32em] uppercase mb-4 flex items-center gap-3">
          <span
            aria-hidden="true"
            className="inline-block w-6 h-px bg-accent/60"
          />
          Compliance Library &nbsp;·&nbsp; SEBI LODR Reg 46 &nbsp;·&nbsp;{" "}
          {policyDocuments.length} documents
        </p>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-50 tracking-tighter leading-[0.95] mb-6">
          Statutory Policies
        </h2>
        <p className="text-neutral-300 text-base md:text-lg leading-relaxed max-w-2xl">
          The complete mandatory policy library — every document filed under
          SEBI LODR Regulation 46, organised by regulatory subject area for
          audit-friendly retrieval.
        </p>
      </div>

      {/* ── Grouped card grid ─────────────────────────────────────
          Each group inherits its palette from POLICY_GROUPS:
            • Core Governance   → accent (cyan)
            • Operations        → alt    (amber)
            • Securities        → success (emerald)
          Cards use the same border + tinted gradient + coloured
          glow treatment as the Consolidated Highlights metric cards. */}
      <div className="space-y-12 md:space-y-14">
        {POLICY_GROUPS.map((group) => {
          const items = policiesInGroup(group.keywords);
          if (items.length === 0) return null;
          return (
            <div key={group.heading}>
              <p
                className={`${group.eyebrow} text-[10px] font-mono tracking-[0.28em] uppercase mb-5 flex items-center gap-3`}
              >
                <span
                  aria-hidden="true"
                  className={`inline-block w-6 h-px bg-current opacity-60`}
                />
                {group.heading}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {items.map((policy, i) => (
                  <Reveal
                    key={policy.title}
                    delay={i * 60}
                    className="h-full"
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedPolicy(policy)}
                      className={`relative overflow-hidden text-left w-full group h-full flex flex-col bg-surface border ${group.border} rounded-lg p-5 md:p-6 ${group.hoverBorder} hover:-translate-y-1 hover:shadow-xl ${group.glow} transition-all duration-300 cursor-pointer`}
                    >
                      {/* Diagonal tint gradient — mirrors headline metric cards */}
                      <div
                        aria-hidden="true"
                        className={`absolute inset-0 bg-gradient-to-br ${group.gradient} to-transparent pointer-events-none`}
                      />

                      <FileText
                        className={`relative w-4 h-4 ${group.icon} mb-5`}
                      />

                      <p className="relative text-neutral-50 text-sm md:text-base font-semibold tracking-tight leading-snug mb-6">
                        {policy.title}
                      </p>

                      <span
                        className={`relative mt-auto inline-flex items-center gap-1.5 text-xs text-neutral-300 ${group.iconHover} transition-colors`}
                      >
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

      {/* ── Side drawer ─────────────────────────────────────────── */}
      <PolicyDrawer
        policy={selectedPolicy}
        onClose={() => setSelectedPolicy(null)}
      />

    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Policy side drawer — mirrors the ReportDrawer pattern. Slides in
   from the right when a policy card is clicked. Shows:
     • Header with policy title, regulation, and close button
     • Left column: inline PDF preview (iframe)
     • Right column: regulation citation, overview, last updated
     • Footer with Open in New Tab + Download PDF actions
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
        className={`fixed right-0 top-0 h-full w-full sm:max-w-[560px] lg:max-w-[920px] z-50 bg-bg border-l border-neutral-500/40 shadow-2xl shadow-black/70 transition-transform duration-300 ease-out ${
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
      {/* Header */}
      <header className="flex items-start justify-between gap-4 px-6 md:px-8 py-5 border-b border-neutral-500/30 bg-surface/60">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded bg-accent/10 border border-accent/30 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-accent" />
          </div>
          <div className="min-w-0">
            <p className="text-neutral-50 text-sm font-semibold leading-snug">
              {policy.title}
            </p>
            <p className="text-neutral-400 text-[10px] font-mono tracking-[0.25em] uppercase mt-1">
              {policy.mandatoryUnder}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close policy drawer"
          className="text-neutral-400 hover:text-neutral-50 hover:bg-elevated rounded p-2 transition-colors shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Body — full-height PDF preview, no metadata sidebar */}
      <div className="flex-1 p-6 md:p-8 min-h-0">
        <div className="w-full h-full rounded-lg overflow-hidden border border-neutral-500/30 bg-neutral-100">
          <iframe
            src={`${policy.fileUrl}#view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
            title={policy.title}
            className="w-full h-full"
            loading="lazy"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="flex flex-col sm:flex-row items-stretch gap-3 px-6 md:px-8 py-5 border-t border-neutral-500/30 bg-surface/60">
        <a
          href={policy.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-bg font-bold text-sm px-4 py-3 rounded transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Open in New Tab
        </a>
        <a
          href={policy.fileUrl}
          download={filename}
          className="flex-1 inline-flex items-center justify-center gap-2 border border-neutral-500 text-neutral-100 hover:border-accent hover:text-accent font-semibold text-sm px-4 py-3 rounded transition-colors"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </a>
      </footer>
    </div>
  );
}
