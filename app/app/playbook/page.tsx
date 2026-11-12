import type { Metadata } from "next";
import { kit } from "@/lib/kit";
import { PlaybookDeck } from "@/components/playbook-deck";

export const metadata: Metadata = {
  title: "ABM Playbook · Loadsmart Workspace",
};

export default function WorkspacePlaybookPage() {
  return <PlaybookDeck rawMarkdown={kit.playbook} />;
}