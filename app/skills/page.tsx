import type { Metadata } from "next";
import Link from "next/link";
import { kit, skillMeta } from "@/lib/kit";

export const metadata: Metadata = { title: "Skills · Loadsmart ABM OS" };

export default function SkillsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="text-[13px] font-medium text-brand uppercase tracking-[0.08em]">Skill pack</p>
      <h1 className="mt-2 text-[34px] font-bold tracking-[-0.02em]">One skill per pipeline step</h1>
      <p className="mt-3 text-ink-2 max-w-3xl leading-relaxed">
        Each skill is a plain-language instruction file an AI assistant follows: what to read, what to write, and the gate
        before anything leaves the building. Upload a skill to Claude, or run the whole set from n8n or Make with Claude
        as the judgment step.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <a href="/loadsmart-abm-os.zip" className="px-4 py-2.5 rounded-xl bg-ink text-white font-medium text-[14px]">Download all (kit .zip)</a>
        <Link href="/copilot" className="px-4 py-2.5 rounded-xl border border-line bg-card font-medium text-[14px]">Ask the copilot about a skill</Link>
      </div>
      <div className="mt-10 grid md:grid-cols-2 gap-3">
        {kit.skills.map((s) => {
          const meta = skillMeta[s.slug];
          return (
            <Link key={s.slug} href={`/skills/${s.slug}`} className="group rounded-xl border border-line bg-card p-5 hover:border-brand/40 transition-colors">
              <div className="flex items-center gap-2 text-[12px]">
                <span className="px-2 py-0.5 rounded-full bg-brand-soft text-brand font-semibold">{meta?.step}</span>
                <span className="text-muted">{meta?.when}</span>
              </div>
              <h2 className="mt-3 font-mono text-[15px] font-semibold group-hover:text-brand transition-colors">{s.slug}</h2>
              <p className="mt-2 text-[14px] text-ink-2 leading-relaxed line-clamp-3">{s.description}</p>
            </Link>
          );
        })}
      </div>
      <section className="mt-12 rounded-xl border border-line bg-card p-6">
        <h2 className="font-semibold text-[17px]">Config the skills read</h2>
        <p className="mt-1 text-[14px] text-ink-2">Change behavior here, not in the prompts. Every file is versioned with a changelog line.</p>
        <ul className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-[14px]">
          {kit.configFiles.map((c) => (
            <li key={c.file} className="rounded-lg border border-line px-3 py-2 font-mono text-[13px]">config/{c.file}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
