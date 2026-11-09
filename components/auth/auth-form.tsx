"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import { Logo } from "@/components/brand";
import { Button, ButtonLink } from "@/components/ui";

type Props = { mode: "signin" | "signup"; supabase: { url: string; anonKey: string } | null; next: string; error?: string; dev: boolean };

export function AuthForm({ mode, supabase: cfg, next, error, dev }: Props) {
  const client = useMemo(() => (cfg ? createBrowserClient(cfg.url, cfg.anonKey) : null), [cfg]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(error ? { tone: "err", text: error } : null);
  const callback = () => `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

  const google = async () => {
    if (!client) return;
    setBusy(true);
    const { error } = await client.auth.signInWithOAuth({ provider: "google", options: { redirectTo: callback() } });
    if (error) {
      setMsg({ tone: "err", text: error.message });
      setBusy(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client) return;
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "signin") {
        const { error } = await client.auth.signInWithPassword({ email, password });
        if (error) return setMsg({ tone: "err", text: error.message });
        location.href = next;
      } else {
        const { data, error } = await client.auth.signUp({ email, password, options: { emailRedirectTo: callback() } });
        if (error) return setMsg({ tone: "err", text: error.message });
        if (data.session) location.href = next;
        else setMsg({ tone: "ok", text: "Check your email to confirm your account, then sign in." });
      }
    } finally {
      setBusy(false);
    }
  };

  const title = mode === "signin" ? "Sign in" : "Create your account";
  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <div className="card w-full max-w-sm p-6">
        <Logo href="/" />
        <h1 className="display mt-6 text-2xl">{title}</h1>
        <p className="mt-1 text-sm text-muted">{mode === "signin" ? "Welcome back to the GTM Architect." : "Your conversations, Library, credits and keys stay private to your account."}</p>
        {dev && !cfg ? (
          <div className="mt-5 space-y-3">
            <p className="rounded-lg border border-amber/30 bg-amber-soft px-3 py-2 text-xs text-amber">Dev mode: Supabase isn&apos;t configured, so you&apos;re signed in as the local dev user.</p>
            <ButtonLink href={next} className="w-full">Continue as dev user</ButtonLink>
          </div>
        ) : (
          <>
            <Button className="mt-5 w-full" variant="outline" type="button" disabled={busy || !client} onClick={google}>
              Continue with Google
            </Button>
            <div className="my-4 flex items-center gap-3 text-[11px] text-faint">
              <span className="h-px flex-1 bg-line" /> or with email <span className="h-px flex-1 bg-line" />
            </div>
            <form onSubmit={submit} className="space-y-3">
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required autoComplete="email" placeholder="you@company.com" aria-label="Email" className="w-full rounded-lg border hairline bg-paper px-3 py-2 text-sm outline-none focus:border-clay" />
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={8} autoComplete={mode === "signin" ? "current-password" : "new-password"} placeholder="Password (8+ characters)" aria-label="Password" className="w-full rounded-lg border hairline bg-paper px-3 py-2 text-sm outline-none focus:border-clay" />
              <Button className="w-full" type="submit" disabled={busy || !client}>{busy ? "Please wait…" : title}</Button>
            </form>
          </>
        )}
        {msg && <p className={`mt-3 text-xs ${msg.tone === "ok" ? "text-evergreen" : "text-rose"}`}>{msg.text}</p>}
        <p className="mt-5 text-xs text-muted">
          {mode === "signin" ? (
            <>No account? <Link href={`/signup?next=${encodeURIComponent(next)}`} className="underline">Sign up</Link></>
          ) : (
            <>Already have an account? <Link href={`/signin?next=${encodeURIComponent(next)}`} className="underline">Sign in</Link></>
          )}
        </p>
      </div>
    </main>
  );
}
