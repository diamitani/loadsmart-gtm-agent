# Loadsmart ABM Sales Playbook

Patrick Diamitani · November 2026

## How to use this playbook

This is the operating manual for Loadsmart's AE/SDR ABM pods: one daily pipeline, three products sold into the same 20 accounts, and a weekly loop that makes the list and the copy better. It ships with a skill pack (one skill per pipeline step, plus an orchestrator), a pod copilot agent, and a pod dashboard.

**Who it's for:** AEs and SDRs in each pod (daily execution), RevOps (data, routing, reporting), Marketing (messaging, signals), Sales leadership (strategy calls).

**Assumptions, stated out loud** (each one is something to confirm in week 1):

- A1. Pods are 1 AE + 1 SDR, each working 20 named accounts flagged `ABM_Account__c = True` in Salesforce.
- A2. Gong Engage is the automated email sender today; Salesloft is licensed but its role overlaps. Calls and LinkedIn are manual and not yet tracked as sequence steps.
- A3. "Moving up-market" means enterprise shippers with multi-site warehouse networks and an existing TMS/WMS/YMS footprint.
- A4. Claude's account selection prompt, inputs and scoring are not documented anywhere a rep or RevOps can read.
- A5. There is no shared, written ICP or persona definition per product yet.
- A6. Loadsmart proof points on the website (customer counts, appointment volumes, agent autonomy rates) are company-claimed. They go into copy only after Marketing confirms them.

**What's in the kit:**

| Piece | What it does | Where it lives |
| --- | --- | --- |
| This playbook | Rules, ICPs, personas, messaging, cadences, KPIs, rhythm | /playbook |
| Skill pack (11 skills) | One skill per step: CRM audit (one-time), signal, ABM tag, persona enrichment, research, email, sequence, list QA, daily report, pod feedback, orchestrator; plus sending and dialer config | /skills |
| Pod Copilot agent | Asks "what do I do today?" and gets tasks, research and drafts, grounded in this playbook | /copilot |
| Pod dashboard | Funnel, leak flags, persona coverage per account and product, rep activity, digest | /dashboard |

**Operating rules (non-negotiable):** nothing sends or writes to Salesforce without an approval step; nothing in copy is invented (missing proof = a `[placeholder]`); one product and one persona per email.

## The motion: today vs target

Today the motion is a set of good parts that run on their own schedule; the target is one ordered daily pipeline where every step leaves a field in Salesforce that the next step reads.

**Today (hybrid):** Claude nominates 20 accounts per pod from closed-won and industry spend data, flags them `ABM Account = True`, ZoomInfo + Claude populate contacts, Claude writes email copy and pushes it to Gong for sending. Pods vet accounts (can disqualify) and own calls and LinkedIn by hand.

**Target: the daily ABM pipeline** (each step is one skill in the pack; the orchestrator runs them in order):

| # | Step (skill) | Runs | Reads | Writes | Gate |
| --- | --- | --- | --- | --- | --- |
| 0 | CRM audit (`la-crm-audit`) | Once in week 1, then quarterly | Salesforce as it is | Fit scores, tiers, persona tags on existing contacts | RevOps approves write-back |
| 1 | Signal (`la-signal`) | Daily 6:00 CT | ICP doc, signal sources | `Signal__c` rows per account, score | None (read-only) |
| 2 | ABM tag (`la-abm-tag`) | Weekly Mon 6:30 | Signal scores, pod capacity | `ABM_Account__c`, `ABM_Pod__c`, `ABM_Reason__c` | RevOps approves the weekly list |
| 3 | Persona enrichment (`la-persona-enrich`) | Daily 7:00 | ABM accounts missing personas | Contacts tagged `Persona__c` + `Product__c` | Verified email or flagged |
| 4 | Research (`la-research`) | Daily 7:30 | Enriched contacts | `Research_Brief__c` with sources | Evidence check |
| 5 | Email (`la-email`) | Daily 8:00 | Research brief, persona, product | `AI_Email_1__c` (body only) | QA rules + pod spot-check |
| 6 | Sequence (`la-sequence`) | Daily 8:30 | `AI_Email_1__c` filled | Enrollment in Gong flow (email + dialer + LinkedIn steps) | Rep approves batch |
| 7 | Daily report (`la-daily-report`) | Daily 17:00 | Sequence + activity data | Dashboard numbers, leak flags | None (read-only) |

