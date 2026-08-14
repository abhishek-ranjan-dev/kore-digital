"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type FormEvent,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import {
  Upload,
  FileText,
  X,
  Loader2,
  RefreshCcw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Database,
  Sparkles,
  AlertTriangle,
  Eraser,
  WandSparkles,
  Pencil,
  Trash2,
  ShieldCheck,
  LogOut,
  FilePlus2,
  FolderOpen,
  CalendarRange,
  PanelLeftClose,
  PanelLeftOpen,
  Megaphone,
  Menu,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  deleteAnnualReport,
  listAnnualReports,
  submitAnnualReport,
  updateAnnualReport,
  type AnnualReportRow,
  type SubmitResult,
  type UpdateReportInput,
} from "./financials-actions";
import {
  deletePolicy,
  listPolicies,
  listPolicyCategories,
  submitPolicy,
  updatePolicy,
  type AdminPolicyRow,
  type PolicySubmitResult,
  type UpdatePolicyInput,
} from "./policies-actions";
import { parsePolicyPdf, type PolicyDraft } from "./policy-ai-actions";
import { parseReportPdf, type ReportDraft } from "./report-ai-actions";
import { stageAdminUpload } from "@/lib/supabase/stage-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { signOut } from "./auth-actions";
import { StripeGradientShader } from "@/components/ui/stripe-like-gradient-shader";

/*
  /admin — investor data console (Operate mode, clean shadcn dashboard).
  Gated by Supabase Auth: the `proxy` redirects non-admins to /admin/login and
  every write action re-checks via requireAdmin(). See docs/admin-auth.md.
*/

// Glossy emerald primary CTA — the "Get in Touch" emerald with a top-lit
// gradient sheen (see .btn-emerald-shine), dark obsidian label for contrast,
// and a clean emerald focus outline.
const PRIMARY_BTN =
  "btn-emerald-shine text-obsidian font-bold focus-visible:ring-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald";

/*
  Top-level sidebar sections. Only "documents" is built today; "updates" is a
  visible-but-stubbed placeholder that proves the shell scales (future: post
  investor updates — videos, text, announcements). Add a section here + a
  `SECTION_META` entry + a branch in the content switch to grow the console.
*/
type SectionId = "documents" | "updates";

const SECTION_META: Record<
  SectionId,
  {
    title: string;
    desc: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  documents: {
    title: "Documents",
    desc: "Annual reports & statutory policies — figures publish live to investor relations.",
    icon: FolderOpen,
  },
  updates: {
    title: "Updates",
    desc: "Announcements, videos and short notes for investors.",
    icon: Megaphone,
  },
};

export default function AdminPage() {
  // Collapsed = icon-only rail (desktop). Below `md` the desktop rail is hidden
  // entirely and the hamburger opens `MobileSidebar` as an off-canvas drawer.
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [section, setSection] = useState<SectionId>("documents");
  const meta = SECTION_META[section];

  // Close the mobile drawer on Escape.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    // App shell: the viewport height is fixed and only the content region
    // scrolls, so the sidebar stays put (a `sticky` sidebar breaks when an
    // ancestor becomes a scroll container, e.g. via overflow-x).
    <main className="admin-theme dark relative h-dvh overflow-hidden bg-obsidian text-foreground">
      {/*
        Animated WebGL gradient-shader canvas (page layout background ONLY —
        never a card surface). `fixed inset-0` pins it to the viewport so it
        stays put while the form scrolls; `overflow-hidden` clips it; the
        obsidian container color covers the pre-mount frame; `pointer-events-none`
        + aria-hidden keep it out of hit-testing and the a11y tree; `-z-10`
        parks it behind every card. The obsidian/30 scrim on top keeps the
        translucent glass cards legible over the moving gradient.
      */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-obsidian"
      >
        <StripeGradientShader className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-obsidian/30" />
      </div>

      <div className="flex h-full">
        <Sidebar
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((c) => !c)}
          section={section}
          onSection={setSection}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile-only top bar — sits above the scroll region (the desktop
              rail is hidden below md), so the menu stays fixed on scroll. */}
          <header className="flex h-14 shrink-0 items-center gap-3 border-b border-white/[0.06] bg-obsidian/80 px-4 backdrop-blur-xl md:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="-ml-1 grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Menu className="size-5" />
            </button>
            <div className="grid size-8 shrink-0 place-items-center rounded-md border border-emerald/25 bg-emerald/15 text-emerald">
              <Database className="size-4" />
            </div>
            <span className="text-sm font-semibold">Kore Digital</span>
          </header>

          {/* Only this region scrolls. */}
          <div className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
            <div className="mx-auto w-full max-w-5xl px-5 py-8 md:px-8 md:py-10">
              <PageHeading meta={meta} />
              {section === "documents" ? (
                <Dashboard />
              ) : (
                <ComingSoon meta={meta} />
              )}
            </div>
          </div>
        </div>
      </div>

      <MobileSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        section={section}
        onSection={setSection}
      />
    </main>
  );
}

/*
  Page heading — the section title + description live in the content (the old
  fixed top bar was removed). The mobile menu trigger lives in the mobile top
  bar (above the scroll region), so it isn't repeated here.
*/
function PageHeading({
  meta,
}: {
  meta: { title: string; desc: string; icon: React.ComponentType<{ className?: string }> };
}) {
  return (
    <div className="mb-6">
      <h1 className="text-xl font-semibold tracking-tight">{meta.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{meta.desc}</p>
    </div>
  );
}

/*
  Collapsible left rail: brand mark, section nav, and the sign-out action
  (moved here from the old top header). The active item is a shared `motion`
  layer keyed by `layoutId`, so it springs between sections — the animated
  active-indicator idea is adapted from a 21st.dev sidebar, re-themed to the
  emerald-on-obsidian brand and simplified to an icon-rail collapse.
*/
const NAV: {
  id: SectionId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  soon?: boolean;
}[] = [
  { id: "documents", label: "Documents", icon: FolderOpen },
  { id: "updates", label: "Updates", icon: Megaphone, soon: true },
];

/*
  Shared sidebar body — brand, section nav, footer (collapse + sign out). Used
  in two shells: the persistent desktop rail (`Sidebar`) and the mobile
  off-canvas drawer (`MobileSidebar`). `expanded` drives labels + alignment (an
  icon-only rail when false); `layoutId` namespaces the animated active pill so
  the two mounted instances never share one.
*/
function SidebarContent({
  expanded,
  section,
  onSection,
  layoutId,
  onToggleCollapsed,
  onClose,
}: {
  expanded: boolean;
  section: SectionId;
  onSection: (id: SectionId) => void;
  layoutId: string;
  onToggleCollapsed?: () => void;
  onClose?: () => void;
}) {
  const btnBase =
    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";
  return (
    <>
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center gap-3 px-4">
        <div className="grid size-9 shrink-0 place-items-center rounded-lg border border-emerald/25 bg-emerald/15 text-emerald">
          <Database className="size-4" />
        </div>
        {expanded ? (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold leading-tight">
              Kore Digital
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Admin Console
            </p>
          </div>
        ) : null}
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="grid size-8 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      {/* Section nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
        {NAV.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            soon={item.soon}
            active={section === item.id}
            expanded={expanded}
            layoutId={layoutId}
            onClick={() => onSection(item.id)}
          />
        ))}
      </nav>

      {/* Footer: collapse toggle (desktop only) + sign out */}
      <div className="shrink-0 space-y-1 border-t border-border/60 px-3 py-3">
        {onToggleCollapsed ? (
          <button
            type="button"
            onClick={onToggleCollapsed}
            title={expanded ? "Collapse sidebar" : "Expand sidebar"}
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            className={`${btnBase} ${expanded ? "justify-start" : "justify-center"}`}
          >
            {expanded ? (
              <PanelLeftClose className="size-4 shrink-0" />
            ) : (
              <PanelLeftOpen className="size-4 shrink-0" />
            )}
            {expanded ? <span className="truncate">Collapse</span> : null}
          </button>
        ) : null}

        <form action={signOut}>
          <button
            type="submit"
            title={!expanded ? "Sign out" : undefined}
            className={`${btnBase} ${expanded ? "justify-start" : "justify-center"}`}
          >
            <LogOut className="size-4 shrink-0" />
            {expanded ? <span className="truncate">Sign out</span> : null}
          </button>
        </form>
      </div>
    </>
  );
}

