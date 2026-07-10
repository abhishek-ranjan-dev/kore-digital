import type { Metadata } from "next";
import {
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileText,
  PlayCircle,
  Radio,
  Search,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { timelineUpdates, type TimelineEvent } from "@/data/timelineUpdates";

export const metadata: Metadata = {
  title: "Operational Milestones & Live Field Updates",
  description:
    "Real-time visibility into Kore Digital Limited's infrastructure execution, compliance events, and network deployment pipelines.",
};

/* ─── Status style tokens ───────────────────────────────────────────── */

const STATUS_STYLES: Record<
  TimelineEvent["status"],
  {
    badge: string;
    icon: React.ComponentType<{ className?: string }>;
    dot: string;
    ring: string;
    label: string;
  }
> = {
  Completed: {
    badge: "bg-elevated/60 border border-neutral-500/40 text-neutral-400",
    icon: CheckCircle2,
    dot: "bg-neutral-500",
    ring: "ring-neutral-600/40",
    label: "Completed",
  },
  "In Progress": {
    badge:
      "bg-success/10 border border-success/40 text-success",
    icon: Radio,
    dot: "bg-success",
    ring: "ring-success/30",
    label: "In Progress",
  },
  Upcoming: {
    badge: "bg-alt/10 border border-alt/30 text-alt",
    icon: Clock,
    dot: "bg-alt/70",
    ring: "ring-alt/25",
    label: "Upcoming",
  },
};

const PILLAR_STYLES: Record<
  TimelineEvent["pillar"],
  { color: string; bg: string }
> = {
  Telecom: { color: "text-accent", bg: "bg-accent/10 border-accent/25" },
  Compute: { color: "text-alt", bg: "bg-alt/10 border-alt/25" },
  "Deep-Tech": {
    color: "text-success",
    bg: "bg-success/10 border-success/25",
  },
  General: { color: "text-neutral-200", bg: "bg-elevated/60 border-neutral-500/40" },
};

/* ─── Page ──────────────────────────────────────────────────────────── */

export default function UpdatesPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-16 bg-bg">
        {/* ── Page header ── */}
        <section className="relative border-b border-neutral-600 overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle, var(--color-accent)14 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="absolute top-0 right-1/4 w-[500px] h-[300px] rounded-full bg-accent/5 blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-surface border border-neutral-600 rounded-full px-3.5 py-1.5">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inset-0 rounded-full bg-success opacity-70 animate-ping" />
                  <span className="relative rounded-full w-2 h-2 bg-success" />
                </span>
                <span className="text-[10px] text-neutral-200 tracking-widest uppercase font-semibold">
                  Live Deployment Center
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-50 tracking-tight leading-[1.1]">
                Operational Milestones &amp;{" "}
                <span className="bg-gradient-to-r from-accent to-alt bg-clip-text text-transparent">
                  Live Field Updates
                </span>
              </h1>
              <p className="text-neutral-300 text-base sm:text-lg leading-relaxed">
                Real-time visibility into Kore Digital Limited&apos;s
                infrastructure execution, compliance events, and network
                deployment pipelines.
              </p>
            </div>
          </div>
        </section>

        {/* ── Timeline ── */}
        <section className="py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {timelineUpdates.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="relative">
                <div className="border-l-2 border-neutral-600 ml-3 sm:ml-6 pl-8 sm:pl-12 space-y-8">
                  {timelineUpdates.map((event) => (
                    <TimelineNode key={event.id} event={event} />
                  ))}
                </div>

                <div className="ml-3 sm:ml-6 flex items-center gap-3 pt-2">
                  <span className="w-3 h-3 -ml-[7px] rounded-full bg-surface border-2 border-bg" />
                  <span className="text-neutral-500 text-xs tracking-widest uppercase">
                    End of Recorded Timeline
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}

/* ─── Sub-components ────────────────────────────────────────────────── */

