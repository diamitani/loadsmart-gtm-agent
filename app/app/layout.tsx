import { Sidebar } from "@/components/sidebar";
import { getStore } from "@/lib/db";
import { modelLabel } from "@/lib/agent/models";
import { requestAiContext } from "@/lib/agent/ai-context";
import { currentUser } from "@/lib/auth/user";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const [ai, user] = await Promise.all([requestAiContext(), currentUser()]);
  const conversations = (await getStore().listConversations(30)).map((c) => ({ id: c.id, title: c.title }));
  return (
    <div className="min-h-dvh">
      <Sidebar user={user?.email ?? (user ? "Signed in" : null)} conversations={conversations} mode={ai.mode === "none" ? (ai.reason === "no_credits" ? "no_credits" : "demo") : ai.mode === "house" ? `${modelLabel(ai)} · ${ai.balance} credits` : modelLabel(ai)} />
      <div className="lg:pl-64">{children}</div>
    </div>
  );
}
