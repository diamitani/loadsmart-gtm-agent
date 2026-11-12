// Bundles the playbook, skill kit, all 25 docs, and automations into one JSON file the app and agent read.
// Runs automatically before every build (npm "prebuild").
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
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

// Skills (Loadsmart ABM skills first, then Enably Sovereign skills)
const primarySkills = [
  "loadsmart-abm-orchestrator", "la-crm-audit", "la-signal", "la-abm-tag", "la-persona-enrich",
  "la-research", "la-email", "la-sequence", "la-daily-report", "la-list-qa", "la-pod-feedback",
];

const allSkillDirs = existsSync(join(root, "kit/skills"))
  ? readdirSync(join(root, "kit/skills")).filter((f) => {
      try {
        return statSync(join(root, "kit/skills", f)).isDirectory();
      } catch {
        return false;
      }
    })
  : [];

const orderedDirs = [
  ...primarySkills.filter((s) => allSkillDirs.includes(s)),
  ...allSkillDirs.filter((s) => !primarySkills.includes(s)).sort(),
];

function findSkillMd(dirPath) {
  const direct = join(dirPath, "SKILL.md");
  if (existsSync(direct)) return direct;
  try {
    const files = readdirSync(dirPath);
    for (const f of files) {
      const full = join(dirPath, f);
      if (f.endsWith(".md")) return full;
      if (statSync(full).isDirectory()) {
        const sub = join(full, "SKILL.md");
        if (existsSync(sub)) return sub;
      }
    }
  } catch {}
  return null;
}

const skills = orderedDirs.map((dir, i) => {
  const mdPath = findSkillMd(join(root, "kit/skills", dir));
  const raw = mdPath ? readFileSync(mdPath, "utf8") : "";
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const fm = Object.fromEntries(
    (m ? m[1] : "").split("\n").map((l) => {
      const k = l.indexOf(":");
      return [l.slice(0, k).trim(), l.slice(k + 1).trim()];
    }),
  );
  const description = fm.description || fm.trigger || fm.category || "Autonomous GTM capability";
  const name = fm.name || dir.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return { order: i, slug: dir, name, description, body: m ? m[2] : raw };
});

// Config files and agent prompt
const configFiles = readdirSync(join(root, "kit/config")).sort().map((f) => ({ file: f, content: read(`kit/config/${f}`) }));
const agentPrompt = read("kit/agent/pod-copilot-system-prompt.md");
const reasonCodes = read("kit/templates/disqualification-reason-codes.csv");
const claudeDoc = existsSync(join(root, "kit/agent/CLAUDE.md")) ? read("kit/agent/CLAUDE.md") : "";

// All docs in /docs (Site Empire OS 01-25 + PRD + Setup + Architecture + Review + Build Log + Sessions)
const docsDir = join(root, "docs");
const docFiles = existsSync(docsDir) ? readdirSync(docsDir).filter((f) => f.endsWith(".md")).sort() : [];
const documents = docFiles.map((f) => {
  const content = read(`docs/${f}`);
  const matchTitle = content.match(/^#\s+(.+)$/m);
  return {
    file: f,
    title: matchTitle ? matchTitle[1].replace(/^[0-9\.\s\-]+/, "").trim() : f.replace(/\.md$/, "").replace(/-/g, " "),
    content,
  };
});

const sessionsDir = join(root, "docs/sessions");
if (existsSync(sessionsDir)) {
  const sessionFiles = readdirSync(sessionsDir).filter((f) => f.endsWith(".md")).sort();
  for (const f of sessionFiles) {
    const content = read(`docs/sessions/${f}`);
    const matchTitle = content.match(/^#\s+(.+)$/m);
    documents.push({
      file: `sessions/${f}`,
      title: matchTitle ? matchTitle[1].replace(/^[0-9\.\s\-]+/, "").trim() : f.replace(/\.md$/, "").replace(/-/g, " "),
      content,
    });
  }
}

// Templates (CSV schemas, disqualification codes)
const templatesDir = join(root, "kit/templates");
const templates = existsSync(templatesDir)
  ? readdirSync(templatesDir).filter((f) => !f.startsWith(".")).map((f) => ({ file: f, content: read(`kit/templates/${f}`) }))
  : [];

// Automations & schemas (n8n, clay, salesforce, prompts)
const automations = [];
const autoBase = join(root, "automations");
if (existsSync(autoBase)) {
  for (const dir of ["n8n", "clay", "salesforce", "prompts"]) {
    const sub = join(autoBase, dir);
    if (existsSync(sub)) {
      for (const f of readdirSync(sub).filter((x) => !x.startsWith(".")).sort()) {
        automations.push({
          file: `${dir}/${f}`,
          type: dir === "prompts" ? "prompt" : dir,
          content: read(`automations/${dir}/${f}`),
        });
      }
    }
  }
}

// Claims library
const claimsLibrary = existsSync(join(root, "knowledge/loadsmart/claims-library.md"))
  ? read("knowledge/loadsmart/claims-library.md")
  : existsSync(join(root, "knowledge/claims-library.md"))
    ? read("knowledge/claims-library.md")
    : "";

const outDir = join(root, "lib/generated");
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
writeFileSync(
  join(outDir, "kit.json"),
  JSON.stringify({ 
    playbook, 
    sections, 
    skills, 
    configFiles, 
    agentPrompt, 
    reasonCodes, 
    claudeDoc, 
    documents, 
    automations, 
    claimsLibrary,
    templates
  }, null, 0),
);
console.log(`bundle-kit: ${sections.length} playbook sections, ${skills.length} skills, ${configFiles.length} config files, ${documents.length} docs, ${automations.length} automations, ${templates.length} templates`);
