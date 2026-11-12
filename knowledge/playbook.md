# Loadsmart Sales Playbook: Hybrid AE/SDR Pod (ABM)

As of November 11, 2026 · Based on Patrick Diamitani's Loadsmart Sales Motion Workflow and prospect automation methodology.

This playbook runs one hybrid motion. Claude automates the daily path from signal to sequence for 20 accounts per AE/SDR pod. The pod keeps account vetting, phone calls and LinkedIn multi-threading. Every section says what it is built from, so nothing here is invented.

**Status key:** Ready = backed by a source named in the section. Baseline = drafted from the sources with labeled assumptions to validate. Needs input = Loadsmart must supply facts before use.

| # | Section | Status |
|---|---|---|
| 1 | Introduction | Ready |
| 2 | Company overview | Ready |
| 3 | Market landscape | Baseline |
| 4 | ICP profiles | Baseline |
| 5 | Buyer personas | Baseline |
| 6 | Value proposition and USP | Baseline |
| 7 | Messaging framework | Baseline |
| 8 | Use cases by persona | Baseline |
| 9 | Proof points and case studies | Needs input |
| 10 | Competitive landscape | Needs input |
| 11 | Battlecards | Needs input |
| 12 | Objection handling | Baseline |
| 13 | Qualification | Baseline |
| 14 | Discovery call guide | Baseline |
| 15 | Demo flow | Baseline |
| 16 | Email templates | Ready |
| 17 | LinkedIn and DM templates | Baseline |
| 18 | Call scripts and openers | Baseline |
| 19 | Cadences and sequences | Baseline |
| 20 | KPIs and activity metrics | Ready |
| 21 | Sales process map with exit criteria | Baseline |
| 22 | CRM usage guidelines | Baseline |
| 23 | Tech stack and tools | Ready |
| 24 | Reporting and dashboards | Ready |
| 25 | Best practices, diagnosis and rollout | Baseline |
| 26 | Multi-mailbox sending (addendum) | Baseline |
| 27 | Deterministic orchestration with n8n or Make (addendum) | Baseline |
| 28 | The daily block: calls and target accounts (addendum) | Baseline |
| 29 | Voicemail drop (addendum) | Needs input |
| 30 | One-time CRM audit and ICP scoring (addendum) | Ready |
| 31 | Credit and token budget (addendum) | Ready |

---

## 1. Introduction

**Why this exists.** Pods lose time on research and list building, and the program has no documented ICP, no persona source document and no reporting. This playbook fixes those three gaps and puts the daily process on a schedule.

**Who it is for.** Loadsmart AEs and SDRs working in pods. Each pod holds 20 assigned accounts.

**How to use it.** SDRs read sections 4 to 8 and 16 to 19 first. AEs read 12 to 15 and 21 next. Leaders read 20, 24 and 25. Sections 26 to 31 are the scale-up addendum (mailboxes, orchestration, daily block, voicemail drop, CRM audit, budgets) and change sections 19, 20, 23 and 25. The same content powers the `loadsmart-gtm` skills, so a rep can ask the pod agent for any section in context.

**Operating rules.**
1. Nothing is invented. Missing facts stay as `[placeholders]`.
2. Drafting is free. Sends, CRM writes and credit spend need approval for that batch.
3. Pods can disqualify any nominated account. Claude cannot override that.
4. Only claims from the approved claims library go into outbound.

**Sources.** Loadsmart Sales Motion Workflow (P. Diamitani, Nov 2026); Prospect Automation Engine overview (P. Diamitani); loadsmart.com and the Oct 20, 2026 Loadsmart AI press release (retrieved Nov 11, 2026).

---

## 2. Company overview

**Status: Ready (public sources, company-reported where noted).**

Loadsmart is a Chicago-based freight technology company, founded in 2014. It sells one connected platform that covers the freight lifecycle for enterprise shippers.

| Product | What it does |
|---|---|
| ShipperGuide (TMS) | Planning, procurement and execution of freight |
| Opendock (dock, gate, yard) | Dock appointment scheduling, gate and yard management |
| Loadsmart AI | Eleven AI agents that finish repetitive freight and warehouse tasks inside the shipper's existing systems |
| Freight services | Brokerage (FTL, LTL, partial truckload, expedited, drayage, multimodal), managed transportation, private fleet optimization |
| Carrier side | Loadboard, CarrierGuide, factoring (separate buyers, separate motion) |

**Company-reported scale (loadsmart.com, Nov 11, 2026):** 1,800 global customers, 4,500 warehouses on the network, 230,000 vetted carriers, 14M+ dock appointments a year, SOC 2 Type II. Verify before external use.

**Positioning.** Loadsmart AI handles the repetitive work and human Freight Experts resolve exceptions. The company says it is the only freight company selling both the AI and the operators behind it (Oct 20, 2026 release).

**Leadership (public):** Felipe Capella, CEO; Geoff Kelley, COO; Paul Rehmet, VP Product Management.

---

## 3. Market landscape

**Status: Baseline. Market sizing: Needs input.**

Loadsmart competes in four overlapping categories. Names below come from public analyst listings and partner announcements. Each needs a verified, dated source before it appears in a battlecard.

| Category | Examples seen in public sources | Loadsmart product in play |
|---|---|---|
| Transportation management (TMS) | Oracle, SAP, Manhattan Associates, MercuryGate (CB Insights lists Loadsmart as a challenger among these) | ShipperGuide |
| Dock scheduling and yard management | [verify competitors] | Opendock |
| Digital and traditional freight brokerage | [verify competitors] | Brokerage, managed transportation |
| AI agents for logistics operations | [verify competitors] | Loadsmart AI |

**Assumption to validate:** Loadsmart AI runs on top of existing TMS, WMS, YMS and ERP systems, so incumbents are often partners and buyers' systems of record, not only rivals. Confirm with Loadsmart's competitive loss notes.

---

## 4. ICP profiles

**Status: Baseline. One segment per ICP. Confirm every field against Salesforce closed-won data.**

**How Claude picks accounts today (from the workflow).** Claude nominates 20 accounts per pod from a cross-analysis of closed-won opportunities and target industries with high customer count and spend.

**What is not yet documented (and must be before scaling).** Where the nomination data comes from (CRM only, or CRM plus outside data), how "like company A" is measured, and the exact prompt. The ICP spec in `loadsmart-icp-signal/references/icp-spec-template.md` captures all three.

