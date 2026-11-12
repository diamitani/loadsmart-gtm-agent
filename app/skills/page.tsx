import type { Metadata } from "next";
import Link from "next/link";
import { Download, Bot, Sparkles, FileText, CheckCircle2 } from "lucide-react";
import { kit, skillMeta } from "@/lib/kit";

export const metadata: Metadata = { title: "Skills Library · Loadsmart GTM AI COE" };

export default function SkillsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 space-y-10">
      {/* Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          Autonomous Agent Skill Pack · 11 Production Blueprints
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">One Master Skill Per Pipeline Step</h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          Each skill is a plain-language, deterministic instruction pack an AI assistant follows: what to read from Loadsmart knowledge, what to write, and the strict human-in-the-loop gate before any touchpoint leaves the building. Install in Claude, Cursor, or execute directly from n8n orchestrator workflows.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href="/loadsmart-abm-os.zip"
            download
            className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Full Skill Pack (kit .zip)</span>
          </a>
          <Link
            href="/copilot"
            className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-colors"
          >
            <Bot className="w-4 h-4 text-blue-600" />
            <span>Ask Copilot About a Skill</span>
          </Link>
        </div>
      </div>

      {/* Grid of 11 Skills */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Pipeline Step Skills ({kit.skills.length})
          </h2>
          <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-medium">
            Truth Guard W = 1.00 Enforced
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {kit.skills.map((s) => {
            const meta = skillMeta[s.slug];
            return (
              <Link
                key={s.slug}
                href={`/skills/${s.slug}`}
                className="group rounded-xl border border-slate-200 bg-white p-5 hover:border-blue-400 hover:shadow-md transition-all shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                      {meta?.step}
                    </span>
                    <span className="text-slate-400 font-medium text-[11px]">{meta?.when}</span>
                  </div>
                  <h3 className="mt-3 font-mono text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {s.slug}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {s.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-semibold">
                  <span>Inspect Spec & Download .zip →</span>
                  <FileText className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Configuration Read by Skills */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
        <h2 className="font-bold text-base text-slate-900">Knowledge Configuration Read By All Skills</h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Change pipeline behavior in the YAML/Markdown knowledge files, not inside agent prompts. Every file is versioned with strict change audit lines.
        </p>
        <ul className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
          {kit.configFiles.map((c) => (
            <li
              key={c.file}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 font-mono text-[12px] text-slate-700 flex items-center justify-between"
            >
              <span>config/{c.file}</span>
              <span className="text-[10px] text-emerald-600 font-semibold">v1.0</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}