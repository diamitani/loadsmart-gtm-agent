import { Boxes, Download, Layers, ShieldCheck, Zap, Clock, ArrowRight } from "lucide-react";
import { listSkills, SKILL_FOR } from "@/lib/agent/skills";
import { ASSET_TITLES } from "@/lib/pal/intent";
import { STAGES, STAGE_LABELS } from "@/lib/pal/types";
import { Badge, Card, PageHeader } from "@/components/ui";
import Link from "next/link";

export const metadata = { title: "Loadsmart ABM Skills & Agents" };

const LOADSMART_SKILLS = [
  { id: "la-signal", time: "Daily 06:00", name: "Signal Ingest", description: "Detects dated, sourced why-now triggers mapped to Opendock, ShipperGuide, and Loadsmart AI." },
  { id: "la-crm-audit", time: "Weekly Mon", name: "CRM Shield Audit", description: "Inventories Salesforce accounts to prevent collision with active AE deals or existing customers." },
  { id: "la-abm-tag", time: "Weekly Mon", name: "ABM Tagging", description: "Allocates 20 target accounts per pod with written fit rationale approved by RevOps." },
  { id: "la-persona-enrich", time: "Daily 07:00", name: "Persona Enrichment", description: "Waterfall enrichment for verified contacts across logistics, warehousing, and transportation titles." },
  { id: "la-research", time: "Daily 07:30", name: "Account Briefs", description: "Synthesizes 6-part sourced account briefs separating confirmed facts from AI inference." },
  { id: "la-email", time: "Daily 08:00", name: "1-to-1 Email Copy", description: "Generates body-only PAS emails adhering strictly to the verified claims library." },
  { id: "la-sequence", time: "Daily 08:30", name: "Sequence Hand-off", description: "Enrolls approved batches into Gong/Apollo flow with email, phone script, and LinkedIn touchpoints." },
  { id: "la-daily-report", time: "Daily 17:00", name: "Funnel & Leak Digest", description: "Generates daily conversion reports, flag leaks, and logs rep scorecards." },
  { id: "la-list-qa", time: "Weekly", name: "Outbound QA", description: "Audits outgoing touchpoints against safety thresholds and compliance checklists." },
  { id: "la-pod-feedback", time: "Weekly", name: "Pod Feedback Loop", description: "Turns AE/SDR objections and prospect responses into prompt and skill updates." },
  { id: "loadsmart-abm-orchestrator", time: "Automated", name: "ABM Orchestrator", description: "Coordinates deterministic multi-step pipelines across n8n, Claude, and Salesforce." }
];

const SUBAGENTS: { id: string; role: string }[] = [
  { id: "icp", role: "ICP Architect" },
  { id: "personas", role: "Persona Architect" },
  { id: "messaging", role: "Messaging Architect" },
  { id: "outbound-sequences", role: "Outbound Architect" },
  { id: "competitive", role: "Competitive Architect" },
  { id: "kpi", role: "KPI Architect" },
  { id: "playbook", role: "Playbook Architect" },
  { id: "prospector", role: "Prospector" },
  { id: "n8n-engineer", role: "Automation Engineer" },
  { id: "use-cases", role: "Use Case Architect" },
  { id: "sales-ops-setup", role: "Sales Ops Architect" },
];

export default function AgentsPage() {
  const skills = listSkills();
  const owns = (skill: string) => Object.entries(SKILL_FOR).filter(([, s]) => s === skill).map(([k]) => ASSET_TITLES[k as keyof typeof ASSET_TITLES]);
  
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8 space-y-10">
      <PageHeader 
        eyebrow="Loadsmart Enablement Kit" 
        title="Loadsmart ABM Skills & GTM Agents" 
        description={<>The complete 11-skill kit for Loadsmart&apos;s Account-Based Selling pods, plus the underlying autonomous GTM specialist engine. All skills adhere strictly to human approval gates and the verified claims library.</>} 
      />

      {/* Download Kit Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-blue-400" /> Production ABM Kit v1.0.0
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Download Loadsmart ABM OS Package</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Ready-to-run ZIP bundle containing all 11 skills, YAML configurations (ICP, Personas, Sending, Pods), Salesforce field definitions, Claude Code instructions, and HTML Pod Dashboard.
          </p>
        </div>
        <a
          href="/downloads/loadsmart-abm-os.zip"
          download
          className="shrink-0 inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md transition-all hover:shadow-lg"
        >
          <Download className="w-4.5 h-4.5" /> Download ABM OS (.zip)
        </a>
      </div>

      {/* 11 Loadsmart ABM Skills Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">11 Loadsmart ABM Skills (Daily Pipeline)</h2>
            <p className="text-xs text-slate-500">Autonomous skills executing the 06:00 to 17:00 signal-to-sequence workflow</p>
          </div>
          <Link href="/app/pipeline" className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
            View Live Pipeline <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LOADSMART_SKILLS.map((s) => (
            <Card key={s.id} className="p-4 bg-white border border-slate-200 hover:border-blue-400 transition-colors">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {s.id}
                </span>
                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {s.time}
                </span>
              </div>
              <div className="mt-2 text-sm font-bold text-slate-900">{s.name}</div>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">{s.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* GTM Orchestrator Architecture Card */}
      <Card className="p-6 bg-white border border-slate-200">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-blue-600 text-white shadow-sm">
            <Boxes className="h-7 w-7" />
          </div>
          <div className="min-w-0">
            <div className="text-2xl font-bold text-slate-900">Loadsmart Pod Copilot <span className="text-base font-normal text-slate-500">· Sovereign Orchestrator</span></div>
            <p className="mt-1 text-sm text-slate-600">
              Evaluates foundation completeness (W = 1.00), schedules multi-agent waves across Opendock, ShipperGuide, and Loadsmart AI, enforces CRM safety shields, and gates all external actions behind human approvals.
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-1.5 border-t border-slate-100 pt-4">
          {STAGES.map((s, i) => (
            <span key={s} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-700">
              <span className="font-mono text-slate-400 font-bold">{i + 1}</span> {STAGE_LABELS[s].title}
            </span>
          ))}
        </div>
      </Card>

      {/* Specialist Subagents */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">GTM Engine Specialist Subagents</h2>
        <p className="text-xs text-slate-500 mb-4">Deep domain agents handling individual asset classes within the build engine</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SUBAGENTS.map((a) => (
            <Card key={a.id} className="p-4 bg-white border border-slate-200">
              <div className="text-sm font-bold text-slate-900">{a.role}</div>
              <div className="mt-0.5 font-mono text-[10px] text-slate-400">agent/skills/{a.id}</div>
              <div className="mt-3 flex flex-wrap gap-1">
                {owns(a.id).map((t) => <Badge key={t} tone="clay">{t}</Badge>)}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Portable Skill Library */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Extended Skill Library</h2>
        <p className="text-xs text-slate-500 mb-4">Underlying prompt specs and references installed in this workspace</p>
        <div className="card divide-y divide-slate-100 bg-white border border-slate-200 rounded-xl overflow-hidden">
          {skills.map((s) => (
            <div key={s.name} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-sm font-semibold text-slate-900">{s.name}</div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">{s.path}</div>
              </div>
              <Badge tone="neutral">Markdown Spec</Badge>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