**ICP shell (copy per product).**

```
ICP: [Product] x [segment]            Depth: Standard    Date: [YYYY-MM-DD]
Industry / sub-vertical:              [from closed-won + target industries]
Company size:                         [employees range] / [revenue range]
Freight profile:                      [modes, annual transportation spend range, facilities count]
Geography:                            [regions]
Systems in place:                     [TMS / WMS / YMS / ERP, from ZoomInfo technographics]
Primary pains:                        [3, specific to this segment]
Buying triggers (observable):         [2+]
Disqualifiers:                        [existing customer, open opp, recent closed-lost, carrier, do-not-contact]
Proof points:                         [approved only]
```

**Starting hypotheses by product (Assumption, validate by backtest).**

| Product | Hypothesis: who looks like a fit | Observable signals to test |
|---|---|---|
| Opendock | Shippers and distributors running multiple warehouses or DCs with heavy inbound and outbound truck traffic | New or expanded DC, hiring for dock/yard/warehouse operations, leadership change in distribution |
| ShipperGuide | Shippers with meaningful truckload spend and a legacy or manual TMS process | Hiring for transportation analysts or procurement, freight-cost commentary in filings, supply-chain leadership change |
| Loadsmart AI | Enterprise shippers with a TMS, WMS, YMS or ERP already in place and a large volume of repetitive follow-up work | Existing stack (technographic), automation or AI initiatives, hiring for logistics coordinators or customer service in transportation |

**Public customer logos suggest which industries to test first** (food and agriculture, consumer goods, chemicals and coatings, healthcare distribution, energy, industrial). Treat that as a prompt to check Loadsmart's own customer count and spend by industry, not as the ICP.

**Backtest before trusting any ICP.** Score the last `[N]` closed-won and `[N]` closed-lost opportunities with the rubric in `loadsmart-icp-signal/references/scoring-rubric.md`. If the rubric cannot separate wins from losses, fix the ICP before Claude nominates anything.

---

## 5. Buyer personas

**Status: Baseline. Built from job function, not from interviews. Replace with Gong-sourced language once transcripts are reviewed.**

One role per persona. Each product on the GTM diagram has its own buyer persona.

| Product | Role | Decision role | Cares most about (Assumption) |
|---|---|---|---|
| Opendock | Director of Distribution or Logistics | Decision-maker | Throughput, dwell time, detention cost |
| Opendock | Warehouse or DC Operations Manager | Champion | Dock congestion, no-shows, labor planning |
| Opendock | Dock or Yard Supervisor | User | Day-to-day dock and yard moves |
| ShipperGuide | VP or Director of Supply Chain | Decision-maker | Freight cost, service levels, visibility |
| ShipperGuide | Transportation or Logistics Manager | Champion and user | Planning and booking effort, tender failures |
| ShipperGuide | Freight Procurement Lead | Influencer | Rates, carrier coverage, procurement process |
| Loadsmart AI | VP or Director of Supply Chain Operations | Decision-maker | Cost per task, completion speed, risk |
| Loadsmart AI | Transportation or Customer Service Manager | Champion and user | Repetitive follow-up, exceptions, claims |
| All three | IT or Systems Owner | Blocker | Integration with TMS, WMS, YMS, ERP; security review |

**Persona comparison (the three decision-makers).**

| Attribute | Opendock: Dir. Distribution | ShipperGuide: VP Supply Chain | Loadsmart AI: VP Supply Chain Ops |
|---|---|---|---|
| Top KPI | Dwell time, detention | Freight cost, service level | Cost and time per task |
| Top pain | Trucks waiting, missed appointments | Manual planning and tender failures | Repetitive follow-up eating team hours |
| Top trigger | New DC, volume spike | Cost pressure, leadership change | Automation mandate, headcount limits |
| Biggest objection | "Our carriers won't use it" | "We already have a TMS" | "AI will hurt carrier relationships" |
| Best channel | Calls, LinkedIn, events | Email, LinkedIn | Email, peer references |
| Opening angle | Time at the dock door | Cost and control | Hours back to the team |

**Voice of customer.** None is included. Pull verbatim pains and objections from Gong transcripts of closed-won and closed-lost calls and tag each with its call ID.

---

## 6. Value proposition and USP

**Status: Baseline. Statements are Loadsmart's own claims, not independently verified.**

**One-line positioning (from public copy):** One connected platform where AI does the repetitive freight work and Freight Experts resolve the exceptions, so shippers get outcomes instead of more software to manage.

**Differentiators to lead with (company-stated):**
1. One platform across TMS, dock/gate/yard and AI execution, not an AI layer bolted onto a single tool.
2. Agents work inside the shipper's existing systems rather than replacing them.
3. People stand behind the AI: Freight Experts handle what the agents cannot.
4. Low-risk start: a demo on the shipper's own freight and a free proof of concept (company-stated).

**Company-reported results (do not use in outbound until Loadsmart marketing approves each one):** agents complete 70% to 90% of tasks autonomously depending on workflow; 83% lower cost per task; 80% faster completion.

**Angles for A/B testing, per persona:** speed (time back), cost (spend and fees), confidence (exceptions handled by people).

---

## 7. Messaging framework

**Status: Baseline.**

| Product | Pain | Value | Proof | CTA |
|---|---|---|---|---|
| Opendock | Trucks wait, appointments are missed, detention accrues | One scheduling system for dock, gate and yard | `[approved customer result]` | 15-minute look at your dock flow |
| ShipperGuide | Planning and tendering take manual effort | Plan, procure and execute freight in one place | `[approved customer result]` | 15-minute look at your freight process |
| Loadsmart AI | Teams spend hours on repetitive follow-up | An agent finishes the task end to end inside your systems | `[approved customer result]` | Pick one workflow, see it on your own freight |

**Rule: the AI writes the body only.** The email wrapper is fixed, which protects CRM templates, keeps rep signatures consistent and makes first lines easy to A/B test:

```
Hi {{first_name}},

{{ai_email_1_body}}

Best,
{{signature}}
```

---

## 8. Use cases by persona

**Status: Baseline. Outcomes are placeholders until approved proof exists.**

The eleven Loadsmart AI agents map to the people who feel the pain. "Feels it" is a hypothesis.

