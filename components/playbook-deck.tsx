"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Download,
  Maximize2,
  Minimize2,
  Presentation,
  Table2,
} from "lucide-react";
import { LoadsmartLogo } from "./loadsmart-logo";
import {
  diagnosisStages,
  gongCadence,
  icpRows,
  kpiMatrix,
  operatingRules,
  outreachScripts,
  personaComparisonFields,
  personas,
  pipelineSteps,
  podDailyRhythm,
  qualityScorecard,
  roadmap306090,
  scoringWeights,
  signalTable,
  toolsTable,
} from "@/lib/playbook-data";

type ViewMode = "deck" | "tables";

type PlaybookSlide = {
  id: string;
  label: string;
  render: () => React.ReactNode;
};

type Props = {
  rawMarkdown: string;
};

export function PlaybookDeck({ rawMarkdown }: Props) {
  const [mode, setMode] = useState<ViewMode>("deck");
  const [slideIdx, setSlideIdx] = useState(0);
  const [full, setFull] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const deckRef = useRef<HTMLDivElement>(null);

  function copyText(id: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId((cur) => (cur === id ? null : cur)), 1800);
  }

  function downloadMarkdown() {
    const blob = new Blob([rawMarkdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "loadsmart-abm-sales-playbook.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  const slides: PlaybookSlide[] = [
    {
      id: "cover",
      label: "Operating Model",
      render: () => (
        <div className="flex h-full flex-col justify-between gap-6">
          <div className="flex items-center justify-between gap-4">
            <LoadsmartLogo className="h-7" />
            <span className="font-mono text-[12px] text-slate-500">
              Loadsmart ABM Playbook · Nov 2026
            </span>
          </div>

          <div className="space-y-4">
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-blue-600">
              01 · Pod Operating Manual
            </p>
            <h2 className="max-w-4xl text-[28px] sm:text-[46px] font-bold leading-[1.05] tracking-[-0.03em] text-slate-900 text-balance">
              One ordered daily pipeline across three products and 20 named accounts per pod.
            </h2>
            <p className="max-w-3xl text-[15px] sm:text-[17px] leading-relaxed text-slate-600">
              Built for Loadsmart&apos;s hybrid AE/SDR pods selling Opendock, ShipperGuide TMS, and Loadsmart AI—with strict human approval gates, written ICP scoring, and Calibrated Truth enforcement.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-200">
            {operatingRules.map((rule, idx) => (
              <div key={rule} className="pt-2">
                <p className="font-mono text-[11.5px] font-semibold text-blue-700 tabular-nums">
                  Rule 0{idx + 1}
                </p>
                <p className="mt-1 text-[13px] leading-snug text-slate-700">{rule}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "icp",
      label: "Account ICP",
      render: () => (
        <div className="flex h-full flex-col justify-between gap-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[12.5px] font-semibold text-blue-600">
                02 · Account ICP &amp; Scoring Formula (Draft v0)
              </p>
              <h2 className="mt-1 text-[24px] sm:text-[34px] font-bold tracking-[-0.03em] text-slate-900">
                Define ICP once in code so selection never drifts.
              </h2>
            </div>
            <p className="font-mono text-[12px] text-slate-600 tabular-nums">
              Priority = Fit × Timing (30/60/90d) × Coverage (2/3 personas)
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-[12.5px] sm:text-[13px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-2.5 px-4 w-36">Dimension</th>
                  <th className="py-2.5 px-4">Target Definition</th>
                  <th className="py-2.5 px-4">Validation Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {icpRows.map((row) => (
                  <tr key={row.field}>
                    <td className="py-2 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      {row.field}
                    </td>
                    <td className="py-2 px-4">{row.definition}</td>
                    <td className="py-2 px-4 text-slate-500">{row.validationSource}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      id: "personas",
      label: "User Personas",
      render: () => (
        <div className="flex h-full flex-col justify-between gap-4">
          <div>
            <p className="font-mono text-[12.5px] font-semibold text-blue-600">
              03 · Three-Product Buyer Persona Matrix
            </p>
            <h2 className="mt-1 text-[24px] sm:text-[34px] font-bold tracking-[-0.03em] text-slate-900">
              One account, three products, three isolated buyer personas.
            </h2>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-[12px] sm:text-[12.5px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <tr>
                  <th className="py-2.5 px-3.5 w-32">Attribute</th>
                  {personas.map((p) => (
                    <th key={p.personaId} className="py-2.5 px-3.5">
                      <span className="text-slate-950 font-bold">{p.product}</span>
                      <span className="block font-normal text-[11px] text-slate-500">
                        {p.scope}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {[
                  { label: "Target Titles", key: "titles" as const },
                  { label: "Decision Role", key: "decisionRole" as const },
                  { label: "Goals / KPIs", key: "goals" as const },
                  { label: "Assumed Pain", key: "painAssumed" as const },
                  { label: "Buying Triggers", key: "triggers" as const },
                  { label: "Channels", key: "channels" as const },
                ].map((f) => (
                  <tr key={f.key}>
                    <td className="py-2 px-3.5 font-semibold text-slate-900 whitespace-nowrap align-top">
                      {f.label}
                    </td>
                    {personas.map((p) => (
                      <td key={p.personaId} className="py-2 px-3.5 align-top leading-snug">
                        {p[f.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      id: "pipeline",
      label: "Daily Pipeline",
      render: () => (
        <div className="flex h-full flex-col justify-between gap-4">
          <div>
            <p className="font-mono text-[12.5px] font-semibold text-blue-600">
              04 · Ordered Daily ABM Pipeline (Steps 0–7)
            </p>
            <h2 className="mt-1 text-[24px] sm:text-[34px] font-bold tracking-[-0.03em] text-slate-900">
              Every skill reads the last Salesforce field and pauses before send.
            </h2>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-[12px] sm:text-[12.5px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Skill</th>
                  <th className="py-2.5 px-3">Schedule</th>
                  <th className="py-2.5 px-3">Writes</th>
                  <th className="py-2.5 px-3">Approval Gate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {pipelineSteps.map((row) => (
                  <tr key={row.skill}>
                    <td className="py-2 px-3 font-mono tabular-nums text-slate-500">{row.step}</td>
                    <td className="py-2 px-3 font-mono font-semibold text-slate-900 whitespace-nowrap">
                      {row.skill}
                    </td>
                    <td className="py-2 px-3 font-mono tabular-nums whitespace-nowrap text-slate-600">
                      {row.runs}
                    </td>
                    <td className="py-2 px-3">{row.writes}</td>
                    <td className="py-2 px-3 font-medium text-blue-700 whitespace-nowrap">
                      {row.gate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      id: "cadence",
      label: "12-Day Cadence",
      render: () => (
        <div className="flex h-full flex-col justify-between gap-4">
          <div>
            <p className="font-mono text-[12.5px] font-semibold text-blue-600">
              05 · Unified 12-Day Gong Sequence (Email + Dialer + LinkedIn)
            </p>
            <h2 className="mt-1 text-[24px] sm:text-[34px] font-bold tracking-[-0.03em] text-slate-900">
              One synchronized queue across channels — stops on reply or meeting.
            </h2>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-[12px] sm:text-[12.5px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-2.5 px-3.5 w-20">Day</th>
                  <th className="py-2.5 px-3.5 w-32">Channel</th>
                  <th className="py-2.5 px-3.5">Execution Step</th>
                  <th className="py-2.5 px-3.5 w-44">Owner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {gongCadence.map((row, idx) => (
                  <tr key={`${row.day}-${idx}`}>
                    <td className="py-2 px-3.5 font-mono tabular-nums font-semibold text-slate-900 whitespace-nowrap">
                      {row.day}
                    </td>
                    <td className="py-2 px-3.5 font-medium text-blue-700 whitespace-nowrap">
                      {row.channel}
                    </td>
                    <td className="py-2 px-3.5">{row.step}</td>
                    <td className="py-2 px-3.5 text-slate-500 whitespace-nowrap">{row.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      id: "signals",
      label: "Signal Matrix",
      render: () => (
        <div className="flex h-full flex-col justify-between gap-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[12.5px] font-semibold text-blue-600">
                06 · Signal-to-Product Matrix &amp; 4–6 Week Holdout Test
              </p>
              <h2 className="mt-1 text-[24px] sm:text-[34px] font-bold tracking-[-0.03em] text-slate-900">
                No URL, no signal. Rank accounts by dated why-now events.
              </h2>
            </div>
            <p className="text-[12.5px] text-slate-600">
              Holdout rule: 50% signal-ranked vs. 50% fit-only control, judged on meetings held.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-[12px] sm:text-[12.5px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-2.5 px-3.5">Dated Trigger Signal</th>
                  <th className="py-2.5 px-3.5">Source</th>
                  <th className="py-2.5 px-3.5">Product Opened</th>
                  <th className="py-2.5 px-3.5">Why Now</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {signalTable.slice(0, 7).map((row) => (
                  <tr key={row.signal}>
                    <td className="py-2 px-3.5 font-medium text-slate-900">{row.signal}</td>
                    <td className="py-2 px-3.5 text-slate-500">{row.source}</td>
                    <td className="py-2 px-3.5 font-semibold text-blue-700 whitespace-nowrap">
                      {row.opens}
                    </td>
                    <td className="py-2 px-3.5">{row.whyNow}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      id: "diagnosis",
      label: "Leak Diagnosis",
      render: () => (
        <div className="flex h-full flex-col justify-between gap-4">
          <div>
            <p className="font-mono text-[12.5px] font-semibold text-blue-600">
              07 · Top-Down 8-Stage Leak Diagnosis
            </p>
            <h2 className="mt-1 text-[24px] sm:text-[34px] font-bold tracking-[-0.03em] text-slate-900">
              Fix upstream assignment before rewriting downstream email copy.
            </h2>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-[11.5px] sm:text-[12px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-2.5 px-3 w-36">Stage</th>
                  <th className="py-2.5 px-3">Red Flag</th>
                  <th className="py-2.5 px-3">Likely Root Cause vs. Symptom</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {diagnosisStages.map((row) => (
                  <tr key={row.stage}>
                    <td className="py-2 px-3 font-semibold text-slate-900 whitespace-nowrap">
                      {row.stage}
                    </td>
                    <td className="py-2 px-3 text-amber-800">{row.redFlag}</td>
                    <td className="py-2 px-3">{row.rootCause}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      id: "kpis",
      label: "KPIs & Quality",
      render: () => (
        <div className="flex h-full flex-col justify-between gap-4">
          <div>
            <p className="font-mono text-[12.5px] font-semibold text-blue-600">
              08 · Stakeholder KPIs &amp; Weekly Pod Scorecard
            </p>
            <h2 className="mt-1 text-[24px] sm:text-[34px] font-bold tracking-[-0.03em] text-slate-900">
              Measured by pipeline per account worked — zero vanity opens.
            </h2>
          </div>

          <div className="grid lg:grid-cols-12 gap-4 items-start">
            <div className="lg:col-span-8 overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-left text-[12px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Team</th>
                    <th className="py-2.5 px-3">Primary KPI</th>
                    <th className="py-2.5 px-3">Leading Indicators</th>
                    <th className="py-2.5 px-3">Cadence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {kpiMatrix.map((row) => (
                    <tr key={row.team}>
                      <td className="py-2 px-3 font-semibold text-slate-900 whitespace-nowrap">
                        {row.team}
                      </td>
                      <td className="py-2 px-3 font-medium text-blue-700">{row.kpi}</td>
                      <td className="py-2 px-3">{row.leading}</td>
                      <td className="py-2 px-3 font-mono tabular-nums whitespace-nowrap text-slate-500">
                        {row.cadence}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lg:col-span-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-left text-[12px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Quality Metric</th>
                    <th className="py-2.5 px-3 text-right">Target</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {qualityScorecard.map((q) => (
                    <tr key={q.metric}>
                      <td className="py-2 px-3 font-medium text-slate-900">{q.metric}</td>
                      <td className="py-2 px-3 text-right font-mono tabular-nums font-semibold text-emerald-700 whitespace-nowrap">
                        {q.target.replace(" (starting assumption)", "")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "stack",
      label: "Stack & Capacity",
      render: () => (
        <div className="flex h-full flex-col justify-between gap-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[12.5px] font-semibold text-blue-600">
                09 · Stack Architecture &amp; Sending Scale Layer
              </p>
              <h2 className="mt-1 text-[24px] sm:text-[34px] font-bold tracking-[-0.03em] text-slate-900">
                Deterministic steps in n8n; judgment in Claude; 5 warmed inboxes per rep.
              </h2>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-[12px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-2.5 px-3.5 w-44">System</th>
                  <th className="py-2.5 px-3.5 w-28">Decision</th>
                  <th className="py-2.5 px-3.5">Role in Target Motion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {toolsTable.slice(0, 8).map((row) => (
                  <tr key={row.tool}>
                    <td className="py-2 px-3.5 font-semibold text-slate-900 whitespace-nowrap">
                      {row.tool}
                    </td>
                    <td className="py-2 px-3.5 font-mono text-[11.5px] font-semibold text-blue-700 whitespace-nowrap">
                      {row.action}
                    </td>
                    <td className="py-2 px-3.5">{row.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      id: "roadmap",
      label: "30 / 60 / 90 Days",
      render: () => (
        <div className="flex h-full flex-col justify-between gap-4">
          <div>
            <p className="font-mono text-[12.5px] font-semibold text-blue-600">
              10 · 90-Day Rollout &amp; Claims Governance
            </p>
            <h2 className="mt-1 text-[24px] sm:text-[34px] font-bold tracking-[-0.03em] text-slate-900">
              Baseline first 30 days, standardize in n8n by Day 60, scale winners by Day 90.
            </h2>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-[12.5px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-2.5 px-4 w-52">Window</th>
                  <th className="py-2.5 px-4">Operational Focus</th>
                  <th className="py-2.5 px-4">Exit Criteria</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {roadmap306090.map((row) => (
                  <tr key={row.window}>
                    <td className="py-3 px-4 font-semibold text-slate-900 align-top">
                      {row.window}
                    </td>
                    <td className="py-3 px-4 align-top">{row.focus}</td>
                    <td className="py-3 px-4 font-medium text-blue-700 align-top">
                      {row.doneWhen}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 text-[13px] text-slate-600">
            <span>
              Claims guardrail: all numbers require an audited{" "}
              <code className="font-mono text-slate-900">C-XXX</code> row in{" "}
              <code className="font-mono text-slate-900">claims-library.md</code>.
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/automations"
                className="font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 whitespace-nowrap"
              >
                <span>Open n8n Workflow</span>
                <ArrowRight className="size-3.5" />
              </Link>
              <Link
                href="/demo"
                className="font-semibold text-slate-900 hover:text-blue-600 inline-flex items-center gap-1 whitespace-nowrap"
              >
                <span>Test Pod Copilot</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const last = slides.length - 1;
  const next = useCallback(() => setSlideIdx((v) => Math.min(last, v + 1)), [last]);
  const prev = useCallback(() => setSlideIdx((v) => Math.max(0, v - 1)), []);

  useEffect(() => {
    if (mode !== "deck") return;
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") next();
      if (e.key === "ArrowLeft" || e.key === "PageUp") prev();
    }
    function onFs() {
      setFull(document.fullscreenElement === deckRef.current);
    }
    window.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFs);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFs);
    };
  }, [mode, next, prev]);

  function toggleFull() {
    if (document.fullscreenElement) document.exitFullscreen();
    else deckRef.current?.requestFullscreen();
  }

  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8 py-10 sm:py-12 space-y-8">
      {/* Page Header */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-blue-600">
            Loadsmart ABM Sales Playbook
          </p>
          <h1 className="mt-2 max-w-3xl text-[32px] sm:text-[46px] font-bold leading-[1.06] tracking-[-0.03em] text-slate-900 text-balance">
            ICPs, user personas, signals, cadences, and KPIs — built for pods to execute.
          </h1>
          <p className="mt-3 max-w-2xl text-[15.5px] leading-relaxed text-slate-600">
            Switch between an interactive executive presentation deck and full reference tables covering Opendock, ShipperGuide TMS, and Loadsmart AI.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div
            role="tablist"
            aria-label="Playbook view mode"
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100/80 p-1"
          >
            <button
              role="tab"
              aria-selected={mode === "deck"}
              onClick={() => setMode("deck")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-semibold whitespace-nowrap transition-all ${
                mode === "deck" ? "bg-white text-slate-950 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Presentation className="size-4 text-blue-600" />
              <span>Deck View</span>
            </button>
            <button
              role="tab"
              aria-selected={mode === "tables"}
              onClick={() => setMode("tables")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-semibold whitespace-nowrap transition-all ${
                mode === "tables" ? "bg-white text-slate-950 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Table2 className="size-4 text-blue-600" />
              <span>All Tables &amp; Scripts</span>
            </button>
          </div>

          <button
            onClick={downloadMarkdown}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            <Download className="size-4" />
            <span>Download Playbook (.md)</span>
          </button>
        </div>
      </section>

      {/* MODE 1: INTERACTIVE EXECUTIVE DECK */}
      {mode === "deck" && (
        <section className="space-y-5">
          {/* Quick Chapter Jump Strip */}
          <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Playbook slides">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={idx === slideIdx}
                onClick={() => setSlideIdx(idx)}
                className={`rounded-lg px-3 py-1.5 text-[12.5px] font-semibold whitespace-nowrap transition-colors tabular-nums ${
                  idx === slideIdx
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {String(idx + 1).padStart(2, "0")} · {s.label}
              </button>
            ))}
          </div>

          {/* 16:9 Slide Frame */}
          <div
            ref={deckRef}
            className={full ? "flex h-screen flex-col bg-white p-6 sm:p-10" : ""}
          >
            <div
              className={`relative rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-white to-blue-50/40 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.2)] ${
                full ? "flex-1" : "min-h-[560px] lg:aspect-[16/9] lg:min-h-0"
              } p-6 sm:p-10 overflow-auto`}
            >
              {slides[slideIdx].render()}
              <span className="absolute bottom-4 right-6 font-mono text-[12px] tabular-nums text-slate-400">
                {slideIdx + 1} / {slides.length}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-[13px] text-slate-500">
                <span>Use Left/Right arrow keys or Present for fullscreen.</span>
                <button
                  onClick={() => setMode("tables")}
                  className="font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap"
                >
                  View all tables on one page
                </button>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={toggleFull}
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap"
                >
                  {full ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
                  <span>{full ? "Exit" : "Present"}</span>
                </button>
                <button
                  onClick={prev}
                  disabled={slideIdx === 0}
                  aria-label="Previous playbook slide"
                  className="grid size-10 place-items-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-30"
                >
                  <ArrowLeft className="size-4" />
                </button>
                <button
                  onClick={next}
                  disabled={slideIdx === last}
                  aria-label="Next playbook slide"
                  className="grid size-10 place-items-center rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-30"
                >
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* MODE 2: STRUCTURED TABLES & SCRIPTS */}
      {mode === "tables" && (
        <div className="space-y-12">
          {/* Quick Section Anchors */}
          <nav
            aria-label="Playbook sections"
            className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4 text-[13px] font-medium"
          >
            {[
              ["#icp", "Account ICP"],
              ["#personas", "Buyer Personas"],
              ["#pipeline", "7-Step Pipeline"],
              ["#cadence", "12-Day Cadence & Scripts"],
              ["#signals", "Signals & Holdout"],
              ["#diagnosis", "Leak Diagnosis"],
              ["#kpis", "KPIs & Scorecard"],
              ["#roadmap", "Tools & 30/60/90"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-blue-400 hover:text-blue-700 transition-colors whitespace-nowrap"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Section 1: Account ICP & Scoring */}
          <section id="icp" className="scroll-mt-20 space-y-5">
            <div>
              <p className="font-mono text-[12px] font-semibold text-blue-600">01 · Account ICP &amp; Scoring Model</p>
              <h2 className="mt-1 text-[24px] font-bold tracking-[-0.02em] text-slate-900">
                Target Shipper Definition &amp; Scoring Weights
              </h2>
            </div>

            <div className="grid lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                <table className="w-full text-left text-[13.5px]">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="py-3 px-4 w-36">Field</th>
                      <th className="py-3 px-4">Definition (Draft v0)</th>
                      <th className="py-3 px-4">Validation Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {icpRows.map((row) => (
                      <tr key={row.field} className="hover:bg-slate-50/70">
                        <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">{row.field}</td>
                        <td className="py-3 px-4">{row.definition}</td>
                        <td className="py-3 px-4 text-slate-500">{row.validationSource}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="lg:col-span-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                <table className="w-full text-left text-[13px]">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="py-3 px-4">Scoring Input</th>
                      <th className="py-3 px-4 text-right">Weight / Rule</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {scoringWeights.map((s) => (
                      <tr key={s.factor}>
                        <td className="py-2.5 px-4">
                          <span className="block font-semibold text-slate-900">{s.factor}</span>
                          <span className="text-[11.5px] text-slate-500">{s.dimension}</span>
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono tabular-nums font-semibold text-blue-700 whitespace-nowrap">
                          {s.weight}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 2: Three-Product Buyer Persona Matrix */}
          <section id="personas" className="scroll-mt-20 space-y-5">
            <div>
              <p className="font-mono text-[12px] font-semibold text-blue-600">02 · User Personas Per Product</p>
              <h2 className="mt-1 text-[24px] font-bold tracking-[-0.02em] text-slate-900">
                Opendock vs. ShipperGuide TMS vs. Loadsmart AI Persona Matrix
              </h2>
              <p className="mt-1 text-[14px] text-slate-600">
                Multi-threading rule: an account counts as &quot;covered&quot; only when at least 2 of 3 product personas have verified contacts.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                  <tr>
                    <th className="py-3.5 px-4 w-44">Attribute</th>
                    {personas.map((p) => (
                      <th key={p.personaId} className="py-3.5 px-4 min-w-[240px]">
                        <span className="text-[14.5px] font-bold text-slate-950">{p.product}</span>
                        <span className="block font-normal text-[12px] text-slate-500">{p.scope}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {personaComparisonFields.map((field) => (
                    <tr key={field.key} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap align-top">
                        {field.label}
                      </td>
                      {personas.map((p) => (
                        <td key={p.personaId} className="py-3 px-4 align-top leading-relaxed">
                          {p[field.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3: Daily Pipeline & Pod Rhythm */}
          <section id="pipeline" className="scroll-mt-20 space-y-5">
            <div>
              <p className="font-mono text-[12px] font-semibold text-blue-600">03 · Target Operating Pipeline</p>
              <h2 className="mt-1 text-[24px] font-bold tracking-[-0.02em] text-slate-900">
                7-Step Daily Skill Sequence &amp; Pod Schedule
              </h2>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="py-3 px-4 w-12">#</th>
                    <th className="py-3 px-4">Skill</th>
                    <th className="py-3 px-4">Schedule</th>
                    <th className="py-3 px-4">Reads</th>
                    <th className="py-3 px-4">Writes</th>
                    <th className="py-3 px-4">Human Gate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {pipelineSteps.map((row) => (
                    <tr key={row.skill} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-mono tabular-nums text-slate-500">{row.step}</td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900 whitespace-nowrap">
                        <Link href={`/skills/${row.skill}`} className="text-blue-700 hover:underline">
                          {row.skill}
                        </Link>
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums whitespace-nowrap text-slate-600">{row.runs}</td>
                      <td className="py-3 px-4">{row.reads}</td>
                      <td className="py-3 px-4">{row.writes}</td>
                      <td className="py-3 px-4 font-medium text-slate-900 whitespace-nowrap">{row.gate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="py-3 px-4 w-40">Daily Block</th>
                    <th className="py-3 px-4 w-28">Owner</th>
                    <th className="py-3 px-4">AE / SDR Pod Execution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {podDailyRhythm.map((r) => (
                    <tr key={r.time}>
                      <td className="py-2.5 px-4 font-mono tabular-nums font-semibold text-slate-900 whitespace-nowrap">
                        {r.time}
                      </td>
                      <td className="py-2.5 px-4 font-medium text-blue-700 whitespace-nowrap">{r.owner}</td>
                      <td className="py-2.5 px-4">{r.activity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4: Messaging, 12-Day Cadence & Scripts */}
          <section id="cadence" className="scroll-mt-20 space-y-5">
            <div>
              <p className="font-mono text-[12px] font-semibold text-blue-600">04 · Messaging, Cadence &amp; Scripts</p>
              <h2 className="mt-1 text-[24px] font-bold tracking-[-0.02em] text-slate-900">
                12-Day Multi-Channel Gong Flow &amp; Copy Templates
              </h2>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="py-3 px-4 w-24">Day</th>
                    <th className="py-3 px-4 w-36">Channel</th>
                    <th className="py-3 px-4">Step</th>
                    <th className="py-3 px-4 w-48">Owner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {gongCadence.map((row, idx) => (
                    <tr key={`${row.day}-${idx}`}>
                      <td className="py-2.5 px-4 font-mono tabular-nums font-semibold text-slate-900 whitespace-nowrap">{row.day}</td>
                      <td className="py-2.5 px-4 font-medium text-blue-700 whitespace-nowrap">{row.channel}</td>
                      <td className="py-2.5 px-4">{row.step}</td>
                      <td className="py-2.5 px-4 text-slate-500 whitespace-nowrap">{row.owner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-[15px] font-bold text-slate-900">
                    Sample Opendock Trigger Email (Placeholder-Safe)
                  </h3>
                  <button
                    onClick={() => copyText("sample-email", outreachScripts.sampleOpendockBody)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    {copiedId === "sample-email" ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                    <span>{copiedId === "sample-email" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <pre className="rounded-xl bg-slate-950 p-4 text-[12.5px] font-mono text-slate-100 whitespace-pre-wrap leading-relaxed">
                  {outreachScripts.sampleOpendockBody}
                </pre>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-[15px] font-bold text-slate-900">
                    30-Second Cold Call Opener + Qualification Exit Criteria
                  </h3>
                  <button
                    onClick={() => copyText("call-opener", outreachScripts.callOpener)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    {copiedId === "call-opener" ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                    <span>{copiedId === "call-opener" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <p className="rounded-xl bg-slate-50 p-3.5 text-[13px] leading-relaxed text-slate-800 border border-slate-200">
                  {outreachScripts.callOpener}
                </p>
                <div className="space-y-1 text-[12.5px] text-slate-600">
                  <p className="font-semibold text-slate-900">Stage 1 to Stage 2 Exit Criteria:</p>
                  <p>{outreachScripts.stage2ExitCriteria.join(" · ")}</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {outreachScripts.linkedinNotes.map((item) => (
                <div key={item.product} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[12px] font-mono text-slate-500">
                      <span className="font-semibold text-blue-700">{item.product}</span>
                      <span className="tabular-nums">{item.length}</span>
                    </div>
                    <p className="mt-2 text-[13px] leading-relaxed text-slate-700">{item.note}</p>
                  </div>
                  <button
                    onClick={() => copyText(item.product, item.note)}
                    className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    {copiedId === item.product ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                    <span>{copiedId === item.product ? "Copied Note" : "Copy LinkedIn Note"}</span>
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5: Signals & Holdout */}
          <section id="signals" className="scroll-mt-20 space-y-5">
            <div>
              <p className="font-mono text-[12px] font-semibold text-blue-600">05 · Daily Signal Intelligence</p>
              <h2 className="mt-1 text-[24px] font-bold tracking-[-0.02em] text-slate-900">
                Nine Freight Triggers Mapped by Product &amp; Why-Now
              </h2>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Signal Event</th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4">Opens</th>
                    <th className="py-3 px-4">Why Now</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {signalTable.map((row) => (
                    <tr key={row.signal} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-4 font-semibold text-slate-900">{row.signal}</td>
                      <td className="py-2.5 px-4 text-slate-500">{row.source}</td>
                      <td className="py-2.5 px-4 font-semibold text-blue-700 whitespace-nowrap">{row.opens}</td>
                      <td className="py-2.5 px-4">{row.whyNow}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 6: Leak Diagnosis */}
          <section id="diagnosis" className="scroll-mt-20 space-y-5">
            <div>
              <p className="font-mono text-[12px] font-semibold text-blue-600">06 · Program Diagnostics</p>
              <h2 className="mt-1 text-[24px] font-bold tracking-[-0.02em] text-slate-900">
                Top-Down Leak Framework (Root Cause vs. Symptom)
              </h2>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="py-3 px-4 w-44">Stage</th>
                    <th className="py-3 px-4">What to Check</th>
                    <th className="py-3 px-4">Red Flag</th>
                    <th className="py-3 px-4">Likely Root Cause vs. Symptom</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {diagnosisStages.map((row) => (
                    <tr key={row.stage} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-4 font-semibold text-slate-900 whitespace-nowrap">{row.stage}</td>
                      <td className="py-2.5 px-4">{row.check}</td>
                      <td className="py-2.5 px-4 text-amber-800">{row.redFlag}</td>
                      <td className="py-2.5 px-4">{row.rootCause}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 7: KPIs & Quality Scorecard */}
          <section id="kpis" className="scroll-mt-20 space-y-5">
            <div>
              <p className="font-mono text-[12px] font-semibold text-blue-600">07 · Measurement &amp; Data Quality</p>
              <h2 className="mt-1 text-[24px] font-bold tracking-[-0.02em] text-slate-900">
                Multi-Stakeholder KPI Matrix &amp; Weekly List Scorecard
              </h2>
            </div>

            <div className="grid lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                <table className="w-full text-left text-[13px]">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="py-3 px-4">Team</th>
                      <th className="py-3 px-4">Outcome KPI</th>
                      <th className="py-3 px-4">Leading Indicators</th>
                      <th className="py-3 px-4">Source</th>
                      <th className="py-3 px-4">Cadence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {kpiMatrix.map((row) => (
                      <tr key={row.team}>
                        <td className="py-2.5 px-4 font-semibold text-slate-900 whitespace-nowrap">{row.team}</td>
                        <td className="py-2.5 px-4 font-medium text-blue-700">{row.kpi}</td>
                        <td className="py-2.5 px-4">{row.leading}</td>
                        <td className="py-2.5 px-4 text-slate-500">{row.source}</td>
                        <td className="py-2.5 px-4 font-mono tabular-nums whitespace-nowrap text-slate-500">{row.cadence}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="lg:col-span-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                <table className="w-full text-left text-[13px]">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="py-3 px-4">Scorecard Metric</th>
                      <th className="py-3 px-4 text-right">Target</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {qualityScorecard.map((q) => (
                      <tr key={q.metric}>
                        <td className="py-2.5 px-4">
                          <span className="block font-semibold text-slate-900">{q.metric}</span>
                          <span className="text-[11.5px] text-slate-500">{q.definition}</span>
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono tabular-nums font-semibold text-emerald-700 whitespace-nowrap">
                          {q.target}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 8: Stack & 30/60/90 Rollout */}
          <section id="roadmap" className="scroll-mt-20 space-y-5">
            <div>
              <p className="font-mono text-[12px] font-semibold text-blue-600">08 · Stack Changes &amp; First 90 Days</p>
              <h2 className="mt-1 text-[24px] font-bold tracking-[-0.02em] text-slate-900">
                Tooling Audit &amp; 30 / 60 / 90 Execution Plan
              </h2>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="py-3 px-4 w-48">Tool</th>
                    <th className="py-3 px-4 w-32">Action</th>
                    <th className="py-3 px-4">Role in Target Motion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {toolsTable.map((row) => (
                    <tr key={row.tool}>
                      <td className="py-2.5 px-4 font-semibold text-slate-900 whitespace-nowrap">{row.tool}</td>
                      <td className="py-2.5 px-4 font-mono text-[12px] font-semibold text-blue-700 whitespace-nowrap">{row.action}</td>
                      <td className="py-2.5 px-4">{row.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-left text-[13.5px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="py-3 px-4 w-56">Window</th>
                    <th className="py-3 px-4">Focus</th>
                    <th className="py-3 px-4">Done When</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {roadmap306090.map((row) => (
                    <tr key={row.window}>
                      <td className="py-3 px-4 font-semibold text-slate-900 align-top">{row.window}</td>
                      <td className="py-3 px-4 align-top">{row.focus}</td>
                      <td className="py-3 px-4 font-medium text-blue-700 align-top">{row.doneWhen}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
