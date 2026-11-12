"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { LoadsmartLogo } from "./loadsmart-logo";
import { Download, ShieldCheck, Play, BookOpen, Layers } from "lucide-react";

export function HeaderNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || (pathname.includes("demo") ? "demo" : pathname.includes("document") ? "documents" : "presentation");

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-2.5 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Loadsmart Official Logo */}
        <Link href="/" className="hover:opacity-95 transition-opacity">
          <LoadsmartLogo className="h-8" />
        </Link>

        {/* The Three Tabs (Presentation, Demo, Documents) */}
        <nav className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <Link
            href="/?tab=presentation"
            className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              currentTab === "presentation"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Presentation</span>
          </Link>

          <Link
            href="/?tab=demo"
            className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              currentTab === "demo"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Play className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
            <span>Demo</span>
          </Link>

          <Link
            href="/?tab=documents"
            className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              currentTab === "documents"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>Documents</span>
          </Link>
        </nav>

        {/* Minimal Actions on the Right */}
        <div className="flex items-center gap-2">
          <a
            href="/loadsmart-abm-os.zip"
            download
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition-colors shadow-xs"
            title="Download complete Loadsmart ABM skill pack"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Kit (.zip)</span>
          </a>

          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>W = 1.00</span>
          </div>
        </div>
      </div>
    </header>
  );
}

