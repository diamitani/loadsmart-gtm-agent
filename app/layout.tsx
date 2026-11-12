import type { Metadata, Viewport } from "next";
import { Inter, Newsreader, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITE_DESCRIPTION as DESCRIPTION, SITE_URL } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader", display: "swap", style: ["normal", "italic"] });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-jb", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Loadsmart Live GTM Sovereign Agent OS", template: "%s · Loadsmart GTM OS" },
  description: DESCRIPTION,
  applicationName: "Loadsmart GTM OS",
  authors: [{ name: "Loadsmart Revenue Operations & Enablement", url: "https://loadsmart.com" }],
  publisher: "Loadsmart Inc.",
  keywords: ["Loadsmart", "GTM OS", "Opendock", "ShipperGuide", "Loadsmart AI", "Freight", "Logistics", "ABM Pods"],
  openGraph: {
    type: "website",
    siteName: "Loadsmart Live GTM Sovereign Agent OS",
    url: SITE_URL,
    title: "Loadsmart Live GTM Sovereign Agent OS",
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: "Loadsmart Live GTM Sovereign Agent OS", description: DESCRIPTION },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('loadsmart-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-dvh bg-paper text-ink">{children}</body>
    </html>
  );
}
