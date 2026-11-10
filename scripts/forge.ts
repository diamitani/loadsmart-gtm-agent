/**
 * Agent Forge CLI.
 *   npm run forge:validate -- <slug>     (no slug = every agents/* spec)
 *   npm run forge:build -- <slug>        validates, then writes build/<slug>/
 *   npm run forge:check                  fails if any build/<slug>/ is stale (CI)
 */
import fs from "node:fs";
import path from "node:path";
import { renderBuild, validateAgent, writeBuild, buildDir } from "@/forge/build";
import { architectTools } from "@/lib/agent/tools";
import { sdrTools } from "@/lib/connectors/sdr-tools";

const root = process.cwd();
const [cmd, ...args] = process.argv.slice(2);
const slugs = args.length ? args : fs.readdirSync(path.join(root, "agents")).filter((d) => d !== "_template" && fs.existsSync(path.join(root, "agents", d, "agent.yaml")));
const tools = Object.entries({ ...architectTools({}), ...sdrTools() }).map(([name, t]) => ({ name, needsApproval: (t as { needsApproval?: unknown }).needsApproval === true }));

let failed = false;
for (const slug of slugs) {
  const v = validateAgent(root, slug, tools);
  if (!v.ok || !v.spec || !v.sourceHash) {
    failed = true;
    console.error(`✗ ${slug}\n${v.errors.map((e) => `   - ${e}`).join("\n")}`);
    continue;
  }
  const files = renderBuild(root, v.spec, v.sourceHash);
  if (cmd === "build") {
    writeBuild(root, slug, files);
    console.log(`✓ ${slug} → ${path.relative(root, buildDir(root, slug))}/ (${Object.keys(files).join(", ")})`);
  } else if (cmd === "check") {
    const stale = Object.entries(files).filter(([n, t]) => fs.readFileSync(path.join(buildDir(root, slug), n), { encoding: "utf8", flag: "a+" }) !== t).map(([n]) => n);
    if (stale.length) {
      failed = true;
      console.error(`✗ ${slug}: build/ is stale (${stale.join(", ")}) — run npm run forge:build -- ${slug}`);
    } else console.log(`✓ ${slug}: build/ is current`);
  } else console.log(`✓ ${slug}: spec valid`);
}
process.exit(failed ? 1 : 0);