| Agent | Pain it removes | Feels it | Outcome statement |
|---|---|---|---|
| Purchase order follow-up | POs without a dock appointment, or a booking that will arrive late | Transportation Manager | `[approved outcome]` |
| Scheduling | Manual appointment back-and-forth | Warehouse Ops Manager | `[approved outcome]` |
| Tracking and status updates | Chasing carriers for status | Transportation Manager | `[approved outcome]` |
| Document collection | Missing paperwork | Transportation Manager | `[approved outcome]` |
| Tender failures | Loads rejected by carriers | Transportation Manager | `[approved outcome]` |
| Load audits | Invoice and load errors | Freight Procurement Lead | `[approved outcome]` |
| Claims | Slow claims handling | Transportation Manager | `[approved outcome]` |
| Detention handling | Trucks exceed free time, disputes | Warehouse Ops Manager | `[approved outcome]` |
| Dock door management | Late arrivals, no-shows, door closures | Dock Supervisor | `[approved outcome]` |
| Yard task orchestration | Unordered yard moves and checks | Yard Supervisor | `[approved outcome]` |
| Warehouse customer service | Calls and emails about arrivals and ship dates | Customer Service Manager | `[approved outcome]` |

---

## 9. Proof points and case studies

**Status: Needs input. Nothing below is a result. Every line is a slot Loadsmart fills with an approved, dated, sourced claim.**

Public pages name customers, but this playbook does not copy numbers from them into outbound. Marketing and legal approve each claim first, then it goes into the claims library at `loadsmart-email-body/references/claims-library.md`.

| ID | Product | Segment | Claim (approved wording) | Source and date | Approved by | OK for cold email? |
|---|---|---|---|---|---|---|
| C-001 | `[product]` | `[segment]` | `[result with number and timeframe]` | `[case study URL, date]` | `[name]` | `[Y/N]` |
| C-002 | `[product]` | `[segment]` | `[result]` | `[source]` | `[name]` | `[Y/N]` |
| C-003 | `[product]` | `[segment]` | `[result]` | `[source]` | `[name]` | `[Y/N]` |

**Case study shell (one per approved customer).**

```
Customer:        [name, or "a [industry] shipper" if anonymous]
Segment:         [one segment]
Product(s):      [one or more]
Before:          [specific starting problem, with a number if approved]
What changed:    [what Loadsmart did, in one sentence]
After:           [result, number, timeframe]
Quote:           [verbatim, with name and title, or none]
Approved by:     [name, date]
```

**Rules.** No claim without an ID. No claim older than `[N]` months without a refresh. Company-reported platform numbers (section 2 and 6) stay out of cold email until each has its own ID.

---

## 10. Competitive landscape

**Status: Needs input.** Competitor names in section 3 come from public listings. Nothing here is verified against Loadsmart's deal history.

| Competitor | Category | Seen in deals? | Why we win (evidence) | Why we lose (evidence) | Last verified |
|---|---|---|---|---|---|
| `[name]` | `[TMS / dock / broker / AI]` | `[Y/N, count from Salesforce]` | `[from closed-won notes or Gong]` | `[from closed-lost notes or Gong]` | `[date]` |

**How to fill it.** Run closed-won and closed-lost opportunities from the last `[N]` months through the closed-won and closed-lost backtest in `loadsmart-pod-reporting/references/diagnosis.md`, and record the competitor named in each. Competitors with fewer than `[N]` deals stay "watch only".

**Status quo is a competitor.** For each product, expect the buyer to say "we do this in spreadsheets, email and phone." The honest comparison is the cost of that manual work against the product. Quantify it with the buyer's own numbers on discovery (section 14).

---

## 11. Battlecards

**Status: Needs input. One card per competitor from section 10. One shell, filled from evidence only.**

```
BATTLECARD: [Competitor]            Product in play: [Opendock / ShipperGuide / Loadsmart AI]
Verified: [date]                    Owner: [name]

Their pitch (their words, sourced):   [one line + URL]
Where they are strong (be honest):    [2 points]
Where they struggle (evidence):       [2 points, each with source]
Landmine questions to ask early:      [3, open-ended, not leading]
Trap setters (what to avoid):         [what they say about us, and the factual reply]
Proof to use:                         [claim IDs from section 9]
Do not say:                           [anything unverifiable or disparaging]
```

**Rule.** Never state a competitor's price, feature gap or customer count unless a dated source is on the card.

---

## 12. Objection handling

**Status: Baseline. Replace the "evidence" column with Gong call IDs as transcripts are reviewed.**

Format for every objection: acknowledge, ask one question, answer from approved proof, propose a small next step.

| Objection | Likely persona | Acknowledge | Question to ask | Answer from | Next step |
|---|---|---|---|---|---|
| "We already have a TMS." | VP/Dir. Supply Chain | "Makes sense, most shippers do." | "Which tasks around it still run through email, phone or spreadsheets?" | Agents work inside existing systems (company-stated); `[claim ID]` | 15-minute workflow review |
| "Our carriers won't use a new tool." | Dir. Distribution, Warehouse Ops | "Carrier adoption decides whether this works." | "How many of your carriers already book through any portal today?" | `[claim ID on carrier adoption]` | Walk through the carrier experience |
| "AI will hurt carrier relationships." | VP Supply Chain Ops | "That is a fair worry." | "Which interactions do you want a person to own?" | People handle exceptions (company-stated) | Show exception path on their freight |
| "We don't have budget." | Any | "Understood." | "What does the manual version cost you today in hours?" | Cost-per-task discovery numbers | Quantify together, revisit |
| "Send me information." | Any | "Happy to." | "What would make it useful, a use case or a price view?" | Matching one-pager `[asset ID]` | Book 15 minutes to review |
| "We're not looking right now." | Any | "Thanks for being direct." | "Is it timing, or is this not a priority?" | None | Set follow-up for trigger event |
| "Security and IT review will take too long." | IT or Systems Owner | "That review matters." | "What does your review need first?" | SOC 2 Type II (company-reported, verify) | Offer IT-only session |
| "Is this really AI or just outsourcing?" | VP Supply Chain Ops | "Fair question." | "What would you need to see to trust it?" | Agents plus Freight Experts (company-stated) | Demo on their own freight |

**Rule.** Never argue. After the answer, ask one question and stop.

---

## 13. Qualification

**Status: Baseline.**

**SDR qualification (BANT-lite), to book a meeting for the AE:**

