"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, LogIn, AlertCircle } from "lucide-react";
import { createAuthBrowserClient } from "@/lib/supabase/auth-browser";
import { AuthShell } from "../_auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PRIMARY_BTN =
  "bg-emerald text-obsidian hover:bg-emerald/90 focus-visible:ring-emerald/40";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    const supabase = createAuthBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      setBusy(false);
      setError("Invalid email or password.");
      return;
    }
    // Navigate to the console — this RSC request carries the new session
    // cookie, so the proxy and server components render authenticated. (No
    // router.refresh() needed: replace already does a fresh server round-trip,
    // and the dashboard loads its data client-side on mount.)
    router.replace("/admin");
  }

  return (
    <AuthShell
      title="Sign in"
      subtitle="Enter your admin credentials to access the console."
      footer={
        <Link
          href="/admin/forgot-password"
          className="text-emerald hover:underline"
        >
          Forgot password?
        </Link>
      }
    >
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

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-10"
          />
        </div>

        {error ? (
          <p className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            {error}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={busy || !email.trim() || !password}
          className={`w-full ${PRIMARY_BTN}`}
        >
          {busy ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <LogIn className="size-4" />
          )}
          {busy ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
}
