import Link from "next/link";
import { cn } from "@/lib/utils";

/** Enably mark: three ascending bars resolving into an arrow — 0 → 1 → 100. */
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-7 w-7", className)} aria-hidden>
      <rect width="32" height="32" rx="9" fill="var(--ink)" />
      <rect x="7.5" y="17" width="4" height="7.5" rx="1.5" fill="var(--paper)" opacity="0.55" />
      <rect x="14" y="12.5" width="4" height="12" rx="1.5" fill="var(--paper)" opacity="0.8" />
      <path d="M20.5 24.5V10.2l-2.2 2.2M20.5 10.2l2.2 2.2" stroke="var(--clay)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function Logo({ href = "/", className }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2.5", className)} aria-label="Enably home">
      <Mark />
      <span className="display text-[1.35rem] leading-none text-ink">Enably</span>
    </Link>
  );
}
