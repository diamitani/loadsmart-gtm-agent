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
};
