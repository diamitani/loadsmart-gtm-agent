"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Maximize2, Minimize2 } from "lucide-react";
import { answers, author, type Answer } from "@/lib/answers";
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
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-blue-600">GTM Engineer · Case answers</p>
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
    key: "close",
    render: () => (
      <div className="flex h-full flex-col justify-center">
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-blue-600">Built to show it</p>
        <h2 className="mt-4 max-w-3xl text-[32px] sm:text-[52px] font-bold leading-[1.05] tracking-[-0.035em] text-slate-900">
          A working pod agent and the skill pack behind it.
        </h2>
        <p className="mt-5 max-w-2xl text-[16px] sm:text-[18px] leading-relaxed text-slate-600">
          One skill per pipeline step plus an orchestrator, a pod copilot grounded in the playbook, and a pod dashboard.
          Nothing sends or writes to Salesforce without a human approval.
        </p>
        <div className="mt-8">
          <Link href="/demo" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-[15px] font-semibold text-white hover:bg-slate-800">
            Open the demo <ArrowRight className="size-4" />
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

