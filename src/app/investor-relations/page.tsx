import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InvestorTabs from "@/components/InvestorTabs";
import { keyMetrics } from "@/data/financials";

export const metadata: Metadata = {
  title: "Investor Relations",
  description:
    "Kore Digital Limited investor relations hub — financial results, NSE stock exchange disclosures under Regulation 30, annual reports, corporate governance, and SEBI Regulation 46 compliance documents.",
};

export default function InvestorRelationsPage() {
  return (
    <>
      <Header />
      {/*
        ── Editorial dark canvas ─────────────────────────────────────────
        Deep near-black backdrop instead of the site's default navy so
        this page reads as its own institutional document rather than
        another marketing section. Ultra-thin slate-800/40 dividers do
        every visual separation — no colour blocks, no cards.
      */}
      <main className="flex-1 pt-16 bg-[#030712] text-slate-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">

          {/* ── Micro-context strip ────────────────────────────────── */}
          <p className="text-slate-600 text-[10px] font-mono tracking-[0.32em] uppercase mb-8">
            [ NSE:&nbsp;{keyMetrics.ticker} &nbsp;|&nbsp; ISIN:&nbsp;{keyMetrics.isin} &nbsp;|&nbsp; SEBI LODR 2015 ]
          </p>

          {/* ── Editorial headline block ───────────────────────────── */}
          <div className="mb-16 md:mb-24">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-slate-50 tracking-tighter leading-[0.92] mb-8">
              Investor
              <br />
              Relations<span className="text-slate-600">.</span>
            </h1>
            <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl">
              Kore Digital Limited&apos;s complete compliance repository —
              audited financial results, Regulation 30 stock-exchange
              disclosures, annual reports, board composition, and every
              statutory policy document filed under SEBI LODR Regulation 46.
            </p>
          </div>

          {/* ── Thin canonical divider before content ──────────────── */}
          <div className="border-t border-slate-800/40 mb-14 md:mb-20" />

          {/* ── Main tabs & content ────────────────────────────────── */}
          <InvestorTabs />

          {/* ── Divider before registrar block ─────────────────────── */}
          <div className="border-t border-slate-800/40 mt-20 md:mt-28 mb-14 md:mb-16" />

          {/* ── Registrar / STA / Compliance officer block ─────────── */}
          <section>
            <p className="text-slate-600 text-[10px] font-mono tracking-[0.32em] uppercase mb-8">
              Contact & Registered Agents
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12 md:gap-x-16">

              <div className="space-y-2.5">
                <p className="text-slate-600 text-[10px] font-mono tracking-[0.25em] uppercase">
                  Share Transfer Agent
                </p>
                <p className="text-slate-50 text-base font-semibold tracking-tight">
                  KFin Technologies Limited
                </p>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Selenium Building, Tower B, Plot 31–32,
                  <br />
                  Gachibowli, Financial District,
                  <br />
                  Hyderabad – 500 032
                </p>
                <p className="text-slate-500 text-sm">Tel: +91 40 6716 2222</p>
                <a
                  href="https://www.kfintech.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm text-slate-300 opacity-70 hover:opacity-100 hover:text-slate-50 transition-opacity pt-1"
                >
                  www.kfintech.com&nbsp;↗
                </a>
              </div>

              <div className="space-y-2.5">
                <p className="text-slate-600 text-[10px] font-mono tracking-[0.25em] uppercase">
                  Company Secretary & Compliance Officer
                </p>
                <p className="text-slate-50 text-base font-semibold tracking-tight">
                  Ms. Kavita Rao{" "}
                  <span className="text-slate-500 font-normal">(ACS)</span>
                </p>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Kore Digital Limited
                  <br />
                  Level 12, One BKC, Bandra Kurla Complex
                  <br />
                  Mumbai – 400 051
                </p>
                <a
                  href="mailto:compliance@koredigital.in"
                  className="inline-block text-sm text-slate-300 opacity-70 hover:opacity-100 hover:text-slate-50 transition-opacity pt-1"
                >
                  compliance@koredigital.in
                </a>
              </div>

              <div className="space-y-2.5">
                <p className="text-slate-600 text-[10px] font-mono tracking-[0.25em] uppercase">
                  Investor Grievance Redressal
                </p>
                <p className="text-slate-500 text-sm leading-relaxed">
                  For investor complaints, write to the Compliance Officer or
                  use the SEBI SCORES platform.
                </p>
                <a
                  href="https://scores.sebi.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm text-slate-300 opacity-70 hover:opacity-100 hover:text-slate-50 transition-opacity pt-1"
                >
                  SEBI SCORES Portal&nbsp;↗
                </a>
                <p className="text-slate-500 text-sm pt-1">
                  Toll-Free: 1800 266 7575 &nbsp;/&nbsp; 1800 22 7575
                </p>
              </div>

            </div>
          </section>

          {/* ── Regulatory fine print ──────────────────────────────── */}
          <div className="border-t border-slate-800/40 mt-16 md:mt-24 pt-8">
            <p className="text-slate-600 text-[11px] leading-relaxed max-w-3xl">
              All disclosures on this page are filed in compliance with SEBI
              (Listing Obligations and Disclosure Requirements) Regulations,
              2015. Information provided is for informational purposes only and
              does not constitute investment advice. Past performance is not
              indicative of future results.
            </p>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
