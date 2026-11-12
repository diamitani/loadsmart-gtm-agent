import type { Metadata } from "next";
import { kit } from "@/lib/kit";
import { PlaybookDeck } from "@/components/playbook-deck";

export const metadata: Metadata = {
  title: "ABM Playbook · Loadsmart GTM Engineering",
  description:
    "Loadsmart AE/SDR ABM Sales Playbook presented as an interactive deck and structured reference tables for ICPs, user personas, signals, cadences, KPIs, and 90-day rollout.",
};

export default function PlaybookPage() {
  return <PlaybookDeck rawMarkdown={kit.playbook} />;
}