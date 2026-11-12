import data from "./generated/kit.json";

export type Section = { slug: string; title: string; body: string };
export type Skill = { order: number; slug: string; name: string; description: string; body: string };
export type ConfigFile = { file: string; content: string };

export const kit = data as {
  playbook: string;
  sections: Section[];
  skills: Skill[];
  configFiles: ConfigFile[];
  agentPrompt: string;
  reasonCodes: string;
};

export function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function getSkill(slug: string) {
  return kit.skills.find((s) => s.slug === slug);
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