Two supporting skills run on a weekly rhythm: `la-list-qa` (list and contact quality audit) and `la-pod-feedback` (turns rep disqualifications and notes into changes).

**The pod's day (AE + SDR):**

1. 8:45 — open the dashboard pod view: today's call and LinkedIn tasks are already in the Gong flow, sorted by account priority.
2. 9:00–11:00 — dialer block on contacts whose email step fired 2+ days ago (warmest first); voicemail drop when no one answers.
3. 11:00–11:30 — LinkedIn: connection notes and DMs drafted by the copilot, sent by the rep.
4. Afternoon — AE: discovery and multi-threading into the second and third product persona at engaged accounts. SDR: second call block.
5. 16:30 — log disqualifications and one-line feedback in the dashboard (reason codes, not free text only).

## Diagnose: where the program leaks

The most likely root cause sits upstream, at account selection and persona mapping: if the 20 accounts or the contacts are wrong, every downstream metric (opens, replies, meetings) looks like a copy problem when it isn't. So diagnosis runs top-down, one stage at a time, and a stage is only blamed after the stage above it checks clean.

| Stage | What to check | Red flag | Likely root cause (vs symptom) |
| --- | --- | --- | --- |
| 1. Account selection | Claude's prompt, inputs, scoring; overlap of the 20 with closed-won lookalikes; pod disqualification rate | Pods disqualify more than ~1 in 5 accounts, or the same reason repeats | No written ICP; "lookalike" defined only by the model. Low reply rate is the symptom. |
| 2. Signal / timing | Does each account carry a dated reason to reach out now? | Accounts flagged with no signal, or signals older than 90 days | Selection is static (fit only, no timing). Symptom: polite "not now" replies. |
| 3. Persona coverage | Per account, per product: is there a verified contact for each buyer role? | Accounts with 1 product covered, or contacts in the wrong function (e.g. IT for Opendock) | ZoomInfo pulls by title keyword, not by product persona map. Symptom: single-threaded deals. |
| 4. Contact data | Bounce rate, title accuracy, job-change rate | Hard bounce over 3%, or reps report "left the company" often | No verification step, no refresh cadence. Symptom: deliverability drop across the pod. |
| 5. Research and copy | Does each email cite a real, sourced fact? Product/persona match? | Same opener across accounts; Opendock copy sent to a TMS buyer | No research step between enrichment and writing. Symptom: low reply, high opens. |
| 6. Sending and sequence | Domain health, send volume per mailbox, sequence step completion | Spam-folder placement, steps skipped, calls not logged | Email automated but calls/LinkedIn live outside the sequence. Symptom: "email doesn't work." |
| 7. Rep follow-through | Task completion on call and LinkedIn steps | Under ~70% of manual tasks completed within 2 days | Tasks not in one queue; no daily view. Symptom: low meeting rate despite replies. |
| 8. Meeting to pipeline | Meeting held rate, stage 1 to stage 2 conversion by product | Meetings that never become opportunities | Wrong persona or no qualification standard. Symptom: "bad meetings." |

**How to tell a symptom from a root cause:** a symptom moves when you change the stage it shows up in; a root cause moves the stages below it too. Test: fix one thing at a stage (for example, rewrite copy for one pod) and hold everything else constant for two weeks. If replies rise but meetings don't, copy was a symptom and the leak is lower (persona or qualification). If nothing moves, the leak is higher (list or signal).

**First-week checks (before recommending anything):**

- [ ] Read Claude's current account-selection prompt and the data it is given.
- [ ] Pull every pod disqualification since launch with its reason.
- [ ] Count verified contacts per account per product (the persona coverage matrix).
- [ ] Pull 30 days of Gong email stats per pod: sent, delivered, bounced, replied, meetings.
- [ ] Sit with one pod for a full day: where does time go, which tasks get skipped, and why.

Red-flag thresholds above are starting points (assumption), to be replaced by Loadsmart's own baseline once 30 days of data are pulled.

