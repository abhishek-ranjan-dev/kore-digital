import type { ReactNode } from "react";

interface GlowCalloutProps {
  children: ReactNode;
  /** Which accent colour to wash the background with. */
  glow?: "emerald" | "cyan";
  className?: string;
}

/*
  Dark glass banner with an emerald/cyan radial wash behind it.
  Used for the InvestorCallout and any "section-as-hero" moment.
*/
export default function GlowCallout({
  children,
  glow = "emerald",
  className = "",
}: GlowCalloutProps) {
  const glowCls = glow === "cyan" ? "glow-cyan" : "glow-emerald";

  return (
    <div
      className={`relative overflow-hidden rounded-3xl glass-obsidian ${className}`}
    >
      {/* Radial accent wash, sits behind content */}
      <div className={`pointer-events-none absolute inset-0 ${glowCls}`} aria-hidden />
      {/* Content */}
      <div className="relative">{children}</div>
    </div>
  );
}
