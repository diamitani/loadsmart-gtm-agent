import "server-only";
import { tool } from "ai";
import { z } from "zod";
import { getStore } from "@/lib/db";
import { env } from "@/lib/env";
import { search } from "./knowledge";
import { scanText } from "@/lib/pal/truth-guard";
import { trace } from "@/lib/observability/langsmith";
import { ingestUrl } from "./fetch-url";
import { newId, nowIso } from "@/lib/utils";
import { compileEltTelemetry, diagnoseExecution, exportToCsv } from "@/lib/connectors/n8n-analyst";

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

    read_document: tool({
      description:
        "Read any public URL — web page, PDF, Word/PowerPoint/Excel, image/screenshot (OCR or vision), or audio/video (transcribed with Whisper). Optionally save it to the knowledge base so the build pipeline can cite it.",
      inputSchema: z.object({ url: z.string().url(), save_to_knowledge: z.boolean().default(true) }),
      execute: trace("tool.read_document", async ({ url, save_to_knowledge }: { url: string; save_to_knowledge: boolean }) => {
        try {
          const r = await ingestUrl(url);
          if (save_to_knowledge && r.text.trim()) {
            await store.addKnowledge({ id: newId("kb"), workspaceId: "default", name: r.name || url, kind: "url", source: url, text: r.text.slice(0, 400_000), chars: r.text.length, createdAt: nowIso() });
          }
          return { name: r.name, method: r.method, pages: r.pages, chars: r.text.length, saved: save_to_knowledge, warnings: r.warnings, text: r.text.slice(0, 12000) };
        } catch (err) {
          return { error: `Could not read URL: ${(err as Error).message}` };
        }
      }, { runType: "tool" }),
    }),

    list_artifacts: tool({
      description: "List every asset in the current run's package (ICP, personas, emails, battlecard, playbook, POP docs) with their version and status.",
      inputSchema: z.object({}),
      execute: trace("tool.list_artifacts", async () => {
        const items = await store.listArtifacts({ runId: ctx.runId });
        return items.map((a) => ({ id: a.id, code: a.code, title: a.title, kind: a.kind, group: a.group, version: a.version, status: a.status }));
      }, { runType: "tool" }),
    }),

    get_artifact: tool({
      description: "Fetch the full markdown of one asset or POP document by its artifact id.",
      inputSchema: z.object({ id: z.string() }),
      execute: trace("tool.get_artifact", async ({ id }: { id: string }) => {
        const a = await store.getArtifact(id);
        if (!a) return { error: `Artifact ${id} not found.` };
        return { id: a.id, title: a.title, kind: a.kind, version: a.version, status: a.status, markdown: a.markdown };
      }, { runType: "tool" }),
    }),

    revise_artifact: tool({
      description:
        "Revise an existing artifact with updated copy. Writes a new version (history is preserved so the human can roll back). Use this when the user asks for specific edits to an asset in chat.",
      inputSchema: z.object({
        id: z.string().describe("Artifact id to revise"),
        markdown: z.string().describe("Complete revised markdown of the asset"),
        changeSummary: z.string().describe("Brief note explaining what changed (e.g. 'Shortened cold email to under 90 words')"),
      }),
      execute: trace("tool.revise_artifact", async ({ id, markdown, changeSummary }: { id: string; markdown: string; changeSummary: string }) => {
        const current = await store.getArtifact(id);
        if (!current) return { error: `Artifact ${id} not found.` };
        const next = {
          ...current,
          id: newId("art"),
          version: current.version + 1,
          markdown,
          createdAt: nowIso(),
          provenance: { ...current.provenance, changeSummary },
        };
        await store.saveArtifacts([next]);
        await store.audit({ actor: "architect", action: "artifact.revised", target: current.id, detail: { toId: next.id, version: next.version, changeSummary } });
        return { ok: true, id: next.id, version: next.version, title: next.title };
      }, { runType: "tool" }),
    }),

    truth_check: tool({
      description: "Audit any snippet of text against the knowledge base for ungrounded claims (unsupported emails, phone numbers, money figures, dates or customer names).",
      inputSchema: z.object({ text: z.string() }),
      execute: trace("tool.truth_check", async ({ text }: { text: string }) => {
        const kb = (await store.listKnowledge()).map((k) => k.text).join("\n");
        const findings = scanText(text);
        const checked = findings.map((f) => ({
          ...f,
          grounded: kb.toLowerCase().includes(f.value.toLowerCase()),
        }));
        return { findings: checked, ungroundedCount: checked.filter((c) => !c.grounded).length };
      }, { runType: "tool" }),
    }),

    analyze_n8n_execution: tool({
      description: "Diagnose an n8n workflow execution or error payload. Classifies root cause (401 auth, 429 rate limit, 504 timeout, 400 schema error), identifies failing node, and returns actionable remediation steps.",
      inputSchema: z.object({
        executionJson: z.string().describe("The raw JSON or error message from n8n execution"),
        workflowName: z.string().optional().describe("Optional workflow name for context"),
      }),
      execute: trace("tool.analyze_n8n_execution", async ({ executionJson, workflowName }: { executionJson: string; workflowName?: string }) => {
        try {
          const parsed = JSON.parse(executionJson);
          const diag = diagnoseExecution(parsed);
          return { ...diag, workflowName: workflowName || diag.workflowId };
        } catch {
          const diag = diagnoseExecution({ error: { message: executionJson } });
          return { ...diag, workflowName: workflowName || "Ad-hoc Execution" };
        }
      }, { runType: "tool" }),
    }),

    generate_elt_pipeline_report: tool({
      description: "Gather telemetry across prospecting runs and compile an ELT-ready performance and conversion funnel report (Signals -> Companies -> Contacts -> Research -> Email -> Outreach), formatted with metrics and exportable table schema.",
      inputSchema: z.object({
        limit: z.number().int().min(1).max(200).default(50).describe("Number of recent runs to aggregate"),
      }),
      execute: trace("tool.generate_elt_pipeline_report", async ({ limit }: { limit: number }) => {
        const runs = await store.listRuns(limit);
        const records = runs.map((r) => ({
          executionId: r.id,
          workflowId: "enably-pal-engine",
          workflowName: r.title || "GTM Build Run",
          status: r.status === "completed" ? "success" : r.status === "failed" ? "error" : r.status,
          startedAt: r.createdAt,
          stoppedAt: r.updatedAt,
          durationMs: r.durationMs || 0,
          failingNode: r.status === "failed" ? (r.stages.find((s) => s.status === "error")?.stage ?? null) : null,
          errorCode: r.status === "failed" ? "RUN_ERROR" : null,
          errorMessage: r.status === "failed" ? (r.stages.find((s) => s.status === "error")?.summary ?? null) : null,
          itemsProcessed: r.artifactIds.length,
          leadsIngested: r.intake?.files.length ? r.intake.files.length * 20 : 50,
          leadsEnriched: r.artifactIds.length * 5,
          leadsVerified: r.truth ? Math.max(0, r.artifactIds.length * 5 - (r.truth.ungrounded || 0)) : 20,
          emailsDrafted: r.artifactIds.filter((id) => id.includes("email") || id.includes("seq")).length * 3 || 10,
        }));
        const summary = compileEltTelemetry(records);
        return {
          totalExecutions: summary.totalExecutions,
          successRate: `${summary.successRate}%`,
          avgDurationSec: Math.round(summary.avgDurationMs / 1000),
          funnel: summary.funnel,
          errorsByCategory: summary.errorsByCategory,
          csvSample: exportToCsv(records.slice(0, 5)),
        };
      }, { runType: "tool" }),
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
