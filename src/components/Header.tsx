"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Updates", href: "/updates" },
  { label: "Investor Relations", href: "/investor-relations", highlight: true },
];

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

      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.32, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.22, ease: "easeOut" },
            }}
            className="md:hidden overflow-hidden border-t border-white/10 bg-obsidian"
          >
            <motion.nav
              className="px-4 py-4 space-y-1"
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { transition: { staggerChildren: 0.05, delayChildren: 0.06 } },
                closed: {},
              }}
            >
              {navLinks.map((link) => (
                <motion.div
                  key={link.href}
                  variants={{
                    open: { opacity: 1, y: 0 },
                    closed: { opacity: 0, y: -6 },
                  }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
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
                </motion.div>
              ))}
              <motion.div
                className="pt-3"
                variants={{
                  open: { opacity: 1, y: 0 },
                  closed: { opacity: 0, y: -6 },
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Link
                  href="/contact"
                  className="block bg-emerald hover:brightness-110 text-obsidian font-bold text-sm px-4 py-3 rounded text-center transition-all"
                  onClick={() => setMobileOpen(false)}
                >
                  Get in Touch
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
