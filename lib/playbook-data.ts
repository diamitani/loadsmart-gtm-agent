export type IcpRow = {
  field: string;
  definition: string;
  validationSource: string;
};

export type PersonaSpec = {
  product: string;
  scope: string;
  personaId: string;
  titles: string;
  department: string;
  decisionRole: string;
  goals: string;
  painAssumed: string;
  triggers: string;
  objections: string;
  channels: string;
  secondary: string;
  excludedTitles: string;
  softCta: string;
  proofSlot: string;
};

export type PipelineStepRow = {
  step: string;
  skill: string;
  runs: string;
  reads: string;
  writes: string;
  gate: string;
};

export type CadenceRow = {
  day: string;
  channel: string;
  step: string;
  owner: string;
};

export type SignalRow = {
  signal: string;
  source: string;
  opens: string;
  whyNow: string;
};

export type DiagnosisRow = {
  stage: string;
  check: string;
  redFlag: string;
  rootCause: string;
};

export type ScorecardRow = {
  metric: string;
  definition: string;
  target: string;
};

export type KpiRow = {
  team: string;
  kpi: string;
  leading: string;
  source: string;
  cadence: string;
  owner: string;
};

export type ToolRow = {
  tool: string;
  action: "Keep" | "Change" | "Expand" | "Add" | "Consolidate";
  role: string;
};

export type RoadmapRow = {
  window: string;
  focus: string;
  doneWhen: string;
};

export const operatingRules = [
  "Nothing sends or writes to Salesforce without an explicit human approval gate.",
  "Every draft focuses on one Loadsmart product, one persona, and one sourced reason to reach out.",
  "Missing proof stays a [placeholder] until Loadsmart Marketing & Legal assign a C-XXX ID in claims-library.md.",
  "Account priority = Fit score x Timing score (30/60/90-day decay) x Persona coverage (2+ of 3 products).",
];

export const icpRows: IcpRow[] = [
  {
    field: "Segment",
    definition: "Enterprise and upper mid-market shippers (moving up-market)",
    validationSource: "Salesforce closed-won by revenue band",
  },
  {
    field: "Industries",
    definition: "Food & beverage, CPG, retail, manufacturing, wholesale & distribution",
    validationSource: "Confirm top 5 by closed-won count and freight spend",
  },
  {
    field: "Company Size",
    definition: "Revenue, freight spend, and employee thresholds derived from closed-won",
    validationSource: "Closed-won + ZoomInfo firmographics",
  },
  {
    field: "Footprint",
    definition: "2+ warehouses or distribution centers; meaningful FTL / LTL load volume",
    validationSource: "ZoomInfo, SEC 10-K filings, operational job posts",
  },
  {
    field: "Tech Context",
    definition: "Existing TMS, WMS, or YMS stack (Loadsmart AI deploys on top of existing systems)",
    validationSource: "ZoomInfo technographics and hiring keywords",
  },
  {
    field: "Geography",
    definition: "United States and Canada (Canada requires CASL compliance check)",
    validationSource: "Salesforce sales territories",
  },
  {
    field: "Exclusions",
    definition: "Current customers of same product, open opps elsewhere, brokers/3PLs, opt-outs",
    validationSource: "Salesforce Account & Opportunity shield + suppression list",
  },
];

export const scoringWeights = [
  { factor: "Industry Match", weight: "0.30", dimension: "Fit Score" },
  { factor: "Company Size & Freight Spend", weight: "0.25", dimension: "Fit Score" },
  { factor: "Multi-Site Warehouse Footprint", weight: "0.25", dimension: "Fit Score" },
  { factor: "Existing TMS / WMS / YMS Stack", weight: "0.20", dimension: "Fit Score" },
  { factor: "Signal Decay Window", weight: "30 / 60 / 90d", dimension: "Timing Score" },
  { factor: "Multi-Thread Threshold", weight: "2 of 3 Personas", dimension: "Coverage Score" },
];

