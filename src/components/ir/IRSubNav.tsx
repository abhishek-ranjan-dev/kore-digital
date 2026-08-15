"use client";

import { useEffect, useState } from "react";

/*
  Sticky in-page section rail for the Investor Relations page. Lets an
  analyst or regulator jump straight to any disclosure surface, and
  scroll-spies the active section. Sits directly under the fixed header
  (h-16) and matches the obsidian glass of the nav.
*/
const LINKS = [
  { id: "market", label: "Live Market" },
  { id: "performance", label: "Performance" },
  { id: "disclosures", label: "Disclosures" },
  { id: "policies", label: "Policies" },
  { id: "governance", label: "Governance" },
  { id: "contact", label: "Contact" },
] as const;

export default function IRSubNav() {
  const [active, setActive] = useState<string>(LINKS[0].id);

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // The section whose top sits just below the rail wins.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          );
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-25% 0px -70% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Investor relations sections"
      className="sticky top-16 z-30 border-b border-white/10 bg-obsidian/85 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto">
        <ul
          className="flex gap-x-5 sm:gap-x-6 md:gap-x-9 overflow-x-auto px-6 md:px-12 [mask-image:linear-gradient(to_right,transparent,black_1.5rem,black_calc(100%-1.5rem),transparent)] sm:[mask-image:none]"
          style={{ scrollbarWidth: "none" }}
        >
          {LINKS.map((l) => {
            const isActive = active === l.id;
            return (
              <li key={l.id} className="shrink-0">
                <a
                  href={`#${l.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative block py-4 text-[10px] font-mono uppercase tracking-[0.2em] transition-colors ${
                    isActive
                      ? "text-emerald"
                      : "text-white/45 hover:text-white/80"
                  }`}
                >
                  {l.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-emerald transition-opacity duration-300 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
