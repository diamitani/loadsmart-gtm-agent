import Link from "next/link";
import { cn } from "@/lib/utils";

/** Loadsmart GTM Sovereign Agent Mark: Interconnected freight polygon in Loadsmart Blue (#1D4ED8). */
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-7 w-7", className)} aria-hidden fill="none">
      <rect width="32" height="32" rx="8" fill="#0F172A" />
      {/* Isometric freight node symbol */}
      <path
        d="M16 6L24 10.5V19.5L16 24L8 19.5V10.5L16 6Z"
        stroke="#1D4ED8"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M16 6V15M16 15L24 10.5M16 15L8 10.5M16 15V24"
        stroke="#38BDF8"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="15" r="2.2" fill="#F8FAFC" />
      <circle cx="16" cy="6" r="1.5" fill="#60A5FA" />
      <circle cx="24" cy="10.5" r="1.5" fill="#60A5FA" />
      <circle cx="24" cy="19.5" r="1.5" fill="#60A5FA" />
      <circle cx="16" cy="24" r="1.5" fill="#60A5FA" />
      <circle cx="8" cy="19.5" r="1.5" fill="#60A5FA" />
      <circle cx="8" cy="10.5" r="1.5" fill="#60A5FA" />
    </svg>
  );
}

export function Logo({ href = "/", className }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2.5", className)} aria-label="Loadsmart GTM Sovereign OS home">
      <Mark />
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-[1.25rem] tracking-tight text-ink font-sans">LOADSMART</span>
          <span className="rounded bg-blue-100 dark:bg-blue-900/60 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">GTM OS</span>
        </div>
        <span className="text-[10px] font-medium text-muted tracking-tight">Account-Based Selling COE</span>
      </div>
    </Link>
  );
}
