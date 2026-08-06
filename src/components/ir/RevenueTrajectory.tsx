"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  LabelList,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { FinancialYear } from "@/lib/financials-data";

/*
  Standalone revenue trajectory, built from the audited `financials` rows
  passed in as a prop (Supabase-backed, or seed fallback). Revenue as emerald
  bars (the growth "confirmation" signal); net worth as a slate reference line
  so the balance-sheet build reads alongside the top line. Kept deliberately
  separate from the consolidated headline figures — different basis.
*/
type RevPoint = {
  year: string;
  revenue: number;
  netWorth: number | null;
  growth: number | null;
};

const shortFY = (year: string) => {
  const m = year.match(/FY(\d{2})-(\d{2})/);
  return m ? `FY${m[1]}` : year;
};

function RevTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: RevPoint }>;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-white/10 bg-obsidian/95 px-3 py-2 shadow-xl backdrop-blur-sm">
      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50">
        {d.year}
      </p>
      <p className="text-sm font-bold tabular-nums text-white">
        Revenue ₹{d.revenue.toFixed(2)} Cr
      </p>
      {d.growth != null ? (
        <p className="text-xs font-semibold tabular-nums text-emerald">
          +{d.growth.toFixed(1)}% YoY
        </p>
      ) : null}
      {d.netWorth != null ? (
        <p className="text-xs tabular-nums text-white/50">
          Net worth ₹{d.netWorth.toFixed(2)} Cr
        </p>
      ) : null}
    </div>
  );
}

export default function RevenueTrajectory({
  financials,
}: {
  financials: FinancialYear[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ shown: false, animate: false });

  const data: RevPoint[] = useMemo(
    () =>
      financials
        .filter((f) => f.revenue != null)
        .map((f) => ({
          year: shortFY(f.year),
          revenue: f.revenue as number,
          netWorth: f.netWorth,
          growth: f.revenueGrowth,
        })),
    [financials]
  );

  // Mount the chart (and fire its one authored draw) when it scrolls into
  // view. Reduced-motion users still get the chart — just without the draw.
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const ob = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const reduce = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches;
          setView({ shown: true, animate: !reduce });
          ob.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    ob.observe(node);
    return () => ob.disconnect();
  }, []);

  return (
    <div ref={ref} className="h-[320px] w-full sm:h-[360px]">
      {view.shown ? (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 28, right: 8, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id="rev-bar-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.92} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0.32} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.08)"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 12 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={false}
              dy={4}
            />
            <YAxis
              tickFormatter={(v: number) => `₹${v}`}
              tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip
              content={<RevTooltip />}
              cursor={{ fill: "rgba(16,185,129,0.08)" }}
            />
            <Bar
              dataKey="revenue"
              fill="url(#rev-bar-fill)"
              radius={[6, 6, 0, 0]}
              maxBarSize={76}
              isAnimationActive={view.animate}
              animationDuration={900}
              animationEasing="ease-out"
            >
              <LabelList
                dataKey="revenue"
                position="top"
                formatter={(v: string | number | boolean | null | undefined) =>
                  `₹${v}`
                }
                fill="#FFFFFF"
                fontSize={12}
                fontWeight={700}
              />
            </Bar>
            <Line
              type="monotone"
              dataKey="netWorth"
              stroke="#94A3B8"
              strokeWidth={2}
              strokeDasharray="4 3"
              dot={{ r: 3, fill: "#94A3B8" }}
              isAnimationActive={view.animate}
              animationDuration={900}
            />
          </ComposedChart>
        </ResponsiveContainer>
      ) : null}
    </div>
  );
}
