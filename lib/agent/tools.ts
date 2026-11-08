import "server-only";
import { tool } from "ai";
import { z } from "zod";
import { getStore } from "@/lib/db";
import { env } from "@/lib/env";
import { search } from "./knowledge";
import { scanText } from "@/lib/pal/truth-guard";
import { trace } from "@/lib/observability/langsmith";

/**
 * Tools the Architect can call in conversation (after a package exists).
 * Read tools run freely. `send_to_workflow` leaves the platform, so it is
 * approval-gated: the UI shows Approve / Deny before anything is sent.
 */
export function architectTools(ctx: { runId?: string }) {
  const store = getStore();
  return {
    search_knowledge: tool({
      description: "Search the workspace knowledge base (uploaded docs, notes, URLs). Use before stating any company-specific fact.",
      inputSchema: z.object({ query: z.string().describe("What to look for") }),
      execute: trace("tool.search_knowledge", async ({ query }: { query: string }) => {
        const hits = search(await store.listKnowledge(), query, 5);
        return hits.length ? hits : { note: "No matching knowledge. Ask the user or use a {{variable}}." };
      }, { runType: "retriever" }),
    }),

    list_artifacts: tool({
      description: "List assets in the GTM Library for the current run (or all runs).",
      inputSchema: z.object({ scope: z.enum(["current_run", "all"]).default("current_run") }),
      execute: async ({ scope }) => {
        const list = await store.listArtifacts({ runId: scope === "current_run" ? ctx.runId : undefined, limit: 60 });
        return list.map((a) => ({ id: a.id, title: a.title, kind: a.kind, group: a.group, version: a.version, status: a.status }));
      },
    }),

    get_artifact: tool({
      description: "Read the full Markdown of one artifact by id.",
      inputSchema: z.object({ id: z.string() }),
      execute: async ({ id }) => {
        const a = await store.getArtifact(id);
        return a ? { id: a.id, title: a.title, version: a.version, markdown: a.markdown } : { error: "not found" };
      },
    }),

    revise_artifact: tool({
      description: "Save an improved version of an artifact (e.g. shorter emails, new tone). Creates a new version in the Library; the previous text stays in the run history.",
      inputSchema: z.object({ id: z.string(), markdown: z.string().min(50), changeNote: z.string() }),
      execute: trace("tool.revise_artifact", async ({ id, markdown, changeNote }: { id: string; markdown: string; changeNote: string }) => {
        const updated = await store.updateArtifact(id, { markdown });
        if (!updated) return { error: "not found" };
        await store.audit({ actor: "gtm-architect", action: "artifact.revised", target: id, detail: { changeNote, version: updated.version } });
        const flags = scanText(markdown);
        return { id, version: updated.version, saved: true, operationalDataToVerify: flags.map((f) => `${f.type}: ${f.value}`) };
      }, { runType: "tool" }),
    }),

    truth_check: tool({
      description: "Scan text for operational data (emails, phones, addresses, dates, stats, money, customer names) that must be verified before use.",
      inputSchema: z.object({ text: z.string() }),
      execute: async ({ text }) => ({ findings: scanText(text) }),
    }),

    send_to_workflow: tool({
      description:
        "Send the current run's approved package to the user's automation workflow (n8n / Make / Zapier webhook) for delivery, CRM import, or sequencing. Requires explicit human approval.",
      inputSchema: z.object({
        purpose: z.string().describe("What the workflow should do with the package, e.g. 'create Asana tasks' or 'load sequence into sequencer'"),
        artifactIds: z.array(z.string()).optional().describe("Specific artifacts; defaults to every asset in the run"),
      }),
      needsApproval: true,
      execute: trace("tool.send_to_workflow", async ({ purpose, artifactIds }: { purpose: string; artifactIds?: string[] }) => {
        const e = env();
        if (!e.workflowWebhookUrl) return { sent: false, reason: "No WORKFLOW_WEBHOOK_URL configured — add it in your environment to enable delivery." };
        const all = await store.listArtifacts({ runId: ctx.runId });
        const items = artifactIds?.length ? all.filter((a) => artifactIds.includes(a.id)) : all.filter((a) => a.group === "asset");
        const run = ctx.runId ? await store.getRun(ctx.runId) : null;
        const res = await fetch(e.workflowWebhookUrl, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            ...(e.workflowWebhookSecret ? { "x-enably-signature": e.workflowWebhookSecret } : {}),
            "idempotency-key": `${ctx.runId ?? "adhoc"}:${purpose}`.slice(0, 120),
          },
          body: JSON.stringify({
            event: "enably.package.approved",
            purpose,
            run: run ? { id: run.id, title: run.title, quality: run.quality?.score, nextAction: run.nextAction } : null,
            artifacts: items.map((a) => ({ id: a.id, title: a.title, kind: a.kind, markdown: a.markdown })),
          }),
        });
        await store.audit({ actor: "human-approved", action: "workflow.sent", target: ctx.runId, detail: { purpose, status: res.status, count: items.length } });
        return { sent: res.ok, status: res.status, count: items.length };
      }, { runType: "tool" }),
    }),
  };
}
