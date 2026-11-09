import type { Artifact, RunRecord } from "@/lib/pal/types";
import { fmtMs } from "@/lib/utils";

/** Deterministic presentation of a run (used in demo mode and as the fact sheet for the LLM presenter). */
export function presentationMarkdown(run: RunRecord, artifacts: Artifact[]): string {
  if (run.status === "handed_off") {
    return `**Your package is still building.** It's larger than one request can safely run, so the durable agent took over the remaining waves — nothing is lost. Watch it finish in **Runs → ${run.title}**.`;
  }
  const assets = artifacts.filter((a) => a.group === "asset");
  const pop = artifacts.filter((a) => a.group === "pop");
  const q = run.quality;
  const lines = [
    `### ${run.title} — package ready`,
    `Built **${assets.length} GTM assets** and the **${pop.length}-document POP package** in ${fmtMs(run.durationMs)} across ${run.plan?.waves.length ?? 0} parallel waves.${q ? ` Quality gate: **${q.score}/100 · ${q.verdict}**.` : ""}`,
    "",
    "**Assets**",
    ...assets.map((a) => `- ${a.title}`),
  ];
  if (run.foundation?.assumptions.length) {
    lines.push("", "**Labelled assumptions** — confirm or correct these and I'll rebuild:", ...run.foundation.assumptions.map((a) => `- ${a}`));
  }
  if (run.truth?.notice) lines.push("", run.truth.notice);
  if (run.nextAction) {
    lines.push(
      "",
      "**One must act — next action**",
      `- **Do:** ${run.nextAction.action}`,
      `- **Owner:** ${run.nextAction.owner} · **When:** ${run.nextAction.due}`,
      `- **Proof:** ${run.nextAction.proof}`,
    );
  }
  return lines.join("\n");
}
