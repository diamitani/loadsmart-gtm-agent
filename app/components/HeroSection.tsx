import type { ReactNode } from "react";
import { ArrowRight, CircleCheck, FileStack, Gauge, Layers, MailCheck, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { PipelineTracker, Waves, WGauge } from "@/components/pipeline";
import { ButtonLink } from "@/components/ui";
import { STAGES, type StageEvent } from "@/lib/pal/types";
import { ASSET_TITLES } from "@/lib/pal/intent";

/** Illustrative run shown in the hero (a product glimpse, not customer data). */
const DEMO_STAGES: StageEvent[] = [
  { stage: "intake", status: "done", summary: "Notes, 2 links and a deck compiled into MASTER.md" },
  { stage: "intent", status: "done", summary: "6 deliverables identified" },
  { stage: "foundation", status: "done", summary: "W = 1.00 — foundation complete" },
  { stage: "instruct", status: "done", summary: "Skills, knowledge and guardrails compiled" },
  { stage: "plan", status: "done", summary: "7 deliverables → 4 parallel waves" },
  { stage: "build", status: "running", summary: "Wave 3/4: email sequence ‖ KPI scorecard" },
];

export default function Hero() {
  return (
    <section className="relative isolate" aria-labelledby="hero-title">
      <div className="hero-glow pointer-events-none absolute inset-0 -z-10" aria-hidden />
      <div className="grain pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]" aria-hidden />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28 lg:pt-24">
        <div className="rise">
          <p className="inline-flex items-center gap-2 rounded-full border border-clay/20 bg-clay-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-clay">
            <Sparkles className="h-3.5 w-3.5" aria-hidden /> The AI GTM Architect
          </p>
          <h1 id="hero-title" className="display mt-6 text-[2.5rem] leading-[1.05] text-ink sm:text-6xl lg:text-[4.1rem]">
            The revenue engine your sales team runs on, <em className="text-gradient">architected in minutes.</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Give Enably your notes, docs and links. It builds the full go-to-market package: ICP, personas, positioning, outbound sequences, call scripts, playbooks and KPIs. Everything is generated in parallel, checked for unsupported claims, and waits for your approval before anything goes out.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/signup" variant="clay" className="h-12 px-6 text-base shadow-soft">
              Get started free <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href="/signin" variant="outline" className="h-12 px-6 text-base">
              Sign in
            </ButtonLink>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted" aria-label="Highlights">
            {["Sign in with Google or email", "Bring your own AI key", "Nothing sends without approval"].map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5">
                <CircleCheck className="h-4 w-4 text-evergreen" aria-hidden /> {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Product glimpse */}
        <div className="rise relative space-y-4 [animation-delay:120ms]" aria-label="Example of a GTM build in progress" role="img">
          <div className="card p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="eyebrow">Example run</div>
                <div className="mt-1 truncate text-sm font-semibold text-ink">GTM starter pack</div>
              </div>
              <WGauge W={1} size={64} />
            </div>
            <div className="mt-5">
              <PipelineTracker stages={DEMO_STAGES} />
            </div>
          </div>
          <div className="card relative ml-auto w-full p-4 sm:w-80 lg:-ml-10 lg:mr-auto">
            <div className="eyebrow mb-2">Build plan · 4 waves</div>
            <Waves waves={[["icp"], ["personas", "positioning", "kpi"], ["email_sequence"], ["playbook"]]} />
          </div>
        </div>
      </div>
    </section>
  );
}

/** What it does, as capabilities (replaces vanity stats). */
export function Capabilities() {
  const items = [
    { k: `${STAGES.length} stages`, v: "From intake to presentation, each one visible as it runs" },
    { k: `${Object.keys(ASSET_TITLES).length} asset types`, v: "ICP to automation blueprints, written by specialist subagents" },
    { k: "1 question", v: "If the brief is incomplete, it asks one focused question instead of guessing" },
    { k: "0 auto-sends", v: "Emails, CRM writes and workflow hand-offs all wait for your approval" },
  ];
  return (
    <section aria-label="Capabilities" className="border-y hairline bg-paper-2/70">
      <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-4 sm:px-6 lg:grid-cols-4">
        {items.map((i) => (
          <div key={i.k} className="px-2 py-8 sm:px-4">
            <dt className="text-2xl font-bold tracking-tight text-clay sm:text-3xl">{i.k}</dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-muted">{i.v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** Tools it connects to (integrations, not customers). */
export function TrustBadges() {
  const tools = ["HubSpot", "Salesforce", "Attio", "Zoho CRM", "Apollo", "Clay", "Hunter", "Resend", "n8n", "Make", "Zapier", "MCP"];
  return (
    <section aria-labelledby="stack-title" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h2 id="stack-title" className="eyebrow text-center">Works with the stack you already run</h2>
      <ul className="mt-5 flex flex-wrap justify-center gap-2.5">
        {tools.map((t) => (
          <li key={t} className="rounded-full border hairline bg-surface px-4 py-1.5 text-sm font-medium text-ink-2">
            {t}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-center text-xs text-faint">Native connectors or MCP / webhooks. You connect your own accounts and keys.</p>
    </section>
  );
}

const FEATURES: { icon: ReactNode; tag: string; title: string; description: string; tone: string }[] = [
  {
    icon: <FileStack className="h-5 w-5" aria-hidden />,
    tag: "Intake",
    title: "Reads everything you already have",
    description: "PDFs, Word, PowerPoint, Excel, screenshots (OCR), web pages, and audio or video transcripts. Everything is compiled into a single source of truth for the run.",
    tone: "bg-clay-soft text-clay",
  },
  {
    icon: <Gauge className="h-5 w-5" aria-hidden />,
    tag: "Foundation",
    title: "Checks the brief before it builds",
    description: "A wholeness score (W) checks whether it knows enough. Below 1.00 it stops and asks one focused question rather than producing confident guesses.",
    tone: "bg-violet-soft text-violet",
  },
  {
    icon: <Layers className="h-5 w-5" aria-hidden />,
    tag: "Build",
    title: "Builds the whole engine in parallel",
    description: "Deliverables become a dependency graph that runs in waves. Personas wait for the ICP, and your battlecard doesn't have to.",
    tone: "bg-flame-soft text-flame",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" aria-hidden />,
    tag: "Truth guard",
    title: "Flags claims it can't support",
    description: "It can be bold on positioning but stays strict on facts. Emails, numbers, dates and customer names that aren't in your inputs are flagged before you ship.",
    tone: "bg-evergreen-soft text-evergreen",
  },
  {
    icon: <MailCheck className="h-5 w-5" aria-hidden />,
    tag: "SDR tools",
    title: "Research, prospect, verify, send",
    description: "Web research, Apollo prospecting, Hunter verification, HubSpot CRM updates and Resend email. Every external action is approval-gated, with daily send caps and suppression lists.",
    tone: "bg-sky-soft text-sky",
  },
  {
    icon: <Workflow className="h-5 w-5" aria-hidden />,
    tag: "Delivery",
    title: "Hands off to your automations",
    description: "Approved packages go to n8n, Make or Zapier. You can also use Enably from Claude, Cursor or n8n over MCP.",
    tone: "bg-amber-soft text-amber",
  },
];

/** Feature cards */
export function FeatureCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {FEATURES.map((f) => (
        <Card key={f.title} {...f} />
      ))}
    </div>
  );
}

function Card({ icon, tag, title, description, tone }: { icon: ReactNode; tag: string; title: string; description: string; tone: string }) {
  return (
    <article className="card group p-6 transition-transform duration-200 hover:-translate-y-1 motion-reduce:transform-none">
      <div className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}>{icon}</div>
      <p className="mt-5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-faint">{tag}</p>
      <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
    </article>
  );
}


