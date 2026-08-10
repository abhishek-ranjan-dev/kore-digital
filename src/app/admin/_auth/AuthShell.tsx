import { Database } from "lucide-react";

/*
  Shared chrome for the /admin auth pages (login, forgot, update password).
  Centered card on the admin dark theme, matching the data console's palette
  (emerald accent on obsidian). Presentational only — pages own their forms.
*/
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="dark grid min-h-screen place-items-center bg-background px-4 text-foreground">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-lg border border-emerald/25 bg-emerald/15 text-emerald">
            <Database className="size-4" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Kore Digital</p>
            <p className="text-xs text-muted-foreground">Investor data console</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-2xl">
          <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>

        {footer ? (
          <div className="mt-5 text-center text-sm text-muted-foreground">
            {footer}
          </div>
        ) : null}
      </div>
    </main>
  );
}
