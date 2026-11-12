import type { Metadata } from "next";
import Link from "next/link";
import { Download, Bot, Workflow } from "lucide-react";
import { kit, skillMeta, getSkillCategory } from "@/lib/kit";
import { SkillsMarketplace, type MarketSkill } from "@/components/skills-marketplace";

export const metadata: Metadata = {
  title: "Team Skills Marketplace · Loadsmart GTM AI COE",
  description:
    "Portable AI skills marketplace for Loadsmart AE/SDR pods and RevOps: 6-step prospect automation skills, 11 Loadsmart ABM pod skills, and Sovereign GTM blueprints.",
};

const installWays = [
  {
    index: "01",
    title: "Claude Desktop / Web",
    detail: "Open Settings > Capabilities > Skills and upload any skill .zip file directly.",
  },
  {
    index: "02",
    title: "Claude Code CLI",
    detail: "Unzip into .claude/skills/ inside your repository so every rep invokes them with /skill-name.",
  },
  {
    index: "03",
    title: "Projects & Automations",
    detail: "Pair SKILL.md packs with Loadsmart config YAMLs and the 6-step n8n engine.",
  },
];

export default function SkillsPage() {
  const skills: MarketSkill[] = kit.skills.map((s) => ({
    slug: s.slug,
    name: s.name,
    description: s.description,
    body: s.body,
    step: skillMeta[s.slug]?.step ?? "Autonomous",
    when: skillMeta[s.slug]?.when ?? "On Demand",
    category: getSkillCategory(s.slug),
  }));

  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8 py-12 space-y-10">
      {/* Header Section */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-blue-600">
            Team Skills Marketplace · {skills.length} Portable Skills
          </p>
          <h1 className="mt-2 max-w-3xl text-[32px] sm:text-[46px] font-bold leading-[1.06] tracking-[-0.03em] text-slate-900 text-balance">
            Deterministic skills built for every step of Loadsmart GTM.
          </h1>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-slate-600">
            Browse the 6-Step Prospect Automation sequence, Loadsmart&apos;s 11 ABM Pod blueprints, and Sovereign GTM engineering skills. Inspect any <code className="font-mono text-[13px] text-blue-700">SKILL.md</code> or download ready-to-install <code className="font-mono text-[13px] text-blue-700">.zip</code> bundles.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/automations"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[13.5px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            <Workflow className="size-4 text-blue-600" />
            <span>n8n Automation</span>
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[13.5px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            <Bot className="size-4 text-blue-600" />
            <span>Test in Copilot</span>
          </Link>
          <a
            href="/loadsmart-abm-os.zip"
            download
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-[13.5px] font-semibold text-white hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            <Download className="size-4" />
            <span>Download Full Kit (.zip)</span>
          </a>
        </div>
      </section>

      {/* Install Strip */}
      <section className="grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-3">
        {installWays.map((item) => (
          <div key={item.index} className="bg-slate-50/90 p-5 sm:p-6">
            <p className="font-mono text-[12px] font-semibold tabular-nums text-blue-700">{item.index}</p>
            <h2 className="mt-1.5 text-[15px] font-bold text-slate-900">{item.title}</h2>
            <p className="mt-1 text-[13.5px] leading-relaxed text-slate-600">{item.detail}</p>
          </div>
        ))}
      </section>

      {/* Searchable, Filterable Grid */}
      <SkillsMarketplace skills={skills} />

      {/* Grounding Knowledge Files */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-[16px] font-bold text-slate-900">Shared Configuration Files Read By Skills</h2>
            <p className="mt-1 text-[13.5px] text-slate-500">
              Adjust ICP tiers, pod routing, and outbound quotas in versioned YAML rather than rewriting prompts.
            </p>
          </div>
          <Link href="/documents" className="text-[13px] font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap">
            Read configs in Documents →
          </Link>
        </div>

        <ul className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-[12.5px]">
          {kit.configFiles.map((c) => (
            <li
              key={c.file}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-mono text-slate-700 flex items-center justify-between"
            >
              <span>kit/config/{c.file}</span>
              <span className="text-[11px] font-semibold text-slate-500">YAML</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}