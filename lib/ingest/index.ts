import "server-only";
import os from "node:os";
import path from "node:path";
import { generateText } from "ai";
import { strFromU8, unzipSync } from "fflate";
import { getModel } from "@/lib/agent/models";
import { trace } from "@/lib/observability/langsmith";

/**
 * Universal ingestion — turns documents, images, audio and video into text
 * the Architect can retrieve from. Every route has a FREE default:
 *
 *   PDF (text layer)     → unpdf (pdf.js, serverless build)                  [free, in-process]
 *   DOCX                 → mammoth                                           [free, in-process]
 *   PPTX / XLSX          → fflate unzip + OOXML text runs                    [free, in-process]
 *   Images / screenshots → tesseract.js OCR                                  [free, in-process]
 *                          or the model's vision (if a key is set)           [best quality]
 *   Scanned PDFs         → model vision (if a key is set) or Docling        [free self-hosted]
 *   Audio / video        → any OpenAI-compatible Whisper endpoint:
 *                          self-hosted Speaches / faster-whisper (free) or Groq free tier
 *   Any document         → Docling (DOCLING_URL) when configured — layout, tables, OCR at scale
 *
 * Results are labelled with the method so the user always knows how text was obtained.
 */

export type IngestMethod = "text" | "html" | "pdf-text" | "docx" | "ooxml" | "ocr" | "vision" | "transcript" | "docling";

export interface IngestResult {
  name: string;
  mime: string;
  method: IngestMethod;
  text: string;
  pages?: number;
  warnings: string[];
}

export class IngestError extends Error {}

/** Vercel caps request bodies at ~4.5 MB; media should come in by URL. */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
export const MAX_URL_BYTES = 25 * 1024 * 1024;

const EXT_MIME: Record<string, string> = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  mp3: "audio/mpeg",
  m4a: "audio/mp4",
  wav: "audio/wav",
  ogg: "audio/ogg",
  flac: "audio/flac",
  mp4: "video/mp4",
  mov: "video/quicktime",
  webm: "video/webm",
  mpeg: "video/mpeg",
  md: "text/markdown",
  markdown: "text/markdown",
  txt: "text/plain",
  csv: "text/csv",
  json: "application/json",
  yaml: "text/yaml",
  yml: "text/yaml",
  html: "text/html",
  htm: "text/html",
};

export const ACCEPTED_EXTENSIONS = Object.keys(EXT_MIME).map((e) => `.${e}`).join(",");

export function detectMime(name: string, declared?: string): string {
  const ext = name.toLowerCase().split(".").pop() ?? "";
  if (EXT_MIME[ext]) return EXT_MIME[ext];
  return (declared || "application/octet-stream").split(";")[0].trim().toLowerCase();
}

export type Kind = "text" | "html" | "pdf" | "docx" | "pptx" | "xlsx" | "image" | "media" | "unknown";

export function kindOf(mime: string): Kind {
  if (mime === "text/html") return "html";
  if (mime.startsWith("text/") || mime === "application/json") return "text";
  if (mime === "application/pdf") return "pdf";
  if (mime.includes("wordprocessingml")) return "docx";
  if (mime.includes("presentationml")) return "pptx";
  if (mime.includes("spreadsheetml")) return "xlsx";
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("audio/") || mime.startsWith("video/")) return "media";
  return "unknown";
}

