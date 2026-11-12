import { kit, skillMeta } from "@/lib/kit";
import { AgentConsoleView } from "./agent-console-view";

export const metadata = {
  title: "Sovereign Agent Console · Loadsmart GTM OS",
  description:
    "Live, interactive sovereign agent workspace for Loadsmart. Zero sign up required. 34 autonomous skills, grounded playbook tools, and verified claims library.",
};

export default function DemoAgentPage() {
  const skills = kit.skills.map((s) => ({
    slug: s.slug,
    name: s.name,
    description: s.description,
    body: s.body,
    category: (s.slug.startsWith("la-") || s.slug === "loadsmart-abm-orchestrator" ? "loadsmart" : "sovereign") as "loadsmart" | "sovereign",
    step: skillMeta[s.slug]?.step ?? (s.slug.startsWith("la-") ? "ABM Pod" : "Engineering"),
    when: skillMeta[s.slug]?.when ?? "On demand / scheduled",
  }));


  return <AgentConsoleView skills={skills} totalDocs={kit.documents?.length ?? 34} />;
}
