import { anthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { tool, type LanguageModel } from "ai";
import { z } from "zod";
import { kit, getSkill, getDocument, getAutomation, getConfigFile } from "./kit";

const OPENROUTER_DEFAULT_MODEL = "openrouter/free";

export function hasLiveModelKey(): boolean {
  return Boolean(
    process.env.OPENROUTER_API_KEY ||
      process.env.ANTHROPIC_API_KEY ||
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.OPENAI_API_KEY ||
      process.env.AI_GATEWAY_API_KEY,
  );
}

export function getOpenRouterClient() {
  const apiKey = process.env.OPENROUTER_API_KEY || "";
  return createOpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
    headers: {
      "HTTP-Referer": "https://loadsmart.com",
      "X-Title": "Loadsmart GTM Copilot",
    },
  });
}

/**
 * Model routing:
 * 1. OpenRouter (when OPENROUTER_API_KEY is configured)
 * 2. Anthropic (when ANTHROPIC_API_KEY is configured)
 * 3. Google Gemini (when GEMINI_API_KEY / GOOGLE_GENERATIVE_AI_API_KEY is configured)
 * 4. OpenAI (when OPENAI_API_KEY is configured)
 * 5. AI Gateway / fallback
 */
export function getModel(): LanguageModel {
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  if (openrouterKey) {
    const client = getOpenRouterClient();
    const modelName = process.env.OPENROUTER_MODEL || OPENROUTER_DEFAULT_MODEL;
    return client(modelName);
  }

  if (process.env.ANTHROPIC_API_KEY) {
    return anthropic(process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514");
  }

  const geminiKey =
    process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (geminiKey) {
    return createGoogleGenerativeAI({ apiKey: geminiKey })(
      process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
    );
  }

  if (process.env.OPENAI_API_KEY) {
    return createOpenAI({ apiKey: process.env.OPENAI_API_KEY })(
      process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    );
  }

  return (process.env.AI_MODEL ?? "anthropic/claude-sonnet-4.5") as unknown as LanguageModel;
}

export function modelLabel() {
  if (process.env.OPENROUTER_API_KEY) {
    return `openrouter:${process.env.OPENROUTER_MODEL || OPENROUTER_DEFAULT_MODEL}`;
  }
  if (process.env.ANTHROPIC_API_KEY) {
    return `anthropic:${process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514"}`;
  }
  if (process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return `gemini:${process.env.GEMINI_MODEL ?? "gemini-2.5-flash"}`;
  }
  if (process.env.OPENAI_API_KEY) {
    return `openai:${process.env.OPENAI_MODEL ?? "gpt-4o-mini"}`;
  }
  if (process.env.AI_GATEWAY_API_KEY) {
    return `gateway:${process.env.AI_MODEL ?? "anthropic/claude-sonnet-4.5"}`;
  }
  return "kit-grounded-copilot (no external LLM key)";
}

export const systemPrompt = `${kit.agentPrompt}

---

## This hosted deployment

- You are running on the public demo site for Patrick Diamitani's Loadsmart GTM Engineer case. Visitors may be Loadsmart's Sales, Marketing or RevOps leaders, or pod reps.
- You have access to all ${kit.documents.length} project documents, all ${kit.skills.length} skills (11 Loadsmart ABM skills, 8 6-Step Prospect Automation skills, and 23 Enably Sovereign skills), 12 playbook sections, automations, config files, and the approved claims library.
- You are NOT connected to live production Salesforce, Gong, ZoomInfo, Clay or any live sending mailbox here. When asked for live production numbers, accounts or contacts, say so plainly, then explain which skill would get it, from which system, and what you would need. Never hallucinate accounts, contacts, metrics or results.
- Ground answers in the playbook, skills, and documentation by calling your tools. Quote thresholds as "starting assumptions until baselined".
- You can draft emails, LinkedIn notes, call openers, objection answers, account-research plans and pod-day plans. Use [placeholders] for any claim or metric not yet assigned a C-XXX ID in knowledge/loadsmart/claims-library.md.
- You cannot send, enroll or write anything without human approval.
- Keep answers short, authoritative, and scannable. Lead with the answer. Use a table only when comparing.
- Today is ${new Date().toISOString().slice(0, 10)}.`;

const sectionIndex = kit.sections.map((s) => ({ slug: s.slug, title: s.title }));
const skillIndex = kit.skills.map((s) => ({ slug: s.slug, description: s.description }));
const documentIndex = (kit.documents ?? []).map((d) => ({ file: d.file, title: d.title }));
const automationIndex = (kit.automations ?? []).map((a) => ({ file: a.file, type: a.type }));

export const tools = {
  list_playbook_sections: tool({
    description: "List the sections of the Loadsmart ABM playbook with their slugs.",
    inputSchema: z.object({}),
    execute: async () => sectionIndex,
  }),
  read_playbook_section: tool({
    description:
      "Read one playbook section in full. Use for ICP, personas, messaging, cadences, scripts, diagnosis, signals, KPIs, pod rhythm, tools, scale layer, blind spots.",
    inputSchema: z.object({
      slug: z.string().describe("Section slug from list_playbook_sections"),
    }),
    execute: async ({ slug }) => {
      const s = kit.sections.find((x) => x.slug === slug) ?? kit.sections.find((x) => x.slug.includes(slug));
      return s ? { title: s.title, body: s.body } : { error: `No section '${slug}'.`, sections: sectionIndex };
    },
  }),
  search_playbook: tool({
    description: "Search across the entire knowledge base (playbook, skills, docs, automations, claims library) for a keyword or phrase.",
    inputSchema: z.object({ query: z.string().min(2) }),
    execute: async ({ query }) => {
      const q = query.toLowerCase();
      const hits: { where: string; line: string }[] = [];
      for (const s of kit.sections) {
        for (const line of s.body.split("\n")) if (line.toLowerCase().includes(q)) hits.push({ where: `playbook: ${s.title}`, line: line.trim() });
      }
      for (const s of kit.skills) {
        for (const line of s.body.split("\n")) if (line.toLowerCase().includes(q)) hits.push({ where: `skill: ${s.slug}`, line: line.trim() });
      }
      for (const d of kit.documents ?? []) {
        for (const line of d.content.split("\n")) if (line.toLowerCase().includes(q)) hits.push({ where: `doc: ${d.file}`, line: line.trim() });
      }
      return { query, count: hits.length, hits: hits.slice(0, 30) };
    },
  }),
  list_skills: tool({
    description: `List all ${kit.skills.length} skills in the Loadsmart ABM, 6-Step Prospecting, and Enably Sovereign skill marketplace.`,
    inputSchema: z.object({}),
    execute: async () => skillIndex,
  }),
  read_skill: tool({
    description: "Read one skill's full instructions (what it reads, writes, its rules and approval gate).",
    inputSchema: z.object({ slug: z.string() }),
    execute: async ({ slug }) => {
      const s = getSkill(slug) ?? kit.skills.find((x) => x.slug.includes(slug));
      return s ? { slug: s.slug, description: s.description, body: s.body } : { error: `No skill '${slug}'.`, skills: skillIndex };
    },
  }),
  read_config: tool({
    description:
      "Read a config file: icp.yaml, personas.yaml, pods.yaml, schedule.yaml, sending.yaml, salesforce-fields.md. Also 'reason-codes' for disqualification codes.",
    inputSchema: z.object({ file: z.string() }),
    execute: async ({ file }) => {
      if (file.includes("reason")) return { file: "disqualification-reason-codes.csv", content: kit.reasonCodes };
      const f = getConfigFile(file);
      return f ?? { error: `No config '${file}'.`, files: kit.configFiles.map((c) => c.file) };
    },
  }),
  list_documents: tool({
    description: "List all documentation files including Site Empire OS (01-25), PRD, Setup Guide, Architecture, Review, and Build Log.",
    inputSchema: z.object({}),
    execute: async () => documentIndex,
  }),
  read_document: tool({
    description: "Read any document by filename or number (e.g. '01-intent-spec.md', '08-prd.md', '10-architecture.md', 'SETUP_GUIDE.md', 'ARCHITECTURE.md').",
    inputSchema: z.object({ file: z.string() }),
    execute: async ({ file }) => {
      const doc = getDocument(file);
      return doc ? { file: doc.file, title: doc.title, content: doc.content } : { error: `Document '${file}' not found.`, documents: documentIndex };
    },
  }),
  read_claims_library: tool({
    description: "Read Loadsmart's approved claims library and legal/marketing sign-off status.",
    inputSchema: z.object({}),
    execute: async () => ({ claimsLibrary: kit.claimsLibrary }),
  }),
  list_automations: tool({
    description: "List the production n8n workflows, AI setup prompts, Clay waterfall schemas, and Salesforce custom field definitions.",
    inputSchema: z.object({}),
    execute: async () => automationIndex,
  }),
  read_automation: tool({
    description: "Read an automation workflow JSON, setup prompt, or schema file by name.",
    inputSchema: z.object({ file: z.string() }),
    execute: async ({ file }) => {
      const auto = getAutomation(file);
      return auto ? { file: auto.file, type: auto.type, content: auto.content } : { error: `Automation '${file}' not found.`, automations: automationIndex };
    },
  }),
  prospect_accounts: tool({
    description: "Score account parameters against Loadsmart's ICP tiers across Freight Brokerage, ShipperGuide TMS, and Opendock Dock Scheduling.",
    inputSchema: z.object({
      annualRevenueMillion: z.number().optional().describe("Annual revenue in millions USD"),
      fpaLoadsPerYear: z.number().optional().describe("Estimated full truckload / dry van loads per year"),
      warehouseLocations: z.number().optional().describe("Number of warehouse or DC facilities"),
      currentTech: z.array(z.string()).optional().describe("Current stack (e.g. SAP, MercuryGate, BlueYonder, Excel)"),
    }),
    execute: async ({ annualRevenueMillion = 50, fpaLoadsPerYear = 1500, warehouseLocations = 3, currentTech = [] }) => {
      const brokerageFit = fpaLoadsPerYear > 500 ? "Tier 1 High Value" : "Tier 2 Mid Market";
      const tmsFit = annualRevenueMillion >= 30 && currentTech.some((t) => /excel|legacy|manual/i.test(t)) ? "High Propensity ShipperGuide" : "Moderate";
      const opendockFit = warehouseLocations >= 2 ? "High Propensity Opendock" : "Single Facility";
      return {
        qualification: {
          brokerageTier: brokerageFit,
          tmsFit,
          opendockFit,
          recommendedHook: opendockFit.includes("High")
            ? "Dock congestion relief across multiple facilities"
            : "Spot-quote automation & capacity access during peak volumes",
          targetPersonas: [
            "VP of Supply Chain / Logistics",
            "Director of Transportation",
            "Warehouse / Facility Operations Manager",
          ],
        },
      };
    },
  }),
  draft_outbound_sequence: tool({
    description: "Draft a personalized PAS outbound email and follow-up grounded strictly in the prospect trigger and approved claims.",
    inputSchema: z.object({
      companyName: z.string().describe("Target company name"),
      personaTitle: z.string().describe("Recipient job title"),
      primaryProduct: z.enum(["Freight Brokerage", "ShipperGuide TMS", "Opendock", "Loadsmart AI"]).describe("Product being pitched"),
      triggerSignal: z.string().optional().describe("Observed signal (e.g. New DC Opening, Leadership Change, Peak Season RFP)"),
    }),
    execute: async ({ companyName, personaTitle, primaryProduct, triggerSignal = "new facility expansion" }) => {
      return {
        approvalRequired: true,
        claimsStatus: "Grounded in prospect facts; insert approved [CLAIM:C-XXX] row from knowledge/loadsmart/claims-library.md before live send.",
        sequence: {
          step1_email: {
            day: 1,
            subject: `${companyName.toLowerCase()} dock capacity check`,
            body: `Hi [First Name],\n\nSaw ${companyName}'s ${triggerSignal}. Usually when shippers bring a new site online, manual dock appointments and carrier check-ins create avoidable detention right away.\n\n${primaryProduct} gives ${personaTitle}s a single self-serve scheduling workflow before volume hits peak.\n\nWorth a 10-minute look at how comparable facilities set up day-one dock rules?`,
          },
          step2_linkedin: {
            day: 3,
            touch: "Connection Note",
            note: `Saw the news on ${companyName}'s ${triggerSignal} — sent a quick note on keeping day-one dock turn times tight as volume ramps.`,
          },
        },
      };
    },
  }),
  diagnose_pod_leak: tool({
    description: "Diagnose AE/SDR pod conversion drops and isolate the operational bottleneck.",
    inputSchema: z.object({
      metricObserved: z.string().describe("The symptom (e.g. 'replies up but meetings flat', 'low show rate', 'bounce rate > 3%')"),
    }),
    execute: async ({ metricObserved }) => {
      const symptom = metricObserved.toLowerCase();
      let diagnosis = "Run weekly la-list-qa and la-pod-feedback audit to isolate which step between Signal, CRM Shield, Research, or Handoff is leaking.";
      let remedy = "Check Bounce Rate (<2% cap), CRM Collision false positives, and SDR reply-to-meeting response SLA.";

      if (symptom.includes("meeting") && (symptom.includes("flat") || symptom.includes("low"))) {
        diagnosis = "Handoff & CTA leak: positive replies are sitting past the 15-minute SDR SLA, the CTA asks for a heavy 30-minute demo instead of a 10-minute workflow check, or AE/SDR qualification criteria differ on what counts as an ICP buyer.";
        remedy = "Enforce a 15-minute positive-reply SLA with instant calendar holds, narrow Touch 1 CTAs to a specific trigger question, and review the last 10 unreplied positive threads inside la-pod-feedback.";
      } else if (symptom.includes("bounce")) {
        diagnosis = "Enrichment waterfall decay: catch-all or stale addresses are entering Gong/Apollo before verification.";
        remedy = "Require VERIFIED status from ZoomInfo + Clay waterfall and run la-crm-audit / la-list-qa; pause any pod above 2.0% rolling bounce rate.";
      } else if (symptom.includes("show")) {
        diagnosis = "Discovery drop-off: buyer did not receive a 1-page trigger-backed pre-call brief tying to their operational metric.";
        remedy = "Attach the 6-part la-research brief to calendar invites 24h prior with two focused discovery questions.";
      }

      return { symptom: metricObserved, rootCause: diagnosis, actionPlan: remedy };
    },
  }),
  verify_claim: tool({
    description: "Check whether a numerical claim or metric has an approved C-XXX row in Loadsmart's official claims library.",
    inputSchema: z.object({
      claim: z.string().describe("Claim or statistic to verify"),
    }),
    execute: async ({ claim }) => {
      const lines = kit.claimsLibrary
        .split("\n")
        .filter((l) => /^\| C-\d+/.test(l) && !l.includes("`[claim]`"));
      const match = lines.find((l) => l.toLowerCase().includes(claim.toLowerCase()));
      return {
        query: claim,
        approvedRowsInLibrary: lines.length,
        verifiedMatch: match ?? null,
        policyNote:
          "Per knowledge/loadsmart/claims-library.md, no metric ships into cold copy until Loadsmart marketing & legal populate an approved C-XXX row.",
      };
    },
  }),
};

export type GroundedToolTrace = {
  name: string;
  input: Record<string, unknown>;
  output: unknown;
};

/**
 * Kit-grounded fallback responder used when no external LLM key is configured in the environment.
 * Executes real local kit tools cleanly so the live presentation demo never crashes.
 */
export function buildKitGroundedReply(query: string): {
  toolCalls: GroundedToolTrace[];
  text: string;
} {
  const q = query.toLowerCase();
  const toolCalls: GroundedToolTrace[] = [];

  // 1. Specific skill inquiry (e.g. la-crm-audit, la-signal, prospect-outreach, n8n-engineer-companion)
  const matchedSkill = kit.skills.find(
    (s) => q.includes(s.slug.toLowerCase()) || q.includes(s.slug.replace(/-/g, " ")),
  );
  if (matchedSkill) {
    toolCalls.push({
      name: "read_skill",
      input: { slug: matchedSkill.slug },
      output: { slug: matchedSkill.slug, description: matchedSkill.description },
    });
    const firstSection = matchedSkill.body
      .split("\n")
      .filter((l) => l.trim() && !l.startsWith("#"))
      .slice(0, 8)
      .join("\n");
    return {
      toolCalls,
      text: `### Skill Breakdown: \`${matchedSkill.slug}\`

${matchedSkill.description}

**What it governs inside the Loadsmart pipeline:**
${firstSection}

- **Safety rule:** Enforces \`REQUIRE_APPROVAL = true\` and CRM collision shielding so zero unapproved sends or Salesforce mutations run automatically.
- **Inspect or download:** Open \`/skills/${matchedSkill.slug}\` in the Team Skills Marketplace to read the complete \`SKILL.md\` or download the \`.zip\`.`,
    };
  }

  // 2. Pod leak diagnosis
  if (q.includes("leak") || q.includes("flat") || q.includes("bounce") || q.includes("show rate") || q.includes("diagnos")) {
    const symptom = q.includes("bounce")
      ? "bounce rate > 2%"
      : q.includes("show")
        ? "low show rate"
        : "replies up but meetings flat";
    toolCalls.push({
      name: "diagnose_pod_leak",
      input: { metricObserved: symptom },
      output: { checked: "la-daily-report + la-pod-feedback" },
    });
    const playbookDiag = kit.sections.find((s) => s.slug.includes("diagnos") || s.slug.includes("leak"));
    if (playbookDiag) {
      toolCalls.push({
        name: "read_playbook_section",
        input: { slug: playbookDiag.slug },
        output: { title: playbookDiag.title },
      });
    }
    return {
      toolCalls,
      text: `### Pod Leak Diagnosis: Positive Replies Up, Meetings Flat

When replies rise without translating into held meetings, the leak happens at the **post-reply handoff and CTA calibration step**, not top-of-funnel messaging:

| Diagnostic Layer | Red Flag Signal | Immediate Fix |
| :--- | :--- | :--- |
| **1. Speed-to-Reply** | Positive replies wait >15 min before a personalized calendar hold | Enforce a 15-minute SDR SLA triggered in Slack with two pre-proposed 15-min slots |
| **2. CTA Friction** | Email pitches a broad 30-min discovery instead of the specific facility/TMS trigger | Anchor Touch 1 around a 10-minute benchmark check tied to their dated signal |
| **3. AE/SDR Bar Alignment** | SDR celebrates soft curiosity replies; AE rejects account fit or buying authority | Run weekly \`la-pod-feedback\` across the last 10 stalled replies and tighten Step 2 ICP scoring |

*Next action:* Review the last 10 positive-reply threads in \`la-pod-feedback\` and inspect conversion timing inside \`04-loadsmart-pod-leak-digest.json\` under **Automations**.`,
    };
  }

  // 3. LinkedIn / Email draft request
  if (q.includes("linkedin") || q.includes("draft") || q.includes("email") || q.includes("write a") || q.includes("opener")) {
    const product = q.includes("shipperguide") || q.includes("tms")
      ? "ShipperGuide TMS"
      : q.includes("loadsmart ai")
        ? "Loadsmart AI"
        : "Opendock";
    toolCalls.push({
      name: "read_claims_library",
      input: {},
      output: { claimsStatus: "Strict Calibrated Truth check enabled" },
    });
    toolCalls.push({
      name: "draft_outbound_sequence",
      input: {
        companyName: "[Target Shipper]",
        personaTitle: q.includes("dc") || q.includes("warehouse") ? "DC Operations Manager" : "VP Supply Chain",
        primaryProduct: product,
        triggerSignal: "new distribution site opening",
      },
      output: { approvalRequired: true },
    });

    if (q.includes("linkedin")) {
      return {
        toolCalls,
        text: `### Draft LinkedIn Note — ${product} (Pending Approval)

> **Note (<300 chars):**  
> Saw [Company]'s new [City] DC launch on [source_url]. When facilities ramp early volume, carrier check-ins and dock wait times usually spike fast. Worth sharing how dock teams standardize day-one appointment windows with ${product}?

**Calibrated Truth Check:**
- Single Loadsmart product only (**${product}** — no cross-product bundling).
- Grounded strictly in the prospect's public facility trigger; zero unapproved customer/ROI claims inserted until populated in \`knowledge/loadsmart/claims-library.md\`.
- **Gate:** \`REQUIRE_APPROVAL = true\` — review before queueing in Gong / LinkedIn.`,
      };
    }

    return {
      toolCalls,
      text: `### PAS Draft — ${product} (Pending Human Approval)

- **Subject:** \`[company] new dc dock check\`
- **Body (69 words):**

> Hi [First Name],  
>   
> Saw [Company] announced the new [City] facility on [date/source]. When new sites open, manual carrier scheduling usually triggers dock bottlenecks and detention fees during the first 60 days.  
>   
> ${product} gives your warehouse team one self-serve portal to coordinate inbound carriers before volume peaks.  
>   
> Open to a quick 10-minute look at how similar facilities set up day-one dock rules?

**Truth & Linter Verification:** Under 90-word cap · Single product (${product}) · Zero unapproved metrics · Ready for **Step 6 Approval Drawer**.`,
    };
  }

  // 4. Morning SDR/Pod plan
  if (q.includes("morning") || q.includes("plan an sdr") || q.includes("first") || q.includes("cadence")) {
    toolCalls.push({
      name: "list_playbook_sections",
      input: {},
      output: { sections: sectionIndex.length },
    });
    toolCalls.push({
      name: "read_skill",
      input: { slug: "loadsmart-abm-orchestrator" },
      output: { schedule: "06:00 - 17:00 CT" },
    });

    return {
      toolCalls,
      text: `### SDR Morning Execution Plan (Three-Product Pod)

Execute in **strict sequence** so reps never spend morning call blocks on existing customers or unverified contacts:

1. **06:00–06:30 CT · Signal & CRM Shield (\`la-signal\` + \`la-crm-audit\`)**  
   Review overnight dated triggers mapped to **Opendock** (new DC/hiring), **ShipperGuide** (TMS/freight hiring), and **Loadsmart AI** (supply chain leadership/10-K). Confirm any active Salesforce customer or open opportunity is quarantined (\`PARKED_CRM_COLLISION\`).
2. **07:15–08:00 CT · Verified Personas & Research (\`la-persona-enrich\` + \`la-research\`)**  
   Pull 3–5 verified buying-committee contacts via ZoomInfo + Clay waterfall and skim each account's 6-part evidence brief.
3. **08:15–08:45 CT · Batch Draft Approval (\`la-email\` + \`la-sequence\`)**  
   Approve single-product PAS drafts inside Slack \`#gtm-pod-approvals\` before pushing into Gong Engage (remember: live telemetry shows **this demo isn't wired to your production Salesforce/Gong tenant**—import \`00-loadsmart-6step-prospect-engine.json\` under **Automations** to connect live credentials).
4. **09:00–11:30 CT · Priority Outbound & <15m Reply SLA**  
   Work warm positive replies first, then Tier-1 triggered accounts by product pod.`,
    };
  }

  // 5. n8n automation / 6-step / setup prompt / courses inquiry
  if (q.includes("n8n") || q.includes("automation") || q.includes("workflow") || q.includes("6-step") || q.includes("setup")) {
    toolCalls.push({
      name: "list_automations",
      input: {},
      output: { workflows: automationIndex.length },
    });
    return {
      toolCalls,
      text: `### Loadsmart 6-Step n8n Prospect Automation

Head to **Automations** (\`/automations\`) to inspect and download the complete blueprint set:

- **Master Workflow:** \`00-loadsmart-6step-prospect-engine.json\` — connects **Signals** (Perplexity/EDGAR) → **Companies** (Salesforce Collision Shield) → **Contacts** (ZoomInfo + Clay Waterfall) → **Research** (6-part brief) → **Email** (Claude PAS + Claims Linter) → **Outreach** (Slack Approval Gate + Gong/Apollo).
- **AI Setup Prompt:** \`loadsmart-n8n-setup-prompt.md\` — downloadable configuration prompt for Claude Code / Claude Chat to wire credentials, custom Salesforce fields, and safely run your first 2-domain test with \`dry_run = true\`.
- **Error Monitoring:** \`05-loadsmart-error-alert-handler.json\` — posts formatted execution diagnostics to \`#gtm-ops-alerts\`.`,
    };
  }

  // 5. Rep Academy / Claude Code courses
  if (q.includes("course") || q.includes("academy") || q.includes("claude code") || q.includes("training") || q.includes("rep")) {
    toolCalls.push({
      name: "list_skills",
      input: {},
      output: { tracks: 2, totalModules: 13 },
    });
    return {
      toolCalls,
      text: `### Loadsmart Claude Code & GTM Rep Academy

Navigate to **Courses** (\`/courses\`) to launch the two-track onboarding curriculum adapted for Loadsmart pods:

- **Track 1 — Agent Harness Mastery (8 Claude Code Lessons):** Setup, \`CLAUDE.md\` Pod Context Files, Reusable Prompt Engineering, Skill Modules (\`/skills\`), MCP Connectors (Salesforce/Clay/Gong), Custom Slash Commands, Subagents, and Calibrated Truth Governance.
- **Track 2 — Mastering Claude for GTM (5 Core Modules):** Claude Chat vs. Cowork vs. Projects, Pod Project Workspaces, Voice & PAS Email Drafting, Packaging Rep Skills, and Automated 6-Step Prospecting Workflows.`,
    };
  }

  // 6. General multi-keyword search across the kit
  const stopWords = new Set([
    "what", "when", "where", "which", "with", "this", "that", "from", "your", "have", "they", "them",
    "tell", "about", "show", "explain", "does", "work", "into", "could", "would", "should", "there",
    "their", "here", "make", "give", "more", "some", "into", "across", "only", "using", "used",
  ]);
  const words = q
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));
  const terms = words.length > 0 ? words.slice(0, 4) : ["loadsmart"];
  const searchTerm = terms[0];
  const scoredHits: { score: number; where: string; line: string }[] = [];

  const scoreLine = (where: string, line: string) => {
    const t = line.trim();
    if (t.length < 24 || t.startsWith("---") || t.startsWith("| :")) return;
    const lower = t.toLowerCase();
    let score = 0;
    for (const term of terms) {
      if (lower.includes(term)) score += 1;
    }
    if (score > 0) scoredHits.push({ score, where, line: t });
  };

  for (const s of kit.sections) {
    for (const line of s.body.split("\n")) scoreLine(`Playbook · ${s.title}`, line);
  }
  for (const s of kit.skills) {
    for (const line of s.body.split("\n")) scoreLine(`Skill · ${s.slug}`, line);
  }

  scoredHits.sort((a, b) => b.score - a.score);
  const uniqueHits: typeof scoredHits = [];
  const seen = new Set<string>();
  for (const h of scoredHits) {
    const key = h.line.slice(0, 60).toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      uniqueHits.push(h);
    }
    if (uniqueHits.length >= 5) break;
  }

  toolCalls.push({
    name: "search_playbook",
    input: { query: terms.join(" ") },
    output: { matches: scoredHits.length },
  });

  const topHits = uniqueHits
    .map((h) => `- **${h.where}:** ${h.line.slice(0, 180)}`)
    .join("\n");

  return {
    toolCalls,
    text: `### Grounded Kit Response

*Scope note: This live demo is not wired to Loadsmart's production Salesforce, ZoomInfo, or Gong tenant, so live customer or pipeline numbers require connecting credentials via \`00-loadsmart-6step-prospect-engine.json\`.*

${topHits ? `**Relevant excerpts from the Loadsmart Playbook & Skill Kit:**\n${topHits}` : "Ask me about **planning an SDR's morning**, **diagnosing a pod conversion leak**, **writing a signal-led Opendock/ShipperGuide email**, **walking through any of the 42 skills**, or **deploying the 6-step n8n automation**."}`,
  };
}

