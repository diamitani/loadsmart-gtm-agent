import Link from "next/link";
import { Workflow } from "lucide-react";
import { getStore } from "@/lib/db";
import { Badge, ButtonLink, Empty, PageHeader, statusTone, verdictTone } from "@/components/ui";
import { fmtMs, timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Runs" };

export default async function RunsPage() {
  const runs = await getStore().listRuns(100);
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
      <PageHeader eyebrow="Observability" title="Runs" description="Every PAL run with its manifest: inputs, intent, foundation, plan, artifacts, truth and quality results." actions={<ButtonLink href="/app" size="sm">New request</ButtonLink>} />
      <div className="mt-6">
        {runs.length === 0 ? (
          <Empty icon={<Workflow className="h-8 w-8" />} title="No runs yet">Start a request in the Architect — each one is recorded here.</Empty>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b hairline text-left text-xs text-muted">
                  <th className="px-4 py-3 font-medium">Run</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">W</th>
                  <th className="px-4 py-3 font-medium">Quality</th>
                  <th className="px-4 py-3 font-medium">Assets</th>
                  <th className="px-4 py-3 font-medium">Duration</th>
                  <th className="px-4 py-3 font-medium">When</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((r) => (
                  <tr key={r.id} className="border-b hairline last:border-0 hover:bg-paper-2/60">
                    <td className="max-w-[280px] px-4 py-3">
                      <Link href={`/app/runs/${r.id}`} className="block truncate font-medium text-ink hover:text-clay">{r.title}</Link>
                      <span className="font-mono text-[10px] text-faint">{r.id}</span>
                    </td>
                    <td className="px-4 py-3"><Badge tone={statusTone(r.status)}>{r.status.replace("_", " ")}</Badge></td>
                    <td className="px-4 py-3 font-mono text-xs">{r.foundation ? r.foundation.W.toFixed(2) : "—"}</td>
                    <td className="px-4 py-3">{r.quality ? <Badge tone={verdictTone(r.quality.verdict)}>{r.quality.score}</Badge> : "—"}</td>
                    <td className="px-4 py-3 text-xs text-muted">{r.intent?.requestedAssets.length ?? 0}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted">{fmtMs(r.durationMs)}</td>
                    <td className="px-4 py-3 text-xs text-muted">{timeAgo(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
