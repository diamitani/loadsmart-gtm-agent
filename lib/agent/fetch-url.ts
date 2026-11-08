import "server-only";
import { htmlToText, ingestFile, IngestError, MAX_URL_BYTES, type IngestResult } from "@/lib/ingest";

/** Basic SSRF protection: http(s) only, no private / loopback / link-local / internal hosts. */
export function checkPublicUrl(raw: string): URL | { error: string } {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return { error: "Invalid URL" };
  }
  if (!/^https?:$/.test(url.protocol)) return { error: "Only http(s) URLs are allowed" };
  if (/^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|0\.|\[?::1\]?$|\[?f[cd][0-9a-f]{2}:|.*\.internal$|.*\.local$)/i.test(url.hostname)) {
    return { error: "Private or local addresses are not allowed" };
  }
  return url;
}

/** Fetch a public web page and reduce it to readable text for the knowledge base. */
export async function fetchReadable(raw: string): Promise<{ title: string; text: string } | { error: string }> {
  const url = checkPublicUrl(raw);
  if ("error" in url) return url;
  try {
    const res = await fetch(url, { headers: { "user-agent": "EnablyGTM-Knowledge/1.0" }, signal: AbortSignal.timeout(12000), redirect: "follow" });
    if (!res.ok) return { error: `Fetch failed: HTTP ${res.status}` };
    const html = (await res.text()).slice(0, 2_000_000);
    const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ?? "";
    return { title, text: htmlToText(html) };
  } catch (err) {
    return { error: `Fetch failed: ${(err as Error).message}` };
  }
}

/**
 * Ingest anything at a public URL: web pages, PDFs, Office files, images, audio, video.
 * Size-capped streaming download (25 MB) so big media never hits the 4.5 MB upload limit.
 */
export async function ingestUrl(raw: string): Promise<IngestResult> {
  const url = checkPublicUrl(raw);
  if ("error" in url) throw new IngestError(url.error);
  const res = await fetch(url, { headers: { "user-agent": "EnablyGTM-Knowledge/1.0" }, signal: AbortSignal.timeout(60000), redirect: "follow" });
  if (!res.ok || !res.body) throw new IngestError(`Fetch failed: HTTP ${res.status}`);
  const declared = (res.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  const len = Number(res.headers.get("content-length") ?? 0);
  if (len > MAX_URL_BYTES) throw new IngestError(`File is ${(len / 1048576).toFixed(1)} MB — the limit is 25 MB. For long videos, share an audio-only export.`);

  const chunks: Uint8Array[] = [];
  let total = 0;
  const reader = res.body.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_URL_BYTES) {
      await reader.cancel();
      throw new IngestError("File is larger than 25 MB.");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) {
    bytes.set(c, off);
    off += c.byteLength;
  }

  const fileName = decodeURIComponent(url.pathname.split("/").pop() || url.hostname);
  if (declared === "text/html" || (!declared && /\.html?$/i.test(fileName))) {
    const html = new TextDecoder().decode(bytes);
    const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() || url.hostname;
    return { name: title, mime: "text/html", method: "html", text: htmlToText(html), warnings: [] };
  }
  return ingestFile({ name: fileName, bytes, mime: declared || undefined });
}
