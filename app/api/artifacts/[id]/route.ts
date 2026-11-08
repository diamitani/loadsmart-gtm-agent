import { z } from "zod";
import { getStore } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const a = await getStore().getArtifact((await params).id);
  return a ? Response.json(a) : Response.json({ error: "not found" }, { status: 404 });
}

const Patch = z.object({ markdown: z.string().min(1).optional(), status: z.enum(["draft", "approved", "rejected", "archived"]).optional(), title: z.string().optional() });

/** Human edits and approvals from the Library. Approving is the human gate before delivery. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const parsed = Patch.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  const { id } = await params;
  const store = getStore();
  const updated = await store.updateArtifact(id, parsed.data);
  if (!updated) return Response.json({ error: "not found" }, { status: 404 });
  await store.audit({ actor: "user", action: parsed.data.status ? `artifact.${parsed.data.status}` : "artifact.edited", target: id });
  return Response.json(updated);
}
