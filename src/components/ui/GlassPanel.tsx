import type { ReactNode } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
}

/*
  Thin wrapper over the `.glass-obsidian` utility. Use inside dark
  sections when a card needs a frosted feel — e.g. the AI Hub rack
  visual or an overlaid quote card.
*/
export default function GlassPanel({ children, className = "" }: GlassPanelProps) {
  return (
    <div className={`glass-obsidian rounded-2xl ${className}`}>{children}</div>
  );
}
