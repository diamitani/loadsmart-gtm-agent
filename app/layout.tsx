import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

const displayFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const bodyFont = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Loadsmart GTM Engineering · Patrick Diamitani",
  description:
    "Loadsmart GTM Operating System: 6-step prospect n8n automation, team skills marketplace, Loadsmart Claude Code & GTM academy, unified agent workspace, and full documentation.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}>
      <body className="min-h-screen flex flex-col bg-white text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-200/70">
          <div className="mx-auto max-w-6xl px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[13px] text-slate-500">
            <span>Prepared for Loadsmart by Patrick Diamitani</span>
            <span>Loadsmart GTM AI Center of Excellence</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
