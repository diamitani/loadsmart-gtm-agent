import { getStore } from "@/lib/db";
import { newId, nowIso } from "@/lib/utils";
import { fetchReadable } from "@/lib/agent/fetch-url";

const MAX_CHARS = 200_000;
const TEXT_TYPES = /\.(md|markdown|txt|csv|json|html?|ya?ml)$/i;

export async function GET() {
  const docs = await getStore().listKnowledge();
  return Response.json(docs.map(({ text, ...d }) => ({ ...d, preview: text.slice(0, 240) })));
}

/** Add knowledge: multipart file upload, pasted text, or a public URL. */
export async function POST(req: Request) {
  const store = getStore();
  const ct = req.headers.get("content-type") ?? "";
  const docs: { name: string; kind: "file" | "text" | "url"; source?: string; text: string }[] = [];

  if (ct.includes("multipart/form-data")) {
    const form = await req.formData();
    for (const f of form.getAll("files")) {
      if (!(f instanceof File)) continue;
      if (!TEXT_TYPES.test(f.name)) return Response.json({ error: `${f.name}: upload text files (.md, .txt, .csv, .json, .html). For PDFs/Docs, paste the text.` }, { status: 415 });
      docs.push({ name: f.name, kind: "file", text: (await f.text()).slice(0, MAX_CHARS) });
    }
  } else {
    const body = (await req.json().catch(() => ({}))) as { name?: string; text?: string; url?: string };
    if (body.url) {
      const page = await fetchReadable(body.url);
      if ("error" in page) return Response.json({ error: page.error }, { status: 400 });
      docs.push({ name: page.title || body.url, kind: "url", source: body.url, text: page.text.slice(0, MAX_CHARS) });
    } else if (body.text?.trim()) {
      docs.push({ name: body.name?.trim() || "Pasted note", kind: "text", text: body.text.slice(0, MAX_CHARS) });
    }
  }
  if (!docs.length) return Response.json({ error: "Nothing to add" }, { status: 400 });

  const created = [];
  for (const d of docs) {
    const doc = { id: newId("kb"), workspaceId: "default", createdAt: nowIso(), chars: d.text.length, ...d };
    await store.addKnowledge(doc);
    created.push({ id: doc.id, name: doc.name, chars: doc.chars });
  }
  await store.audit({ actor: "user", action: "knowledge.added", detail: { count: created.length } });
  return Response.json({ created });
}

export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  await getStore().deleteKnowledge(id);
  return Response.json({ ok: true });
}
