"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/playbook", label: "Playbook" },
  { href: "/skills", label: "Skills" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/copilot", label: "Pod Copilot" },
  { href: "/architecture", label: "Architecture" },
];

export function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-card/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Loadsmart ABM OS home">
          <span className="grid place-items-center size-8 rounded-lg bg-ink text-white text-[13px] font-bold">AB</span>
          <span className="font-semibold tracking-tight text-[15px]">
            Loadsmart <span className="text-muted font-normal">ABM OS</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-1" aria-label="Main">
          {links.map((l) => {
            const active = path === l.href || path.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-2 rounded-lg text-[14px] transition-colors ${
                  active ? "bg-brand-soft text-brand font-medium" : "text-ink-2 hover:bg-paper hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <a
            href="/loadsmart-abm-os.zip"
            className="ml-2 px-3.5 py-2 rounded-lg bg-ink text-white text-[14px] font-medium hover:bg-ink-2 transition-colors"
          >
            Download kit
          </a>
        </nav>
        <button
          className="md:hidden px-3 py-2 rounded-lg border border-line text-[14px]"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          Menu
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" className="md:hidden border-t border-line bg-card px-5 py-3 flex flex-col gap-1" aria-label="Mobile">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg text-[15px] hover:bg-paper">
              {l.label}
            </Link>
          ))}
          <a href="/loadsmart-abm-os.zip" className="px-3 py-2 rounded-lg text-[15px] font-medium text-brand">Download kit</a>
        </nav>
      )}
    </header>
  );
}
