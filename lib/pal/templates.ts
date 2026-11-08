import type { AssetKind, Foundation, Intent } from "./types";
import { ASSET_TITLES } from "./intent";

/**
 * Deterministic asset templates.
 *
 * Used (a) in demo mode when no model key is configured and (b) as the
 * required skeleton the LLM must fill, so output structure is guaranteed
 * regardless of which model runs. Every gap is an explicit [ASSUMPTION] or a
 * {{variable}} — never an invented fact.
 */

export interface TemplateCtx {
  intent: Intent;
  foundation: Foundation;
}

const v = (x: string | undefined, label: string) => x ?? `[ASSUMPTION: ${label}]`;

export function assetTemplate(kind: AssetKind, ctx: TemplateCtx): string {
  const { intent: i, foundation: f } = ctx;
  const offer = v(i.offer, "your offer");
  const icp = v(i.icp, "target buyer");
  const company = i.company ?? "{{your_company}}";
  const motion = i.motion ?? "outbound-led hybrid";
  const header = `# ${ASSET_TITLES[kind]}\n\n> **Offer:** ${offer} · **ICP:** ${icp} · **Motion:** ${motion}${
    f.assumptions.length ? `\n> **Assumptions:** ${f.assumptions.join("; ")}` : ""
  }\n`;

  switch (kind) {
    case "icp":
      return `${header}
## Segment
**${icp}** — one segment per ICP (never mix segments; ask for a separate ICP per vertical, size band or motion).

## Firmographics
| Attribute | Fit | Notes |
|---|---|---|
| Industry | ${v(i.industry, "industry")} | |
| Company size (employees / revenue) | [ASSUMPTION: 10–200 employees] | Validate against your best 5 customers |
| Geography | ${v(i.geography, "region")} | |
| Department / buyer role | {{buyer_role}} | Economic buyer + champion |
| Tech signals | {{tools_they_use}} | e.g. CRM, data stack |

## Primary pain points
1. The job ${offer} solves is done manually, slowly, or not at all.
2. {{pain_in_their_words}} — capture from calls, not guesses.

## Goals & KPIs
- The metric the buyer is judged on: {{buyer_kpi}}
- What "better" looks like in 90 days: {{target_outcome}}

## Buying triggers
1. New leader in the buying role (first 90 days).
2. Hiring for the role your product augments.
3. Funding, expansion, or a new market launch.

## Buying objections
- "We already have something for this." · "Not a priority this quarter." · Integration effort.

## Preferred channels & messaging tone
- Channels: {{email_linkedin_events}} · Tone: outcome-driven, specific, no jargon.

## Proof points
- {{case_study_or_metric}} *(only verified proof — never invented)*

## Qualification (MEDDIC-lite)
- **Metric** they'd move · **Economic buyer** identified · **Pain** confirmed in their words · **Timeline** this quarter.

## Disqualifiers (not a fit)
- No owner for the problem · budget frozen · mid-contract with a direct alternative (revisit at renewal).

## Account tiers
- **Tier 1:** perfect fit + active trigger → 1:1 personalised outreach.
- **Tier 2:** perfect fit, no trigger → signal-watch + light sequence.
- **Tier 3:** partial fit → nurture only.

## JSON (for CRM / Clay import)
\`\`\`json
${JSON.stringify({ segment_name: i.icp ?? "{{segment}}", industry: i.industry ?? "{{industry}}", company_size: "{{employees}}", geography: i.geography ?? "{{geo}}", buyer_role: "{{buyer_role}}", pain_points: ["{{pain_1}}"], goals_kpis: ["{{kpi_1}}"], buying_triggers: ["new leader", "hiring", "funding"], buying_objections: ["{{objection_1}}"], preferred_channels: ["Email", "LinkedIn"], messaging_tone: "outcome-driven" }, null, 2)}
\`\`\`
`;
    case "personas":
      return `${header}
## Persona 1 — Economic buyer
- **Role:** {{title}} at ${icp}
- **Goals:** hit the number they're measured on; look smart to leadership.
- **Pains:** limited headcount, tool sprawl, unclear ROI from current vendors.
- **Objections:** "We already have something for this." · "Not a priority this quarter."
- **What earns a reply:** a specific observation about *their* company + a quantified outcome.

## Persona 2 — Champion / daily user
- **Role:** {{team_lead_title}}
- **Goals:** save hours every week; less manual busywork.
- **Pains:** repetitive work, context switching, being blamed for misses.
- **Objections:** "Another tool to learn?" · "Will it work with our stack?"
- **What earns a reply:** a 2-minute demo of their exact workflow.

## Persona 3 — Technical evaluator
- **Goals:** security, integration effort, data ownership.
- **Objections:** "How does it handle our data?" — answer with your security one-pager.
`;
    case "positioning":
      return `${header}
## Positioning statement
For **${icp}** who struggle to ${f.jtbd.functionalJob.toLowerCase()}, **${offer}** is the ${v(i.industry, "category")} solution that delivers ${f.jtbd.desiredOutcome.toLowerCase()}. Unlike {{status_quo_or_competitor}}, we {{key_differentiator}}.

## Messaging hierarchy
1. **Headline:** {{outcome}} without {{painful_tradeoff}}.
2. **Pillar — Speed:** time-to-value in days, not quarters.
3. **Pillar — Precision:** built for ${icp}, not everyone.
4. **Pillar — Proof:** {{proof_point}} *(add a real metric or customer quote — never invent one)*.

## Why us / why now
- **Why us:** {{unfair_advantage}}
- **Why now:** ${f.jtbd.trigger.toLowerCase()}.

## Elevator pitch (30s)
"We help ${icp} ${f.jtbd.desiredOutcome.toLowerCase()}. Most teams try {{status_quo}}, which {{problem}}. ${company} {{how}} — so you get {{outcome}}."
`;
    case "email_sequence":
      return `${header}
Rules: under 80 words, one ask per email, lead with relevance not features. Variables: {{first_name}}, {{company}}, {{trigger}}, {{pain_point}}.

### Step 1 — Day 1
**Subject:** {{trigger}} at {{company}}
Hi {{first_name}} — saw {{trigger}}. Teams like {{company}} usually hit {{pain_point}} right after. We help ${icp} ${f.jtbd.desiredOutcome.toLowerCase()}. Worth a 15-min look next week?

### Step 2 — Day 3
**Subject:** re: {{trigger}}
{{first_name}}, one idea: {{specific_tactic}}. Happy to share how {{similar_company_type}} approached it — no pitch.

### Step 3 — Day 7
**Subject:** quick question
Is {{pain_point}} on your radar this quarter, or should I check back later?

### Step 4 — Day 12 (breakup)
**Subject:** closing the loop
Didn't want to clutter your inbox. If {{pain_point}} becomes a priority, reply "later" and I'll follow up in 90 days.
`;
    case "linkedin_dm":
      return `${header}
### Connection request (≤ 300 chars)
Hi {{first_name}} — following {{company}}'s {{trigger}}. I work with ${icp} on {{topic}}. Would be good to connect.

### Message 1 — after accept
Thanks for connecting! Curious — how is your team handling {{pain_point}} today?

### Message 2 — value (day 4)
Put together a short teardown on {{topic}} for ${icp}. Want me to send it?

### Message 3 — soft ask (day 9)
If it's useful, happy to walk through how {{similar_company_type}} solved it — 15 min?
`;
    case "call_script":
      return `${header}
## Opener (permission-based)
"Hi {{first_name}}, it's {{rep}} from ${company}. I know I'm calling out of the blue — can I take 30 seconds to tell you why, and you decide if it's worth continuing?"

## Reason for the call
"We work with ${icp}. Usually when we speak to {{title}}s they mention {{pain_point}}. Is that true for you, or not really?"

## Discovery questions
1. How are you handling {{job}} today?
2. What happens if nothing changes this quarter?
3. Who else feels this pain?
4. What would a great outcome look like in 90 days?

## Close for the meeting
"Based on that, a 20-minute walkthrough would be worth it. How's {{day}} at {{time}}?"

## Voicemail (≤ 20s)
"{{first_name}}, {{rep}} from ${company} — re {{trigger}}. Sending a short email with the idea. Talk soon."
`;
    case "battlecard":
      return `${header}
## Competitors
${(i.competitors.length ? i.competitors : ["{{competitor}}"]).map((c) => `- ${c}`).join("\n")}

## Where we win
- Focus on ${icp} · faster time-to-value · {{differentiator}}

## Where we lose (be honest)
- {{their_strength}} — reframe around total cost and time-to-value.

## Landmine questions (plant early)
1. "How long until your team saw value with your last tool?"
2. "Who maintains the workflows after go-live?"

## Trap-setting proof
- {{case_study_or_metric}} *(verified only)*
`;
    case "objection_handling":
      return `${header}
Framework: **Acknowledge → Clarify → Reframe → Confirm**.

| Objection | Clarify | Reframe |
|---|---|---|
| "We already have a tool." | "What do you like about it — and what's missing?" | We complement / replace where it falls short on {{gap}}. |
| "No budget." | "Is it budget or priority?" | Cost of inaction: {{cost_of_problem}} per month. |
| "Send me info." | "Happy to — what should it answer?" | Book 15 min to tailor it instead. |
| "Not now." | "What changes in 90 days?" | Agree a dated follow-up tied to their trigger. |
`;
    case "kpi_scorecard":
      return `${header}
## North star metric
**Qualified meetings booked per week** → leading indicator of pipeline.

## Metric tree
- Accounts contacted → reply rate → positive reply rate → meetings booked → opportunities → closed-won

## Weekly activity targets (per rep)
| Activity | Target | Why |
|---|---|---|
| New accounts researched | 50 | Tier 1 + 2 only |
| Emails sent (personalised) | 150 | Sequence steps 1–4 |
| LinkedIn touches | 75 | Connection + DM |
| Calls | 100 | Tier 1 priority |
| Meetings booked | 5 | ≥ 2% account→meeting |

## Review cadence
Monday target-setting · Friday scorecard review · monthly ICP refresh.
`;
    case "gtm_playbook":
      return `${header}
## 1. Who we sell to
See ICP + Personas. Work Tier 1 accounts first.

## 2. Daily cadence
- 08:30 research 10 Tier-1 accounts · 09:30 calls · 11:00 personalised emails · 14:00 LinkedIn · 16:00 CRM hygiene

## 3. Weekly cadence
Monday pipeline review · Wednesday messaging test review · Friday scorecard.

## 4. Qualification
MEDDIC-lite: Metric, Economic buyer, Decision process, Identified pain, Champion. Only advance stage with evidence.

## 5. Stage definitions
| Stage | Exit criteria |
|---|---|
| Meeting booked | Calendar accepted |
| Discovery done | Pain + metric confirmed |
| Proposal | Economic buyer engaged |
| Closed | Signed |

## 6. Tools
CRM {{crm}} · data {{data_provider}} · sequencing {{sequencer}} · automation n8n/Make (approval-gated).
`;
    case "launch_plan":
      return `${header}
## Phase 1 — Week 0–2: Ready
Finalise positioning, build lists (Tier 1), warm domains, prepare launch assets.

## Phase 2 — Week 3–4: Launch
Announce, run outbound sequence to Tier 1, founder posts, partner emails.

## Phase 3 — Week 5–8: Learn
Review reply/meeting rates weekly; iterate the message, not the volume.

## Milestones
- ${f.outcome100}
`;
    case "prospecting_plan":
      return `${header}
## Buying signals (hypotheses until observed)
| Signal | Observable event | Falsifier |
|---|---|---|
| Leadership change | New {{buyer_title}} in last 90 days | Role unchanged > 1 yr |
| Hiring | Open roles for {{role}} | No open roles |
| Funding | Round announced in last 6 months | No public round |

## Sources (permitted only)
Company sites, press releases, job boards, public filings. No LinkedIn scraping, no paywall bypass.

## Limits & budget
Default cap: 10 companies · 2 contacts each · no paid spend [ASSUMPTION: free tools only] · ≤ 60 searches · verification requires explicit approval.

## Output
Scored lead list (evidence per lead) → review → CRM import only after approval.
`;
    case "use_cases":
      return `${header}
Format per use case: **who → trigger → before → after → outcome → proof**. One persona per use case.

## Use case 1 — ${f.jtbd.functionalJob}
- **Who:** ${icp}, {{buyer_role}}
- **Trigger:** ${f.jtbd.trigger}
- **Before:** ${f.jtbd.struggle}
- **After:** ${offer} handles {{job_step}} automatically
- **Outcome:** ${f.jtbd.desiredOutcome}
- **Proof:** {{customer_story_or_metric}}

## Use case 2 — {{secondary_job}}
- **Who:** {{champion_role}} · **Trigger:** {{event}} · **Outcome:** {{outcome}}

## Use case 3 — {{expansion_job}}
- **Who:** {{adjacent_team}} · **Trigger:** {{event}} · **Outcome:** {{outcome}}

## How sales uses this
Pick the use case that matches the prospect's trigger; lead the first email with its *Before → After*.
`;
    case "sales_ops_plan":
      return `${header}
Six steps from zero to a running revenue engine. Each step has an owner and a done-when.

## 1. Sales playbook
Brand identity, USPs and target customers (ICP) · sales goals, KPIs and activity metrics · the processes, platforms and people in the funnel. **Done when:** the playbook is approved.

## 2. Sales messaging
Scripts for email, phone, SMS and social DMs · assets for presentations, case studies, pricing · SOPs for internal/external use. **Done when:** every channel has an approved script.

## 3. Prospect data
Lead-gen system (Clay / Apollo / permitted APIs) · contacts for each ICP tier · AI research insights per company. **Done when:** Tier-1 list is built and suppression-screened.

## 4. Email DNS & deliverability
- Use a **separate sending domain or subdomain** — never your primary domain.
- Configure **SPF**, **DKIM** and **DMARC** (start DMARC at \`p=none\` with reporting, tighten later).
- **Warm up** each new mailbox for 2–4 weeks; keep cold volume low per mailbox [ASSUMPTION: ≤ 30/day].
**Done when:** SPF/DKIM/DMARC pass on a test send and warm-up is complete.

## 5. CRM setup
Select or integrate a CRM ({{crm}}) · define objects (accounts, contacts, deals) and properties · connect email, import contacts, upload templates. **Done when:** a test lead flows from import → deal stage.

## 6. Automation system
Sequencer ({{sequencer}}) · channels and sequence steps · CRM sync + reporting dashboard · n8n/Make for glue — every send and CRM write **approval-gated**. **Done when:** one sequence runs end to end with activity logged to the CRM.

## Owners & timeline
| Step | Owner | Week |
|---|---|---|
| Playbook + messaging | {{gtm_lead}} | 1 |
| Prospect data + DNS | {{ops_owner}} | 1–2 |
| CRM + automation | {{ops_owner}} | 2–3 |
| Warm-up complete → launch | {{gtm_lead}} | 4 |
`;
    case "automation_blueprint":
      return `${header}
## Trigger
Webhook from the Enably Architect (\`run.completed\`) or a new CRM record.

## Flow
1. **Normalize** payload → 2. **Enrich** (Clay / HTTP Request) → 3. **Score** vs ICP → 4. **Draft** outreach with the approved sequence → 5. **Human approval** step → 6. **Send / CRM write** → 7. **Log** to the run manifest.

## Guardrails
- Human approval before any send or CRM write.
- Secrets in n8n credentials, never in workflow JSON.
- Error workflow + retries with idempotency key \`{run_id}:{step}\`.

## Starter workflows
See \`agent/workflows/\` (account research copilot, outbound personalization gateway, deal acceleration orchestrator, MCP server skeleton).
`;
  }
}
