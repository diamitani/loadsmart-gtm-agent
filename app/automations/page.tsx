"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Workflow,
  Download,
  Copy,
  Check,
  Terminal,
  ShieldCheck,
  ArrowRight,
  Lock,
} from "lucide-react";
import { AutomationBlueprint } from "@/lib/types";

type BlueprintFilter = "all" | "n8n" | "prompt" | "schemas";

const sixSteps = [
  {
    step: "01",
    label: "Signals",
    tool: "Perplexity · FreightWaves · Job Boards",
    detail: "Finds dated why-now events mapped to Opendock, ShipperGuide, or Loadsmart AI with mandatory source URL.",
  },
  {
    step: "02",
    label: "Companies",
    tool: "Salesforce Collision Shield",
    detail: "Queries Account & Opportunity records to quarantine active customers and open AE opportunities.",
  },
  {
    step: "03",
    label: "Contacts",
    tool: "ZoomInfo + Clay Waterfall",
    detail: "Runs Apollo -> Hunter -> Prospeo waterfall for VP Supply Chain, DC GM, and Logistics Directors.",
  },
  {
    step: "04",
    label: "Research",
    tool: "EDGAR 10-K · Operational News",
    detail: "Generates a 6-part Evidence Brief with clickable URLs and explicit unknown handling.",
  },
  {
    step: "05",
    label: "Email",
    tool: "Claude AI + Claims Linter",
    detail: "Writes <= 90-word PAS copy checked deterministically against knowledge/loadsmart/claims-library.md.",
  },
  {
    step: "06",
    label: "Outreach",
    tool: "Slack Approval -> Gong / Apollo",
    detail: "Pauses at REQUIRE_APPROVAL=true & dry_run=true; enrolls approved contacts with bounce throttle.",
  },
];

