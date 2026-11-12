import { anthropic } from "@ai-sdk/anthropic";
import { tool, type LanguageModel } from "ai";
import { z } from "zod";
import { kit, getSkill } from "./kit";

/**
 * Model routing (agent is data; the runtime picks the model):
 * 1. ANTHROPIC_API_KEY set  -> Anthropic directly (ANTHROPIC_MODEL, default claude-sonnet-5-5)
 * 2. otherwise              -> Vercel AI Gateway (AI_MODEL, default anthropic/claude-sonnet-5.5).
 *    On Vercel this authenticates with the project's OIDC token; locally set AI_GATEWAY_API_KEY.
 */
export function getModel(): LanguageModel {
  if (process.env.ANTHROPIC_API_KEY) {
    return anthropic(process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5-5");
  }
  return process.env.AI_MODEL ?? "anthropic/claude-sonnet-5.5";
}

export function modelLabel() {
  return process.env.ANTHROPIC_API_KEY
    ? `anthropic:${process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5-5"}`
    : `gateway:${process.env.AI_MODEL ?? "anthropic/claude-sonnet-5.5"}`;
}

export const systemPrompt = `${kit.agentPrompt}

---

## This hosted deployment

- You are running on the public demo site for Patrick Diamitani's Loadsmart GTM Engineer case. Visitors may be Loadsmart's Sales, Marketing or RevOps leaders, or pod reps.
- You are NOT connected to Salesforce, Gong, ZoomInfo, Clay or any mailbox here. When asked for live numbers, accounts or contacts, say so plainly, then explain which skill would get it, from which system, and what you would need. Never make up accounts, contacts, metrics or results.
- Ground answers in the playbook and skills by calling your tools. Quote thresholds as "starting assumptions until baselined".
- You can draft emails, LinkedIn notes, call openers, objection answers, account-research plans and pod-day plans. Use [placeholders] for any fact you don't have.
- You cannot send, enroll or write anything. If asked, describe the approval gate that would apply.
- Keep answers short and scannable. Lead with the answer. Use a table only when comparing.
- Today is ${new Date().toISOString().slice(0, 10)}.`;

const sectionIndex = kit.sections.map((s) => ({ slug: s.slug, title: s.title }));
const skillIndex = kit.skills.map((s) => ({ slug: s.slug, description: s.description }));

export const tools = {
  list_playbook_sections: tool({
    description: "List the sections of the Loadsmart ABM playbook with their slugs.",
    inputSchema: z.object({}),
    execute: async () => sectionIndex,
  }),
  read_playbook_section: tool({
    description:
      "Read one playbook section in full. Use for ICP, personas, messaging, cadences, scripts, diagnosis, signals, KPIs, pod rhythm, tools, scale layer, blind spots.",
    inputSchema: z.object({
      slug: z.string().describe("Section slug from list_playbook_sections"),
    }),
    execute: async ({ slug }) => {
      const s = kit.sections.find((x) => x.slug === slug) ?? kit.sections.find((x) => x.slug.includes(slug));
      return s ? { title: s.title, body: s.body } : { error: `No section '${slug}'.`, sections: sectionIndex };
    },
  }),
  search_playbook: tool({
    description: "Search the playbook and skills for a keyword or phrase (case-insensitive). Returns matching lines with their section.",
    inputSchema: z.object({ query: z.string().min(2) }),
    execute: async ({ query }) => {
      const q = query.toLowerCase();
      const hits: { where: string; line: string }[] = [];
      for (const s of kit.sections) {
        for (const line of s.body.split("\n")) if (line.toLowerCase().includes(q)) hits.push({ where: `playbook: ${s.title}`, line: line.trim() });
      }
      for (const s of kit.skills) {
        for (const line of s.body.split("\n")) if (line.toLowerCase().includes(q)) hits.push({ where: `skill: ${s.slug}`, line: line.trim() });
      }
      return { query, count: hits.length, hits: hits.slice(0, 25) };
    },
  }),
  list_skills: tool({
    description: "List the 11 skills in the Loadsmart ABM skill pack.",
    inputSchema: z.object({}),
    execute: async () => skillIndex,
  }),
  read_skill: tool({
    description: "Read one skill's full instructions (what it reads, writes, its rules and approval gate).",
    inputSchema: z.object({ slug: z.string() }),
    execute: async ({ slug }) => {
      const s = getSkill(slug) ?? kit.skills.find((x) => x.slug.includes(slug));
      return s ? { slug: s.slug, description: s.description, body: s.body } : { error: `No skill '${slug}'.`, skills: skillIndex };
    },
  }),
  read_config: tool({
    description:
      "Read a config file: icp.yaml, personas.yaml, pods.yaml, schedule.yaml, sending.yaml, salesforce-fields.md. Also 'reason-codes' for disqualification codes.",
    inputSchema: z.object({ file: z.string() }),
    execute: async ({ file }) => {
      if (file.includes("reason")) return { file: "disqualification-reason-codes.csv", content: kit.reasonCodes };
      const f = kit.configFiles.find((c) => c.file === file) ?? kit.configFiles.find((c) => c.file.startsWith(file.replace(/\..*$/, "")));
      return f ?? { error: `No config '${file}'.`, files: kit.configFiles.map((c) => c.file) };
    },
  }),
};
