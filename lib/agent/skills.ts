import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { AssetKind } from "@/lib/pal/types";

const ROOT = path.join(process.cwd(), "agent");

/** Which skill folder owns each asset kind (mirrors agent/agents/subagents.yaml). */
export const SKILL_FOR: Record<AssetKind, string> = {
  icp: "icp",
  personas: "personas",
  positioning: "messaging",
  email_sequence: "outbound-sequences",
  linkedin_dm: "outbound-sequences",
  call_script: "outbound-sequences",
  battlecard: "competitive",
  objection_handling: "competitive",
  kpi_scorecard: "kpi",
  gtm_playbook: "playbook",
  launch_plan: "playbook",
  prospecting_plan: "prospector",
  automation_blueprint: "n8n-engineer",
  use_cases: "use-cases",
  sales_ops_plan: "sales-ops-setup",
};

const cache = new Map<string, string>();

function read(rel: string): string {
  if (cache.has(rel)) return cache.get(rel)!;
  let text = "";
  try {
    text = fs.readFileSync(path.join(ROOT, rel), "utf8");
  } catch {
    text = "";
  }
  cache.set(rel, text);
  return text;
}

/** The forge agent this runtime serves (agents/<slug>/agent.yaml → build/<slug>/). */
export const AGENT_SLUG = "enably-gtm-architect";
const BUILD_PROMPT = path.join(process.cwd(), "build", AGENT_SLUG, "system_prompt.md");

/**
 * The agent's soul as the model receives it: the forge-generated build/<slug>/system_prompt.md
 * (agent/instructions/system.md + the spec's contract and guardrails), falling back to the raw
 * soul if the build output is missing. The manifest check reports a missing or stale build.
 */
export function systemInstructions(): string {
  if (!cache.has("@build")) {
    let text = "";
    try {
      text = fs.readFileSync(BUILD_PROMPT, "utf8").replace(/^<!--[\s\S]*?-->\s*/, "");
    } catch {
      text = "";
    }
    cache.set("@build", text);
  }
  return cache.get("@build") || read("instructions/system.md");
}

export function skillText(name: string, maxChars = 6000): string {
  const t = read(`skills/${name}/SKILL.md`);
  return t.length > maxChars ? t.slice(0, maxChars) + "\n…" : t;
}

export interface SkillInfo {
  name: string;
  description: string;
  path: string;
  files: number;
}

/** Roster for the Agents & Skills page. */
export function listSkills(): SkillInfo[] {
  const dir = path.join(ROOT, "skills");
  let names: string[] = [];
  try {
    names = fs.readdirSync(dir).filter((n) => fs.statSync(path.join(dir, n)).isDirectory());
  } catch {
    return [];
  }
  return names.sort().map((name) => {
    const text = read(`skills/${name}/SKILL.md`);
    const desc = text.match(/^description:\s*(.+)$/m)?.[1] ?? text.split("\n").find((l) => l.trim() && !l.startsWith("#") && !l.startsWith("---"))?.trim() ?? "";
    return { name, description: desc.replace(/^["']|["']$/g, ""), path: `agent/skills/${name}`, files: countFiles(path.join(dir, name)) };
  });
}

function countFiles(dir: string): number {
  let n = 0;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) n += e.isDirectory() ? countFiles(path.join(dir, e.name)) : 1;
  return n;
}
