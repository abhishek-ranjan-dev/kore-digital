import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import SectionBadge from "./SectionBadge";

interface SectionHeadingProps {
  badgeIcon?: LucideIcon;
  badgeLabel?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  tone?: "dark" | "light";
  align?: "left" | "center";
  className?: string;
}

/*
  Standardised section header — badge, ultra-bold title, muted subtitle.
  Every new homepage section uses this so titles read consistently.
*/
export default function SectionHeading({
  badgeIcon,
  badgeLabel,
  title,
  subtitle,
  tone = "dark",
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const titleColor = tone === "dark" ? "text-white" : "text-slate-900";
  const subColor = tone === "dark" ? "text-white/60" : "text-slate-600";
  const alignCls = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div className={`flex flex-col ${alignCls} gap-4 ${className}`}>
      {badgeLabel ? (
        <SectionBadge icon={badgeIcon} label={badgeLabel} tone={tone} />
      ) : null}
      <h2
        className={`text-3xl sm:text-4xl md:text-5xl font-bold ${titleColor} tracking-tight leading-[1.05] max-w-3xl`}
      >
        {title}
      </h2>
      {subtitle ? (
        <p className={`text-base md:text-lg ${subColor} leading-relaxed max-w-2xl`}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
