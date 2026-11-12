import type { Metadata } from "next";

export const metadata: Metadata = { title: "Architecture · Loadsmart ABM OS" };

const layers = [
  {
    name: "Systems of record",
    items: ["Salesforce (accounts, contacts, ABM fields, reason codes)", "Gong (flows, tasks, calls)", "ZoomInfo / Clay / Apollo (data)"],
    tone: "bg-card",
  },
  {
    name: "Orchestration (deterministic)",
    items: ["n8n or Make: schedules, dedupe, filters, caps, mailbox rotation, stop rules, CRM writes", "Cloudflare Worker cron triggers each step on time"],
    tone: "bg-card",
  },
  {
    name: "Judgment (Claude)",
    items: ["Account scoring rationale", "Research briefs with evidence checks", "Email bodies", "Weekly feedback themes"],
    tone: "bg-brand-soft",
  },
  {
    name: "This app (Vercel)",
    items: ["Playbook + skills library", "Pod dashboard", "Pod Copilot: AI SDK + AI Gateway, read-only tools", "/api/pipeline/run (dry-run in v0.1)"],
    tone: "bg-card",
  },
];

const status = [
  ["Playbook, skills library, downloads", "Live", "good"],
  ["Pod dashboard (CSV import, sample data)", "Live", "good"],
  ["Pod Copilot (grounded in playbook + skills)", "Live", "good"],
  ["A2A agent card", "Live", "good"],
  ["Cloudflare cron scheduler → /api/pipeline/run", "Scaffolded, dry-run", "warn"],
  ["Supabase: runs, approvals, feedback with RLS", "Schema written, not connected", "warn"],
  ["Salesforce / Gong / ZoomInfo connections", "v1.1 (needs Loadsmart access)", "mute"],
  ["Login and per-pod access", "v1.1", "mute"],
] as const;

export default function ArchitecturePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="text-[13px] font-medium text-brand uppercase tracking-[0.08em]">Architecture</p>
      <h1 className="mt-2 text-[34px] font-bold tracking-[-0.02em]">How the pieces fit</h1>
      <p className="mt-3 text-ink-2 max-w-3xl leading-relaxed">
        Salesforce stays the source of truth. Rule-based work runs in a workflow tool so the same input always gives the
        same output. Claude is called only where judgment is needed, and every send or CRM write waits for a person.
      </p>

      <div className="mt-10 grid lg:grid-cols-4 gap-3">
        {layers.map((l, i) => (
          <div key={l.name} className={`rounded-xl border border-line p-5 ${l.tone}`}>
            <p className="text-[12px] font-semibold text-muted">Layer {i + 1}</p>
            <h2 className="mt-1 font-semibold">{l.name}</h2>
            <ul className="mt-3 space-y-2 text-[13.5px] text-ink-2">
              {l.items.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-line bg-card p-5">
        <h2 className="font-semibold">A day in the data</h2>
        <ol className="mt-3 grid md:grid-cols-4 gap-3 text-[13.5px] text-ink-2">
          <li><b className="text-ink">06:00</b> Cron fires la-signal → n8n pulls sources → Claude keeps sourced signals → Signal__c rows.</li>
          <li><b className="text-ink">07:00–08:00</b> Enrich gaps only → research brief with evidence → email body in AI_Email_1__c.</li>
          <li><b className="text-ink">08:30</b> Approval request to the pod: count, 3 sample emails, schedule. Yes → Gong flow enrollment.</li>
          <li><b className="text-ink">17:00</b> Daily report → dashboard CSV + Slack digest; reason codes feed Monday&apos;s feedback run.</li>
        </ol>
      </div>

      <div className="mt-10 grid md:grid-cols-2 gap-6">
        <section className="rounded-xl border border-line bg-card p-5">
          <h2 className="font-semibold">What is live vs scaffolded</h2>
          <table className="mt-3 w-full text-[13.5px]">
            <tbody>
              {status.map(([item, s, tone]) => (
                <tr key={item} className="border-b border-line last:border-0">
                  <td className="py-2 pr-3 text-ink-2">{item}</td>
                  <td className="py-2 text-right whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-[12px] font-semibold ${tone === "good" ? "bg-good-soft text-good" : tone === "warn" ? "bg-warn-soft text-warn" : "bg-paper text-muted"}`}>{s}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="rounded-xl border border-line bg-card p-5">
          <h2 className="font-semibold">Stack</h2>
          <ul className="mt-3 space-y-2 text-[13.5px] text-ink-2">
            <li><b className="text-ink">App:</b> Next.js 16 on Vercel, Tailwind 4</li>
            <li><b className="text-ink">Agent:</b> Vercel AI SDK 7, AI Gateway (or Anthropic key), read-only tools over the playbook, skills and config</li>
            <li><b className="text-ink">Scheduler:</b> Cloudflare Worker cron (apps/edge)</li>
            <li><b className="text-ink">Data (v1.1):</b> Supabase Postgres with row-level security per pod</li>
            <li><b className="text-ink">Workflows:</b> n8n (recommended) or Make</li>
            <li><b className="text-ink">Agent spec:</b> agents/loadsmart-pod-copilot/agent.yaml, plus an A2A card at <code className="font-mono text-[12.5px]">/api/agents/loadsmart-pod-copilot/agent-card</code></li>
          </ul>
        </section>
      </div>
    </div>
  );
}
