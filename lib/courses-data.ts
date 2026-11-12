export type CourseTrackId = "harness" | "gtm";

export interface CourseLesson {
  id: string;
  track: CourseTrackId;
  number: string;
  title: string;
  duration: string;
  roleFocus: string;
  summary: string;
  keyTakeaways: string[];
  loadsmartScenario: string;
  artifactTitle: string;
  artifactFilename: string;
  artifactLanguage: "markdown" | "json" | "bash";
  artifactCode: string;
  repChecklist: string[];
}

export interface CourseTrack {
  id: CourseTrackId;
  title: string;
  subtitle: string;
  audience: string;
  lessonCount: number;
  description: string;
}

export const COURSE_TRACKS: CourseTrack[] = [
  {
    id: "harness",
    title: "Agent Harness Mastery",
    subtitle: "Claude Code for Loadsmart Pods & RevOps",
    audience: "RevOps Engineers · Technical AEs · Pod Leads",
    lessonCount: 8,
    description:
      "Adapted from LetsVibeAI's flagship harness curriculum for Loadsmart's freight GTM stack. Master context files, 5-part production prompts, portable SKILL.md folders, MCP connectors, custom commands, subagents, and deterministic PreToolUse governance.",
  },
  {
    id: "gtm",
    title: "Mastering Claude for GTM",
    subtitle: "Chat, Cowork, Projects & Loadsmart Skills",
    audience: "Enterprise AEs · SDR Pods · Sales Enablement",
    lessonCount: 5,
    description:
      "Transform every Loadsmart rep from a single-prompt typist into an AI workflow director using Claude Chat, Desktop Cowork, Shared Pod Projects, and our 42-skill marketplace across Opendock, ShipperGuide, and Loadsmart AI.",
  },
];