| Check | Question | Pass looks like |
|---|---|---|
| Fit | Matches the account's ICP and the persona is in the right role | Role and company confirmed on Salesforce |
| Pain | "What is hardest about [dock flow / planning / repetitive follow-up] today?" | A named, specific pain in their words |
| Authority | "Who else decides or has a say?" | At least one other role named |
| Timing | "Is there a project or date driving this?" | A trigger or date, or "none" recorded honestly |

**AE qualification (MEDDICC):**

| Letter | Capture | Record in |
|---|---|---|
| Metrics | Hours, dollars or delay the buyer says it costs, in their own words | Opp field `[confirm]` |
| Economic buyer | Name and title | Contact role |
| Decision criteria | What they will score vendors on | Opp notes |
| Decision process | Steps, approvers, IT/security review, procurement | Opp notes |
| Identify pain | Top pain tied to a metric | Opp notes |
| Champion | Name, why they care, access to power | Contact role |
| Competition | Incumbent, status quo, named rival | Opp field `[confirm]` |

**Disqualify (pod decision, recorded with a reason):** wrong segment, existing customer on the same product, open opportunity, active do-not-contact, carrier-side lead, no relevant freight. The pod can disqualify any Claude-nominated account at any time.

---

## 14. Discovery call guide

**Status: Baseline.** Goal: understand the buyer's freight workflow well enough to quantify the pain before anything is shown.

**Open (60 seconds).** Purpose, agenda, time check, "Is there anything you want to cover that I missed?"

**Questions by product (pick 5 to 7, never all).**

| Product | Questions |
|---|---|
| Opendock | How are dock appointments set today? How many facilities and doors? What happens when a truck is early, late or does not show? How do you track dwell and detention? Who owns the schedule? |
| ShipperGuide | How do you plan and tender loads today? Which systems are involved? What share of loads get rejected or rebooked? How do you pick carriers? Who reviews rates? |
| Loadsmart AI | Which follow-ups does your team repeat daily? Which system do they live in? How long does one take? How many a week? What happens when it is missed? |
| All | Who else is involved in a change like this? What did you try before? What has to be true for this to be a priority this quarter? |

**Quantify.** Ask for count, time and cost per instance. Record the buyer's numbers, not yours.

**Close.** Summarize in their words, name the next step with a date, confirm the people to include.

**After the call.** Log metrics, pain, champion and next step (section 22). Gong summary is a draft, not the record.

---

## 15. Demo flow

**Status: Baseline.** Show the product on the prospect's own freight, never a generic walkthrough (company-stated offer: demo on your freight; free proof of concept, confirm terms before promising).

1. Recap the three pains they gave you, in their words.
2. Show the one workflow that fixes the top pain.
3. Show the exception path: what the agent or system does when it cannot finish, and who picks it up.
4. Show where it plugs into their existing systems. Name the systems they gave you.
5. Ask what is missing for them to want a proof of concept.
6. Agree the next step, owner and date.

**Do not show:** features unrelated to the stated pains, unapproved metrics, anything labeled roadmap unless the AE has confirmed with Product.

---

## 16. Email templates

**Status: Ready (structure). Claims: placeholders until section 9 is filled.**

**Wrapper (fixed, not written by Claude):**

```
Hi {{first_name}},

{{ai_email_1_body}}

Best,
{{signature}}
```

**Body rules:** 60 to 90 words. One pain, one value, one proof or no proof, one question. Subject under 50 characters, set in the sequence. Opens with a verified signal about the account, not a compliment. No attachments. No claims outside the library. Unsubscribe and address handled by the sequencing tool.

**Day 1 body, Opendock (example shell).**

> Saw `[verified signal: e.g. new distribution center in region]`. When a site like that scales up, dock appointments, early arrivals and no-shows usually get managed by email and phone. Opendock puts scheduling, gate and yard in one place. `[approved proof claim, or omit]`. Worth a 15-minute look at how your dock flow runs today?

**Day 4 body (follow-up, new angle, no "bumping").**

> One more angle on `[Company]`: `[second verified signal or a persona-specific cost]`. If it helps, I can show it on a day of your own inbound freight. Who owns dock scheduling there?

**Day 1 body, ShipperGuide.**

> `[verified signal]`. Teams at that stage often plan and tender loads across several tools. ShipperGuide covers planning, procurement and execution in one TMS. `[approved proof, or omit]`. Open to comparing it with how you tender loads now?

**Day 1 body, Loadsmart AI.**

> `[verified signal]`. Most logistics teams have repetitive follow-up that eats hours: purchase order chasing, appointment confirmations, status updates. Loadsmart AI agents do those inside the systems you already run, and a Freight Expert handles anything an agent cannot. Which of those eats the most time for your team?

**Subject line options (test one variable at a time):** `[Company] dock scheduling`, `Quick question on [Company] freight`, `Freight follow-up work at [Company]`.

**Stop rules.** Stop the sequence on reply, bounce, unsubscribe, meeting booked or disqualification.

---

## 17. LinkedIn and DM templates

**Status: Baseline. Manual track: the pod sends these by hand (per the workflow). Connection notes are under 200 characters; the count is shown on each.**

**Connection notes (no links, no pitch).**

| Persona | Note | Chars |
|---|---|---|
| Dir. Distribution (Opendock) | Hi [First Name], I work with distribution teams on dock and yard scheduling. Saw [Company] [verified signal]. Glad to connect. | 126 |
| Transportation Mgr (ShipperGuide) | Hi [First Name], I talk with transportation teams about how they plan and tender freight. Would be good to connect. | 115 |
| VP Supply Chain Ops (Loadsmart AI) | Hi [First Name], I follow how logistics teams handle repetitive follow-up work. Thought your role at [Company] was worth connecting on. | 135 |

Counts include the placeholder text as written. Recount after substituting real values and keep each note at or under 200.

**Follow-up DM after they accept (one ask, no deck).**

> Thanks for connecting, [First Name]. Quick question: how does your team handle [pain in one phrase] today? Asking because [verified reason]. No pitch, just trying to learn how others do it.

**Second DM (7 days later, only if no reply).**

> [First Name], one more angle. [One-line, verified insight relevant to their role]. If it is useful, I can share how a few teams approach it. Worth a quick chat?

**Rules.** One persona per message. No links in the first two touches. Log the touch in Salesforce so Claude and the pod see the same history.

---

## 18. Call scripts and openers

**Status: Baseline. Calls are on the manual track.**

**Cold opener (permission-based, 20 seconds).**

