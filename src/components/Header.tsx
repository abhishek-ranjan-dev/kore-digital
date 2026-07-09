"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronRight } from "lucide-react";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Updates", href: "/updates" },
  { label: "Investor Relations", href: "/investor-relations", highlight: true },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-kd-border bg-kd-bg/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + tagline */}
          <Link
            href="/"
            aria-label="Kore Digital Limited — Connect to infinity"
            className="flex items-center gap-3 group"
          >
            <Image
              src="/images/logo/kore-digital-logo.png"
              alt="Kore Digital Limited"
              width={480}
              height={100}
              priority
              className="h-8 sm:h-9 w-auto transition-transform group-hover:scale-[1.02]"
            />
            <span
              aria-hidden="true"
              className="hidden md:inline-block h-6 w-px bg-kd-border-hi"
            />
            <span className="hidden md:inline text-xs font-medium tracking-wide text-slate-400 group-hover:text-cyan-300 transition-colors">
              Connect to infinity.
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.highlight ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-amber-400 font-semibold text-sm px-3 py-1.5 rounded border border-amber-400/30 hover:border-amber-400/70 hover:text-amber-300 transition-all"
                >
                  {link.label}
                </Link>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-slate-400 text-sm px-3 py-2 hover:text-slate-100 transition-colors rounded hover:bg-white/5"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden md:inline-flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm px-4 py-2 rounded transition-colors"
            >
              Get in Touch <ChevronRight className="w-3.5 h-3.5" />
            </Link>
            <button
              className="md:hidden text-slate-400 hover:text-white p-1"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
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

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-kd-border bg-kd-bg">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-2.5 px-3 rounded text-sm transition-colors ${
                  link.highlight
                    ? "text-amber-400 font-semibold hover:bg-amber-400/10"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3">
              <Link
                href="/contact"
                className="block bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm px-4 py-3 rounded text-center transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
