import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { getStore } from "@/lib/db";
import { PipelineTracker, Waves, WGauge } from "@/components/pipeline";
import { Badge, Card, Meter, PageHeader, statusTone, verdictTone } from "@/components/ui";
import { fmtMs, timeAgo } from "@/lib/utils";
import { ASSET_TITLES } from "@/lib/pal/intent";

export const dynamic = "force-dynamic";

export default async function RunDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const store = getStore();
  const run = await store.getRun(id);
  if (!run) notFound();
  const artifacts = await store.listArtifacts({ runId: id });
  const assets = artifacts.filter((a) => a.group === "asset");
  const pop = artifacts.filter((a) => a.group === "pop").sort((a, b) => (a.code ?? "").localeCompare(b.code ?? ""));
  const titles = Object.fromEntries(Object.entries(ASSET_TITLES)) as Record<string, string>;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
      <PageHeader
        eyebrow={`Run manifest · ${run.id}`}
        title={run.title}
        description={<>Started {timeAgo(run.createdAt)} · {fmtMs(run.durationMs)} · source: {run.source} · model: {run.model}</>}
        actions={
          <>
            <Badge tone={statusTone(run.status)}>{run.status.replace("_", " ")}</Badge>
            {run.traceUrl && (
              <a href={run.traceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-clay underline underline-offset-2">
                LangSmith trace <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {run.conversationId && <Link href={`/app/c/${run.conversationId}`} className="text-xs text-clay underline underline-offset-2">Open conversation</Link>}
          </>
        }
      />

      <div className="mt-6 grid gap-5 lg:grid-cols-[300px_1fr]">
        <div className="space-y-5">
          <Card className="p-5">
            <div className="eyebrow mb-4">Pipeline</div>
            <PipelineTracker stages={run.stages} />
          </Card>
          {run.foundation && (
            <Card className="p-5">
              <div className="eyebrow mb-3">Foundation</div>
              <div className="flex items-center gap-4">
                <WGauge W={run.foundation.W} />
                <div className="text-xs text-muted">Coverage {Math.round(run.foundation.coverage * 100)}% of context</div>
              </div>
              <ul className="mt-4 space-y-1.5 text-xs">
                {run.foundation.criteria.map((c) => (
                  <li key={c.id} className="flex items-start gap-2">
                    <span className={c.met ? "text-evergreen" : c.critical ? "text-amber" : "text-faint"}>{c.met ? "●" : "○"}</span>
                    <span className="min-w-0">
                      <span className="text-ink">{c.label}</span>
                      {c.value && <span className="block truncate text-muted">{c.value}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        <div className="min-w-0 space-y-5">
          {run.quality && (
            <Card className="p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <div className="eyebrow">Quality gate</div>
                  <div className="display mt-1 text-4xl">{run.quality.score}<span className="text-lg text-faint">/100</span></div>
                </div>
                <Badge tone={verdictTone(run.quality.verdict)}>{run.quality.verdict}</Badge>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {run.quality.dimensions.map((d) => (
                  <div key={d.id}>
                    <div className="flex justify-between text-xs"><span className="text-ink">{d.label}</span><span className="font-mono text-muted">{d.score}/{d.weight}</span></div>
                    <Meter value={d.score} max={d.weight} tone={d.score / d.weight >= 0.9 ? "green" : "clay"} className="mt-1" />
                  </div>
                ))}
              </div>
              <ul className="mt-4 grid gap-1 text-xs sm:grid-cols-2">
                {run.quality.checks.map((c) => (
                  <li key={c.id} className="flex gap-2"><span className={c.pass ? "text-evergreen" : "text-amber"}>{c.pass ? "✓" : "!"}</span><span className="text-ink-2">{c.label} <span className="text-faint">{c.detail}</span></span></li>
                ))}
              </ul>
            </Card>
          )}

          {run.truth?.notice && <div className="rounded-xl bg-amber-soft px-4 py-3 text-sm text-amber">{run.truth.notice}<div className="mt-1 font-mono text-[11px] opacity-80">{run.truth.findings.filter((f) => !f.grounded).map((f) => `${f.type}: ${f.value}`).join(" · ")}</div></div>}

          {run.nextAction && (
            <Card className="border-clay/30 p-5">
              <div className="eyebrow !text-clay">One must act — next action</div>
              <div className="display mt-1 text-xl">{run.nextAction.action}</div>
              <div className="mt-2 text-xs text-muted">Owner: {run.nextAction.owner} · Due: {run.nextAction.due} · Proof: {run.nextAction.proof}</div>
            </Card>
          )}

          {run.plan && (
            <Card className="p-5">
              <div className="eyebrow mb-3">Middle-out plan · est. {run.plan.compression}× ({fmtMs(run.plan.sequentialEstMs)} → {fmtMs(run.plan.waveEstMs)})</div>
              <Waves waves={run.plan.waves} titles={{ ...titles, research: "Knowledge retrieval" }} />
              {run.plan.pruned.length > 0 && <p className="mt-2 text-[11px] text-faint">Pruned: {run.plan.pruned.map((p) => `${p.id} (${p.reason})`).join(", ")}</p>}
            </Card>
          )}

          <Card className="p-5">
            <div className="eyebrow mb-3">Artifacts · {assets.length} assets + {pop.length} POP</div>
            <div className="grid gap-2 sm:grid-cols-2">
              {[...assets, ...pop].map((a) => (
                <Link key={a.id} href={`/app/library/${a.id}`} className="flex items-center justify-between gap-2 rounded-lg border hairline px-3 py-2 text-sm hover:bg-paper-2">
                  <span className="truncate">{a.title}</span>
                  <Badge tone={statusTone(a.status)}>v{a.version}</Badge>
                </Link>
              ))}
            </div>
          </Card>

          {run.intake && (
            <details className="card p-5">
              <summary className="cursor-pointer text-sm font-medium">MASTER.md (compiled input)</summary>
              <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap rounded-lg bg-paper-2 p-3 font-mono text-[11px] text-ink-2">{run.intake.masterMd}</pre>
            </details>
          )}
          <details className="card p-5">
            <summary className="cursor-pointer text-sm font-medium">Raw run manifest (JSON)</summary>
            <pre className="mt-3 max-h-96 overflow-auto rounded-lg bg-paper-2 p-3 font-mono text-[11px] text-ink-2">{JSON.stringify({ ...run, intake: run.intake ? { ...run.intake, masterMd: "…" } : undefined }, null, 2)}</pre>
          </details>
        </div>
      </div>
    </main>
  );
}
