"use client";

import { useState } from "react";
import Link from "next/link";
import { DemoChat } from "@/components/demo-chat";
import {
  Bot,
  Sparkles,
  Download,
  Terminal,
  ShieldCheck,
  Search,
  ExternalLink,
  Clock,
  Layers,
  FileCode,
  CheckCircle2,
  X,
  ArrowRight,
} from "lucide-react";
import { ChatMarkdown } from "@/components/markdown";

export type AgentSkill = {
  slug: string;
  name: string;
  description: string;
  body: string;
  category: "loadsmart" | "sovereign";
  step: string;
  when: string;
};

type Props = {
  skills: AgentSkill[];
  totalDocs: number;
};

export function AgentConsoleView({ skills, totalDocs }: Props) {
  const [activeTab, setActiveTab] = useState<"chat" | "skills" | "specs" | "cadence">("chat");
  const [filter, setFilter] = useState<"all" | "loadsmart" | "sovereign">("all");
  const [search, setSearch] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<AgentSkill | null>(null);

  const filteredSkills = skills.filter((s) => {
    const matchesCategory = filter === "all" || s.category === filter;
    const matchesSearch =
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.slug.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10">
      {/* Top Banner: No Sign Up Required */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 px-5 text-emerald-950">
        <div className="flex items-center gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white">
            <CheckCircle2 className="size-4" />
          </span>
          <div>
            <p className="text-[14px] font-semibold">Open Demonstration Mode · No Sign Up Required</p>
            <p className="text-[12.5px] text-emerald-700">
              Complete access to the live pod agent, 34 autonomous skills, verified claims library, and full architecture.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/loadsmart-abm-os.zip"
            download
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-[13px] font-medium text-white hover:bg-emerald-700 transition-colors"
          >
            <Download className="size-3.5" /> Download Full Kit (.zip)
          </a>
        </div>
      </div>

      {/* Hero Section */}
      <div className="mb-10">
        <div className="flex flex-wrap items-center gap-2 text-[12.5px] font-semibold tracking-wider text-blue-600 uppercase">
          <span>Live Sovereign GTM Agent</span>
          <span>·</span>
          <span>Version 1.0.0</span>
          <span>·</span>
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-blue-700 border border-blue-200/60">
            OpenRouter / Nemotron / Llama / Claude / Gemini
          </span>
        </div>
        <h1 className="mt-3 text-[34px] sm:text-[46px] font-bold tracking-tight text-slate-900 leading-[1.08]">
          Loadsmart Live GTM Sovereign Agent OS
        </h1>
        <p className="mt-3 max-w-3xl text-[16.5px] text-slate-600 leading-relaxed">
          The hybrid AE/SDR pod execution engine. Grounded in 34 skills, 4 dedicated product lines (Opendock,
          ShipperGuide, Loadsmart AI, Freight Services), strict CRM collision shielding, and human-in-the-loop batch
          approval.
        </p>

        {/* Tab Switcher */}
        <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-px">
          <button
            onClick={() => setActiveTab("chat")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-[14px] font-medium transition-colors border-b-2 ${
              activeTab === "chat"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
            }`}
          >
            <Bot className="size-4" /> Live Agent Terminal
          </button>
          <button
            onClick={() => setActiveTab("skills")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-[14px] font-medium transition-colors border-b-2 ${
              activeTab === "skills"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
            }`}
          >
            <Sparkles className="size-4" /> 34 Skills Matrix ({skills.length})
          </button>
          <button
            onClick={() => setActiveTab("specs")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-[14px] font-medium transition-colors border-b-2 ${
              activeTab === "specs"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
            }`}
          >
            <ShieldCheck className="size-4" /> Specs & Covenant ({totalDocs} Docs)
          </button>
          <button
            onClick={() => setActiveTab("cadence")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-[14px] font-medium transition-colors border-b-2 ${
              activeTab === "cadence"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
            }`}
          >
            <Clock className="size-4" /> Daily Pipeline Cadence
          </button>
        </div>
      </div>

      {/* Tab 1: Live Chat */}
      {activeTab === "chat" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <DemoChat />
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
                <h3 className="text-[14px] font-semibold text-slate-900 flex items-center gap-2">
                  <Terminal className="size-4 text-blue-600" /> Active Agent Rules
                </h3>
                <ul className="mt-3 space-y-2 text-[12.5px] text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-slate-900">1.</span>
                    <span><strong>REQUIRE_APPROVAL = true:</strong> Zero blind sends. Every outreach batch requires human approval.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-slate-900">2.</span>
                    <span><strong>Verified Claims:</strong> Grounded in 1,800+ shippers, 4,500 warehouses, 230k vetted carriers.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-slate-900">3.</span>
                    <span><strong>Product Separation:</strong> Opendock (docks), ShipperGuide (TMS), Loadsmart AI (operations).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-slate-900">4.</span>
                    <span><strong>Collision Shield:</strong> Accounts with active deals or customers are strictly quarantined.</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-[14px] font-semibold text-slate-900 flex items-center gap-2">
                  <Layers className="size-4 text-emerald-600" /> Quick Inquiries
                </h3>
                <p className="mt-1 text-[12px] text-slate-500">
                  Copy and paste into the prompt to test live tool invocation:
                </p>
                <div className="mt-3 space-y-2">
                  {[
                    "Plan an SDR's morning across all three products",
                    "Draft an outbound sequence for Opendock new warehouse opening",
                    "Diagnose pod leak: positive replies up, meetings flat",
                    "Verify carrier network size against claims library",
                    "Explain la-crm-audit deduplication algorithm",
                  ].map((q) => (
                    <div
                      key={q}
                      className="rounded-xl border border-slate-200 p-2.5 text-[12px] text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      {q}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5">
                <h3 className="text-[14px] font-semibold text-blue-900">Kit Downloads</h3>
                <p className="mt-1 text-[12.5px] text-blue-700">
                  Ready-to-run package with all 34 skills, configuration YAMLs, templates, and dashboard.
                </p>
                <a
                  href="/loadsmart-abm-os.zip"
                  download
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-[13px] font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  <Download className="size-4" /> Download Complete (.zip)
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Skills Matrix */}
      {activeTab === "skills" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                  filter === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All Skills ({skills.length})
              </button>
              <button
                onClick={() => setFilter("loadsmart")}
                className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                  filter === "loadsmart" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Loadsmart ABM Pods (11)
              </button>
              <button
                onClick={() => setFilter("sovereign")}
                className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                  filter === "sovereign" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Sovereign GTM Engineering (23)
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search 34 skills..."
                className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-1.5 text-[13px] focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSkills.map((s) => (
              <div
                key={s.slug}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                        s.category === "loadsmart"
                          ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                          : "bg-indigo-50 text-indigo-700 border border-indigo-200/60"
                      }`}
                    >
                      {s.step}
                    </span>
                    <a
                      href={`/skills/${s.slug}.zip`}
                      download
                      className="text-slate-400 hover:text-blue-600 transition-colors"
                      title="Download individual skill .zip"
                    >
                      <Download className="size-4" />
                    </a>
                  </div>
                  <h3 className="mt-3 text-[16px] font-bold text-slate-900">{s.name}</h3>
                  <p className="mt-1.5 text-[13px] text-slate-600 leading-snug line-clamp-2">{s.description}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[12px]">
                  <span className="text-slate-400 font-mono text-[11px]">{s.slug}</span>
                  <button
                    onClick={() => setSelectedSkill(s)}
                    className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Inspect <ArrowRight className="size-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Specs & Covenant */}
      {activeTab === "specs" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-600 mb-4">
                <FileCode className="size-5" />
              </span>
              <h3 className="text-[17px] font-bold text-slate-900">gtm-architect.agent.yaml</h3>
              <p className="mt-1.5 text-[13.5px] text-slate-600 leading-relaxed">
                The Master Agent specification defining agent identity, covenants, tool permissions, and middle-out
                wave orchestrator.
              </p>
              <div className="mt-4 rounded-xl bg-slate-900 p-3 font-mono text-[12px] text-emerald-400">
                name: enably-gtm-architect<br />
                harness: vercel-ai-sdk<br />
                version: 1.0.0
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600 mb-4">
                <ShieldCheck className="size-5" />
              </span>
              <h3 className="text-[17px] font-bold text-slate-900">Calibrated Truth Guard</h3>
              <p className="mt-1.5 text-[13.5px] text-slate-600 leading-relaxed">
                Dual-pole truth enforcement: operational rigor on data, claims, and numbers; human warmth on creative
                copy and outbound drafts.
              </p>
              <div className="mt-4 rounded-xl bg-slate-900 p-3 font-mono text-[12px] text-emerald-400">
                zero_hallucinations: true<br />
                verify_against: claims-library<br />
                require_approval: true
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <span className="grid size-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600 mb-4">
                <Layers className="size-5" />
              </span>
              <h3 className="text-[17px] font-bold text-slate-900">Site Empire OS (25 Specs)</h3>
              <p className="mt-1.5 text-[13.5px] text-slate-600 leading-relaxed">
                Every foundational specification from intent-spec to evidence ledger, SDLC gates, and AWS
                Well-Architected reviews.
              </p>
              <Link
                href="/documents"
                className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-blue-600 hover:text-blue-700"
              >
                Browse All Documents <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Daily Cadence */}
      {activeTab === "cadence" && (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-[18px] font-bold text-slate-900">The Daily ABM Pod Rhythm (06:00 to 17:00 CT)</h3>
            <p className="mt-1 text-[14px] text-slate-600">
              Deterministic handoff schedule executed by n8n orchestrator and supervised by pod SDR/AE leads.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13.5px]">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-medium">
                <tr>
                  <th className="py-3 px-5">Time (CT)</th>
                  <th className="py-3 px-5">Skill</th>
                  <th className="py-3 px-5">System Action</th>
                  <th className="py-3 px-5">Human Gate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3.5 px-5 font-mono text-[12px] text-slate-500">06:00</td>
                  <td className="py-3.5 px-5 font-semibold text-slate-900">la-signal</td>
                  <td className="py-3.5 px-5">Dated why-now triggers mapped to Opendock, ShipperGuide, Loadsmart AI</td>
                  <td className="py-3.5 px-5 text-slate-400">Automated query</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-mono text-[12px] text-slate-500">06:30</td>
                  <td className="py-3.5 px-5 font-semibold text-slate-900">la-crm-audit</td>
                  <td className="py-3.5 px-5">Scores domains against Salesforce, checks collision shield, tags accounts</td>
                  <td className="py-3.5 px-5 text-slate-400">Automated deduping</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-mono text-[12px] text-slate-500">Mon 07:00</td>
                  <td className="py-3.5 px-5 font-semibold text-slate-900">la-abm-tag</td>
                  <td className="py-3.5 px-5">Allocates 20 target accounts per pod with written scoring rationale</td>
                  <td className="py-3.5 px-5 font-medium text-amber-700">RevOps Approves</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-mono text-[12px] text-slate-500">07:15</td>
                  <td className="py-3.5 px-5 font-semibold text-slate-900">la-persona-enrich</td>
                  <td className="py-3.5 px-5">Clay waterfall discovery: verified emails/mobiles for 3-5 buying personas</td>
                  <td className="py-3.5 px-5 text-slate-400">Automated verification</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-mono text-[12px] text-slate-500">07:45</td>
                  <td className="py-3.5 px-5 font-semibold text-slate-900">la-research</td>
                  <td className="py-3.5 px-5">6-part sourced account briefs synthesizing SEC filings, news, and logistics</td>
                  <td className="py-3.5 px-5 text-slate-400">Synthesized report</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-mono text-[12px] text-slate-500">08:15</td>
                  <td className="py-3.5 px-5 font-semibold text-slate-900">la-email</td>
                  <td className="py-3.5 px-5">Generates 1-to-1 PAS cold email touchpoints (Touch 1-3) with verified claims</td>
                  <td className="py-3.5 px-5 text-slate-400">Drafts generated</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-mono text-[12px] text-slate-500">08:30</td>
                  <td className="py-3.5 px-5 font-semibold text-slate-900">la-sequence</td>
                  <td className="py-3.5 px-5">Batch approval drawer: push approved emails & dialer drops to Gong / Outreach</td>
                  <td className="py-3.5 px-5 font-semibold text-emerald-700">AE/SDR Batch Yes</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-mono text-[12px] text-slate-500">17:00</td>
                  <td className="py-3.5 px-5 font-semibold text-slate-900">la-daily-report</td>
                  <td className="py-3.5 px-5">Calculates conversion funnel, flags leak points, produces CSV for dashboard</td>
                  <td className="py-3.5 px-5 text-slate-400">EOD Digest</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Skill Modal */}
      {selectedSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="relative max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
                  {selectedSkill.step} · {selectedSkill.when}
                </span>
                <h2 className="text-[20px] font-bold text-slate-900">{selectedSkill.name}</h2>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`/skills/${selectedSkill.slug}.zip`}
                  download
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-[12.5px] font-semibold text-slate-700 hover:bg-slate-200"
                >
                  <Download className="size-3.5" /> Download (.zip)
                </a>
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 prose prose-slate max-w-none text-[14px]">
              <ChatMarkdown source={selectedSkill.body} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
