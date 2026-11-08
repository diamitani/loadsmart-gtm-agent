import "server-only";

/**
 * Fetch a public web page and reduce it to readable text for the knowledge base.
 * Blocks non-http(s) schemes and private/loopback hosts (basic SSRF protection).
 */
export async function fetchReadable(raw: string): Promise<{ title: string; text: string } | { error: string }> {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return { error: "Invalid URL" };
  }
  if (!/^https?:$/.test(url.protocol)) return { error: "Only http(s) URLs are allowed" };
  if (/^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|0\.|\[?::1\]?$|.*\.internal$|.*\.local$)/i.test(url.hostname)) {
    return { error: "Private or local addresses are not allowed" };
  }
  try {
    const res = await fetch(url, { headers: { "user-agent": "EnablyGTM-Knowledge/1.0" }, signal: AbortSignal.timeout(12000), redirect: "follow" });
    if (!res.ok) return { error: `Fetch failed: HTTP ${res.status}` };
    const html = (await res.text()).slice(0, 2_000_000);
    const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ?? "";
    const text = html
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
    return { title, text };
  } catch (err) {
    return { error: `Fetch failed: ${(err as Error).message}` };
  }
}
