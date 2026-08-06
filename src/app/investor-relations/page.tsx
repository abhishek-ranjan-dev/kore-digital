"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
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
  LineChart,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/motion/Reveal";
import SectionBadge from "@/components/ui/SectionBadge";
import InvestorStockSection from "@/components/stock/InvestorStockSection";
import IRSubNav from "@/components/ir/IRSubNav";
import RevenueTrajectory from "@/components/ir/RevenueTrajectory";
import { keyMetrics } from "@/data/financials";
import {
  SEED_PAYLOAD,
  type FinancialsPayload,
  type FinancialYear,
} from "@/lib/financials-data";
import { boardMembers, committees } from "@/data/governance";
import {
  SEED_POLICIES_PAYLOAD,
  type PoliciesPayload,
  type PolicyItem,
} from "@/lib/policies-data";

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

/** "FY19-20" → 2019 (the April start year); null if unparseable. */
function fyStartYear(year: string): number | null {
  const m = year.match(/FY(\d{2})-(\d{2})/);
  return m ? 2000 + Number(m[1]) : null;
}

/** 2019 → "FY19-20". */
function shortFY(startYear: number): string {
  const a = String(startYear % 100).padStart(2, "0");
  const b = String((startYear + 1) % 100).padStart(2, "0");
  return `FY${a}-${b}`;
}

/* ═══════════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════════ */