export const personas: PersonaSpec[] = [
  {
    product: "Opendock",
    scope: "Dock, Gate & Yard Scheduling",
    personaId: "ops_dock",
    titles: "Warehouse / DC Ops Manager, Director of Distribution, Site GM",
    department: "Warehouse & Distribution Operations",
    decisionRole: "Champion at site; economic buyer is Regional or VP Operations",
    goals: "Dock throughput, on-time appointments, lower carrier detention and dwell",
    painAssumed: "Trucks waiting at the gate, phone/email appointment booking, detention fees",
    triggers: "New DC or site opening, detention cost spike, new ops leader, WMS change",
    objections: "\"Carriers won't use another portal\"; \"Our WMS already handles that\"",
    channels: "Phone (floor-accessible), LinkedIn, Email",
    secondary: "Receiving Supervisor, Inbound Transportation Coordinator",
    excludedTitles: "IT, Software, Sales, Marketing, HR",
    softCta: "Worth comparing notes on how your sites book inbound?",
    proofSlot: "[Opendock customer result, approved by Marketing]",
  },
  {
    product: "ShipperGuide",
    scope: "Enterprise Transportation Management (TMS)",
    personaId: "transport_tms",
    titles: "Transportation Manager, Director of Transportation, Logistics Manager",
    department: "Transportation & Logistics",
    decisionRole: "Champion and technical evaluator; VP signs",
    goals: "Cost per load, tender acceptance, on-time delivery",
    painAssumed: "Planning across spreadsheets and disconnected tools, manual spot tendering",
    triggers: "TMS contract renewal, freight RFP season, hiring freight analysts, new transport lead",
    objections: "\"We just implemented a TMS\"; high perceived switching cost",
    channels: "Email, Phone, Industry events",
    secondary: "Procurement, Finance / Freight Audit",
    excludedTitles: "Warehouse Associate, Driver, Sales",
    softCta: "Open to a 20-minute look at how teams run tendering in one place?",
    proofSlot: "[ShipperGuide customer result, approved by Marketing]",
  },
  {
    product: "Loadsmart AI",
    scope: "Autonomous Logistics Agents",
    personaId: "supply_chain_exec",
    titles: "VP Supply Chain, VP Logistics, Head of Transportation Ops, CSCO",
    department: "Supply Chain Executive Leadership",
    decisionRole: "Economic buyer; pulls in IT and the core TMS owner",
    goals: "Freight cost reduction, team capacity, exception handling speed",
    painAssumed: "Repetitive carrier follow-ups, spot check calls, and manual tracking consume staff",
    triggers: "AI/automation mandate, headcount freeze, new VP Supply Chain, 10-K freight focus",
    objections: "\"AI isn't reliable for freight\"; system data access and IT security",
    channels: "Email, LinkedIn, Executive referral",
    secondary: "IT / Systems Owner, CFO",
    excludedTitles: "Intern, Coordinator",
    softCta: "Would it help to see which follow-ups an agent could take on your next 100 loads?",
    proofSlot: "[Loadsmart AI result + methodology, approved by Marketing]",
  },
];

export const personaComparisonFields: {
  label: string;
  key: keyof PersonaSpec;
}[] = [
  { label: "Target Titles", key: "titles" },
  { label: "Excluded Titles", key: "excludedTitles" },
  { label: "Department", key: "department" },
  { label: "Decision Role", key: "decisionRole" },
  { label: "Goals & KPIs", key: "goals" },
  { label: "Assumed Pains", key: "painAssumed" },
  { label: "Buying Triggers", key: "triggers" },
  { label: "Likely Objections", key: "objections" },
  { label: "Primary Channels", key: "channels" },
  { label: "Secondary Contacts", key: "secondary" },
  { label: "Soft CTA", key: "softCta" },
];

