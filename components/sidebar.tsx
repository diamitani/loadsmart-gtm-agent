"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Activity,
  BookOpen,
  Boxes,
  Coins,
  FlaskConical,
  Layers,
  Library,
  Menu,
  MessageSquarePlus,
  Settings,
  Workflow,
  X,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "./brand";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/app", label: "Pod Copilot", icon: MessageSquarePlus, exact: true },
  { href: "/app/pipeline", label: "Daily ABM Pipeline", icon: Workflow },
  { href: "/app/dashboard", label: "Pod Dashboard & COE", icon: Activity },
  { href: "/app/products", label: "Products & Personas", icon: Truck },
  { href: "/app/playbook", label: "Sales Playbook v2", icon: BookOpen },
  { href: "/app/agents", label: "11 Skills & Zips", icon: Layers },
  { href: "/app/knowledge", label: "Knowledge & Claims", icon: Library },
  { href: "/app/runs", label: "Runs & History", icon: FlaskConical },
  { href: "/app/billing", label: "Model Keys & BYOK", icon: Coins },
  { href: "/app/settings", label: "Settings & RevOps", icon: Settings },
];

export function Sidebar({ conversations, mode, user = null }: { conversations: { id: string; title: string }[]; mode: string; user?: string | null }) {
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
        <Link href="/app" onClick={() => setOpen(false)} className="flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">
          <MessageSquarePlus className="h-4 w-4" /> New Pod Request
        </Link>
      </div>

      <div className="mt-3 px-3">
        <div className="rounded-lg border border-blue-100 dark:border-blue-900/40 bg-blue-50/60 dark:bg-blue-950/30 p-2 text-xs">
          <div className="flex items-center justify-between font-semibold text-blue-900 dark:text-blue-300">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-blue-600" /> Active Pods</span>
            <span className="rounded bg-blue-200/80 dark:bg-blue-800 px-1.5 py-0.2 text-[10px]">4 Pods</span>
          </div>
          <p className="mt-1 text-[11px] text-blue-700/80 dark:text-blue-400">Opendock · ShipperGuide · Loadsmart AI · Freight</p>
        </div>
      </div>

      <nav className="mt-4 space-y-0.5 px-3 flex-1 overflow-y-auto" aria-label="Main">
        <div className="eyebrow px-3 pb-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">GTM Operations</div>
        {NAV.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors", active(href, exact) ? "bg-blue-50 dark:bg-blue-950/60 font-semibold text-blue-700 dark:text-blue-400 shadow-xs" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100")}
          >
            <Icon className="h-4 w-4 shrink-0" /> <span className="truncate">{label}</span>
          </Link>
        ))}

        <div className="eyebrow px-3 pt-4 pb-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">Recent Copilot Threads</div>
        {conversations.length === 0 && <p className="px-3 text-xs text-slate-400">No active threads.</p>}
        {conversations.map((c) => (
          <Link
            key={c.id}
            href={`/app/c/${c.id}`}
            onClick={() => setOpen(false)}
            className={cn("block truncate rounded-lg px-3 py-1.5 text-[12.5px]", path === `/app/c/${c.id}` ? "bg-slate-200/60 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200")}
          >
            {c.title}
          </Link>
        ))}
      </nav>

      {user && (
        <form action="/auth/signout" method="post" className="flex items-center justify-between gap-2 border-t hairline px-5 py-2.5 text-[11px] text-muted">
          <span className="truncate" title={user}>{user}</span>
          <button type="submit" className="shrink-0 hover:text-ink">Sign out</button>
        </form>
      )}
      <div className="border-t hairline px-5 py-3 text-[11px] text-faint">
        <span className={cn("mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle", mode === "demo" || mode === "no_credits" ? "bg-amber" : "bg-evergreen")} />
        {mode === "demo" ? (
          <Link href="/app/billing" className="hover:text-ink">Demo mode · add your AI key</Link>
        ) : mode === "no_credits" ? (
          <Link href="/app/billing" className="hover:text-ink">Out of credits · add an API key</Link>
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
