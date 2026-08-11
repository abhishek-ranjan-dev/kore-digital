"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAuthBrowserClient } from "@/lib/supabase/auth-browser";
import { SignInCard } from "@/components/ui/sign-in-card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit() {
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
    <SignInCard
      email={email}
      onEmailChange={setEmail}
      password={password}
      onPasswordChange={setPassword}
      onSubmit={onSubmit}
      isLoading={busy}
      error={error}
      forgotPasswordHref="/admin/forgot-password"
    />
  );
}
