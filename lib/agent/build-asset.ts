import "server-only";
import { generateText } from "ai";
import type { Artifact, AssetKind, InstructionPack } from "@/lib/pal/types";
import { ASSET_TITLES } from "@/lib/pal/intent";
import { assetTemplate, type TemplateCtx } from "@/lib/pal/templates";
import { REQUIRED_SECTIONS } from "@/lib/pal/quality-gate";
import { getModel, modelLabel } from "./models";
import { SKILL_FOR, skillText } from "./skills";
import { newId, nowIso } from "@/lib/utils";

export const PROMPT_VERSION = "gtm-architect@1.0.0";

/**
 * Build one GTM asset. With a model: the skill + compiled instructions +
 * upstream assets (from earlier DAG waves) + the template skeleton.
 * Without a model (demo): the deterministic template.
 */
export async function buildAsset(
  kind: AssetKind,
  ctx: TemplateCtx & { runId: string; pack: InstructionPack; upstream: Artifact[] },
): Promise<Artifact> {
  const skeleton = assetTemplate(kind, ctx);
  const model = getModel("main");
  let markdown = skeleton;

  if (model) {
    const upstream = ctx.upstream
      .map((a) => `### ${a.title}\n${a.markdown.slice(0, 3500)}`)
      .join("\n\n");
    const required = (REQUIRED_SECTIONS[kind] ?? []).map((r) => r.source.replace(/\\b|\\/g, "").replace(/\|/g, " or ")).join(", ");
    try {
      const { text } = await generateText({
        model,
        system: `${ctx.pack.system}\n\n## Skill: ${SKILL_FOR[kind]}\n${skillText(SKILL_FOR[kind])}`,
        prompt: [
          `Write the **${ASSET_TITLES[kind]}** for this client as polished Markdown, ready to use.`,
          upstream ? `\n## Upstream assets already approved in this run (stay consistent with them)\n${upstream}` : "",
          `\n## Required skeleton — keep every section heading, replace placeholders with specific content where the brief supports it, keep {{variables}} / [ASSUMPTION] where it does not:\n${skeleton}`,
          required ? `\nThe output MUST contain these sections/terms: ${required}.` : "",
          "\nReturn only the Markdown document, starting with the H1 title.",
        ].join("\n"),
        maxRetries: 2,
        telemetry: { functionId: `enably.build.${kind}` },
      });
      if (text && text.trim().length > 200) markdown = text.trim();
    } catch (err) {
      console.warn(`[enably] model build failed for ${kind}, using template:`, (err as Error).message);
    }
  }

  return {
    id: newId("art"),
    runId: ctx.runId,
    kind,
    group: "asset",
    title: ASSET_TITLES[kind],
    markdown,
    status: "draft",
    version: 1,
    createdAt: nowIso(),
    provenance: {
      agentId: `${SKILL_FOR[kind]}-architect`,
      model: model ? modelLabel() : "template",
      promptVersion: PROMPT_VERSION,
      inputRefs: [`run:${ctx.runId}`, ...ctx.upstream.map((u) => `artifact:${u.id}`)],
    },
  };
}
