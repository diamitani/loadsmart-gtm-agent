"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Activity, BookOpen, Boxes, Coins, FlaskConical, Library, Menu, MessageSquarePlus, Settings, Workflow, X } from "lucide-react";
import { Logo } from "./brand";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/app", label: "Architect", icon: MessageSquarePlus, exact: true },
  { href: "/app/activity", label: "Activity", icon: Activity },
  { href: "/app/runs", label: "Runs", icon: Workflow },
  { href: "/app/library", label: "Library", icon: Library },
  { href: "/app/knowledge", label: "Knowledge", icon: BookOpen },
  { href: "/app/agents", label: "Agents & Skills", icon: Boxes },
  { href: "/app/evals", label: "Evals", icon: FlaskConical },
  { href: "/app/billing", label: "Credits & keys", icon: Coins },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ conversations, mode }: { conversations: { id: string; title: string }[]; mode: string }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string, exact?: boolean) => (exact ? path === href || path.startsWith("/app/c/") : path.startsWith(href));

  const body = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 pb-4 pt-5">
        <Logo href="/" />
        <ThemeToggle />
      </div>
      <div className="px-3">
        <Link href="/app" onClick={() => setOpen(false)} className="flex h-10 items-center justify-center gap-2 rounded-full bg-ink text-sm font-medium text-paper hover:bg-ink-2">
          <MessageSquarePlus className="h-4 w-4" /> New request
        </Link>
      </div>
      <nav className="mt-4 space-y-0.5 px-3" aria-label="Main">
        {NAV.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors", active(href, exact) ? "bg-surface font-medium text-ink shadow-soft" : "text-muted hover:bg-paper-2 hover:text-ink")}
          >
            <Icon className="h-4 w-4" /> {label}
          </Link>
        ))}
      </nav>
      <div className="mt-6 min-h-0 flex-1 overflow-y-auto px-3">
        <div className="eyebrow px-3 pb-2">Recent</div>
        {conversations.length === 0 && <p className="px-3 text-xs text-faint">Your conversations appear here.</p>}
        {conversations.map((c) => (
          <Link
            key={c.id}
            href={`/app/c/${c.id}`}
            onClick={() => setOpen(false)}
            className={cn("block truncate rounded-lg px-3 py-1.5 text-[13px]", path === `/app/c/${c.id}` ? "bg-paper-2 text-ink" : "text-muted hover:text-ink")}
          >
            {c.title}
          </Link>
        ))}
      </div>
      <div className="border-t hairline px-5 py-3 text-[11px] text-faint">
        <span className={cn("mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle", mode === "demo" || mode === "no_credits" ? "bg-amber" : "bg-evergreen")} />
        {mode === "demo" ? (
          <Link href="/app/billing" className="hover:text-ink">Demo mode · add your AI key</Link>
        ) : mode === "no_credits" ? (
          <Link href="/app/billing" className="hover:text-ink">Out of credits · buy or add a key</Link>
        ) : (
          `Model: ${mode}`
        )}
      </div>
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b hairline bg-paper/90 px-4 backdrop-blur lg:hidden">
        <Logo href="/" />
        <button onClick={() => setOpen(true)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-paper-2" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
      </header>
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r hairline bg-paper-2/60 lg:block">{body}</aside>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal>
          <div className="absolute inset-0 bg-ink/30" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-paper shadow-xl">
            <button onClick={() => setOpen(false)} className="absolute right-3 top-4 grid h-8 w-8 place-items-center rounded-full hover:bg-paper-2" aria-label="Close menu">
              <X className="h-4 w-4" />
            </button>
            {body}
          </aside>
        </div>
      )}
    </>
  );
}
