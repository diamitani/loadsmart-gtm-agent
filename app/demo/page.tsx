import type { Metadata } from "next";
import { kit } from "@/lib/kit";
import { AgentWorkspace } from "@/components/agent-workspace";

export const metadata: Metadata = {
  title: "Agent Workspace · Loadsmart GTM Operating System",
  description:
    "Unified Pod Copilot console, 6-step prospect pipeline walkthrough, and Calibrated Truth guardrails grounded in Loadsmart playbooks and skills.",
};

export default function DemoWorkspacePage() {
  return (
    <AgentWorkspace
      skillCount={kit.skills.length}
      docCount={kit.documents?.length ?? 39}
    />
  );
}
