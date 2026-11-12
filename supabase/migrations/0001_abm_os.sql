-- Loadsmart ABM OS - v1.1 data layer (not wired in v0.1).
-- Holds pipeline runs, approvals and pod feedback so the dashboard and copilot can read live state.
-- Salesforce stays the system of record; these tables are the audit log and the approval queue.

create extension if not exists "pgcrypto";

create table public.pods (
  id text primary key,                       -- e.g. pod-1
  ae_name text, sdr_name text, territory text,
  created_at timestamptz not null default now()
);

create table public.pod_members (
  pod_id text not null references public.pods(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('ae','sdr','manager','revops','marketing')),
  primary key (pod_id, user_id)
);

create table public.pipeline_runs (
  id uuid primary key default gen_random_uuid(),
  step text not null,                        -- skill slug
  pod_id text references public.pods(id),
  status text not null check (status in ('dry_run','running','done','failed','waiting_approval')),
  records_in int, records_out int, records_parked int,
  summary text,
  idempotency_key text unique,               -- (step, pod, date) so retries never double-run
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

create table public.approvals (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references public.pipeline_runs(id) on delete cascade,
  pod_id text references public.pods(id),
  kind text not null check (kind in ('weekly_list','send_batch','crm_writeback','pause_sends')),
  payload jsonb not null,                    -- counts, sample drafts, schedule
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  decided_by uuid references auth.users(id),
  decided_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  pod_id text references public.pods(id),
  account_ref text,                          -- Salesforce Account Id
  contact_ref text,
  kind text not null check (kind in ('disqualify','bad_contact','email_rating','note')),
  reason_code text,                          -- templates/disqualification-reason-codes.csv
  note text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create index on public.pipeline_runs (pod_id, started_at desc);
create index on public.approvals (pod_id, status);
create index on public.feedback (pod_id, created_at desc);

-- Row Level Security: members see only their pod's rows.
alter table public.pods enable row level security;
alter table public.pod_members enable row level security;
alter table public.pipeline_runs enable row level security;
alter table public.approvals enable row level security;
alter table public.feedback enable row level security;

create policy "members read own pods" on public.pods for select
  using (exists (select 1 from public.pod_members m where m.pod_id = pods.id and m.user_id = auth.uid()));
create policy "members read own membership" on public.pod_members for select
  using (user_id = auth.uid());
create policy "members read pod runs" on public.pipeline_runs for select
  using (exists (select 1 from public.pod_members m where m.pod_id = pipeline_runs.pod_id and m.user_id = auth.uid()));
create policy "members read pod approvals" on public.approvals for select
  using (exists (select 1 from public.pod_members m where m.pod_id = approvals.pod_id and m.user_id = auth.uid()));
create policy "members decide pod approvals" on public.approvals for update
  using (exists (select 1 from public.pod_members m where m.pod_id = approvals.pod_id and m.user_id = auth.uid()));
create policy "members read pod feedback" on public.feedback for select
  using (exists (select 1 from public.pod_members m where m.pod_id = feedback.pod_id and m.user_id = auth.uid()));
create policy "members add pod feedback" on public.feedback for insert
  with check (created_by = auth.uid() and exists (select 1 from public.pod_members m where m.pod_id = feedback.pod_id and m.user_id = auth.uid()));
-- Writes to pipeline_runs and approvals inserts come from the server (service role), never the browser.
