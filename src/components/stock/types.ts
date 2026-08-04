export interface StockChartPoint {
  /** ISO date, YYYY-MM-DD */
  date: string;
  /** Closing price, INR */
  price: number;
  volume: number;
}

export interface StockData {
  symbol: string;
  exchange: string;
  currency: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  /** Formatted, signed, e.g. "+3.31%" */
  changePercent: string;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow: number | null;
  /** Computed in-backend as price ÷ EPS (NOT Yahoo's glitch-priced value). */
  peRatio: number | null;
  /** Computed in-backend as price ÷ book value per share. */
  priceToBook: number | null;
  /** Shares outstanding × OUR corrected price, in INR (Yahoo's marketCap is glitch-priced). */
  marketCap: number | null;
  /** Book value per share, INR. */
  bookValue: number | null;
  /** Trailing annual dividend yield, as a percentage (0 = pays none). */
  dividendYield: number | null;
  /** ISO date of the latest real close — data is current as of this day. */
  asOf: string;
  chartData: StockChartPoint[];
}
