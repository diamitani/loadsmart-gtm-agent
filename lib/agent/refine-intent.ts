import "server-only";
import { generateText, Output } from "ai";
import { z } from "zod";
import type { Intake, Intent } from "@/lib/pal/types";
import { ASSET_KINDS } from "@/lib/pal/types";
import { getModel } from "./models";

const IntentSchema = z.object({
  statedGoal: z.string().describe("The user's explicit request in one sentence"),
  latentGoal: z.string().describe("The business outcome behind the request"),
  company: z.string().nullable().describe("The user's company name, only if stated"),
  offer: z.string().nullable().describe("What they sell, only if stated or clearly implied"),
  icp: z.string().nullable().describe("Who they sell to (company type/size + buyer role), only if stated or clearly implied"),
  industry: z.string().nullable(),
  geography: z.string().nullable(),
  motion: z.enum(["outbound", "inbound", "plg", "partner", "hybrid"]).nullable(),
  stage: z.enum(["pre-launch", "beta", "post-mvp", "scaling"]).nullable(),
  audience: z.enum(["internal", "sales", "investor", "customer", "partner"]).nullable(),
  competitors: z.array(z.string()),
  requestedAssets: z.array(z.enum(ASSET_KINDS)).describe("Assets explicitly or clearly requested. Empty if the user asked generally."),
  confidence: z.number().min(0).max(1),
});

/**
 * LLM refinement of the deterministic intent. Uses the fast model with
 * structured output. Returns null in demo mode or on any failure — the
 * deterministic intent is always the floor.
 */
export async function refineIntent(intake: Intake): Promise<Partial<Intent> | null> {
  const model = getModel("fast");
  if (!model) return null;
  try {
    const { output } = await generateText({
      model,
      output: Output.object({ schema: IntentSchema }),
      system:
        "You extract structured go-to-market intent from a request. Only fill a field if the user stated it or it is unambiguous from their words. Use null when unknown — never guess company names, competitors or markets.",
      prompt: intake.masterMd,
      maxRetries: 1,
      telemetry: { functionId: "enably.intent.refine" },
    });
    if (!output) return null;
    const o = output as z.infer<typeof IntentSchema>;
    return {
      statedGoal: o.statedGoal,
      latentGoal: o.latentGoal,
      company: o.company ?? undefined,
      offer: o.offer ?? undefined,
      icp: o.icp ?? undefined,
      industry: o.industry ?? undefined,
      geography: o.geography ?? undefined,
      motion: o.motion ?? undefined,
      stage: o.stage ?? undefined,
      audience: o.audience ?? undefined,
      competitors: o.competitors,
      requestedAssets: o.requestedAssets,
      confidence: o.confidence,
    };
  } catch (err) {
    console.warn("[enably] intent refinement skipped:", (err as Error).message);
    return null;
  }
}
