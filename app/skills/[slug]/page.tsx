import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocMarkdown } from "@/components/markdown";
import { getSkill, kit, skillMeta } from "@/lib/kit";

export function generateStaticParams() {
  return kit.skills.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${slug} · Loadsmart ABM OS` };
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
    <div className="mx-auto max-w-4xl px-5 py-10">
      <Link href="/skills" className="text-[14px] text-muted hover:text-ink">← All skills</Link>
      <div className="mt-4 rounded-xl border border-line bg-card p-6">
        <div className="flex items-center gap-2 text-[12px]">
          <span className="px-2 py-0.5 rounded-full bg-brand-soft text-brand font-semibold">{meta?.step}</span>
          <span className="text-muted">{meta?.when}</span>
        </div>
        <h1 className="mt-3 font-mono text-[24px] font-bold">{skill.slug}</h1>
        <p className="mt-2 text-ink-2 leading-relaxed">{skill.description}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href={`/skills/${skill.slug}.zip`} className="px-4 py-2.5 rounded-xl bg-ink text-white font-medium text-[14px]">
            Download skill (.zip)
          </a>
          <Link
            href={`/copilot?q=${encodeURIComponent(`Walk me through the ${skill.slug} skill: what it reads, writes, and where it stops for approval.`)}`}
            className="px-4 py-2.5 rounded-xl border border-line font-medium text-[14px]"
          >
            Ask the copilot about it
          </Link>
        </div>
        <p className="mt-3 text-[12.5px] text-muted">To install in Claude: Settings → Capabilities → Skills → upload the zip.</p>
      </div>
      <article className="mt-8">
        <DocMarkdown source={skill.body} />
      </article>
      <nav className="mt-12 flex justify-between gap-4 text-[14px]" aria-label="Skill navigation">
        {prev ? <Link href={`/skills/${prev.slug}`} className="text-brand hover:underline">← {prev.slug}</Link> : <span />}
        {next ? <Link href={`/skills/${next.slug}`} className="text-brand hover:underline">{next.slug} →</Link> : <span />}
      </nav>
    </div>
  );
}
