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
    <div className="bg-obsidian px-4 sm:px-6 lg:px-8 pt-10 pb-10">
      <div className="max-w-7xl mx-auto">
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            padding: "1px",
            /*
              Static gradient border. Top-left glows emerald, fading through
              cyan to a neutral white/10 ring on the bottom-right — matches
              the direction of the footer's inner linear-gradient highlight
              so the light-source reads consistent.
            */
            background:
              "linear-gradient(135deg, rgba(16,185,129,0.55) 0%, rgba(34,211,238,0.28) 22%, rgba(255,255,255,0.10) 55%, rgba(255,255,255,0.08) 100%)",
            boxShadow:
              "0 0 40px rgba(16,185,129,0.10), 0 0 90px rgba(16,185,129,0.04), 0 24px 64px rgba(0,0,0,0.7)",
          }}
        >
          {/*
            Orbiting comet trail — an SVG rounded-rect stroke that
            travels around the border at constant linear velocity.
            `pathLength="100"` normalises the perimeter so the dash
            (7 units) and gap (93 units) work identically regardless of
            card aspect ratio. On wide footers this is critical — a
            transform-rotated conic gradient would blip too fast across
            the short vertical edges (angular vs. linear velocity).
          */}
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full"
            style={{
              /*
                Critical: SVG's default overflow is hidden, and this SVG
                sits inside the shell's 1px padding (absolute children
                position from the PADDING box, not the border box). Without
                overflow:visible the outer half of the stroke — the part
                that lives in the 1px border ring — gets clipped and the
                comet is completely invisible.
              */
              overflow: "visible",
              filter: "drop-shadow(0 0 6px rgba(16,185,129,0.55))",
            }}
          >
            {/*
              Comet trail — 5 stacked rounded-rect strokes, each with a
              progressively longer dash and lower opacity. Every layer's
              stroke-dashoffset animates over 6s so their offset RANGE is
              (1 - dash_len) → (1 - dash_len - 100), which keeps every
              layer's leading edge at the SAME path position at every
              frame. Result: the composite reads as a bright head with a
              fading trail behind it, sweeping around the border at
              constant linear velocity.
            */}
            <g data-border-orbit>
              {/* Head — bright near-white core */}
              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                rx="15"
                ry="15"
                fill="none"
                stroke="rgba(230,255,242,1)"
                strokeWidth="2.4"
                strokeLinecap="round"
                pathLength="100"
                strokeDasharray="1 99"
              >
                <animate attributeName="stroke-dashoffset" from="0" to="-100" dur="6s" repeatCount="indefinite" />
              </rect>
              {/* Head glow — emerald */}
              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                rx="15"
                ry="15"
                fill="none"
                stroke="rgba(16,185,129,0.7)"
                strokeWidth="2"
                strokeLinecap="round"
                pathLength="100"
                strokeDasharray="3 97"
              >
                <animate attributeName="stroke-dashoffset" from="2" to="-98" dur="6s" repeatCount="indefinite" />
              </rect>
              {/* Mid tail */}
              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                rx="15"
                ry="15"
                fill="none"
                stroke="rgba(16,185,129,0.35)"
                strokeWidth="2"
                strokeLinecap="round"
                pathLength="100"
                strokeDasharray="4 96"
              >
                <animate attributeName="stroke-dashoffset" from="3" to="-97" dur="6s" repeatCount="indefinite" />
              </rect>
            </g>
          </svg>

          <footer
            className="relative"
            style={{
              borderRadius: "calc(1rem - 1px)",
              /* Fully opaque — the orbit lives BEHIND this layer. */
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0) 55%), rgb(15, 20, 32)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            <div className="px-6 sm:px-10 lg:px-12">

              <div className="py-12 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">

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

                  <p className="text-white/70 text-xs leading-relaxed">
                    Building India&apos;s next-gen digital and industrial infrastructure
                    across fiber, AI compute, and precision manufacturing.
                  </p>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 bg-white/[0.03] border border-white/10 rounded-md px-2.5 py-1 text-[10px] text-white/70">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald shrink-0" />
                      {keyMetrics.listingExchange} Listed
                    </span>
                    <span className="inline-flex items-center bg-white/[0.03] border border-white/10 rounded-md px-2.5 py-1 text-[10px] text-emerald font-mono">
                      {keyMetrics.ticker}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href="mailto:cs@koredigital.com"
                      title="cs@koredigital.com"
                      aria-label="Email us"
                      className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/60 hover:text-emerald hover:border-emerald/40 transition-all"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href="tel:+912266800001"
                      title="+91 22 6680 0001"
                      aria-label="Call us"
                      className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/60 hover:text-emerald hover:border-emerald/40 transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href="https://maps.google.com/maps?q=Shelton+Sapphire+Sector+15+CBD+Belapur+Navi+Mumbai+400614"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="B 1107-1108, Shelton Sapphire, CBD Belapur, Navi Mumbai"
                      aria-label="View on map"
                      className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/60 hover:text-emerald hover:border-emerald/40 transition-all"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {NAV_COLUMNS.map((col) => (
                  <div key={col.title}>
                    <h4 className="text-white/80 text-[10px] font-semibold tracking-widest uppercase mb-4">
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
                              className="text-white/70 hover:text-white text-xs transition-colors"
                            >
                              {link.label}
                            </a>
                          ) : (
                            <Link
                              href={link.href}
                              className="text-white/70 hover:text-white text-xs transition-colors"
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

              <div className="border-t border-white/10 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <p className="text-xs text-white/70">
                  © {new Date().getFullYear()} Kore Digital Limited. All rights reserved.
                  <span className="mx-2 text-white/30">·</span>
                  <span className="text-white/70">CIN: U64200MH2017PLC000001</span>
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-white/70 font-mono">{keyMetrics.isin}</span>
                  <span className="text-white/30 text-xs">|</span>
                  <span className="text-xs text-white/70">Regulated by SEBI &amp; NSE</span>
                </div>
              </div>

            </div>
          </footer>
        </div>

      </div>
    </div>
  );
}