## ICP and buyer personas per product

One account, three products, three different buyers: the ICP is defined once at the account level, and each product gets its own primary persona so copy and calls never mix audiences.

**Account ICP (draft v0, to validate against closed-won):**

| Field | Definition | Source to validate |
| --- | --- | --- |
| Segment | Enterprise and upper mid-market shippers (up-market motion) | Closed-won by revenue band |
| Industry | Food and beverage, CPG, retail, manufacturing, distribution (assumption: confirm the top 5 by closed-won count and spend) | Salesforce closed-won |
| Company size | [revenue / freight spend band from closed-won] | Closed-won, ZoomInfo firmographics |
| Footprint | Multiple warehouses or DCs; meaningful truckload volume | ZoomInfo, 10-K, job posts |
| Tech context | Existing TMS/WMS/YMS (Loadsmart AI is positioned to sit on top of these) | ZoomInfo technographics, job posts |
| Geography | North America (assumption) | Sales territories |
| Exclusions | Current customers of the same product, brokers/3PL competitors, open opps owned elsewhere | Salesforce |

**Primary persona per product** (pains, triggers and objections are working assumptions until 10 discovery calls per product confirm them):

| Field | Opendock (dock, gate, yard) | ShipperGuide (TMS) | Loadsmart AI (agents) |
| --- | --- | --- | --- |
| Titles | Warehouse / DC Ops Manager, Director of Distribution, Site GM | Transportation Manager, Director of Transportation / Logistics | VP Supply Chain, VP Logistics, Head of Transportation Ops |
| Department | Warehouse / distribution operations | Transportation / logistics | Supply chain leadership |
| Decision role | Champion at site; economic buyer is regional or VP Ops | Champion and often the evaluator; VP signs | Economic buyer; pulls in IT and the TMS owner |
| Goals / KPIs | Dock throughput, on-time appointments, detention and dwell | Cost per load, tender acceptance, on-time delivery | Freight cost, team capacity, exception handling time |
| Pain (assumption) | Trucks waiting at the gate, phone/email scheduling, detention fees | Planning across spreadsheets and disconnected tools, manual tendering | Repetitive follow-ups and check calls consume the team |
| Buying triggers | New DC opening, detention cost spike, ops leader hire, WMS change | TMS contract renewal, freight RFP season, new transportation leader | AI/automation mandate, headcount freeze, new VP Supply Chain |
| Likely objections | "Carriers won't use another portal"; "we use our WMS for that" | "We just implemented a TMS"; switching cost | "AI isn't reliable for freight"; data access and security |
| Channels | Phone (on the floor, not at a desk), LinkedIn | Email, phone, industry events | Email, LinkedIn, executive referral |
| Secondary contacts | Receiving supervisor, transportation team that books inbound | Procurement, finance (freight audit) | IT / systems owner, CFO |

**Multi-threading rule:** an account counts as "covered" only when it has a verified contact for at least 2 of the 3 product personas. The dashboard's persona matrix shows this per account.

## Messaging, cadences and scripts

Every touch names one product, one persona and one dated reason to reach out; the AI writes only the email body, and the template wraps it with the rep's greeting and signature.

**Message house (draft):**

| | Opendock | ShipperGuide | Loadsmart AI |
| --- | --- | --- | --- |
| Core line | Trucks in and out on time, without the phone-and-email scheduling | One place to plan, tender, track and settle freight | Agents take the repetitive freight follow-ups off your team |
| Proof slot | [Opendock customer result, approved by Marketing] | [ShipperGuide customer result] | [Loadsmart AI result + methodology] |
| Soft CTA | "Worth comparing notes on how your sites book inbound?" | "Open to a 20-minute look at how teams run tendering in one place?" | "Would it help to see which follow-ups an agent could take on your next 100 loads?" |

**Unified Gong flow (12 business days, per contact; stops on reply, bounce, unsubscribe or meeting booked):**

