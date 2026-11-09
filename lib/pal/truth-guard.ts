import type { Artifact, Intent, TruthFinding, TruthReport } from "./types";

/**
 * Calibrated Truth Protocol.
 *
 * Creative content (positioning, taglines, story, brainstorming) is never
 * lectured. Operational entities (emails, phones, addresses, booking dates,
 * hard statistics, money, named customers) must be *grounded* — present in
 * the user's own inputs or knowledge base — before anything is dispatched.
 * Ungrounded entities produce one constructive, non-blocking notice.
 */

const PATTERNS: { type: TruthFinding["type"]; re: RegExp }[] = [
  { type: "email", re: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g },
  { type: "phone", re: /(?:\+?\d{1,2}[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b/g },
  {
    type: "address",
    re: /\b\d{1,5}\s+(?:[A-Z][a-z]+\s){1,3}(?:St|Street|Ave|Avenue|Blvd|Boulevard|Rd|Road|Pkwy|Parkway|Plz|Plaza|Dr|Drive|Ln|Lane|Way)\b\.?/g,
  },
  {
    type: "date_commitment",
    re: /\b(?:on|by|for)\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2}(?:st|nd|rd|th)?(?:,\s*\d{4})?\b/g,
  },
  // Hard statistics presented as fact ("increased reply rates by 43%"). Template placeholders like {{metric}} are ignored.
  { type: "statistic", re: /\b(?:by|of|to|over|up to|increased?|reduced?|cut|grew|boost(?:ed)?)\s+\d{1,3}(?:\.\d+)?\s?%/gi },
  { type: "money", re: /\$\s?\d[\d,]*(?:\.\d+)?\s?(?:k|m|mm|b|million|billion)?\b/gi },
  { type: "customer_claim", re: /\b(?:[Tt]rusted by|[Uu]sed by|[Cc]ustomers? (?:like|include)|[Hh]elped)\s+([A-Z][\w&.-]+(?:,?\s+(?:and\s+)?[A-Z][\w&.-]+){0,3})/g },
];

export function scanText(text: string): Omit<TruthFinding, "grounded">[] {
  const findings: Omit<TruthFinding, "grounded">[] = [];
  const seen = new Set<string>();
  for (const { type, re } of PATTERNS) {
    for (const m of text.matchAll(re)) {
      const value = (type === "customer_claim" ? m[1] : m[0]).trim();
      const key = `${type}:${value.toLowerCase()}`;
      if (seen.has(key) || isPlaceholder(value)) continue;
      seen.add(key);
      findings.push({ type, value });
    }
  }
  return findings;
}

/**
 * @param sources text the user actually supplied (MASTER.md + knowledge base).
 *                An entity is grounded if it appears verbatim in a source.
 */
export function truthCheck(artifacts: Pick<Artifact, "id" | "markdown" | "kind">[], sources: string, domain: Intent["domain"]): TruthReport {
  const haystack = normalize(sources);
  const findings: TruthFinding[] = [];
  for (const a of artifacts) {
    for (const f of scanText(a.markdown)) {
      findings.push({ ...f, artifactId: a.id, grounded: haystack.includes(normalize(f.value)) });
    }
  }
  const ungroundedFindings = findings.filter((f) => !f.grounded);
  const types = [...new Set(ungroundedFindings.map((f) => LABEL[f.type]))];
  return {
    domain,
    findings,
    ungrounded: ungroundedFindings.length,
    notice: ungroundedFindings.length
      ? `💡 Notice: found operational data (${types.join(", ")}) that isn't in your inputs or knowledge base. Treat it as a placeholder and verify it via direct search or your CRM before anything is sent or published.`
      : null,
  };
}

const LABEL: Record<TruthFinding["type"], string> = {
  email: "emails",
  phone: "phone numbers",
  address: "addresses",
  date_commitment: "dates",
  statistic: "statistics",
  money: "dollar figures",
  customer_claim: "named customers",
  url: "links",
};

function isPlaceholder(v: string) {
  return /\{\{|\}\}|\[|\]|example\.(com|org)|acme|yourcompany|domain\.com/i.test(v);
}

function normalize(s: string) {
  return s.toLowerCase().replace(/\s+/g, " ");
}
