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
} from "lucide-react";
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
import {
  parsePolicyPdf,
  policyAiEnabled,
  type PolicyDraft,
} from "./policy-ai-actions";
import {
  parseReportPdf,
  reportAiEnabled,
  type ReportDraft,
} from "./report-ai-actions";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

/*
  /admin — investor data console (Operate mode, clean shadcn dashboard).
  No application-level auth: gate at the deployment layer before production.
*/

const PRIMARY_BTN =
  "bg-emerald text-obsidian hover:bg-emerald/90 focus-visible:ring-emerald/40";

export default function AdminPage() {
  return (
    <main className="dark min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="max-w-4xl mx-auto flex h-14 items-center gap-3 px-6 md:px-8">
          <div className="grid size-7 place-items-center rounded-md border border-emerald/25 bg-emerald/15 text-emerald">
            <Database className="size-3.5" />
          </div>
          <span className="text-sm font-semibold">Kore Digital</span>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm text-muted-foreground">
            Investor data console
          </span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto space-y-8 px-6 py-8 md:px-8 md:py-10">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Data console</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Submit annual reports and statutory policies. Annual-report figures
            publish live to the investor-relations page.
          </p>
        </div>
        <Dashboard />
      </div>
    </main>
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

  return (
    <div className="space-y-6">
      <AnnualReportCard reports={reports} onSubmitted={refreshReports} />
      <PolicyUploadCard categories={categories} onUploaded={refreshPolicies} />
      <RepositoryCard
        reports={reports}
        policies={policies}
        pending={pending}
        onRefresh={refreshAll}
        onEditReport={setEditingReport}
        onEditPolicy={setEditingPolicy}
      />
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

  // Gemini auto-extract (optional). `aiEnabled` gates the whole flow.
  const [aiEnabled, setAiEnabled] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [ai, setAi] = useState<Record<ReportField, boolean>>(NO_REPORT_AI);
  const [aiYear, setAiYear] = useState(false);
  const hasDraft = aiYear || Object.values(ai).some(Boolean);

  useEffect(() => {
    reportAiEnabled().then(setAiEnabled).catch(() => {});
  }, []);

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
      const fd = new FormData();
      fd.append("file", f);
      const res = await parseReportPdf(fd);
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
    const fd = new FormData();
    fd.set("fiscalYear", fiscalYear);
    for (const k of REPORT_FIELDS) fd.set(k, values[k]);
    fd.set("file", file);
    startSubmit(async () => {
      const result = await submitAnnualReport(fd);
      setStatus(result);
      if (result.ok) {
        resetForm();
        onSubmitted();
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit annual report</CardTitle>
        <CardDescription>
          Attach the report PDF and enter the headline figures
          {aiEnabled ? (
            <>
              {" "}
              — or let <em>Magic AI extraction</em> draft them
            </>
          ) : null}
          .
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-7">
          {/* Row 1: document + fiscal year */}
          <div className="grid items-start gap-6 sm:grid-cols-[minmax(0,1fr)_16rem]">
            <FieldGroup>
              <Label className="text-base">
                Report PDF <Req />
              </Label>
              <Dropzone
                file={file}
                onFile={handleFile}
                onClear={() => handleFile(null)}
                inputRef={fileInputRef}
              />
              {aiEnabled && file ? (
                <div className="space-y-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={parsing}
                    onClick={() => file && runParse(file)}
                    className="border-amber-400/40 text-amber-500 hover:bg-amber-400/10 hover:text-amber-400"
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
                    <p className="flex items-center gap-1.5 text-xs text-amber-500">
                      <Sparkles className="size-3.5" />
                      AI-drafted — review the highlighted figures before
                      submitting.
                    </p>
                  ) : null}
                </div>
              ) : null}
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="fiscalYear" className="text-base">
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
                    className={`h-10 flex-1 text-base focus-visible:outline-none ${
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
                    className="size-10 shrink-0 text-muted-foreground"
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

          <Separator />

          {/* Consolidated */}
          <div className="space-y-4">
            <GroupHeading
              title="Consolidated (₹ Cr)"
              hint="Feeds the headline scorecard. Margins auto-calculated."
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <Field name="total_income" label="Total Income" required placeholder={hasDraft ? "" : "327.82"} value={values.total_income} onChange={(v) => setField("total_income", v)} glow={ai.total_income} />
              <Field name="operational_ebitda" label="Operational EBITDA" required placeholder={hasDraft ? "" : "47.55"} value={values.operational_ebitda} onChange={(v) => setField("operational_ebitda", v)} glow={ai.operational_ebitda} />
              <Field name="pat" label="Profit After Tax" required placeholder={hasDraft ? "" : "31.70"} value={values.pat} onChange={(v) => setField("pat", v)} glow={ai.pat} />
            </div>

            {/* Live margin chips — show "—%" until both inputs are valid. */}
            <div className="flex flex-wrap items-center gap-2">
              <MarginChip label="EBITDA margin" value={ebitdaMargin} />
              <MarginChip label="PAT margin" value={patMargin} />
            </div>

            {/* Instant soft warnings — non-blocking. */}
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

          {/* Standalone */}
          <div className="space-y-4">
            <GroupHeading
              title="Standalone (₹ Cr)"
              hint="Feeds the historical table & chart."
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <Field name="revenue" label="Revenue" required placeholder={hasDraft ? "" : "103.51"} value={values.revenue} onChange={(v) => setField("revenue", v)} glow={ai.revenue} />
              <Field name="net_worth" label="Net Worth" required placeholder={hasDraft ? "" : "74.77"} value={values.net_worth} onChange={(v) => setField("net_worth", v)} glow={ai.net_worth} />
              <Field name="long_term_borrowings" label="LT Borrowings" required placeholder={hasDraft ? "" : "0.11"} value={values.long_term_borrowings} onChange={(v) => setField("long_term_borrowings", v)} glow={ai.long_term_borrowings} />
              <Field name="work_in_progress" label="Work-in-Progress" required placeholder={hasDraft ? "" : "24.45"} value={values.work_in_progress} onChange={(v) => setField("work_in_progress", v)} glow={ai.work_in_progress} />
            </div>
          </div>

          <Separator />

          <div className="flex flex-wrap items-center gap-4">
            <Button
              type="submit"
              disabled={pending || parsing || !file || !fiscalYear}
              className={PRIMARY_BTN}
            >
              {pending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <CheckCircle2 className="size-4" />
              )}
              {pending ? "Submitting…" : "Submit details"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={pending || parsing}
              onClick={() => {
                resetForm();
                setStatus(null);
              }}
            >
              <Eraser className="size-4" />
              Clear
            </Button>
            {status && !pending ? <StatusLine status={status} /> : null}
          </div>
        </form>
      </CardContent>
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

  // Gemini auto-extract (optional). `aiEnabled` gates the whole flow.
  const [aiEnabled, setAiEnabled] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [ai, setAi] = useState<AiFields>(NO_AI);
  const hasDraft = ai.title || ai.category || ai.mandatoryUnder;

  useEffect(() => {
    policyAiEnabled().then(setAiEnabled).catch(() => {});
  }, []);

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
      const fd = new FormData();
      fd.append("file", f);
      fd.append("categories", JSON.stringify(categories));
      const res = await parsePolicyPdf(fd);
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
    startUpload(async () => {
      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("category", effectiveCategory);
      fd.append("mandatoryUnder", mandatoryUnder.trim());
      fd.append("file", file);
      const result = await submitPolicy(fd);
      setStatus(result);
      if (result.ok) {
        reset();
        onUploaded();
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit statutory policy</CardTitle>
        <CardDescription>
          Attach the policy PDF, give it a title, and pick a category
          {aiEnabled ? (
            <>
              {" "}
              — or let <em>Magic AI extraction</em> draft them
            </>
          ) : null}
          .
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-7">
          {/* Row 1: document + title/category */}
          <div className="grid items-start gap-6 sm:grid-cols-[minmax(0,1fr)_18rem]">
            <FieldGroup>
              <Label className="text-base">
                Policy PDF <Req />
              </Label>
              <Dropzone
                file={file}
                onFile={handleFile}
                onClear={() => handleFile(null)}
                inputRef={fileInputRef}
              />
              {aiEnabled && file ? (
                <div className="space-y-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={parsing}
                    onClick={() => file && runParse(file)}
                    className="border-amber-400/40 text-amber-500 hover:bg-amber-400/10 hover:text-amber-400"
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
                    <p className="flex items-center gap-1.5 text-xs text-amber-500">
                      <Sparkles className="size-3.5" />
                      AI-drafted — review the highlighted fields before
                      submitting.
                    </p>
                  ) : null}
                </div>
              ) : null}
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="policyCategory" className="text-base">
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
                  className={`h-10 w-full text-base focus-visible:outline-none ${
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
                  className={`mt-2 h-10 text-base focus-visible:outline-none ${
                    ai.category ? AI_GLOW : ""
                  }`}
                />
              ) : null}
            </FieldGroup>
          </div>

          <Separator />

          <FieldGroup>
            <Label htmlFor="policyTitle" className="text-base">
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
              className={`h-10 text-base focus-visible:outline-none ${
                ai.title ? AI_GLOW : ""
              }`}
            />
          </FieldGroup>

          {/* Optional metadata */}
          <FieldGroup>
            <Label htmlFor="policyMandatory" className="text-base">
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
              className={`h-10 text-base focus-visible:outline-none ${
                ai.mandatoryUnder ? AI_GLOW : ""
              }`}
            />
            <p className="text-xs text-muted-foreground">
              The statutory reference shown on the policy detail drawer.
            </p>
          </FieldGroup>

          <Separator />

          <div className="flex flex-wrap items-center gap-4">
            <Button type="submit" disabled={!canSubmit} className={PRIMARY_BTN}>
              {pending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Upload className="size-4" />
              )}
              {pending ? "Submitting…" : "Submit policy"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={pending || parsing}
              onClick={() => {
                reset();
                setStatus(null);
              }}
            >
              <Eraser className="size-4" />
              Clear
            </Button>
            {status && !pending ? <StatusLine status={status} /> : null}
          </div>
        </form>
      </CardContent>
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
    <Card className={className}>
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
  return createPortal(<div className="dark">{children}</div>, document.body);
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
}: {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  glow?: boolean;
}) {
  return (
    // Flex column + h-full so inputs bottom-align across a grid row even when
    // a neighbour's label wraps to two lines (e.g. "Operational EBITDA").
    <div className="flex h-full flex-col gap-2">
      <Label htmlFor={name} className="text-base">
        {/* Keep the label text and the required asterisk on the same run so
            the "*" wraps with the last word instead of floating to the side. */}
        <span>
          {label}
          {required ? <> <Req /></> : null}
        </span>
      </Label>
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
        className={`mt-auto h-10 text-base tabular-nums md:text-base focus-visible:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
          glow ? AI_GLOW : ""
        }`}
      />
    </div>
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
      className={`block cursor-pointer rounded-lg border border-dashed transition-colors ${
        dragOver ? "border-ring bg-accent/40" : "border-input hover:bg-accent/30"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        className="hidden"
      />
      {file ? (
        <div className="flex items-center gap-3 p-4">
          <div className="grid size-10 shrink-0 place-items-center rounded-md border border-emerald/20 bg-emerald/10 text-emerald">
            <FileText className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-xs tabular-nums text-muted-foreground">
              {formatBytes(file.size)}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
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
        <div className="flex flex-col items-center gap-1.5 px-6 py-8 text-center">
          <Upload className="size-5 text-muted-foreground" />
          <p className="text-sm font-medium">Drop a PDF, or click to browse</p>
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