export const ingestFile = trace(
  "enably.ingest.file",
  async (input: { name: string; bytes: Uint8Array; mime?: string }): Promise<IngestResult> => {
    const mime = detectMime(input.name, input.mime);
    const kind = kindOf(mime);
    const base = { name: input.name, mime, warnings: [] as string[] };
    const docling = process.env.DOCLING_URL;

    if (kind === "text") return { ...base, method: "text", text: decode(input.bytes) };
    if (kind === "html") return { ...base, method: "html", text: htmlToText(decode(input.bytes)) };
    if (kind === "media") return { ...base, method: "transcript", text: await transcribe(input.name, input.bytes, mime) };
    if (kind === "unknown") throw new IngestError(`${input.name}: unsupported file type (${mime}). Supported: PDF, Word, PowerPoint, Excel, images, audio/video, text, HTML.`);

    // Docling first when configured — best layout/table/OCR fidelity for office docs and PDFs.
    if (docling && kind !== "image") {
      try {
        return { ...base, method: "docling", text: await doclingConvert(input.name, input.bytes, mime) };
      } catch (err) {
        base.warnings.push(`Docling failed (${(err as Error).message}); used the built-in parser.`);
      }
    }

    if (kind === "docx") {
      const mammoth = await import("mammoth");
      const { value } = await mammoth.extractRawText({ buffer: Buffer.from(input.bytes) });
      return { ...base, method: "docx", text: value };
    }
    if (kind === "pptx" || kind === "xlsx") return { ...base, method: "ooxml", text: ooxmlText(input.bytes, kind) };

    if (kind === "pdf") {
      const { extractText, getDocumentProxy } = await import("unpdf");
      const pdf = await getDocumentProxy(new Uint8Array(input.bytes));
      const { totalPages, text } = await extractText(pdf, { mergePages: false });
      const joined = text.map((t, i) => `--- page ${i + 1} ---\n${t.trim()}`).join("\n\n");
      const avgChars = text.reduce((s, t) => s + t.trim().length, 0) / Math.max(totalPages, 1);
      if (avgChars >= 40) return { ...base, method: "pdf-text", text: joined, pages: totalPages };
      // Scanned PDF — no usable text layer.
      const vision = await visionExtract(input.bytes, mime, input.name);
      if (vision) return { ...base, method: "vision", text: vision, pages: totalPages };
      throw new IngestError(
        `${input.name} looks like a scanned PDF (no text layer). Add a model key (vision) or point DOCLING_URL at a free self-hosted Docling server to OCR it — or upload the pages as images.`,
      );
    }

    // image
    if (process.env.ENABLY_VISION !== "off") {
      const vision = await visionExtract(input.bytes, mime, input.name);
      if (vision) return { ...base, method: "vision", text: vision };
    }
    return { ...base, method: "ocr", text: await ocr(input.bytes) };
  },
  { tags: ["ingest"] },
);

/* ------------------------------------------------------------- helpers */

function decode(bytes: Uint8Array) {
  return new TextDecoder("utf-8").decode(bytes);
}

export function htmlToText(html: string): string {
  return html
    .replace(/<(script|style|noscript|svg|nav|footer)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<\/(p|div|h[1-6]|li|tr|section|article|br)>/gi, "\n\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n\s*(\n\s*)+/g, "\n\n")
    .trim();
}

/** Text runs from PowerPoint slides (<a:t>) or Excel shared strings (<t>), in order. */
export function ooxmlText(bytes: Uint8Array, kind: "pptx" | "xlsx"): string {
  const files = unzipSync(bytes);
  const xmlText = (xml: string, tag: string) =>
    [...xml.matchAll(new RegExp(`<${tag}(?:\\s[^>]*)?>([^<]*)</${tag}>`, "g"))].map((m) => unescapeXml(m[1])).filter((t) => t.trim());

  if (kind === "pptx") {
    const slides = Object.keys(files)
      .filter((f) => /^ppt\/slides\/slide\d+\.xml$/.test(f))
      .sort((a, b) => Number(a.match(/\d+/)![0]) - Number(b.match(/\d+/)![0]));
    const notes = (n: string) => files[`ppt/notesSlides/notesSlide${n}.xml`];
    return slides
      .map((f) => {
        const n = f.match(/\d+/)![0];
        const body = xmlText(strFromU8(files[f]), "a:t").join(" ");
        const note = notes(n) ? xmlText(strFromU8(notes(n)), "a:t").join(" ") : "";
        return `--- slide ${n} ---\n${body}${note ? `\n[notes] ${note}` : ""}`;
      })
      .join("\n\n");
  }
  // Excel: shared strings (Excel), inline strings (Google Sheets / openpyxl exports) and numbers.
  const shared = files["xl/sharedStrings.xml"]
    ? [...strFromU8(files["xl/sharedStrings.xml"]).matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) => xmlText(m[1], "t").join(""))
    : [];
  const sheets = Object.keys(files)
    .filter((f) => /^xl\/worksheets\/sheet\d+\.xml$/.test(f))
    .sort((a, b) => Number(a.match(/\d+/)![0]) - Number(b.match(/\d+/)![0]));
  return sheets
    .map((f) => {
      const rows = [...strFromU8(files[f]).matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g)].map((row) =>
        [...row[1].matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)]
          .map(([, attrs, inner = ""]) => {
            const type = attrs.match(/\bt="(\w+)"/)?.[1];
            if (type === "inlineStr") return xmlText(inner, "t").join("");
            const v = inner.match(/<v>([^<]*)<\/v>/)?.[1] ?? "";
            return type === "s" ? (shared[Number(v)] ?? "") : unescapeXml(v);
          })
          .join("\t"),
      );
      return `--- sheet ${f.match(/\d+/)![0]} ---\n${rows.filter((r) => r.trim()).join("\n")}`;
    })
    .join("\n\n");
}

