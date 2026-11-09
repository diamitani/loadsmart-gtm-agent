import type { Foundation, Intake, Intent, NextAction, Plan } from "./types";
import { ASSET_TITLES } from "./intent";

/**
 * POP — Project Output Planner. Deterministically emits the 11-artifact
 * documentation package for every completed run (no model cost, 100%
 * structural consistency). Assets carry the creative work; POP documents
 * carry the contract, plan and handoff.
 */

export const POP_ARTIFACTS = [
  { code: "A", file: "01_INTENT_BRIEF.md", title: "Intent Brief" },
  { code: "B", file: "02_JTBD.md", title: "Jobs To Be Done" },
  { code: "C", file: "03_KPI_TRACKING.md", title: "KPI Tracking" },
  { code: "D", file: "04_ARCHITECTURE.md", title: "Architecture" },
  { code: "E", file: "05_PROJECT_MASTER_DOC.md", title: "Project Master Doc" },
  { code: "F", file: "06_BUILD_GUIDE.md", title: "Build Guide" },
  { code: "G", file: "07_EXECUTION_HANDOFF.md", title: "Execution Handoff" },
  { code: "H", file: "08_PRD.md", title: "PRD" },
  { code: "I", file: "09_EXECUTIVE_OVERVIEW.md", title: "Executive Overview" },
  { code: "J", file: "10_TASKS.md", title: "Tasks" },
  { code: "K", file: "11_SKILL.md", title: "Portable SKILL.md" },
] as const;

export interface PopCtx {
  runId: string;
  intake: Intake;
  intent: Intent;
  foundation: Foundation;
  plan: Plan;
  nextAction: NextAction;
}

export function nextActionFor(intent: Intent, foundation: Foundation): NextAction {
  const first = intent.requestedAssets.includes("email_sequence")
    ? "Pick 10 Tier-1 accounts from the ICP and send Step 1 of the sequence, personalised to each trigger"
    : intent.requestedAssets.includes("prospecting_plan")
      ? "Approve the prospecting limits and run the signal search for the first 10 companies"
      : "Review the ICP with your two best customers in mind and mark anything that's wrong";
  return {
    action: first,
    owner: intent.company ? `${intent.company} founder / GTM lead` : "Founder / GTM lead",
    due: "Within 48 hours",
    proof: foundation.outcome100.includes("meetings") ? "Sent log + first replies tracked on the KPI scorecard" : "Annotated ICP saved back to the Library",
  };
}

