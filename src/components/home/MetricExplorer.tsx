"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  IndianRupee,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { financials, type FinancialYear } from "@/data/financials";
import SectionHeading from "@/components/ui/SectionHeading";
import SectionBadge from "@/components/ui/SectionBadge";
import StatBlock from "@/components/ui/StatBlock";
import BentoCard from "@/components/ui/BentoCard";

interface MetricConfig {
  id: string;
  icon: LucideIcon;
  badgeLabel: string;
  value: string;
  unit: string;
  label: string;
  caption: string;
}

function buildMetrics(active: FinancialYear): MetricConfig[] {
  return [
    {
      id: "revenue",
      icon: IndianRupee,
      badgeLabel: "Revenue",
      value: active.revenue != null ? active.revenue.toFixed(2) : "—",
      unit: "Cr",
      label: "Total revenue",
      caption: active.year,
    },
    {
      id: "networth",
      icon: Wallet,
      badgeLabel: "Net worth",
      value: active.netWorth != null ? active.netWorth.toFixed(2) : "—",
      unit: "Cr",
      label: "Balance sheet",
      caption: active.year,
    },
    {
      id: "growth",
      icon: TrendingUp,
      badgeLabel: "YoY growth",
      value:
        active.revenueGrowth != null ? active.revenueGrowth.toFixed(1) : "—",
      unit: "%",
      label: "Revenue vs prior year",
      caption:
        active.revenueGrowth == null
          ? "Prior year not on record"
          : "Year-over-year",
    },
  ];
}

export default function MetricExplorer() {
  const [activeIdx, setActiveIdx] = useState<number>(financials.length - 1);
  const active = financials[activeIdx];
  const metrics = buildMetrics(active);
  const isPdf = active.annualReportUrl.toLowerCase().endsWith(".pdf");
  const progressPct = (activeIdx / (financials.length - 1)) * 100;

  return (
    <section className="relative bg-mist py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tone="light"
          align="left"
          badgeIcon={TrendingUp}
          badgeLabel="Financial trajectory"
          title="From ₹0.88 Cr to ₹103 Cr in four fiscal years."
          subtitle="Scrub the timeline to see how revenue, net worth, and growth compounded as KDL scaled from a private-limited fibre contractor to an NSE-listed multi-sector infrastructure company."
          className="mb-14 md:mb-20"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <BentoCard key={m.id} tone="light">
                <SectionBadge
                  tone="light"
                  icon={Icon}
                  label={m.badgeLabel}
                  className="mb-6 self-start"
                />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIdx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  >
                    <StatBlock
                      tone="light"
                      size="lg"
                      value={m.value}
                      unit={m.unit}
                      label={m.label}
                      caption={m.caption}
                    />
                  </motion.div>
                </AnimatePresence>
              </BentoCard>
            );
          })}
        </div>

        <div className="relative pt-8 pb-4">
          <div
            className="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-200 rounded-full -translate-y-1/2"
            aria-hidden
          />
          <div
            className="absolute top-1/2 left-0 h-[2px] bg-emerald rounded-full -translate-y-1/2 transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
            aria-hidden
          />
          <div className="relative flex items-center justify-between">
            {financials.map((fy, i) => {
              const isActive = i === activeIdx;
              const isPast = i < activeIdx;
              return (
                <button
                  key={fy.year}
                  onClick={() => setActiveIdx(i)}
                  aria-label={`Show ${fy.year} financials`}
                  aria-pressed={isActive}
                  className="group relative flex flex-col items-center gap-3"
                >
                  <span
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      isActive
                        ? "bg-emerald border-emerald ring-4 ring-emerald/20 scale-110"
                        : isPast
                          ? "bg-emerald border-emerald"
                          : "bg-white border-slate-300 group-hover:border-emerald"
                    }`}
                  />
                  <span
                    className={`text-xs font-mono tracking-wide transition-colors ${
                      isActive
                        ? "text-slate-900 font-semibold"
                        : "text-slate-500 group-hover:text-slate-700"
                    }`}
                  >
                    {fy.year}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-600">
            Every figure is extracted directly from audited annual reports.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            {isPdf ? (
              <a
                href={active.annualReportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-emerald-ink transition-colors"
              >
                Download {active.year} annual report
                <ArrowUpRight className="w-4 h-4" />
              </a>
            ) : (
              <Link
                href={active.annualReportUrl}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-emerald-ink transition-colors"
              >
                Download {active.year} annual report
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            )}
            <Link
              href="/investor-relations"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-emerald-ink transition-colors"
            >
              View full IR archive →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
