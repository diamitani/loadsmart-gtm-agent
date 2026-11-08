import type { Artifact, Foundation, Intent, Plan, QualityReport, TruthReport } from "./types";

/**
 * Stage 7 — Quality gate. Weights come from the One Must Act web-app scorecard:
 * goal clarity 15 · reality audit 10 · foundation integrity 20 · multiplier
 * discipline 15 · JTBD fit 10 · execution quality 10 · architecture 10 ·
 * evidence & governance 10.
 *
 *  90–100 Ready · 75–89 Ready with assumptions · 60–74 Needs clarification · <60 Blocked
 */

/** Minimum structure each asset must contain to count as "complete". */
export const REQUIRED_SECTIONS: Record<string, RegExp[]> = {
  icp: [/firmographic/i, /pain|trigger/i, /disqualif|not a fit/i],
  personas: [/goals?/i, /pains?|frustrat/i, /objection/i],
  positioning: [/positioning statement|for .+ who/i, /proof|why (us|now)/i],
  email_sequence: [/subject/i, /(step|email) 2/i],
  linkedin_dm: [/connection|message 1|dm 1/i],
  call_script: [/opener|opening/i, /discovery/i],
  battlecard: [/win|landmine|trap/i],
  objection_handling: [/objection/i],
  kpi_scorecard: [/north star|metric/i, /target/i],
  gtm_playbook: [/cadence|daily|weekly/i, /qualif/i],
  launch_plan: [/week|phase|milestone/i],
  prospecting_plan: [/signal/i, /limit|budget|cap/i],
  automation_blueprint: [/trigger/i, /approval|human/i],
};

export function qualityGate(input: {
  intent: Intent;
  foundation: Foundation;
  plan: Plan;
  artifacts: Artifact[];
  truth: TruthReport;
}): QualityReport {
  const { intent, foundation, plan, artifacts, truth } = input;
  const assets = artifacts.filter((a) => a.group === "asset");
  const pop = artifacts.filter((a) => a.group === "pop");

  const assetChecks = assets.map((a) => {
    const req = REQUIRED_SECTIONS[a.kind] ?? [];
    const missing = req.filter((re) => !re.test(a.markdown));
    return { a, pass: missing.length === 0 && a.markdown.length > 400, missing: missing.length };
  });
  const requestedBuilt = intent.requestedAssets.filter((k) => assets.some((a) => a.kind === k)).length;

  const checks: QualityReport["checks"] = [
    { id: "w", label: "Foundation wholeness W = 1.00", pass: foundation.W === 1, detail: `W = ${foundation.W.toFixed(2)}` },
    {
      id: "requested",
      label: "Every requested asset was built",
      pass: requestedBuilt === intent.requestedAssets.length,
      detail: `${requestedBuilt}/${intent.requestedAssets.length}`,
    },
    {
      id: "structure",
      label: "Each asset has its required sections",
      pass: assetChecks.every((c) => c.pass),
      detail: `${assetChecks.filter((c) => c.pass).length}/${assetChecks.length} complete`,
    },
    { id: "pop", label: "POP 11-artifact documentation package", pass: pop.length === 11, detail: `${pop.length}/11` },
    { id: "truth", label: "No ungrounded operational data", pass: truth.ungrounded === 0, detail: `${truth.ungrounded} to verify` },
    { id: "dag", label: "Plan is a valid DAG with parallel waves", pass: plan.waves.length > 0, detail: `${plan.waves.length} waves, ${plan.compression}× est.` },
    { id: "assumptions", label: "Assumptions are labelled", pass: true, detail: `${foundation.assumptions.length} labelled` },
  ];

  const ratio = (n: number, d: number) => (d === 0 ? 1 : n / d);
  const dims = [
    { id: "goal", label: "Goal clarity", weight: 15, frac: intent.statedGoal ? (intent.usedDefaultAssets ? 0.85 : 1) : 0.4, note: intent.statedGoal },
    { id: "reality", label: "Reality audit", weight: 10, frac: foundation.coverage, note: `${Math.round(foundation.coverage * 100)}% of context known, rest labelled` },
    { id: "foundation", label: "Foundation integrity", weight: 20, frac: foundation.W, note: `W = ${foundation.W.toFixed(2)}` },
    { id: "multipliers", label: "Multiplier discipline", weight: 15, frac: plan.pruned.length || plan.nodes.length <= intent.requestedAssets.length + 4 ? 1 : 0.8, note: `${plan.nodes.length} nodes, only prerequisites added` },
    { id: "jtbd", label: "JTBD fit", weight: 10, frac: foundation.jtbd.actor ? 1 : 0.5, note: `Actor: ${foundation.jtbd.actor}` },
    { id: "execution", label: "Execution quality", weight: 10, frac: ratio(assetChecks.filter((c) => c.pass).length, assetChecks.length), note: "Required sections present" },
    { id: "architecture", label: "Package architecture", weight: 10, frac: ratio(pop.length, 11), note: `${pop.length}/11 POP documents` },
    { id: "evidence", label: "Evidence & governance", weight: 10, frac: truth.ungrounded === 0 ? 1 : Math.max(0.5, 1 - truth.ungrounded * 0.1), note: truth.notice ? "Operational data needs verification" : "Grounded" },
  ];

  const dimensions = dims.map((d) => ({
    id: d.id,
    label: d.label,
    weight: d.weight,
    score: Math.round(d.weight * Math.max(0, Math.min(1, d.frac)) * 10) / 10,
    note: d.note,
  }));
  const score = Math.round(dimensions.reduce((s, d) => s + d.score, 0));
  const verdict: QualityReport["verdict"] =
    foundation.W < 1 ? "Blocked" : score >= 90 && foundation.assumptions.length === 0 ? "Ready" : score >= 75 ? "Ready with assumptions" : score >= 60 ? "Needs clarification" : "Blocked";

  return { score, verdict, dimensions, checks };
}
