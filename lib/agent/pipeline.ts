import "server-only";
import type { Artifact, AssetKind, IntakeInput, RunRecord, StageEvent, StageId } from "@/lib/pal/types";
import { compileIntake } from "@/lib/pal/intake";
import { extractIntent, mergeIntent, ASSET_TITLES } from "@/lib/pal/intent";
import { checkFoundation, clarificationMessage } from "@/lib/pal/foundation";
import { compressPlan, executeWaves } from "@/lib/pal/compressor";
import { truthCheck } from "@/lib/pal/truth-guard";
import { qualityGate } from "@/lib/pal/quality-gate";
import { buildPopDocs, nextActionFor } from "@/lib/pal/pop";
import { getStore } from "@/lib/db";
import { env } from "@/lib/env";
import { newId, nowIso } from "@/lib/utils";
import { trace, langsmithProjectUrl } from "@/lib/observability/langsmith";
import { refineIntent } from "./refine-intent";
import { compileInstructions } from "./instruct";
import { buildAsset, PROMPT_VERSION } from "./build-asset";
import { modelLabel } from "./models";
import { dispatchToDurable } from "@/lib/durable/client";

export interface PipelineHooks {
  onStage?: (e: StageEvent) => void;
  onArtifact?: (a: Artifact) => void;
  onRun?: (r: RunRecord) => void;
}

export interface PipelineResult {
  run: RunRecord;
  artifacts: Artifact[];
  /** Present when W < 1.00 — the one focused message to send back. */
  clarification?: string;
}

/**
 * The PAL pipeline. Deterministic stages run first and gate the expensive
 * ones: no model tokens are spent on a build until W = 1.00.
 */
