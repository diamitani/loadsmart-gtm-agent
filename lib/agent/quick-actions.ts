import "server-only";
import { getStore } from "@/lib/db";
import { env } from "@/lib/env";
import { newId, nowIso } from "@/lib/utils";
import type { ActivityType } from "@/lib/db/types";
import { summarizeActivities } from "@/lib/connectors/sdr-tools";

/**
 * Deterministic handling of the most common enablement commands, so the
 * activity tracker works even in demo mode (no model key):
 *   "log 3 cold calls to Acme Corp"   "log a meeting with Zenix"   "show my activity this week"
 */
const TYPE_WORDS: [ActivityType, RegExp][] = [
  ["call", /calls?|dials?/i],
  ["email", /e-?mails?/i],
  ["linkedin", /linkedin( messages?| touches?)?|inmails?/i],
  ["dm", /dms?|direct messages?/i],
  ["meeting", /meetings?|demos?/i],
  ["post", /posts?/i],
  ["sms", /sms|texts?/i],
];

export function parseLogCommand(text: string): { type: ActivityType; count: number; account: string; stage?: "cold" | "follow_up" | "closing" } | null {
  const m = text.match(/^\s*(?:please\s+)?(?:log|record|track)\s+(?:(\d+|a|an|one|two|three|four|five|ten)\s+)?(cold\s+|follow[- ]?up\s+|closing\s+)?([a-z -]+?)\s+(?:to|with|for|at)\s+(.+?)\s*(?:today|yesterday)?[.!]?\s*$/i);
  if (!m) return null;
  const nums: Record<string, number> = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, ten: 10 };
  const count = m[1] ? Number(m[1]) || nums[m[1].toLowerCase()] || 1 : 1;
  const type = TYPE_WORDS.find(([, re]) => re.test(m[3]))?.[0];
  if (!type) return null;
  const stage = m[2] ? (/cold/i.test(m[2]) ? "cold" : /follow/i.test(m[2]) ? "follow_up" : "closing") : undefined;
  return { type, count: Math.min(count, 500), account: m[4].replace(/\s+(today|yesterday)$/i, "").trim(), stage };
}

export async function quickAction(text: string): Promise<string | null> {
  const store = getStore();
  const log = parseLogCommand(text);
  if (log) {
    await store.logActivity({ id: newId("act"), workspaceId: env().workspaceId, ...log, occurredAt: nowIso(), createdAt: nowIso() });
    return `✅ Logged **${log.count} ${log.type}${log.count > 1 ? "s" : ""}** to **${log.account}** for today${log.stage ? ` (${log.stage.replace("_", "-")})` : ""}.\n\nWant to add notes or set a follow-up? You can also see everything in **Activity**.`;
  }
  const period = /\b(this )?week\b/i.test(text) ? "week" : /\bmonth\b/i.test(text) ? "month" : /\btoday|day\b/i.test(text) ? "today" : null;
  if (period && /\b(activity|activities|summary|summari[sz]e|how many)\b/i.test(text)) {
    const since = new Date();
    since.setHours(0, 0, 0, 0);
    if (period === "week") since.setDate(since.getDate() - ((since.getDay() + 6) % 7));
    if (period === "month") since.setDate(1);
    const s = summarizeActivities(await store.listActivities({ since: since.toISOString(), limit: 5000 }), period);
    if (!s.total) return `No activity logged ${period === "today" ? "today" : `this ${period}`} yet. Try *"log 5 cold calls to Acme"*.`;
    return [`**Activity — ${period === "today" ? "today" : `this ${period}`}: ${s.total} touches**`, "", ...Object.entries(s.byType).map(([k, v]) => `- ${k}: ${v}`), "", "**Top accounts**", ...s.topAccounts.map((a) => `- ${a.account}: ${a.count}`)].join("\n");
  }
  return null;
}
