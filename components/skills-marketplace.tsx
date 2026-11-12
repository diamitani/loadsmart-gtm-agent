"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Download, X, FileText, Search, Copy, Check, ArrowRight } from "lucide-react";
import { DocMarkdown } from "./markdown";

export type MarketSkill = {
  slug: string;
  name?: string;
  description: string;
  body: string;
  step: string;
  when: string;
  category?: "loadsmart" | "prospect" | "sovereign";
};

type FilterTab = "all" | "loadsmart" | "prospect" | "sovereign";

export function SkillsMarketplace({ skills }: { skills: MarketSkill[] }) {
  const [filter, setFilter] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<MarketSkill | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

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

  const counts = useMemo(() => {
    const c = { all: skills.length, loadsmart: 0, prospect: 0, sovereign: 0 };
    for (const s of skills) {
      const cat = s.category ?? "sovereign";
      c[cat]++;
    }
    return c;
  }, [skills]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return skills.filter((s) => {
      const cat = s.category ?? "sovereign";
      const matchesCat = filter === "all" || cat === filter;
      const matchesSearch =
        !q ||
        s.slug.toLowerCase().includes(q) ||
        (s.name ?? "").toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.step.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [skills, filter, search]);

  function copyMarkdown(skill: MarketSkill) {
    navigator.clipboard.writeText(skill.body);
    setCopiedSlug(skill.slug);
    setTimeout(() => setCopiedSlug(null), 1800);
  }

  return (
    <div className="space-y-6">
      {/* Filter & Search Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label="Filter skills by category"
          className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-slate-100/80 p-1"
        >
          {[
            { id: "all", label: `All Skills (${counts.all})` },
            { id: "prospect", label: `6-Step Prospecting (${counts.prospect})` },
            { id: "loadsmart", label: `Loadsmart ABM Pods (${counts.loadsmart})` },
            { id: "sovereign", label: `Sovereign GTM (${counts.sovereign})` },
          ].map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(tab.id as FilterTab)}
                className={`rounded-lg px-3.5 py-2 text-[13px] font-semibold whitespace-nowrap shrink-0 transition-all tabular-nums ${
                  active
                    ? "bg-white text-slate-950 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills, steps, or tools..."
            aria-label="Search skills"
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-12 text-center space-y-3">
          <p className="text-[15px] font-semibold text-slate-900">No skills match &ldquo;{search}&rdquo;</p>
          <p className="text-[13.5px] text-slate-500">Clear your filter or try searching for &ldquo;signal&rdquo;, &ldquo;email&rdquo;, &ldquo;n8n&rdquo;, or &ldquo;crm&rdquo;.</p>
          <button
            onClick={() => {
              setFilter("all");
              setSearch("");
            }}
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <div
              key={s.slug}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 hover:border-slate-300 transition-colors"
            >
              {/* Clean unboxed metadata kicker */}
              <div className="flex items-center justify-between gap-2 text-[12px] text-slate-500">
                <span className="font-mono font-semibold text-blue-700 truncate">{s.step}</span>
                <span className="truncate text-slate-400">{s.when}</span>
              </div>

              <h3 className="mt-3 font-mono text-[15.5px] font-bold text-slate-900">
                {s.slug}
              </h3>

              <p className="mt-2 line-clamp-3 flex-1 text-[13.5px] leading-relaxed text-slate-600">
                {s.description}
              </p>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
                <a
                  href={`/skills/${s.slug}.zip`}
                  download
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-slate-800 whitespace-nowrap transition-colors"
                >
                  <Download className="size-3.5" />
                  <span>Download .zip</span>
                </a>
                <button
                  onClick={() => setOpen(s)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap transition-colors"
                >
                  <FileText className="size-3.5" />
                  <span>Inspect</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skill Spec Inspector Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-slate-900/45 backdrop-blur-xs p-0 sm:p-6"
          onClick={() => setOpen(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={open.slug}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white border border-slate-200 shadow-2xl"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-4">
              <div>
                <p className="text-[12px] font-mono text-blue-700 font-semibold">
                  {open.step} · {open.when}
                </p>
                <p className="mt-0.5 font-mono text-[16px] font-bold text-slate-900">{open.slug}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyMarkdown(open)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12.5px] font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap"
                >
                  {copiedSlug === open.slug ? (
                    <Check className="size-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                  <span>{copiedSlug === open.slug ? "Copied" : "Copy SKILL.md"}</span>
                </button>

                <a
                  href={`/skills/${open.slug}.zip`}
                  download
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-[12.5px] font-semibold text-white hover:bg-slate-800 whitespace-nowrap"
                >
                  <Download className="size-3.5" />
                  <span>.zip</span>
                </a>

                <Link
                  href={`/skills/${open.slug}`}
                  className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap"
                >
                  <span>Full Page</span>
                  <ArrowRight className="size-3.5" />
                </Link>

                <button
                  onClick={() => setOpen(null)}
                  aria-label="Close skill dialog"
                  className="grid size-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto px-6 sm:px-8 py-6 space-y-4">
              <p className="text-[14px] leading-relaxed text-slate-600 border-b border-slate-100 pb-4">
                {open.description}
              </p>
              <DocMarkdown source={open.body} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