> "Hi [First Name], it's [Rep] at Loadsmart. I know I'm calling out of the blue. Can I take 30 seconds to say why, and you tell me if it's worth a conversation?"

If yes:

> "We help [persona type] teams with [one pain: dock scheduling / load planning / repetitive follow-up]. I saw [verified signal] and wondered how you're handling that today."

**Voicemail (under 20 seconds).**

> "Hi [First Name], [Rep] at Loadsmart. I'm reaching out about [one pain] at [Company]. I'll send a short email too. My number is [number]."

**Gatekeeper.**

> "Hi, I'm trying to reach [First Name] about [topic]. Who handles [dock scheduling / transportation planning] there?"

**After a call:** log disposition and one line on what was said. If they asked to be removed, set do-not-contact the same day.

---

## 19. Cadences and sequences

**Status: Baseline. Recommendation, not a proven benchmark. Test one variable at a time.**

Per workflow, email is the automated track (Claude writes the body, the sequence tool sends). Calls and LinkedIn are manual. A coordinated cadence:

| Day | Channel | Owner | Content |
|---|---|---|---|
| 1 | Email 1 | Automated | Body from section 16 |
| 2 | LinkedIn connect | Pod (manual) | Note from section 17 |
| 3 | Call | Pod (manual) | Opener from section 18; voicemail drop if enabled (section 29) |
| 4 | Email 2 | Automated | New angle |
| 7 | LinkedIn DM | Pod (manual) | Follow-up DM |
| 9 | Call | Pod (manual) | Second attempt, voicemail |
| 12 | Email 3 | Automated | Break-up style, low pressure |

**Stop rules.** Reply, bounce, unsubscribe, meeting booked, disqualified, or a duplicate lead already in an active sequence (dedupe shield).

**Throttle.** Conservative daily cap per sender, spread through the day. Value `[N]` set by the pod and email ops, not by Claude. With several mailboxes per rep, each mailbox has its own cap (section 26).

---

## 20. KPIs and activity metrics

**Status: Ready as a measurement design. No targets are set because there is no baseline yet.**

The program has no reporting today. Measure first, set targets after four weeks of data.

| Team KPI | Outcome metric | Leading activity metrics | Definition | Source | Cadence | Owner |
|---|---|---|---|---|---|---|
| Pipeline from ABM | Meetings booked from nominated accounts | Accounts touched, contacts enriched, emails sent | Meeting with ABM Account = True | Salesforce | Weekly | Pod lead |
| Nomination quality | Share of nominated accounts the pod accepts | Disqualified count by reason | Accepted divided by nominated | Salesforce | Weekly | Pod lead |
| Email performance | Reply rate, positive reply rate | Delivered, bounced, unsubscribed | Replies divided by delivered | Sequence tool or Gong | Weekly | SDR |
| Conversion | Meeting to opportunity rate | Held vs no-show | Held meetings that became opps | Salesforce | Monthly | AE |
| Cycle health | Opp stage progression and age | Next-step dates set | Days in stage | Salesforce | Weekly | AE |

**Rules.** No vanity metrics (emails sent alone is not a goal). Every metric has one owner. Show sample size next to any rate. Report "no data" instead of zero when a field is not captured.

Mailbox, call, voicemail and cost metrics are in Appendix D.

**Control cohort.** Keep a small share of comparable non-nominated accounts untouched by the Claude flow so results can be compared fairly (see Appendix A).

---

## 21. Sales process map with exit criteria

**Status: Baseline. Stage names are program states, not Salesforce stages. Map them to real opportunity stages with Loadsmart.**

| State | Entry | Exit criteria (all required) | Owner | Disposition if stuck |
|---|---|---|---|---|
| Nominated | Claude adds account, ABM Account = True | Pod accepts or disqualifies, reason logged | Pod | Auto-flag after `[N]` days |
| Signal ready | Account accepted | At least one verified signal logged, source recorded | Claude | Parked, no signal |
| Enriched | Signal ready | Contacts matched to ICP personas, emails verified, suppression and dedupe passed | Claude | Parked, contacts unverified |
| Researched | Enriched | Account brief with sourced facts and persona-level angle | Claude | Needs manual research |
| Email approved | Researched | Body passes claims check, approval mode satisfied | Pod | Rework body |
| In sequence | Email approved | Contacts enrolled, cadence started | Claude | Stop rule hit |
| Engaged | Reply or meeting booked | Positive intent confirmed by a person | SDR | Nurture |
| Qualified | Engaged | MEDDICC minimum met (section 13) | AE | Disqualify with reason |
| Opportunity | Qualified | Opp created, next step dated | AE | Per stage rules |

**Rule.** A state is never skipped. Each transition writes a tag or field so any pod member can see where an account stands.

---

## 22. CRM usage guidelines

**Status: Baseline. Only "ABM Account = True" is confirmed from the workflow. All other fields are proposals to confirm with Salesforce admins.**

**Confirmed (from the workflow):** a Salesforce checkbox marks nominated accounts: ABM Account = True. The pod can disqualify an account.

**Proposed fields (confirm names, types and permissions before use):**

| Field (proposed) | Type | Purpose | Written by |
|---|---|---|---|
| ABM Account | Boolean | Marks nominated accounts (exists per workflow) | Claude, pod |
| ABM Status | Picklist | Program state from section 21 | Claude |
| ABM Disqualify Reason | Picklist | Why the pod removed it | Pod |
| ABM Signal | Long text | Verified signal and source link | Claude |
| ABM Last Run | Date/time | Last pipeline touch (idempotency) | Claude |
| ABM Approval Mode | Picklist | dry_run, rep_review, standing_approval | Pod lead |

**Rules.**
1. No Claude write without the batch's approval mode allowing it.
2. Every write is idempotent: key `lead_id + step` so reruns do not duplicate.
3. Contacts sync from ZoomInfo plus Claude. Dedupe by email and domain before any write.
4. Suppression and do-not-contact always win.
5. Log every external action as an activity, with a timestamp.
6. Nothing is deleted by automation.

---

## 23. Tech stack and tools

**Status: Ready for the core four (from the workflow). The rows below them are scale-up additions that need approval (sections 26 to 29).**

