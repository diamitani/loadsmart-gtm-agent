import data from "./generated/kit.json";

export type Section = { slug: string; title: string; body: string };
export type Skill = { order: number; slug: string; name: string; description: string; body: string };
export type ConfigFile = { file: string; content: string };
export type DocumentItem = { file: string; title: string; content: string };
export type AutomationItem = { file: string; type: string; content: string };
export type TemplateItem = { file: string; content: string };

export type KitData = {
  playbook: string;
  sections: Section[];
  skills: Skill[];
  configFiles: ConfigFile[];
  agentPrompt: string;
  reasonCodes: string;
  claudeDoc: string;
  documents: DocumentItem[];
  automations: AutomationItem[];
  claimsLibrary: string;
  templates: TemplateItem[];
};

export const kit = data as KitData;

export function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function getSkill(slug: string) {
  return kit.skills.find((s) => s.slug === slug);
}

export function getDocument(fileOrSlug: string) {
  const norm = fileOrSlug.toLowerCase();
  return kit.documents?.find(
    (d) => d.file.toLowerCase() === norm || d.file.toLowerCase().includes(norm) || d.title.toLowerCase().includes(norm)
  );
}

export function getAutomation(fileOrName: string) {
  const norm = fileOrName.toLowerCase();
  return kit.automations?.find(
    (a) => a.file.toLowerCase() === norm || a.file.toLowerCase().includes(norm)
  );
}

export function getConfigFile(filename: string) {
  const norm = filename.toLowerCase();
  return kit.configFiles?.find(
    (c) => c.file.toLowerCase() === norm || c.file.toLowerCase().startsWith(norm.replace(/\..*$/, ""))
  );
}

export const skillMeta: Record<string, { step: string; when: string }> = {
  // Loadsmart ABM Pod Skills
  "loadsmart-abm-orchestrator": { step: "Runner", when: "Every run" },
  "la-crm-audit": { step: "Step 0", when: "Week 1, then quarterly" },
  "la-signal": { step: "Step 1", when: "Daily 06:00 CT" },
  "la-abm-tag": { step: "Step 2", when: "Weekly, Mon 06:30" },
  "la-persona-enrich": { step: "Step 3", when: "Daily 07:00" },
  "la-research": { step: "Step 4", when: "Daily 07:30" },
  "la-email": { step: "Step 5", when: "Daily 08:00" },
  "la-sequence": { step: "Step 6", when: "Daily 08:30" },
  "la-daily-report": { step: "Step 7", when: "Daily 17:00" },
  "la-list-qa": { step: "Weekly", when: "Fri 12:00" },
  "la-pod-feedback": { step: "Weekly", when: "Mon 09:00" },

  // 6-Step Prospect Automation Process (Patrick Diamitani)
  "prospect-outreach": { step: "Master 6-Step", when: "End-to-End Orchestrator" },
  "prospect-step-1-signals": { step: "Step 1 · Signals", when: "Daily Signal Scout" },
  "prospect-step-2-companies": { step: "Step 2 · Companies", when: "CRM Shield & ICP" },
  "prospect-step-3-contacts": { step: "Step 3 · Contacts", when: "ZoomInfo + Clay Waterfall" },
  "prospect-step-4-research": { step: "Step 4 · Research", when: "EDGAR & News Brief" },
  "prospect-step-5-email": { step: "Step 5 · Email", when: "Claude PAS + Claims" },
  "prospect-step-6-outreach": { step: "Step 6 · Outreach", when: "Approval + Gong / Apollo" },
  "n8n-engineer-companion": { step: "n8n Setup", when: "Deployment & Ops" },

  // Enably Sovereign GTM Engineering Skills
  "prospector": { step: "Prospecting", when: "Signal Triggered" },
  "clay-gtm-architect": { step: "Enrichment", when: "Waterfall Run" },
  "n8n-engineer": { step: "Automation", when: "Orchestration" },
  "n8n-execution-analyst": { step: "Analytics", when: "Diagnostics" },
  "outbound-sequences": { step: "Copywriting", when: "Sequence Draft" },
  "sdr-assistant": { step: "Copilot", when: "Rep Pod Call" },
  "calibrated-truth": { step: "Governance", when: "Pre-send Guard" },
  "sop-architect": { step: "Architecture", when: "Pod Scaling" },
  "tech-stack-architect": { step: "Stack", when: "Tool Integration" },
  "gtm-wizard": { step: "Strategy", when: "Launch Planning" },
  "pal-process": { step: "Doctrine", when: "Agent Lifecycle" },
  "pal-stages": { step: "Pipeline", when: "Execution Wave" },
  "icp": { step: "Targeting", when: "Account Tiers" },
  "personas": { step: "Buying Committee", when: "Persona Discovery" },
  "messaging": { step: "Positioning", when: "Category Design" },
  "competitive": { step: "Intelligence", when: "Objection Handling" },
  "kpi": { step: "Measurement", when: "Pipeline Velocity" },
  "sales-enablement": { step: "Training", when: "Pod Playbooks" },
  "sales-ops-setup": { step: "CRM & Ops", when: "Salesforce Schema" },
  "one-must-act": { step: "Integrity", when: "Agent Alignment" },
  "pop": { step: "Deliverables", when: "11-Artifact Package" },
  "playbook": { step: "Standard", when: "Sovereign GTM" },
  "use-cases": { step: "Solutions", when: "Shipper / Broker" },
};

export type SkillCategory = "loadsmart" | "prospect" | "sovereign";

export function getSkillCategory(slug: string): SkillCategory {
  if (slug.startsWith("la-") || slug === "loadsmart-abm-orchestrator") return "loadsmart";
  if (slug.startsWith("prospect-") || slug === "n8n-engineer-companion") return "prospect";
  return "sovereign";
}

export function getSkillMeta(slug: string): { step: string; when: string } {
  return skillMeta[slug] ?? { step: "Autonomous", when: "Continuous" };
}
