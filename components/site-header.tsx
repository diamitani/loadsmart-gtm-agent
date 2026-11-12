"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LoadsmartLogo } from "./loadsmart-logo";

const links = [
  { href: "/", label: "Home" },
  { href: "/presentation", label: "Presentation" },
  { href: "/demo", label: "Demo" },
  { href: "/demo/agent", label: "Agent Console" },
  { href: "/documents", label: "Documents" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-slate-200/70">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" aria-label="Home">
          <LoadsmartLogo className="h-7" />
        </Link>
        <nav className="flex items-center gap-1 text-[14px] font-medium">
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`px-3.5 py-2 rounded-full transition-colors ${
                  active ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