| Tool | Role | Notes |
|---|---|---|
| Claude | Nominates accounts, finds signals, researches, writes email bodies, reports | Runs daily; keeps state in Salesforce fields and tags |
| Salesforce | System of record | ABM Account = True marks nominated accounts |
| ZoomInfo | Contact data | Syncs with Claude for matching and enrichment |
| Gong | Email send via API, call intelligence | Email copy pushed to Gong by Claude via API (per workflow); confirm API access and limits |
| n8n or Make (addition) | Deterministic workflow layer between Claude, Salesforce, ZoomInfo and the sending tool | Section 27; account owner and data location to confirm |
| Sending mailboxes (addition) | 5 warmed mailboxes per rep, ramped to 50 a day each | Section 26; IT and legal approval |
| Voicemail dialer (addition) | Voicemail drop during live dials | Section 29; legal sign-off, off by default |

**Open items to confirm with Loadsmart:** Gong API capabilities and rate limits, Salesforce write permissions for the integration user, ZoomInfo credit policy, the sender identity and domain for sequences. Secrets are referenced as `${SALESFORCE_TOKEN}`, `${ZOOMINFO_KEY}`, `${GONG_KEY}`. Never paste a key into a chat or file.

---

## 24. Reporting and dashboards

**Status: Ready. The dashboard ships in the plugin as `dashboard/loadsmart-pod-dashboard.html`.**

**What it shows (maps to section 20):**
- Funnel by program state (nominated to opportunity)
- Accounts by pod, with disqualification reasons
- Email performance (delivered, bounced, replies) with sample sizes
- Meetings and opportunities from ABM accounts
- Stuck accounts and next actions
- Run log (what Claude did, when, with approval mode)

**How it works.** Open the file in a browser. Import three CSVs exported from Salesforce or Gong (templates in `dashboard/templates/`). Nothing is uploaded; data stays in the browser. A clearly labeled SIMULATED demo mode shows the layout with fake rows so you can see it before real data exists.

**Weekly report.** The `loadsmart-pod-reporting` skill builds the same view as a one-page weekly summary for the pod lead. It states the data source and period at the top and flags missing fields instead of estimating.

---

## 25. Best practices, diagnosis and rollout

**Status: Baseline.**

**Daily rhythm.** See section 28: review, calls (main block), LinkedIn, replies, close out. Friday: weekly report.

**Best practices.**
1. One persona, one pain, one question per touch.
2. Verified signal before outreach. No signal, no email.
3. Pod judgment beats Claude's nomination every time. Record why.
4. Fix the data first (ICP, personas, fields) before scaling volume.
5. Change one variable at a time and read results at a sample size you can defend.

### Appendix A. Leak diagnosis (if the pipeline underperforms)

Map the leak first, then fix the cause, not the symptom.

1. **Leak map.** Count accounts and contacts at each state in section 21. The biggest drop between adjacent states is the first place to look.
2. **Walk the record audit.** Take 10 accounts that stalled. For each, check: was the signal real, was the contact the right persona, was the email verified, was the body within the claims library, did a person follow up?
3. **Symptom vs root cause.** Low reply rate is a symptom. Root causes: wrong persona, weak signal, claim not credible, deliverability, timing.
4. **Control cohort.** Compare nominated accounts against comparable ones left out of the flow.
5. **Closed-won backtest.** Score past wins and losses with the ICP rubric. If it cannot separate them, the ICP is the problem.

### Appendix B. 30-day rollout

| Week | Goal | Done when |
|---|---|---|
| 1 | Confirm fields, ICP spec, personas source, approval mode = dry_run. Run the one-time CRM audit (section 30) | Loadsmart signs off on sections 22 and 4; data pack saved |
| 2 | Run pipeline in dry_run for one pod, review every output | Pod rates drafts usable, no invented claims |
| 3 | Move to rep_review, small batch, enable dashboard. Start mailbox ramp at week 1 caps (section 26) if approved | First replies logged and reported |
| 4 | Review KPIs, set baselines, decide on standing_approval for low-risk steps | Leader approves graduation criteria |

**Graduation criteria for standing_approval (Recommendation).** A defined number of consecutive batches with zero rejected drafts, zero claim violations, zero bounces above threshold. Numbers set by Loadsmart.

### Appendix C. Open items to confirm with Loadsmart

1. Salesforce object and field names, permissions for an integration user
2. How Claude currently nominates accounts (data source, "like company A" measure, prompt)
3. Gong API capabilities and email send limits
4. Sender domains, signatures, unsubscribe and address handling
5. Approved claims and case studies (section 9)
6. Competitor list and loss reasons (sections 10 and 11)
7. Carrier-side scope (in or out of this program)
8. First product and segment to launch
9. Geography and spend cap for enrichment credits
10. Source of persona language (Gong transcripts to review)


---

# Scale-up addendum (sections 26 to 31)

Added November 11, 2026. These six sections extend the playbook with multi-mailbox sending, workflow automation, the daily call block, voicemail drop, a one-time CRM audit, and credit and token budgets. They change four earlier sections: 19 (cadence), 20 (KPIs), 23 (tech stack) and 25 (daily rhythm). Each carries a status label like the rest of the playbook.

| # | Section | Status |
|---|---|---|
| 26 | Multi-mailbox sending | Baseline (needs IT and legal approval) |
| 27 | Deterministic orchestration with n8n or Make | Baseline (tool choice and account owner to confirm) |
| 28 | The daily block: calls and target accounts | Baseline |
| 29 | Voicemail drop | Needs input (legal sign-off before use) |
| 30 | One-time CRM audit and ICP scoring | Ready (script included) |
| 31 | Credit and token budget | Ready |

---

## 26. Multi-mailbox sending

**Status: Baseline. Nothing here is switched on until Loadsmart IT, legal and email ops approve it.**

**The idea.** Each rep sends from 5 warmed mailboxes instead of 1, ramped to at least 50 emails per day per mailbox. That is a ceiling of 250 emails per rep per day, so results show up in days, not months.

**Capacity math (Assumptions in brackets; change them in the script).**

| Quantity | Value | Basis |
|---|---|---|
| Mailboxes per rep | 5 | Your plan |
| Daily cap per mailbox at full ramp | 50 | Your plan |
| Ceiling per rep per day | 250 | 5 x 50 |
| Ceiling per rep per week (5 days) | 1,250 | 250 x 5 |
| Emails per contact across a full sequence | [3] | Section 19 cadence |
| New contacts a rep can start per week at ceiling | about 417 | 1,250 / 3 |
| Contacts per account in sequence | [4] | Assumption |
| Accounts needed per rep per week at ceiling | about 104 | 417 / 4 |
| Accounts in a pod today | 20 | Sales Motion Workflow |
| Contacts in a 20-account pod | about 80 | 20 x 4 |
| Emails to finish the whole pod list once | about 240 | 80 x 3 |

