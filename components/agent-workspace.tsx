"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Bot,
  Workflow,
  ShieldCheck,
  Clock,
  Download,
  ArrowRight,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { DemoChat } from "./demo-chat";

type TabId = "copilot" | "pipeline" | "cadence";

const pipelineWalkthrough = [
  {
    step: "01",
    id: "signal",
    title: "Signals · Why Now",
    skill: "la-signal · prospect-step-1-signals",
    stack: "Perplexity · FreightWaves · ZoomInfo Scoops · Job Boards",
    input: "Target freight segments + 90-day event window",
    output: "Dated signal row with source URL, event date, decay weight, and Loadsmart product match (Opendock, ShipperGuide, Loadsmart AI).",
    gate: "No URL, no signal. Signals older than 90 days decay to zero; carrier-side products stay out of scope.",
    example:
      "New 420,000 sq ft distribution center announced in Reno, NV -> maps to Opendock dock scheduling (base strength 0.90).",
  },
  {
    step: "02",
    id: "company",
    title: "Companies · Salesforce Shield",
    skill: "la-crm-audit · prospect-step-2-companies",
    stack: "Salesforce REST Query (Account & Opportunity)",
    input: "Normalized root domain from Step 1",
    output: "ICP fit score (0–100) + CRM clearance (`CRM_CLEARED` vs `PARKED_CRM_COLLISION`).",
    gate: "Active customers and accounts with open opportunities in any AE pod are quarantined immediately before credit burn.",
    example:
      "Midwest Beverage Co. shows an open Enterprise TMS opportunity -> quarantined as OPEN_OPP_ELSEWHERE.",
  },
  {
    step: "03",
    id: "contact",
    title: "Contacts · Waterfall Enrichment",
    skill: "la-persona-enrich · prospect-step-3-contacts",
    stack: "ZoomInfo -> Clay Waterfall (Apollo -> Hunter -> Prospeo)",
    input: "CRM_CLEARED accounts + product buying committee map",
    output: "3–5 verified decision makers per account (VP Supply Chain, DC General Manager, Transportation Director).",
    gate: "Only VERIFIED corporate addresses pass to research. Generic inboxes and personal webmail are excluded.",
    example:
      "4 verified contacts resolved for Midwest Cold Storage: Director of Warehouse Ops, VP Supply Chain, Reno GM, Yard Lead.",
  },
  {
    step: "04",
    id: "research",
    title: "Research · Evidence Brief",
    skill: "la-research · prospect-step-4-research",
    stack: "Perplexity · SEC EDGAR 10-K · Operational News",
    input: "Cleared account + dated signal + verified persona",
    output: "6-part sourced brief (freight footprint, trigger, operational bottleneck, incumbent stack, persona hook, claim IDs).",
    gate: "Every metric carries a source URL and retrieval date. Unreported freight spend or dock count stays `unknown`.",
    example:
      "10-K cites rising detention expenses across 6 regional DCs ahead of Q4 cold-chain volume.",
  },
  {
    step: "05",
    id: "email",
    title: "Email · Claims-Checked PAS",
    skill: "la-email · prospect-step-5-email",
    stack: "Claude AI + knowledge/loadsmart/claims-library.md + Linter",
    input: "6-part Evidence Brief + single-product positioning",
    output: "Touch 1–3 PAS drafts (<= 90 words), lowercase trigger subjects, and persona call/LinkedIn openers.",
    gate: "Calibrated Truth Linter rejects unapproved savings percentages, customer metrics without C-XXX IDs, or cross-product bleed.",
    example:
      "78-word Touch 1 opening strictly on the Reno DC announcement and dock appointment bottlenecks.",
  },
  {
    step: "06",
    id: "outreach",
    title: "Outreach · Human Approval Gate",
    skill: "la-sequence · prospect-step-6-outreach",
    stack: "Slack #gtm-pod-approvals -> Gong Engage / Apollo + Salesforce",
    input: "Linted draft batch (<= 20 accounts per pod/day)",
    output: "Approved sequence enrollment, dialer tasks, and Salesforce Touchpoint__c audit trail.",
    gate: "REQUIRE_APPROVAL = true and dry_run = true by default. Rolling 7-day bounce rate > 2.0% pauses the pod automatically.",
    example:
      "Pod SDR/AE clicks Approve in Slack preview; Gong enrolls verified contacts with mailbox throttle <= 35 emails/day.",
  },
];

