"use client";

import { useEffect, useState } from "react";
import { Download, X, FileText } from "lucide-react";
import { DocMarkdown } from "./markdown";

export type MarketSkill = { slug: string; description: string; body: string; step: string; when: string };

export function SkillsMarketplace({ skills }: { skills: MarketSkill[] }) {
  const [open, setOpen] = useState<MarketSkill | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((s) => (
          <div key={s.slug} className="group flex flex-col rounded-3xl border border-slate-200 p-6 hover:border-slate-300 hover:shadow-sm transition-all">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-blue-50 px-2.5 py-1 font-mono text-[11px] font-semibold text-blue-700">{s.step}</span>
              <span className="text-[12px] text-slate-400">{s.when}</span>
            </div>
            <p className="mt-4 font-mono text-[15px] font-semibold text-slate-900">{s.slug}</p>
            <p className="mt-2 line-clamp-3 flex-1 text-[14px] leading-relaxed text-slate-600">{s.description}</p>
            <div className="mt-5 flex items-center gap-2">
              <a
                href={`/skills/${s.slug}.zip`}
                download
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-[13px] font-semibold text-white hover:bg-slate-800"
              >
                <Download className="size-3.5" /> Download
              </a>
              <button
                onClick={() => setOpen(s)}
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50"
              >
                <FileText className="size-3.5" /> Read
              </button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-0 sm:p-6" onClick={() => setOpen(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={open.slug}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-6 py-4">
              <div>
                <p className="font-mono text-[15px] font-semibold text-slate-900">{open.slug}</p>
                <p className="text-[12px] text-slate-500">
                  {open.step} · {open.when}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`/skills/${open.slug}.zip`}
                  download
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-[13px] font-semibold text-white hover:bg-slate-800"
                >
                  <Download className="size-3.5" /> .zip
                </a>
                <button onClick={() => setOpen(null)} aria-label="Close" className="grid size-9 place-items-center rounded-full hover:bg-slate-100">
                  <X className="size-4" />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto px-6 sm:px-8 py-6">
              <p className="mb-4 text-[14px] leading-relaxed text-slate-600">{open.description}</p>
              <DocMarkdown source={open.body} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

