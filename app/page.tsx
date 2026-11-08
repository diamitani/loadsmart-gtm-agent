import Link from "next/link";
import { ArrowRight, BadgeCheck, Gauge, Layers, ShieldCheck, Timer, Workflow } from "lucide-react";
import { Logo } from "@/components/brand";
import { PipelineTracker, Waves, WGauge } from "@/components/pipeline";
import { Badge, ButtonLink } from "@/components/ui";
import { ThemeToggle } from "@/components/theme-toggle";
import { STAGES, STAGE_LABELS, type StageEvent } from "@/lib/pal/types";
import { ASSET_TITLES } from "@/lib/pal/intent";

const DEMO_STAGES: StageEvent[] = [
  { stage: "intake", status: "done", summary: "142 words · 2 links · 1 file compiled into MASTER.md", ms: 4 },
  { stage: "intent", status: "done", summary: "6 deliverables · confidence 88%", ms: 812 },
  { stage: "foundation", status: "done", summary: "W = 1.00 — foundation complete, 2 labelled assumptions", ms: 1 },
  { stage: "instruct", status: "done", summary: "5 skills · 4 knowledge snippets · 3 guardrails", ms: 3 },
  { stage: "plan", status: "done", summary: "7 nodes → 4 waves", ms: 1 },
  { stage: "build", status: "running", summary: "Wave 3/4: email_sequence ‖ kpi_scorecard" },
];

const PRINCIPLES = [
  {
    icon: Gauge,
    title: "Foundation before multipliers",
    body: "The Architect scores your request's wholeness (W). Below 1.00 it stops and asks one focused question — no tokens spent multiplying guesses.",
  },
  {
    icon: Layers,
    title: "Middle-out parallel builds",
    body: "Deliverables become a dependency graph, compressed into waves that run concurrently. Personas wait for the ICP; your battlecard doesn't.",
  },
  {
    icon: ShieldCheck,
    title: "Calibrated truth",
    body: "Bold on positioning and copy. Strict on emails, numbers, dates and customer names — anything not in your inputs is flagged before it ships.",
  },
  {
    icon: Timer,
    title: "Durable by design",
    body: "Long builds and approvals hand off to a durable agent that sleeps with zero compute until a human says go. Nothing times out, nothing is lost.",
  },
];

const STACK = [
  { name: "Vercel AI SDK", what: "Streaming agent, tools, approvals" },
  { name: "Cloudflare Agents", what: "Durable runs on Durable Objects" },
  { name: "LangSmith", what: "Traces per stage + eval experiments" },
  { name: "Supabase", what: "Postgres with row-level security" },
  { name: "n8n · Make · Zapier", what: "Approval-gated delivery webhooks" },
];

