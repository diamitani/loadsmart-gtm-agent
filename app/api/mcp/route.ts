import { z } from "zod";
import { runPipeline } from "@/lib/agent/pipeline";
import { search } from "@/lib/agent/knowledge";
import { getStore } from "@/lib/db";
import { ACTIVITY_TYPES } from "@/lib/db/types";
import { summarizeActivities } from "@/lib/connectors/sdr-tools";
import { newId, nowIso } from "@/lib/utils";
import { env } from "@/lib/env";

export const maxDuration = 300;

/**
 * Enably as an MCP server (Streamable HTTP, stateless JSON responses).
 * Lets Claude, Cursor, ChatGPT, n8n's MCP Client Tool, etc. run the GTM
 * Architect and read the Library.
 *
 *   URL:   https://<your-app>/api/mcp
 *   Auth:  Authorization: Bearer <ENABLY_MCP_TOKEN>   (endpoint is off until the token is set)
 */

const PROTOCOL = "2025-06-18";

const TOOLS = {
  run_gtm_pipeline: {
    description: "Run the Enably GTM Architect PAL pipeline on a request. Returns the run status, quality score, artifact list, or a clarification question if the foundation (offer + ICP + deliverable) is incomplete.",
    schema: z.object({
      request: z.string().min(3).describe("What you sell, who buys it, and what you need"),
      questionnaire: z.record(z.string(), z.string()).optional().describe("Optional structured fields, e.g. {offer, icp, competitors}"),
    }),
    run: async ({ request, questionnaire }: { request: string; questionnaire?: Record<string, string> }) => {
      const r = await runPipeline({ messages: [request], questionnaire, source: "api" });
      return { runId: r.run.id, status: r.run.status, clarification: r.clarification, quality: r.run.quality?.score, verdict: r.run.quality?.verdict, nextAction: r.run.nextAction, artifacts: r.artifacts.map((a) => ({ id: a.id, title: a.title, kind: a.kind, group: a.group })) };
    },
  },
  list_runs: {
    description: "List recent GTM runs.",
    schema: z.object({ limit: z.number().int().min(1).max(50).default(10) }),
    run: async ({ limit }: { limit: number }) => (await getStore().listRuns(limit)).map((r) => ({ id: r.id, title: r.title, status: r.status, quality: r.quality?.score, createdAt: r.createdAt })),
  },
  list_artifacts: {
    description: "List GTM Library artifacts, optionally for one run.",
    schema: z.object({ run_id: z.string().optional(), group: z.enum(["asset", "pop"]).optional() }),
    run: async ({ run_id, group }: { run_id?: string; group?: "asset" | "pop" }) => (await getStore().listArtifacts({ runId: run_id, group, limit: 100 })).map((a) => ({ id: a.id, title: a.title, kind: a.kind, status: a.status, version: a.version })),
  },
  get_artifact: {
    description: "Get one artifact's full Markdown.",
    schema: z.object({ id: z.string() }),
    run: async ({ id }: { id: string }) => (await getStore().getArtifact(id)) ?? { error: "not found" },
  },
  search_knowledge: {
    description: "Search the workspace knowledge base.",
    schema: z.object({ query: z.string() }),
    run: async ({ query }: { query: string }) => search(await getStore().listKnowledge(), query, 5),
  },
  add_knowledge: {
    description: "Add a note or document text to the knowledge base.",
    schema: z.object({ name: z.string(), text: z.string().min(1).max(200000) }),
    run: async ({ name, text }: { name: string; text: string }) => {
      const id = newId("kb");
      await getStore().addKnowledge({ id, workspaceId: env().workspaceId, name, kind: "text", text, chars: text.length, createdAt: nowIso() });
      return { id };
    },
  },
  log_activity: {
    description: "Log sales activity (call, email, linkedin, dm, meeting, post, sms, note) against an account.",
    schema: z.object({ type: z.enum(ACTIVITY_TYPES), account: z.string(), count: z.number().int().min(1).default(1), notes: z.string().optional() }),
    run: async (a: { type: (typeof ACTIVITY_TYPES)[number]; account: string; count: number; notes?: string }) => {
      const act = { id: newId("act"), workspaceId: env().workspaceId, ...a, occurredAt: nowIso(), createdAt: nowIso() };
      await getStore().logActivity(act);
      return { logged: true, id: act.id };
    },
  },
  activity_summary: {
    description: "Summarise sales activity over the last N days.",
    schema: z.object({ days: z.number().int().min(1).max(90).default(7) }),
    run: async ({ days }: { days: number }) => summarizeActivities(await getStore().listActivities({ since: new Date(Date.now() - days * 864e5).toISOString(), limit: 5000 }), `${days}d`),
  },
} as const;

type ToolName = keyof typeof TOOLS;

export async function POST(req: Request) {
  const token = process.env.ENABLY_MCP_TOKEN;
  if (!token) return Response.json({ error: "MCP endpoint disabled — set ENABLY_MCP_TOKEN" }, { status: 404 });
  if (req.headers.get("authorization") !== `Bearer ${token}`) return Response.json({ error: "unauthorized" }, { status: 401 });

  const msg = (await req.json().catch(() => null)) as { jsonrpc?: string; id?: string | number; method?: string; params?: Record<string, unknown> } | null;
  if (!msg?.method) return rpcError(null, -32700, "Parse error");
  if (msg.id === undefined) return new Response(null, { status: 202 }); // notification (e.g. notifications/initialized)

  switch (msg.method) {
    case "initialize":
      return rpc(msg.id, {
        protocolVersion: typeof msg.params?.protocolVersion === "string" ? msg.params.protocolVersion : PROTOCOL,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: "enably-gtm-architect", version: "1.0.0" },
        instructions: "Use run_gtm_pipeline to build GTM assets. If it returns a clarification, ask the user and call it again with the answers appended to the request.",
      });
    case "ping":
      return rpc(msg.id, {});
    case "tools/list":
      return rpc(msg.id, {
        tools: Object.entries(TOOLS).map(([name, t]) => ({ name, description: t.description, inputSchema: z.toJSONSchema(t.schema, { io: "input" }) })),
      });
    case "tools/call": {
      const name = String(msg.params?.name ?? "") as ToolName;
      const t = TOOLS[name];
      if (!t) return rpcError(msg.id, -32602, `Unknown tool: ${name}`);
      const parsed = t.schema.safeParse(msg.params?.arguments ?? {});
      if (!parsed.success) return rpc(msg.id, { content: [{ type: "text", text: `Invalid arguments: ${parsed.error.message}` }], isError: true });
      try {
        const out = await (t.run as (a: unknown) => Promise<unknown>)(parsed.data);
        await getStore().audit({ actor: "mcp-client", action: `mcp.${name}` });
        return rpc(msg.id, { content: [{ type: "text", text: JSON.stringify(out, null, 2) }], structuredContent: out && typeof out === "object" && !Array.isArray(out) ? out : { result: out } });
      } catch (err) {
        return rpc(msg.id, { content: [{ type: "text", text: (err as Error).message }], isError: true });
      }
    }
    default:
      return rpcError(msg.id, -32601, `Method not found: ${msg.method}`);
  }
}

export function GET() {
  return new Response("Method Not Allowed — this MCP server is stateless (POST only).", { status: 405, headers: { allow: "POST" } });
}

function rpc(id: string | number, result: unknown) {
  return Response.json({ jsonrpc: "2.0", id, result });
}
function rpcError(id: string | number | null, code: number, message: string) {
  return Response.json({ jsonrpc: "2.0", id, error: { code, message } });
}
