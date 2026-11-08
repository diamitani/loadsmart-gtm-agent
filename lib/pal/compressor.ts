import type { AssetKind, Plan, PlanNode } from "./types";
import { ASSET_TITLES } from "./intent";

/**
 * Stage 5 — "Middle-out" action compressor.
 *
 * 1. Build the dependency DAG for the requested assets (+ their prerequisites).
 * 2. Short-circuit: prune nodes whose boolean precondition is false.
 * 3. Topologically group the remaining nodes into waves; every node in wave k
 *    only depends on nodes in waves < k, so a wave runs with Promise.all().
 *
 * Compression is reported from estimates *and* from measured wall-clock time
 * in the runner — we never claim a speed-up we did not measure.
 */

/** Dependency graph between GTM assets (edges point from prerequisite → dependent). */
export const ASSET_DEPS: Record<AssetKind, (AssetKind | "research")[]> = {
  icp: ["research"],
  personas: ["icp"],
  positioning: ["icp"],
  email_sequence: ["personas", "positioning"],
  linkedin_dm: ["personas", "positioning"],
  call_script: ["personas", "positioning"],
  battlecard: ["positioning"],
  objection_handling: ["personas"],
  kpi_scorecard: ["icp"],
  gtm_playbook: ["icp", "personas", "kpi_scorecard"],
  launch_plan: ["positioning", "kpi_scorecard"],
  prospecting_plan: ["icp"],
  automation_blueprint: ["icp"],
};

const EST_MS: Partial<Record<AssetKind | "research", number>> = {
  research: 1500,
  icp: 6000,
  personas: 7000,
  positioning: 6000,
  gtm_playbook: 9000,
};

export interface CompressOptions {
  /** Preconditions evaluated before scheduling; returning false prunes the node. */
  preconditions?: Partial<Record<string, () => boolean>>;
}

export function compressPlan(requested: AssetKind[], opts: CompressOptions = {}): Plan {
  // 1. Close over prerequisites so the DAG is complete.
  const needed = new Set<AssetKind | "research">();
  const visit = (k: AssetKind | "research") => {
    if (needed.has(k)) return;
    needed.add(k);
    if (k !== "research") ASSET_DEPS[k].forEach(visit);
  };
  requested.forEach(visit);

  // 2. Boolean precondition short-circuiting.
  const pruned: Plan["pruned"] = [];
  for (const id of [...needed]) {
    const pre = opts.preconditions?.[id];
    if (pre && !pre()) {
      needed.delete(id);
      pruned.push({ id, reason: "precondition false — skipped" });
    }
  }

  const nodes: PlanNode[] = [...needed].map((id) => ({
    id,
    kind: id,
    title: id === "research" ? "Knowledge retrieval (RAG-DAL)" : ASSET_TITLES[id],
    deps: id === "research" ? [] : ASSET_DEPS[id].filter((d) => needed.has(d)),
    estMs: EST_MS[id] ?? 5000,
  }));

  const waves = topoWaves(nodes);
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const sequentialEstMs = nodes.reduce((s, n) => s + n.estMs, 0);
  const waveEstMs = waves.reduce((s, w) => s + Math.max(...w.map((id) => byId.get(id)!.estMs)), 0);

  return {
    nodes,
    pruned,
    waves,
    sequentialEstMs,
    waveEstMs,
    compression: waveEstMs ? Math.round((sequentialEstMs / waveEstMs) * 100) / 100 : 1,
  };
}

/** Kahn's algorithm grouped by depth — O(|V| + |E|). Throws on cycles. */
export function topoWaves(nodes: Pick<PlanNode, "id" | "deps">[]): string[][] {
  const indeg = new Map<string, number>();
  const children = new Map<string, string[]>();
  for (const n of nodes) {
    indeg.set(n.id, n.deps.length);
    for (const d of n.deps) children.set(d, [...(children.get(d) ?? []), n.id]);
  }
  const waves: string[][] = [];
  let frontier = nodes.filter((n) => n.deps.length === 0).map((n) => n.id);
  let seen = 0;
  while (frontier.length) {
    waves.push([...frontier].sort());
    seen += frontier.length;
    const next: string[] = [];
    for (const id of frontier) {
      for (const c of children.get(id) ?? []) {
        const v = (indeg.get(c) ?? 0) - 1;
        indeg.set(c, v);
        if (v === 0) next.push(c);
      }
    }
    frontier = next;
  }
  if (seen !== nodes.length) throw new Error("Plan contains a dependency cycle");
  return waves;
}

/**
 * Execute a plan wave-by-wave. Each wave runs concurrently. A latency watchdog
 * stops scheduling new waves once `budgetMs` is exceeded and returns the
 * remaining waves so the caller can hand them to the durable runtime
 * (Cloudflare Agent) instead of tripping a serverless timeout.
 */
export async function executeWaves<T>(
  plan: Plan,
  run: (node: PlanNode) => Promise<T>,
  opts: { budgetMs?: number; onWave?: (wave: string[], index: number) => void } = {},
): Promise<{ results: Map<string, T>; remaining: string[][]; elapsedMs: number }> {
  const started = Date.now();
  const byId = new Map(plan.nodes.map((n) => [n.id, n]));
  const results = new Map<string, T>();
  for (let i = 0; i < plan.waves.length; i++) {
    if (opts.budgetMs && Date.now() - started >= opts.budgetMs) {
      return { results, remaining: plan.waves.slice(i), elapsedMs: Date.now() - started };
    }
    const wave = plan.waves[i];
    opts.onWave?.(wave, i);
    const out = await Promise.all(wave.map((id) => run(byId.get(id)!)));
    wave.forEach((id, j) => results.set(id, out[j]));
  }
  return { results, remaining: [], elapsedMs: Date.now() - started };
}
