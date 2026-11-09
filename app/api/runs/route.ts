import { z } from "zod";
import { runPipeline } from "@/lib/agent/pipeline";
import { getStore } from "@/lib/db";

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
  const result = await runPipeline({ messages: message ? [message] : [], questionnaire, links, files, source });
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
