import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";
import type { StockChartPoint, StockData } from "@/components/stock/types";

/*
  Live market data for Kore Digital via the `yahoo-finance2` library.
  Kore Digital trades on NSE as KDL → Yahoo symbol `KDL.NS` (SME segment).
  The library performs Yahoo's cookie + crumb handshake, which is required for
  reliable server-side access (plain server `fetch`/`https` gets HTTP 429).
  A tiny in-memory TTL cache gives the intended ~60s ISR behaviour.
*/
const SYMBOLS = ["KDL.NS", "KOREDIGIT.NS"]; // primary, then fallback
const TTL_MS = 60_000;

const yf = new YahooFinance({
  suppressNotices: ["yahooSurvey", "ripHistorical"],
});

let cache: { data: StockData; ts: number } | null = null;
const round2 = (n: number) => Math.round(n * 100) / 100;

async function fetchFromYahoo(symbol: string): Promise<StockData | null> {
  // Fetch full listing history (Yahoo returns from the actual listing date —
  // KDL listed 2023-06-14). The client filters this down per range button
  // (1M…MAX), so one fetch serves every range.
  const period1 = new Date("2015-01-01");
  const chart = await yf.chart(symbol, { period1, interval: "1d" });

  const meta = chart?.meta;
  const quotes = chart?.quotes ?? [];
  if (!meta || quotes.length === 0) return null;

  const chartData: StockChartPoint[] = [];
  for (const q of quotes) {
    if (q.close == null || !Number.isFinite(q.close)) continue;
    const d = q.date instanceof Date ? q.date : new Date(q.date);
    chartData.push({
      date: d.toISOString().slice(0, 10),
      price: round2(q.close),
      volume: q.volume ?? 0,
    });
  }
  if (chartData.length === 0) return null;

  const lastClose = chartData[chartData.length - 1].price;
  // The prior close IN THE SERIES — NOT meta.chartPreviousClose (which is the
  // close before the whole 1y range, i.e. ~a year ago, and would give a wildly
  // wrong day-over-day % change).
  const previousClose =
    chartData.length > 1 ? chartData[chartData.length - 2].price : lastClose;

  // `regularMarketPrice` can be a bad tick on illiquid SME symbols (Yahoo has
  // returned e.g. ₹1624 vs a real range of ~₹100–320). Trust the last real
  // close when the live quote diverges implausibly.
  let currentPrice = Number(meta.regularMarketPrice ?? lastClose);
  if (
    !Number.isFinite(currentPrice) ||
    Math.abs(currentPrice - lastClose) / lastClose > 0.5
  ) {
    currentPrice = lastClose;
  }

  const change = round2(currentPrice - previousClose);
  const pct = previousClose ? (change / previousClose) * 100 : 0;
  const changePercent = `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`;
  const high = meta.fiftyTwoWeekHigh;
  const low = meta.fiftyTwoWeekLow;

  // These fundamentals are computed here from real per-share figures (EPS, book
  // value, shares) and OUR corrected price — Yahoo's own trailingPE/priceToBook/
  // marketCap are polluted by the glitchy live price and read ~16x too high.
  let peRatio: number | null = null;
  let priceToBook: number | null = null;
  let marketCap: number | null = null;
  let bookValue: number | null = null;
  let dividendYield: number | null = null;
  try {
    const q = await yf.quote(symbol);
    const eps =
      typeof q.epsTrailingTwelveMonths === "number"
        ? q.epsTrailingTwelveMonths
        : null;
    let bvPerShare = typeof q.bookValue === "number" ? q.bookValue : null;
    if (
      bvPerShare == null &&
      typeof q.regularMarketPrice === "number" &&
      typeof q.priceToBook === "number" &&
      q.priceToBook !== 0
    ) {
      // Back out book value/share from Yahoo's (glitch-priced) ratio — the
      // glitch price cancels, leaving the real per-share book value.
      bvPerShare = q.regularMarketPrice / q.priceToBook;
    }
    if (eps && eps > 0) peRatio = round2(currentPrice / eps);
    if (bvPerShare && bvPerShare > 0) {
      bookValue = round2(bvPerShare);
      priceToBook = round2(currentPrice / bvPerShare);
    }

    // Market cap = shares × OUR corrected price. Prefer sharesOutstanding; else
    // back shares out of Yahoo's marketCap/price (glitch cancels in the ratio).
    const shares =
      typeof q.sharesOutstanding === "number" && q.sharesOutstanding > 0
        ? q.sharesOutstanding
        : typeof q.marketCap === "number" &&
            typeof q.regularMarketPrice === "number" &&
            q.regularMarketPrice > 0
          ? q.marketCap / q.regularMarketPrice
          : null;
    if (shares) marketCap = Math.round(shares * currentPrice);

    // Trailing dividend yield (fraction → percent); SME often reports 0.
    if (typeof q.trailingAnnualDividendYield === "number") {
      dividendYield = round2(q.trailingAnnualDividendYield * 100);
    }
  } catch {
    /* metrics stay null if the quote endpoint is unavailable */
  }

  return {
    symbol: meta.symbol ?? symbol,
    exchange: meta.exchangeName ?? "NSE",
    currency: meta.currency ?? "INR",
    currentPrice: round2(currentPrice),
    previousClose: round2(previousClose),
    change,
    changePercent,
    fiftyTwoWeekHigh: high != null && Number.isFinite(high) ? round2(high) : null,
    fiftyTwoWeekLow: low != null && Number.isFinite(low) ? round2(low) : null,
    peRatio,
    priceToBook,
    marketCap,
    bookValue,
    dividendYield,
    // Date of the latest real close (Yahoo lags a few days on this SME symbol).
    asOf: chartData[chartData.length - 1].date,
    chartData,
  };
}

export async function GET() {
  if (cache && Date.now() - cache.ts < TTL_MS) {
    return NextResponse.json(cache.data);
  }

  for (const symbol of SYMBOLS) {
    try {
      const data = await fetchFromYahoo(symbol);
      if (data) {
        cache = { data, ts: Date.now() };
        return NextResponse.json(data);
      }
    } catch (err) {
      console.error(`[stock] ${symbol}:`, (err as Error).message);
    }
  }

  // Serve slightly-stale data rather than nothing when upstream is flaky.
  if (cache) return NextResponse.json(cache.data);
  return NextResponse.json(
    { error: "Unable to fetch live market data right now." },
    { status: 502 }
  );
}
