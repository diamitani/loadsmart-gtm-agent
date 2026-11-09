import { getStore } from "@/lib/db";
import { env } from "@/lib/env";
import { newId, nowIso } from "@/lib/utils";
import { ingestUrl } from "@/lib/agent/fetch-url";
import { requestAiContext, withAiContext } from "@/lib/agent/ai-context";
import { ingestFile, IngestError, MAX_UPLOAD_BYTES, type IngestResult } from "@/lib/ingest";

export const maxDuration = 300;

const MAX_CHARS = 400_000;

export async function GET() {
  const docs = await getStore().listKnowledge();
  return Response.json(docs.map(({ text, ...d }) => ({ ...d, preview: text.slice(0, 240) })));
}

const LABEL: Record<IngestResult["method"], string> = {
  text: "text",
  html: "web page",
  "pdf-text": "PDF text",
  docx: "Word",
  ooxml: "Office XML",
  ocr: "OCR (tesseract.js)",
  vision: "vision model",
  transcript: "Whisper transcript",
  docling: "Docling",
};

/**
 * Add knowledge from: file uploads (PDF, Word, PowerPoint, Excel, images, audio/video, text),
 * pasted text, or any public URL (web page, PDF, image, audio, video — up to 25 MB).
 */
export async function POST(req: Request) {
  // Vision extraction uses the caller's own key or credits.
  const ai = await requestAiContext();
  return withAiContext(ai, () => addKnowledge(req));
}

async function addKnowledge(req: Request) {
  const store = getStore();
  const ct = req.headers.get("content-type") ?? "";
  const results: { name: string; kind: "file" | "text" | "url"; source?: string; r: IngestResult }[] = [];
  const errors: string[] = [];

  try {
    if (ct.includes("multipart/form-data")) {
      const form = await req.formData();
      for (const f of form.getAll("files")) {
        if (!(f instanceof File)) continue;
        if (f.size > MAX_UPLOAD_BYTES) {
          errors.push(`${f.name}: ${(f.size / 1048576).toFixed(1)} MB is over the 4 MB upload limit — share it as a link instead (up to 25 MB).`);
          continue;
        }
        try {
          results.push({ name: f.name, kind: "file", r: await ingestFile({ name: f.name, bytes: new Uint8Array(await f.arrayBuffer()), mime: f.type }) });
        } catch (err) {
          errors.push(err instanceof IngestError ? err.message : `${f.name}: ${(err as Error).message}`);
        }
      }
    } else {
      const body = (await req.json().catch(() => ({}))) as { name?: string; text?: string; url?: string };
      if (body.url) {
        const r = await ingestUrl(body.url);
        results.push({ name: r.name || body.url, kind: "url", source: body.url, r });
      } else if (body.text?.trim()) {
        results.push({ name: body.name?.trim() || "Pasted note", kind: "text", r: { name: "note", mime: "text/plain", method: "text", text: body.text, warnings: [] } });
      }
    }
  } catch (err) {
    errors.push(err instanceof IngestError ? err.message : (err as Error).message);
  }

  const created = [];
  for (const { name, kind, source, r } of results) {
    const text = r.text.trim();
    if (!text) {
      errors.push(`${name}: no readable text found.`);
      continue;
    }
    const header = r.method === "text" ? "" : `[Extracted via ${LABEL[r.method]}${r.pages ? ` · ${r.pages} pages` : ""}]\n\n`;
    const doc = { id: newId("kb"), workspaceId: env().workspaceId, name, kind, source, text: (header + text).slice(0, MAX_CHARS), chars: text.length, createdAt: nowIso() };
    await store.addKnowledge(doc);
    created.push({ id: doc.id, name, chars: doc.chars, method: r.method, warnings: r.warnings });
  }
  if (created.length) await store.audit({ actor: "user", action: "knowledge.added", detail: { count: created.length, methods: created.map((c) => c.method) } });
  if (!created.length) return Response.json({ error: errors.join(" ") || "Nothing to add" }, { status: errors.length ? 422 : 400 });
  return Response.json({ created, errors });
}

export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  await getStore().deleteKnowledge(id);
  return Response.json({ ok: true });
}
