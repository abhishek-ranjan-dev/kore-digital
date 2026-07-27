import type { ReactNode } from "react";

interface StatBlockProps {
  /** The big number itself — e.g. "701", "1", "₹1,500+". */
  value: ReactNode;
  /** Small unit suffix — e.g. "km", "GW", "Cr". Rendered smaller & muted. */
  unit?: ReactNode;
  /** Label under the number — e.g. "Fiber deployed". */
  label: ReactNode;
  /** Optional caption below the label. */
  caption?: ReactNode;
  tone?: "dark" | "light";
  /** "hero" bumps the number to 6xl-7xl for section-hero moments. */
  size?: "md" | "lg" | "hero";
  /**
   * If true, the value gets an emerald→cyan gradient for extra visual pop.
   * Off by default so existing usages keep their solid colour.
   */
  accent?: boolean;
  className?: string;
}

export default function StatBlock({
  value,
  unit,
  label,
  caption,
  tone = "dark",
  size = "md",
  accent = false,
  className = "",
}: StatBlockProps) {
  // Solid-Ink Rule (DESIGN.md): no gradient-filled text. `accent` is the
  // confirmation emphasis — emerald on dark (high contrast on obsidian),
  // ink on light (the legible "ledger" figure; emerald on white would fail
  // the large-text contrast floor).
  const valueColor = accent
    ? tone === "dark"
      ? "text-emerald"
      : "text-slate-900"
    : tone === "dark"
      ? "text-white"
      : "text-slate-900";
  const unitColor = tone === "dark" ? "text-white/50" : "text-slate-500";
  const labelColor = tone === "dark" ? "text-white/60" : "text-slate-600";
  const captionColor = tone === "dark" ? "text-white/55" : "text-slate-500";

  const sizeCls =
    size === "hero"
      ? "text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
      : size === "lg"
        ? "text-[clamp(1.75rem,5vw,2.75rem)]"
        : "text-xl sm:text-3xl md:text-4xl";

  const unitSize =
    size === "hero"
      ? "text-2xl sm:text-3xl md:text-4xl"
      : size === "lg"
        ? "text-sm sm:text-lg md:text-xl"
        : "text-sm sm:text-base";

  return (
    <div className={`flex w-full flex-col gap-2 ${className}`}>
      <div className="flex items-baseline gap-1.5 whitespace-nowrap">
        <span
          className={`${sizeCls} ${valueColor} font-bold leading-none tracking-tight tabular-nums`}
        >
          {value}
        </span>
        {unit ? (
          <span className={`${unitSize} ${unitColor} font-medium`}>{unit}</span>
        ) : null}
      </div>
      <span className={`text-[10px] uppercase tracking-[0.18em] ${labelColor}`}>
        {label}
      </span>
      {caption ? (
        <span className={`text-xs ${captionColor}`}>{caption}</span>
      ) : null}
    </div>
  );
}
