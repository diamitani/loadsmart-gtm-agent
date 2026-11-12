import { anthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { tool, type LanguageModel } from "ai";
import { z } from "zod";
import { kit, getSkill, getDocument, getAutomation, getConfigFile } from "./kit";

const OPENROUTER_DEFAULT_MODEL = "openrouter/free";

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
 * 1. OpenRouter (primary when OPENROUTER_API_KEY is configured)
 * 2. ANTHROPIC_API_KEY set  -> Anthropic directly
 * 3. AI_GATEWAY_API_KEY or Vercel OIDC -> Vercel AI Gateway
 */
export function getModel(): LanguageModel {
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  if (openrouterKey) {
    const client = getOpenRouterClient();
    const modelName = process.env.OPENROUTER_MODEL || OPENROUTER_DEFAULT_MODEL;
    return client(modelName);
  }

  if (process.env.ANTHROPIC_API_KEY) {
    return anthropic(process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5-5");
  }

  return (process.env.AI_MODEL ?? "anthropic/claude-sonnet-5.5") as unknown as LanguageModel;
}

export function modelLabel() {
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  if (openrouterKey) {
    return `openrouter:${process.env.OPENROUTER_MODEL || OPENROUTER_DEFAULT_MODEL}`;
  }
  if (process.env.ANTHROPIC_API_KEY) {
    return `anthropic:${process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5-5"}`;
  }
  return `gateway:${process.env.AI_MODEL ?? "anthropic/claude-sonnet-5.5"}`;
}


export const systemPrompt = `${kit.agentPrompt}

---

## This hosted deployment

- You are running on the public demo site for Patrick Diamitani's Loadsmart GTM Engineer case. Visitors may be Loadsmart's Sales, Marketing or RevOps leaders, or pod reps.
- You have access to all ${kit.documents.length} project documents (Site Empire OS 01-25, Architecture, PRD, Setup Guide, Review, Build Log), all ${kit.skills.length} skills (11 Loadsmart ABM skills + 23 Enably Sovereign skills), 12 playbook sections, automations, config files, and the verified claims library.
- You are NOT connected to live production Salesforce, Gong, ZoomInfo, Clay or any live sending mailbox here. When asked for live production numbers, accounts or contacts, say so plainly, then explain which skill would get it, from which system, and what you would need. Never hallucinate accounts, contacts, metrics or results.
- Ground answers in the playbook, skills, and documentation by calling your tools. Quote thresholds as "starting assumptions until baselined".
- You can draft emails, LinkedIn notes, call openers, objection answers, account-research plans and pod-day plans. Use [placeholders] for any fact you don't have.
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
    description: "Search across the entire knowledge base (playbook, skills, 34 docs, automations, claims library) for a keyword or phrase.",
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
    description: `List all ${kit.skills.length} skills in the Loadsmart ABM and Enably Sovereign skill pack.`,
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
    description: "List all 34 documentation files including Site Empire OS (01-25), PRD, Setup Guide, Architecture, Review, and Build Log.",
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
    description: "Read the validated Loadsmart proof points, metrics (1,800+ Shippers, 4,500+ Facilities, 230k+ Carriers, 14M Docks, 11 AI Agents), and citations.",
    inputSchema: z.object({}),
    execute: async () => ({ claimsLibrary: kit.claimsLibrary }),
  }),
  list_automations: tool({
    description: "List the production n8n workflows, Clay waterfall schemas, and Salesforce custom field SQL definitions.",
    inputSchema: z.object({}),
    execute: async () => automationIndex,
  }),
  read_automation: tool({
    description: "Read an automation workflow JSON or SQL schema file by name (e.g. 'waterfall-schema.json', 'gtm_custom_fields.sql', n8n files).",
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
      const tmsFit = annualRevenueMillion >= 30 && currentTech.some(t => /excel|legacy|manual/i.test(t)) ? "High Propensity ShipperGuide" : "Moderate";
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
            "Warehouse / Facility Operations Manager"
          ]
        }
      };
    },
  }),
  draft_outbound_sequence: tool({
    description: "Draft a personalized 4-step multi-channel sequence (Email 1 with trigger Hook, LinkedIn connection, Email 2 with social proof, Phone talk track).",
    inputSchema: z.object({
      companyName: z.string().describe("Target company name"),
      personaTitle: z.string().describe("Recipient job title"),
      primaryProduct: z.enum(["Freight Brokerage", "ShipperGuide TMS", "Opendock"]).describe("Product being pitched"),
      triggerSignal: z.string().optional().describe("Observed signal (e.g. New DC Opening, Leadership Change, Peak Season RFP)"),
    }),
    execute: async ({ companyName, personaTitle, primaryProduct, triggerSignal = "Network growth" }) => {
      return {
        sequence: {
          step1_email: {
            day: 1,
            subject: `Quick question on ${companyName}'s dock throughput`,
            body: `Hi [First Name],\n\nNoticed ${companyName}'s ${triggerSignal}. Typically when shipping networks expand, carrier detention and appointment bottlenecks multiply.\n\nAt Loadsmart, over 1,800 shippers use our automated scheduling and execution to eliminate dock dwell time.\n\nOpen to a 5-minute sanity check on how this fits your Q3 plan?\n\nBest,\n[Sender]`
          },
          step2_linkedin: {
            day: 3,
            touch: "Connection Request & Voice Note",
            note: `Hi [First Name], following your team's expansion in logistics. Shared an email on dock turnaround times — would love to connect here!`
          },
          step3_email: {
            day: 6,
            subject: `Carrier visibility benchmark for ${companyName}`,
            body: `Hi [First Name],\n\nSharing how a peer shipper reduced dock dwell by 32% within 60 days of deploying Opendock.\n\nWorth a brief look this Thursday?\n\nBest,\n[Sender]`
          },
          step4_phone: {
            day: 9,
            talkTrack: `Hi [First Name], this is [Sender] with Loadsmart. Calling because we help ${personaTitle}s eliminate carrier detention fees during network expansions. Are carrier wait times on your radar this quarter?`
          }
        }
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
      let diagnosis = "General pipeline audit recommended.";
      let remedy = "Audit CRM hygiene and review persona targeting.";

      if (symptom.includes("meeting") && (symptom.includes("flat") || symptom.includes("low"))) {
        diagnosis = "Leak at SDR handoff: positive replies are not being converted to calendar holds within 15 minutes, or the CTA is asking for 30 minutes instead of a 7-minute benchmark fit call.";
        remedy = "Enforce SDR 15-minute SLA on positive replies with automated calendar links and calendar hold confirmations.";
      } else if (symptom.includes("bounce")) {
        diagnosis = "Contact list decay or unverified catch-all emails in the enrichment waterfall.";
        remedy = "Run la-crm-audit and la-list-qa to verify all contact records via ZeroBounce/NeverBounce prior to sequencer enrollment. Cap bounce rate at 1.5%.";
      } else if (symptom.includes("show")) {
        diagnosis = "Discovery drop-off: prospect did not receive a pre-meeting agenda or relevant 1-page ROI brief.";
        remedy = "Automate an AE pre-call brief sent 24 hours prior with 2 tailored questions.";
      }

      return { symptom: metricObserved, rootCause: diagnosis, actionPlan: remedy };
    },
  }),
  verify_claim: tool({
    description: "Verify a numerical claim or metric against Loadsmart's official verified claims library.",
    inputSchema: z.object({
      claim: z.string().describe("Claim or statistic to verify"),
    }),
    execute: async ({ claim }) => {
      const text = kit.claimsLibrary;
      const lower = claim.toLowerCase();
      const verified = text.toLowerCase().includes(lower);
      return {
        query: claim,
        verifiedInLibrary: verified,
        coreVerifiedMetrics: [
          "1,800+ Active Shippers",
          "4,500+ Shipping & Receiving Facilities",
          "230,000+ Vetted Carriers in Network",
          "14,000,000+ Appointments Booked through Opendock",
          "11 Autonomous AI GTM Agents",
          "99.2% Real-Time Tracking Compliance"
        ]
      };
    },
  }),
};
