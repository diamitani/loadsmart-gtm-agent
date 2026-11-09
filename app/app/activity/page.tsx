import { getStore } from "@/lib/db";
import { summarizeActivities } from "@/lib/connectors/sdr-tools";
import { ActivityTracker } from "@/components/activity-tracker";
import { Card, PageHeader } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Activity" };

function startOf(period: "today" | "week" | "month") {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  if (period === "week") d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  if (period === "month") d.setDate(1);
  return d.toISOString();
}

export default async function ActivityPage() {
  const store = getStore();
  const month = await store.listActivities({ since: startOf("month"), limit: 5000 });
  const stats = (["today", "week", "month"] as const).map((p) => summarizeActivities(month.filter((a) => a.occurredAt >= startOf(p)), p));
  const suppressions = await store.listSuppressions();
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
      <PageHeader eyebrow="Sales enablement" title="Activity" description={<>Track calls, emails, LinkedIn touches, DMs and meetings. Log here, or just tell the Architect: <i>&ldquo;log 3 cold calls to Acme Corp&rdquo;</i>.</>} />
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.period} className="p-5">
            <div className="eyebrow">{s.period === "today" ? "Today" : `This ${s.period}`}</div>
            <div className="display mt-1 text-4xl">{s.total}</div>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
              {Object.entries(s.byType).map(([k, v]) => <span key={k}>{k} <b className="text-ink">{v}</b></span>)}
              {!s.total && <span>No activity yet</span>}
            </div>
          </Card>
        ))}
      </div>
      <ActivityTracker
        activities={month.slice(0, 200).map((a) => ({ id: a.id, type: a.type, account: a.account, contact: a.contact, count: a.count, stage: a.stage, notes: a.notes, occurredAt: a.occurredAt, crmRef: a.crmRef }))}
        suppressions={suppressions}
        topAccounts={stats[2].topAccounts}
      />
    </main>
  );
}
