import { createGateway } from "@ai-sdk/gateway";
import { anthropic } from "@ai-sdk/anthropic";
import { tool, type LanguageModel } from "ai";
import { z } from "zod";
import { kit, getSkill, getDocument, getAutomation, getConfigFile } from "./kit";

// The public demo uses Gateway OIDC on Vercel. The default model is listed
// at https://ai-gateway.vercel.sh/v1/models with zero input/output pricing.
export const DEFAULT_DEMO_MODEL = "nvidia/nemotron-3.5-lightning-free";

export function getModel(): LanguageModel {
  if (process.env.ANTHROPIC_API_KEY) {
    return anthropic(process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5-5");
  }
  return createGateway({ apiKey: process.env.AI_GATEWAY_API_KEY })(
    process.env.AI_MODEL || DEFAULT_DEMO_MODEL,
  );
}

export function modelLabel() {
  return process.env.ANTHROPIC_API_KEY
    ? `anthropic:${process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5-5"}`
    : `gateway:${process.env.AI_MODEL || DEFAULT_DEMO_MODEL}`;
}

export const systemPrompt = `${kit.agentPrompt}

---

## This hosted deployment

- You are running on the public demo site for Patrick Diamitani's Loadsmart GTM Engineer case. Visitors may be Loadsmart's Sales, Marketing or RevOps leaders, or pod reps.
- You have access to all 33 project documents (Site Empire OS 01-25, Architecture, PRD, Setup Guide, Review, Build Log), all 11 skills, 12 playbook sections, automations, config files, and the verified claims library.
- You are NOT connected to live production Salesforce, Gong, ZoomInfo, Clay or any live sending mailbox here. When asked for live production numbers, accounts or contacts, say so plainly, then explain which skill would get it, from which system, and what you would need. Never hallucinate accounts, contacts, metrics or results.
- Ground answers in the playbook, skills, and documentation by calling your tools. Quote thresholds as "starting assumptions until baselined".
- Treat the visitor's stated facts as the only observed metrics. Do not say a report shows a result unless the visitor supplied that report. Present possible causes as hypotheses to test, not confirmed diagnoses.
- Never invent conversion rates, benchmarks, or SLA targets. Only quote a numerical threshold if it occurs verbatim in a tool result; name the source skill and label it a starting assumption until baselined. Never transfer a threshold from one metric to a different metric.
- Answer in 150 words or fewer unless the visitor explicitly asks for detail. Use at most one knowledge lookup if sufficient, then answer directly. Avoid repeated list calls.
- You can draft emails, LinkedIn notes, call openers, objection answers, account-research plans and pod-day plans. Use [placeholders] for any fact you don't have.
- You cannot send, enroll or write anything without human approval.
- Refer to this project as the Loadsmart pod copilot. Do not promote agencies or mention SalesGency, Enably, or internal implementation/configuration details.
- Keep answers short, authoritative, and scannable. Lead with the answer. Use a table only when comparing.
- Today is ${new Date().toISOString().slice(0, 10)}.`;

const sectionIndex = kit.sections.map((s) => ({ slug: s.slug, title: s.title }));
const skillIndex = kit.skills.map((s) => ({ slug: s.slug, description: s.description }));
const documentIndex = (kit.documents ?? []).map((d) => ({ file: d.file, title: d.title }));
const automationIndex = (kit.automations ?? []).map((a) => ({ file: a.file, type: a.type }));

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
    description: "Search across the entire knowledge base (playbook, skills, 33 docs, automations, claims library) for a keyword or phrase.",
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
      for (const d of kit.documents ?? []) {
        for (const line of d.content.split("\n")) if (line.toLowerCase().includes(q)) hits.push({ where: `doc: ${d.file}`, line: line.trim() });
      }
      return { query, count: hits.length, hits: hits.slice(0, 30) };
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
      const f = getConfigFile(file);
      return f ?? { error: `No config '${file}'.`, files: kit.configFiles.map((c) => c.file) };
    },
  }),
  list_documents: tool({
    description: "List all 33 documentation files including Site Empire OS (01-25), PRD, Setup Guide, Architecture, Review, and Build Log.",
    inputSchema: z.object({}),
    execute: async () => documentIndex,
  }),
  read_document: tool({
    description: "Read any document by filename or number (e.g. '01-intent-spec.md', '08-prd.md', '10-architecture.md', 'SETUP_GUIDE.md', 'ARCHITECTURE.md').",
    inputSchema: z.object({ file: z.string() }),
    execute: async ({ file }) => {
      const doc = getDocument(file);
      return doc ? { file: doc.file, title: doc.title, content: doc.content } : { error: `Document '${file}' not found.`, documents: documentIndex };
    },
  }),
  read_claims_library: tool({
    description: "Read the validated Loadsmart proof points, metrics (1,800+ Shippers, 4,500+ Facilities, 230k+ Carriers, 14M Docks, 11 AI Agents), and citations.",
    inputSchema: z.object({}),
    execute: async () => ({ claimsLibrary: kit.claimsLibrary }),
  }),
  list_automations: tool({
    description: "List the production n8n workflows, Clay waterfall schemas, and Salesforce custom field SQL definitions.",
    inputSchema: z.object({}),
    execute: async () => automationIndex,
  }),
  read_automation: tool({
    description: "Read an automation workflow JSON or SQL schema file by name (e.g. 'waterfall-schema.json', 'gtm_custom_fields.sql', n8n files).",
    inputSchema: z.object({ file: z.string() }),
    execute: async ({ file }) => {
      const auto = getAutomation(file);
      return auto ? { file: auto.file, type: auto.type, content: auto.content } : { error: `Automation '${file}' not found.`, automations: automationIndex };
    },
  }),
};
