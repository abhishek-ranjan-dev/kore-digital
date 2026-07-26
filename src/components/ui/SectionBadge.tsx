import type { LucideIcon } from "lucide-react";

interface SectionBadgeProps {
  icon?: LucideIcon;
  label: string;
  /** Which surface the badge sits on — controls border + text colour. */
  tone?: "dark" | "light";
  className?: string;
}

/*
  Small rounded pill above section headings.
  Example: [ 🌐 TELECOM BACKBONE ]
*/
export default function SectionBadge({
  icon: Icon,
  label,
  tone = "dark",
  className = "",
}: SectionBadgeProps) {
  const toneStyles =
    tone === "dark"
      ? "border-white/10 text-white/60 bg-white/[0.03]"
      : "border-slate-200 text-slate-500 bg-white";

  return (
    <span
      className={`inline-flex w-fit self-start items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] ${toneStyles} ${className}`}
    >
      {Icon ? <Icon className="h-3 w-3" strokeWidth={2} /> : null}
      {label}
    </span>
  );
}