const cadenceRows = [
  { time: "06:00 CT", skill: "la-signal", action: "Ingest dated freight triggers mapped to Opendock, ShipperGuide, Loadsmart AI", gate: "URL + Date check" },
  { time: "06:30 CT", skill: "la-crm-audit", action: "Query Salesforce Account & Opportunity tables for collision quarantine", gate: "Auto quarantine" },
  { time: "Mon 07:00", skill: "la-abm-tag", action: "Allocate top 20 scored accounts per pod with written rationale", gate: "RevOps approves" },
  { time: "07:15 CT", skill: "la-persona-enrich", action: "Run ZoomInfo + Clay waterfall for 3–5 buying committee personas", gate: "Verified emails only" },
  { time: "07:45 CT", skill: "la-research", action: "Compile 6-part evidence brief from EDGAR filings and logistics news", gate: "Source ledger check" },
  { time: "08:15 CT", skill: "la-email", action: "Draft PAS Touch 1–3 copy bounded by approved claims library IDs", gate: "Calibrated Truth Linter" },
  { time: "08:30 CT", skill: "la-sequence", action: "Present batch approval drawer before Gong / Apollo sequence push", gate: "Human Yes required" },
  { time: "17:00 CT", skill: "la-daily-report", action: "Compute funnel conversions, flag pod leaks, post EOD Slack digest", gate: "Operator audit" },
];

type Props = {
  skillCount: number;
  docCount: number;
};

