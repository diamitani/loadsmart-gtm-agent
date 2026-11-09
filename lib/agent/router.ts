import type { RunRecord } from "@/lib/pal/types";
import { ASSET_KINDS } from "@/lib/pal/types";

type Msg = { role: string };

const ASSET_WORDS = new RegExp(
  `\\b(${[...ASSET_KINDS.map((k) => k.replace(/_/g, "[ _-]?")), "icp", "persona", "email", "sequence", "dm", "script", "battle ?card", "playbook", "kpi", "positioning", "messaging", "gtm", "go[- ]to[- ]market", "launch"].join("|")})s?\\b`,
  "i",
);

/** Build when there is no package yet, when the last run is waiting on answers, or when the user clearly asks for a new package. */
/** Operational SDR / enablement requests are tool work, not a package build. */
export const OPS_INTENT =
  /^\s*(please\s+)?(log|record|track|research|look ?up|find|search|verify|enrich|push|sync|upsert|send|enroll|add .* to (my )?(crm|suppression)|show (me )?(my )?(activity|activities|pipeline)|summari[sz]e (my )?(activity|week|day)|how many (calls|emails|dms|meetings))\b/i;

export function decideMode(latest: string, lastRun: RunRecord | null, messages: Msg[]): "build" | "chat" {
  if (OPS_INTENT.test(latest) && lastRun?.status !== "needs_input") return "chat";
  if (!lastRun || messages.filter((m) => m.role === "user").length <= 1) return "build";
  if (lastRun.status === "needs_input") return "build";
  const asksNew = /\b(new|another|different|start over|from scratch|rebuild|build|create|generate|make|draft|write)\b/i.test(latest);
  const editsExisting = /\b(shorter|longer|revise|rewrite|edit|tweak|change|update|improve|tone|fix|this|that|it|step \d|email \d)\b/i.test(latest);
  return asksNew && ASSET_WORDS.test(latest) && !editsExisting ? "build" : "chat";
}

