"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Maximize2, Minimize2 } from "lucide-react";
import { answers, author, type Answer } from "@/lib/answers";
import { gongCadence, icpRows, personas } from "@/lib/playbook-data";
import { LoadsmartLogo } from "./loadsmart-logo";

type Slide = { key: string; render: () => React.ReactNode };

function QuestionSlide({ a }: { a: Answer }) {
  const cols = a.blocks.length >= 3 ? "lg:grid-cols-3" : "lg:grid-cols-2";
  return (
    <div className="flex h-full flex-col">
      <p className="font-mono text-[13px] text-blue-600">
        0{a.n} · {a.title}
      </p>
      <h2 className="mt-3 max-w-4xl text-[26px] sm:text-[38px] font-bold leading-[1.08] tracking-[-0.03em] text-slate-900">
        {a.headline}
      </h2>
      <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-slate-500">{a.question}</p>

      <div className={`mt-6 grid gap-3 ${cols} flex-1 content-start`}>
        {a.blocks.map((b) => (
          <div key={b.label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">{b.label}</p>
            <ul className="mt-3 space-y-2">
              {b.points.map((p) => (
                <li key={p} className="flex gap-2.5 text-[14px] sm:text-[15px] leading-snug text-slate-800">
                  <span aria-hidden className="mt-[8px] size-1.5 shrink-0 rounded-full bg-blue-600" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {a.chain && (
        <div className="mt-3 grid grid-cols-3 gap-3">
          {[
            ["Red flag", a.chain.redFlag, "text-amber-700"],
            ["Symptom", a.chain.symptom, "text-slate-600"],
            ["Root cause", a.chain.rootCause, "text-blue-700"],
          ].map(([k, v, c]) => (
            <div key={k} className="rounded-xl bg-slate-50 p-4">
              <p className={`text-[11px] font-semibold uppercase tracking-[0.1em] ${c}`}>{k}</p>
              <p className="mt-1 text-[14px] sm:text-[15px] font-medium text-slate-900">{v}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const slides: Slide[] = [
  {
    key: "title",
    render: () => (
      <div className="flex h-full flex-col justify-between">
        <LoadsmartLogo className="h-8" />
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-blue-600">
            GTM Engineer · Case Answers &amp; ABM Playbook
          </p>
          <h1 className="mt-4 max-w-4xl text-[36px] sm:text-[60px] font-bold leading-[1.03] tracking-[-0.035em] text-slate-900">
            Where the program leaks, and how I&apos;d fix it.
          </h1>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-[14px] text-slate-500">
          <span className="font-medium text-slate-900">{author.name}</span>
          <span>{author.role}</span>
          <span>{author.date}</span>
        </div>
      </div>
    ),
  },
  {
    key: "agenda",
    render: () => (
      <div className="flex h-full flex-col">
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-blue-600">Seven questions, seven answers</p>
        <div className="mt-6 grid flex-1 content-center gap-x-10 gap-y-4 sm:grid-cols-2">
          {answers.map((a) => (
            <div key={a.n} className="flex gap-4 border-t border-slate-200 pt-4">
              <span className="font-mono text-[13px] text-slate-400 pt-1">0{a.n}</span>
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-slate-500">{a.title}</p>
                <p className="mt-1 text-[16px] sm:text-[18px] font-medium leading-snug text-slate-900">{a.headline}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  ...answers.map((a) => ({ key: `q${a.n}`, render: () => <QuestionSlide a={a} /> })),
  {
    key: "playbook-icp",
    render: () => (
      <div className="flex h-full flex-col justify-between gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[13px] text-blue-600">ABM Playbook · Account ICP</p>
            <h2 className="mt-2 max-w-4xl text-[26px] sm:text-[36px] font-bold leading-[1.08] tracking-[-0.03em] text-slate-900">
              Written Account ICP &amp; Priority Formula (Fit × Timing × Coverage)
            </h2>
          </div>
          <Link href="/playbook" className="text-[13px] font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 whitespace-nowrap">
            Open Full Playbook <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-[12px] sm:text-[13px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-2.5 px-4 w-36">Field</th>
                <th className="py-2.5 px-4">Definition (Draft v0)</th>
                <th className="py-2.5 px-4">Validation Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {icpRows.map((row) => (
                <tr key={row.field}>
                  <td className="py-2 px-4 font-semibold text-slate-900 whitespace-nowrap">{row.field}</td>
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
    key: "playbook-personas",
    render: () => (
      <div className="flex h-full flex-col justify-between gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[13px] text-blue-600">ABM Playbook · User Personas</p>
            <h2 className="mt-2 max-w-4xl text-[26px] sm:text-[36px] font-bold leading-[1.08] tracking-[-0.03em] text-slate-900">
              One account, three products — never blend audiences.
            </h2>
          </div>
          <Link href="/playbook" className="text-[13px] font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 whitespace-nowrap">
            Full Persona Tables <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="py-2.5 px-3.5 w-32">Dimension</th>
                {personas.map((p) => (
                  <th key={p.personaId} className="py-2.5 px-3.5">
                    <span className="font-bold text-slate-950">{p.product}</span>
                    <span className="block font-normal text-[11px] text-slate-500">{p.scope}</span>
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
                { label: "Triggers", key: "triggers" as const },
                { label: "Channels", key: "channels" as const },
              ].map((row) => (
                <tr key={row.key}>
                  <td className="py-2 px-3.5 font-semibold text-slate-900 whitespace-nowrap align-top">{row.label}</td>
                  {personas.map((p) => (
                    <td key={p.personaId} className="py-2 px-3.5 align-top leading-snug">{p[row.key]}</td>
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
    key: "playbook-cadence",
    render: () => (
      <div className="flex h-full flex-col justify-between gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[13px] text-blue-600">ABM Playbook · Unified Execution</p>
            <h2 className="mt-2 max-w-4xl text-[26px] sm:text-[36px] font-bold leading-[1.08] tracking-[-0.03em] text-slate-900">
              12-Day Multi-Channel Gong Flow (Email + Dialer + LinkedIn)
            </h2>
          </div>
          <Link href="/playbook" className="text-[13px] font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 whitespace-nowrap">
            Playbook Deck &amp; Scripts <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-2.5 px-3.5 w-20">Day</th>
                <th className="py-2.5 px-3.5 w-32">Channel</th>
                <th className="py-2.5 px-3.5">Touchpoint Action</th>
                <th className="py-2.5 px-3.5 w-44">Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {gongCadence.map((row, idx) => (
                <tr key={`${row.day}-${idx}`}>
                  <td className="py-1.5 px-3.5 font-mono tabular-nums font-semibold text-slate-900 whitespace-nowrap">{row.day}</td>
                  <td className="py-1.5 px-3.5 font-medium text-blue-700 whitespace-nowrap">{row.channel}</td>
                  <td className="py-1.5 px-3.5">{row.step}</td>
                  <td className="py-1.5 px-3.5 text-slate-500 whitespace-nowrap">{row.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
  {
    key: "engine",
    render: () => (
      <div className="flex h-full flex-col justify-between">
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-blue-600">Built &amp; Ready Today</p>
          <h2 className="mt-3 max-w-4xl text-[28px] sm:text-[42px] font-bold leading-[1.06] tracking-[-0.03em] text-slate-900">
            The 6-step n8n engine &amp; 42 skills already packaged for Loadsmart&apos;s stack.
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-2.5 my-6">
          {[
            ["01 · Signals", "Perplexity & EDGAR", "Dated trigger + source URL"],
            ["02 · Companies", "Salesforce Shield", "Quarantine active opps"],
            ["03 · Contacts", "ZoomInfo + Clay", "Waterfall verified emails"],
            ["04 · Research", "6-Part Brief", "Zero-hallucination ledger"],
            ["05 · Email", "Claude + Claims", "<=90w PAS + truth linter"],
            ["06 · Outreach", "Slack -> Gong", "REQUIRE_APPROVAL=true"],
          ].map(([step, tool, note]) => (
            <div key={step} className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="font-mono text-[11.5px] font-semibold text-blue-700">{step}</p>
              <p className="mt-1.5 text-[14px] font-bold text-slate-900">{tool}</p>
              <p className="mt-1 text-[12px] text-slate-600 leading-snug">{note}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-4 text-[13.5px] text-slate-600">
          <span>Ships with <code className="font-mono text-slate-900">dry_run = true</code>, error alert handler, and a ready-to-paste AI Setup Prompt.</span>
          <Link href="/automations" className="font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 whitespace-nowrap">
            Inspect n8n Workflow <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    ),
  },
  {
    key: "academy",
    render: () => (
      <div className="flex h-full flex-col justify-between">
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-blue-600">Day-1 Team Adoption</p>
          <h2 className="mt-3 max-w-4xl text-[28px] sm:text-[42px] font-bold leading-[1.06] tracking-[-0.03em] text-slate-900">
            Loadsmart-branded Claude Code &amp; GTM Academy so reps actually use it on Monday.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4 my-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2">
            <p className="font-mono text-[12px] font-semibold text-blue-700">Track 01 · 8 Lessons</p>
            <h3 className="text-[18px] font-bold text-slate-900">Agent Harness Mastery (Claude Code)</h3>
            <p className="text-[13.5px] leading-relaxed text-slate-600">
              Turns RevOps and Pod Leads into builders: &lt;200-line Loadsmart <code className="font-mono">CLAUDE.md</code>, 5-part production prompts, portable <code className="font-mono">SKILL.md</code> folders, `.mcp.json` connectors, slash commands, subagents, and deterministic <code className="font-mono">PreToolUse</code> hooks.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2">
            <p className="font-mono text-[12px] font-semibold text-blue-700">Track 02 · 5 Modules</p>
            <h3 className="text-[18px] font-bold text-slate-900">Mastering Claude for GTM (Reps)</h3>
            <p className="text-[13.5px] leading-relaxed text-slate-600">
              Moves AEs &amp; SDRs from blank-box prompting to directing Chat, Cowork, Shared Pod Projects, and our 42 downloadable `.zip` Skills across Opendock, ShipperGuide TMS, and Loadsmart AI.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-4 text-[13.5px] text-slate-600">
          <span>Every lesson includes copyable Loadsmart snippets, checklists, and live progress tracking.</span>
          <Link href="/courses" className="font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 whitespace-nowrap">
            Open Rep Academy <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    ),
  },
  {
    key: "close",
    render: () => (
      <div className="flex h-full flex-col justify-center">
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-blue-600">Ready To Deploy Week One</p>
        <h2 className="mt-4 max-w-3xl text-[32px] sm:text-[50px] font-bold leading-[1.05] tracking-[-0.035em] text-slate-900">
          Everything needed to stop the leaks — already built and running.
        </h2>
        <p className="mt-5 max-w-2xl text-[16px] sm:text-[18px] leading-relaxed text-slate-600">
          Explore the full ABM Playbook deck and tables, test the live Pod Copilot, import the 6-step n8n workflow, download 42 team skills, or start the Rep Academy.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href="/playbook" className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-[14px] font-semibold text-white hover:bg-slate-800 whitespace-nowrap">
            ABM Playbook Deck <ArrowRight className="size-4" />
          </Link>
          <Link href="/demo" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-[14px] font-semibold text-white hover:bg-blue-700 whitespace-nowrap">
            Agent Workspace
          </Link>
          <Link href="/automations" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-[14px] font-semibold text-slate-800 hover:bg-slate-50 whitespace-nowrap">
            n8n Engine + Prompt
          </Link>
          <Link href="/skills" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-[14px] font-semibold text-slate-800 hover:bg-slate-50 whitespace-nowrap">
            42 Skills
          </Link>
          <Link href="/courses" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-[14px] font-semibold text-slate-800 hover:bg-slate-50 whitespace-nowrap">
            Rep Academy
          </Link>
        </div>
      </div>
    ),
  },
];

export function Deck() {
  const [i, setI] = useState(0);
  const [full, setFull] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const last = slides.length - 1;

  const next = useCallback(() => setI((v) => Math.min(last, v + 1)), [last]);
  const prev = useCallback(() => setI((v) => Math.max(0, v - 1)), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") next();
      if (e.key === "ArrowLeft" || e.key === "PageUp") prev();
    }
    function onFs() {
      setFull(document.fullscreenElement === ref.current);
    }
    window.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFs);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFs);
    };
  }, [next, prev]);

  function toggleFull() {
    if (document.fullscreenElement) document.exitFullscreen();
    else ref.current?.requestFullscreen();
  }

  return (
    <div ref={ref} className={full ? "flex h-screen flex-col bg-white p-6 sm:p-10" : ""}>
      <div
        className={`relative rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-white to-blue-50/50 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.25)] ${
          full ? "flex-1" : "min-h-[560px] lg:aspect-[16/9] lg:min-h-0"
        } p-7 sm:p-12 overflow-auto`}
      >
        {slides[i].render()}
        <span className="absolute bottom-5 right-6 font-mono text-[12px] text-slate-400">
          {i + 1} / {slides.length}
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Slides">
          {slides.map((s, idx) => (
            <button
              key={s.key}
              role="tab"
              aria-selected={idx === i}
              aria-label={`Slide ${idx + 1}`}
              onClick={() => setI(idx)}
              className={`h-1.5 rounded-full transition-all ${idx === i ? "w-7 bg-slate-900" : "w-1.5 bg-slate-300 hover:bg-slate-400"}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFull}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50"
          >
            {full ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
            {full ? "Exit" : "Present"}
          </button>
          <button onClick={prev} disabled={i === 0} aria-label="Previous slide" className="grid size-10 place-items-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-30">
            <ArrowLeft className="size-4" />
          </button>
          <button onClick={next} disabled={i === last} aria-label="Next slide" className="grid size-10 place-items-center rounded-full bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-30">
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

