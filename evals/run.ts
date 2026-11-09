/**
 * Enably GTM Architect — evaluation suite.
 *
 *   npm run eval
 *
 * Runs every case in evals/dataset.json through the REAL pipeline and scores it
 * with deterministic evaluators. Results are saved to the app's store (see the
 * Evals page). If LANGSMITH_API_KEY is set, the same run is also uploaded to
 * LangSmith as an experiment on the dataset "enablygtm-golden".
 */
import fs from "node:fs";
import path from "node:path";
import { runPipeline } from "@/lib/agent/pipeline";
import { getStore } from "@/lib/db";
import { modelLabel } from "@/lib/agent/models";
import { newId, nowIso } from "@/lib/utils";
import type { EvalCaseResult } from "@/lib/db/types";

interface Case {
  id: string;
  input: string;
  expect: { ready: boolean; assets?: string[] };
}

const cases: Case[] = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, "dataset.json"), "utf8"));

async function target(input: string) {
  const { run, artifacts } = await runPipeline({ messages: [input], source: "api" });
  return {
    ready: !!run.foundation?.ready,
    W: run.foundation?.W ?? 0,
    assets: artifacts.filter((a) => a.group === "asset").map((a) => a.kind),
    pop: artifacts.filter((a) => a.group === "pop").length,
    quality: run.quality?.score ?? 0,
    structure: run.quality?.checks.find((c) => c.id === "structure")?.pass ?? false,
    ungrounded: run.truth?.ungrounded ?? 0,
  };
}
type Out = Awaited<ReturnType<typeof target>>;

/** Deterministic evaluators — each returns a 0..1 score. */
function score(c: Case, o: Out): Record<string, number> {
  const s: Record<string, number> = { foundation_gate: o.ready === c.expect.ready ? 1 : 0 };
  if (c.expect.ready) {
    const want = c.expect.assets ?? [];
    s.asset_recall = want.length ? want.filter((a) => o.assets.includes(a)).length / want.length : 1;
    s.structure = o.structure ? 1 : 0;
    s.pop_complete = o.pop === 11 ? 1 : 0;
    s.truth_clean = o.ungrounded === 0 ? 1 : 0;
    s.quality = o.quality / 100;
  }
  return s;
}

async function main() {
  console.log(`\nEnably evals · ${cases.length} cases · model: ${modelLabel()}\n`);
  const results: EvalCaseResult[] = [];
  for (const c of cases) {
    const out = await target(c.input);
    const scores = score(c, out);
    const pass = Object.entries(scores).every(([k, v]) => (k === "quality" ? v >= 0.75 : v === 1));
    results.push({ caseId: c.id, input: c.input, scores, pass });
    console.log(`${pass ? "PASS" : "FAIL"}  ${c.id.padEnd(26)} ${Object.entries(scores).map(([k, v]) => `${k}=${v.toFixed(2)}`).join("  ")}`);
  }

  const mean = (k: string) => {
    const vals = results.map((r) => r.scores[k]).filter((v) => v !== undefined);
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  };
  const summary = {
    cases: results.length,
    pass_rate: results.filter((r) => r.pass).length / results.length,
    foundation_gate: mean("foundation_gate"),
    asset_recall: mean("asset_recall"),
    truth_clean: mean("truth_clean"),
    avg_quality: Math.round(mean("quality") * 100),
  };

  let langsmithUrl: string | undefined;
  if (process.env.LANGSMITH_API_KEY) langsmithUrl = await uploadToLangSmith();

  await getStore().saveEval({ id: newId("eval"), workspaceId: "default", name: `Golden set · ${cases.length} cases`, model: modelLabel(), createdAt: nowIso(), summary, results, langsmithUrl });
  await new Promise((r) => setTimeout(r, 300)); // let the local store flush
  console.log(`\nSummary: ${JSON.stringify(summary)}\n${langsmithUrl ? `LangSmith: ${langsmithUrl}\n` : ""}`);
  process.exit(summary.pass_rate === 1 ? 0 : 1);
}

/** Mirror the suite into LangSmith: create/reuse the dataset, then run `evaluate()` as an experiment. */
async function uploadToLangSmith(): Promise<string | undefined> {
  const { Client } = await import("langsmith");
  const { evaluate } = await import("langsmith/evaluation");
  const client = new Client();
  const name = "enablygtm-golden";
  let dataset;
  try {
    dataset = await client.readDataset({ datasetName: name });
  } catch {
    dataset = await client.createDataset(name, { description: "Enably GTM Architect golden requests" });
    await client.createExamples({
      inputs: cases.map((c) => ({ input: c.input })),
      outputs: cases.map((c) => ({ expect: c.expect })),
      metadata: cases.map((c) => ({ caseId: c.id })),
      datasetId: dataset.id,
    });
  }
  const byInput = new Map(cases.map((c) => [c.input, c]));
  const evaluators = ["foundation_gate", "asset_recall", "structure", "pop_complete", "truth_clean", "quality"].map(
    (key) =>
      ({ inputs, outputs }: { inputs: Record<string, unknown>; outputs: Record<string, unknown> }) => {
        const c = byInput.get(String(inputs.input));
        const s = c ? score(c, outputs as Out) : {};
        return { key, score: s[key] ?? null };
      },
  );
  const res = await evaluate((inputs: Record<string, unknown>) => target(String(inputs.input)), {
    data: name,
    evaluators,
    experimentPrefix: "enably-pal",
    metadata: { model: modelLabel() },
    maxConcurrency: 2,
  });
  return (res as unknown as { experimentManager?: { _experiment?: { url?: string } } }).experimentManager?._experiment?.url ?? `https://smith.langchain.com/datasets?search=${name}`;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
