import { CheckCircle2, CircleDashed } from "lucide-react";
import { integrationStatus } from "@/lib/env";
import { getStore } from "@/lib/db";
import { Card, PageHeader } from "@/components/ui";
import { timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const status = integrationStatus();
  const audit = await getStore().listAudit(25);
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
      <PageHeader eyebrow="Workspace" title="Settings" description={<>Integrations are configured with environment variables (never in the browser). Copy <code className="font-mono text-xs">.env.example</code> to <code className="font-mono text-xs">.env.local</code>, fill in what you have, and restart.</>} />
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {status.map((s) => (
          <Card key={s.id} className="p-4">
            <div className="flex items-start gap-3">
              {s.ok ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-evergreen" /> : <CircleDashed className="mt-0.5 h-5 w-5 shrink-0 text-faint" />}
              <div className="min-w-0">
                <div className="text-sm font-medium text-ink">{s.label}</div>
                <div className="text-xs text-muted">{s.detail}</div>
                <div className="mt-2 font-mono text-[10px] text-faint">{s.env}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <h2 className="display mt-10 text-2xl">Audit log</h2>
      <Card className="mt-4 divide-y divide-line">
        {audit.length === 0 && <p className="p-4 text-sm text-muted">No events yet.</p>}
        {audit.map((e) => (
          <div key={e.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2.5 text-xs">
            <span className="w-20 shrink-0 text-faint">{timeAgo(e.at)}</span>
            <span className="font-mono text-ink">{e.action}</span>
            <span className="text-muted">{e.actor}</span>
            {e.target && <span className="truncate font-mono text-faint">{e.target}</span>}
          </div>
        ))}
      </Card>
    </main>
  );
}
