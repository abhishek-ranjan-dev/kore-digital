"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from "react";
import {
  Lock,
  Upload,
  FileText,
  ShieldCheck,
  ShieldAlert,
  RefreshCcw,
  X,
  Loader2,
} from "lucide-react";
import {
  listDocuments,
  uploadDocument,
  verifyAccess,
  type DocumentEntry,
  type DocumentType,
} from "./actions";

/* ═══════════════════════════════════════════════════════════════════
   /admin — Passcode-gated document upload portal
   ═══════════════════════════════════════════════════════════════════ */

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [accessKey, setAccessKey] = useState("");

  return (
    <main className="min-h-screen bg-[#030712] text-slate-200">
      <TopStrip unlocked={unlocked} onLock={() => {
        setUnlocked(false);
        setAccessKey("");
      }} />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20">
        {unlocked ? (
          <Dashboard accessKey={accessKey} />
        ) : (
          <AccessGate
            onUnlock={(key) => {
              setAccessKey(key);
              setUnlocked(true);
            }}
          />
        )}
      </div>
    </main>
  );
}

/* ─── Top strip — minimal chrome ────────────────────────────────── */

function TopStrip({
  unlocked,
  onLock,
}: {
  unlocked: boolean;
  onLock: () => void;
}) {
  return (
    <div className="border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between">
        <p className="text-slate-500 text-[10px] font-mono tracking-[0.32em] uppercase">
          [ KORE ADMIN &nbsp;·&nbsp; DOCUMENT INGESTION CONSOLE ]
        </p>
        {unlocked && (
          <button
            onClick={onLock}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-100 text-xs font-mono uppercase tracking-widest opacity-70 hover:opacity-100 transition-opacity"
          >
            <Lock className="w-3 h-3" />
            Lock session
          </button>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Access gate
   ═══════════════════════════════════════════════════════════════════ */

function AccessGate({ onUnlock }: { onUnlock: (key: string) => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!value) return;
    setError(null);
    startTransition(async () => {
      const ok = await verifyAccess(value);
      if (ok) {
        onUnlock(value);
      } else {
        setError("Access denied. Key does not match.");
      }
    });
  }

  return (
    <div className="max-w-md mx-auto pt-20 md:pt-32">
      <p className="text-slate-600 text-[10px] font-mono tracking-[0.32em] uppercase mb-6">
        [ Restricted &nbsp;·&nbsp; Admin Only ]
      </p>
      <h1 className="text-4xl md:text-5xl font-bold text-slate-50 tracking-tighter leading-[0.95] mb-4">
        Enter Administrator
        <br />
        Access Key<span className="text-slate-600">.</span>
      </h1>
      <p className="text-slate-500 text-sm leading-relaxed mb-10 max-w-sm">
        This console is restricted to authorised personnel. All uploads are
        recorded on the server and re-verified against the access key.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          autoFocus
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Access key"
          className="w-full bg-transparent border-b border-slate-800/60 focus:border-slate-400 outline-none text-slate-50 text-lg py-3 tracking-wide placeholder:text-slate-700 transition-colors"
        />

        <button
          type="submit"
          disabled={pending || value.length === 0}
          className="inline-flex items-center gap-2 text-sm text-slate-50 hover:text-slate-50 opacity-90 hover:opacity-100 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          {pending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ShieldCheck className="w-4 h-4" />
          )}
          Unlock Console →
        </button>

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm pt-4 border-t border-slate-800/60 mt-6">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </form>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Dashboard (unlocked)
   ═══════════════════════════════════════════════════════════════════ */

function Dashboard({ accessKey }: { accessKey: string }) {
  const [documents, setDocuments] = useState<DocumentEntry[]>([]);
  const [listPending, startListTransition] = useTransition();

  const refresh = useCallback(() => {
    startListTransition(async () => {
      const list = await listDocuments();
      setDocuments(list);
    });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div>
      {/* Editorial page header */}
      <header className="mb-14 md:mb-16">
        <p className="text-slate-600 text-[10px] font-mono tracking-[0.32em] uppercase mb-4">
          [ Session Unlocked &nbsp;·&nbsp; Uploads write to /public ]
        </p>
        <h1 className="text-5xl md:text-6xl font-bold text-slate-50 tracking-tighter leading-[0.92] mb-4">
          Document Ingestion<span className="text-slate-600">.</span>
        </h1>
        <p className="text-slate-500 text-base leading-relaxed max-w-2xl">
          Upload PDF documents into the project&apos;s file system. Files are
          streamed to disk under
          <span className="text-slate-300 font-mono text-sm px-1">
            /public/documents/…
          </span>
          based on their document class.
        </p>
      </header>

      <div className="border-t border-slate-800/60 mb-12" />

      {/* 2-column grid */}
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
        <UploadConsole
          accessKey={accessKey}
          onUploaded={refresh}
        />
        <RepositoryLog
          documents={documents}
          listPending={listPending}
          onRefresh={refresh}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Left column — Upload Console
   ═══════════════════════════════════════════════════════════════════ */

function UploadConsole({
  accessKey,
  onUploaded,
}: {
  accessKey: string;
  onUploaded: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState<DocumentType>("annual-report");
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState<{
    ok: boolean;
    message: string;
    savedAs?: string;
  } | null>(null);
  const [pending, startUpload] = useTransition();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setStatus(null);
  }

  function handleDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) {
      setFile(f);
      setStatus(null);
    }
  }

  function clearFile() {
    setFile(null);
    setStatus(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file || pending) return;

    setStatus(null);
    startUpload(async () => {
      const fd = new FormData();
      fd.append("accessKey", accessKey);
      fd.append("documentType", docType);
      fd.append("file", file);

      const result = await uploadDocument(fd);
      setStatus(result);

      if (result.ok) {
        clearFile();
        onUploaded();
      }
    });
  }

  return (
    <section>
      <p className="text-slate-600 text-[10px] font-mono tracking-[0.32em] uppercase mb-6">
        01 &nbsp;·&nbsp; Upload Control Console
      </p>

      <h2 className="text-3xl md:text-4xl font-bold text-slate-50 tracking-tighter leading-tight mb-8">
        Ingest a new document.
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ── Document type segmented control ── */}
        <div>
          <p className="text-slate-600 text-[10px] font-mono tracking-[0.25em] uppercase mb-3">
            Document class
          </p>
          <div className="inline-flex border border-slate-800/60 rounded-none">
            <TypeToggle
              active={docType === "annual-report"}
              onClick={() => setDocType("annual-report")}
              label="Annual Report"
            />
            <TypeToggle
              active={docType === "policy-doc"}
              onClick={() => setDocType("policy-doc")}
              label="Statutory Policy"
            />
          </div>
        </div>

        {/* ── Drag-drop / click file input ── */}
        <div>
          <p className="text-slate-600 text-[10px] font-mono tracking-[0.25em] uppercase mb-3">
            File
          </p>
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`block cursor-pointer border border-dashed transition-colors ${
              dragOver
                ? "border-slate-400 bg-[#090d16]"
                : "border-slate-800/60 hover:border-slate-600"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
            {file ? (
              <div className="flex items-center gap-4 px-6 py-6">
                <FileText className="w-6 h-6 text-slate-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-slate-50 text-sm font-medium truncate">
                    {file.name}
                  </p>
                  <p className="text-slate-500 text-xs mt-0.5 font-mono">
                    {formatBytes(file.size)}
                    &nbsp;&nbsp;·&nbsp;&nbsp;
                    {file.type || "application/pdf"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    clearFile();
                  }}
                  className="text-slate-500 hover:text-slate-100 opacity-70 hover:opacity-100 transition-opacity shrink-0"
                  aria-label="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="px-6 py-10 text-center">
                <Upload className="w-6 h-6 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-300 text-sm font-medium">
                  Drop a PDF here
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  or click to browse &nbsp;·&nbsp; up to 25 MB
                </p>
              </div>
            )}
          </label>
        </div>

        {/* ── Submit ── */}
        <div className="pt-2 flex items-center gap-6">
          <button
            type="submit"
            disabled={!file || pending}
            className={`inline-flex items-center gap-2 border px-6 py-3 text-sm font-semibold tracking-tight transition-all ${
              !file || pending
                ? "border-slate-800/60 text-slate-600 cursor-not-allowed"
                : "border-slate-300 text-slate-50 hover:bg-slate-50 hover:text-[#030712]"
            }`}
          >
            {pending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {pending ? "Uploading…" : "Upload to Repository"}
          </button>

          {status && !pending && (
            <div
              className={`flex items-center gap-2 text-sm ${
                status.ok ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {status.ok ? (
                <ShieldCheck className="w-4 h-4" />
              ) : (
                <ShieldAlert className="w-4 h-4" />
              )}
              <span>{status.message}</span>
            </div>
          )}
        </div>
      </form>
    </section>
  );
}

function TypeToggle({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-5 py-2.5 text-xs md:text-sm font-semibold tracking-tight transition-colors ${
        active
          ? "bg-slate-50 text-[#030712]"
          : "bg-transparent text-slate-400 hover:text-slate-50"
      }`}
    >
      {label}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Right column — Repository Directory Log
   ═══════════════════════════════════════════════════════════════════ */

function RepositoryLog({
  documents,
  listPending,
  onRefresh,
}: {
  documents: DocumentEntry[];
  listPending: boolean;
  onRefresh: () => void;
}) {
  const grouped = documents.reduce<Record<string, DocumentEntry[]>>(
    (acc, doc) => {
      const bucket = acc[doc.typeLabel] || [];
      bucket.push(doc);
      acc[doc.typeLabel] = bucket;
      return acc;
    },
    {}
  );

  return (
    <section>
      <div className="flex items-baseline justify-between mb-6">
        <p className="text-slate-600 text-[10px] font-mono tracking-[0.32em] uppercase">
          02 &nbsp;·&nbsp; Repository Directory Log
        </p>
        <button
          onClick={onRefresh}
          disabled={listPending}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-100 text-[10px] font-mono uppercase tracking-widest opacity-70 hover:opacity-100 transition-opacity disabled:opacity-40"
        >
          <RefreshCcw
            className={`w-3 h-3 ${listPending ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      <h2 className="text-3xl md:text-4xl font-bold text-slate-50 tracking-tighter leading-tight mb-8">
        Files on disk.
      </h2>

      {documents.length === 0 && !listPending ? (
        <div className="border border-dashed border-slate-800/60 px-6 py-16 text-center">
          <p className="text-slate-500 text-sm">
            No files ingested yet.
          </p>
          <p className="text-slate-600 text-xs mt-2 font-mono uppercase tracking-widest">
            Upload a PDF from the left panel to begin.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(grouped).map(([label, docs]) => (
            <div key={label}>
              <div className="flex items-baseline justify-between pb-3 border-b border-slate-800/60 mb-4">
                <h3 className="text-slate-50 text-lg md:text-xl font-bold tracking-tight">
                  {label}
                </h3>
                <span className="text-slate-500 text-[10px] font-mono uppercase tracking-[0.25em]">
                  {docs.length} {docs.length === 1 ? "file" : "files"}
                </span>
              </div>

              <div className="divide-y divide-slate-800/60">
                {docs.map((doc) => (
                  <article
                    key={doc.publicPath}
                    className="grid grid-cols-12 gap-3 py-4 items-baseline"
                  >
                    <div className="col-span-12 md:col-span-7 min-w-0">
                      <p className="text-slate-100 text-sm font-medium truncate">
                        {doc.filename}
                      </p>
                      <p className="text-slate-500 text-[10px] font-mono mt-1 truncate">
                        {doc.publicPath}
                      </p>
                    </div>
                    <div className="col-span-6 md:col-span-3 space-y-0.5">
                      <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">
                        Size
                      </p>
                      <p className="text-slate-300 text-xs font-mono tabular-nums">
                        {formatBytes(doc.sizeBytes)}
                      </p>
                    </div>
                    <div className="col-span-6 md:col-span-2 flex md:justify-end">
                      <a
                        href={doc.publicPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-300 opacity-70 hover:opacity-100 hover:text-slate-50 transition-opacity"
                      >
                        View&nbsp;→
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ─── utils ─────────────────────────────────────────────────────── */

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
