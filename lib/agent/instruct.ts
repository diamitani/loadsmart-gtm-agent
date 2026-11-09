import "server-only";
import type { Foundation, InstructionPack, Intake, Intent } from "@/lib/pal/types";
import type { KnowledgeDoc } from "@/lib/db/types";
import { ASSET_TITLES } from "@/lib/pal/intent";
import { search } from "./knowledge";
import { SKILL_FOR, systemInstructions } from "./skills";

/**
 * Stage 4 — Enhance instructions ("Instruct" in the PAL diagram).
 * Compiles: system soul + compiled intent + foundation + JTBD + retrieved
 * knowledge (RAG-DAL) + the skills that will run, into one system prompt.
 */
export function compileInstructions(intake: Intake, intent: Intent, foundation: Foundation, knowledge: KnowledgeDoc[]): InstructionPack {
  const query = [intent.offer, intent.icp, intent.industry, intent.statedGoal, ...intent.competitors].filter(Boolean).join(" ");
  const hits = search(knowledge, query, 6);
  const fileHits = intake.files.length ? search(intake.files, query, 4) : [];
  const knowledgeSnippets = [...fileHits, ...hits].slice(0, 8);
  const skills = [...new Set(intent.requestedAssets.map((a) => SKILL_FOR[a]))];

  const brief = [
    "## Compiled brief (from PAL — treat as ground truth)",
    `- Stated goal: ${intent.statedGoal}`,
    `- Latent goal: ${intent.latentGoal}`,
    `- Company: ${intent.company ?? "not given"}`,
    `- Offer: ${intent.offer ?? "not given"}`,
    `- ICP: ${intent.icp ?? "not given"}`,
    `- Industry: ${intent.industry ?? "not given"} · Geography: ${intent.geography ?? "not given"}`,
    `- Stage: ${intent.stage ?? "assumed"} · Motion: ${intent.motion ?? "assumed"} · Audience: ${intent.audience ?? "assumed"}`,
    `- Competitors named: ${intent.competitors.join(", ") || "none"}`,
    `- Constraints: ${intent.constraints.join("; ") || "none"}`,
    `- Deliverables: ${intent.requestedAssets.map((a) => ASSET_TITLES[a]).join(", ")}`,
    "",
    "## Foundation",
    `- W = ${foundation.W.toFixed(2)} · 100 outcome: ${foundation.outcome100}`,
    `- JTBD: ${foundation.jtbd.actor} — when ${foundation.jtbd.trigger.toLowerCase()}, they want to ${foundation.jtbd.functionalJob.toLowerCase()}.`,
    foundation.assumptions.length ? `- Labelled assumptions: ${foundation.assumptions.join("; ")}` : "- No assumptions needed.",
  ].join("\n");

  const kb = knowledgeSnippets.length
    ? "## Retrieved knowledge (user-supplied — the only source for facts)\n" +
      knowledgeSnippets.map((h, i) => `[K${i + 1}] (${h.source})\n${h.text}`).join("\n\n")
    : "## Retrieved knowledge\nNone uploaded. Use {{variables}} and [ASSUMPTION: …] for any specific facts.";

  const guardrails = [
    "Never invent emails, phone numbers, addresses, statistics, dollar figures or customer names.",
    "Label every assumption.",
    "No sends, CRM writes or purchases — those are approval-gated actions outside this step.",
  ];

  return {
    system: [systemInstructions(), brief, kb, "## Guardrails\n" + guardrails.map((g) => `- ${g}`).join("\n")].join("\n\n"),
    skills,
    knowledgeSnippets,
    guardrails,
  };
}