function TimelineNode({ event }: { event: TimelineEvent }) {
  const status = STATUS_STYLES[event.status];
  const pillarStyle = PILLAR_STYLES[event.pillar];
  const StatusIcon = status.icon;
  const isLive = event.status === "In Progress";

  return (
    <div className="relative">
      {/* Node dot on the spine */}
      <div
        className="absolute -left-[calc(2rem+0.5rem+0.5px)] sm:-left-[calc(3rem+0.5rem+0.5px)] top-6"
        aria-hidden="true"
      >
        <span
          className={`relative flex items-center justify-center w-4 h-4 rounded-full ring-4 ${status.ring} ring-offset-0`}
        >
          <span className={`w-4 h-4 rounded-full ${status.dot}`} />
          {isLive && (
            <span
              className={`absolute inset-0 rounded-full ${status.dot} opacity-70 animate-ping`}
            />
          )}
        </span>
      </div>

      {/* Card */}
      <article
        className={`bg-bg/40 border border-neutral-600 rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-500 hover:bg-bg/70 ${
          isLive ? "shadow-lg shadow-success/10" : ""
        }`}
      >
        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-neutral-200 text-xs font-semibold font-mono tracking-wide">
            {event.date}
          </span>
          <span className="text-neutral-600 text-xs">·</span>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${pillarStyle.bg} ${pillarStyle.color}`}
          >
            {event.pillar}
          </span>
          <span className="text-neutral-500 text-[10px]">{event.category}</span>

          <span
            className={`ml-auto inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full ${status.badge}`}
          >
            {isLive ? (
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inset-0 rounded-full bg-success opacity-80 animate-ping" />
                <span className="relative rounded-full w-1.5 h-1.5 bg-success" />
              </span>
            ) : (
              <StatusIcon className="w-3 h-3" />
            )}
            {status.label}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-neutral-50 font-semibold text-base sm:text-lg leading-snug mb-2">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-neutral-300 text-sm leading-relaxed">
          {event.description}
        </p>

        {/* Optional video attachment */}
        {event.video && (
          <div className="mt-4 space-y-2">
            {event.video.caption && (
              <div className="flex items-center gap-2 text-neutral-400 text-[11px]">
                <PlayCircle className="w-3.5 h-3.5 text-accent" />
                <span className="font-semibold text-neutral-300">
                  {event.video.caption}
                </span>
                {event.video.duration && (
                  <>
                    <span className="text-neutral-600">·</span>
                    <span className="font-mono tabular-nums">
                      {event.video.duration}
                    </span>
                  </>
                )}
              </div>
            )}
            <div className="relative rounded-xl overflow-hidden border border-neutral-600 bg-bg shadow-2xl shadow-black/50">
              <video
                controls
                preload="metadata"
                playsInline
                poster={event.video.poster}
                className="w-full max-h-[520px] block bg-bg"
              >
                <source src={event.video.src} type="video/mp4" />
                Your browser does not support embedded video playback.
              </video>
            </div>
          </div>
        )}

        {/* Optional PDF document — full inline preview */}
        {event.document && (
          <div className="mt-4 rounded-xl overflow-hidden border border-neutral-600 bg-bg/60 shadow-2xl shadow-black/50">
            {/* Preview header */}
            <div className="flex items-start sm:items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-neutral-600 bg-bg/60">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-danger/10 border border-danger/30 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-danger" />
                </div>
                <div className="min-w-0">
                  <p className="text-neutral-50 text-xs sm:text-sm font-semibold truncate">
                    {event.document.fileName}
                  </p>
                  <p className="text-neutral-400 text-[10px] sm:text-[11px] truncate">
                    {event.document.label}
                    {event.document.reference && (
                      <>
                        <span className="mx-1.5 text-neutral-600">·</span>
                        <span className="font-mono tabular-nums">
                          Ref: {event.document.reference}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>
              {event.document.fileSize && (
                <span className="text-[10px] font-mono tabular-nums text-neutral-300 bg-surface border border-neutral-500 rounded px-2 py-0.5 shrink-0">
                  PDF · {event.document.fileSize}
                </span>
              )}
            </div>

            {/* Inline PDF viewer — fixed height so a portrait letter doesn't dominate the timeline */}
            <div className="relative w-full h-[380px] sm:h-[440px] bg-neutral-200">
              <iframe
                src={`${event.document.src}#view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                className="absolute inset-0 w-full h-full"
                title={event.document.fileName}
                loading="lazy"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-bg/40 to-transparent pointer-events-none"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-3 sm:p-4 border-t border-neutral-600">
              <a
                href={event.document.src}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-accent hover:bg-accent/90 text-bg font-bold text-xs px-4 py-2.5 rounded transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" /> View Full Document
              </a>
              <a
                href={event.document.src}
                download={event.document.fileName}
                className="flex-1 inline-flex items-center justify-center gap-1.5 border border-neutral-500 hover:border-alt/50 text-neutral-200 hover:text-alt font-semibold text-xs px-4 py-2.5 rounded transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Download PDF
              </a>
            </div>
          </div>
        )}
      </article>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border border-dashed border-neutral-600 rounded-2xl px-6 py-16 flex flex-col items-center gap-4 bg-surface/70">
      <div className="w-14 h-14 rounded-full bg-surface border border-neutral-600 flex items-center justify-center">
        <Search className="w-6 h-6 text-neutral-400" />
      </div>
      <div className="text-center max-w-md space-y-2">
        <p className="text-neutral-50 font-semibold text-base">
          No updates recorded yet.
        </p>
        <p className="text-neutral-400 text-sm leading-relaxed">
          New milestones and field updates will appear here as they are
          published.
        </p>
      </div>
    </div>
  );
}
