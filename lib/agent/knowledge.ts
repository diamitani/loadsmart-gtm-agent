import type { KnowledgeDoc } from "@/lib/db/types";

/**
 * RAG-DAL retrieval (lightweight). BM25 over paragraph chunks of the
 * workspace knowledge base — no embedding service required. Swap for
 * pgvector / Pinecone later behind the same function signature.
 */

export interface Hit {
  source: string;
  text: string;
  score: number;
}

const STOP = new Set(
  "a an the and or but if of to in on for with at by from as is are was were be been it this that these those we our you your i my they their them he she his her not no do does did can will would should could have has had about into over under than then so such very just also more most other some any each".split(" "),
);

export function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP.has(t));
}

export function chunk(doc: Pick<KnowledgeDoc, "name" | "text">, size = 700): { source: string; text: string }[] {
  const paras = doc.text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const out: { source: string; text: string }[] = [];
  let buf = "";
  for (const p of paras) {
    if ((buf + "\n\n" + p).length > size && buf) {
      out.push({ source: doc.name, text: buf });
      buf = p;
    } else buf = buf ? `${buf}\n\n${p}` : p;
  }
  if (buf) out.push({ source: doc.name, text: buf });
  return out;
}

export function search(docs: Pick<KnowledgeDoc, "name" | "text">[], query: string, k = 5): Hit[] {
  const chunks = docs.flatMap((d) => chunk(d));
  if (!chunks.length) return [];
  const q = [...new Set(tokenize(query))];
  if (!q.length) return [];
  const tokenized = chunks.map((c) => tokenize(c.text));
  const avgLen = tokenized.reduce((s, t) => s + t.length, 0) / tokenized.length || 1;
  const df = new Map<string, number>();
  for (const toks of tokenized) for (const t of new Set(toks)) df.set(t, (df.get(t) ?? 0) + 1);
  const N = chunks.length;
  const k1 = 1.4;
  const b = 0.75;
  const scored = chunks.map((c, i) => {
    const toks = tokenized[i];
    const tf = new Map<string, number>();
    for (const t of toks) tf.set(t, (tf.get(t) ?? 0) + 1);
    let score = 0;
    for (const term of q) {
      const f = tf.get(term) ?? 0;
      if (!f) continue;
      const idf = Math.log(1 + (N - (df.get(term) ?? 0) + 0.5) / ((df.get(term) ?? 0) + 0.5));
      score += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * toks.length) / avgLen)));
    }
    return { ...c, score: Math.round(score * 100) / 100 };
  });
  return scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score).slice(0, k);
}
