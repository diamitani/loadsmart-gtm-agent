import { z } from "zod";
import { getStore } from "@/lib/db";
import { ACTIVITY_TYPES } from "@/lib/db/types";
import { env } from "@/lib/env";
import { newId, nowIso } from "@/lib/utils";

export async function GET(req: Request) {
  const days = Number(new URL(req.url).searchParams.get("days") ?? 30);
  const since = new Date(Date.now() - Math.min(Math.max(days, 1), 365) * 864e5).toISOString();
  return Response.json(await getStore().listActivities({ since, limit: 1000 }));
}

const Body = z.object({
  type: z.enum(ACTIVITY_TYPES),
  account: z.string().min(1).max(200),
  contact: z.string().max(200).optional(),
  count: z.number().int().min(1).max(500).default(1),
  stage: z.enum(["cold", "follow_up", "closing", "other"]).optional(),
  notes: z.string().max(4000).optional(),
  occurredAt: z.string().optional(),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  const a = { id: newId("act"), workspaceId: env().workspaceId, ...parsed.data, occurredAt: parsed.data.occurredAt ?? nowIso(), createdAt: nowIso() };
  await getStore().logActivity(a);
  return Response.json(a);
}
