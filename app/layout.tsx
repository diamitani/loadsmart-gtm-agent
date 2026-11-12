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
  Compass
} from "lucide-react";

export const metadata: Metadata = {
  title: "Loadsmart GTM Agent OS | ABM Pod Intelligence & Automation",
  description: "Live GTM Agent Operating System for Loadsmart hybrid AE/SDR pods. Powered by Vercel AI SDK, Prospect Automation Engine, Cloudflare, and n8n.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-[#0b0f19] text-[#f9fafb]">
        {/* Top Header */}
        <header className="sticky top-0 z-50 border-b border-[#1f2937] bg-[#0b0f19]/90 backdrop-blur-md px-4 sm:px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-base shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  LS
                </div>
                <div>
                  <div className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
                    LOADSMART <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">GTM OS</span>
                  </div>
                  <div className="text-[11px] text-gray-400">Pod Intelligence & Prospector</div>
                </div>
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                href="/"
                className="px-2.5 py-1.5 text-xs font-medium rounded-md text-gray-300 hover:text-white hover:bg-gray-800/60 transition-colors flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-gray-400" />
                Overview
              </Link>
              <Link
                href="/dashboard"
                className="px-2.5 py-1.5 text-xs font-medium rounded-md text-gray-300 hover:text-white hover:bg-gray-800/60 transition-colors flex items-center gap-1.5"
              >
                <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
                Pod Dashboard
              </Link>
              <Link
                href="/copilot"
                className="px-2.5 py-1.5 text-xs font-medium rounded-md text-gray-300 hover:text-white hover:bg-gray-800/60 transition-colors flex items-center gap-1.5"
              >
                <Bot className="w-3.5 h-3.5 text-indigo-400" />
                GTM Copilot
              </Link>
              <Link
                href="/pipeline"
                className="px-2.5 py-1.5 text-xs font-medium rounded-md text-gray-300 hover:text-white hover:bg-gray-800/60 transition-colors flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                10-Step Engine
              </Link>
              <Link
                href="/skills"
                className="px-2.5 py-1.5 text-xs font-medium rounded-md text-gray-300 hover:text-white hover:bg-gray-800/60 transition-colors flex items-center gap-1.5"
              >
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                Skill Pack
              </Link>
              <Link
                href="/playbook"
                className="px-2.5 py-1.5 text-xs font-medium rounded-md text-gray-300 hover:text-white hover:bg-gray-800/60 transition-colors flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                Playbook v2
              </Link>
              <Link
                href="/architecture"
                className="px-2.5 py-1.5 text-xs font-medium rounded-md text-gray-300 hover:text-white hover:bg-gray-800/60 transition-colors flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5 text-rose-400" />
                Architecture
              </Link>
              <Link
                href="/automations"
                className="px-2.5 py-1.5 text-xs font-medium rounded-md text-gray-300 hover:text-white hover:bg-gray-800/60 transition-colors flex items-center gap-1.5"
              >
                <Workflow className="w-3.5 h-3.5 text-purple-400" />
                n8n Workflows
              </Link>
              <Link
                href="/settings"
                className="px-2.5 py-1.5 text-xs font-medium rounded-md text-gray-300 hover:text-white hover:bg-gray-800/60 transition-colors flex items-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5 text-gray-400" />
                Settings
              </Link>
            </nav>

            {/* Status Indicator */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <ShieldCheck className="w-3.5 h-3.5" />
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
        <footer className="border-t border-[#1f2937] py-6 px-4 sm:px-6 text-center text-xs text-gray-500 bg-[#070a11]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              Loadsmart GTM Sovereign Agent OS · Built by Patrick Diamitani (Enably / SalesGency)
            </div>
            <div className="flex items-center gap-4 text-gray-400">
              <span>ShipperGuide</span>
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