| Day | Channel | Step | Owner |
| --- | --- | --- | --- |
| 1 | Email | AI email 1: signal + pain + soft CTA (body only, under 120 words) | Automated, rep-approved batch |
| 1 | LinkedIn | Profile view + connection note (no pitch, no link) | SDR |
| 3 | Phone | Call 1 via power dialer: reference the email's signal; drop a pre-recorded persona voicemail if no answer | SDR |
| 4 | Email | Email 2: one proof point or use case for the same persona | Automated |
| 6 | Phone + LinkedIn | Call 2; DM if connected | SDR |
| 8 | Email | Email 3: thread a second persona at the same account ("I also reached [role] about [product]") | Automated |
| 10 | Phone | Call 3 (AE on top-10 priority accounts) | AE |
| 12 | Email | Close-the-loop email, permission to reconnect later | Automated |

**Email template (what the AI fills):**

```text
Hi [First Name],

{{AI_Email_1}}   <- 2 short paragraphs: the signal and why it matters to this persona, then one soft question

[Rep first name]
[Rep title], Loadsmart
[Opt-out line] · [Postal address]
```

**Sample body, Opendock persona** (placeholders stay until real facts are in the research brief):

> Saw that [Company] is opening [new DC / site from signal]. New sites usually start with inbound appointments booked by phone and email, which is where gate waits and detention creep in.
>
> Teams like [approved reference] moved booking to self-serve carrier scheduling. Worth comparing notes on how [new site] will handle inbound?

**LinkedIn connection notes** (no pitch, no link):

- Opendock (196 chars): "Hi [First Name], I work with warehouse ops leaders on dock scheduling and gate flow. Saw [Company] is [signal]. Would be glad to connect and swap notes on how other sites run inbound appointments."
- ShipperGuide (152 chars): "Hi [First Name], I spend my days with transportation teams on planning and tendering workflows. Noticed [signal] at [Company]. Would be glad to connect."
- Loadsmart AI (164 chars): "Hi [First Name], I work with supply chain leaders looking at where AI agents can take repetitive freight work off their teams. Saw [signal]. Would value connecting."

**Call opener (30 seconds, any persona):** "Hi [First Name], it's [Rep] from Loadsmart, this is a cold call, can I have 30 seconds and you can tell me if it's worth more? I sent a note about [signal]. Usually when [signal] happens, [persona] teams run into [pain]. Is that on your plate right now, or am I off?"

**Qualification (stage 1 to stage 2 exit criteria):** confirmed pain owned by the persona, a dated trigger or initiative, the economic buyer named, the current tool or process named, and an agreed next step on the calendar.

## List and contact quality

Quality is fixed now with a one-time audit and kept up with a weekly loop where pod disqualifications and bounces feed back into the selection prompt and the persona map.

**Make it good now (week 1 to 2, `la-crm-audit` then `la-list-qa`):**

1. Write the ICP and persona map (section above) into one versioned file that Claude's selection prompt reads. No more "find companies like X" without a definition.
2. Re-score every current ABM account against it: fit score (firmographic + tech), timing score (signals), and coverage score (personas found). Show the score and the reasons on the account record.
3. Verify every contact email before it enters a sequence (ZoomInfo confidence plus a verifier pass); park "unknown" for manual review instead of sending.
4. Map contacts by function and seniority to a product persona; reject title-keyword matches outside the function (an IT director is not an Opendock buyer).
5. Dedupe and suppress: open opportunities, current customers of that product, prior opt-outs, competitor domains.

**Make it better over time (weekly):**

- Every pod disqualification needs a reason code: wrong industry, too small, current customer, bad timing, no persona found, other. The weekly QA run counts them; a reason that repeats becomes a rule in the selection prompt.
- Bounces and "left the company" replies trigger a re-enrich of that persona slot within 24 hours.
- Contacts older than 90 days since last verification get re-verified before the next sequence step.
- Win/loss feedback: every opportunity created from ABM gets compared back to its original fit and timing scores, so the weights are tuned on outcomes, not opinion.

**Quality scorecard (per pod, weekly):**

| Metric | Definition | Target (assumption, set from baseline) |
| --- | --- | --- |
| Pod acceptance rate | Accounts kept / accounts assigned | 80%+ |
| Persona coverage | Accounts with 2+ of 3 product personas verified | 70%+ |
| Verified email rate | Contacts with a verified email / contacts enrolled | 95%+ |
| Hard bounce rate | Hard bounces / emails sent | Under 2% |
| Title accuracy | Spot-check of 20 contacts per pod: still in role, right function | 90%+ |