function unescapeXml(s: string) {
  return s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
}

/** Free OCR with tesseract.js (WASM). Language data is cached in the OS temp dir. */
async function ocr(bytes: Uint8Array): Promise<string> {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker(process.env.ENABLY_OCR_LANGS || "eng", 1, { cachePath: path.join(os.tmpdir(), "enably-tesseract") });
  try {
    const { data } = await worker.recognize(Buffer.from(bytes));
    return data.text.trim();
  } finally {
    await worker.terminate();
  }
}

/** Vision extraction with the configured model (Claude reads images and PDFs natively). Returns null when no model. */
async function visionExtract(bytes: Uint8Array, mime: string, name: string): Promise<string | null> {
  const model = getModel("fast");
  if (!model) return null;
  try {
    const { text } = await generateText({
      model,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract ALL text from this file verbatim, preserving headings, lists and tables as Markdown. Then add a section '## What this shows' with a short description of any charts, screenshots, logos or visuals relevant to sales and go-to-market. Do not invent anything that is not visible.",
            },
            mime.startsWith("image/") ? { type: "image", image: bytes, mediaType: mime } : { type: "file", data: bytes, mediaType: mime, filename: name },
          ],
        },
      ],
      maxRetries: 1,
      telemetry: { functionId: "enably.ingest.vision" },
    });
    return text.trim() || null;
  } catch (err) {
    console.warn("[enably] vision extraction failed, falling back:", (err as Error).message);
    return null;
  }
}

/** Docling (docling-serve) — open-source document converter you can self-host for free. */
async function doclingConvert(name: string, bytes: Uint8Array, mime: string): Promise<string> {
  const form = new FormData();
  form.append("files", new Blob([Buffer.from(bytes)], { type: mime }), name);
  form.append("to_formats", "md");
  form.append("do_ocr", "true");
  form.append("image_export_mode", "placeholder");
  const headers: Record<string, string> = { accept: "application/json" };
  if (process.env.DOCLING_API_KEY) headers["x-api-key"] = process.env.DOCLING_API_KEY;
  const res = await fetch(`${process.env.DOCLING_URL!.replace(/\/$/, "")}/v1/convert/file`, { method: "POST", body: form, headers, signal: AbortSignal.timeout(120000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = (await res.json()) as { status?: string; document?: { md_content?: string; text_content?: string }; errors?: unknown[] };
  const text = json.document?.md_content || json.document?.text_content || "";
  if (!text.trim()) throw new Error(`empty result (${json.status ?? "unknown status"})`);
  return text;
}

/**
 * Speech-to-text through any OpenAI-compatible /v1/audio/transcriptions endpoint:
 *   free self-hosted: Speaches / faster-whisper-server (TRANSCRIBE_BASE_URL=http://your-host:8000/v1)
 *   free tier:        Groq (TRANSCRIBE_BASE_URL=https://api.groq.com/openai/v1, model whisper-large-v3-turbo)
 */
async function transcribe(name: string, bytes: Uint8Array, mime: string): Promise<string> {
  const base = process.env.TRANSCRIBE_BASE_URL;
  if (!base) {
    throw new IngestError(
      `${name}: audio/video needs a transcription endpoint. Set TRANSCRIBE_BASE_URL to a free self-hosted Whisper server (Speaches / faster-whisper) or Groq's free tier — see docs/MULTIMODAL.md.`,
    );
  }
  if (bytes.byteLength > MAX_URL_BYTES) throw new IngestError(`${name} is larger than 25 MB — export the audio track first (e.g. ffmpeg -i in.mp4 -vn -ac 1 -b:a 32k out.mp3).`);
  const form = new FormData();
  form.append("file", new Blob([Buffer.from(bytes)], { type: mime }), name);
  form.append("model", process.env.TRANSCRIBE_MODEL || "whisper-large-v3-turbo");
  form.append("response_format", "verbose_json");
  const headers: Record<string, string> = {};
  if (process.env.TRANSCRIBE_API_KEY) headers.authorization = `Bearer ${process.env.TRANSCRIBE_API_KEY}`;
  const res = await fetch(`${base.replace(/\/$/, "")}/audio/transcriptions`, { method: "POST", body: form, headers, signal: AbortSignal.timeout(280000) });
  if (!res.ok) throw new IngestError(`Transcription failed: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
  const json = (await res.json()) as { text?: string; segments?: { start: number; text: string }[] };
  if (json.segments?.length) {
    return json.segments.map((s) => `[${fmtTime(s.start)}] ${s.text.trim()}`).join("\n");
  }
  return (json.text ?? "").trim();
}

function fmtTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