export const pipelineSteps: PipelineStepRow[] = [
  {
    step: "0",
    skill: "la-crm-audit",
    runs: "Week 1 + Quarterly",
    reads: "Full Salesforce Account, Contact, Opportunity schema",
    writes: "Fit scores, tiers, persona tags on existing CRM records",
    gate: "RevOps approves write-back",
  },
  {
    step: "1",
    skill: "la-signal",
    runs: "Daily 06:00 CT",
    reads: "icp.yaml + Perplexity / SEC EDGAR / job boards",
    writes: "Signal__c rows with source URL, date, product match",
    gate: "Read-only (URL required)",
  },
  {
    step: "2",
    skill: "la-abm-tag",
    runs: "Mon 06:30 CT",
    reads: "Signal scores, CRM clearance, pod capacity (20 accts/pod)",
    writes: "ABM_Account__c, ABM_Pod__c, ABM_Reason__c",
    gate: "RevOps approves weekly list",
  },
  {
    step: "3",
    skill: "la-persona-enrich",
    runs: "Daily 07:00 CT",
    reads: "Cleared ABM accounts missing 2+ product personas",
    writes: "Verified contacts tagged Persona__c + Product__c",
    gate: "Verified corporate email only",
  },
  {
    step: "4",
    skill: "la-research",
    runs: "Daily 07:30 CT",
    reads: "Enriched contacts, dated signals, 10-K & news",
    writes: "6-part Research_Brief__c with source URLs",
    gate: "Evidence ledger check",
  },
  {
    step: "5",
    skill: "la-email",
    runs: "Daily 08:00 CT",
    reads: "Research brief, persona map, claims-library.md",
    writes: "AI_Email_1__c (body only, <= 90–120 words)",
    gate: "Truth Linter + QA rules",
  },
  {
    step: "6",
    skill: "la-sequence",
    runs: "Daily 08:30 CT",
    reads: "Linted AI_Email_1__c + verified persona slots",
    writes: "Gong flow enrollment + dialer & LinkedIn tasks",
    gate: "Pod SDR approves batch",
  },
  {
    step: "7",
    skill: "la-daily-report",
    runs: "Daily 17:00 CT",
    reads: "Gong sequence stats + Salesforce activity",
    writes: "Pod metrics, leak flags, EOD Slack digest",
    gate: "Read-only",
  },
];

export const podDailyRhythm = [
  {
    time: "08:45 CT",
    owner: "AE + SDR",
    activity: "Open pod view: review prioritized call & LinkedIn queue already staged in Gong flow.",
  },
  {
    time: "09:00–11:00 CT",
    owner: "SDR",
    activity: "Power dialer block on contacts whose Email 1 fired 2+ days ago; drop persona voicemails.",
  },
  {
    time: "11:00–11:30 CT",
    owner: "SDR",
    activity: "Send copilot-drafted LinkedIn connection notes and follow-up DMs (no pitch links).",
  },
  {
    time: "Afternoon",
    owner: "AE + SDR",
    activity: "AE runs discovery & multi-threads 2nd/3rd product personas; SDR runs second dialer block.",
  },
  {
    time: "16:30 CT",
    owner: "AE + SDR",
    activity: "Log disqualifications with standardized reason codes and 1-line notes for weekly feedback loop.",
  },
];

export const gongCadence: CadenceRow[] = [
  {
    day: "Day 1",
    channel: "Email",
    step: "AI Email 1: dated signal + persona pain + soft CTA (body only)",
    owner: "Automated (rep-approved batch)",
  },
  {
    day: "Day 1",
    channel: "LinkedIn",
    step: "Profile view + connection note (no pitch, no link)",
    owner: "SDR",
  },
  {
    day: "Day 3",
    channel: "Phone",
    step: "Call 1 via power dialer referencing Email 1 signal + persona voicemail drop",
    owner: "SDR",
  },
  {
    day: "Day 4",
    channel: "Email",
    step: "Email 2: one approved proof point or operational use case for same persona",
    owner: "Automated",
  },
  {
    day: "Day 6",
    channel: "Phone + LinkedIn",
    step: "Call 2 + LinkedIn DM if connection accepted",
    owner: "SDR",
  },
  {
    day: "Day 8",
    channel: "Email",
    step: "Email 3: multi-thread bridge referencing outreach to peer product persona",
    owner: "Automated",
  },
  {
    day: "Day 10",
    channel: "Phone",
    step: "Call 3 executive touch by AE on top-10 priority pod accounts",
    owner: "AE",
  },
  {
    day: "Day 12",
    channel: "Email",
    step: "Close-the-loop email leaving the door open cleanly",
    owner: "Automated",
  },
];