## Signals: what to build and how to test it

Recommendation: add a daily signal layer that turns the static 20-account list into a ranked list with a dated reason per account and per product, then prove it with a holdout test before rolling it to every pod.

**Signal systems built before (Patrick's prior work):**

- Atlas HXM Intent-to-Outreach engine: a daily 7am n8n run that pulls ZoomInfo and Factors ABM intent from HubSpot, passes it through 8 sequential ICP filters, routes to 6 rep pods by territory, and posts qualified accounts to Clay for enrichment, with every assignment logged.
- SalesGency Prospect Outreach pipeline: a 6-step signals-to-email workflow where research "hooks" are kept only if they trace back to evidence, and nothing sends by default.

**Recommended signals for Loadsmart** (each mapped to the product it opens):

| Signal | Where it comes from | Opens | Why now |
| --- | --- | --- | --- |
| New DC, warehouse or site announced | Press, local permits, job posts for a new site GM | Opendock | New sites set up dock scheduling from scratch |
| Hiring warehouse / receiving / yard roles at volume | Job boards, LinkedIn jobs | Opendock | Throughput pressure at the dock |
| Hiring transportation managers or freight analysts | Job boards | ShipperGuide | Team scaling; tooling gets revisited |
| Job posts naming a TMS, or a TMS replacement project | Job post text, ZoomInfo technographics | ShipperGuide | Evaluation window is open |
| New VP / Head of Supply Chain or Logistics | LinkedIn, Sales Navigator alerts | Loadsmart AI | New leaders set an agenda in their first 90 days |
| Public company mentions freight cost, automation or headcount discipline | Earnings calls, 10-K | Loadsmart AI | Executive mandate exists |
| Research intent on dock scheduling, yard, TMS, freight automation topics | ZoomInfo intent | Matching product | Active research |
| Product network signal (idea to validate): the account's facilities or carriers already touch Opendock | Loadsmart product data | Opendock, then cross-sell | Warmest possible intro; needs RevOps and data access |
| Engagement: email reply, site visit, event attendance (e.g. Sightline, date to confirm) | Gong, web analytics, Marketing | Any | Hand-raise |

**Scoring:** account priority = fit score x timing score (signal recency and strength, decaying after 30, 60, 90 days) x coverage (personas found). The weights start simple and are tuned monthly on which accounts became opportunities.

**How to test whether a signal works:**

1. Holdout: in each pod, half the outreach goes to signal-ranked accounts, half to fit-only accounts, same copy framework, same reps, for 4 to 6 weeks.
2. Compare reply rate, meeting rate and stage 2 opportunities per 100 contacts. A signal earns its place only if it beats the control on meetings, not just opens.
3. Track signal precision per source: of accounts flagged by that signal, how many engaged. Drop or down-weight sources that stay at the control's rate.
4. Check the signal is real before it hits copy: every signal stored with a source URL and date; the research skill refuses to mention an unsourced signal.

## Measurement: KPIs and when to change strategy

The program is measured on pipeline created per account worked, by product, with leading indicators per stage so a drop can be traced to the stage that caused it.

| Team | KPI (outcome) | Leading activity metrics | Definition | Data source | Frequency | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| Pods (SDR) | Meetings held per pod per week | Call and LinkedIn tasks completed within 2 days; connects; replies | Meeting held = occurred, not just booked | Gong, Salesforce events | Daily / weekly | SDR + pod AE |
| Pods (AE) | Stage 2 opportunities from ABM accounts, by product | Accounts with 2+ personas engaged; discovery calls held | Stage 2 = meets exit criteria in the playbook | Salesforce opportunities | Weekly | AE |
| RevOps | Pipeline per ABM account worked (USD) | Persona coverage, verified email rate, bounce rate | Pipeline created / accounts with any touch in the period | Salesforce | Weekly / monthly | RevOps |
| Marketing | Reply rate by product and persona | Email 1 vs 2 vs 3 reply share; positive vs negative replies | Replies / delivered, per persona | Gong | Weekly | Marketing |
| Leadership | ABM pipeline vs non-ABM outbound, cost per opportunity | Account velocity: signal to first meeting (days) | Comparison against the same period's non-ABM outbound | Salesforce, Gong | Monthly | Sales leadership |

**Strategy-change triggers (review monthly; thresholds are assumptions until baselined):**

- Pod acceptance under 70% for 2 weeks: stop and fix the selection prompt before adding volume.
- Replies up but meetings flat for 4 weeks: the leak is persona fit or qualification, not copy.
- One product's reply rate under half of the others for 6 weeks: rework that persona and message, or move that product to a separate motion.
- Signal-ranked accounts not beating the control on meetings after 6 weeks: drop that signal source.
- Meetings to stage 2 conversion falling: tighten exit criteria and review 10 call recordings in Gong.
- Bounce rate over 3% or spam placement: pause sends for that pod and fix data and domains first.

**No vanity metrics:** opens are tracked for deliverability only, never as a success measure.

## Working with the pods

Sitting in Chicago with the AE team, the job is to make the pods' day shorter and their list better: structured feedback goes in daily, changes ship weekly, and every stakeholder gets one report in the format they use.

**Collecting feedback (low effort for reps):**

- Reason codes on every disqualification and every "bad contact" flag (one click in the dashboard or Salesforce), plus an optional one-line note.
- Thumbs up/down on each AI email before the batch is approved, with a reason (wrong persona, wrong fact, tone, too long).
- A 15-minute Friday pod huddle: top 3 accounts that moved, top 3 that didn't, and why.
- Gong call reviews: 2 recordings per pod per week tagged by objection and product.

**Turning it into changes (`la-pod-feedback`, weekly):**

1. Monday: the skill groups last week's reason codes, email ratings and call tags into themes, with counts.
2. Each theme becomes a change ticket with an owner: selection prompt (RevOps), persona map (Marketing + RevOps), copy rules (Marketing), sequence steps (Sales).
3. Changes ship as versioned edits to the ICP file, persona map or email skill, with a one-line changelog the pods can read.
4. The next week's numbers are compared against the week before the change; changes that don't move a metric get rolled back.

**Reporting rhythm:**

| Audience | What they get | Format | When |
| --- | --- | --- | --- |
| Pods | Today's tasks, account priority, what changed this week | Dashboard pod view + Slack digest | Daily 8:45 |
| Sales | Meetings, stage 2 opps by pod and product, at-risk pods | Dashboard + 1-page summary | Weekly, Monday |
| Marketing | Reply rate by persona and product, top objections, copy changes | Persona/message report | Weekly |
| RevOps | List quality scorecard, data issues, process changes, system health | QA report + changelog | Weekly |
| All three | Program review: pipeline per account, signal test results, strategy calls | 30-minute review | Monthly |

## Tools: what to keep, change and add

The stack is already strong; the gap is orchestration and a single source of truth, not more tools, so the main change is to run Claude as scheduled skills that read and write Salesforce fields in a fixed order.

| Tool today | Keep / change | Role in the target motion |
| --- | --- | --- |
| Salesforce | Keep, add fields | System of record: ABM flags, signal rows, persona tags, research brief, AI email field, reason codes |
| Claude | Change: from ad hoc prompts to versioned, scheduled skills | Selection scoring, research, email bodies, weekly QA and feedback synthesis |
| ZoomInfo | Keep | Firmographics, technographics, intent, first-pass contacts |
| Clay | Expand | Enrichment waterfall (ZoomInfo, then Apollo, then others), email verification, job-post and news signals, persona mapping |
| Apollo | Keep as a waterfall source | Fills gaps ZoomInfo misses; second opinion on emails |
| Sales Navigator | Keep, wire alerts | Leadership-change and job-change signals; rep LinkedIn work |
| Gong | Keep | Engage flows with email, call and LinkedIn steps in one queue; call recordings for feedback |
| Salesloft | Decide: consolidate | Two sequencers split activity data. Pick one sender (assumption: Gong Engage, since the automation already pushes there) and retire overlap |
| Add: orchestrator | Purchase n8n or Make.com (Claude handles judgment steps only) | Runs the 7 steps daily in order, retries, logs, alerts on failure |
| Add: email verifier | Standalone verifier or Clay integration | Keeps bounce rate down before any send |

**ROI, how it will be measured (no projected numbers until baselined):**

- Rep time: hours per week each pod spends on list building, contact pulls and research today vs after (measured in the day-in-the-pod week).
- Cost per stage 2 opportunity: tool spend + rep time divided by ABM opportunities, by product.
- Pipeline per account worked, signal-ranked vs control.
- Prior result, for reference: at Atlas HXM the daily intent-to-outreach engine replaced a manual morning triage (CSV exports, dedupe, ICP filtering, round-robin in spreadsheets) with an unattended 7am run, so reps started the day with an assigned, enriched queue.

## Scale and efficiency layer

Four additions turn the motion into a high-capacity, low-waste system: mine the CRM before buying data, run every rule-based step in n8n or Make, give each rep five warmed mailboxes, and put a voicemail-drop dialer behind the call block.

**1. CRM-first: one-time ICP scoring of Salesforce (`la-crm-audit`, week 1)**

Before any ZoomInfo credit or Claude research token is spent, inventory and score what Loadsmart already owns.

1. Inventory: accounts, contacts, leads, opportunities (won/lost by product), contracts, campaigns, existing reports and dashboards, and field fill rates.
2. Score every existing account against the ICP (fit, prior engagement, product already owned) and tag tiers.
3. Map existing contacts to product personas; verify their emails; flag job changes.
4. Load the result as the first source for outreach: closed-lost and stalled accounts, former champions at new companies, and cross-sell accounts already using one product.
5. Rule: enrichment and research only fill gaps the CRM can't. A persona slot already filled with a verified contact is never re-bought.

Why: it saves data credits and AI tokens, and the warmest pipeline (past conversations, current customers) usually sits in the CRM already.

**2. Deterministic orchestration: purchase n8n or Make.com**

Claude should decide, not schedule. Every rule-based step runs as a workflow node; Claude is called as one node only where judgment is needed.

| Runs in n8n / Make (deterministic) | Runs in Claude (judgment) |
| --- | --- |
| Schedules, triggers, retries, error alerts | Account scoring rationale |
| Dedupe, suppression, ICP exclusion filters | Research brief and hook verification |
| Salesforce field reads and writes | Email bodies |
| Mailbox rotation, daily caps, stop rules | Weekly feedback themes |
| Routing to pods, task creation in Gong | Answers to rep questions |

Same input gives the same output, every run is logged, and tokens are spent only on records that already passed the filters. n8n is the default recommendation (code nodes, self-hosting for data control, and the pattern behind Patrick's prior pipelines); Make is the simpler option if RevOps prefers a no-code builder.

**3. Sending capacity: 5 warmed mailboxes per rep**

| Item | Setting |
| --- | --- |
| Mailboxes | 5 per rep on secondary sending domains (never the primary loadsmart.com domain for cold volume), 2 to 3 mailboxes per domain |
| Authentication | SPF, DKIM and DMARC on every domain; custom tracking domain or tracking off |
| Warm-up | 2 to 3 weeks before cold sends, warm-up kept running after launch |
| Ramp | Start around 10 cold emails per inbox per day, step up weekly to 50 per inbox per day once bounce and complaint rates hold |
| Capacity at full ramp | 250 emails per rep per day; 500 per pod (AE + SDR) |
| Rotation and caps | Contacts spread across a rep's 5 inboxes; one inbox per contact for the whole thread; caps enforced in n8n/Make |
| Health guardrails | Hard bounce under 2%, spam complaints under 0.1%, inbox placement checked weekly; any inbox over threshold is paused automatically |

**Flag on volume vs ABM:** a pod's 20 accounts hold roughly 100 to 180 contacts, which 500 sends a day would exhaust in a few days. So the extra capacity needs a second lane:

- **Tier 1, ABM (20 accounts per pod):** multi-threaded, research-heavy, calls and LinkedIn, AE-led.
- **Tier 2, scaled signal lane (100+ accounts per rep):** CRM-audit and signal-qualified accounts, email-led from the warmed inboxes; calls only when someone engages.

Check that Gong Engage supports multi-inbox rotation at this volume. If it doesn't, run Tier 2 through a dedicated cold-email sender with replies synced back to Salesforce and Gong (tool choice to verify).

**4. Voicemail-drop dialer**

- Add a power dialer with voicemail drop to the call block (Gong or Salesloft dialer features, or a dedicated dialer; capability and pricing to verify).
- Record 3 voicemails per product persona (about 20 seconds, signal-led, asks them to reply to the email rather than call back).
- Pair every voicemail with an email in the same 24 hours so the reply path is one click.
- Measure: connects per hour, voicemail-to-reply rate, callback rate.
- Compliance: ringless voicemail and auto-dialed calls to mobile numbers raise TCPA and state-law questions. Legal review before launch.

**The rep's day with these in place:** inboxes run on their own, so reps spend the morning on the dialer (Tier 1 contacts plus Tier 2 contacts who engaged), LinkedIn mid-day, and AE discovery in the afternoon.

## Blind spots, data needed, and the first 90 days

The biggest unasked question is account-level coordination: three products, two reps and an automated sender all touching the same enterprise account with no shared cap or owner.

**Blind spots:**

- **Account collision.** Opendock, ShipperGuide and Loadsmart AI emails can land on the same team in the same week. Add an account-level touch cap and one account owner who sees all three threads.
- **Existing customers.** An ABM account may already use one Loadsmart product. That is a cross-sell with a warm reference, and it needs the account manager in the loop, not a cold sequence.
- **Disqualification as an escape hatch.** Reps can drop hard accounts. Reason codes plus a monthly review of dropped accounts keep the list honest.
- **AI sameness up-market.** Enterprise buyers get many AI-written emails. Evidence-only personalization, rep approval of batches, and calls carrying the weight matter more than volume.
- **Deliverability.** Moving up-market with automated sends needs domain health, mailbox caps and warm-up, monitored weekly.
- **The buying committee.** Loadsmart AI deals will pull in IT and security (system access to the TMS/WMS). Have a security and data-access one-pager ready before the first meeting.
- **The carrier-side network.** Opendock's carrier and facility network may be the strongest signal and intro path available, if product data can be shared with Sales.
- **Prompt and model drift.** Claude's selection and copy prompts need version control and a changelog, so a result can be tied to the prompt that produced it.
- **Compliance.** Opt-out and postal address on every email; check CASL if Canadian accounts are in scope (needs legal review).

**Data to see before committing to recommendations:**

- [ ] Closed-won and closed-lost for the last 24 months, by product, industry, size and source.
- [ ] The current account-selection prompt, its inputs, and the 20-account lists per pod since launch.
- [ ] Pod disqualifications with reasons; contacts per account per persona.
- [ ] Gong email stats per pod and step; call and LinkedIn task completion.
- [ ] Meetings and stage 2 opportunities from ABM accounts vs other outbound.
- [ ] Which ABM accounts are existing customers of any Loadsmart product.
- [ ] Approved proof points and references per product from Marketing.

**30 / 60 / 90:**

| Window | Focus | Done when |
| --- | --- | --- |
| Days 1–30 | Diagnose and baseline: day in each pod, one-time CRM audit and ICP scoring, write ICP + persona map, audit current lists; buy sending domains and start mailbox warm-up on day 1 (it takes 2 to 3 weeks) | Baseline dashboard live; ICP v1 approved by Sales, Marketing, RevOps |
| Days 31–60 | Standardize: ship the 7-step daily pipeline in n8n/Make with approval gates; unify email, call and LinkedIn steps in one flow; launch voicemail drop after legal review; ramp warmed inboxes toward 50/day; start the signal holdout test and the Tier 2 scaled lane | All pods on one flow; reason codes at 90%+ of disqualifications |
| Days 61–90 | Optimize: tune scoring on outcomes, read the signal test, roll winners to all pods, first monthly program review | Signal test read out; changelog shows 3+ shipped improvements tied to metrics |

**Sources:** Loadsmart case brief (Loadsmart, Nov 9, 2026); Loadsmart Sales Motion Workflow (Patrick Diamitani, Nov 2026); Loadsmart GTM product and buyer notes (claims marked for verification).
