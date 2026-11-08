import type { AssetKind, Audience, GtmMotion, GtmStage, Intake, Intent } from "./types";

/**
 * Stage 2 — Extract intent (deterministic pass).
 *
 * Fast, free, and explainable. When a model is configured, the agent layer
 * runs an LLM refinement on top (lib/agent/refine-intent.ts) and merges it —
 * the deterministic result is always the floor, never thrown away.
 */

const ASSET_PATTERNS: [AssetKind, RegExp][] = [
  ["icp", /\b(icp|ideal customer|target (market|account|customer)s?|who (should|to) (we )?(sell|target))\b/i],
  ["personas", /\b(persona|buyer profile|decision[- ]maker|champion)s?\b/i],
  ["positioning", /\b(position(ing)?|messaging|value prop(osition)?|usp|unique selling|tagline|elevator pitch|one[- ]pager|website copy|homepage copy)\b/i],
  ["email_sequence", /\b(e-?mails?|sequence|cadence|cold outreach|follow[- ]?ups?|nurture)\b/i],
  ["linkedin_dm", /\b(linkedin|dms?|direct message|social (selling|outreach)|inmail)\b/i],
  ["call_script", /\b(call script|cold call|phone|talk track|discovery (call|questions)|voicemail)\b/i],
  ["battlecard", /\b(battle ?card|competitive|competitor|vs\.?|versus|compete)\b/i],
  ["objection_handling", /\b(objection|pushback|rebuttal)s?\b/i],
  ["kpi_scorecard", /\b(kpis?|metrics?|scorecard|activity targets?|quota|dashboard|north star|okrs?)\b/i],
  ["gtm_playbook", /\b(playbook|sops?|sales process|enablement|gtm (plan|strategy|engine)|go[- ]to[- ]market (plan|strategy|engine))\b/i],
  ["launch_plan", /\b(launch|go[- ]live|release plan|rollout|campaign brief)\b/i],
  ["prospecting_plan", /\b(prospect(ing)?|lead (list|research|gen)|buying signals?|intent signals?|account research|find (leads|contacts))\b/i],
  ["use_cases", /\b(use[- ]cases?|customer stor(y|ies)|scenarios?)\b/i],
  ["sales_ops_plan", /\b(sales ops|sales operations|revops|rev ops|tech stack|crm setup|set ?up (a |my |our )?crm|deliverability|dmarc|dkim|spf|email domain|warm[- ]?up|domain warm)\b/i],
  ["automation_blueprint", /\b(n8n|make\.com|zapier|automat(e|ion)|workflow|webhook|clay|crm (setup|workflow)|mcp)\b/i],
];

/** Default package when the user asks for "a GTM plan" without naming assets. */
export const STARTER_PACK: AssetKind[] = [
  "icp",
  "personas",
  "positioning",
  "email_sequence",
  "kpi_scorecard",
  "gtm_playbook",
];

const MOTIONS: [GtmMotion, RegExp][] = [
  ["plg", /\b(plg|product[- ]led|self[- ]serve|freemium|free trial)\b/i],
  ["partner", /\b(partner(ship)?s?|channel|resell(er)?s?|affiliates?)\b/i],
  ["inbound", /\b(inbound|seo|content marketing|organic)\b/i],
  ["outbound", /\b(outbound|cold (email|call|outreach)|sdr|bdr|prospecting)\b/i],
];