export default function InvestorRelationsPage() {
  // Seed renders instantly (SSR + first paint); Supabase data overrides it
  // once fetched, so a new /admin submission shows up on the next load.
  const [payload, setPayload] = useState<FinancialsPayload>(SEED_PAYLOAD);

  useEffect(() => {
    let alive = true;
    fetch("/api/financials")
      .then((r) => r.json())
      .then((d) => {
        if (alive && d && Array.isArray(d.financials)) setPayload(d);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const financials = payload.financials;
  const lc = payload.latestConsolidated;

  // FY-headline scorecard, derived from the latest consolidated row.
  const fmtDelta = (n: number | null | undefined) =>
    n == null ? undefined : `${n >= 0 ? "+" : ""}${n.toFixed(0)}%`;
  const headline: {
    value: string;
    unit?: string;
    label: string;
    delta?: string;
  }[] = lc
    ? [
        {
          value: `₹${lc.totalIncome.toFixed(2)}`,
          unit: "Cr",
          label: "Total Income",
          delta: fmtDelta(lc.deltas.totalIncome),
        },
        {
          value: `₹${lc.operationalEbitda.toFixed(2)}`,
          unit: "Cr",
          label: "Operational EBITDA",
          delta: fmtDelta(lc.deltas.operationalEbitda),
        },
        {
          value: `₹${lc.pat.toFixed(2)}`,
          unit: "Cr",
          label: "Profit After Tax",
          delta: fmtDelta(lc.deltas.pat),
        },
        {
          value: lc.ebitdaMargin != null ? lc.ebitdaMargin.toFixed(2) : "—",
          unit: "%",
          label: "EBITDA Margin",
        },
      ]
    : [];

  // Revenue-trajectory copy, derived from the first/last standalone rows.
  const firstRev = financials[0]?.revenue ?? null;
  const lastRev = financials[financials.length - 1]?.revenue ?? null;
  const revMultiple =
    firstRev && lastRev && firstRev > 0 ? Math.round(lastRev / firstRev) : null;
  const revRangeLabel =
    firstRev != null && lastRev != null
      ? `₹${firstRev.toFixed(2)} Cr → ₹${lastRev.toFixed(2)} Cr`
      : "";
  const revYearsLabel =
    financials.length > 0
      ? `${formatFY(financials[0].year)} to ${formatFY(
          financials[financials.length - 1].year
        )}`
      : "";

  // Fiscal years absent from the standalone series (report not held) —
  // derived from gaps between the earliest and latest year on record, so the
  // caption stays accurate as the Supabase data set grows.
  const presentStartYears = financials
    .map((f) => fyStartYear(f.year))
    .filter((y): y is number => y != null)
    .sort((a, b) => a - b);
  const missingYears: string[] = [];
  if (presentStartYears.length > 1) {
    const first = presentStartYears[0];
    const last = presentStartYears[presentStartYears.length - 1];
    for (let y = first + 1; y < last; y++) {
      if (!presentStartYears.includes(y)) missingYears.push(shortFY(y));
    }
  }
  const missingNote =
    missingYears.length > 0
      ? ` · ${missingYears.join(", ")} not shown (report${
          missingYears.length > 1 ? "s" : ""
        } not held)`
      : "";

  return (
    <>
      <Header />
      <main
        className="flex-1 pt-16 text-white"
        style={{
          backgroundColor: "#090D16",
          // One continuous, viewport-fixed wash so every section shares the
          // same vibrant-but-plain backdrop — no per-section seams. Emerald +
          // a faint cyan companion, both atmospheric light per DESIGN.md.
          backgroundImage:
            "radial-gradient(55rem 30rem at 50% 0%, rgba(16,185,129,0.10), transparent 62%), radial-gradient(46rem 40rem at 88% 26%, rgba(34,211,238,0.06), transparent 55%)",
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat",
        }}
      >

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

          <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28 flex min-h-[380px] flex-col justify-center md:min-h-[480px]">
            <div className="max-w-3xl space-y-7">
              <div className="inline-flex flex-wrap items-center gap-x-3 gap-y-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5">
                <span className="ticker-pulse bg-emerald w-2 h-2 rounded-full" />
                <span className="text-[10px] text-white/60 uppercase tracking-[0.18em] font-medium">
                  NSE Listed
                </span>
                <span className="text-white/20">·</span>
                <span className="text-xs text-emerald font-mono">
                  {keyMetrics.ticker}
                </span>
                <span className="text-white/20">·</span>
                <span className="text-xs text-white/60 font-mono">
                  {keyMetrics.isin}
                </span>
                <span className="text-white/20">·</span>
                <span className="text-[10px] text-white/50 uppercase tracking-[0.18em] font-medium">
                  SEBI LODR 2015
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-[0.95] drop-shadow-lg">
                Investor
                <br />
                <span className="text-emerald">Relations</span>
              </h1>

              <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-2xl">
                Kore Digital Limited&apos;s complete compliance repository —
                audited results, Regulation 30 disclosures, annual reports,
                board composition, and every statutory policy filed under SEBI
                LODR Regulation 46.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="#performance"
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald px-5 py-2.5 text-sm font-bold text-obsidian transition hover:brightness-110"
                >
                  View performance
                  <ArrowUpRight className="w-4 h-4" />
                </a>
                <a
                  href="#policies"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-emerald hover:text-emerald"
                >
                  Statutory policies
                </a>
              </div>
            </div>
          </div>
        </section>

        <IRSubNav />

        {/* ── Live market — real-time NSE share price ── */}
        <section
          id="market"
          className="relative overflow-hidden scroll-mt-32"
        >
          <div className="dot-grid-obsidian absolute inset-0 pointer-events-none opacity-20" aria-hidden="true" />
          <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-14 md:py-16">
            <div className="flex flex-col gap-4 mb-10">
              <SectionBadge icon={LineChart} label="Live Market" tone="dark" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.05] max-w-3xl">
                Share price &amp; performance
              </h2>
              <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-2xl">
                Live NSE share price and one-year performance for Kore Digital
                (NSE: KDL).
              </p>
            </div>
            <InvestorStockSection />
          </div>
        </section>

        {/* ── Financial Performance — dark obsidian ledger ── */}
        <section
          id="performance"
          className="relative overflow-hidden scroll-mt-32"
        >
          <div className="dot-grid-obsidian absolute inset-0 pointer-events-none opacity-20" aria-hidden="true" />
          <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-14 md:py-16">
            <div className="flex flex-col gap-4 mb-12 md:mb-14">
              <SectionBadge
                icon={TrendingUp}
                label="Financial Performance"
                tone="dark"
              />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.05] max-w-3xl">
                Audited results, and the growth behind them
              </h2>
              <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-2xl">
                The latest consolidated cycle at a glance, and the standalone
                revenue trajectory that precedes it — every figure sourced
                verbatim from filed reports.
              </p>
            </div>

            {/* ── Elevated headline scorecard: dominant lead + supporting trio ── */}
            {lc && headline.length > 0 && (
              <>
                <div className="grid gap-4 sm:gap-6 lg:grid-cols-12">
                  <Reveal className="lg:col-span-5">
                    <div className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-8">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-white/50 text-[10px] font-mono uppercase tracking-[0.28em]">
                          {headline[0].label}
                        </p>
                        {headline[0].delta ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald/10 px-2 py-1 text-xs font-bold tabular-nums text-emerald">
                            <TrendingUp className="h-3 w-3" />
                            {headline[0].delta} YoY
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-10">
                        <p className="text-white text-[clamp(2.75rem,7vw,4rem)] font-bold leading-none tracking-tight tabular-nums">
                          {headline[0].value}
                          <span className="text-white/50 text-2xl md:text-3xl font-medium ml-1.5">
                            {headline[0].unit}
                          </span>
                        </p>
                        <p className="mt-3 text-white/50 text-sm">
                          Consolidated · {lc.yearEndedLabel}
                        </p>
                      </div>
                    </div>
                  </Reveal>

                  <Reveal delay={100} className="lg:col-span-7">
                    <div className="grid h-full grid-cols-1 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.02] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                      {headline.slice(1).map((m) => (
                        <div
                          key={m.label}
                          className="flex flex-col justify-center gap-2.5 p-6 md:p-7"
                        >
                          <p className="text-white text-3xl md:text-4xl font-bold leading-none tracking-tight tabular-nums">
                            {m.value}
                            <span className="text-white/50 text-base md:text-lg font-medium ml-1">
                              {m.unit}
                            </span>
                          </p>
                          {m.delta ? (
                            <span className="inline-flex w-fit items-center gap-1 text-xs font-bold tabular-nums text-emerald">
                              <TrendingUp className="h-3 w-3" />
                              {m.delta} YoY
                            </span>
                          ) : (
                            <span className="text-white/40 text-xs">
                              of total income
                            </span>
                          )}
                          <p className="text-white/50 text-[10px] font-mono uppercase tracking-[0.2em]">
                            {m.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Reveal>
                </div>

                <p className="mt-5 text-white/50 text-[10px] font-mono uppercase tracking-[0.28em]">
                  Source · {lc.fiscalYear} audited consolidated results
                </p>
              </>
            )}

            {/* ── Standalone revenue trajectory ── */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                <div className="lg:max-w-xs lg:shrink-0">
                  <p className="text-white/50 text-[10px] font-mono uppercase tracking-[0.28em]">
                    Revenue trajectory · Standalone
                  </p>
                  <p className="mt-3 text-white text-2xl font-bold tracking-tight leading-tight">
                    {revRangeLabel}
                  </p>
                  <p className="mt-3 text-white/70 text-sm leading-relaxed">
                    Audited standalone revenue over {revYearsLabel}. Net worth
                    is plotted alongside (dashed).
                  </p>
                  {revMultiple != null && (
                    <div className="mt-5 flex items-baseline gap-2 border-t border-white/10 pt-5">
                      <span className="text-emerald text-4xl font-bold tabular-nums leading-none">
                        ≈{revMultiple}×
                      </span>
                      <span className="text-white/50 text-xs">
                        revenue growth
                      </span>
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <RevenueTrajectory financials={financials} />
                </div>
              </div>
              <p className="mt-4 border-t border-white/10 pt-4 text-white/50 text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed">
                Figures in ₹ Cr · standalone · sourced verbatim from audited
                annual reports{missingNote}
              </p>
            </div>

            {/* Historical progression table + annual reports */}
            <div className="mt-16 md:mt-20">
              <FinancialsView financials={financials} />
            </div>
          </div>
        </section>

        {/* ── Exchange Disclosures — SEBI Regulation 30 ── */}
        <section
          id="disclosures"
          className="relative overflow-hidden scroll-mt-32"
        >
          <div className="dot-grid-obsidian absolute inset-0 pointer-events-none opacity-20" aria-hidden="true" />
          <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-14 md:py-16">
            <div className="flex flex-col gap-4 mb-10">
              <SectionBadge
                icon={FileText}
                label="Statutory Filings · SEBI Reg 30"
                tone="dark"
              />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.05] max-w-3xl">
                Exchange disclosures
              </h2>
            </div>
            <DisclosuresView />
          </div>
        </section>

        {/* ── Statutory Policies — light mist section ── */}
        <PoliciesSection />

        {/* ── Corporate Governance — full-viewport photograph band, dark ── */}
        <GovernanceSection />

        {/* ── Contact & Registered Agents — dark obsidian section ── */}
        <section
          id="contact"
          className="relative overflow-hidden scroll-mt-32"
        >
          <div className="dot-grid-obsidian absolute inset-0 pointer-events-none opacity-20" aria-hidden="true" />
          <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-14 md:py-16">
            <div className="flex flex-col gap-4 mb-12">
              <SectionBadge icon={Building2} label="Contact & Registered Agents" tone="dark" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.05] max-w-3xl">
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
    <div className="group relative h-full flex flex-col bg-white/[0.02] border border-white/10 rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-emerald/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald/10">
      <div className="w-11 h-11 rounded-lg border border-white/10 bg-white/[0.03] flex items-center justify-center mb-6 group-hover:border-emerald/60 group-hover:bg-emerald/10 transition-colors">
        <Icon className="w-4 h-4 text-emerald" />
      </div>

      <p className="text-white/50 text-[10px] font-mono tracking-[0.25em] uppercase mb-3">
        {eyebrow}
      </p>

      <p className="text-white text-lg font-semibold tracking-tight mb-4">
        {name}
      </p>

      <p className="text-white/70 text-sm leading-relaxed mb-6 flex-grow">
        {address}
      </p>

      <a
        href={action.href}
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className="inline-flex items-center gap-1.5 text-sm text-white/70 group-hover:text-emerald transition-colors self-start w-full mt-auto pt-4 border-t border-white/10 group-hover:border-emerald/40"
      >
        <span>{action.label}</span>
        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </a>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Financial Performance — historical table + annual-report grid
   Data (standalone rows) is passed in from the page's Supabase-backed
   payload (seed fallback), so submitting a report updates it live.
   ═══════════════════════════════════════════════════════════════════ */

function FinancialsView({ financials }: { financials: FinancialYear[] }) {
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

/*
  Portals drawer chrome to document.body so `position: fixed` resolves against
  the viewport, not an ancestor that establishes a containing block. SSR-safe:
  renders nothing on the server / first hydration, then portals after mount
  (these drawers are always mounted for their slide animation).
*/
const drawerSubscribe = () => () => {};
function DrawerPortal({ children }: { children: React.ReactNode }) {
  const mounted = useSyncExternalStore(
    drawerSubscribe,
    () => true,
    () => false
  );
  if (!mounted) return null;
  return createPortal(children, document.body);
}

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
    <DrawerPortal>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={
          report ? `Annual Report ${formatFY(report.year)}` : "Report drawer"
        }
        className={`fixed right-0 top-0 h-full w-full sm:max-w-[560px] lg:max-w-[920px] z-[70] bg-obsidian border-l border-white/10 shadow-2xl shadow-black/70 transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {report && <ReportDrawerContent report={report} onClose={onClose} />}
      </aside>
    </DrawerPortal>
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
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <p className="inline-flex items-center gap-2 text-emerald text-[10px] font-mono uppercase tracking-[0.25em] mb-5">
            <span className="ticker-pulse bg-emerald w-1.5 h-1.5 rounded-full" />
            Regulation 30 · Filed live on NSE
          </p>

          <p className="text-white/70 text-sm leading-relaxed">
            Every material event is filed with the National Stock Exchange under
            SEBI Regulation 30, where the authoritative, timestamped record
            lives. The mirrored feed here fills in as each filing is published
            to the compliance console — until then, the complete announcement
            history is one click away on NSE.
          </p>
        </div>

        <a
          href="https://www.nseindia.com/get-quotes/equity?symbol=KDL"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald px-5 py-3 text-sm font-bold text-obsidian transition hover:brightness-110"
        >
          View filings on NSE
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
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
      id="governance"
      className="relative overflow-hidden scroll-mt-32
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
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-obsidian pointer-events-none"
      />

      <div
        className="relative max-w-7xl mx-auto
                   px-6 md:px-12 py-16 md:py-20
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
              Board Composition
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
              Statutory Committees
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
              Compliance Desk
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
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyItem | null>(null);

  // Seed renders instantly (SSR + first paint); Supabase data overrides it
  // once fetched, so a new /admin submission shows up on the next load.
  const [payload, setPayload] = useState<PoliciesPayload>(SEED_POLICIES_PAYLOAD);

  useEffect(() => {
    let alive = true;
    fetch("/api/policies")
      .then((r) => r.json())
      .then((d) => {
        if (alive && d && Array.isArray(d.groups)) setPayload(d);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section
      id="policies"
      className="relative overflow-hidden scroll-mt-32"
    >
      <div className="dot-grid-obsidian absolute inset-0 pointer-events-none opacity-20" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-14 md:py-16 space-y-16 md:space-y-20">

        <div className="flex flex-col gap-4">
          <SectionBadge
            icon={ShieldCheck}
            label={`Compliance Library · SEBI LODR Reg 46 · ${payload.count} documents`}
            tone="dark"
          />
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[0.95]">
            Statutory Policies
          </h2>
          <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-2xl">
            The complete mandatory policy library — every document filed under
            SEBI LODR Regulation 46, organised by regulatory subject area for
            audit-friendly retrieval.
          </p>
        </div>

        <div className="space-y-12 md:space-y-14">
          {payload.groups.map((group) => {
            if (group.policies.length === 0) return null;
            return (
              <div key={group.category}>
                <p className="text-emerald text-[10px] font-mono tracking-[0.28em] uppercase mb-5 flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="inline-block w-6 h-px bg-emerald/60"
                  />
                  {group.category}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
                  {group.policies.map((policy, i) => (
                    <Reveal
                      key={`${policy.title}-${policy.fileUrl}`}
                      delay={i * 60}
                      className="h-full"
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedPolicy(policy)}
                        className="text-left w-full group h-full flex flex-col bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-emerald/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald/10 transition-all duration-300 cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-lg border border-white/10 bg-white/[0.03] flex items-center justify-center mb-5 group-hover:border-emerald/50 group-hover:bg-emerald/10 transition-colors">
                          <FileText className="w-4 h-4 text-emerald" />
                        </div>

                        <p className="text-white text-sm md:text-base font-semibold tracking-tight leading-snug mb-6">
                          {policy.title}
                        </p>

                        <span className="mt-auto inline-flex items-center gap-1.5 text-xs text-white/70 group-hover:text-emerald transition-colors">
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
  policy: PolicyItem | null;
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
    <DrawerPortal>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={policy ? policy.title : "Policy drawer"}
        className={`fixed right-0 top-0 h-full w-full sm:max-w-[560px] lg:max-w-[920px] z-[70] bg-obsidian border-l border-white/10 shadow-2xl shadow-black/70 transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {policy && <PolicyDrawerContent policy={policy} onClose={onClose} />}
      </aside>
    </DrawerPortal>
  );
}

function PolicyDrawerContent({
  policy,
  onClose,
}: {
  policy: PolicyItem;
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
            {policy.mandatoryUnder ? (
              <p className="text-white/60 text-[10px] font-mono tracking-[0.25em] uppercase mt-1">
                {policy.mandatoryUnder}
              </p>
            ) : null}
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
