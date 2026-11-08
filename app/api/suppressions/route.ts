import { z } from "zod";
import { getStore } from "@/lib/db";
import { nowIso } from "@/lib/utils";

export async function GET() {
  return Response.json(await getStore().listSuppressions());
}

const Body = z.object({ value: z.string().min(3).max(320), reason: z.string().max(200).default("opt-out") });

/** Add an email or domain to the do-not-contact list. Every send checks this first. */
export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  const store = getStore();
  await store.addSuppression({ ...parsed.data, createdAt: nowIso() });
  await store.audit({ actor: "user", action: "suppression.added", target: parsed.data.value.toLowerCase() });
  return Response.json({ ok: true });
}
