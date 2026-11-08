"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Ban, Plus } from "lucide-react";
import { Badge, Button, Card } from "./ui";
import { timeAgo } from "@/lib/utils";

const TYPES = ["call", "email", "linkedin", "dm", "meeting", "post", "sms", "note"] as const;
type Act = { id: string; type: string; account: string; contact?: string; count: number; stage?: string; notes?: string; occurredAt: string; crmRef?: string };

export function ActivityTracker({ activities, suppressions, topAccounts }: { activities: Act[]; suppressions: { value: string; reason: string; createdAt: string }[]; topAccounts: { account: string; count: number }[] }) {
  const router = useRouter();
  const [form, setForm] = useState({ type: "call", account: "", count: 1, stage: "cold", notes: "" });
  const [supp, setSupp] = useState("");
  const [busy, setBusy] = useState(false);
  const input = "w-full rounded-lg border hairline bg-paper px-3 py-2 text-sm outline-none focus:border-clay";

  const log = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.account.trim()) return;
    setBusy(true);
    await fetch("/api/activity", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...form, count: Number(form.count) || 1, notes: form.notes || undefined }) });
    setBusy(false);
    setForm((f) => ({ ...f, account: "", notes: "" }));
    router.refresh();
  };

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[340px_1fr]">
      <div className="space-y-5">
        <Card className="p-5">
          <div className="eyebrow mb-3">Quick log</div>
          <form onSubmit={log} className="space-y-3">
            <div className="flex flex-wrap gap-1">
              {TYPES.map((t) => (
                <button type="button" key={t} onClick={() => setForm({ ...form, type: t })} className={`rounded-full px-2.5 py-1 text-xs ${form.type === t ? "bg-ink text-paper" : "bg-paper-2 text-muted hover:text-ink"}`}>{t}</button>
              ))}
            </div>
            <input className={input} placeholder="Account (e.g. Acme Corp)" value={form.account} onChange={(e) => setForm({ ...form, account: e.target.value })} aria-label="Account" />
            <div className="flex gap-2">
              <input className={`${input} w-20`} type="number" min={1} max={500} value={form.count} onChange={(e) => setForm({ ...form, count: Number(e.target.value) })} aria-label="Count" />
              <select className={input} value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })} aria-label="Stage">
                <option value="cold">Cold outreach</option>
                <option value="follow_up">Follow-up</option>
                <option value="closing">Closing</option>
                <option value="other">Other</option>
              </select>
            </div>
            <textarea className={input} rows={2} placeholder="Notes (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} aria-label="Notes" />
            <Button className="w-full" disabled={busy || !form.account.trim()}><Plus className="h-4 w-4" /> Log activity</Button>
          </form>
        </Card>

        {topAccounts.length > 0 && (
          <Card className="p-5">
            <div className="eyebrow mb-2">Top accounts this month</div>
            {topAccounts.map((a) => <div key={a.account} className="flex justify-between py-1 text-sm"><span className="truncate">{a.account}</span><span className="font-mono text-muted">{a.count}</span></div>)}
          </Card>
        )}

        <Card className="p-5">
          <div className="eyebrow mb-2 flex items-center gap-1.5"><Ban className="h-3 w-3" /> Do-not-contact list</div>
          <p className="mb-3 text-xs text-muted">Every send checks this list first. Add opt-outs, customers or whole domains.</p>
          <form className="flex gap-2" onSubmit={async (e) => { e.preventDefault(); if (!supp.trim()) return; await fetch("/api/suppressions", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ value: supp }) }); setSupp(""); router.refresh(); }}>
            <input className={input} placeholder="email or domain.com" value={supp} onChange={(e) => setSupp(e.target.value)} aria-label="Email or domain to suppress" />
            <Button size="sm" variant="outline" className="h-auto">Add</Button>
          </form>
          <div className="mt-3 flex flex-wrap gap-1">{suppressions.map((s) => <Badge key={s.value} tone="rose">{s.value}</Badge>)}</div>
        </Card>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b hairline text-left text-xs text-muted">
              <th className="px-4 py-3 font-medium">When</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Account</th>
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {activities.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-muted">Nothing logged this month yet.</td></tr>}
            {activities.map((a) => (
              <tr key={a.id} className="border-b hairline last:border-0">
                <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted" suppressHydrationWarning>{timeAgo(a.occurredAt)}</td>
                <td className="px-4 py-2.5"><Badge tone={a.type === "meeting" ? "green" : a.type === "call" ? "clay" : "neutral"}>{a.type}</Badge>{a.stage && <span className="ml-1.5 text-[10px] text-faint">{a.stage.replace("_", "-")}</span>}</td>
                <td className="px-4 py-2.5 text-ink">{a.account}{a.contact && <span className="block text-[11px] text-faint">{a.contact}</span>}</td>
                <td className="px-4 py-2.5 font-mono text-xs">{a.count}</td>
                <td className="max-w-[260px] truncate px-4 py-2.5 text-xs text-muted">{a.notes}{a.crmRef && <Badge tone="sky" className="ml-1">CRM</Badge>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
