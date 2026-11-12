import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { 
  BarChart3, 
  Bot, 
  Workflow, 
  BookOpen, 
  Zap, 
  Settings, 
  ShieldCheck, 
  Layers,
  Cpu,
  Compass,
  Download
} from "lucide-react";

export const metadata: Metadata = {
  title: "Loadsmart GTM AI Center of Excellence | Pod Intelligence & Prospector",
  description: "Internal GTM AI Center of Excellence for Loadsmart AE & SDR pods. Powered by Vercel AI SDK, Prospect Automation Engine, Cloudflare, and n8n.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
        {/* Top Header */}
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-4 sm:px-6 py-2.5 shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-black text-white text-sm shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  LS
                </div>
                <div>
                  <div className="font-bold text-sm tracking-tight text-slate-900 flex items-center gap-2">
                    LOADSMART <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold">GTM AI COE</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">Pod Intelligence & Prospecting Center</div>
                </div>
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                href="/"
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                Overview
              </Link>
              <Link
                href="/dashboard"
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
              >
                <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                Pod Dashboard
              </Link>
              <Link
                href="/copilot"
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
              >
                <Bot className="w-3.5 h-3.5 text-indigo-600" />
                GTM Copilot
              </Link>
              <Link
                href="/pipeline"
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                10-Step Engine
              </Link>
              <Link
                href="/skills"
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
              >
                <Cpu className="w-3.5 h-3.5 text-cyan-600" />
                Skills Library
              </Link>
              <Link
                href="/playbook"
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                Playbook v2
              </Link>
              <Link
                href="/architecture"
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5 text-rose-600" />
                Architecture
              </Link>
              <Link
                href="/automations"
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
              >
                <Workflow className="w-3.5 h-3.5 text-purple-600" />
                n8n Hub
              </Link>
              <Link
                href="/settings"
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                Settings
              </Link>
            </nav>

            {/* Status & Quick Download */}
            <div className="flex items-center gap-2">
              <a
                href="/loadsmart-abm-os.zip"
                download
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition-colors"
                title="Download complete Loadsmart ABM skill pack for Claude.ai"
              >
                <Download className="w-3.5 h-3.5" />
                Download Skills (.zip)
              </a>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                4 Pods Active
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-200 py-6 px-4 sm:px-6 text-center text-xs text-slate-500 bg-white">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              Loadsmart GTM AI Center of Excellence · Built by Patrick Diamitani (Enably / SalesGency)
            </div>
            <div className="flex items-center gap-4 text-slate-600 font-medium">
              <span>ShipperGuide TMS</span>
              <span>•</span>
              <span>Opendock</span>
              <span>•</span>
              <span>Loadsmart AI</span>
              <span>•</span>
              <span>Freight Brokerage</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
