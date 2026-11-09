import { CheckCircle2, CircleDashed } from "lucide-react";
import { integrationStatus } from "@/lib/env";
import { getStore } from "@/lib/db";
import { Card, PageHeader } from "@/components/ui";
import { timeAgo } from "@/lib/utils";
import { connectorStatus, mcpServerNames } from "@/lib/connectors/registry";
import { Badge } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const status = integrationStatus();
  const audit = await getStore().listAudit(25);
  const connectors = connectorStatus();
  const mcpServers = mcpServerNames();
  const mcpOn = !!process.env.ENABLY_MCP_TOKEN;
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
      <h2 className="display mt-10 text-2xl">Connectors</h2>
      <p className="mt-1 text-sm text-muted">Native connectors use an API key in your environment. MCP connectors are reached through servers listed in <code className="font-mono text-xs">ENABLY_MCP_SERVERS</code>. Sends, CRM writes, paid enrichment and email verification always ask for approval in chat.</p>
      <Card className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b hairline text-left text-xs text-muted">
              <th className="px-4 py-3 font-medium">Connector</th>
              <th className="px-4 py-3 font-medium">How</th>
              <th className="px-4 py-3 font-medium">Powers</th>
              <th className="px-4 py-3 font-medium">Enable with</th>
            </tr>
          </thead>
          <tbody>
            {connectors.map((c) => (
              <tr key={c.id} className="border-b hairline align-top last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 font-medium text-ink">
                    {c.configured ? <CheckCircle2 className="h-4 w-4 text-evergreen" /> : <CircleDashed className="h-4 w-4 text-faint" />} {c.name}
                  </div>
                  <div className="mt-0.5 text-[11px] capitalize text-faint">{c.category}</div>
                </td>
                <td className="px-4 py-3"><Badge tone={c.mode === "native" ? "clay" : c.mode === "mcp" ? "sky" : "neutral"}>{c.mode}</Badge></td>
                <td className="px-4 py-3 text-xs text-muted">{c.ops.join(", ")}{c.notes && <span className="mt-1 block text-[11px] text-faint">{c.notes}</span>}</td>
                <td className="px-4 py-3 font-mono text-[10px] text-faint">{c.mode === "mcp" ? "ENABLY_MCP_SERVERS" : c.env.join(" + ") || c.optionalEnv?.join(", ") || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Card className="p-4">
          <div className="text-sm font-medium text-ink">MCP servers connected to the Architect</div>
          <div className="mt-1 text-xs text-muted">{mcpServers.length ? mcpServers.join(", ") : "None — add Clay, HubSpot, Zoho, Attio or your n8n MCP server to ENABLY_MCP_SERVERS."}</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-ink">{mcpOn ? <CheckCircle2 className="h-4 w-4 text-evergreen" /> : <CircleDashed className="h-4 w-4 text-faint" />} Enably as an MCP server</div>
          <div className="mt-1 text-xs text-muted">{mcpOn ? <>Endpoint <code className="font-mono">/api/mcp</code> is live for Claude, Cursor and n8n (Bearer token).</> : <>Set <code className="font-mono">ENABLY_MCP_TOKEN</code> to let Claude, Cursor or n8n run the Architect via <code className="font-mono">/api/mcp</code>.</>}</div>
        </Card>
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
