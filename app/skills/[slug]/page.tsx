import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, Bot, ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { DocMarkdown } from "@/components/markdown";
import { getSkill, kit, skillMeta } from "@/lib/kit";

export function generateStaticParams() {
  return kit.skills.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${slug} · Loadsmart GTM AI COE` };
}

export default async function SkillPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const skill = getSkill(slug);
  if (!skill) notFound();
  const meta = skillMeta[skill.slug];
  const idx = kit.skills.findIndex((s) => s.slug === skill.slug);
  const prev = kit.skills[idx - 1];
  const next = kit.skills[idx + 1];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 space-y-8">
      <Link href="/skills" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Skills</span>
      </Link>

      {/* Skill Hero Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
            {meta?.step}
          </span>
          <span className="text-slate-400 font-medium text-[11px]">{meta?.when}</span>
        </div>

        <h1 className="font-mono text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{skill.slug}</h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{skill.description}</p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <a
            href={`/skills/${skill.slug}.zip`}
            download
            className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Skill (.zip)</span>
          </a>
          <Link
            href={`/copilot?q=${encodeURIComponent(`Walk me through the ${skill.slug} skill: what it reads, writes, and where it stops for approval.`)}`}
            className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-colors"
          >
            <Bot className="w-4 h-4 text-blue-600" />
            <span>Ask Copilot to Run</span>
          </Link>
        </div>

        <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-md border border-slate-200 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span><strong>Install instruction:</strong> Claude / Cursor → Settings → Capabilities → Upload .zip. Zero runtime dependencies.</span>
        </div>
      </div>

      {/* Markdown Body */}
      <article className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <DocMarkdown source={skill.body} />
      </article>

      {/* Pagination Navigation */}
      <nav className="flex justify-between items-center gap-4 text-xs sm:text-sm font-semibold" aria-label="Skill navigation">
        {prev ? (
          <Link href={`/skills/${prev.slug}`} className="text-blue-600 hover:text-blue-700 flex items-center gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            <span>{prev.slug}</span>
          </Link>
        ) : <span />}

        {next ? (
          <Link href={`/skills/${next.slug}`} className="text-blue-600 hover:text-blue-700 flex items-center gap-1.5 ml-auto">
            <span>{next.slug}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : <span />}
      </nav>
    </div>
  );
}