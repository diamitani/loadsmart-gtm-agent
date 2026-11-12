import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { zipSync, strToU8 } from "fflate";

const root = process.cwd();
const skillsDir = join(root, "kit/skills");
const publicSkillsDir = join(root, "public/skills");
mkdirSync(publicSkillsDir, { recursive: true });
mkdirSync(join(root, "public/downloads"), { recursive: true });

function collectFiles(dir, prefix = "") {
  const out = {};
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith(".")) continue;
    const full = join(dir, entry);
    const rel = prefix ? `${prefix}/${entry}` : entry;
    if (statSync(full).isDirectory()) {
      Object.assign(out, collectFiles(full, rel));
    } else {
      out[rel] = new Uint8Array(readFileSync(full));
    }
  }
  return out;
}

let skillCount = 0;
for (const slug of readdirSync(skillsDir).sort()) {
  const dir = join(skillsDir, slug);
  if (!statSync(dir).isDirectory()) continue;
  const files = collectFiles(dir, slug);
  const zipped = zipSync(files, { level: 6 });
  writeFileSync(join(publicSkillsDir, `${slug}.zip`), zipped);
  skillCount++;
}

// Build complete Loadsmart ABM OS kit bundle
const fullBundle = {
  ...collectFiles(join(root, "kit"), "kit"),
  ...collectFiles(join(root, "automations"), "automations"),
  ...collectFiles(join(root, "knowledge"), "knowledge"),
};
if (existsSync(join(root, "content/playbook.md"))) {
  fullBundle["content/playbook.md"] = new Uint8Array(readFileSync(join(root, "content/playbook.md")));
}
fullBundle["README-INSTALL.txt"] = strToU8(
  [
    "Loadsmart GTM Agent OS — Complete Team Kit",
    "==========================================",
    "1. kit/skills/*           — All portable SKILL.md folders (upload individual ZIPs or unzip here)",
    "2. automations/n8n/*      — Import 00-loadsmart-6step-prospect-engine.json + 05 error handler",
    "3. automations/prompts/*  — Paste loadsmart-n8n-setup-prompt.md into Claude Code / Chat",
    "4. kit/config/*           — Territory, ICP, exclusion, and cadence rules",
    "5. knowledge/loadsmart/*  — Approved Claims Library (C-XXX)",
  ].join("\n"),
);

const fullZip = zipSync(fullBundle, { level: 6 });
writeFileSync(join(root, "public/loadsmart-abm-os.zip"), fullZip);
writeFileSync(join(root, "public/downloads/loadsmart-abm-os.zip"), fullZip);

console.log(`pack-zips: packaged ${skillCount} skill ZIPs and updated loadsmart-abm-os.zip`);
