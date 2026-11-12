// Bundles the playbook and the skill kit into one JSON file the app and the agent read.
// Runs automatically before every build (npm "prebuild"). Edit files in /content or /kit, not the JSON.
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (p) => readFileSync(join(root, p), "utf8");

// Playbook, split into sections by "## " headings
const playbook = read("content/playbook.md");
const sections = [];
let current = null;
for (const line of playbook.split("\n")) {
  if (line.startsWith("## ")) {
    if (current) sections.push(current);
    const title = line.slice(3).trim();
    current = {
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      title,
      body: "",
    };
  } else if (current) {
    current.body += line + "\n";
  }
}
if (current) sections.push(current);

// Skills (frontmatter name + description, then body)
const skillOrder = [
  "loadsmart-abm-orchestrator", "la-crm-audit", "la-signal", "la-abm-tag", "la-persona-enrich",
  "la-research", "la-email", "la-sequence", "la-daily-report", "la-list-qa", "la-pod-feedback",
];
const skillDirs = readdirSync(join(root, "kit/skills"));
const skills = skillOrder.filter((s) => skillDirs.includes(s)).map((dir, i) => {
  const raw = read(`kit/skills/${dir}/SKILL.md`);
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const fm = Object.fromEntries(
    (m ? m[1] : "").split("\n").map((l) => {
      const k = l.indexOf(":");
      return [l.slice(0, k).trim(), l.slice(k + 1).trim()];
    }),
  );
  return { order: i, slug: dir, name: fm.name || dir, description: fm.description || "", body: m ? m[2] : raw };
});

// Config files and agent prompt
const configFiles = readdirSync(join(root, "kit/config")).sort().map((f) => ({ file: f, content: read(`kit/config/${f}`) }));
const agentPrompt = read("kit/agent/pod-copilot-system-prompt.md");
const reasonCodes = read("kit/templates/disqualification-reason-codes.csv");

const outDir = join(root, "lib/generated");
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
writeFileSync(
  join(outDir, "kit.json"),
  JSON.stringify({ playbook, sections, skills, configFiles, agentPrompt, reasonCodes }, null, 0),
);
console.log(`bundle-kit: ${sections.length} playbook sections, ${skills.length} skills, ${configFiles.length} config files`);
