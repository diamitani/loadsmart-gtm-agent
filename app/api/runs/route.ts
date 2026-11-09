import { z } from "zod";
import { runPipeline } from "@/lib/agent/pipeline";
import { getStore } from "@/lib/db";
import { requestAiContext, withAiContext } from "@/lib/agent/ai-context";
import { withSystemScope } from "@/lib/auth/scope";

export const maxDuration = 300;

const Body = z.object({
  message: z.string().default(""),
  questionnaire: z.record(z.string(), z.string()).optional(),
  links: z.array(z.string().url()).optional(),
  files: z.array(z.object({ name: z.string(), text: z.string() })).optional(),
  source: z.enum(["form", "webhook", "api"]).default("api"),
});

/**
 * Start a PAL run without the chat UI — used by the intake questionnaire and
 * by inbound webhooks from n8n / Make / Zapier ("Send to Workflow" in the diagram).
 */
export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  const { message, questionnaire, links, files, source } = parsed.data;
  if (!message.trim() && !Object.keys(questionnaire ?? {}).length) return Response.json({ error: "Provide a message or questionnaire" }, { status: 400 });
  // Runs started over HTTP spend the caller's own key or credits (same rules as chat).
  // Server-to-server automations that send `Authorization: Bearer $ENABLY_MCP_TOKEN` use the house key unmetered.
  const token = process.env.ENABLY_MCP_TOKEN;
  const operator = !!token && req.headers.get("authorization") === `Bearer ${token}`;
  const ai = operator ? null : await requestAiContext();
  const run = () => runPipeline({ messages: message ? [message] : [], questionnaire, links, files, source });
  // Operator runs are workspace-level (system scope); everyone else's run is saved to the signed-in user.
  const result = operator ? await withSystemScope(run) : ai ? await withAiContext(ai, run) : await run();
  return Response.json({
    runId: result.run.id,
    status: result.run.status,
    clarification: result.clarification,
    quality: result.run.quality,
    artifacts: result.artifacts.map((a) => ({ id: a.id, title: a.title, kind: a.kind, group: a.group })),
  });
}

export async function GET() {
  const runs = await getStore().listRuns(100);
  return Response.json(runs.map((r) => ({ id: r.id, title: r.title, status: r.status, createdAt: r.createdAt, W: r.foundation?.W, quality: r.quality?.score })));
}