export const runPipeline = trace(
  "enably.pal.run",
  async (input: IntakeInput, opts: { conversationId?: string; hooks?: PipelineHooks; runId?: string } = {}): Promise<PipelineResult> => {
    const store = getStore();
    const hooks = opts.hooks ?? {};
    const t0 = Date.now();
    const run: RunRecord = {
      id: opts.runId ?? newId("run"),
      conversationId: opts.conversationId,
      workspaceId: env().workspaceId,
      status: "running",
      title: "New GTM request",
      source: input.source ?? "chat",
      createdAt: nowIso(),
      updatedAt: nowIso(),
      stages: [],
      artifactIds: [],
      model: modelLabel(),
      traceUrl: langsmithProjectUrl(),
    };

    const stage = async <T>(id: StageId, fn: () => Promise<T> | T, summarize: (r: T) => { summary: string; data?: Record<string, unknown>; status?: StageEvent["status"] }) => {
      const started = Date.now();
      hooks.onStage?.({ stage: id, status: "running", summary: "" });
      const result = await trace(`enably.stage.${id}`, async () => fn())();
      const s = summarize(result);
      const ev: StageEvent = { stage: id, status: s.status ?? "done", summary: s.summary, ms: Date.now() - started, data: s.data };
      run.stages = [...run.stages.filter((x) => x.stage !== id), ev];
      hooks.onStage?.(ev);
      return result;
    };

    // 1 — Intake → MASTER.md
    const intake = await stage("intake", () => compileIntake(input), (r) => ({
      summary: `${r.wordCount} words · ${r.links.length} links · ${r.files.length} files compiled into MASTER.md`,
      data: { words: r.wordCount, links: r.links.length, files: r.files.length },
    }));
    run.intake = intake;

    // 2 — Extract intent (deterministic floor + LLM refinement)
    const intent = await stage(
      "intent",
      async () => mergeIntent(extractIntent(intake), await refineIntent(intake)),
      (r) => ({
        summary: `${r.requestedAssets.length} deliverables · confidence ${Math.round(r.confidence * 100)}%`,
        data: { offer: r.offer, icp: r.icp, company: r.company, stage: r.stage, motion: r.motion, assets: r.requestedAssets.map((a) => ASSET_TITLES[a]), domain: r.domain },
      }),
    );
    run.intent = intent;
    run.title = intent.company ? `${intent.company} — ${intent.offer ?? "GTM"}` : intent.offer ? `GTM for ${intent.offer}` : "GTM request";

    // 3 — Foundation (One Must Act): halt before any spend if W < 1.00
    const foundation = await stage("foundation", () => checkFoundation(intent), (r) => ({
      summary: r.ready ? `W = 1.00 — foundation complete${r.assumptions.length ? `, ${r.assumptions.length} labelled assumptions` : ""}` : `W = ${r.W.toFixed(2)} — need ${r.missing.map((m) => m.label).join(", ")}`,
      status: r.ready ? "done" : "blocked",
      data: { W: r.W, coverage: r.coverage, missing: r.missing.map((m) => m.label), assumptions: r.assumptions },
    }));
    run.foundation = foundation;

    if (!foundation.ready) {
      run.status = "needs_input";
      run.updatedAt = nowIso();
      run.durationMs = Date.now() - t0;
      await store.saveRun(run);
      hooks.onRun?.(run);
      return { run, artifacts: [], clarification: clarificationMessage(foundation) };
    }

    // 4 — Enhance instructions (skills + knowledge + brief)
    const knowledge = await store.listKnowledge();
    const pack = await stage("instruct", () => compileInstructions(intake, intent, foundation, knowledge), (r) => ({
      summary: `${r.skills.length} skills · ${r.knowledgeSnippets.length} knowledge snippets · ${r.guardrails.length} guardrails`,
      data: { skills: r.skills, knowledge: r.knowledgeSnippets.map((k) => k.source) },
    }));

    // 5 — Plan: middle-out DAG compression
    const plan = await stage(
      "plan",
      () => compressPlan(intent.requestedAssets, { preconditions: { research: () => knowledge.length > 0 || intake.files.length > 0 } }),
      (r) => ({
        summary: `${r.nodes.length} nodes → ${r.waves.length} waves · est. ${r.compression}× vs sequential`,
        data: { waves: r.waves, compression: r.compression, pruned: r.pruned },
      }),
    );
    run.plan = plan;
    run.nextAction = nextActionFor(intent, foundation);
    await store.saveRun(run);
    hooks.onRun?.(run);

    // 6 — Build: waves in parallel, watchdog hands off to the durable agent if configured
    const artifacts: Artifact[] = [];
    const built = new Map<string, Artifact>();
    const e = env();
    const buildStarted = Date.now();
    hooks.onStage?.({ stage: "build", status: "running", summary: "" });
    const { remaining } = await executeWaves(
      plan,
      async (node) => {
        if (node.id === "research") return null;
        const upstream = node.deps.map((d) => built.get(d)).filter((a): a is Artifact => !!a);
        const art = await trace(`enably.build.${node.id}`, () => buildAsset(node.id as AssetKind, { intent, foundation, runId: run.id, pack, upstream }), { runType: "llm" })();
        built.set(node.id, art);
        artifacts.push(art);
        await store.saveArtifacts([art]);
        hooks.onArtifact?.(art);
        return art;
      },
      {
        budgetMs: e.durableUrl ? e.watchdogMs : undefined,
        onWave: (wave, i) => hooks.onStage?.({ stage: "build", status: "running", summary: `Wave ${i + 1}/${plan.waves.length}: ${wave.join(" ‖ ")}` }),
      },
    );

    if (remaining.length) {
      run.status = "handed_off";
      run.artifactIds = artifacts.map((a) => a.id);
      run.updatedAt = nowIso();
      await store.saveRun(run);
      const handoff = await dispatchToDurable(run.id, remaining);
      const ev: StageEvent = { stage: "build", status: "running", summary: `Watchdog: ${remaining.length} wave(s) handed to the durable agent (${handoff.ok ? "accepted" : handoff.error})`, ms: Date.now() - buildStarted };
      run.stages.push(ev);
      hooks.onStage?.(ev);
      await store.saveRun(run);
      return { run, artifacts };
    }

    return finishRun(run, artifacts, Date.now() - buildStarted, hooks, t0);
  },
  { tags: ["pipeline"] },
);