const STAGES: [GtmStage, RegExp][] = [
  ["pre-launch", /\b(pre[- ]?launch|launching|about to launch|idea stage|haven'?t launched|new (product|startup))\b/i],
  ["beta", /\b(beta|pilot|early access|design partners?)\b/i],
  ["scaling", /\b(scal(e|ing)|series [b-z]|expand(ing)?|new markets?|enterprise motion)\b/i],
  ["post-mvp", /\b(mvp|first customers|post[- ]launch|live (product|customers)|revenue|paying customers)\b/i],
];

const AUDIENCES: [Audience, RegExp][] = [
  ["investor", /\b(investors?|vcs?|fundrais(e|ing)|pitch deck)\b/i],
  ["partner", /\b(for (our )?partners)\b/i],
  ["internal", /\b(internal|for (my|our) team|enablement|onboard(ing)? reps)\b/i],
  ["sales", /\b(for (my|our) (reps|sales team|sdrs|bdrs|aes))\b/i],
];

const INDUSTRIES =
  /\b(saas|fintech|healthcare|health ?tech|legal ?tech|real estate|proptech|e-?commerce|retail|manufacturing|logistics|construction|insurance|edtech|education|hr ?tech|cybersecurity|security|marketing agencies?|agencies|restaurants?|hospitality|music|media|nonprofits?|government|banking|biotech|automotive|telecom|energy)\b/i;

const GEO =
  /\b(us|usa|united states|north america|uk|united kingdom|europe|eu|emea|apac|latam|canada|australia|germany|france|india|brazil|mexico|global|worldwide|nyc|new york|california|texas|london|dubai)\b/i;

/** Phrases that usually introduce the thing being sold. */
const OFFER_PATTERNS: RegExp[] = [
  /\b(?:we(?:'re|’re| are)?|i(?:'m|’m| am)?)\s+(?:launching|building|selling|offer(?:ing)?|run(?:ning)?|created?|developing|make|sell|provide|have)\s+(?:an?\s+|the\s+|our\s+)?(.{3,90}?)(?=\s+(?:for|to|that|which|aimed|targeting|who|in)\b|[.,;!?\n]|$)/i,
  /\b(?:my|our)\s+(?:company|startup|product|platform|app|tool|agency|service|business|saas)\s*(?:,\s*[\w .&-]{2,40},)?\s*(?:is|does|helps|provides|offers)\s+(?:an?\s+)?(.{3,90}?)(?=[.;!?\n]|$)/i,
  /\bfor\s+(?:our|my)\s+(?!team\b|company\b|business\b|startup\b)(.{3,80}?)(?=\s+(?:for|to|aimed|targeting|that|which)\b|[.,;!?\n]|$)/i,
  /\b(?:for\s+)?sell(?:ing)?\s+(.{3,80}?)(?=\s+to\b)/i,
  /\boffer(?:ing)?\s*[:=]\s*(.{3,90}?)(?=[.;\n]|$)/i,
  /\bproduct\s*[:=]\s*(.{3,90}?)(?=[.;\n]|$)/i,
];

const ICP_PATTERNS: RegExp[] = [
  /\bicp\s*[:=]\s*(.{3,120}?)(?=[.;\n]|$)/i,
  /\btarget(?:ing)?\s*(?:market|customers?|audience|buyers?|accounts?)?\s*[:=]?\s+(?:is\s+|are\s+)?(.{3,120}?)(?=[.;!?\n]|$)/i,
  /\b(?:for|to|helps?|serving|serve|sell(?:ing)? to)\s+((?:small|mid[- ]?market|enterprise|smb|b2b|b2c|local|independent|early[- ]stage|seed|series [a-d]|founder|solo|growing|busy|\d+)[^.;!?\n]{2,110}?)(?=\s+(?:who|that|with|in order|so they)\b|[.;!?\n]|$)/i,
  /\b(?:for|to|helps?|serving|sell(?:ing)? to)\s+((?:[A-Za-z][A-Za-z-]*\s){0,3}(?:founders?|ceos?|ctos?|cfos?|cmos?|vps? of [a-z]+|heads? of [a-z]+|directors?|managers?|teams?|owners?|leaders?|agencies|companies|startups|smbs|firms|clinics|practices|restaurants|retailers|brands|artists|creators|recruiters|sdrs|reps))\b/i,
];

const COMPANY_PATTERNS: RegExp[] = [
  /\b(?:company|startup|brand|business)\s+(?:is\s+)?(?:called|named)\s+["“]?([A-Z][\w&.-]*(?:\s[A-Z][\w&.-]*){0,3})/,
  /\b(?:i'?m|we'?re|i am|we are)\s+(?:the\s+)?(?:founder|ceo|cofounder|co-founder|head of [a-z]+|vp [a-z]+)\s+(?:of|at)\s+([A-Z][\w&.-]*(?:\s[A-Z][\w&.-]*){0,3})/,
  /\bcompany\s*[:=]\s*([^\n.;]{2,60})/i,
  /\bat\s+([A-Z][a-zA-Z]+(?:\.(?:ai|io|com|co))?)\b,?\s+(?:we|our)\b/,
];

const COMPETITOR_RE = /\b(?:vs\.?|versus|compete(?:s|ing)? (?:with|against)|competitors? (?:are|is|like|include)|alternative to|instead of)\s+([A-Z][\w.&-]*(?:(?:,\s*|\s+and\s+|\s+or\s+)[A-Z][\w.&-]*){0,4})/g;

export function extractIntent(intake: Intake): Intent {
  const text = intake.text;
  const q = lowerKeys(intake.questionnaire);

  const requested = ASSET_PATTERNS.filter(([, re]) => re.test(text)).map(([k]) => k);
  // "full GTM plan / strategy / engine" implies the starter pack.
  const wantsFullPlan = /\b(gtm|go[- ]to[- ]market)\b.*\b(plan|strategy|engine|motion|everything|starter)\b/i.test(text);
  let requestedAssets = dedupe(wantsFullPlan ? [...STARTER_PACK, ...requested] : requested);
  const usedDefaultAssets = requestedAssets.length === 0;
  if (usedDefaultAssets) requestedAssets = [...STARTER_PACK];

  const offer = clean(q.offer ?? q.product ?? firstMatch(text, OFFER_PATTERNS));
  const icp = clean(q.icp ?? q["target customer"] ?? q.target ?? firstMatch(text, ICP_PATTERNS));
  const company = clean(q.company ?? firstMatch(text, COMPANY_PATTERNS));
  const industry = q.industry ?? text.match(INDUSTRIES)?.[1];
  const geography = q.geography ?? text.match(GEO)?.[1];
  const motion = (q.motion as GtmMotion | undefined) ?? MOTIONS.find(([, re]) => re.test(text))?.[0];
  const stage = (q.stage as GtmStage | undefined) ?? STAGES.find(([, re]) => re.test(text))?.[0];
  const audience = (q.audience as Audience | undefined) ?? AUDIENCES.find(([, re]) => re.test(text))?.[0];

  const competitors = dedupe(
    [...text.matchAll(COMPETITOR_RE)].flatMap((m) => m[1].split(/,\s*|\s+and\s+|\s+or\s+/)).map((s) => s.trim().replace(/[.,;:!?]+$/, "")),
  ).filter((c) => c.length > 1);

  const constraints = [
    ...(text.match(/\b(?:under|max(?:imum)?|no more than|within)\s+\$?\d[\d,]*(?:k|m)?\s*(?:words?|days?|weeks?|months?|budget|dollars|usd)?\b/gi) ?? []),
    ...(text.match(/\b(?:no|avoid|don'?t use|without)\s+[a-z][a-z -]{2,30}/gi) ?? []),
  ].slice(0, 6);

  const operational = /\b(email (address|list)|contacts?|phone numbers?|leads? list|addresses|book(ing)?|schedule|send|crm|import|verify)\b/i.test(text);
  const creative = /\b(brainstorm|ideas?|story|tagline|bio|creative|brand voice|narrative|names?)\b/i.test(text);
  const domain: Intent["domain"] = operational && creative ? "mixed" : operational ? "operational" : "creative";

  const statedGoal = summarizeGoal(text, requestedAssets, usedDefaultAssets);
  const latentGoal = inferLatentGoal(requestedAssets, stage, motion);

  const known = [offer, icp, company, industry, motion, stage].filter(Boolean).length;
  const confidence = Math.round((0.35 + 0.65 * (known / 6)) * 100) / 100;

  return {
    statedGoal,
    latentGoal,
    company,
    offer,
    icp,
    industry: industry?.toLowerCase(),
    geography,
    motion,
    stage,
    audience,
    competitors,
    requestedAssets,
    usedDefaultAssets,
    constraints,
    urls: intake.links,
    domain,
    confidence,
  };
}

/** Merge an LLM refinement on top of the deterministic floor (LLM wins only where it adds information). */
export function mergeIntent(base: Intent, refined: Partial<Intent> | null | undefined): Intent {
  if (!refined) return base;
  const pick = <K extends keyof Intent>(k: K): Intent[K] => {
    const v = refined[k];
    if (v === undefined || v === null || (typeof v === "string" && !v.trim())) return base[k];
    if (Array.isArray(v) && v.length === 0) return base[k];
    return v as Intent[K];
  };
  const requestedAssets = base.usedDefaultAssets && refined.requestedAssets?.length
    ? (refined.requestedAssets as AssetKind[])
    : dedupe([...base.requestedAssets, ...((refined.requestedAssets as AssetKind[] | undefined) ?? [])]);
  return {
    ...base,
    statedGoal: pick("statedGoal"),
    latentGoal: pick("latentGoal"),
    company: pick("company"),
    offer: pick("offer"),
    icp: pick("icp"),
    industry: pick("industry"),
    geography: pick("geography"),
    motion: pick("motion"),
    stage: pick("stage"),
    audience: pick("audience"),
    competitors: dedupe([...base.competitors, ...(refined.competitors ?? [])]),
    requestedAssets,
    usedDefaultAssets: base.usedDefaultAssets && !refined.requestedAssets?.length,
    confidence: Math.max(base.confidence, Math.min(0.95, refined.confidence ?? 0)),
  };
}

function summarizeGoal(text: string, assets: AssetKind[], usedDefault: boolean): string {
  const firstSentence = text.split(/(?<=[.!?])\s+|\n/)[0]?.trim() ?? "";
  const ask = firstSentence.length > 8 ? truncate(firstSentence, 160) : "Build a go-to-market package";
  return usedDefault ? `${ask} (scope: GTM starter pack)` : `${ask} (scope: ${assets.length} asset${assets.length === 1 ? "" : "s"})`;
}

function inferLatentGoal(assets: AssetKind[], stage?: GtmStage, motion?: GtmMotion): string {
  if (assets.includes("prospecting_plan")) return "Generate qualified pipeline from real buying signals without burning the domain.";
  if (assets.includes("automation_blueprint")) return "Turn a manual GTM motion into a repeatable, observable automation.";
  if (stage === "pre-launch") return "Win the first 10 design partners and prove the problem is worth paying for.";
  if (stage === "scaling") return "Make pipeline creation predictable enough to hire against.";
  if (motion === "plg") return "Convert product usage into revenue conversations at the right moment.";
  if (assets.includes("battlecard") || assets.includes("objection_handling")) return "Raise win rate in competitive deals.";
  return "Create a predictable, repeatable path from target account to booked meeting to closed revenue.";
}

function firstMatch(text: string, patterns: RegExp[]): string | undefined {
  for (const re of patterns) {
    const m = text.match(re);
    if (m?.[1]) return m[1];
  }
  return undefined;
}

function clean(s?: string): string | undefined {
  if (!s) return undefined;
  const v = s.replace(/\s+/g, " ").replace(/^[\s,:;-]+|[\s,:;-]+$/g, "").trim();
  if (v.length < 2 || /^(it|this|that|them|us|you|me|a|an|the)$/i.test(v)) return undefined;
  return v;
}

function lowerKeys(o: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(o).map(([k, v]) => [k.toLowerCase().replace(/[_-]+/g, " "), v]));
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

function dedupe<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

export const ASSET_TITLES: Record<AssetKind, string> = {
  icp: "Ideal Customer Profile",
  personas: "Buyer Personas",
  positioning: "Positioning & Messaging",
  email_sequence: "Outbound Email Sequence",
  linkedin_dm: "LinkedIn DM Sequence",
  call_script: "Cold Call & Discovery Script",
  battlecard: "Competitive Battlecard",
  objection_handling: "Objection Handling Guide",
  kpi_scorecard: "KPI & Activity Scorecard",
  gtm_playbook: "GTM Sales Playbook",
  launch_plan: "Launch Plan",
  prospecting_plan: "Signal-Based Prospecting Plan",
  automation_blueprint: "Automation Blueprint (n8n / Make / Zapier)",
  use_cases: "Use Case Library",
  sales_ops_plan: "Sales Ops Setup Plan",
};