export const outreachScripts = {
  emailBodyTemplate: `Hi [First Name],

{{AI_Email_1}}   <- 2 short paragraphs: dated signal + why it matters to this persona + 1 soft question

[Rep first name]
[Rep title], Loadsmart
[Opt-out line] · [Postal address]`,
  sampleOpendockBody: `Saw that [Company] is opening [new DC / site from signal]. New sites usually start with inbound appointments booked by phone and email, which is where gate waits and detention creep in.

Teams like [approved reference] moved booking to self-serve carrier scheduling. Worth comparing notes on how [new site] will handle inbound?`,
  linkedinNotes: [
    {
      product: "Opendock",
      length: "196 chars",
      note: "Hi [First Name], I work with warehouse ops leaders on dock scheduling and gate flow. Saw [Company] is [signal]. Would be glad to connect and swap notes on how other sites run inbound appointments.",
    },
    {
      product: "ShipperGuide",
      length: "152 chars",
      note: "Hi [First Name], I spend my days with transportation teams on planning and tendering workflows. Noticed [signal] at [Company]. Would be glad to connect.",
    },
    {
      product: "Loadsmart AI",
      length: "164 chars",
      note: "Hi [First Name], I work with supply chain leaders looking at where AI agents can take repetitive freight work off their teams. Saw [signal]. Would value connecting.",
    },
  ],
  callOpener:
    "Hi [First Name], it's [Rep] from Loadsmart, this is a cold call, can I have 30 seconds and you can tell me if it's worth more? I sent a note about [signal]. Usually when [signal] happens, [persona] teams run into [pain]. Is that on your plate right now, or am I off?",
  stage2ExitCriteria: [
    "Confirmed operational pain owned by the target persona",
    "Dated trigger or active company initiative",
    "Economic buyer identified by name and title",
    "Current TMS / WMS / manual workflow named",
    "Agreed next step locked on the calendar",
  ],
};

export const signalTable: SignalRow[] = [
  {
    signal: "New DC, warehouse, or plant announced",
    source: "Press releases, local permits, site GM job posts",
    opens: "Opendock",
    whyNow: "New sites configure dock scheduling rules from day one.",
  },
  {
    signal: "Volume hiring in warehouse / receiving / yard roles",
    source: "Job boards, LinkedIn Jobs",
    opens: "Opendock",
    whyNow: "Indicates throughput pressure and trailer queue friction.",
  },
  {
    signal: "Hiring transportation managers or freight analysts",
    source: "Job boards, career pages",
    opens: "ShipperGuide",
    whyNow: "Team scaling creates urgency to retire spreadsheet tendering.",
  },
  {
    signal: "Job posts naming a TMS or replacement initiative",
    source: "Job post text, ZoomInfo technographics",
    opens: "ShipperGuide",
    whyNow: "Active TMS evaluation or displacement window is open.",
  },
  {
    signal: "New VP / Head of Supply Chain or Logistics",
    source: "Sales Navigator leadership alerts",
    opens: "Loadsmart AI",
    whyNow: "New executives set transformation mandates in their first 90 days.",
  },
  {
    signal: "10-K / earnings call cites freight cost or headcount discipline",
    source: "SEC EDGAR 10-K & earnings transcripts",
    opens: "Loadsmart AI",
    whyNow: "Board-level cost mandate aligns directly with autonomous agents.",
  },
  {
    signal: "Research intent on dock scheduling, TMS, or freight AI",
    source: "ZoomInfo intent topics",
    opens: "Matching product",
    whyNow: "Active buying-committee research underway.",
  },
  {
    signal: "Shipper facilities or carriers already touch Opendock network",
    source: "Internal Loadsmart product telemetry (to validate)",
    opens: "Opendock -> Cross-sell",
    whyNow: "Warmest possible entry with live network overlap.",
  },
  {
    signal: "Email reply, site visit, or Sightline event attendance",
    source: "Gong, web analytics, Marketing",
    opens: "Matching product",
    whyNow: "Direct buyer hand-raise requiring immediate follow-up.",
  },
];