export default function AutomationsPage() {
  const [workflows, setWorkflows] = useState<AutomationBlueprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<BlueprintFilter>("all");
  const [selectedId, setSelectedId] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    fetch("/api/automations")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.workflows)) {
          setWorkflows(data.workflows);
          if (data.workflows.length > 0) {
            setSelectedId(data.workflows[0].id);
          }
        }
      })
      .catch((err) => console.error("Failed to load automations:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return workflows.filter((wf) => {
      if (filter === "all") return true;
      if (filter === "n8n") return wf.type === "n8n";
      if (filter === "prompt") return wf.type === "prompt";
      return wf.type === "clay" || wf.type === "salesforce" || wf.type === "gong";
    });
  }, [workflows, filter]);

  const selectedWorkflow = useMemo(() => {
    return (
      filtered.find((w) => w.id === selectedId) ||
      filtered[0] ||
      workflows[0] ||
      null
    );
  }, [filtered, selectedId, workflows]);

  const setupPromptBlueprint = useMemo(
    () => workflows.find((w) => w.type === "prompt") ?? null,
    [workflows],
  );

  function triggerDownload(bp: AutomationBlueprint) {
    const isJson = bp.filename.endsWith(".json");
    const blob = new Blob([bp.content], {
      type: isJson ? "application/json" : "text/markdown",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = bp.filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8 py-12 space-y-10">
      {/* Page Header */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-blue-600">
            Loadsmart n8n Automation & Stack Blueprints
          </p>
          <h1 className="mt-2 max-w-3xl text-[32px] sm:text-[46px] font-bold leading-[1.06] tracking-[-0.03em] text-slate-900 text-balance">
            The 6-step prospect engine built for Loadsmart&apos;s stack.
          </h1>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-slate-600">
            Signal → Company (Salesforce Shield) → Contact (ZoomInfo + Clay Waterfall) → Research (Perplexity + EDGAR) → Email (Claude + Claims Linter) → Outreach (Slack Approval + Gong/Apollo). Ships with <code className="font-mono text-[13px] text-blue-700">dry_run = true</code> and a ready-to-paste AI Setup Prompt.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {setupPromptBlueprint && (
            <button
              onClick={() => triggerDownload(setupPromptBlueprint)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[13.5px] font-semibold text-slate-800 hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              <Terminal className="size-4 text-blue-600" />
              <span>Download AI Setup Prompt (.md)</span>
            </button>
          )}
          <button
            onClick={() => selectedWorkflow && triggerDownload(selectedWorkflow)}
            disabled={!selectedWorkflow}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-[13.5px] font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            <Download className="size-4" />
            <span>Download Selected</span>
          </button>
        </div>
      </section>

      {/* Interactive 6-Step Architecture Visualizer */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-[16px] font-bold text-slate-900">
              6-Step Master Architecture (00-loadsmart-6step-prospect-engine.json)
            </h2>
            <p className="text-[13px] text-slate-500">
              Select any node stage to inspect Loadsmart&apos;s stack integration and safety contract.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-emerald-700">
            <Lock className="size-3.5" /> REQUIRE_APPROVAL = true
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {sixSteps.map((s, idx) => {
            const selected = idx === activeStage;
            return (
              <button
                key={s.step}
                onClick={() => setActiveStage(idx)}
                className={`rounded-xl border p-3.5 text-left transition-colors ${
                  selected
                    ? "border-blue-600 bg-blue-50/70"
                    : "border-slate-200 bg-slate-50/60 hover:border-slate-300"
                }`}
              >
                <div className="font-mono text-[11px] font-semibold tabular-nums text-blue-700">
                  Step {s.step}
                </div>
                <div className="mt-1 text-[14px] font-bold text-slate-900">{s.label}</div>
                <div className="mt-0.5 text-[11.5px] text-slate-500 line-clamp-1">{s.tool}</div>
              </button>
            );
          })}
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[12px] font-mono font-semibold text-blue-700">
              Step {sixSteps[activeStage].step} · {sixSteps[activeStage].label} · {sixSteps[activeStage].tool}
            </div>
            <p className="text-[14px] text-slate-700">{sixSteps[activeStage].detail}</p>
          </div>
          <Link
            href="/skills"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap shrink-0"
          >
            <span>Inspect step skill</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>

      {/* Filter Bar & Blueprint Split View */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div
            role="tablist"
            aria-label="Filter automation blueprints"
            className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-slate-100/80 p-1"
          >
            {[
              { id: "all", label: `All Blueprints (${workflows.length})` },
              { id: "n8n", label: "n8n Workflows" },
              { id: "prompt", label: "AI Setup Prompt" },
              { id: "schemas", label: "Clay & Salesforce" },
            ].map((tab) => {
              const active = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(tab.id as BlueprintFilter)}
                  className={`rounded-lg px-3.5 py-2 text-[13px] font-semibold whitespace-nowrap transition-all tabular-nums ${
                    active ? "bg-white text-slate-950 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="text-[12.5px] text-slate-500 flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald-600" />
            <span>Secrets referenced strictly via <code className="font-mono">$env.*</code> variables</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Blueprint Selector */}
          <div className="lg:col-span-4 space-y-2.5">
            {loading ? (
              <div className="space-y-2.5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-24 rounded-xl border border-slate-200 bg-slate-50 animate-pulse" />
                ))}
              </div>
            ) : (
              filtered.map((wf) => {
                const isSelected = selectedWorkflow?.id === wf.id;
                return (
                  <button
                    key={wf.id}
                    onClick={() => setSelectedId(wf.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-colors ${
                      isSelected
                        ? "bg-blue-50/70 border-blue-500"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[11.5px] font-mono text-slate-500">
                      <span className="font-semibold text-blue-700">{wf.platform}</span>
                      <span className="truncate">{wf.filename}</span>
                    </div>
                    <div className="mt-1.5 font-semibold text-[13.5px] text-slate-900 leading-snug">
                      {wf.name}
                    </div>
                    <div className="mt-1 text-[12.5px] text-slate-600 line-clamp-2 leading-relaxed">
                      {wf.description}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Right Code & Prompt Inspector */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col">
            {selectedWorkflow ? (
              <>
                <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-[15px] text-slate-900">{selectedWorkflow.name}</div>
                    <div className="text-[12px] font-mono text-slate-500 mt-0.5">
                      {selectedWorkflow.platform} · {selectedWorkflow.filename}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCopy(selectedWorkflow.content)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 px-3 py-2 text-[12.5px] font-semibold border border-slate-200 transition-colors whitespace-nowrap"
                    >
                      {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                      <span>{copied ? "Copied" : "Copy"}</span>
                    </button>
                    <button
                      onClick={() => triggerDownload(selectedWorkflow)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 text-[12.5px] font-semibold transition-colors whitespace-nowrap"
                    >
                      <Download className="size-3.5" />
                      <span>Download File</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 sm:p-5 bg-slate-950 overflow-auto max-h-[620px] text-[12.5px] font-mono text-slate-100 leading-relaxed">
                  <pre className="whitespace-pre-wrap">{selectedWorkflow.content}</pre>
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-[13px] text-slate-500">
                Select a workflow or setup prompt on the left to inspect or download.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Deployment Rollout Guide */}
      <section className="grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-3">
        <div className="bg-white p-6 space-y-1.5">
          <p className="font-mono text-[12px] font-semibold text-blue-700">Step 01 · Import</p>
          <h3 className="text-[15px] font-bold text-slate-900">Import Master & Error Workflows</h3>
          <p className="text-[13.5px] leading-relaxed text-slate-600">
            Import <code className="font-mono text-[12px]">00-loadsmart-6step-prospect-engine.json</code> and attach <code className="font-mono text-[12px]">05-loadsmart-error-alert-handler.json</code> under Workflow Settings.
          </p>
        </div>
        <div className="bg-white p-6 space-y-1.5">
          <p className="font-mono text-[12px] font-semibold text-blue-700">Step 02 · Configure</p>
          <h3 className="text-[15px] font-bold text-slate-900">Run the AI Setup Prompt</h3>
          <p className="text-[13.5px] leading-relaxed text-slate-600">
            Paste <code className="font-mono text-[12px]">loadsmart-n8n-setup-prompt.md</code> into Claude Code or Claude Chat to map Salesforce OAuth, Clay webhooks, and pod exclusions.
          </p>
        </div>
        <div className="bg-white p-6 space-y-1.5">
          <p className="font-mono text-[12px] font-semibold text-blue-700">Step 03 · Dry Run</p>
          <h3 className="text-[15px] font-bold text-slate-900">Verify 2 Accounts Before Live</h3>
          <p className="text-[13.5px] leading-relaxed text-slate-600">
            Run manually with <code className="font-mono text-[12px]">dry_run = true</code> to verify Salesforce Collision quarantine and Slack draft previews before enabling Gong/Apollo dispatch.
          </p>
        </div>
      </section>
    </div>
  );
}