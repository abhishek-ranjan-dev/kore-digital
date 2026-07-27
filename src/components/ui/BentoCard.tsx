import type { ReactNode } from "react";
import Link from "next/link";

interface BentoCardProps {
  children: ReactNode;
  href?: string;
  tone?: "dark" | "light";
  /** Extra classes — usually grid-span helpers like col-span-2 / row-span-2. */
  className?: string;
}

/*
  Bento-grid container. Subtle border, generous radius, hover lift +
  emerald glow (see .bento-hover in globals.css). If `href` is set the
  whole card becomes a Next.js Link.
*/
export default function BentoCard({
  children,
  href,
  tone = "light",
  className = "",
}: BentoCardProps) {
  const base =
    tone === "dark"
      ? "bg-white/[0.02] border-white/10"
      : "bg-gradient-to-b from-white to-slate-50 border-slate-200 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_-16px_rgba(15,23,42,0.18)]";

  const shared =
    `relative flex flex-col overflow-hidden rounded-2xl border p-5 sm:p-6 md:p-8 ${base} bento-hover ${className}`;

  if (href) {
    return (
      <Link href={href} className={shared}>
        {children}
      </Link>
    );
  }
  return <div className={shared}>{children}</div>;
}
