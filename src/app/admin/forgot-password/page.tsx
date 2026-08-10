"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Loader2, Send, MailCheck, ArrowLeft } from "lucide-react";
import { createAuthBrowserClient } from "@/lib/supabase/auth-browser";
import { AuthShell } from "../_auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PRIMARY_BTN =
  "bg-emerald text-obsidian hover:bg-emerald/90 focus-visible:ring-emerald/40";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    const supabase = createAuthBrowserClient();
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${location.origin}/auth/callback?next=/admin/update-password`,
    });
    // Always show the same confirmation — resetPasswordForEmail never reveals
    // whether the address exists (no user enumeration).
    setBusy(false);
    setSent(true);
  }

  return (
    <AuthShell
      title="Reset password"
      subtitle={
        sent
          ? "Check your inbox."
          : "We'll email you a secure link to set a new password."
      }
      footer={
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-1.5 text-emerald hover:underline"
        >
          <ArrowLeft className="size-3.5" />
          Back to sign in
        </Link>
      }
    >
      {sent ? (
        <div className="flex items-start gap-3 rounded-lg border border-emerald/25 bg-emerald/10 p-4">
          <MailCheck className="mt-0.5 size-5 shrink-0 text-emerald" />
          <p className="text-sm text-muted-foreground">
            If an account exists for that address, we&apos;ve emailed a
            password-reset link. It may take a minute to arrive — check spam if
            you don&apos;t see it.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              autoFocus
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@koredigital.com"
              className="h-10"
            />
          </div>

          <Button
            type="submit"
            disabled={busy || !email.trim()}
            className={`w-full ${PRIMARY_BTN}`}
          >
            {busy ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            {busy ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
