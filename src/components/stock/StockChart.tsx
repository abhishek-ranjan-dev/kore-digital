"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { StockChartPoint } from "./types";

const DAY = 86_400_000;
const RANGES = [
  { key: "1M", days: 30 },
  { key: "3M", days: 91 },
  { key: "6M", days: 182 },
  { key: "1Y", days: 365 },
  { key: "3Y", days: 365 * 3 },
  { key: "5Y", days: 365 * 5 },
  { key: "MAX", days: Number.POSITIVE_INFINITY },
] as const;

type RangeKey = (typeof RANGES)[number]["key"];

/** Track the sm breakpoint so the chart can shed axis width/height on phones. */
function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return mobile;
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: StockChartPoint }>;
}) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-lg border border-white/10 bg-obsidian/95 px-3 py-2 shadow-xl backdrop-blur-sm">
      <p className="text-[10px] font-mono uppercase tracking-widest text-white/50">
        {new Date(p.date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </p>
      <p className="text-sm font-bold tabular-nums text-white">
        ₹{p.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
      </p>
      <p className="text-[10px] tabular-nums text-white/50">
        Vol {p.volume.toLocaleString("en-IN")}
      </p>
    </div>
  );
}

export default function StockChart({
  data,
  positive,
}: {
  data: StockChartPoint[];
  positive: boolean;
}) {
  const [range, setRange] = useState<RangeKey>("6M");
  const isMobile = useIsMobile();

  const filtered = useMemo(() => {
    const days = RANGES.find((r) => r.key === range)!.days;
    if (!Number.isFinite(days) || data.length === 0) return data;
    // Anchor the cutoff to the last data point (not "today") so trading
    // holidays/weekends never trim a range short.
    const cutoff = new Date(data[data.length - 1].date).getTime() - days * DAY;
    return data.filter((d) => new Date(d.date).getTime() >= cutoff);
  }, [data, range]);

  // For multi-year spans, label the axis by month/year instead of day/month.
  const longSpan = useMemo(() => {
    if (filtered.length < 2) return false;
    const span =
      new Date(filtered[filtered.length - 1].date).getTime() -
      new Date(filtered[0].date).getTime();
    return span > 400 * DAY;
  }, [filtered]);

  // Color the line/fill by the DISPLAYED range's trend (first → last plotted
  // price), not the intraday change — so it always matches what's on screen and
  // updates when the range changes. Falls back to the daily `positive` prop when
  // the range has too few points to compute a trend. (The header badge still
  // uses the daily change; that's a separate signal.)
  const trendPositive = useMemo(() => {
    if (filtered.length < 2) return positive;
    return filtered[filtered.length - 1].price >= filtered[0].price;
  }, [filtered, positive]);

  const color = trendPositive ? "#10B981" : "#EF4444"; // emerald / red
  const gradientId = `stock-fill-${trendPositive ? "up" : "down"}`;

  return (
    <div>
      <div className="mb-4 grid grid-cols-7 gap-1 rounded-lg border border-white/10 bg-white/[0.02] p-1 sm:mb-5 sm:inline-grid sm:gap-1.5 sm:border-0 sm:bg-transparent sm:p-0">
        {RANGES.map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => setRange(r.key)}
            aria-pressed={range === r.key}
            className={`rounded-md px-1 py-1.5 text-xs font-semibold tabular-nums transition-colors sm:px-3 sm:py-1 ${
              range === r.key
                ? "bg-white/10 text-white"
                : "text-white/50 hover:bg-white/[0.04] hover:text-white/80"
            }`}
          >
            {r.key}
          </button>
        ))}
      </div>

      <div className="-mx-1 h-[260px] w-[calc(100%+0.5rem)] sm:mx-0 sm:h-[350px] sm:w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={filtered}
            margin={{ top: 8, right: isMobile ? 4 : 8, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              minTickGap={isMobile ? 32 : 48}
              tickFormatter={(d: string) =>
                new Date(d).toLocaleDateString(
                  "en-IN",
                  longSpan
                    ? { month: "short", year: "2-digit" }
                    : { day: "2-digit", month: "short" }
                )
              }
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: isMobile ? 10 : 11 }}
              tickMargin={8}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              orientation="right"
              width={isMobile ? 42 : 58}
              domain={["auto", "auto"]}
              tickCount={isMobile ? 5 : 6}
              tickFormatter={(v: number) => `₹${Math.round(v)}`}
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: isMobile ? 10 : 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ stroke: "rgba(255,255,255,0.15)" }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={color}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