**What this means.** The mailboxes are not the limit. The list is. A 20-account pod has roughly one day of capacity for a single rep. Hitting 250 a day without burning the list means feeding the flow from the CRM audit (section 30): existing CRM contacts and accounts that already fit the ICP and cost no credits. Treat 250 as a ceiling, not a daily target, and let the list set the real volume.

Check the numbers yourself:

```
python3 skills/loadsmart-mailbox-ops/scripts/assign_mailboxes.py capacity --mailboxes 5 --per-day 50 --touches 3 --contacts-per-account 4 --accounts 20
```

**Rules.**
1. One contact stays on one mailbox for the whole sequence. Never email the same person from two mailboxes.
2. No more than `[N]` contacts at the same account on the same day, so outreach to one company does not look coordinated by accident. Multi-threading is deliberate and logged.
3. Same variant of an email goes out across all mailboxes, and test variants are split at random across contacts, not across mailboxes, so a weak mailbox does not look like a weak message.
4. Every mailbox has its own daily cap, status (`ramping`, `warm`, `paused`) and counters. A paused mailbox gets no new sends.

**Ramp plan (Recommendation, to test and adjust, not a proven benchmark).**

| Week | Cap per mailbox per day | Move up only if |
|---|---|---|
| 1 | 10 | Warm-up healthy, bounce under 2%, no complaints |
| 2 | 20 | Same |
| 3 | 35 | Same |
| 4 | 50 | Same |

**Pause rules.** Pause a mailbox and review when its bounce rate reaches 2% on at least 30 sends (your Prospector target is under 2%), when spam complaints appear, or when Google Postmaster Tools shows a rising spam rate. Public guidance from Google and Yahoo says to stay under 0.3% spam complaints and aim for under 0.1%.

**Authentication and compliance (current public rules, verify with email ops).**
- SPF, DKIM and DMARC set up and aligned on every sending domain.
- One-click unsubscribe (RFC 8058 header) plus a visible unsubscribe link, honored within 2 days. Google and Yahoo require it for bulk senders; Microsoft enforces its own rules from May 2025.
- Bulk sender status starts around 5,000 messages a day to a provider's addresses. Add up every rep on the same sending domain. Below that, the authentication and complaint rules still apply.
- Accurate From name, a physical address and a working opt-out on every message (CAN-SPAM). Legal reviews the footer.
- No lookalike or impersonating domains. Mailboxes sit on domains Loadsmart owns and approves.

**Open items.** Which domains the mailboxes live on and who creates them; whether Gong or the sending tool supports several sender mailboxes per rep (unconfirmed); who owns warm-up tooling and its cost; per-domain total volume across all reps.

---

## 27. Deterministic orchestration with n8n or Make

**Status: Baseline.**

**Why.** Claude is best at judgment: choosing accounts, summarizing signals, writing a body. It should not be trusted with counting, caps, deduping, scheduling or stop rules. Those run as fixed workflow steps so the same input always gives the same result, and Claude only runs where a judgment is needed.

| Step | Runs in | Why |
|---|---|---|
| Schedule, pull ABM accounts, skip stop tags | Workflow | Fixed logic |
| Dedupe, suppression, free-mail rejection | Workflow (script) | Fixed rules |
| Nominate accounts, summarize signals | Claude | Judgment |
| Account brief, email body | Claude | Judgment |
| Check JSON shape, claim IDs, word count, one question | Workflow (preflight script) | Fixed rules |
| Approval wait | Workflow (wait node, Slack or email) | Human gate |
| Assign each contact to a mailbox, apply caps | Workflow (script) | Fixed rules |
| Push to the sending tool, log the action | Workflow | Fixed logic |
| Reply, bounce, unsubscribe stop rules | Workflow | Fixed rules, with a person reviewing replies |
| Daily report and call list | Workflow | Fixed logic |

**Tool choice (public pricing, verify on each vendor page; sources disagree on exact numbers).**
- n8n charges per workflow run no matter how many steps. A self-hosted option has no run limit. Its cloud plans were listed at about EUR 24 a month for 2,500 runs and about EUR 60 for 10,000 in one 2026 comparison.
- Make charges per credit (renamed from operations in August 2025), about one per module step. A Core plan was listed at roughly 9 to 10.59 dollars a month for 10,000 credits. Comparisons put the break-even around 6 to 9 steps per run, so long workflows favor n8n.
- Recommendation: n8n, because the pipeline has many steps, needs code nodes for the deterministic checks, and can be self-hosted if Loadsmart's data rules require it. Make is easier to start with if you want the fastest first build. Either way, design one run per batch, not one run per contact, to keep cost down.

**Before you buy.** The workflows will handle Loadsmart CRM and contact data. Confirm with Loadsmart IT and security whose account it lives in, where the data is stored, and who pays. Do not route Loadsmart data through a personal account without that approval.

**Six workflows (module plans are in `loadsmart-orchestration`).**
1. Nightly: pull ABM accounts, nominate, write tags (approval per mode).
2. Contacts: pull, clean, verify, within the credit cap.
3. Drafts: Claude brief and body, validated against a JSON schema.
4. Send: approval wait, preflight, mailbox assignment, push, log.
5. Events: replies, bounces, unsubscribes stop sequences and notify the rep.
6. Reporting: daily call list and weekly report.

**Guardrails.** Idempotency key `contact_id + step`. Retries three times, then alert. A kill switch (one flag that stops every send). Secrets as `${VAR}` in the tool's credential store. A run log row per execution.

---

## 28. The daily block: calls and target accounts

**Status: Baseline. Times are a Recommendation; targets stay `[N]` until a four-week baseline exists.**

Email now runs on its own. The pod's day is calls and the target accounts.

| Block | What | Output |
|---|---|---|
| 1. Review (15 min) | Read the run summary, accept or disqualify nominations, approve the batch | Approvals, disqualify reasons |
| 2. Calls (main block) | Work the ranked call list, with voicemail drop if enabled | Dispositions logged same day |
| 3. LinkedIn (short block) | Connection notes and DMs for today's accounts | Touches logged |
| 4. Replies (short block) | Answer replies, book meetings | Meetings, next steps |
| 5. Close out (10 min) | Log, flag stuck accounts | Clean CRM |

