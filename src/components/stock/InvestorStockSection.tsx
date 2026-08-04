"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";
import StockChart from "./StockChart";
import type { StockData } from "./types";

const TRADINGVIEW_URL = "https://in.tradingview.com/symbols/NSE-KDL/";

const fmtINR = (n: number) =>
  n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

/** Raw INR → "₹124 Cr" (₹1 Cr = 1e7). */
const fmtCr = (n: number | null) =>
  n != null
    ? `₹${(n / 1e7).toLocaleString("en-IN", { maximumFractionDigits: 0 })} Cr`
    : "—";

/** Plain ratio, 2dp, e.g. "3.90". */
const fmtNum = (n: number | null) => (n != null ? n.toFixed(2) : "—");

/** ISO date → "31 Jul 2026". */
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

type Status = "loading" | "error" | "ok";

export default function InvestorStockSection() {
  const [data, setData] = useState<StockData | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/stock");
        const json = await res.json();
        if (!alive) return;
        if (!res.ok || json?.error) {
          setStatus("error");
        } else {
          setData(json as StockData);
          setStatus("ok");
        }
      } catch {
        if (alive) setStatus("error");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const positive = (data?.change ?? 0) >= 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
      {/* ── Metric header ── */}
      <div className="border-b border-white/10 p-6 md:p-8">
        {status === "loading" ? (
          <HeaderSkeleton />
        ) : status === "error" || !data ? (
          <ErrorHeader />
        ) : (
          <>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald/30 bg-emerald/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-emerald">
                    <span className="ticker-pulse h-1.5 w-1.5 rounded-full bg-emerald" />
                    NSE: KDL
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/40">
                    As of {fmtDate(data.asOf)}
                  </span>
                </div>
                <div className="flex flex-wrap items-end gap-3">
                  <span className="text-4xl font-bold tracking-tight tabular-nums text-white md:text-5xl">
                    ₹{fmtINR(data.currentPrice)}
                  </span>
                  <span
                    className={`mb-1.5 inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-bold tabular-nums ${
                      positive
                        ? "bg-emerald/10 text-emerald"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {positive ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {positive ? "+" : ""}
                    {fmtINR(data.change)} ({data.changePercent})
                  </span>
                </div>
              </div>

              <a
                href={TRADINGVIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 self-start rounded-lg border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-emerald hover:text-emerald"
              >
                Full profile
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>

            {/* Key stats grid — every figure is fetched or computed from live data */}
            <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-3">
              <Stat label="Market Cap" value={fmtCr(data.marketCap)} />
              <Stat label="Stock P/E" value={fmtNum(data.peRatio)} />
              <Stat label="P/B" value={fmtNum(data.priceToBook)} />
              <Stat
                label="Book Value"
                value={data.bookValue != null ? `₹${fmtINR(data.bookValue)}` : "—"}
              />
              <Stat
                label="52W High / Low"
                value={
                  data.fiftyTwoWeekHigh != null && data.fiftyTwoWeekLow != null
                    ? `₹${Math.round(data.fiftyTwoWeekHigh)} / ${Math.round(
                        data.fiftyTwoWeekLow
                      )}`
                    : "—"
                }
              />
              <Stat
                label="Div. Yield"
                value={
                  data.dividendYield != null
                    ? `${data.dividendYield.toFixed(2)}%`
                    : "—"
                }
              />
            </div>
          </>
        )}
      </div>

      {/* ── Chart ── */}
      <div className="p-6 md:p-8">
        {status === "loading" ? (
          <div className="h-[350px] w-full animate-pulse rounded-xl bg-white/[0.03]" />
        ) : status === "error" || !data ? (
          <div className="flex h-[350px] w-full flex-col items-center justify-center gap-3 text-center">
            <p className="text-sm text-white/60">
              Live market data is temporarily unavailable.
            </p>
            <a
              href={TRADINGVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald transition hover:brightness-110"
            >
              View on TradingView
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        ) : (
          <StockChart data={data.chartData} positive={positive} />
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-obsidian p-4">
      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold tabular-nums text-white">{value}</p>
    </div>
  );
}

function HeaderSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-5 w-24 rounded-full bg-white/10" />
      <div className="h-11 w-52 rounded bg-white/10" />
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-12 rounded bg-white/[0.06]" />
        ))}
      </div>
    </div>
  );
}

function ErrorHeader() {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-white/60">
        <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
        NSE: KDL
      </span>
      <span className="text-sm text-white/50">Quote unavailable</span>
    </div>
  );
}
