import { FlaskConical } from "lucide-react";
import { getStore } from "@/lib/db";
import { Badge, Card, Empty, PageHeader } from "@/components/ui";
import { timeAgo } from "@/lib/utils";
import { tracingEnabled } from "@/lib/observability/langsmith";

export const dynamic = "force-dynamic";
export const metadata = { title: "Evals" };

export default async function EvalsPage() {
  const evals = await getStore().listEvals(20);
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
      <PageHeader
        eyebrow="LangSmith"
        title="Evals"
        description={<>A golden dataset of GTM requests is run through the full pipeline and scored by deterministic evaluators (wholeness, completeness, structure, truth, quality). Run <code className="font-mono text-xs">npm run eval</code>; with a LangSmith key, results also appear as an experiment in LangSmith.</>}
        actions={<Badge tone={tracingEnabled() ? "green" : "neutral"}>{tracingEnabled() ? "LangSmith connected" : "LangSmith off"}</Badge>}
      />
      <div className="mt-6 space-y-4">
        {evals.length === 0 ? (
          <Empty icon={<FlaskConical className="h-8 w-8" />} title="No eval runs yet">
            In a terminal, run <code className="font-mono">npm run eval</code>. Results are saved here.
          </Empty>
        ) : (
          evals.map((e) => (
            <Card key={e.id} className="p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <div className="text-sm font-medium text-ink">{e.name}</div>
                  <div className="font-mono text-[10px] text-faint">{e.model} · {timeAgo(e.createdAt)}</div>
                </div>
                {e.langsmithUrl && <a href={e.langsmithUrl} target="_blank" rel="noreferrer" className="text-xs text-clay underline">Open in LangSmith</a>}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {Object.entries(e.summary).map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-paper-2 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-faint">{k.replace(/_/g, " ")}</div>
                    <div className="display mt-1 text-2xl">{k.includes("rate") || k.includes("pass") ? `${Math.round(v * 100)}%` : Number.isInteger(v) ? v : v.toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[600px] text-xs">
                  <thead><tr className="text-left text-muted"><th className="py-1.5 pr-3 font-medium">Case</th>{Object.keys(e.results[0]?.scores ?? {}).map((k) => <th key={k} className="py-1.5 pr-3 font-medium">{k}</th>)}<th className="py-1.5 font-medium">Pass</th></tr></thead>
                  <tbody>
                    {e.results.map((r) => (
                      <tr key={r.caseId} className="border-t hairline">
                        <td className="py-1.5 pr-3 font-mono">{r.caseId}</td>
                        {Object.values(r.scores).map((v, i) => <td key={i} className="py-1.5 pr-3 font-mono">{typeof v === "number" ? (v <= 1 ? v.toFixed(2) : v) : String(v)}</td>)}
                        <td className="py-1.5">{r.pass ? <Badge tone="green">pass</Badge> : <Badge tone="rose">fail</Badge>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}