export const COURSE_LESSONS: CourseLesson[] = [
  // =========================================================================
  // TRACK 1: AGENT HARNESS MASTERY (8 LESSONS — LETSVIBEAI -> LOADSMART)
  // =========================================================================
  {
    id: "harness-01-setup",
    track: "harness",
    number: "01",
    title: "Pick and Install Your Harness",
    duration: "14 min · Setup Lab",
    roleFocus: "RevOps & Pod Leads",
    summary:
      "Understand the 5 layers of every AI harness (Model, Context, Capabilities, Surfaces, Orchestration) and stand up a clean, version-controlled Loadsmart workspace before writing a single prompt.",
    keyTakeaways: [
      "The model thinks; the harness supplies files, tools, permissions, and verification.",
      "Always initialize a git repo first (`git init`) so every skill, config, and sequence edit is reversible.",
      "Keep separate working folders per Loadsmart pod or workflow so context stays sharp.",
      "Use the PAL spine on day one: Plan the outcome, Act with scoped tools, Verify before shipping.",
    ],
    loadsmartScenario:
      "Your Opendock AE pod wants a local workspace to test `la-signal` and generate account briefs without accidentally modifying production Salesforce configs.",
    artifactTitle: "Loadsmart Pod Workspace Bootstrap Commands",
    artifactFilename: "bootstrap-loadsmart-workspace.sh",
    artifactLanguage: "bash",
    artifactCode: `# 1. Install Claude Code CLI (macOS / Linux)
curl -fsSL https://claude.ai/install.sh | bash

# 2. Initialize a clean, reversible Loadsmart Pod workspace
mkdir -p loadsmart-pod-workspace/.claude/skills
cd loadsmart-pod-workspace
git init

# 3. Verify harness + run your first read-only audit prompt
claude "Inspect this folder, read config/icp.yaml if present, and propose a 3-step morning prep plan for Opendock Pod 3 without editing any files."`,
    repChecklist: [
      "Install Claude Code CLI (or open Cursor / Claude Desktop Code tab).",
      "Run `git init` inside your Loadsmart GTM workspace folder.",
      "Run one read-only territory planning prompt before making edits.",
    ],
  },
  {
    id: "harness-02-context-files",
    track: "harness",
    number: "02",
    title: "Context Files That Remember (CLAUDE.md)",
    duration: "16 min · Context Architecture",
    roleFocus: "All Reps & RevOps",
    summary:
      "Replace repetitive onboarding explanations with a concise `CLAUDE.md` file under 200 lines containing the four sections that govern every Loadsmart session.",
    keyTakeaways: [
      "Keep `CLAUDE.md` under 200 lines—treat it as high-signal memory, not a multi-page wiki.",
      "Include four essential sections: (1) Products & Stack, (2) Always / Never Rules, (3) Key File Locations, (4) Verification Checks.",
      "Link deeper playbooks and YAML configs cleanly by path so Claude reads them on demand.",
      "Explicitly ban mixing Carrier-side products into Shipper pod outreach and enforce `claims-library.md`.",
    ],
    loadsmartScenario:
      "New SDRs keep pasting 4-paragraph Loadsmart product descriptions at the start of every prompt—sometimes accidentally pitching ShipperGuide TMS to an Opendock dock prospect.",
    artifactTitle: "Loadsmart Pod CLAUDE.md Template (<200 lines)",
    artifactFilename: "CLAUDE.md",
    artifactLanguage: "markdown",
    artifactCode: `# Loadsmart GTM Pod Operating Context

## 1. Products & Stack
- Shipper Pods sell: Opendock (dock/yard scheduling), ShipperGuide TMS, Loadsmart AI, Freight Services.
- Carrier-side products (CarrierGuide, Loadboard, Factoring) are OUT OF SCOPE.
- Stack: Salesforce (CRM Shield), ZoomInfo + Clay Waterfall, Perplexity/EDGAR, Claude, Gong/Apollo.

## 2. Always / Never Guardrails
- ALWAYS check Salesforce collision status before enriching contacts.
- ALWAYS require a dated source_url for every buying signal.
- NEVER ship customer counts, savings %, or ROI claims unless cited by ID in knowledge/loadsmart/claims-library.md.
- NEVER auto-send emails or write Salesforce Opportunities without explicit human confirmation (REQUIRE_APPROVAL=true).

## 3. Workspace Map
- kit/config/icp.yaml          -> ICP scoring weights & exclusions
- knowledge/loadsmart/         -> Approved Claims Library & battlecards
- kit/skills/                  -> Portable SKILL.md pipeline steps

## 4. Verification Before Done
- Touch 1 outbound copy <= 90 words, single Loadsmart product only.
- Run Claims Linter & word check before queuing into Slack/Gong.`,
    repChecklist: [
      "Run `/init` or paste the Loadsmart `CLAUDE.md` template into your workspace root.",
      "Verify all 4 sections exist and total line count stays below 200 lines.",
      "Test asking Claude 'Which Loadsmart products are out of scope?' to confirm memory loads automatically.",
    ],
  },
  {
    id: "harness-03-prompts",
    track: "harness",
    number: "03",
    title: "Prompts That Survive Production",
    duration: "18 min · Prompt Engineering",
    roleFocus: "AEs, SDRs & Enablement",
    summary:
      "Move past fragile one-liners using the 5-Part Production Prompt structure and LetsVibeAI's Plan -> Correct -> Execute -> Verify loop (`Shift+Tab`).",
    keyTakeaways: [
      "Every production prompt specifies 5 parts: Role, Goal, Constraints, Reference Examples, and Output Format.",
      "Press `Shift+Tab` to enter Plan Mode first—catch misdirected targeting before burning Clay or Perplexity lookups.",
      "Know when to iterate vs restart cleanly (`/clear` when changing accounts or product lines).",
      "Anchor examples to real Loadsmart freight triggers (new DC permits, TMS job postings, 10-K freight mandates).",
    ],
    loadsmartScenario:
      "Preparing personalized outreach for a Midwest cold-storage shipper opening two automated facilities in Dallas.",
    artifactTitle: "5-Part Loadsmart Outbound Prompt Blueprint",
    artifactFilename: "loadsmart-5part-prompt.md",
    artifactLanguage: "markdown",
    artifactCode: `Role: Loadsmart Enterprise Pod Strategist specializing in Opendock dock scheduling.

Goal: Produce a 6-part account brief and two Touch-1 email options for a Director of Warehouse Operations at a cold-storage shipper expanding into Dallas.

Constraints:
- Pitch Opendock ONLY (do not bundle ShipperGuide TMS or CarrierGuide).
- <= 85 words per email; lowercase 3-word subject line.
- Zero unapproved Loadsmart metrics unless assigned an ID in knowledge/loadsmart/claims-library.md.
- Flag any missing public dock count as "unknown" instead of estimating.

Examples / References:
- Read kit/skills/prospect-step-4-research/SKILL.md
- Read kit/skills/prospect-step-5-email/SKILL.md

Output Format:
1. Evidence Table (claim, source_url, event_date)
2. Email Option A (detention/turn-time angle)
3. Email Option B (carrier self-scheduling angle)
4. Claims Linter Pass/Fail checklist`,
    repChecklist: [
      "Toggle Plan Mode (`Shift+Tab`) and review the agent's research plan before execution.",
      "Inspect the Evidence Table to confirm zero guessed warehouse counts.",
      "Use `/clear` before switching from an Opendock account to a ShipperGuide TMS account.",
    ],
  },
  {
    id: "harness-04-skills",
    track: "harness",
    number: "04",
    title: "Skills: Package Your Team Expertise",
    duration: "20 min · Modular Capabilities",
    roleFocus: "RevOps & Top Performing Reps",
    summary:
      "Turn repeatable Loadsmart playbooks into portable `SKILL.md` folders (<500 lines) with crisp trigger descriptions that work across Claude Code, Claude Desktop, and Web.",
    keyTakeaways: [
      "A Skill packages instructions, rubrics, and reference scripts into one folder any teammate can install via `.zip`.",
      "Use Progressive Disclosure: keep `SKILL.md` focused (<500 lines) and push heavy schemas/examples into `references/`.",
      "Write clear YAML `description` triggers so the harness loads the right skill only when relevant.",
      "Test every skill with edge-case prompts (e.g., an account already marked `Customer` in Salesforce).",
    ],
    loadsmartScenario:
      "Your top SDR books 2x more Opendock meetings using a specific 10-K + warehouse permit research checklist. You package it so all 4 pods run the exact workflow.",
    artifactTitle: "Portable Loadsmart Dock Audit SKILL.md",
    artifactFilename: "SKILL.md",
    artifactLanguage: "markdown",
    artifactCode: `---
name: dock-expansion-brief
description: Use when a Loadsmart rep needs an Opendock facility expansion brief and PAS draft triggered by a new warehouse opening, permit, or site GM job post.
---

# Dock Expansion Brief (Opendock)

## Trigger Check
Verify the trigger includes a source URL, city/state, and event date within 90 days.

## Execution Steps
1. Query Salesforce collision status first; stop immediately if Type = Customer or Open Opportunity exists.
2. Pull facility square footage, dock door clues (if public), and seasonal freight peaks.
3. Draft one <= 85-word Opendock email citing only verified public facts plus approved C-XXX claims.

## Output Gate
Display a Pre-Send Verification block showing: [CRM Clear], [Source URL], [Word Count <= 90], [Product = Opendock Only].`,
    repChecklist: [
      "Download one skill `.zip` from the Loadsmart Skills Marketplace.",
      "Inspect its YAML frontmatter description and Progressive Disclosure length.",
      "Package one repetitive weekly pod task into your own `.claude/skills/<name>/SKILL.md`.",
    ],
  },
  {
    id: "harness-05-connectors-mcp",
    track: "harness",
    number: "05",
    title: "Connectors & MCP for Loadsmart's Stack",
    duration: "17 min · Tool Integration",
    roleFocus: "RevOps & Sales Systems",
    summary:
      "Connect Claude Code directly to Salesforce, Gong, Clay, Slack, and n8n using Model Context Protocol (MCP) with clean `.mcp.json` project scoping and zero hardcoded secrets.",
    keyTakeaways: [
      "Install HTTP/SSE connectors cleanly via `claude mcp add --transport http <name> <url>`.",
      "Understand the 3 scopes: Local (private test), Project (`.mcp.json` shared with the pod in git), and User (personal tools).",
      "Always pass API tokens via `${ENV_VAR}` placeholders in `.mcp.json`—never commit plaintext keys.",
      "Apply least privilege: mount Salesforce MCP with read-only SOQL + Task logging, blocking raw Opportunity mutation.",
    ],
    loadsmartScenario:
      "Enabling Pod AEs to query Salesforce collision status and recent Gong call objections directly inside Claude Code before drafting outreach.",
    artifactTitle: "Team-Shared Loadsmart .mcp.json Blueprint",
    artifactFilename: ".mcp.json",
    artifactLanguage: "json",
    artifactCode: `{
  "mcpServers": {
    "loadsmart-salesforce-shield": {
      "type": "http",
      "url": "https://mcp.internal.loadsmart.com/salesforce-readonly",
      "headers": {
        "Authorization": "Bearer \${LOADSMART_SF_MCP_TOKEN}"
      }
    },
    "loadsmart-gong-calls": {
      "type": "http",
      "url": "https://mcp.internal.loadsmart.com/gong",
      "headers": {
        "Authorization": "Bearer \${LOADSMART_GONG_TOKEN}"
      }
    },
    "loadsmart-n8n-trigger": {
      "type": "http",
      "url": "\${N8N_INSTANCE_MCP_URL}",
      "headers": {
        "X-N8N-API-KEY": "\${N8N_MCP_API_KEY}"
      }
    }
  }
}`,
    repChecklist: [
      "Run `claude mcp list` to inspect active servers and token scopes.",
      "Confirm `.env` is listed in `.gitignore` and zero plaintext tokens sit inside `.mcp.json`.",
      "Verify Salesforce connector enforces read-only collision lookup before any enrichment run.",
    ],
  },
  {
    id: "harness-06-commands",
    track: "harness",
    number: "06",
    title: "Commands, Prompts & Pod Workflows",
    duration: "15 min · Team Automation",
    roleFocus: "Pod Leads & SDRs",
    summary:
      "Convert daily pod SOPs into invokable `/slash-commands` backed by `.claude/skills/*/SKILL.md` with `$ARGUMENTS` and `disable-model-invocation: true` so workflows fire deterministically.",
    keyTakeaways: [
      "Use `disable-model-invocation: true` for high-impact workflows that should only run when a human explicitly types `/command`.",
      "Capture dynamic parameters cleanly with `$ARGUMENTS` (e.g. `/pod-prep pod-3 midwest-cold-storage.com`).",
      "Commit `.claude/skills/` to git so every AE/SDR across all 4 pods gets instant updates on pull.",
      "Combine slash commands with output checklists so reps review drafts in seconds.",
    ],
    loadsmartScenario:
      "Giving every SDR a `/pod-morning` slash command that audits yesterday's bounce metrics and formats today's top 5 triggered accounts.",
    artifactTitle: "Deterministic Slash Command (/pod-morning)",
    artifactFilename: "pod-morning-SKILL.md",
    artifactLanguage: "markdown",
    artifactCode: `---
name: pod-morning
description: Morning briefing & top-5 account triage for a Loadsmart AE/SDR Pod.
disable-model-invocation: true
---

# Daily Pod Morning Prep ($ARGUMENTS)

Run a structured morning briefing for Pod: **$ARGUMENTS** (default: pod-1).

1. Read \`kit/config/pods.yaml\` and \`knowledge/loadsmart/claims-library.md\`.
2. Summarize today's highest-priority signals mapped to the pod's primary software product.
3. Highlight any domain flagged \`PARKED_CRM_COLLISION\` so reps skip it on calls.
4. Output a scannable table: Account | Product Match | Dated Trigger URL | Next Human Action.
5. Remind rep: Do not enroll or send until batch approval is logged.`,
    repChecklist: [
      "Create `.claude/skills/pod-morning/SKILL.md` with `disable-model-invocation: true`.",
      "Test invoking `/pod-morning pod-3` in Claude Code.",
      "Commit the command folder so pod teammates share the exact workflow.",
    ],
  },
  {
    id: "harness-07-agents",
    track: "harness",
    number: "07",
    title: "Agents & Subagents for Parallel Territory Work",
    duration: "19 min · Multi-Agent Delegation",
    roleFocus: "RevOps & Senior AEs",
    summary:
      "Keep your main conversation window fast and clean by delegating heavy EDGAR filing scans, competitive battlecard pulls, and claims audits to scoped subagents.",
    keyTakeaways: [
      "Built-in helpers handle Exploration (read-only), Planning, and General execution without polluting main context.",
      "Define custom specialist subagents inside `.claude/agents/*.md` with restricted tool sets.",
      "Give every subagent the 4-Part Brief: Exact Goal, Allowed Context Files, Structured Output Contract, Stop Condition.",
      "Run parallel build -> review -> audit passes (e.g., Researcher drafts brief while Claims Auditor validates numbers).",
    ],
    loadsmartScenario:
      "Prepping an enterprise QBR + multi-threaded outreach campaign across 8 logistics executives without bloating a single context window.",
    artifactTitle: "Custom Subagent (.claude/agents/claims-auditor.md)",
    artifactFilename: "claims-auditor.md",
    artifactLanguage: "markdown",
    artifactCode: `---
name: claims-auditor
description: Read-only compliance reviewer checking Loadsmart outbound copy against knowledge/loadsmart/claims-library.md.
tools: Read, Grep, Glob
model: sonnet
---

You are Loadsmart's Calibrated Truth Claims Auditor. You ONLY read files—never edit or send emails.

Given any outbound draft batch:
1. Check every statistic, customer count, warehouse figure, or ROI claim against \`knowledge/loadsmart/claims-library.md\`.
2. Flag any unapproved metric (including unverified numbers scraped from marketing pages without a C-XXX ID).
3. Verify product isolation (no Opendock email pitching ShipperGuide or CarrierGuide).
4. Return PASS or FAIL with exact line fixes required before Step 6 human approval.`,
    repChecklist: [
      "Review how built-in Explore subagents keep main chat history compact.",
      "Add `.claude/agents/claims-auditor.md` with strictly read-only tools (`Read, Grep, Glob`).",
      "Delegate a multi-account draft audit to `claims-auditor` and verify its PASS/FAIL report.",
    ],
  },
  {
    id: "harness-08-governance",
    track: "harness",
    number: "08",
    title: "Governance for Teams & 30-Day Pod Rollout",
    duration: "18 min · Production Safety",
    roleFocus: "Sales Leadership & RevOps",
    summary:
      "Combine soft guidance (`CLAUDE.md`) with hard deterministic guardrails (`PreToolUse` hooks) and permission modes so Loadsmart rolls out AI across all pods safely in 30 days.",
    keyTakeaways: [
      "Guidance (`CLAUDE.md`) teaches preferences; `PreToolUse` hooks enforce hard blocks that the model cannot talk its way around.",
      "Choose Permission Modes intentionally: Manual (live CRM/send tools), Accept Edits (skill drafts), Plan Mode (strategy reviews), Auto (sandboxed CI).",
      "Roll out via 30-Day Pilot: Week 1 RevOps Sandbox -> Week 2 Pod 1 Shadow Mode -> Week 3 Human-Approved Batches -> Week 4 Cross-Pod Plugin Sync.",
      "Distribute approved team updates via Git repo tags or a shared internal plugin registry.",
    ],
    loadsmartScenario:
      "Ensuring zero AI agent can ever trigger a bulk Gong enrollment or Salesforce write while a rep is iterating on copy.",
    artifactTitle: "Deterministic PreToolUse Safety Hook (.claude/settings.json)",
    artifactFilename: "settings.hooks.json",
    artifactLanguage: "json",
    artifactCode: `{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash|mcp__.*__(send|enroll|upsert|delete).*",
        "hooks": [
          {
            "type": "command",
            "command": "node -e 'const d = JSON.parse(require(\"fs\").readFileSync(0,\"utf8\")); if(/curl.*(gong|apollo|salesforce).*POST/i.test(JSON.stringify(d)) && process.env.LOADSMART_LIVE_SEND !== \"APPROVED\"){ console.error(\"BLOCKED: Loadsmart live outbound/CRM writes require LOADSMART_LIVE_SEND=APPROVED and batch sign-off.\"); process.exit(2); }'"
          }
        ]
      }
    ]
  }
}`,
    repChecklist: [
      "Inspect `.claude/settings.json` hook rules blocking live POST calls without `LOADSMART_LIVE_SEND=APPROVED`.",
      "Map your team onto the 30-day pilot schedule with weekly `la-pod-feedback` reviews.",
      "Share updated skills & hooks cleanly via git rather than ad-hoc Slack file pastes.",
    ],
  },

  // =========================================================================
  // TRACK 2: MASTERING CLAUDE FOR GTM (5 MODULES — SALESGENCY / LOADSMART)
  // =========================================================================
  {
    id: "gtm-01-director",
    track: "gtm",
    number: "01",
    title: "The 2026 Shift: From Typist to Director",
    duration: "10 min · GTM Mindset",
    roleFocus: "All Loadsmart AEs & SDRs",
    summary:
      "Stop pasting blank-page ChatGPT requests one email at a time. Direct structured freight workflows that combine Loadsmart's positioning, real buying triggers, and human judgment.",
    keyTakeaways: [
      "Old Way (Typist): Copy-pasting an account URL into chat and editing hallucinated fluff for 20 minutes.",
      "New Way (Director): Pointing Claude at verified Loadsmart ICP context, signal evidence, and Claims Library rules.",
      "Your differentiation as a Loadsmart rep is relationship judgment, call discovery, and multi-threading—not manual research assembly.",
      "Separate software narratives cleanly: Opendock (docks), ShipperGuide (TMS), Loadsmart AI (freight ops).",
    ],
    loadsmartScenario:
      "Reclaiming 90 minutes per morning by moving an entire 10-account territory sprint from manual tab switching into a directed research & draft pipeline.",
    artifactTitle: "Director Brief Pattern for Daily Territory Sprints",
    artifactFilename: "director-sprint-prompt.md",
    artifactLanguage: "markdown",
    artifactCode: `Direct a morning sprint for Loadsmart Pod 3 (Opendock):
1. Review these 5 shipper triggers [paste URLs/dates].
2. Disqualify any 3PL/broker or account missing a public dock/warehouse angle.
3. For each qualifying account, draft a 3-sentence "Why Now + Dock Impact" hypothesis for the VP of Warehouse Operations.
4. Highlight which facts still need my confirmation on Salesforce before I touch the account.`,
    repChecklist: [
      "Identify 2 daily repetitive copy-paste habits to eliminate this week.",
      "Run a territory triage prompt focused strictly on ONE Loadsmart product.",
    ],
  },
  {
    id: "gtm-02-surfaces-models",
    track: "gtm",
    number: "02",
    title: "Chat vs Cowork vs Projects vs Code + Models",
    duration: "12 min · Tool Selection Matrix",
    roleFocus: "AEs, SDRs & Managers",
    summary:
      "Know instantly whether a Loadsmart task belongs in Chat, Desktop Cowork, a Shared Pod Project, or Claude Code—and which model (Opus, Sonnet, Haiku) fits best.",
    keyTakeaways: [
      "Use Chat for one-off Gong call debriefs, objection sparring, and quick competitive comparisons.",
      "Use Cowork (Desktop) when Claude needs to read local RFP PDFs, spreadsheets, and Draft folders autonomously.",
      "Use Projects for shared team memory (`claims-library.md`, Loadsmart Playbook v2, persona guides).",
      "Use Claude Code for repeatable slash commands, n8n workflow debugging, and git-versioned skills.",
      "Model Pairing: Opus 4.6 + Extended Thinking (complex RFP/10-K strategy), Sonnet 4.6 (daily emails & briefs), Haiku 4.5 (bulk classification).",
    ],
    loadsmartScenario:
      "Deciding how to tackle a 48-page Enterprise Shipper RFP vs drafting 15 daily cold-outbound touches.",
    artifactTitle: "Loadsmart Surface & Model Routing Matrix",
    artifactFilename: "loadsmart-surface-matrix.md",
    artifactLanguage: "markdown",
    artifactCode: `| GTM Task | Best Surface | Best Model | Why |
| :--- | :--- | :--- | :--- |
| Live objection roleplay before call | Claude Chat | Sonnet 4.6 | Fast turnaround, zero file setup |
| Shared Pod daily cold outreach & briefs | Claude Project | Sonnet 4.6 | Persistent ICP, Claims Library, and tone rules |
| Analyze 40-page shipper RFP + CSV lanes | Desktop Cowork | Opus 4.6 (Thinking) | Autonomous local file synthesis & multi-step reasoning |
| Run 6-step pipeline & update SKILL.md | Claude Code | Sonnet / Opus | Git-tracked skills, MCP Salesforce Shield, PreToolUse hooks |
| Tag 500 raw Clay signals by product | API / n8n | Haiku 4.5 | High-throughput classification at fraction of cost |`,
    repChecklist: [
      "Bookmark the Surface Routing Matrix for your pod.",
      "Use Opus + Extended Thinking on your next multi-facility Enterprise deal strategy review.",
    ],
  },
  {
    id: "gtm-03-cowork-connectors",
    track: "gtm",
    number: "03",
    title: "5-Step Cowork Setup & Essential Connectors",
    duration: "14 min · Desktop Integration",
    roleFocus: "All Field & Inside Reps",
    summary:
      "Follow the 5-step Cowork launch flow and wire Loadsmart's core daily tools—Google Workspace/Outlook, Slack, Salesforce, and Gong—without exposing sensitive customer data.",
    keyTakeaways: [
      "Step 1: Open Claude Desktop -> enable Cowork folder permissions strictly on your dedicated `Loadsmart-GTM/` folder.",
      "Step 2: Connect Calendar + Gmail/Outlook for automated meeting prep & post-call follow-up summaries.",
      "Step 3: Connect Slack (`#gtm-loadsmart-pods`) to pull daily pod signal digests.",
      "Step 4: Connect Salesforce/Gong via IT-approved read-only OAuth scopes.",
      "Step 5: Verify a dry-run meeting brief before letting Cowork assemble customer-facing deliverables.",
    ],
    loadsmartScenario:
      "Turning a 25-minute pre-call research scramble into a 60-second Cowork folder synthesis combining yesterday's Gong transcript and your open Opportunity notes.",
    artifactTitle: "Loadsmart Pre-Call Cowork Meeting Brief Prompt",
    artifactFilename: "cowork-meeting-prep.md",
    artifactLanguage: "markdown",
    artifactCode: `Check my upcoming shipper discovery call on calendar in the next 4 hours.
Read any linked Salesforce account notes, recent Gong discovery transcripts, and local brief files in ./accounts/.

Produce a 1-page Call Sheet:
1. Buying Committee Roles Attending & Priorities
2. Confirmed Operational Pain (quote exact transcript timestamps/snippets)
3. Single Loadsmart Product Anchor (Opendock / ShipperGuide / Loadsmart AI)
4. Top 3 Discovery Questions to Test Expansion Potential
5. Claims to Avoid (unless verified in knowledge/loadsmart/claims-library.md).`,
    repChecklist: [
      "Scope Cowork permissions to a dedicated Loadsmart work folder (never your entire home directory).",
      "Authorize Calendar + Slack connectors and generate one Pre-Call Sheet.",
    ],
  },
  {
    id: "gtm-04-projects-skills",
    track: "gtm",
    number: "04",
    title: "Projects, Persistent Memory & Loadsmart Skills",
    duration: "15 min · Team Standardization",
    roleFocus: "Pod Managers & Enablement",
    summary:
      "Configure a shared Loadsmart Pod Project stocked with `pod-copilot-system-prompt.md`, YAML configs, and downloadable `.zip` Skills from the Marketplace.",
    keyTakeaways: [
      "Download `kit/agent/pod-copilot-system-prompt.md` as your Project Custom Instructions.",
      "Attach `content/playbook.md`, `kit/config/icp.yaml`, and `knowledge/loadsmart/claims-library.md` as Project Knowledge.",
      "Upload individual `.zip` skills (`la-signal.zip`, `la-email.zip`, `prospect-outreach.zip`) under Settings > Capabilities > Skills.",
      "Standardize pod feedback: weekly `la-pod-feedback` retrospectives tune signal weights rather than drifting prompts ad-hoc.",
    ],
    loadsmartScenario:
      "Onboarding a brand-new Loadsmart SDR so their very first day of outbound matches the rigor of your top enterprise pod.",
    artifactTitle: "Pod Project Custom Instructions Starter",
    artifactFilename: "project-instructions.md",
    artifactLanguage: "markdown",
    artifactCode: `You are the Loadsmart Pod Copilot assisting Enterprise AE/SDR reps.

Ground Rules:
1. Follow the active files in Project Knowledge: Playbook v2, icp.yaml, and claims-library.md.
2. Never invent customer counts, carrier figures, or ROI percentages. Cite exact C-XXX IDs if present, or mark [NEEDS_APPROVED_CLAIM].
3. Enforce strict Salesforce Collision Shield reminders before drafting outreach.
4. Keep cold emails under 90 words in PAS format tailored strictly to ONE product: Opendock, ShipperGuide TMS, or Loadsmart AI.
5. End every draft batch with: "Pending Human Approval — ready for review before Gong/Apollo enrollment."`,
    repChecklist: [
      "Create a Claude Project named `Loadsmart Pod Copilot`.",
      "Download at least 3 skill `.zip` packages from the Marketplace and upload them to Capabilities > Skills.",
      "Run one real account through the project and audit it against `claims-library.md`.",
    ],
  },
  {
    id: "gtm-05-checklist",
    track: "gtm",
    number: "05",
    title: "GTM Team Quick-Start Launch Checklist",
    duration: "10 min · Go-Live Verification",
    roleFocus: "Every Loadsmart Rep",
    summary:
      "Execute the end-to-end 30-minute launch checklist to validate your setup, run your first 5 signal-backed accounts safely, and report pod conversion signals.",
    keyTakeaways: [
      "Complete workspace, Project, and Skill `.zip` installation before generating live copy.",
      "Verify `dry_run = true` and `REQUIRE_APPROVAL = true` on all connected n8n / Gong workflows.",
      "Audit bounce rate and positive reply vs meeting-booked ratio weekly to spot mid-funnel leaks early.",
      "Graduated reps advance directly into Track 1 (Agent Harness Mastery) to build custom commands and hooks.",
    ],
    loadsmartScenario:
      "Day-1 team certification checklist enabling Pod 1–4 AEs and SDRs to launch signal-led outreach safely on Monday morning.",
    artifactTitle: "Loadsmart Rep Day-1 Certification Checklist",
    artifactFilename: "loadsmart-rep-launch-checklist.md",
    artifactLanguage: "markdown",
    artifactCode: `# Loadsmart GTM AI Readiness Checklist

- [ ] 1. Loaded Pod Copilot Project with Playbook v2 & claims-library.md
- [ ] 2. Installed key Skills (.zip): prospect-outreach, la-signal, la-crm-audit, la-email
- [ ] 3. Verified zero unapproved numbers appear in generated Touch 1 drafts
- [ ] 4. Confirmed Salesforce Collision Shield check ran on first 5 test accounts
- [ ] 5. Confirmed n8n 00-loadsmart-6step-prospect-engine runs with dry_run = true before live enrollment
- [ ] 6. Scheduled Friday 15-min la-pod-feedback review on reply -> meeting leak metrics`,
    repChecklist: [
      "Verify every item in the Day-1 Readiness Checklist above.",
      "Test your Pod Copilot setup inside the unified Agent Workspace.",
      "Review the 6-Step n8n Engine blueprint with your RevOps partner.",
    ],
  },
];
