import type { Criterion, Foundation, Intent, Jtbd } from "./types";
import { ASSET_TITLES } from "./intent";

/**
 * Stage 3 — One Must Act foundation check.
 *
 *   W = (1/m) Σ I(c_i)        over the m *critical* criteria
 *   V(W, M) = W · Π M_j       multipliers on an incomplete foundation decay to 0
 *
 * If W < 1.00 the harness halts BEFORE any model/tool spend and asks only for
 * the missing critical criteria (one focused message). Non-critical gaps use a
 * reversible default that is labelled as an assumption — never silently.
 */
export function checkFoundation(intent: Intent): Foundation {
  const criteria: Criterion[] = [
    {
      id: "offer",
      label: "Offer — what you sell",
      met: !!intent.offer,
      value: intent.offer,
      critical: true,
      question: "What exactly are you selling? One line is enough (e.g. “an AI scheduling tool for dental clinics”).",
    },
    {
      id: "icp",
      label: "Target buyer (ICP)",
      met: !!intent.icp,
      value: intent.icp,
      critical: true,
      question: "Who is the buyer? Company type + size + the role that signs (e.g. “10–50 person B2B SaaS, Head of Sales”).",
    },
    {
      id: "outcome",
      label: "Deliverable / outcome",
      met: intent.requestedAssets.length > 0,
      value: intent.requestedAssets.map((a) => ASSET_TITLES[a]).join(", "),
      critical: true,
      question: "What do you want me to build first — a full GTM starter pack, or specific assets (ICP, emails, call script, battlecard…)?",
    },
    {
      id: "stage",
      label: "Product stage",
      met: !!intent.stage,
      value: intent.stage,
      critical: false,
      question: "What stage is the product in — pre-launch, beta, post-MVP, or scaling?",
      fallback: "post-MVP (has a working product, looking for repeatable pipeline)",
    },
    {
      id: "motion",
      label: "GTM motion",
      met: !!intent.motion,
      value: intent.motion,
      critical: false,
      question: "Which motion leads — outbound, inbound, product-led, partner, or hybrid?",
      fallback: "outbound-led hybrid",
    },
    {
      id: "audience",
      label: "Audience for the assets",
      met: !!intent.audience,
      value: intent.audience,
      critical: false,
      question: "Who will use these assets — your sales team, customers, investors, or partners?",
      fallback: "your sales team (internal, ready to use)",
    },
    {
      id: "industry",
      label: "Industry / vertical",
      met: !!intent.industry,
      value: intent.industry,
      critical: false,
      question: "Which industry or vertical are you selling into?",
      fallback: "inferred from the ICP description",
    },
    {
      id: "geography",
      label: "Geography",
      met: !!intent.geography,
      value: intent.geography,
      critical: false,
      question: "Which region(s) are you selling into?",
      fallback: "North America, English-language",
    },
  ];

  const critical = criteria.filter((c) => c.critical);
  const W = round2(critical.filter((c) => c.met).length / critical.length);
  const coverage = round2(criteria.filter((c) => c.met).length / criteria.length);
  const missing = critical.filter((c) => !c.met);
  const assumptions = criteria
    .filter((c) => !c.critical && !c.met && c.fallback)
    .map((c) => `${c.label}: assumed ${c.fallback}`);

  const offer = intent.offer ?? "[offer]";
  const icp = intent.icp ?? "[target buyer]";
  const outcome100 =
    intent.stage === "pre-launch"
      ? `Book first qualified discovery calls with ${icp} for ${offer} within 30 days of launch, with a repeatable sequence that converts ≥ 2% of contacted accounts to meetings.`
      : `A repeatable motion that turns ${icp} into booked meetings for ${offer}: ≥ 2% account-to-meeting conversion and a weekly activity scorecard the team actually runs.`;

  const foundation1 = `One complete, testable GTM slice: a sharp ICP for ${icp}, the message that earns a reply, and one sequence a rep can send today — measured on a scorecard.`;

  return {
    W,
    coverage,
    ready: W === 1,
    criteria,
    missing,
    assumptions,
    outcome100,
    foundation1,
    jtbd: buildJtbd(intent),
  };
}

export function buildJtbd(intent: Intent): Jtbd {
  const icp = intent.icp ?? "the target buyer";
  return {
    actor: icp,
    trigger: intent.stage === "scaling" ? "Pipeline targets grow faster than headcount" : "A visible pain becomes expensive enough to fix this quarter",
    struggle: "Too many options, no trusted proof, and no time to evaluate vendors",
    functionalJob: `Solve the core problem ${intent.offer ? `that ${intent.offer} addresses` : "the offer addresses"} with minimal switching cost`,
    emotionalJob: "Feel confident the decision will make them look smart internally",
    desiredOutcome: "Measurable improvement in the metric they are judged on, within one quarter",
    successMetric: "Meeting booked → qualified opportunity → closed-won within the target cycle",
  };
}

/** One focused clarification message — never a wall of questions. */
export function clarificationMessage(f: Foundation): string {
  const qs = f.missing.map((c, i) => `${i + 1}. **${c.label}** — ${c.question}`).join("\n");
  return [
    `I'm ready to build — I just need ${f.missing.length === 1 ? "one thing" : `${f.missing.length} things`} so the output is built on your real business, not guesses.`,
    "",
    qs,
    "",
    `_Foundation wholeness W = ${f.W.toFixed(2)}. I run the build at W = 1.00, so nothing gets multiplied on a shaky base._`,
  ].join("\n");
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
