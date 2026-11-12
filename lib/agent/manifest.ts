import "server-only";
import fs from "node:fs";
import path from "node:path";
import { ASSET_KINDS, type AssetKind } from "@/lib/pal/types";
import { SKILL_FOR, listSkills, systemInstructions } from "./skills";
import { architectTools } from "./tools";
import { sdrTools } from "@/lib/connectors/sdr-tools";
import { AGENT_SLUG } from "./skills";
import { renderBuild, validateAgent } from "@/forge/build";

const ROOT = path.join(process.cwd(), "agent");

export interface SubagentSpec {
  id: string;
  skill: string;
  assets: string[];
  tools: string[];
}

/** Parse agent/agents/subagents.yaml (one flow-mapping per line — no YAML dependency needed). */
export function parseSubagents(text: string): SubagentSpec[] {
  const out: SubagentSpec[] = [];
  for (const line of text.split("\n")) {
    const m = line.match(/^\s{2}([a-z0-9-]+):\s*\{(.*)\}\s*$/i);
    if (!m) continue;
    const body = m[2];
    const list = (key: string) => (body.match(new RegExp(`${key}:\\s*\\[([^\\]]*)\\]`))?.[1] ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    out.push({ id: m[1], skill: (body.match(/skill:\s*skills\/([a-z0-9-]+)/i)?.[1] ?? "").trim(), assets: list("assets"), tools: list("tools") });
  }
  return out;
}

/** Tool names listed under `spec.tools` in agent/agents/gtm-architect.agent.yaml. */
export function parseOrchestratorTools(text: string): string[] {
  const block = text.split(/\n\s{2}tools:\s*\n/)[1]?.split(/\n\s{2}[a-z]+:/)[0] ?? "";
  return [...block.matchAll(/^\s*-\s*([a-z0-9_]+)/gm)].map((m) => m[1]);
}

function readAgentFile(rel: string): string {
  try {
    return fs.readFileSync(path.join(ROOT, rel), "utf8");
  } catch {
    return "";
  }
}

/**
 * The agent's wiring, checked against the code that runs it: the soul (system prompt) loads,
 * every subagent's skill exists, every asset kind has an owner, and every tool a
 * subagent or the orchestrator declares is actually implemented.
 */
export function agentManifest() {
  const problems: string[] = [];
  const soul = systemInstructions();
  if (soul.trim().length < 200) problems.push("agent/instructions/system.md missing or empty (not bundled?)");

  const skills = listSkills();
  const skillNames = new Set(skills.map((s) => s.name));
  if (!skills.length) problems.push("agent/skills not found (not bundled?)");
  for (const s of skills) if (!readAgentFile(`skills/${s.name}/SKILL.md`).trim()) problems.push(`skills/${s.name}/SKILL.md missing`);

  const toolNames = new Set([...Object.keys(architectTools({})), ...Object.keys(sdrTools())]);
  const subagents = parseSubagents(readAgentFile("agents/subagents.yaml"));
  if (!subagents.length) problems.push("agent/agents/subagents.yaml missing or unparseable");
  for (const a of subagents) {
    if (!skillNames.has(a.skill)) problems.push(`subagent ${a.id}: skill '${a.skill}' not found`);
    for (const k of a.assets) {
      if (!(ASSET_KINDS as readonly string[]).includes(k)) problems.push(`subagent ${a.id}: unknown asset kind '${k}'`);
      else if (SKILL_FOR[k as AssetKind] !== a.skill) problems.push(`subagent ${a.id}: asset '${k}' is built with skill '${SKILL_FOR[k as AssetKind]}' in code`);
    }
    for (const t of a.tools) if (!toolNames.has(t)) problems.push(`subagent ${a.id}: tool '${t}' is not implemented`);
  }
  for (const k of ASSET_KINDS) if (!skillNames.has(SKILL_FOR[k])) problems.push(`asset ${k}: skill '${SKILL_FOR[k]}' not found`);

  const orchestratorTools = parseOrchestratorTools(readAgentFile("agents/gtm-architect.agent.yaml"));
  for (const t of orchestratorTools) if (!toolNames.has(t)) problems.push(`gtm-architect: tool '${t}' is not implemented`);

  // Forge: optional design specification and build artifacts.
  let forge: { slug: string; version?: string; sourceHash?: string; build: "current" | "stale" | "missing" | "invalid-spec" | "optional" } = { slug: AGENT_SLUG, build: "optional" };
  try {
    const toolList = Object.entries({ ...architectTools({}), ...sdrTools() }).map(([name, t]) => ({ name, needsApproval: (t as { needsApproval?: unknown }).needsApproval === true }));
    const spec = validateAgent(process.cwd(), AGENT_SLUG, toolList, { runtime: true });
    if (spec.ok && spec.spec && spec.sourceHash) {
      const want = renderBuild(process.cwd(), spec.spec, spec.sourceHash)["system_prompt.md"];
      const have = (() => {
        try {
          return fs.readFileSync(path.join(process.cwd(), "build", AGENT_SLUG, "system_prompt.md"), "utf8");
        } catch {
          return null;
        }
      })();
      forge = { slug: AGENT_SLUG, version: spec.spec.identity.version, sourceHash: spec.sourceHash, build: have === null ? "missing" : have === want ? "current" : "stale" };
    }
  } catch {
    forge = { slug: AGENT_SLUG, build: "optional" };
  }

  return { ok: problems.length === 0, forge, soulChars: soul.length, skills, subagents, tools: [...toolNames].sort(), orchestratorTools, problems };
}