export const diagnosisStages: DiagnosisRow[] = [
  {
    stage: "1. Account Selection",
    check: "Claude's prompt inputs, overlap with closed-won, pod disqualification rate",
    redFlag: "Pods disqualify >20% of accounts or repeat same reason code",
    rootCause: "No written ICP; lookalike relies only on uncalibrated LLM prompts.",
  },
  {
    stage: "2. Signal / Timing",
    check: "Dated reason to reach out within the last 90 days",
    redFlag: "Accounts flagged with no trigger or stale events >90 days",
    rootCause: "Static fit-only list creates polite 'not right now' replies.",
  },
  {
    stage: "3. Persona Coverage",
    check: "Verified contacts mapped per account and per product",
    redFlag: "Only 1 product covered or wrong function (e.g., IT pitched Opendock)",
    rootCause: "Keyword title pulls instead of role-to-product persona mapping.",
  },
  {
    stage: "4. Contact Data",
    check: "Hard bounce rate, title accuracy, job-change freshness",
    redFlag: "Hard bounce >2–3% or frequent 'left the company' replies",
    rootCause: "Missing email verifier gate before Gong sequence enrollment.",
  },
  {
    stage: "5. Research & Copy",
    check: "Sourced opening fact and strict 1-product persona match",
    redFlag: "Generic openers; high opens paired with near-zero replies",
    rootCause: "No 6-part research brief step between enrichment and copywriting.",
  },
  {
    stage: "6. Sending & Sequence",
    check: "Domain health, mailbox volume caps, unified step completion",
    redFlag: "Spam placement or calls/LinkedIn omitted from tracking",
    rootCause: "Email automated in Gong while calls/LinkedIn sit outside the sequence.",
  },
  {
    stage: "7. Rep Follow-Through",
    check: "Completion rate on manual dialer and LinkedIn queue tasks",
    redFlag: "<70% of call/LinkedIn tasks finished within 2 business days",
    rootCause: "Tasks scattered across tools rather than staged in one daily pod queue.",
  },
  {
    stage: "8. Meeting to Pipeline",
    check: "Meetings held rate and Stage 1 -> Stage 2 conversion by product",
    redFlag: "Booked meetings fail to convert into qualified Stage 2 opps",
    rootCause: "Wrong buyer persona engaged or inconsistent qualification criteria.",
  },
];

export const qualityScorecard: ScorecardRow[] = [
  { metric: "Pod acceptance rate", definition: "Accounts kept / accounts assigned", target: "80%+ (starting assumption)" },
  { metric: "Persona coverage", definition: "Accounts with 2+ of 3 product personas verified", target: "70%+" },
  { metric: "Verified email rate", definition: "Verified emails / contacts enrolled", target: "95%+" },
  { metric: "Hard bounce rate", definition: "Hard bounces / emails delivered", target: "< 2.0%" },
  { metric: "Title accuracy", definition: "Weekly 20-contact pod spot check in right function", target: "90%+" },
];

