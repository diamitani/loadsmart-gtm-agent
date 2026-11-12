"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LoadsmartLogo } from "./loadsmart-logo";

const links = [
  { href: "/", label: "Home" },
  { href: "/presentation", label: "Presentation" },
  { href: "/skills", label: "Skills" },
  { href: "/automations", label: "Automations" },
  { href: "/courses", label: "Courses" },
  { href: "/documents", label: "Documents" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const workspaceActive = pathname.startsWith("/demo");

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand */}
        <Link href="/" aria-label="Loadsmart GTM Home" className="shrink-0 whitespace-nowrap">
          <LoadsmartLogo className="h-7" />
        </Link>

        {/* Zone 2: Clean Single-Line Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-[14px] font-medium" aria-label="Primary">
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`relative py-2 whitespace-nowrap shrink-0 transition-colors ${
                  active
                    ? "text-slate-950 font-semibold"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                {l.label}
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-x-0 -bottom-[1px] h-[2px] bg-blue-600 rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/demo"
            aria-current={workspaceActive ? "page" : undefined}
            className={`hidden sm:inline-flex items-center justify-center rounded-lg px-4 py-2 text-[13.5px] font-semibold whitespace-nowrap shrink-0 transition-colors ${
              workspaceActive
                ? "bg-blue-600 text-white"
                : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            Agent Workspace
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            className="lg:hidden grid size-10 place-items-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="lg:hidden border-t border-slate-200 bg-white px-5 py-4 space-y-1"
        >
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors ${
                  active ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <Link
            href="/demo"
            onClick={() => setMobileOpen(false)}
            className="mt-2 block rounded-lg bg-slate-900 px-3 py-2.5 text-center text-[14px] font-semibold text-white hover:bg-slate-800"
          >
            Agent Workspace
          </Link>
        </nav>
      )}
    </header>
  );
}
