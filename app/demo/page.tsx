import { kit, skillMeta } from "@/lib/kit";
import { DemoChat } from "@/components/demo-chat";
import { SkillsMarketplace, type MarketSkill } from "@/components/skills-marketplace";
import { Download } from "lucide-react";

export const metadata = { title: "Demo · Loadsmart GTM Engineering" };

const install = [
  {
    t: "Claude (web or desktop)",
    d: "Settings > Capabilities > Skills, then upload a skill's .zip. Repeat for each one you want.",
  },
  {
    t: "Claude Code",
    d: "Unzip the kit and point Claude Code at it. The kit's agent/CLAUDE.md explains the pipeline order.",
  },
  {
    t: "Pod Copilot",
    d: "Create a Claude Project, paste agent/pod-copilot-system-prompt.md as instructions, add config/ and skills/ as knowledge.",
  },
];

export default function DemoPage() {
  const skills: MarketSkill[] = kit.skills.map((s) => ({
    slug: s.slug,
    description: s.description,
    body: s.body,
    step: skillMeta[s.slug]?.step ?? "Skill",
    when: skillMeta[s.slug]?.when ?? "",
  }));

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <section className="pt-16 sm:pt-20 pb-10">
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-blue-600">Demo</p>
        <h1 className="mt-4 max-w-3xl text-[36px] sm:text-[52px] font-bold leading-[1.05] tracking-[-0.035em] text-slate-900">
          The pod agent, live.
        </h1>
        <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-slate-600">
          Ask it what a rep should do today, where the program leaks, or how any skill works. It reads the playbook and the
          skill pack before it answers.
        </p>
      </section>

      <DemoChat />

      <section id="skills" className="scroll-mt-20 pt-24 pb-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-blue-600">Skill marketplace</p>
            <h2 className="mt-3 text-[30px] sm:text-[38px] font-bold tracking-[-0.03em] text-slate-900">
              All {skills.length} skills, yours to keep.
            </h2>
            <p className="mt-2 max-w-2xl text-[16px] text-slate-600">
              One skill per pipeline step plus the orchestrator. Download one, or take the full kit with config, the
              copilot prompt and the pod dashboard.
            </p>
          </div>
          <a
            href="/loadsmart-abm-os.zip"
            download
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-blue-700"
          >
            <Download className="size-4" /> Download all (.zip)
          </a>
        </div>

        <div className="mt-8 grid gap-px overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 sm:grid-cols-3">
          {install.map((s, i) => (
            <div key={s.t} className="bg-slate-50 p-6">
              <p className="font-mono text-[12px] text-slate-400">0{i + 1}</p>
              <p className="mt-2 text-[15px] font-semibold text-slate-900">{s.t}</p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-slate-600">{s.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <SkillsMarketplace skills={skills} />
        </div>

        <p className="mt-8 text-[13px] text-slate-500">
          Ground rules built into every skill: nothing sends, enrolls or writes to Salesforce without a human yes, and
          nothing in copy is invented.
        </p>
      </section>
    </div>
  );
}