export function buildPopDocs(ctx: PopCtx): { code: string; kind: string; title: string; markdown: string }[] {
  const { intent: i, foundation: f, plan: p, intake, nextAction: n, runId } = ctx;
  const assets = i.requestedAssets.map((a) => ASSET_TITLES[a]);
  const name = i.company ?? i.offer ?? "GTM Project";
  const meta = (title: string) =>
    `---\nproject: ${name}\nrun_id: ${runId}\nartifact: ${title}\nstatus: draft\nwholeness: ${f.W.toFixed(2)}\n---\n`;

  const docs: Record<string, string> = {
    A: `${meta("Intent Brief")}
# Intent Brief
- **Stated goal:** ${i.statedGoal}
- **Latent goal:** ${i.latentGoal}
- **Offer:** ${i.offer ?? "—"} · **ICP:** ${i.icp ?? "—"} · **Company:** ${i.company ?? "—"}
- **Stage / motion / audience:** ${i.stage ?? "assumed"} / ${i.motion ?? "assumed"} / ${i.audience ?? "assumed"}
- **Constraints:** ${i.constraints.join("; ") || "none stated"}
- **Domain (truth protocol):** ${i.domain}

## Wholeness W = ${f.W.toFixed(2)}
${f.criteria.map((c) => `- [${c.met ? "x" : " "}] ${c.label}${c.critical ? " *(critical)*" : ""}${c.value ? ` — ${c.value}` : ""}`).join("\n")}

## Assumptions (labelled)
${f.assumptions.map((a) => `- ${a}`).join("\n") || "- none"}
`,
    B: `${meta("JTBD")}
# Jobs To Be Done
| Field | Value |
|---|---|
| Actor | ${f.jtbd.actor} |
| Trigger | ${f.jtbd.trigger} |
| Struggle | ${f.jtbd.struggle} |
| Functional job | ${f.jtbd.functionalJob} |
| Emotional job | ${f.jtbd.emotionalJob} |
| Desired outcome | ${f.jtbd.desiredOutcome} |
| Success metric | ${f.jtbd.successMetric} |

## Deliverables mapped to the job
${assets.map((a) => `- ${a}`).join("\n")}
`,
    C: `${meta("KPI Tracking")}
# KPI Tracking
- **North star:** qualified meetings booked / week
- **100 outcome:** ${f.outcome100}
- **Metric tree:** contacted → replied → positive → meeting → opportunity → won
- **Owner (P&L):** ${n.owner}
- **Review cadence:** weekly scorecard, monthly ICP refresh
`,
    D: `${meta("Architecture")}
# Architecture — execution waves
\`\`\`mermaid
flowchart LR
${p.nodes.flatMap((node) => node.deps.map((d) => `  ${d}[${label(p, d)}] --> ${node.id}[${node.title}]`)).join("\n") || "  research[Research]"}
\`\`\`

| Wave | Runs in parallel |
|---|---|
${p.waves.map((w, k) => `| ${k + 1} | ${w.map((id) => label(p, id)).join(" · ")} |`).join("\n")}

Estimated compression: **${p.compression}×** (${ms(p.sequentialEstMs)} sequential → ${ms(p.waveEstMs)} in waves). Measured timings are recorded on the run.
`,
    E: `${meta("Project Master Doc")}
# Project Master Doc
1. **Summary:** ${i.statedGoal}
2. **Problem:** ${f.jtbd.struggle}
3. **Users:** ${i.icp ?? "—"}
4. **Outcome (100):** ${f.outcome100}
5. **Foundation (1):** ${f.foundation1}
6. **Scope:** ${assets.join(", ")}
7. **Non-goals:** sending outreach, CRM writes, or purchases without explicit approval
8. **Tech stack:** Enably Architect (Vercel AI SDK) · Supabase · Cloudflare durable agent · LangSmith · n8n/Make
9. **Data:** inputs compiled into MASTER.md; artifacts versioned in the Library
10. **Integrations:** webhook delivery to n8n / Make / Zapier (approval-gated)
11. **Security:** server-side secrets only; least privilege; no secrets in artifacts
12. **Risks:** unverified operational data; ICP drift — mitigated by truth guard + monthly refresh
13. **Vault map:** Library → /app/library · Runs → /app/runs/${runId}
14. **Next action:** ${n.action}
`,
    F: `${meta("Build Guide")}
# Build Guide
- [ ] **PreD — Validate inputs**
  - [ ] Confirm offer and ICP with two real customers
  - [ ] Replace every [ASSUMPTION] and {{variable}}
${p.waves.map((w, k) => `- [ ] **D${k + 1} — Wave ${k + 1}**\n${w.map((id) => `  - [ ] Review & approve ${label(p, id)}`).join("\n")}`).join("\n")}
- [ ] **D${p.waves.length + 1} — Launch** — ${n.action}
`,
    G: `${meta("Execution Handoff")}
# Execution Handoff
## Receiving-agent prompt
You are executing the approved GTM package for ${name}. Use only the artifacts in this run. Do not invent contacts, metrics, or customer names.

## Guardrails
- No external send, CRM write, or purchase without a human approval token.
- Respect suppression lists and opt-outs.
- Stop and escalate if a source contradicts an artifact.

## Abort gates
- Truth guard reports ungrounded operational data → verify first.
- Reply rate < 1% after 200 sends → stop and revise messaging.
`,
    H: `${meta("PRD")}
# PRD — ${name} GTM motion
**Problem:** ${f.jtbd.struggle}
**Solution:** ${assets.join(", ")} built on a verified ICP.
**Functional requirements:** each asset ready to use, variables explicit, assumptions labelled.
**SLOs:** package generated in one run; quality score ≥ 75; zero ungrounded data at dispatch.
**Acceptance:** owner reviews and approves each asset in the Library.
`,
    I: `${meta("Executive Overview")}
# Executive Overview
**What:** a go-to-market package for ${i.offer ?? name} aimed at ${i.icp ?? "the target buyer"}.
**Why now:** ${f.jtbd.trigger}.
**Target result:** ${f.outcome100}
**Ask:** approve the package and start the next action — *${n.action}* (${n.due}).

## Slide blueprint
1. The problem · 2. Who we win with (ICP) · 3. Message · 4. Motion & cadence · 5. Scorecard · 6. Next 30 days
`,
    J: `${meta("Tasks")}
# Tasks (Asana / Linear ready)
| Task | Owner | Due | Depends on |
|---|---|---|---|
| Validate ICP | ${n.owner} | Day 1 | — |
${p.nodes
  .filter((x) => x.id !== "research")
  .map((x) => `| Approve ${x.title} | ${n.owner} | Day ${2 + waveOf(p, x.id)} | ${x.deps.map((d) => label(p, d)).join(", ") || "—"} |`)
  .join("\n")}
| ${n.action} | ${n.owner} | ${n.due} | All approvals |
`,
    K: `---
name: ${slug(name)}-gtm-execution
description: Execute the approved ${name} GTM package (${assets.join(", ")}). Use when running outreach, enablement, or reporting for this ICP.
---
# ${name} — GTM execution skill
## Inputs
Approved artifacts from run \`${runId}\`.
## Steps
1. Load the ICP and personas. 2. Select Tier-1 accounts. 3. Personalise from the sequence. 4. Request approval. 5. Log activity to the scorecard.
## Guardrails
Never invent facts. Approval before any send or CRM write. Label assumptions.
`,
  };

  return POP_ARTIFACTS.map((a) => ({ code: a.code, kind: `pop_${a.code.toLowerCase()}`, title: `${a.code} · ${a.file}`, markdown: docs[a.code] }));

  function label(plan: Plan, id: string) {
    return plan.nodes.find((x) => x.id === id)?.title ?? id;
  }
}

function waveOf(p: Plan, id: string) {
  return p.waves.findIndex((w) => w.includes(id));
}
function ms(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}s` : `${n}ms`;
}
function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "project";
}
