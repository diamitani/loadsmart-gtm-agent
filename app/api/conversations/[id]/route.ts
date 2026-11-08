import { getStore } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const c = await getStore().getConversation((await params).id);
  return c ? Response.json(c) : Response.json({ error: "not found" }, { status: 404 });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await getStore().deleteConversation((await params).id);
  return Response.json({ ok: true });
}