export const kpiMatrix: KpiRow[] = [
  {
    team: "Pods (SDR)",
    kpi: "Meetings held per pod / week",
    leading: "Call & LinkedIn tasks finished <= 2d, connects, positive replies",
    source: "Gong + Salesforce Events",
    cadence: "Daily / Weekly",
    owner: "SDR + Pod AE",
  },
  {
    team: "Pods (AE)",
    kpi: "Stage 2 ABM opportunities by product",
    leading: "Accounts with 2+ personas engaged, discovery calls held",
    source: "Salesforce Opportunities",
    cadence: "Weekly",
    owner: "AE",
  },
  {
    team: "RevOps",
    kpi: "Pipeline ($) per ABM account worked",
    leading: "Persona coverage %, verified email %, hard bounce %",
    source: "Salesforce + Enricher",
    cadence: "Weekly / Monthly",
    owner: "RevOps",
  },
  {
    team: "Marketing",
    kpi: "Reply rate by product and persona",
    leading: "Email 1 vs 2 vs 3 reply share, objection themes",
    source: "Gong Engage",
    cadence: "Weekly",
    owner: "Marketing",
  },
  {
    team: "Leadership",
    kpi: "ABM vs. non-ABM pipeline & cost per opp",
    leading: "Account velocity (signal to first held meeting in days)",
    source: "Salesforce + Gong",
    cadence: "Monthly",
    owner: "Sales Leadership",
  },
];

export const toolsTable: ToolRow[] = [
  { tool: "Salesforce", action: "Keep", role: "System of record: ABM flags, Signal__c, Persona__c, Research_Brief__c, reason codes" },
  { tool: "Claude", action: "Change", role: "Shift from ad-hoc prompts to scheduled, versioned judgment skills" },
  { tool: "ZoomInfo", action: "Keep", role: "Firmographics, technographics, intent topics, first-pass contact pull" },
  { tool: "Clay", action: "Expand", role: "Multi-vendor waterfall (ZoomInfo -> Apollo -> Hunter -> Prospeo), verifier, signal enrichment" },
  { tool: "Apollo", action: "Keep", role: "Secondary waterfall source to fill ZoomInfo coverage gaps" },
  { tool: "Sales Navigator", action: "Keep", role: "Leadership-change alerts and SDR social engagement" },
  { tool: "Gong Engage", action: "Keep", role: "Unified email + call + LinkedIn task queue and call recording tags" },
  { tool: "Salesloft", action: "Consolidate", role: "Eliminate dual-sequencer data split; consolidate onto one sender" },
  { tool: "n8n", action: "Add", role: "Deterministic 6-step orchestrator: schedules, retries, CRM shields, mailbox caps" },
  { tool: "Email Verifier + 5 Inboxes", action: "Add", role: "Warmed secondary sending domains ramping to 50/day/inbox (<2% bounce cap)" },
];

export const roadmap306090: RoadmapRow[] = [
  {
    window: "Days 1–30 · Diagnose & Baseline",
    focus: "Day-in-the-pod observation, one-time CRM audit (la-crm-audit), write ICP v1 & persona matrix, buy secondary sending domains & start 3-week mailbox warm-up.",
    doneWhen: "Baseline pod dashboard live; ICP v1 and claims workflow signed off by Sales, Marketing, and RevOps.",
  },
  {
    window: "Days 31–60 · Standardize & Automate",
    focus: "Deploy 6-step n8n prospect workflow with REQUIRE_APPROVAL=true, unify email/call/LinkedIn in Gong, start 4–6 week signal holdout test & Tier-2 scaled lane.",
    doneWhen: "All pods operate on one ordered daily queue; 90%+ disqualifications carry structured reason codes.",
  },
  {
    window: "Days 61–90 · Optimize & Scale",
    focus: "Tune ICP scoring weights from Stage 2 closed outcomes, read out signal holdout winners, roll out winning signal sources and rep-authored skills team-wide.",
    doneWhen: "Signal holdout readout complete; version changelog shows 3+ metric-backed prompt/workflow upgrades.",
  },
];