export function AgentWorkspace({ skillCount, docCount }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("copilot");
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  const selectedStage = pipelineWalkthrough[activeStepIdx];

  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8 py-10 sm:py-12 space-y-8">
      {/* Unified Header */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-blue-600">
            Loadsmart Agent Workspace · Live Pod Console
          </p>
          <h1 className="mt-2 max-w-3xl text-[32px] sm:text-[46px] font-bold leading-[1.06] tracking-[-0.03em] text-slate-900 text-balance">
            Run the pod agent, inspect every pipeline step, and audit guardrails.
          </h1>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-slate-600">
            Unified workspace grounded in Loadsmart&apos;s Sales Playbook v2, {skillCount} portable skills, and {docCount} architecture documents. Drafts only — zero live CRM writes or outreach sends without explicit human approval.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/automations"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[13.5px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            <Workflow className="size-4 text-blue-600" />
            <span>n8n 6-Step Engine</span>
          </Link>
          <a
            href="/loadsmart-abm-os.zip"
            download
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-[13.5px] font-semibold text-white hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            <Download className="size-4" />
            <span>Download Kit (.zip)</span>
          </a>
        </div>
      </section>

      {/* Segmented Control Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label="Workspace modes"
          className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-slate-100/80 p-1"
        >
          <button
            role="tab"
            aria-selected={activeTab === "copilot"}
            onClick={() => setActiveTab("copilot")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[13.5px] font-semibold whitespace-nowrap transition-all ${
              activeTab === "copilot"
                ? "bg-white text-slate-950 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Bot className="size-4 text-blue-600" />
            <span>Live Pod Copilot</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "pipeline"}
            onClick={() => setActiveTab("pipeline")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[13.5px] font-semibold whitespace-nowrap transition-all ${
              activeTab === "pipeline"
                ? "bg-white text-slate-950 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Workflow className="size-4 text-blue-600" />
            <span>6-Step Pipeline Walkthrough</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "cadence"}
            onClick={() => setActiveTab("cadence")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[13.5px] font-semibold whitespace-nowrap transition-all ${
              activeTab === "cadence"
                ? "bg-white text-slate-950 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShieldCheck className="size-4 text-blue-600" />
            <span>Guardrails & Daily Cadence</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[13px] text-slate-500">
          <Link href="/skills" className="font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 whitespace-nowrap">
            <span>Browse {skillCount} Skills</span>
            <ArrowRight className="size-3.5" />
          </Link>
          <Link href="/courses" className="font-medium text-slate-700 hover:text-slate-950 inline-flex items-center gap-1 whitespace-nowrap">
            <span>Rep AI Academy</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>

      {/* Mode 1: Live Pod Copilot */}
      {activeTab === "copilot" && (
        <motion.div
          key="copilot"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
        >
          <div className="lg:col-span-8">
            <DemoChat />
          </div>

          <aside className="lg:col-span-4 space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[14px] font-bold text-slate-900">Active Pod Guardrails</h2>
                <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-amber-700">
                  <Lock className="size-3.5" /> Approval Gated
                </span>
              </div>
              <ul className="space-y-3 text-[13px] text-slate-600 leading-relaxed">
                <li>
                  <span className="font-semibold text-slate-900">1. Human Sign-Off Required:</span> Drafts pause in approval queue; zero blind Gong/Apollo sends.
                </li>
                <li>
                  <span className="font-semibold text-slate-900">2. Claims Library Enforcement:</span> Outbound numbers must map to an approved row in <code className="font-mono text-[12px] text-blue-700">claims-library.md</code>.
                </li>
                <li>
                  <span className="font-semibold text-slate-900">3. Product Isolation:</span> Opendock, ShipperGuide TMS, and Loadsmart AI never mix inside a single touchpoint.
                </li>
                <li>
                  <span className="font-semibold text-slate-900">4. Collision Shield:</span> Active Salesforce customers and open opportunities quarantine automatically.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-3">
              <h2 className="text-[14px] font-bold text-slate-900">Connected Resources</h2>
              <div className="space-y-2 text-[13px]">
                <Link
                  href="/automations"
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 font-medium text-slate-800 hover:border-blue-300 transition-colors"
                >
                  <span>6-Step n8n Workflow & Setup Prompt</span>
                  <ArrowRight className="size-3.5 text-slate-400" />
                </Link>
                <Link
                  href="/skills"
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 font-medium text-slate-800 hover:border-blue-300 transition-colors"
                >
                  <span>Team Skills Marketplace ({skillCount})</span>
                  <ArrowRight className="size-3.5 text-slate-400" />
                </Link>
                <Link
                  href="/courses"
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 font-medium text-slate-800 hover:border-blue-300 transition-colors"
                >
                  <span>Loadsmart Claude Code Academy</span>
                  <ArrowRight className="size-3.5 text-slate-400" />
                </Link>
                <Link
                  href="/documents"
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 font-medium text-slate-800 hover:border-blue-300 transition-colors"
                >
                  <span>Specifications & Playbook Library</span>
                  <ArrowRight className="size-3.5 text-slate-400" />
                </Link>
              </div>
            </div>
          </aside>
        </motion.div>
      )}

      {/* Mode 2: Interactive 6-Step Pipeline Walkthrough */}
      {activeTab === "pipeline" && (
        <motion.div
          key="pipeline"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {pipelineWalkthrough.map((stage, idx) => {
              const selected = idx === activeStepIdx;
              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStepIdx(idx)}
                  className={`rounded-xl border p-3.5 text-left transition-all ${
                    selected
                      ? "border-blue-600 bg-blue-50/70"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="font-mono text-[11.5px] font-semibold tabular-nums text-blue-700">
                    Step {stage.step}
                  </div>
                  <div className="mt-1 text-[13.5px] font-bold text-slate-900 leading-snug">
                    {stage.title.split(" · ")[0]}
                  </div>
                  <div className="mt-0.5 text-[11.5px] text-slate-500 line-clamp-1">
                    {stage.title.split(" · ")[1]}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="text-[12px] font-mono text-slate-500">
                  Step {selectedStage.step} · {selectedStage.skill}
                </div>
                <h2 className="mt-1 text-[22px] sm:text-[26px] font-bold text-slate-900">
                  {selectedStage.title}
                </h2>
                <p className="mt-1 text-[13.5px] text-slate-600">{selectedStage.stack}</p>
              </div>
              <Link
                href="/automations"
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-blue-700 whitespace-nowrap shrink-0"
              >
                <span>Open n8n Blueprint</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <p className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">Inputs</p>
                <p className="text-[14px] leading-relaxed text-slate-800">{selectedStage.input}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">Deterministic Output</p>
                <p className="text-[14px] leading-relaxed text-slate-800">{selectedStage.output}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-[12px] font-semibold uppercase tracking-wider text-amber-700">Verification Gate</p>
                <p className="text-[14px] leading-relaxed text-slate-800">{selectedStage.gate}</p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-900 p-4 text-[13.5px] text-slate-100">
              <span className="font-mono text-[11.5px] uppercase tracking-wider text-blue-300">Loadsmart Trace Example: </span>
              <span>{selectedStage.example}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Mode 3: Guardrails & Daily Cadence */}
      {activeTab === "cadence" && (
        <motion.div
          key="cadence"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="space-y-6"
        >
          <div className="grid md:grid-cols-3 gap-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2">
              <div className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-emerald-700">
                <CheckCircle2 className="size-4" /> Calibrated Truth Guard
              </div>
              <h2 className="text-[17px] font-bold text-slate-900">Approved Claims Only</h2>
              <p className="text-[13.5px] leading-relaxed text-slate-600">
                Public website metrics remain unapproved for cold emails until assigned an audited <code className="font-mono text-[12px]">C-XXX</code> row inside <code className="font-mono text-[12px]">knowledge/loadsmart/claims-library.md</code>.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2">
              <div className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-amber-700">
                <Lock className="size-4" /> Human-in-the-Loop Gate
              </div>
              <h2 className="text-[17px] font-bold text-slate-900">REQUIRE_APPROVAL = true</h2>
              <p className="text-[13.5px] leading-relaxed text-slate-600">
                The 6-step n8n engine ships with <code className="font-mono text-[12px]">dry_run: true</code>. Drafts post to Slack <code className="font-mono text-[12px]">#gtm-pod-approvals</code> before any Gong or Apollo sequence fires.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2">
              <div className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-blue-700">
                <ShieldCheck className="size-4" /> Salesforce Collision Shield
              </div>
              <h2 className="text-[17px] font-bold text-slate-900">Channel Protection</h2>
              <p className="text-[13.5px] leading-relaxed text-slate-600">
                Every domain is checked against active Salesforce Accounts, Open Opportunities, and suppression lists prior to contact enrichment.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-[18px] font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="size-4 text-blue-600" />
                  <span>Daily ABM Pod Rhythm (06:00 to 17:00 CT)</span>
                </h2>
                <p className="mt-1 text-[13.5px] text-slate-600">
                  Scheduled orchestration executed via n8n and supervised by Pod AE/SDR leads.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13.5px]">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-medium">
                  <tr>
                    <th className="py-3 px-5">Schedule</th>
                    <th className="py-3 px-5">Skill</th>
                    <th className="py-3 px-5">Pipeline Action</th>
                    <th className="py-3 px-5">Gate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {cadenceRows.map((row) => (
                    <tr key={row.time} className="hover:bg-slate-50/70">
                      <td className="py-3.5 px-5 font-mono text-[12.5px] tabular-nums text-slate-500 whitespace-nowrap">
                        {row.time}
                      </td>
                      <td className="py-3.5 px-5 font-mono text-[13px] font-semibold text-slate-900 whitespace-nowrap">
                        {row.skill}
                      </td>
                      <td className="py-3.5 px-5">{row.action}</td>
                      <td className="py-3.5 px-5 font-medium text-slate-800 whitespace-nowrap">{row.gate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
