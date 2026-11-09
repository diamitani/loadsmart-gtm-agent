import Link from "next/link";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "clay" | "green" | "amber" | "rose" | "sky";
const toneCls: Record<Tone, string> = {
  neutral: "bg-paper-2 text-ink-2 border-line",
  clay: "bg-clay-soft text-clay border-transparent",
  green: "bg-evergreen-soft text-evergreen border-transparent",
  amber: "bg-amber-soft text-amber border-transparent",
  rose: "bg-rose-soft text-rose border-transparent",
  sky: "bg-sky-soft text-sky border-transparent",
};

export function Badge({ tone = "neutral", className, children }: { tone?: Tone; className?: string; children: React.ReactNode }) {
  return <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap", toneCls[tone], className)}>{children}</span>;
}

type BtnProps = { variant?: "primary" | "clay" | "ghost" | "outline"; size?: "sm" | "md"; className?: string; children: React.ReactNode };
const btnBase = "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none";
const btnVariant = {
  primary: "bg-ink text-paper hover:bg-ink-2",
  clay: "bg-clay text-clay-ink hover:opacity-90",
  ghost: "text-ink-2 hover:bg-paper-2",
  outline: "border border-line-strong text-ink hover:bg-paper-2",
};
const btnSize = { sm: "h-8 px-3 text-xs", md: "h-10 px-4 text-sm" };

export function Button({ variant = "primary", size = "md", className, children, ...rest }: BtnProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(btnBase, btnVariant[variant], btnSize[size], className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({ href, variant = "primary", size = "md", className, children }: BtnProps & { href: string }) {
  return (
    <Link href={href} className={cn(btnBase, btnVariant[variant], btnSize[size], className)}>
      {children}
    </Link>
  );
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("card", className)}>{children}</div>;
}

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 border-b hairline pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
        <h1 className="display text-3xl text-ink sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Empty({ icon, title, children }: { icon?: React.ReactNode; title: string; children?: React.ReactNode }) {
  return (
    <div className="card flex flex-col items-center gap-2 px-6 py-14 text-center">
      {icon && <div className="mb-1 text-faint">{icon}</div>}
      <div className="display text-xl">{title}</div>
      {children && <div className="max-w-md text-sm text-muted">{children}</div>}
    </div>
  );
}

/** Horizontal meter, e.g. quality score or W. */
export function Meter({ value, max = 1, tone = "clay", className }: { value: number; max?: number; tone?: "clay" | "green" | "amber"; className?: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const color = tone === "green" ? "bg-evergreen" : tone === "amber" ? "bg-amber" : "bg-clay";
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-paper-2", className)} role="meter" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
      <div className={cn("h-full rounded-full transition-[width] duration-500", color)} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function statusTone(status: string): Tone {
  if (status === "completed" || status === "approved" || status === "done") return "green";
  if (status === "needs_input" || status === "blocked") return "amber";
  if (status === "failed" || status === "error" || status === "rejected") return "rose";
  if (status === "handed_off" || status === "running") return "sky";
  return "neutral";
}

export function verdictTone(v?: string): Tone {
  if (v === "Ready") return "green";
  if (v === "Ready with assumptions") return "sky";
  if (v === "Needs clarification") return "amber";
  if (v === "Blocked") return "rose";
  return "neutral";
}
