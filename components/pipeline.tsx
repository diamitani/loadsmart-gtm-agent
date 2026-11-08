import { Check, CircleDashed, Loader2, OctagonPause, TriangleAlert } from "lucide-react";
import { STAGES, STAGE_LABELS, type StageEvent, type StageId } from "@/lib/pal/types";
import { cn, fmtMs } from "@/lib/utils";

/** The PAL stepper: Intake → Intent → Foundation → Instruct → Plan → Build → Test → Present. */
export function PipelineTracker({ stages, compact = false }: { stages: StageEvent[]; compact?: boolean }) {
  const byId = new Map<StageId, StageEvent>(stages.map((s) => [s.stage, s]));
  const blockedAt = stages.find((s) => s.status === "blocked")?.stage;
  return (
    <ol className={cn("relative", compact ? "space-y-2" : "space-y-3")} aria-label="PAL pipeline progress">
      {STAGES.map((id, i) => {
        const ev = byId.get(id);
        const after = blockedAt && STAGES.indexOf(blockedAt) < i;
        const status = ev?.status ?? (after ? "skipped" : "pending");
        return (
          <li key={id} className="relative flex gap-3">
            {i < STAGES.length - 1 && <span className={cn("absolute left-[11px] top-6 h-[calc(100%-4px)] w-px", status === "done" ? "bg-evergreen/40" : "bg-line")} aria-hidden />}
            <StageIcon status={status} />
            <div className="min-w-0 flex-1 pb-0.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className={cn("text-[13px] font-medium", status === "pending" || status === "skipped" ? "text-faint" : "text-ink")}>{STAGE_LABELS[id].title}</span>
                {ev?.ms !== undefined && status !== "running" && <span className="font-mono text-[10px] text-faint">{fmtMs(ev.ms)}</span>}
              </div>
              {!compact && (
                <p className={cn("text-xs leading-snug", status === "blocked" ? "text-amber" : "text-muted")}>
                  {ev?.summary || (status === "pending" ? STAGE_LABELS[id].blurb : status === "skipped" ? "Waiting on the foundation" : status === "running" ? "Working…" : "")}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function StageIcon({ status }: { status: string }) {
  const base = "relative z-[1] grid h-6 w-6 shrink-0 place-items-center rounded-full border";
  if (status === "done") return <span className={cn(base, "border-evergreen bg-evergreen text-paper")}><Check className="h-3.5 w-3.5" /></span>;
  if (status === "running") return <span className={cn(base, "border-clay bg-clay-soft text-clay")}><Loader2 className="h-3.5 w-3.5 animate-spin" /></span>;
  if (status === "blocked") return <span className={cn(base, "border-amber bg-amber-soft text-amber")}><OctagonPause className="h-3.5 w-3.5" /></span>;
  if (status === "error") return <span className={cn(base, "border-rose bg-rose-soft text-rose")}><TriangleAlert className="h-3.5 w-3.5" /></span>;
  return <span className={cn(base, "border-line bg-surface text-faint")}><CircleDashed className="h-3.5 w-3.5" /></span>;
}

/** Foundation wholeness gauge W ∈ [0, 1]. */
export function WGauge({ W, size = 88 }: { W: number; size?: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const ready = W >= 1;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90" aria-hidden>
        <circle cx="40" cy="40" r={r} fill="none" stroke="var(--line)" strokeWidth="6" />
        <circle cx="40" cy="40" r={r} fill="none" stroke={ready ? "var(--evergreen)" : "var(--amber)"} strokeWidth="6" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - W)} className="transition-[stroke-dashoffset] duration-700" />
      </svg>
      <div className="absolute text-center">
        <div className="font-mono text-[10px] text-faint">W</div>
        <div className="display -mt-0.5 text-xl leading-none">{W.toFixed(2)}</div>
      </div>
    </div>
  );
}

/** Parallel execution waves from the middle-out compressor. */
export function Waves({ waves, titles }: { waves: string[][]; titles?: Record<string, string> }) {
  return (
    <div className="space-y-1.5">
      {waves.map((w, i) => (
        <div key={i} className="flex items-start gap-2">
          <span className="mt-0.5 w-12 shrink-0 font-mono text-[10px] uppercase tracking-wider text-faint">Wave {i + 1}</span>
          <div className="flex flex-wrap gap-1">
            {w.map((id) => (
              <span key={id} className="rounded-md border hairline bg-paper-2 px-1.5 py-0.5 text-[11px] text-ink-2">
                {titles?.[id] ?? id.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