export default function Landing() {
  return (
    <div className="overflow-x-hidden">
      <header className="sticky top-0 z-30 border-b hairline bg-paper/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-7 text-sm text-muted md:flex" aria-label="Primary">
            <a href="#how" className="hover:text-ink">How it works</a>
            <a href="#builds" className="hover:text-ink">What it builds</a>
            <a href="#principles" className="hover:text-ink">Principles</a>
            <a href="#platform" className="hover:text-ink">Platform</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <ButtonLink href="/app" size="sm">Open the Architect <ArrowRight className="h-3.5 w-3.5" /></ButtonLink>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="grain pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:pt-24">
          <div className="rise">
            <Badge tone="clay">The AI go-to-market architect</Badge>
            <h1 className="display mt-5 text-[2.6rem] leading-[1.02] text-ink sm:text-6xl">
              From scattered notes to a pipeline engine — <em className="text-clay">verified.</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Enably turns your docs, links and half-formed ideas into a complete GTM package — ICP, personas, positioning, sequences, playbooks and KPIs — built in parallel, tested for truth, and handed back with one next action.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/app" variant="clay">Start a GTM build <ArrowRight className="h-4 w-4" /></ButtonLink>
              <ButtonLink href="#how" variant="outline">See how it works</ButtonLink>
            </div>
            <p className="mt-4 text-xs text-faint">Runs in demo mode with zero setup. Nothing is sent without your approval.</p>
          </div>

          {/* Product glimpse */}
          <div className="rise relative space-y-4 [animation-delay:120ms]">
            <div className="card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="eyebrow">Run · AI bookkeeping for agencies</div>
                  <div className="mt-1 text-sm font-medium text-ink">GTM starter pack</div>
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

      {/* How it works */}
      <section id="how" className="border-y hairline bg-paper-2/60">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <div className="eyebrow">The PAL pipeline</div>
            <h2 className="display mt-3 text-4xl">Eight stages. Every one of them visible.</h2>
            <p className="mt-3 text-muted">Most AI tools hide the reasoning. Enably shows you the run as it happens — and records a manifest you can audit later.</p>
          </div>
          <ol className="mt-10 grid gap-px overflow-hidden rounded-2xl border hairline bg-line sm:grid-cols-2 lg:grid-cols-4">
            {STAGES.map((s, i) => (
              <li key={s} className="bg-surface p-5">
                <div className="font-mono text-xs text-clay">{String(i + 1).padStart(2, "0")}</div>
                <div className="mt-2 font-medium text-ink">{STAGE_LABELS[s].title}</div>
                <p className="mt-1 text-sm text-muted">{STAGE_LABELS[s].blurb}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* What it builds */}
      <section id="builds" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div className="eyebrow">What it builds</div>
            <h2 className="display mt-3 text-4xl">The whole GTM engine, not another blank doc.</h2>
            <p className="mt-3 text-muted">Thirteen asset types written by specialist subagents, plus an 11-document project package — intent brief, JTBD, KPI tracking, architecture, PRD, executive overview, tasks and a portable skill — on every run.</p>
            <div className="mt-6 flex items-center gap-2 text-sm text-ink"><BadgeCheck className="h-4 w-4 text-evergreen" /> Versioned in your Library. Approved by you.</div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {Object.values(ASSET_TITLES).map((t) => (
              <div key={t} className="flex items-center gap-3 rounded-xl border hairline bg-surface px-4 py-3 text-sm text-ink">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-clay" /> {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section id="principles" className="bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="eyebrow !text-paper/60">Operating principles</div>
          <h2 className="display mt-3 max-w-2xl text-4xl">Deterministic where it matters. Creative where it counts.</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {PRINCIPLES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="border-t border-paper/15 pt-5">
                <Icon className="h-5 w-5 text-clay" />
                <div className="mt-3 text-lg font-medium">{title}</div>
                <p className="mt-1.5 text-sm leading-relaxed text-paper/70">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform */}
      <section id="platform" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div>
            <div className="eyebrow">Platform</div>
            <h2 className="display mt-3 text-4xl">Built like infrastructure.</h2>
            <p className="mt-3 text-muted">Open, inspectable, and yours. The agent's skills are plain Markdown you can edit; every run is traced; every external action waits for a human.</p>
          </div>
          <div className="card divide-y divide-line">
            {STACK.map((s) => (
              <div key={s.name} className="flex items-center justify-between gap-4 px-5 py-4">
                <span className="font-medium text-ink">{s.name}</span>
                <span className="text-right text-sm text-muted">{s.what}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t hairline">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-16 sm:px-6 md:flex-row md:items-center">
          <div>
            <h2 className="display text-3xl">Tell it what you sell. Get the engine back.</h2>
            <p className="mt-2 text-muted">Your first package takes a couple of minutes.</p>
          </div>
          <ButtonLink href="/app" variant="clay">Open the Architect <Workflow className="h-4 w-4" /></ButtonLink>
        </div>
      </section>

      <footer className="border-t hairline">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-xs text-faint sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Logo />
          <span>© {new Date().getFullYear()} Enably · GTM Architect</span>
          <Link href="/app/settings" className="hover:text-ink">Workspace settings</Link>
        </div>
      </footer>
    </div>
  );
}
