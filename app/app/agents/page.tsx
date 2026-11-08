import { Boxes } from "lucide-react";
import { listSkills, SKILL_FOR } from "@/lib/agent/skills";
import { ASSET_TITLES } from "@/lib/pal/intent";
import { STAGES, STAGE_LABELS } from "@/lib/pal/types";
import { Badge, Card, PageHeader } from "@/components/ui";

export const metadata = { title: "Agents & Skills" };

const SUBAGENTS: { id: string; role: string }[] = [
  { id: "icp", role: "ICP Architect" },
  { id: "personas", role: "Persona Architect" },
  { id: "messaging", role: "Messaging Architect" },
  { id: "outbound-sequences", role: "Outbound Architect" },
  { id: "competitive", role: "Competitive Architect" },
  { id: "kpi", role: "KPI Architect" },
  { id: "playbook", role: "Playbook Architect" },
  { id: "prospector", role: "Prospector" },
  { id: "n8n-engineer", role: "Automation Engineer" },
  { id: "use-cases", role: "Use Case Architect" },
  { id: "sales-ops-setup", role: "Sales Ops Architect" },
];

export default function AgentsPage() {
  const skills = listSkills();
  const owns = (skill: string) => Object.entries(SKILL_FOR).filter(([, s]) => s === skill).map(([k]) => ASSET_TITLES[k as keyof typeof ASSET_TITLES]);
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
      <PageHeader eyebrow="Harness" title="Agents & Skills" description={<>One orchestrator, nine bounded specialists, and a portable skill library. Everything lives in <code className="font-mono text-xs">/agent</code> as Markdown — edit a SKILL.md to change how an asset is written.</>} />

      <Card className="mt-6 p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-ink text-paper"><Boxes className="h-6 w-6" /></div>
          <div className="min-w-0">
            <div className="display text-2xl">GTM Architect <span className="text-base text-muted">· orchestrator</span></div>
            <p className="mt-1 text-sm text-muted">Compiles any request through PAL, gates on W = 1.00, schedules specialists in parallel waves, and tests everything before presenting.</p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {STAGES.map((s, i) => (
            <span key={s} className="inline-flex items-center gap-1.5 rounded-full border hairline bg-paper-2 px-2.5 py-1 text-[11px] text-ink-2">
              <span className="font-mono text-faint">{i + 1}</span> {STAGE_LABELS[s].title}
            </span>
          ))}
        </div>
      </Card>

      <h2 className="display mt-10 text-2xl">Specialist subagents</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SUBAGENTS.map((a) => (
          <Card key={a.id} className="p-4">
            <div className="text-sm font-medium text-ink">{a.role}</div>
            <div className="mt-0.5 font-mono text-[10px] text-faint">skills/{a.id}</div>
            <div className="mt-3 flex flex-wrap gap-1">{owns(a.id).map((t) => <Badge key={t} tone="clay">{t}</Badge>)}</div>
          </Card>
        ))}
      </div>

      <h2 className="display mt-10 text-2xl">Skill library</h2>
      <div className="card mt-4 divide-y divide-line">
        {skills.map((s) => (
          <div key={s.name} className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:items-center sm:gap-6">
            <div className="w-48 shrink-0 font-mono text-xs text-ink">{s.name}</div>
            <div className="min-w-0 flex-1 text-sm text-muted">{s.description}</div>
            <div className="shrink-0 text-[11px] text-faint">{s.files} file{s.files === 1 ? "" : "s"}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
