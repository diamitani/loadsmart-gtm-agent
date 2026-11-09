"use client";
import { useState } from "react";
import { CheckCircle2, CircleDashed, Coins, KeyRound, Trash2 } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import type { BillingStatus } from "@/lib/billing/status";
import { timeAgo } from "@/lib/utils";

const money = (cents: number, currency: string) => new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(cents / 100);
const REASON: Record<string, string> = { purchase: "Credit purchase", ai_call: "AI call", refund: "Refund (failed call)", free_grant: "Welcome credits", admin: "Adjustment" };

export function BillingPanel({ initial, checkout }: { initial: BillingStatus; checkout?: "success" | "cancelled" }) {
  const [s, setS] = useState(initial);
  const [provider, setProvider] = useState(initial.key?.provider ?? "anthropic");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(
    checkout === "success" ? { tone: "ok", text: "Payment received — your credits appear here within a few seconds. Refresh if they haven't yet." } : checkout === "cancelled" ? { tone: "err", text: "Checkout cancelled — you weren't charged." } : null,
  );

  const refresh = async () => {
    const r = await fetch("/api/billing", { cache: "no-store" });
    if (r.ok) setS(await r.json());
  };
  const call = async (label: string, fn: () => Promise<Response>, ok: string) => {
    setBusy(label);
    setMsg(null);
    try {
      const r = await fn();
      const j = (await r.json().catch(() => ({}))) as { error?: string; url?: string };
      if (!r.ok) return setMsg({ tone: "err", text: j.error || "Something went wrong." });
      if (j.url) {
        location.href = j.url;
        return;
      }
      setMsg({ tone: "ok", text: ok });
      await refresh();
    } finally {
      setBusy(null);
    }
  };
  const providerInfo = s.providers.find((p) => p.id === provider);
  const usingKey = !!s.key;

  return (
    <div className="mt-6 space-y-6">
      {msg && <div className={`rounded-xl border px-4 py-3 text-[13px] ${msg.tone === "ok" ? "border-evergreen/30 text-evergreen" : "border-rose/30 text-rose"}`}>{msg.text}</div>}

      <div className="grid gap-3 md:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-ink">
            <Coins className="h-4 w-4" /> Credits
          </div>
          <div className="display mt-3 text-4xl">{s.balance}</div>
          <div className="mt-1 text-xs text-muted">
            {usingKey ? "Not used while your own key is active." : s.metered ? `Each AI call uses ${s.creditsPerCall} credit${s.creditsPerCall === 1 ? "" : "s"}.` : "Metering is off on this server — AI calls are free."}
            {s.houseProvider === "demo" && " No server AI key is configured, so credits can't be spent yet — add your own key."}
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-ink">
            <KeyRound className="h-4 w-4" /> Your AI key
          </div>
          {s.key ? (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-evergreen" /> {s.key.label} key ending <code className="font-mono">…{s.key.last4}</code>
              {s.key.model && <Badge tone="neutral">{s.key.model}</Badge>}
              <span className="text-xs text-faint">saved {timeAgo(s.key.updatedAt)}</span>
            </div>
          ) : (
            <div className="mt-3 flex items-center gap-2 text-sm text-muted">
              <CircleDashed className="h-4 w-4 text-faint" /> No key — using credits.
            </div>
          )}
          {s.key && (
            <Button variant="ghost" size="sm" className="mt-3" disabled={!!busy} onClick={() => call("remove", () => fetch("/api/byok", { method: "DELETE" }), "Key removed. AI calls now use credits.")}>
              <Trash2 className="mr-1 h-3.5 w-3.5" /> Remove key
            </Button>
          )}
        </Card>
      </div>

      <section>
        <h2 className="display text-2xl">Buy credits</h2>
        {!s.stripeEnabled && (
          <p className="mt-1 text-sm text-muted">
            {s.stripeKeysPresent && !s.durable ? "Purchases are paused until the database (Supabase) is connected, so credits are never lost." : "Purchases aren't switched on yet. You can still add your own AI key below."}
          </p>
        )}
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {s.packs.map((p) => (
            <Card key={p.id} className="flex flex-col p-5">
              <div className="text-sm font-medium text-ink">{p.label}</div>
              <div className="display mt-2 text-3xl">{p.credits.toLocaleString()}</div>
              <div className="text-xs text-muted">credits · {money(p.amountCents, p.currency)}</div>
              <Button className="mt-4" disabled={!s.stripeEnabled || !!busy} onClick={() => call(p.id, () => fetch("/api/billing/checkout", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ packId: p.id }) }), "")}>
                {busy === p.id ? "Opening checkout…" : "Buy"}
              </Button>
            </Card>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-faint">Secure checkout by Stripe. Card details never touch this app.</p>
      </section>

      <section>
        <h2 className="display text-2xl">Bring your own key</h2>
        {!s.byokEnabled ? (
          <p className="mt-1 text-sm text-muted">Bring-your-own-key isn&apos;t enabled on this server (it needs <code className="font-mono text-xs">BYOK_ENCRYPTION_KEY</code>).</p>
        ) : (
          <Card className="mt-4 p-5">
            <form
              className="grid gap-3 sm:grid-cols-[180px_1fr]"
              onSubmit={(e) => {
                e.preventDefault();
                const body = JSON.stringify({ provider, apiKey: apiKey.trim(), model: model.trim() || undefined });
                setApiKey("");
                void call("save", () => fetch("/api/byok", { method: "PUT", headers: { "content-type": "application/json" }, body }), "Key saved. Your AI calls now use your own key — no credits used.");
              }}
            >
              <label className="text-xs text-muted">
                Provider
                <select value={provider} onChange={(e) => setProvider(e.target.value as typeof provider)} className="mt-1 w-full rounded-lg border hairline bg-paper px-3 py-2 text-sm text-ink">
                  {s.providers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs text-muted">
                API key
                <input value={apiKey} onChange={(e) => setApiKey(e.target.value)} type="password" autoComplete="off" spellCheck={false} placeholder={provider === "anthropic" ? "sk-ant-…" : provider === "openai" ? "sk-…" : "AI Gateway API key"} className="mt-1 w-full rounded-lg border hairline bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-clay" />
              </label>
              <label className="text-xs text-muted sm:col-start-2">
                Model (optional)
                <input value={model} onChange={(e) => setModel(e.target.value)} placeholder={providerInfo?.defaultModel} className="mt-1 w-full rounded-lg border hairline bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-clay" />
              </label>
              <div className="sm:col-start-2">
                <Button type="submit" disabled={!!busy || apiKey.trim().length < 16}>{busy === "save" ? "Saving…" : s.key ? "Replace key" : "Save key"}</Button>
                <p className="mt-2 text-[11px] text-faint">Encrypted at rest (AES-256-GCM) and only decrypted on the server to call your provider. It&apos;s never shown again or logged.</p>
              </div>
            </form>
          </Card>
        )}
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <Card className="p-5">
          <div className="text-sm font-medium text-ink">Account</div>
          <p className="mt-1 text-xs text-muted">Credits and your key belong to your sign-in, on every device.</p>
          <div className="mt-3 text-sm text-ink">{s.signedInAs ?? "Signed in"}</div>
          <form action="/auth/signout" method="post" className="mt-3">
            <Button size="sm" variant="ghost" type="submit">Sign out</Button>
          </form>
        </Card>
        <Card className="p-5">
          <div className="text-sm font-medium text-ink">Recent activity</div>
          {s.ledger.length === 0 ? (
            <p className="mt-2 text-xs text-muted">No credit activity yet.</p>
          ) : (
            <ul className="mt-2 divide-y divide-line text-xs">
              {s.ledger.map((l, i) => (
                <li key={i} className="flex items-center justify-between gap-3 py-1.5">
                  <span className="text-muted">{REASON[l.reason] ?? l.reason}</span>
                  <span className="text-faint">{timeAgo(l.createdAt)}</span>
                  <span className={`font-mono ${l.delta > 0 ? "text-evergreen" : "text-ink"}`}>{l.delta > 0 ? `+${l.delta}` : l.delta}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </div>
  );
}
