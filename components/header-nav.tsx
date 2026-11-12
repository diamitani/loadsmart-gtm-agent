"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { LoadsmartLogo } from "./loadsmart-logo";
import { Download, ShieldCheck, Play, BookOpen, Layers, Sparkles, ExternalLink, ArrowRight } from "lucide-react";

export function HeaderNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  
  const isMarketingHome = pathname === "/home";
  const isDeckPage = pathname === "/deck";
  const currentTab = tabParam || (pathname.includes("demo") ? "demo" : pathname.includes("document") ? "documents" : pathname.includes("presentation") ? "presentation" : isMarketingHome ? "home" : "presentation");

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl px-4 sm:px-6 py-2.5 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Loadsmart Official Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="hover:opacity-90 transition-opacity flex items-center gap-2">
            <LoadsmartLogo className="h-7 sm:h-8" />
          </Link>
          <span className="hidden lg:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200/80 text-sky-800 text-[10px] font-bold uppercase tracking-wider">
            GTM COE
          </span>
        </div>

        {/* Saasbright Frosted Center Segmented Navigation */}
        <nav className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-full border border-slate-200/80 text-xs font-semibold shadow-2xs">
          <Link
            href="/home"
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              isMarketingHome
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            <span>Overview</span>
          </Link>

          <Link
            href="/?tab=presentation"
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              !isMarketingHome && currentTab === "presentation"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Presentation</span>
          </Link>

          <Link
            href="/?tab=demo"
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              !isMarketingHome && currentTab === "demo"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            <Play className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
            <span>Demo</span>
          </Link>

          <Link
            href="/?tab=documents"
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              !isMarketingHome && currentTab === "documents"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>Documents</span>
          </Link>

          <Link
            href="/deck"
            className={`hidden md:flex px-3.5 py-1.5 rounded-full transition-all items-center gap-1.5 ${
              isDeckPage
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Deck</span>
          </Link>
        </nav>

        {/* Minimal Actions on the Right */}
        <div className="flex items-center gap-2">
          {isMarketingHome ? (
            <Link
              href="/?tab=demo"
              className="px-4 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Launch App</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          ) : (
            <a
              href="/loadsmart-abm-os.zip"
              download
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200/80 text-xs font-semibold transition-colors shadow-2xs"
              title="Download complete Loadsmart ABM skill pack"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Kit</span>
            </a>
          )}

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>W = 1.00</span>
          </div>
        </div>
      </div>
    </header>
  );
}
