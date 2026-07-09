import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { keyMetrics } from "@/data/financials";

type NavLink = { label: string; href: string; external?: boolean };

const NAV_COLUMNS: { title: string; links: NavLink[] }[] = [
  {
    title: "Explore",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Updates", href: "/updates" },
      { label: "Investor Relations", href: "/investor-relations" },
    ],
  },
  {
    title: "Regulatory",
    links: [
      { label: "NSE India ↗", href: "https://www.nseindia.com", external: true },
      { label: "SEBI ↗", href: "https://www.sebi.gov.in", external: true },
    ],
  },
];

export default function Footer() {
  return (
    /* Page-level padding — the area outside the box keeps the kd-bg colour */
    <div className="bg-kd-bg px-4 sm:px-6 lg:px-8 pt-4 pb-8">
      <div className="max-w-7xl mx-auto">

        {/* ── Revolving-border box ─────────────────────────────────────────── */}
        {/*
          Technique:
          • Outer shell:  relative, 1 px padding, rounded-2xl, overflow-hidden
          • Spinning div: absolute inset-0 — same bounding box as the shell.
                          Its conic-gradient has one narrow bright-cyan arc and
                          the rest is dark navy. As it rotates, the 1 px gap
                          between the shell edge and the inner footer reveals the
                          bright arc travelling around the border.
          • Inner footer: relative, solid bg, border-radius = shell radius – 1 px
        */}
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            padding: "1px",
            /* dim border colour visible when the bright arc isn't passing */
            background: "#0a1628",
            boxShadow:
              "0 0 40px rgba(56,189,248,0.08), 0 0 80px rgba(56,189,248,0.03), 0 16px 48px rgba(0,0,0,0.6)",
          }}
        >
          {/*
            Revolving-border technique
            ───────────────────────────
            The spinner is 200 % × 200 % of the container, positioned so its
            centre exactly overlaps the container's centre (top:-50%; left:-50%).
            Default transform-origin (50 % 50 %) therefore pivots at the
            container centre.  Rotating the element spins the conic-gradient's
            bright arc around that centre; overflow-hidden clips everything to
            the container shape, revealing only the 1 px gap as the border — so
            the bright spot appears to travel around all four edges.
          */}
          <div
            style={{
              position: "absolute",
              top: "-50%",
              left: "-50%",
              width: "200%",
              height: "200%",
              background:
                "conic-gradient(from 0deg, #0a1628 0deg, #0a1628 336deg, #0c4a6e 343deg, #0ea5e9 350deg, #38bdf8 354deg, #bae6fd 356deg, #38bdf8 358deg, #0ea5e9 360deg)",
              animation: "border-revolve 5s linear infinite",
            }}
          />

          {/* ── Actual footer content ── */}
          <footer
            className="relative bg-[#030712]"
            style={{ borderRadius: "calc(1rem - 1px)" }}
          >
            <div className="px-6 sm:px-10 lg:px-12">

              {/* Main grid — brand takes 2/4 on desktop, nav cols take 1 each */}
              <div className="py-12 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">

                {/* Brand column — spans 2 cols on desktop for breathing room */}
                <div className="col-span-2 lg:col-span-2 space-y-5">
                  <Link
                    href="/"
                    aria-label="Kore Digital Limited — home"
                    className="inline-flex w-fit group transition-transform hover:scale-[1.02]"
                  >
                    <Image
                      src="/images/logo/kore-digital-logo.png"
                      alt="Kore Digital Limited"
                      width={480}
                      height={100}
                      className="h-8 w-auto"
                    />
                  </Link>

                  <p className="text-slate-500 text-xs leading-relaxed">
                    Building India&apos;s next-gen digital and industrial infrastructure
                    across fiber, AI compute, and precision manufacturing.
                  </p>

                  {/* Compact badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 bg-slate-800/50 border border-slate-700/50 rounded-md px-2.5 py-1 text-[11px] text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      {keyMetrics.listingExchange} Listed
                    </span>
                    <span className="inline-flex items-center bg-slate-800/50 border border-slate-700/50 rounded-md px-2.5 py-1 text-[11px] text-cyan-400 font-mono">
                      {keyMetrics.ticker}
                    </span>
                  </div>

                  {/* Icon shortcuts */}
                  <div className="flex items-center gap-2">
                    <a
                      href="mailto:cs@koredigital.com"
                      title="cs@koredigital.com"
                      aria-label="Email us"
                      className="w-8 h-8 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-500 hover:text-cyan-400 hover:border-cyan-400/40 transition-all"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href="tel:+912266800001"
                      title="+91 22 6680 0001"
                      aria-label="Call us"
                      className="w-8 h-8 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-500 hover:text-cyan-400 hover:border-cyan-400/40 transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href="https://maps.google.com/maps?q=Shelton+Sapphire+Sector+15+CBD+Belapur+Navi+Mumbai+400614"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="B 1107-1108, Shelton Sapphire, CBD Belapur, Navi Mumbai"
                      aria-label="View on map"
                      className="w-8 h-8 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-500 hover:text-amber-400 hover:border-amber-400/40 transition-all"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* 4 nav columns */}
                {NAV_COLUMNS.map((col) => (
                  <div key={col.title}>
                    <h4 className="text-slate-300 text-[10px] font-semibold tracking-widest uppercase mb-4">
                      {col.title}
                    </h4>
                    <ul className="space-y-2.5">
                      {col.links.map((link) => (
                        <li key={link.label}>
                          {link.external ? (
                            <a
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-500 hover:text-slate-200 text-xs transition-colors"
                            >
                              {link.label}
                            </a>
                          ) : (
                            <Link
                              href={link.href}
                              className="text-slate-500 hover:text-slate-200 text-xs transition-colors"
                            >
                              {link.label}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Bottom utility bar */}
              <div className="border-t border-slate-800/60 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <p className="text-xs text-slate-500">
                  © {new Date().getFullYear()} Kore Digital Limited. All rights reserved.
                  <span className="mx-2 text-slate-700">·</span>
                  <span className="text-slate-600">CIN: U64200MH2017PLC000001</span>
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-slate-600 font-mono">{keyMetrics.isin}</span>
                  <span className="text-slate-700 text-xs">|</span>
                  <span className="text-xs text-slate-500">Regulated by SEBI &amp; NSE</span>
                </div>
              </div>

            </div>
          </footer>
        </div>
        {/* ── End revolving-border box ── */}

      </div>
    </div>
  );
}
