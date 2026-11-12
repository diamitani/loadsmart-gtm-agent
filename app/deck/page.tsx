"use client";

import Link from "next/link";
import { LoadsmartLogo } from "@/components/loadsmart-logo";
import { PresentationView } from "@/components/presentation-view";
import { ArrowLeft, Download, ShieldCheck, Home } from "lucide-react";

export default function StandaloneDeckPage() {
  return (
    <div className="min-h-screen bg-slate-50/80 flex flex-col justify-between">
      {/* Presentation Top Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md px-6 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <LoadsmartLogo className="h-7" />
            </Link>
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <span className="text-xs font-bold text-slate-700 hidden sm:block">
              GTM Engineering Case Study Deck (7 Pillars)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/?tab=presentation"
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Back to App</span>
            </Link>

            <a
              href="/loadsmart-abm-os.zip"
              download
              className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Kit</span>
            </a>

            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>W = 1.00</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Deck Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8">
        <PresentationView fullscreenMode={true} />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-3 px-6 text-center text-xs text-slate-500">
        Loadsmart GTM AI Center of Excellence · Standalone Presentation Deck · Authored by Patrick Diamitani
      </footer>
    </div>
  );
}