**Call list priority (deterministic, built by the workflow).**
1. Positive replies with no meeting yet.
2. Contacts on cadence day 3 with no reply (section 19).
3. Accounts with a new signal in the last 7 days.
4. Everyone else, ordered by ICP score.

Each row has the account, contact, persona, one-line brief and the claim ID to use. Cap the list at `[N]` a day; the pod sets the number.

---

## 29. Voicemail drop

**Status: Needs input. Off by default until legal signs off.**

**What it is.** A pre-recorded voicemail that goes out after a call reaches voicemail, so reps do not re-record every time and can move faster.

**Two kinds, treated differently.**
- **Drop during a live dial.** The rep dials, gets voicemail, and plays a recording the rep made. Recommended starting point.
- **Ringless voicemail.** Delivered straight to the voicemail box without ringing. In November 2022 the FCC ruled this is a call under the TCPA that needs the recipient's prior express consent for wireless numbers. Do not use it without legal approval.

**Rules.**
1. Legal signs off on the method, on which numbers may be called, and on whether business cell phones are covered, before anyone turns it on. This is a legal question, not mine to answer.
2. Use the rep's own recorded voice. Ask counsel whether synthesized or cloned voices count as prerecorded under the TCPA before considering them.
3. Check the do-not-call list first and honor removal requests the same day.
4. Under 20 seconds, one reason, one callback number, no claims outside the claims library.
5. Keep a control group (no drop) to measure whether drops raise callbacks.

**Voicemail scripts (one persona each).**

> Opendock, Dir. Distribution: "Hi [First Name], it's [Rep] at Loadsmart. I saw [verified signal] at [Company]. I help distribution teams with dock scheduling. I'll send a short note. My number is [number]."

> ShipperGuide, Transportation Manager: "Hi [First Name], [Rep] at Loadsmart. I'm reaching out about how [Company] plans and tenders freight. I'll email a quick question too. You can reach me at [number]."

> Loadsmart AI, VP Supply Chain Ops: "Hi [First Name], [Rep] at Loadsmart. I wanted to ask how your team handles repetitive freight follow-up at [Company]. Short email coming. My number is [number]."

**Measure.** Callbacks within 48 hours, with drop versus without, and unsubscribe or complaint rate for calls.

---

## 30. One-time CRM audit and ICP scoring

**Status: Ready. The audit script runs offline on your exports.**

**Why first.** Before paying for any new data, find out what Loadsmart already has: accounts, contacts, opportunities, contracts and reports. Scoring that data once against the ICP gives a "load first" list of accounts with usable contacts already in the CRM, which costs no credits.

**Steps.**
1. **Inventory.** Count accounts, contacts, opportunities and contracts. List existing reports and dashboards with owner and last-run date (ask a Salesforce admin for the list or export). Record field fill rates: email, title, phone, industry, employees, owner, last activity.
2. **Score.** Score every account with the rubric in `loadsmart-icp-signal/references/scoring-rubric.md`. The audit script derives top industries and size bands from closed-won accounts, so the score reflects Loadsmart's own wins, not a guess.
3. **Tier.** Tier A: fits and already has verified contacts. Tier B: fits but is missing contacts. Tier C: weak fit or excluded (customer, open opportunity, recent closed-lost).
4. **Load first.** Tier A feeds outreach and the mailboxes immediately. Tier B goes to the enrichment queue, up to the credit cap. Tier C gets no spend.
5. **Save a data pack** so every later step reads it before searching anywhere else.

**Run it.**

```
python3 skills/loadsmart-crm-audit/scripts/crm_audit.py --accounts accounts.csv --contacts contacts.csv --opps opps.csv --out-dir ./audit
```

Outputs: `audit_summary.md`, `account_scores.csv`, `load_first.csv`, `enrichment_queue.csv`, `suppression_candidates.csv`.

**Privacy.** The CRM holds personal data. Export it only to a location Loadsmart approves, run the script there, and share totals, not rows, in chat.

**Refresh.** Re-run quarterly or after a large import.

---

## 31. Credit and token budget

**Status: Ready.**

**Lookup order (stop at the first hit).** 1. The CRM data pack from section 30. 2. Cached briefs less than `[N]` days old. 3. ZoomInfo data already synced. 4. Paid enrichment, within the credit cap. 5. Web research, only for the gap that is left.

**Rules.**
1. Research gaps only. If the CRM already holds industry, size and contacts, Claude does not search for them.
2. One brief per account, reused for every contact at that account.
3. Give Claude only the data pack row and the brief, not the whole CRM, to keep each prompt small.
4. Fixed-rule jobs (dedupe, cap, format checks) run in the workflow, not in a model call.
5. Set a credit cap and a token cap per run. Stop and report when either is reached.
6. Log credits and tokens per run so the cost per verified contact and per meeting is visible.

**Budget card (show with every approval).**

```
Run:            [pod] [date]
Credits cap:    [N]     Used: [N]
Token cap:      [N]     Used: [N]
Data from CRM:  [N accounts / N contacts at zero credits]
Gaps to buy:    [N contacts]
```

---

### Appendix D. New metrics

| Metric | Definition | Source |
|---|---|---|
| Mailbox health | Bounce rate, complaints, replies per mailbox, with sends | Sending tool, Postmaster Tools |
| Capacity used | Emails sent divided by the day's ceiling | Preflight and assignment report |
| Dials, connects, voicemail drops | Counts per rep per day | Dialer, Salesforce |
| Voicemail callback rate | Callbacks in 48 hours, drop versus no-drop | Dialer, Salesforce |
| CRM load-first share | Share of outreach that came from Tier A at zero credits | Audit, run log |
| Credits per verified contact | Credits used divided by verified contacts | Run log |
| Tokens per brief | Tokens used divided by briefs written | Run log |
| Cost per meeting | Credits, tokens and tool cost divided by meetings held | Run log, Salesforce |

### Appendix C, continued: additional open items

11. Mailbox domains, who creates them, and warm-up tooling and cost
12. Whether the sending tool supports multiple mailboxes per rep
13. Whose account hosts n8n or Make, where data is stored, who pays
14. Legal position on voicemail drop, business cell numbers and voice type
15. Salesforce report and dashboard inventory, and the contract data available for the audit
16. Credit and token caps per run