/* Persistent desktop rail — hidden below `md`, where the drawer takes over. */
function Sidebar({
  collapsed,
  onToggleCollapsed,
  section,
  onSection,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  section: SectionId;
  onSection: (id: SectionId) => void;
}) {
  return (
    <aside
      className={`hidden h-full shrink-0 flex-col border-r border-white/[0.06] bg-[image:linear-gradient(to_bottom,var(--card),var(--admin-inset))] shadow-[1px_0_0_0_rgba(0,0,0,0.4)] transition-[width] duration-300 ease-out md:flex ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <SidebarContent
        expanded={!collapsed}
        section={section}
        onSection={onSection}
        onToggleCollapsed={onToggleCollapsed}
        layoutId="admin-nav-desktop"
      />
    </aside>
  );
}

/* Mobile off-canvas drawer — opened by the top-bar hamburger. */
function MobileSidebar({
  open,
  onClose,
  section,
  onSection,
}: {
  open: boolean;
  onClose: () => void;
  section: SectionId;
  onSection: (id: SectionId) => void;
}) {
  return (
    <div
      className={`fixed inset-0 z-40 md:hidden ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`absolute inset-y-0 left-0 flex w-72 max-w-[82%] flex-col border-r border-white/[0.06] bg-[image:linear-gradient(to_bottom,var(--card),var(--admin-inset))] shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent
          expanded
          section={section}
          onSection={(id) => {
            onSection(id);
            onClose();
          }}
          onClose={onClose}
          layoutId="admin-nav-mobile"
        />
      </aside>
    </div>
  );
}

function NavItem({
  icon: Icon,
  label,
  active,
  soon,
  expanded,
  layoutId,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  soon?: boolean;
  expanded: boolean;
  layoutId: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={!expanded ? label : undefined}
      aria-current={active ? "page" : undefined}
      className={`relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
        expanded ? "justify-start" : "justify-center"
      } ${
        active
          ? "text-emerald"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {active ? (
        <motion.span
          layoutId={layoutId}
          aria-hidden
          className="absolute inset-0 rounded-lg border border-emerald/30 bg-emerald/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
          transition={{ type: "spring", stiffness: 520, damping: 36 }}
        />
      ) : null}
      <Icon className="relative z-10 size-4 shrink-0" />
      {expanded ? (
        <span className="relative z-10 flex-1 truncate text-left">{label}</span>
      ) : null}
      {expanded && soon ? (
        <span className="relative z-10 shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
          Soon
        </span>
      ) : null}
    </button>
  );
}

function ComingSoon({
  meta,
}: {
  meta: { title: string; desc: string; icon: React.ComponentType<{ className?: string }> };
}) {
  const Icon = meta.icon;
  return (
    <div className="card-shine flex flex-col items-center justify-center gap-4 rounded-2xl px-6 py-24 text-center">
      <div className="grid size-14 place-items-center rounded-2xl border border-emerald/20 bg-emerald/10 text-emerald">
        <Icon className="size-6" />
      </div>
      <div className="space-y-1.5">
        <h2 className="text-lg font-semibold">Coming soon</h2>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          Post announcements, videos and short notes for investors here — this
          section is on the roadmap.
        </p>
      </div>
    </div>
  );
}

function Dashboard() {
  const [reports, setReports] = useState<AnnualReportRow[]>([]);
  const [policies, setPolicies] = useState<AdminPolicyRow[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [pending, startRefresh] = useTransition();
  const [editingReport, setEditingReport] = useState<AnnualReportRow | null>(
    null
  );
  const [editingPolicy, setEditingPolicy] = useState<AdminPolicyRow | null>(
    null
  );

  const refreshReports = useCallback(() => {
    listAnnualReports().then(setReports).catch(() => {});
  }, []);
  const refreshPolicies = useCallback(() => {
    listPolicies().then(setPolicies).catch(() => {});
    listPolicyCategories().then(setCategories).catch(() => {});
  }, []);
  const refreshAll = useCallback(() => {
    startRefresh(async () => {
      await Promise.all([
        listAnnualReports().then(setReports).catch(() => {}),
        listPolicies().then(setPolicies).catch(() => {}),
        listPolicyCategories().then(setCategories).catch(() => {}),
      ]);
    });
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Two-tab console: "Submit" holds both upload forms; "Repository" holds the
  // submitted-document list. Both panels stay mounted (toggled with `hidden`)
  // so a half-filled form survives a tab switch.
  const [tab, setTab] = useState<TabId>("submit");
  const totalDocs = reports.length + policies.length;

  return (
    <div className="space-y-6">
      <OverviewStrip
        reports={reports}
        policies={policies}
        categories={categories}
      />

      <TabBar
        active={tab}
        onChange={setTab}
        tabs={[
          { id: "submit", label: "Submit", icon: FilePlus2 },
          {
            id: "repository",
            label: "Repository",
            icon: FolderOpen,
            count: totalDocs,
          },
        ]}
      />

      <div
        role="tabpanel"
        aria-hidden={tab !== "submit"}
        className={tab === "submit" ? "space-y-6" : "hidden"}
      >
        <AnnualReportCard reports={reports} onSubmitted={refreshReports} />
        <PolicyUploadCard categories={categories} onUploaded={refreshPolicies} />
      </div>
      <div
        role="tabpanel"
        aria-hidden={tab !== "repository"}
        className={tab === "repository" ? "" : "hidden"}
      >
        <RepositoryCard
          reports={reports}
          policies={policies}
          pending={pending}
          onRefresh={refreshAll}
          onEditReport={setEditingReport}
          onEditPolicy={setEditingPolicy}
        />
      </div>

      <EditReportDrawer
        key={`report-${editingReport?.fiscalYear ?? "none"}`}
        report={editingReport}
        onClose={() => setEditingReport(null)}
        onSaved={refreshReports}
      />
      <EditPolicyDrawer
        key={`policy-${editingPolicy?.id ?? "none"}`}
        policy={editingPolicy}
        categories={categories}
        onClose={() => setEditingPolicy(null)}
        onSaved={refreshPolicies}
      />
    </div>
  );
}

/* ═══ Console overview + tabs ════════════════════════════════════════ */

type TabId = "submit" | "repository";

type TabDef = {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
};

/*
  Segmented tab control. The active pill is a shared `motion` layer keyed by
  `layoutId`, so it slides between tabs with a spring (pattern adapted from a
  21st.dev segmented control, re-themed to the emerald-on-obsidian brand).
*/
function TabBar({
  tabs,
  active,
  onChange,
}: {
  tabs: TabDef[];
  active: TabId;
  onChange: (id: TabId) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Console sections"
      className="admin-panel inline-flex w-full items-center gap-1 rounded-xl border p-1 sm:w-auto"
    >
      {tabs.map((t) => {
        const isActive = t.id === active;
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(t.id)}
            className={`relative flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald sm:flex-none ${
              isActive
                ? "text-emerald"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {isActive ? (
              <motion.span
                layoutId="admin-tab-pill"
                aria-hidden
                className="absolute inset-0 rounded-lg border border-emerald/30 bg-emerald/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                transition={{ type: "spring", stiffness: 520, damping: 36 }}
              />
            ) : null}
            <span className="relative z-10 flex items-center gap-2">
              <Icon className="size-4" />
              {t.label}
              {t.count != null ? (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
                    isActive
                      ? "bg-emerald/20 text-emerald"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {t.count}
                </span>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/*
  At-a-glance KPI strip above the tabs. Purely derived from the loaded rows —
  gives the console a "dashboard" read without another data round-trip.
*/
function OverviewStrip({
  reports,
  policies,
  categories,
}: {
  reports: AnnualReportRow[];
  policies: AdminPolicyRow[];
  categories: string[];
}) {
  const latestFy =
    reports.length > 0
      ? [...reports.map((r) => r.fiscalYear)].sort().at(-1) ?? "—"
      : "—";
  const stats: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: React.ReactNode;
  }[] = [
    { icon: FileText, label: "Annual reports", value: reports.length },
    { icon: ShieldCheck, label: "Statutory policies", value: policies.length },
    { icon: FolderOpen, label: "Policy categories", value: categories.length },
    { icon: CalendarRange, label: "Latest fiscal year", value: latestFy },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.label}
            className="admin-panel rounded-xl border p-4"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="grid size-6 shrink-0 place-items-center rounded-md border border-emerald/20 bg-emerald/10 text-emerald">
                <Icon className="size-3.5" />
              </div>
              <span className="text-[10px] font-medium uppercase tracking-[0.16em]">
                {s.label}
              </span>
            </div>
            <p className="mt-2.5 text-2xl font-bold tabular-nums text-foreground">
              {s.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/* ═══ Annual report submission ═══════════════════════════════════════ */

const REPORT_FIELDS = [
  "total_income",
  "operational_ebitda",
  "pat",
  "revenue",
  "net_worth",
  "long_term_borrowings",
  "work_in_progress",
] as const;
type ReportField = (typeof REPORT_FIELDS)[number];
type ReportValues = Record<ReportField, string>;
const EMPTY_VALUES: ReportValues = {
  total_income: "",
  operational_ebitda: "",
  pat: "",
  revenue: "",
  net_worth: "",
  long_term_borrowings: "",
  work_in_progress: "",
};
const NO_REPORT_AI: Record<ReportField, boolean> = {
  total_income: false,
  operational_ebitda: false,
  pat: false,
  revenue: false,
  net_worth: false,
  long_term_borrowings: false,
  work_in_progress: false,
};

/** Parse a user-typed figure to a finite number, else null. */
function toNum(s: string): number | null {
  const t = s.trim();
  if (t === "") return null;
  const n = Number(t.replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

function AnnualReportCard({
  reports,
  onSubmitted,
}: {
  reports: AnnualReportRow[];
  onSubmitted: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [fiscalYear, setFiscalYear] = useState("");
  const [values, setValues] = useState<ReportValues>(EMPTY_VALUES);
  const [status, setStatus] = useState<SubmitResult | null>(null);
  const [pending, startSubmit] = useTransition();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Gemini auto-extract — always available (the API key is mandatory).
  const [parsing, setParsing] = useState(false);
  const [ai, setAi] = useState<Record<ReportField, boolean>>(NO_REPORT_AI);
  const [aiYear, setAiYear] = useState(false);
  const hasDraft = aiYear || Object.values(ai).some(Boolean);

  const takenYears = useMemo(
    () => new Set(reports.map((r) => r.fiscalYear)),
    [reports]
  );
  const availableYears = useMemo(
    () => fiscalYearOptions().filter((y) => !takenYears.has(y)),
    [takenYears]
  );

  // Live-derived margins + sanity warnings for instant feedback.
  const ti = toNum(values.total_income);
  const ebitda = toNum(values.operational_ebitda);
  const pat = toNum(values.pat);
  const ebitdaMargin = ti != null && ti !== 0 && ebitda != null ? (ebitda / ti) * 100 : null;
  const patMargin = ti != null && ti !== 0 && pat != null ? (pat / ti) * 100 : null;
  const warnings: string[] = [];
  if (ti != null && ebitda != null && ebitda > ti)
    warnings.push("Operational EBITDA is higher than Total Income — please verify.");
  if (ebitda != null && pat != null && pat > ebitda)
    warnings.push("Profit After Tax is higher than Operational EBITDA — please verify.");

  function setField(name: ReportField, v: string) {
    setValues((prev) => ({ ...prev, [name]: v }));
    setAi((a) => ({ ...a, [name]: false }));
  }

  function clearFile() {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function resetForm() {
    setValues(EMPTY_VALUES);
    setFiscalYear("");
    setAi(NO_REPORT_AI);
    setAiYear(false);
    clearFile();
  }

  // Merge a Gemini draft into the form and flag those fields for verification.
  function applyDraft(d: ReportDraft) {
    const map: [ReportField, string][] = [
      ["total_income", d.totalIncome],
      ["operational_ebitda", d.operationalEbitda],
      ["pat", d.pat],
      ["revenue", d.revenue],
      ["net_worth", d.netWorth],
      ["long_term_borrowings", d.longTermBorrowings],
      ["work_in_progress", d.workInProgress],
    ];
    const valPatch: Partial<ReportValues> = {};
    const aiPatch: Record<ReportField, boolean> = { ...NO_REPORT_AI };
    for (const [k, v] of map) {
      if (v) {
        valPatch[k] = v;
        aiPatch[k] = true;
      }
    }
    setValues((prev) => ({ ...prev, ...valPatch }));
    setAi(aiPatch);
    // Only accept a suggested year that's a valid, not-yet-submitted option.
    if (d.fiscalYear && availableYears.includes(d.fiscalYear)) {
      setFiscalYear(d.fiscalYear);
      setAiYear(true);
    }
  }

  async function runParse(f: File) {
    setParsing(true);
    try {
      // Upload straight to Storage (bypasses the 4.5 MB Server-Action cap),
      // then hand the reference to the extractor. It deletes the staged file.
      const ref = await stageAdminUpload("annual-reports", f);
      const res = await parseReportPdf(ref);
      if (res.ok && res.draft) applyDraft(res.draft);
    } catch {
      // Best-effort: a parse failure never blocks manual entry.
    } finally {
      setParsing(false);
    }
  }

  function handleFile(f: File | null) {
    setFile(f);
    setStatus(null);
    setAi(NO_REPORT_AI);
    setAiYear(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (pending) return;
    if (!fiscalYear)
      return setStatus({ ok: false, message: "Select a fiscal year." });
    if (!file)
      return setStatus({
        ok: false,
        message: "The annual-report PDF is required.",
      });
    if (!values.total_income.trim() || !values.operational_ebitda.trim() || !values.pat.trim())
      return setStatus({
        ok: false,
        message: "Total Income, Operational EBITDA and PAT are required.",
      });
    if (
      !values.revenue.trim() ||
      !values.net_worth.trim() ||
      !values.long_term_borrowings.trim() ||
      !values.work_in_progress.trim()
    )
      return setStatus({
        ok: false,
        message:
          "Revenue, Net Worth, LT Borrowings and Work-in-Progress are required.",
      });

    setStatus(null);
    const f = file;
    startSubmit(async () => {
      try {
        // Stage the PDF directly to Storage, then submit only its reference.
        const ref = await stageAdminUpload("annual-reports", f);
        const fd = new FormData();
        fd.set("fiscalYear", fiscalYear);
        for (const k of REPORT_FIELDS) fd.set(k, values[k]);
        fd.set("stagingBucket", ref.bucket);
        fd.set("stagingPath", ref.path);
        fd.set("fileName", f.name);
        const result = await submitAnnualReport(fd);
        setStatus(result);
        if (result.ok) {
          resetForm();
          onSubmitted();
        }
      } catch {
        setStatus({ ok: false, message: "Upload failed — please try again." });
      }
    });
  }

  return (
    <Card className="card-shine">
      <CardHeader>
        <CardTitle>Submit annual report</CardTitle>
        <CardDescription>
          Attach the report PDF and enter the headline figures — or let{" "}
          <em>Magic AI extraction</em> draft them.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Top: document upload + fiscal year — balanced 2-col on desktop,
              stacked on mobile. */}
          <div className="grid gap-6 md:grid-cols-2">
            <FieldGroup>
              <Label className="text-sm font-medium">
                Report PDF <Req />
              </Label>
              <Dropzone
                file={file}
                onFile={handleFile}
                onClear={() => handleFile(null)}
                inputRef={fileInputRef}
              />
              {file ? (
                <div className="space-y-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={parsing}
                    onClick={() => file && runParse(file)}
                    className="h-11 w-full border-amber-400/40 text-amber-500 hover:bg-amber-400/10 hover:text-amber-400 sm:w-auto"
                  >
                    {parsing ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <WandSparkles className="size-4" />
                    )}
                    {parsing
                      ? "Extracting figures…"
                      : hasDraft
                        ? "Re-run AI extraction"
                        : "Magic AI extraction"}
                  </Button>
                  {hasDraft && !parsing ? (
                    <p className="flex items-start gap-1.5 text-xs text-amber-500">
                      <Sparkles className="mt-0.5 size-3.5 shrink-0" />
                      <span>
                        AI-drafted — review the highlighted figures before
                        submitting.
                      </span>
                    </p>
                  ) : null}
                </div>
              ) : null}
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="fiscalYear" className="text-sm font-medium">
                Fiscal year <Req />
              </Label>
              <div className="flex items-center gap-2">
                <Select
                  value={fiscalYear}
                  onValueChange={(v) => {
                    setFiscalYear(v ?? "");
                    setAiYear(false);
                  }}
                >
                  <SelectTrigger
                    id="fiscalYear"
                    className={`h-11 flex-1 text-base focus-visible:ring-1 focus-visible:ring-ring/60 ${
                      aiYear ? AI_GLOW : ""
                    }`}
                  >
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.length === 0 ? (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        All years submitted
                      </div>
                    ) : (
                      availableYears.map((y) => (
                        <SelectItem key={y} value={y}>
                          {y}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {fiscalYear ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-11 shrink-0 text-muted-foreground"
                    onClick={() => {
                      setFiscalYear("");
                      setAiYear(false);
                    }}
                    aria-label="Clear fiscal year"
                  >
                    <X className="size-4" />
                  </Button>
                ) : null}
              </div>
              <p className="text-xs text-muted-foreground">
                One submission per year · year-end derived automatically.
              </p>
            </FieldGroup>
          </div>

          {/* Consolidated — bordered panel */}
          <Section
            title="Consolidated (₹ Cr)"
            hint="Feeds the headline scorecard. Margins auto-calculated."
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <Field name="total_income" label="Total Income" required unit="Cr" placeholder={hasDraft ? "" : "327.82"} value={values.total_income} onChange={(v) => setField("total_income", v)} glow={ai.total_income} />
              <Field name="operational_ebitda" label="Operational EBITDA" required unit="Cr" placeholder={hasDraft ? "" : "47.55"} value={values.operational_ebitda} onChange={(v) => setField("operational_ebitda", v)} glow={ai.operational_ebitda} labelBadge={<InlineMargin value={ebitdaMargin} />} />
              <Field name="pat" label="Profit After Tax" required unit="Cr" placeholder={hasDraft ? "" : "31.70"} value={values.pat} onChange={(v) => setField("pat", v)} glow={ai.pat} labelBadge={<InlineMargin value={patMargin} />} />
            </div>

            {/* Instant soft warnings — non-blocking. */}
            {warnings.length > 0 ? (
              <div className="space-y-1">
                {warnings.map((w) => (
                  <p
                    key={w}
                    className="flex items-start gap-2 text-xs text-amber-500"
                  >
                    <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                    <span>{w}</span>
                  </p>
                ))}
              </div>
            ) : null}
          </Section>

          {/* Standalone — bordered panel */}
          <Section
            title="Standalone (₹ Cr)"
            hint="Feeds the historical table & chart."
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <Field name="revenue" label="Revenue" required unit="Cr" placeholder={hasDraft ? "" : "103.51"} value={values.revenue} onChange={(v) => setField("revenue", v)} glow={ai.revenue} />
              <Field name="net_worth" label="Net Worth" required unit="Cr" placeholder={hasDraft ? "" : "74.77"} value={values.net_worth} onChange={(v) => setField("net_worth", v)} glow={ai.net_worth} />
              <Field name="long_term_borrowings" label="LT Borrowings" required unit="Cr" placeholder={hasDraft ? "" : "0.11"} value={values.long_term_borrowings} onChange={(v) => setField("long_term_borrowings", v)} glow={ai.long_term_borrowings} />
              <Field name="work_in_progress" label="Work-in-Progress" required unit="Cr" placeholder={hasDraft ? "" : "24.45"} value={values.work_in_progress} onChange={(v) => setField("work_in_progress", v)} glow={ai.work_in_progress} />
            </div>
          </Section>
        </CardContent>

        {/* Action row — right-aligned on desktop, full-width stack on mobile. */}
        <CardFooter className="mt-2 flex-wrap gap-3 border-t-0 bg-transparent">
          {status && !pending ? (
            <div className="w-full sm:w-auto sm:mr-auto">
              <StatusLine status={status} />
            </div>
          ) : null}
          <div className="flex w-full gap-3 sm:ml-auto sm:w-auto">
            <Button
              type="button"
              variant="outline"
              disabled={pending || parsing}
              onClick={() => {
                resetForm();
                setStatus(null);
              }}
              className="btn-glass h-11 flex-1 text-foreground sm:flex-none"
            >
              <Eraser className="size-4" />
              Clear
            </Button>
            <Button
              type="submit"
              disabled={pending || parsing || !file || !fiscalYear}
              className={`h-11 flex-1 sm:flex-none ${PRIMARY_BTN}`}
            >
              {pending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <CheckCircle2 className="size-4" />
              )}
              {pending ? "Submitting…" : "Submit details"}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

/* ═══ Statutory policy upload ════════════════════════════════════════ */

// Sentinel value for the "create a new category" option in the Select.
const NEW_CATEGORY = "__new__";

// Soft-amber "AI draft — please verify" highlight for auto-filled fields.
const AI_GLOW =
  "border-amber-400/70 ring-2 ring-amber-400/40 bg-amber-400/[0.06] focus-visible:ring-amber-400/50";

type AiFields = { title: boolean; category: boolean; mandatoryUnder: boolean };
const NO_AI: AiFields = { title: false, category: false, mandatoryUnder: false };

function PolicyUploadCard({
  categories,
  onUploaded,
}: {
  categories: string[];
  onUploaded: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [mandatoryUnder, setMandatoryUnder] = useState("");
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(
    null
  );
  const [pending, startUpload] = useTransition();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Gemini auto-extract — always available (the API key is mandatory).
  const [parsing, setParsing] = useState(false);
  const [ai, setAi] = useState<AiFields>(NO_AI);
  const hasDraft = ai.title || ai.category || ai.mandatoryUnder;

  const creatingCategory = category === NEW_CATEGORY;
  // The category name that will actually be submitted.
  const effectiveCategory = creatingCategory ? newCategory.trim() : category;
  const canSubmit =
    !pending && !parsing && !!file && !!title.trim() && !!effectiveCategory;

  function reset() {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setTitle("");
    setMandatoryUnder("");
    setCategory("");
    setNewCategory("");
    setAi(NO_AI);
  }

  // Merge a Gemini draft into the form and flag those fields for verification.
  function applyDraft(draft: PolicyDraft) {
    const glow: AiFields = { ...NO_AI };
    if (draft.title) {
      setTitle(draft.title);
      glow.title = true;
    }
    if (draft.mandatoryUnder) {
      setMandatoryUnder(draft.mandatoryUnder);
      glow.mandatoryUnder = true;
    }
    if (draft.category) {
      const match = categories.find(
        (c) => c.toLowerCase() === draft.category.toLowerCase()
      );
      if (match) {
        setCategory(match);
        setNewCategory("");
      } else {
        // Gemini proposed a category we don't have yet → pre-fill "create new".
        setCategory(NEW_CATEGORY);
        setNewCategory(draft.category);
      }
      glow.category = true;
    }
    setAi(glow);
  }

  async function runParse(f: File) {
    setParsing(true);
    try {
      // Upload straight to Storage (bypasses the 4.5 MB Server-Action cap),
      // then hand the reference to the extractor. It deletes the staged file.
      const ref = await stageAdminUpload("policies", f);
      const res = await parsePolicyPdf(ref, categories);
      if (res.ok && res.draft) applyDraft(res.draft);
    } catch {
      // Best-effort: a parse failure never blocks manual entry.
    } finally {
      setParsing(false);
    }
  }

  function handleFile(f: File | null) {
    setFile(f);
    setStatus(null);
    setAi(NO_AI);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (pending) return;
    if (!title.trim())
      return setStatus({ ok: false, message: "Policy title is required." });
    if (!effectiveCategory)
      return setStatus({
        ok: false,
        message: creatingCategory
          ? "Enter a name for the new category."
          : "Select a category.",
      });
    if (!file)
      return setStatus({ ok: false, message: "The policy PDF is required." });

    setStatus(null);
    const f = file;
    startUpload(async () => {
      try {
        // Stage the PDF directly to Storage, then submit only its reference.
        const ref = await stageAdminUpload("policies", f);
        const fd = new FormData();
        fd.append("title", title.trim());
        fd.append("category", effectiveCategory);
        fd.append("mandatoryUnder", mandatoryUnder.trim());
        fd.append("stagingBucket", ref.bucket);
        fd.append("stagingPath", ref.path);
        fd.append("fileName", f.name);
        const result = await submitPolicy(fd);
        setStatus(result);
        if (result.ok) {
          reset();
          onUploaded();
        }
      } catch {
        setStatus({ ok: false, message: "Upload failed — please try again." });
      }
    });
  }

  return (
    <Card className="card-shine">
      <CardHeader>
        <CardTitle>Submit statutory policy</CardTitle>
        <CardDescription>
          Attach the policy PDF, give it a title, and pick a category — or let{" "}
          <em>Magic AI extraction</em> draft them.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Top: document upload + category — balanced 2-col on desktop,
              stacked on mobile (parity with the annual-report card). */}
          <div className="grid gap-6 md:grid-cols-2">
            <FieldGroup>
              <Label className="text-sm font-medium">
                Policy PDF <Req />
              </Label>
              <Dropzone
                file={file}
                onFile={handleFile}
                onClear={() => handleFile(null)}
                inputRef={fileInputRef}
              />
              {file ? (
                <div className="space-y-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={parsing}
                    onClick={() => file && runParse(file)}
                    className="h-11 w-full border-amber-400/40 text-amber-500 hover:bg-amber-400/10 hover:text-amber-400 sm:w-auto"
                  >
                    {parsing ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <WandSparkles className="size-4" />
                    )}
                    {parsing
                      ? "Extracting details…"
                      : hasDraft
                        ? "Re-run AI extraction"
                        : "Magic AI extraction"}
                  </Button>
                  {hasDraft && !parsing ? (
                    <p className="flex items-start gap-1.5 text-xs text-amber-500">
                      <Sparkles className="mt-0.5 size-3.5 shrink-0" />
                      <span>
                        AI-drafted — review the highlighted fields before
                        submitting.
                      </span>
                    </p>
                  ) : null}
                </div>
              ) : null}
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="policyCategory" className="text-sm font-medium">
                Category <Req />
              </Label>
              <Select
                value={category}
                onValueChange={(v) => {
                  setCategory(v ?? "");
                  setAi((a) => ({ ...a, category: false }));
                }}
              >
                <SelectTrigger
                  id="policyCategory"
                  className={`h-11 w-full text-base focus-visible:ring-1 focus-visible:ring-ring/60 ${
                    ai.category ? AI_GLOW : ""
                  }`}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                  <SelectItem value={NEW_CATEGORY}>
                    ＋ Create new category…
                  </SelectItem>
                </SelectContent>
              </Select>
              {creatingCategory ? (
                <Input
                  value={newCategory}
                  onChange={(e) => {
                    setNewCategory(e.target.value);
                    setAi((a) => ({ ...a, category: false }));
                  }}
                  autoComplete="off"
                  autoFocus
                  placeholder="New category name"
                  className={`mt-2 h-11 text-base focus-visible:ring-1 focus-visible:ring-ring/60 ${
                    ai.category ? AI_GLOW : ""
                  }`}
                />
              ) : null}
            </FieldGroup>
          </div>

          {/* Policy details — bordered panel (parity with the report card). */}
          <Section
            title="Policy details"
            hint="Shown on the investor-relations policy list and detail drawer."
          >
            <FieldGroup>
              <Label htmlFor="policyTitle" className="text-sm font-medium">
                Title <Req />
              </Label>
              <Input
                id="policyTitle"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setAi((a) => ({ ...a, title: false }));
                }}
                autoComplete="off"
                placeholder={hasDraft ? "" : "Risk Management Policy"}
                className={`h-11 text-base focus-visible:ring-1 focus-visible:ring-ring/60 ${
                  ai.title ? AI_GLOW : ""
                }`}
              />
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="policyMandatory" className="text-sm font-medium">
                Mandatory under{" "}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="policyMandatory"
                value={mandatoryUnder}
                onChange={(e) => {
                  setMandatoryUnder(e.target.value);
                  setAi((a) => ({ ...a, mandatoryUnder: false }));
                }}
                autoComplete="off"
                placeholder={hasDraft ? "" : "SEBI LODR Regulation 46"}
                className={`h-11 text-base focus-visible:ring-1 focus-visible:ring-ring/60 ${
                  ai.mandatoryUnder ? AI_GLOW : ""
                }`}
              />
              <p className="text-xs text-muted-foreground">
                The statutory reference shown on the policy detail drawer.
              </p>
            </FieldGroup>
          </Section>
        </CardContent>

        {/* Action row — right-aligned on desktop, full-width stack on mobile. */}
        <CardFooter className="mt-2 flex-wrap gap-3 border-t-0 bg-transparent">
          {status && !pending ? (
            <div className="w-full sm:w-auto sm:mr-auto">
              <StatusLine status={status} />
            </div>
          ) : null}
          <div className="flex w-full gap-3 sm:ml-auto sm:w-auto">
            <Button
              type="button"
              variant="outline"
              disabled={pending || parsing}
              onClick={() => {
                reset();
                setStatus(null);
              }}
              className="btn-glass h-11 flex-1 text-foreground sm:flex-none"
            >
              <Eraser className="size-4" />
              Clear
            </Button>
            <Button
              type="submit"
              disabled={!canSubmit}
              className={`h-11 flex-1 sm:flex-none ${PRIMARY_BTN}`}
            >
              {pending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Upload className="size-4" />
              )}
              {pending ? "Submitting…" : "Submit policy"}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

/* ═══ Submitted reports (Supabase) ═══════════════════════════════════ */

type RepoRow = {
  key: string;
  name: string;
  href: string;
  edit?: () => void;
};

/** One typed group (Annual reports / Statutory policies) in the repository. */
function RepoSection({
  title,
  icon: Icon,
  rows,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  rows: RepoRow[];
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2.5">
        <div className="grid size-6 place-items-center rounded-md border border-emerald/20 bg-emerald/10 text-emerald">
          <Icon className="size-3.5" />
        </div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs tabular-nums text-muted-foreground">
          {rows.length}
        </span>
      </div>
      <div className="divide-y divide-border overflow-hidden rounded-xl border border-border">
        {rows.map((row) => (
          <div
            key={row.key}
            className="group flex items-center justify-between gap-4 px-4 py-2.5 transition-colors hover:bg-muted/40"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid size-8 shrink-0 place-items-center rounded-lg border border-emerald/20 bg-emerald/10 text-emerald">
                <Icon className="size-4" />
              </div>
              <span className="truncate text-sm font-medium">{row.name}</span>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {row.edit ? (
                <button
                  type="button"
                  onClick={row.edit}
                  className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Pencil className="size-3.5" /> Edit
                </button>
              ) : null}
              {row.href ? (
                <a
                  href={row.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-emerald transition-colors hover:bg-emerald/10"
                >
                  View <ExternalLink className="size-3.5" />
                </a>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RepositoryCard({
  reports,
  policies,
  pending,
  onRefresh,
  onEditReport,
  onEditPolicy,
  className,
}: {
  reports: AnnualReportRow[];
  policies: AdminPolicyRow[];
  pending: boolean;
  onRefresh: () => void;
  onEditReport?: (r: AnnualReportRow) => void;
  onEditPolicy?: (p: AdminPolicyRow) => void;
  className?: string;
}) {
  const reportRows: RepoRow[] = reports.map((r) => ({
    key: `report-${r.fiscalYear}`,
    name: r.fiscalYear,
    href: r.pdfUrl ?? "",
    edit: onEditReport ? () => onEditReport(r) : undefined,
  }));
  const policyRows: RepoRow[] = policies.map((p) => ({
    key: `policy-${p.id}`,
    name: p.title,
    href: p.pdfUrl ?? "",
    edit: onEditPolicy ? () => onEditPolicy(p) : undefined,
  }));

  return (
    <Card className={`card-shine ${className ?? ""}`}>
      <CardHeader>
        <CardTitle>Document repository</CardTitle>
        <CardDescription>
          Submitted annual reports and statutory policies.
        </CardDescription>
        <CardAction>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={onRefresh}
            disabled={pending}
            aria-label="Refresh repository"
          >
            <RefreshCcw className={`size-4 ${pending ? "animate-spin" : ""}`} />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-8">
        {reportRows.length === 0 && policyRows.length === 0 && !pending ? (
          <EmptyState
            title="Nothing here yet"
            hint="Submit an annual report or upload a policy to populate this."
          />
        ) : (
          <>
            {reportRows.length > 0 ? (
              <RepoSection
                title="Annual reports"
                icon={FileText}
                rows={reportRows}
              />
            ) : null}
            {policyRows.length > 0 ? (
              <RepoSection
                title="Statutory policies"
                icon={ShieldCheck}
                rows={policyRows}
              />
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}

/*
  Renders drawer chrome at document.body via a portal, so `position: fixed`
  is measured against the viewport — not any ancestor that establishes a
  containing block (transform/filter/etc.), which was leaving a strip
  uncovered at the bottom. The `dark` wrapper keeps the admin dark theme
  since the portal escapes the `dark` <main>.
*/
function DrawerPortal({ children }: { children: React.ReactNode }) {
  if (typeof document === "undefined") return null;
  return createPortal(
    <div className="admin-theme dark">{children}</div>,
    document.body
  );
}

/*
  Slide-in/out animation + Esc/scroll-lock for a side drawer that MOUNTS on
  open (unlike the always-mounted IR drawers). On mount it flips `entered` true
  after the first paint so the CSS transition plays; `requestClose` slides it
  back out, then calls onClose 300ms later so the exit animates too. Same
  timing/easing as the IR page drawers.
*/
function useDrawerAnimation(active: boolean, onClose: () => void) {
  const [entered, setEntered] = useState(false);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestClose = useCallback(() => {
    setEntered(false);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => onCloseRef.current(), 300);
  }, []);
  useEffect(() => {
    if (!active) return;
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => {
      cancelAnimationFrame(raf);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [active]);
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [active, requestClose]);
  return { isOpen: entered, requestClose };
}

/* ═══ Edit annual-report figures (side drawer) ═══════════════════════ */

function EditReportDrawer({
  report,
  onClose,
  onSaved,
}: {
  report: AnnualReportRow | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  // Pre-fill from the row. The modal is keyed by fiscal year in the parent, so
  // it remounts (and re-initialises here) whenever a different report opens.
  const [values, setValues] = useState<ReportValues>(() => {
    const s = (n: number | null) => (n == null ? "" : String(n));
    return report
      ? {
          total_income: s(report.totalIncome),
          operational_ebitda: s(report.operationalEbitda),
          pat: s(report.pat),
          revenue: s(report.revenue),
          net_worth: s(report.netWorth),
          long_term_borrowings: s(report.longTermBorrowings),
          work_in_progress: s(report.workInProgress),
        }
      : EMPTY_VALUES;
  });
  const [status, setStatus] = useState<SubmitResult | null>(null);
  const [pending, startSave] = useTransition();
  const [deleting, startDelete] = useTransition();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const { isOpen, requestClose } = useDrawerAnimation(report !== null, onClose);

  // Live margins + sanity warnings, same as the submission form.
  const ti = toNum(values.total_income);
  const ebitda = toNum(values.operational_ebitda);
  const pat = toNum(values.pat);
  const ebitdaMargin =
    ti != null && ti !== 0 && ebitda != null ? (ebitda / ti) * 100 : null;
  const patMargin =
    ti != null && ti !== 0 && pat != null ? (pat / ti) * 100 : null;
  const warnings: string[] = [];
  if (ti != null && ebitda != null && ebitda > ti)
    warnings.push("Operational EBITDA is higher than Total Income — please verify.");
  if (ebitda != null && pat != null && pat > ebitda)
    warnings.push("Profit After Tax is higher than Operational EBITDA — please verify.");

  function setField(name: ReportField, v: string) {
    setValues((prev) => ({ ...prev, [name]: v }));
  }

  function handleSave() {
    if (!report || pending) return;
    if (
      !values.total_income.trim() ||
      !values.operational_ebitda.trim() ||
      !values.pat.trim()
    )
      return setStatus({
        ok: false,
        message: "Total Income, Operational EBITDA and PAT are required.",
      });
    if (
      !values.revenue.trim() ||
      !values.net_worth.trim() ||
      !values.long_term_borrowings.trim() ||
      !values.work_in_progress.trim()
    )
      return setStatus({
        ok: false,
        message:
          "Revenue, Net Worth, LT Borrowings and Work-in-Progress are required.",
      });

    setStatus(null);
    const input: UpdateReportInput = {
      fiscalYear: report.fiscalYear,
      total_income: values.total_income,
      operational_ebitda: values.operational_ebitda,
      pat: values.pat,
      revenue: values.revenue,
      net_worth: values.net_worth,
      long_term_borrowings: values.long_term_borrowings,
      work_in_progress: values.work_in_progress,
    };
    startSave(async () => {
      const result = await updateAnnualReport(input);
      setStatus(result);
      if (result.ok) {
        onSaved();
        requestClose();
      }
    });
  }

  function handleDelete() {
    if (!report || deleting) return;
    startDelete(async () => {
      const result = await deleteAnnualReport(report.fiscalYear);
      if (result.ok) {
        onSaved();
        requestClose();
      } else {
        setStatus(result);
        setConfirmingDelete(false);
      }
    });
  }

  if (!report) return null;

  return (
    <DrawerPortal>
      <div
        onClick={requestClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Edit ${report.fiscalYear}`}
        className={`fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-border bg-background text-foreground shadow-2xl transition-transform duration-300 ease-out sm:max-w-[600px] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div>
            <h2 className="text-base font-semibold">
              Edit {report.fiscalYear}
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Figures only — the fiscal year and the PDF stay locked.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
            onClick={requestClose}
            aria-label="Close"
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="flex-1 space-y-7 overflow-y-auto px-6 py-6">
          <div className="space-y-4">
            <GroupHeading
              title="Consolidated (₹ Cr)"
              hint="Feeds the headline scorecard. Margins auto-calculated."
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field name="e_total_income" label="Total Income" required value={values.total_income} onChange={(v) => setField("total_income", v)} />
              <Field name="e_operational_ebitda" label="Operational EBITDA" required value={values.operational_ebitda} onChange={(v) => setField("operational_ebitda", v)} />
              <Field name="e_pat" label="Profit After Tax" required value={values.pat} onChange={(v) => setField("pat", v)} />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <MarginChip label="EBITDA margin" value={ebitdaMargin} />
              <MarginChip label="PAT margin" value={patMargin} />
            </div>
            {warnings.length > 0 ? (
              <div className="space-y-1">
                {warnings.map((w) => (
                  <p
                    key={w}
                    className="flex items-center gap-2 text-xs text-amber-500"
                  >
                    <AlertTriangle className="size-3.5 shrink-0" />
                    {w}
                  </p>
                ))}
              </div>
            ) : null}
          </div>

          <Separator />

          <div className="space-y-4">
            <GroupHeading
              title="Standalone (₹ Cr)"
              hint="Feeds the historical table & chart."
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field name="e_revenue" label="Revenue" required value={values.revenue} onChange={(v) => setField("revenue", v)} />
              <Field name="e_net_worth" label="Net Worth" required value={values.net_worth} onChange={(v) => setField("net_worth", v)} />
              <Field name="e_long_term_borrowings" label="LT Borrowings" required value={values.long_term_borrowings} onChange={(v) => setField("long_term_borrowings", v)} />
              <Field name="e_work_in_progress" label="Work-in-Progress" required value={values.work_in_progress} onChange={(v) => setField("work_in_progress", v)} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 border-t border-border px-6 py-5">
          <Button
            type="button"
            onClick={handleSave}
            disabled={pending || deleting}
            className={PRIMARY_BTN}
          >
            {pending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <CheckCircle2 className="size-4" />
            )}
            {pending ? "Saving…" : "Save changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={requestClose}
            disabled={pending || deleting}
          >
            Cancel
          </Button>
          {status && !pending && !deleting ? (
            <StatusLine status={status} />
          ) : null}

          {/* Soft delete — two-step confirm, pushed to the right. */}
          {confirmingDelete ? (
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                Remove {report.fiscalYear}?
              </span>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
                Yes, delete
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setConfirmingDelete(false)}
                disabled={deleting}
              >
                No
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setConfirmingDelete(true)}
              disabled={pending}
              className="ml-auto text-destructive hover:text-destructive"
            >
              <Trash2 className="size-4" />
              Delete
            </Button>
          )}
        </div>
      </aside>
    </DrawerPortal>
  );
}

/* ═══ Edit policy details (side drawer) ══════════════════════════════ */

function EditPolicyDrawer({
  policy,
  categories,
  onClose,
  onSaved,
}: {
  policy: AdminPolicyRow | null;
  categories: string[];
  onClose: () => void;
  onSaved: () => void;
}) {
  // Keyed by policy id in the parent → remounts (and re-initialises) per policy.
  const [title, setTitle] = useState(() => policy?.title ?? "");
  const [category, setCategory] = useState(() => policy?.category ?? "");
  const [newCategory, setNewCategory] = useState("");
  const [mandatoryUnder, setMandatoryUnder] = useState(
    () => policy?.mandatoryUnder ?? ""
  );
  const [status, setStatus] = useState<PolicySubmitResult | null>(null);
  const [pending, startSave] = useTransition();
  const [deleting, startDelete] = useTransition();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const { isOpen, requestClose } = useDrawerAnimation(policy !== null, onClose);

  const creatingCategory = category === NEW_CATEGORY;
  const effectiveCategory = creatingCategory ? newCategory.trim() : category;
  const canSave = !pending && !deleting && !!title.trim() && !!effectiveCategory;

  // Ensure the policy's current category is always a selectable option.
  const options = useMemo(() => {
    const set = new Set(categories);
    if (policy?.category) set.add(policy.category);
    return [...set];
  }, [categories, policy]);

  function handleSave() {
    if (!policy || pending) return;
    if (!title.trim())
      return setStatus({ ok: false, message: "Policy title is required." });
    if (!effectiveCategory)
      return setStatus({
        ok: false,
        message: creatingCategory
          ? "Enter a name for the new category."
          : "Select a category.",
      });
    setStatus(null);
    const input: UpdatePolicyInput = {
      id: policy.id,
      title: title.trim(),
      category: effectiveCategory,
      mandatoryUnder: mandatoryUnder.trim(),
    };
    startSave(async () => {
      const result = await updatePolicy(input);
      setStatus(result);
      if (result.ok) {
        onSaved();
        requestClose();
      }
    });
  }

  function handleDelete() {
    if (!policy || deleting) return;
    startDelete(async () => {
      const result = await deletePolicy(policy.id);
      if (result.ok) {
        onSaved();
        requestClose();
      } else {
        setStatus(result);
        setConfirmingDelete(false);
      }
    });
  }

  if (!policy) return null;

  return (
    <DrawerPortal>
      <div
        onClick={requestClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Edit policy"
        className={`fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-border bg-background text-foreground shadow-2xl transition-transform duration-300 ease-out sm:max-w-[600px] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold">Edit policy</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Details only — the PDF stays locked.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
            onClick={requestClose}
            aria-label="Close"
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          <FieldGroup>
            <Label htmlFor="edit_policyTitle" className="text-base">
              Title <Req />
            </Label>
            <Input
              id="edit_policyTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoComplete="off"
              placeholder="Risk Management Policy"
              className="h-10 text-base focus-visible:outline-none"
            />
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="edit_policyCategory" className="text-base">
              Category <Req />
            </Label>
            <Select value={category} onValueChange={(v) => setCategory(v ?? "")}>
              <SelectTrigger
                id="edit_policyCategory"
                className="h-10 w-full text-base focus-visible:outline-none"
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {options.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
                <SelectItem value={NEW_CATEGORY}>
                  ＋ Create new category…
                </SelectItem>
              </SelectContent>
            </Select>
            {creatingCategory ? (
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                autoComplete="off"
                autoFocus
                placeholder="New category name"
                className="mt-2 h-10 text-base focus-visible:outline-none"
              />
            ) : null}
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="edit_policyMandatory" className="text-base">
              Mandatory under{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="edit_policyMandatory"
              value={mandatoryUnder}
              onChange={(e) => setMandatoryUnder(e.target.value)}
              autoComplete="off"
              placeholder="SEBI LODR Regulation 46"
              className="h-10 text-base focus-visible:outline-none"
            />
            <p className="text-xs text-muted-foreground">
              The statutory reference shown on the policy detail drawer.
            </p>
          </FieldGroup>
        </div>

        <div className="flex flex-wrap items-center gap-4 border-t border-border px-6 py-5">
          <Button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className={PRIMARY_BTN}
          >
            {pending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <CheckCircle2 className="size-4" />
            )}
            {pending ? "Saving…" : "Save changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={requestClose}
            disabled={pending || deleting}
          >
            Cancel
          </Button>
          {status && !pending && !deleting ? (
            <StatusLine status={status} />
          ) : null}

          {/* Soft delete — two-step confirm, pushed to the right. */}
          {confirmingDelete ? (
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                Remove this policy?
              </span>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
                Yes, delete
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setConfirmingDelete(false)}
                disabled={deleting}
              >
                No
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setConfirmingDelete(true)}
              disabled={pending}
              className="ml-auto text-destructive hover:text-destructive"
            >
              <Trash2 className="size-4" />
              Delete
            </Button>
          )}
        </div>
      </aside>
    </DrawerPortal>
  );
}

/* ─── shared bits ───────────────────────────────────────────────────── */

function FieldGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`space-y-2 ${className ?? ""}`}>{children}</div>;
}

function Req() {
  return <span className="text-emerald">*</span>;
}

function GroupHeading({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="space-y-0.5">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}

function Field({
  name,
  label,
  placeholder,
  required = false,
  value,
  onChange,
  glow = false,
  unit,
  labelBadge,
}: {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  glow?: boolean;
  /** Inline unit adornment inside the input (e.g. "Cr"). */
  unit?: string;
  /** Optional badge rendered at the right of the label row (e.g. a margin). */
  labelBadge?: React.ReactNode;
}) {
  return (
    // Flex column + h-full so inputs bottom-align across a grid row even when
    // a neighbour's label wraps to two lines (e.g. "Operational EBITDA").
    <div className="flex h-full flex-col gap-2">
      <div className="flex min-h-5 items-start justify-between gap-2">
        <Label htmlFor={name} className="text-sm font-medium">
          {/* Keep the label text and the required asterisk on the same run so
              the "*" wraps with the last word instead of floating to the side. */}
          <span>
            {label}
            {required ? <> <Req /></> : null}
          </span>
        </Label>
        {labelBadge ? <div className="shrink-0">{labelBadge}</div> : null}
      </div>
      <div className="relative mt-auto">
        <Input
          id={name}
          name={name}
          type="number"
          step="any"
          inputMode="decimal"
          autoComplete="off"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`h-11 text-base tabular-nums focus-visible:ring-1 focus-visible:ring-ring/60 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
            unit ? "pr-10" : ""
          } ${glow ? AI_GLOW : ""}`}
        />
        {unit ? (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-medium text-muted-foreground">
            {unit}
          </span>
        ) : null}
      </div>
    </div>
  );
}

/*
  A bordered sub-section (Consolidated / Standalone) — a recessed panel inside
  the card that visually groups a set of figures. Replaces the old
  separator-delimited blocks for a cleaner, scannable hierarchy.
*/
function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="admin-panel space-y-4 rounded-xl border p-4 sm:p-5">
      <div className="space-y-0.5">
        <h3 className="text-sm font-semibold">{title}</h3>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </div>
      {children}
    </section>
  );
}

/*
  Compact live-margin badge shown in a field's label row. Muted "—%" until a
  valid percentage can be computed, then emerald.
*/
function InlineMargin({ value }: { value: number | null }) {
  const empty = value == null;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium tabular-nums ${
        empty
          ? "border-border text-muted-foreground"
          : "border-emerald/30 bg-emerald/10 text-emerald"
      }`}
      title="Margin (of Total Income)"
    >
      {empty ? "—%" : `${value.toFixed(1)}%`}
      <span className="font-normal opacity-70">margin</span>
    </span>
  );
}

/** Live margin pill — muted "—%" until a valid percentage can be computed. */
function MarginChip({ label, value }: { label: string; value: number | null }) {
  const empty = value == null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${
        empty
          ? "border-border text-muted-foreground"
          : "border-emerald/30 bg-emerald/10 text-emerald"
      }`}
    >
      <span className="font-medium">{label}</span>
      <span className="tabular-nums">{empty ? "—%" : `${value.toFixed(2)}%`}</span>
    </span>
  );
}

function Dropzone({
  file,
  onFile,
  onClear,
  inputRef,
}: {
  file: File | null;
  onFile: (f: File | null) => void;
  onClear: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
}) {
  const [dragOver, setDragOver] = useState(false);

  // Three visual states: uploaded (solid emerald), drag-over (emerald wash),
  // idle (dashed, hover-lift). Uploaded uses a solid border; the others dashed.
  const stateClasses = file
    ? "border-solid border-emerald/30 bg-emerald/[0.05]"
    : dragOver
      ? "border-emerald/60 bg-emerald/10"
      : "border-dashed border-[var(--admin-border)] bg-[var(--admin-inset)] hover:border-[var(--admin-border-strong)] hover:bg-[var(--admin-panel)]";

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const f = e.dataTransfer.files?.[0];
        if (f) onFile(f);
      }}
      className={`block cursor-pointer rounded-lg border transition-colors ${stateClasses}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        className="hidden"
      />
      {file ? (
        <div className="flex items-center gap-3 p-3.5">
          <div className="grid size-10 shrink-0 place-items-center rounded-md border border-emerald/20 bg-emerald/10 text-emerald">
            <FileText className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-sm font-medium">
              <CheckCircle2 className="size-3.5 shrink-0 text-emerald" />
              <span className="truncate">{file.name}</span>
            </p>
            <p className="text-xs tabular-nums text-muted-foreground">
              {formatBytes(file.size)} · click to replace
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9 shrink-0"
            onClick={(e) => {
              e.preventDefault();
              onClear();
            }}
            aria-label="Remove file"
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 px-6 py-8 text-center">
          <div
            className={`grid size-10 place-items-center rounded-full border transition-colors ${
              dragOver
                ? "border-emerald/40 bg-emerald/15 text-emerald"
                : "border-border bg-muted/40 text-muted-foreground"
            }`}
          >
            <Upload className="size-4" />
          </div>
          <p className="text-sm font-medium">
            {dragOver ? "Release to upload" : "Drop a PDF, or click to browse"}
          </p>
          <p className="text-xs text-muted-foreground">PDF · up to 25 MB</p>
        </div>
      )}
    </label>
  );
}

function StatusLine({ status }: { status: { ok: boolean; message: string } }) {
  return (
    <div
      className={`flex items-center gap-2 text-sm ${
        status.ok ? "text-emerald" : "text-destructive"
      }`}
    >
      {status.ok ? (
        <CheckCircle2 className="size-4 shrink-0" />
      ) : (
        <AlertCircle className="size-4 shrink-0" />
      )}
      <span>{status.message}</span>
    </div>
  );
}

function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border px-6 py-12 text-center">
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

/* ─── utils ─────────────────────────────────────────────────────── */

/** Candidate fiscal years, newest first. Upper bound reaches at least 2032
    (FY32-33) and follows the clock once the year passes it. */
function fiscalYearOptions(): string[] {
  const now = new Date().getFullYear();
  const start = Math.max(now + 1, 2032);
  const out: string[] = [];
  for (let y = start; y >= now - 12; y--) {
    const a = String(y % 100).padStart(2, "0");
    const b = String((y + 1) % 100).padStart(2, "0");
    out.push(`FY${a}-${b}`);
  }
  return out;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