/** Build POP docs, run the truth guard + quality gate, and present. Shared by inline runs and durable continuations. */
export async function finishRun(run: RunRecord, assets: Artifact[], buildMs: number, hooks: PipelineHooks = {}, t0 = Date.now()): Promise<PipelineResult> {
  const store = getStore();
  const { intake, intent, foundation, plan, nextAction } = run;
  if (!intake || !intent || !foundation || !plan || !nextAction) throw new Error("Run is missing PAL state");

  const pop: Artifact[] = buildPopDocs({ runId: run.id, intake, intent, foundation, plan, nextAction }).map((d) => ({
    id: newId("art"),
    runId: run.id,
    kind: d.kind,
    group: "pop",
    code: d.code,
    title: d.title,
    markdown: d.markdown,
    status: "draft",
    version: 1,
    createdAt: nowIso(),
    provenance: { agentId: "pop", model: "deterministic", promptVersion: PROMPT_VERSION, inputRefs: [`run:${run.id}`] },
  }));
  await store.saveArtifacts(pop);
  const all = [...assets, ...pop];
  const buildEv: StageEvent = { stage: "build", status: "done", summary: `${assets.length} assets + ${pop.length} POP documents`, ms: buildMs, data: { assets: assets.map((a) => a.title) } };
  run.stages = [...run.stages.filter((s) => s.stage !== "build"), buildEv];
  hooks.onStage?.(buildEv);

  // 7 — Test
  const testStart = Date.now();
  hooks.onStage?.({ stage: "test", status: "running", summary: "" });
  const knowledgeText = (await store.listKnowledge()).map((k) => k.text).join("\n");
  const { truth, quality } = await trace("enably.stage.test", async () => {
    const truth = truthCheck(assets, `${intake.masterMd}\n${knowledgeText}`, intent.domain);
    const quality = qualityGate({ intent, foundation, plan, artifacts: all, truth });
    return { truth, quality };
  })();
  run.truth = truth;
  run.quality = quality;
  const testEv: StageEvent = {
    stage: "test",
    status: "done",
    summary: `Quality ${quality.score}/100 · ${quality.verdict}${truth.ungrounded ? ` · ${truth.ungrounded} item(s) to verify` : " · all data grounded"}`,
    ms: Date.now() - testStart,
    data: { score: quality.score, verdict: quality.verdict, ungrounded: truth.ungrounded },
  };
  run.stages.push(testEv);
  hooks.onStage?.(testEv);

  // 8 — Present
  const presentEv: StageEvent = { stage: "present", status: "done", summary: `Next action: ${nextAction.action}`, ms: 0 };
  run.stages.push(presentEv);
  hooks.onStage?.(presentEv);

  run.status = "completed";
  run.artifactIds = all.map((a) => a.id);
  run.updatedAt = nowIso();
  run.durationMs = Date.now() - t0;
  await store.saveRun(run);
  await store.audit({ actor: "gtm-architect", action: "run.completed", target: run.id, detail: { score: quality.score, assets: assets.length } });
  hooks.onRun?.(run);
  return { run, artifacts: all };
}

/** Continue a handed-off run (called by the Cloudflare durable agent). Idempotent: skips nodes already built. */
export async function continueRun(runId: string): Promise<PipelineResult | null> {
  const store = getStore();
  const run = await store.getRun(runId);
  if (!run || run.status === "completed") return run ? { run, artifacts: await store.listArtifacts({ runId }) } : null;
  const { intake, intent, foundation, plan } = run;
  if (!intake || !intent || !foundation || !plan) return null;
  const existing = (await store.listArtifacts({ runId, group: "asset" }));
  const built = new Map(existing.map((a) => [a.kind, a]));
  const pack = compileInstructions(intake, intent, foundation, await store.listKnowledge());
  const started = Date.now();
  const todo = { ...plan, waves: plan.waves.map((w) => w.filter((id) => id !== "research" && !built.has(id))).filter((w) => w.length) };
  await executeWaves(todo, async (node) => {
    const upstream = node.deps.map((d) => built.get(d)).filter((a): a is Artifact => !!a);
    const art = await buildAsset(node.id as AssetKind, { intent, foundation, runId, pack, upstream });
    built.set(node.id, art);
    await store.saveArtifacts([art]);
    return art;
  });
  return finishRun(run, [...built.values()], Date.now() - started);
}
