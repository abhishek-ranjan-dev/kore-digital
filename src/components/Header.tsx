"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight, FileText } from "lucide-react";
import { keyMetrics } from "@/data/financials";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Updates", href: "/updates" },
  { label: "Investor Relations", href: "/investor-relations", highlight: true },
];

/*
  Header quick-link to the latest investor presentation — institutional
  analysts look for the deck within seconds of landing. Single source of
  truth: swap `href`/`label` to the H2 FY26 deck the moment that PDF is
  uploaded (its disclosure exists but the file is not yet available).
*/
const LATEST_PRESENTATION = {
  href: "/pdf-docs/investor-presentations/KDL-Q4-2025-1.pdf",
  label: "Q4 FY25 Presentation",
};

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="glass-nav fixed top-0 left-0 right-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            aria-label="Kore Digital Limited — Connect to infinity"
            className="flex items-center gap-3 group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo/Kore_Digital_Logo_Dark_BG.svg"
              alt=""
              aria-hidden="true"
              width={2619}
              height={485}
              fetchPriority="high"
              className="h-8 sm:h-9 w-auto transition-transform group-hover:scale-[1.02]"
            />
            <span
              aria-hidden="true"
              className="hidden md:inline-block h-6 w-px bg-white/10"
            />
            <span className="hidden md:inline text-xs font-medium tracking-wide text-white/60 group-hover:text-emerald transition-colors">
              Connect to infinity.
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.highlight ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-emerald font-semibold text-sm px-3 py-1.5 rounded border border-emerald/30 hover:border-emerald/70 hover:text-emerald transition-all"
                >
                  {link.label}
                </Link>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/70 text-sm px-3 py-2 hover:text-white transition-colors rounded hover:bg-white/5"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={LATEST_PRESENTATION.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${LATEST_PRESENTATION.label} — open PDF (NSE ${keyMetrics.ticker})`}
              className="group/deck hidden lg:inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 hover:border-emerald/40 transition-colors"
            >
              <span
                aria-hidden="true"
                className="ticker-pulse bg-emerald w-1.5 h-1.5 rounded-full"
              />
              <span className="text-[10px] font-mono tracking-wide text-white/60">
                NSE: {keyMetrics.ticker}
              </span>
              <span aria-hidden="true" className="w-px h-3 bg-white/10" />
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald group-hover/deck:brightness-110 transition">
                <FileText className="w-3 h-3" />
                {LATEST_PRESENTATION.label}
              </span>
            </a>
            <Link
              href="/contact"
              className="hidden md:inline-flex items-center gap-1.5 bg-emerald hover:brightness-110 text-obsidian font-bold text-sm px-4 py-2 rounded transition-all"
            >
              Get in Touch <ChevronRight className="w-3.5 h-3.5" />
            </Link>
            <button
              className="md:hidden text-white/70 hover:text-white p-1"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/*
        Mobile menu — pure CSS animation (no framer-motion, which kept this
        above-the-fold component off the critical path and improves mobile LCP).
        The grid-rows 0fr→1fr trick animates height:auto smoothly; the inner
        wrapper is overflow-hidden. Items fade+slide in with a staggered
        transition-delay. Closed state is opacity-0 + pointer-events-none +
        aria-hidden so it's inert and invisible (no stray border line).
      */}
      <div
        id="mobile-menu"
        aria-hidden={!mobileOpen}
        className={`md:hidden grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          mobileOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0 pointer-events-none"
        }`}
      >
        <div className="overflow-hidden border-t border-white/10 bg-obsidian">
          <nav className="px-4 py-4 space-y-1">
            {navLinks.map((link, i) => (
              <MenuItem key={link.href} open={mobileOpen} index={i}>
                <Link
                  href={link.href}
                  className={`block py-2.5 px-3 rounded text-sm transition-colors ${
                    link.highlight
                      ? "text-emerald font-semibold hover:bg-emerald/10"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </MenuItem>
            ))}
            <MenuItem open={mobileOpen} index={navLinks.length}>
              <a
                href={LATEST_PRESENTATION.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 py-2.5 px-3 rounded text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <FileText className="w-4 h-4 text-emerald" />
                {LATEST_PRESENTATION.label}
                <span className="ml-auto text-[10px] font-mono text-white/55">
                  NSE: {keyMetrics.ticker}
                </span>
              </a>
            </MenuItem>
            <MenuItem open={mobileOpen} index={navLinks.length + 1} className="pt-3">
              <Link
                href="/contact"
                className="block bg-emerald hover:brightness-110 text-obsidian font-bold text-sm px-4 py-3 rounded text-center transition-all"
                onClick={() => setMobileOpen(false)}
              >
                Get in Touch
              </Link>
            </MenuItem>
          </nav>
        </div>
      </div>
    </header>
  );
}

/*
  A single mobile-menu row. Fades + slides in when the menu opens, with a
  staggered transition-delay by index (approximating the old framer stagger).
  On close it resets instantly (no delay) so the container collapse reads clean.
*/
function MenuItem({
  open,
  index,
  className,
  children,
}: {
  open: boolean;
  index: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`transition-[opacity,transform] duration-200 ease-out ${
        open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
      } ${className ?? ""}`}
      style={{ transitionDelay: open ? `${index * 50 + 60}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
