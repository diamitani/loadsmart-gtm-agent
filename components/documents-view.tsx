"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  FileText, 
  Download, 
  Copy, 
  Check, 
  BookOpen, 
  Cpu, 
  Workflow, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Layers,
  FileCode
} from "lucide-react";

export function DocumentsView() {
  const [docCategory, setDocCategory] = useState<"empire" | "playbook" | "skills" | "automations" | "claims">("empire");
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const empireDocs = [
    { num: "01", name: "Intent Spec", file: "docs/01-intent-spec.md", owner: "Product", desc: "Core problem, audience, pods, constraints and acceptance signals." },
    { num: "02", name: "JTBD Report", file: "docs/02-jtbd.md", owner: "Product", desc: "Primary and secondary jobs-to-be-done for Loadsmart AE/SDR pods." },
    { num: "03", name: "User Stories", file: "docs/03-user-stories.md", owner: "Product", desc: "INVEST stories for rep prospecting, CRM shield, and sequence approval." },
    { num: "04", name: "Information Architecture", file: "docs/04-ia.md", owner: "Design", desc: "Canonical objects (Pod, Account, Contact, Sequence, Claim, Deal)." },
    { num: "05", name: "Sitemap Standard", file: "docs/05-sitemap.md", owner: "Design", desc: "URL tree, authentication gates, and operational roles." },
    { num: "06", name: "User Flows", file: "docs/06-flows.md", owner: "Design", desc: "End-to-end flows: Signal Scout → Enrichment → Copilot → Sequence." },
    { num: "07", name: "Design System & Taste Brief", file: "docs/07-design-system.md", owner: "Design", desc: "Anti-slop design system tokens, typography, and clean white-card UI." },
    { num: "08", name: "Product Requirements Document", file: "docs/08-prd.md", owner: "Product", desc: "Full PRD for Loadsmart GTM Agent v1.0.0." },
    { num: "09", name: "Specifications", file: "docs/09-specifications.md", owner: "Eng", desc: "Functional and non-functional specs (SLOs, latencies, send caps)." },
    { num: "10", name: "System Architecture", file: "docs/10-architecture.md", owner: "Eng", desc: "C4 Level 1–3 diagrams and failure recovery modes." },
    { num: "11", name: "Stack Decision Record (ADR)", file: "docs/11-stack-adr.md", owner: "Eng", desc: "Next.js App Router, Vercel AI SDK v7, Cloudflare Workers, n8n." },
    { num: "12", name: "Data Model", file: "docs/12-data-model.md", owner: "Eng", desc: "Postgres schema, Row-Level Security policies, and JSON persistence." },
    { num: "13", name: "API Contract", file: "docs/13-api.md", owner: "Eng", desc: "Route handlers, idempotency keys, and error payloads." },
    { num: "14", name: "Frontend UI Spec", file: "docs/14-frontend-ui.md", owner: "Design/Eng", desc: "Dashboard, Copilot, Pipeline, and Review Drawer specifications." },
    { num: "15", name: "Backend / Infra Spec", file: "docs/15-backend-infra.md", owner: "Eng", desc: "Compute, Edge cron scheduler, database migrations, and deployments." },
    { num: "16", name: "Payments / Commercial Spec", file: "docs/16-payments.md", owner: "Product", desc: "Commercial tiers (Starter, Pro, Team) and take-rate margin models." },
    { num: "17", name: "Security & Privacy", file: "docs/17-security.md", owner: "Security", desc: "Threat models, secret isolation, CAN-SPAM, and SOC 2 Type II compliance." },
    { num: "18", name: "Observability", file: "docs/18-observability.md", owner: "Ops", desc: "Mailbox deliverability thresholds, bounce alerts, and leak logging." },
    { num: "19", name: "Product Roadmap", file: "docs/19-roadmap.md", owner: "Product", desc: "Now / Next / Later rollout across mid-market and enterprise pods." },
    { num: "20", name: "Build Playbook", file: "docs/20-playbook.md", owner: "Eng", desc: "Critical path, definition of done, and deploy runbooks." },
    { num: "21", name: "Quality Scorecard", file: "docs/21-quality.md", owner: "QA", desc: "Verification criteria for Truth Guard W = 1.00." },
    { num: "22", name: "Runbook & Incident Response", file: "docs/22-runbook.md", owner: "Ops", desc: "Secondary domain pause protocols and emergency rollback." },
    { num: "23", name: "Legal Pack", file: "docs/23-legal.md", owner: "Legal", desc: "Terms, privacy, acceptable use, and data protection policies." },
    { num: "24", name: "Instruction Pack", file: "docs/24-instruction-pack.md", owner: "Agent", desc: "Agent forge soul, prompt patterns, and execution briefs." },
    { num: "25", name: "Evidence Ledger", file: "docs/25-evidence.md", owner: "Research", desc: "Audit trace of sources, claims library citations, and benchmarks." }
  ];

  const skillPacks = [
    { slug: "loadsmart-abm-orchestrator", step: "Orchestration", desc: "Master coordinator that drives the daily 10-step sequence across all 4 pods." },
    { slug: "la-signal", step: "Step 01", desc: "Nominates candidate accounts by scoring hiring, carrier procurement, and DC expansion." },
    { slug: "la-crm-audit", step: "Step 02", desc: "CRM Shield: Checks domains against active Salesforce deals to prevent collisions." },
    { slug: "la-abm-tag", step: "Step 03", desc: "Verifies RevOps quota alignment and assigns accounts to dedicated product pods." },
    { slug: "la-persona-enrich", step: "Step 04", desc: "Discovers verified freight leaders (VP Logistics, Plant Managers) via Clay waterfall." },
    { slug: "la-research", step: "Step 05", desc: "Compiles account dossiers with MercuryGate footprints and dispatch bottlenecks." },
    { slug: "la-email", step: "Step 06", desc: "Synthesizes 1-to-1 PAS cold email touchpoints verified against Loadsmart claims." },
    { slug: "la-sequence", step: "Step 07", desc: "Enrolls batch-approved contacts into Gong Engage flows and secondary inboxes." },
    { slug: "la-deliverability", step: "Step 08", desc: "Monitors 8 secondary domain pools; pauses mailboxes if bounce rate exceeds 2%." },
    { slug: "la-feedback", step: "Step 09", desc: "Correlates positive rep replies and booked meetings back into signal scoring." },
    { slug: "la-report", step: "Step 10", desc: "Publishes the 17:00 Daily Leak Digest and stuck accounts triage report." }
  ];

  const claimsData = [
    { metric: "1,800+ Shippers", label: "Shipper Customer Base", detail: "Global enterprise customers running on Loadsmart technology" },
    { metric: "4,500+ Facilities", label: "Warehouse Network", detail: "Live warehouses and distribution centers on Opendock" },
    { metric: "230,000+ Carriers", label: "Carrier Capacity Network", detail: "Vetted multimodal carriers with 98%+ on-time delivery" },
    { metric: "14 Million+ Docks", label: "Annual Appointments", detail: "Scheduled annually on Opendock's cloud platform" },
    { metric: "11 Specialized Agents", label: "Autonomous AI Agents", detail: "Handling quoting, dispatch, and tracking inside existing TMS/ERPs" },
    { metric: "SOC 2 Type II", label: "Enterprise Security", detail: "Enterprise-grade cloud compliance, encryption, and auditability" }
  ];

  function handleCopyPath(path: string) {
    navigator.clipboard.writeText(path);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Category Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 p-2.5 rounded-xl shadow-xs">
        <div className="flex items-center gap-1.5 pl-2">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
            GTM Documentation & Asset Hub
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setDocCategory("empire")}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              docCategory === "empire" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Site Empire OS (25 Docs)
          </button>
          <button
            onClick={() => setDocCategory("playbook")}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              docCategory === "playbook" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Playbook v2 & Battlecards
          </button>
          <button
            onClick={() => setDocCategory("skills")}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              docCategory === "skills" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Skills Pack (.zip)
          </button>
          <button
            onClick={() => setDocCategory("automations")}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              docCategory === "automations" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            n8n & Clay Blueprints
          </button>
          <button
            onClick={() => setDocCategory("claims")}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              docCategory === "claims" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Claims Library
          </button>
        </div>
      </div>

      {/* Category 1: Site Empire OS 25 Docs */}
      {docCategory === "empire" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Document Navigation List */}
          <div className="lg:col-span-5 space-y-2 max-h-[640px] overflow-y-auto pr-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pl-1 pb-1">
              Complete 25-Document Suite (Site Empire OS)
            </div>
            {empireDocs.map((doc, idx) => (
              <div
                key={doc.num}
                onClick={() => setSelectedDocIndex(idx)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedDocIndex === idx
                    ? "bg-blue-50/60 border-blue-400 shadow-xs"
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono text-blue-600 font-bold">Doc {doc.num}</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                    {doc.owner}
                  </span>
                </div>
                <div className="font-bold text-xs sm:text-sm text-slate-900 mt-1">{doc.name}</div>
                <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{doc.desc}</div>
              </div>
            ))}
          </div>

          {/* Document Preview Pane */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <div className="text-xs font-mono text-blue-600 font-bold">
                    Doc {empireDocs[selectedDocIndex].num} · {empireDocs[selectedDocIndex].owner}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                    {empireDocs[selectedDocIndex].name}
                  </h3>
                </div>
                <button
                  onClick={() => handleCopyPath(empireDocs[selectedDocIndex].file)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 transition-colors flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy Path"}</span>
                </button>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div><strong>Path:</strong> <code className="text-xs font-mono text-blue-700">{empireDocs[selectedDocIndex].file}</code></div>
                <div><strong>Scope:</strong> {empireDocs[selectedDocIndex].desc}</div>
                <div><strong>Governance Status:</strong> <span className="text-emerald-700 font-semibold">Approved (v1.0.0 · W = 1.00 Verified)</span></div>
                <div><strong>Governing Pillars:</strong> Operational Excellence, Security, Reliability, Performance, Cost Optimization, Sustainability.</div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Document persisted in <code className="text-[11px]">/docs</code></span>
              <a
                href="/loadsmart-abm-os.zip"
                download
                className="font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>Download Kit Bundle</span>
                <Download className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Category 2: Playbook v2 */}
      {docCategory === "playbook" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="text-xs font-mono uppercase text-emerald-600 font-bold">
                Playbook v2 · November 2026
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                Loadsmart AE/SDR Pod Sales Playbook & Competitive Battlecards
              </h3>
            </div>
            <Link
              href="/playbook"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs w-fit"
            >
              <span>Open Full Interactive Playbook</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 text-sm">4 Buyer Personas</div>
              <p className="text-slate-600 leading-relaxed">
                VP Logistics, Director of Warehouse Operations, CIO & Chief Supply Chain Officer, Plant/DC Facility Managers.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 text-sm">Battlecards vs Legacy TMS</div>
              <p className="text-slate-600 leading-relaxed">
                ShipperGuide vs Oracle OTM/Manhattan (go-live in 4-6 weeks vs 18 months); Opendock vs manual phone scheduling.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 text-sm">Objections & Call Scripts</div>
              <p className="text-slate-600 leading-relaxed">
                "We already use MercuryGate" and "Our facilities handle scheduling fine with calendars" response tracks.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Category 3: Skills Pack */}
      {docCategory === "skills" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="text-xs font-mono uppercase text-blue-600 font-bold">
                11 Production Skills
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                Portable Agent Skills Pack for Claude & Cursor
              </h3>
            </div>
            <a
              href="/loadsmart-abm-os.zip"
              download
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs w-fit"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Master Kit (.zip)</span>
            </a>
          </div>

          <div className="grid md:grid-cols-2 gap-3 text-xs">
            {skillPacks.map((skill) => (
              <div key={skill.slug} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-blue-600 font-bold text-[11px]">{skill.step}</span>
                    <a
                      href={`/skills/${skill.slug}.zip`}
                      download
                      className="text-[10.5px] font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>.zip</span>
                    </a>
                  </div>
                  <div className="font-mono font-bold text-slate-900 text-xs mt-1">{skill.slug}</div>
                  <p className="text-slate-500 text-[11.5px] leading-relaxed mt-0.5">{skill.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category 4: n8n & Automations */}
      {docCategory === "automations" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="text-xs font-mono uppercase text-purple-600 font-bold">
                Connector Blueprints
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                n8n Workflows, Clay Schemas & Salesforce DDL
              </h3>
            </div>
            <Link
              href="/automations"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs w-fit"
            >
              <span>Inspect Blueprint Code Viewer</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                n8n Workflows (4)
              </span>
              <div className="font-bold text-slate-900 text-sm">Full Outbound Orchestrator</div>
              <p className="text-slate-600 leading-relaxed">
                Production JSON pipelines covering 06:00 Signal Scout, CRM Shield Dedupe, Staged Dispatch, and Leak Digest.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                Clay Waterfall
              </span>
              <div className="font-bold text-slate-900 text-sm">Freight Leader Waterfall</div>
              <p className="text-slate-600 leading-relaxed">
                Enrichment schema cascading through Apollo, ZoomInfo, Hunter, and MX validation for W = 1.00 contacts.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Salesforce DDL
              </span>
              <div className="font-bold text-slate-900 text-sm">Custom Field DDL</div>
              <p className="text-slate-600 leading-relaxed">
                Salesforce Account & Lead fields (`GTM_Pod__c`, `TMS_Footprint__c`, `Truth_Guard_Status__c`).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Category 5: Claims Library */}
      {docCategory === "claims" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="text-xs font-mono uppercase text-emerald-600 font-bold">
                Official Claims Library (W = 1.00)
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                Loadsmart Verified Proof Points
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-semibold">
              Verified Evidence
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {claimsData.map((claim, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-slate-500 font-medium">{claim.label}</div>
                <div className="text-xl font-bold text-slate-900">{claim.metric}</div>
                <div className="text-[11px] text-slate-500 leading-relaxed">{claim.detail}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
