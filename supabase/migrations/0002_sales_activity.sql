-- Enably — sales activity tracker + suppression list (SDR compliance)

create table if not exists public.activities (
  id           text primary key,
  workspace_id text not null references public.workspaces(id) on delete cascade,
  type         text not null check (type in ('call', 'email', 'linkedin', 'dm', 'meeting', 'post', 'sms', 'note')),
  account      text not null,
  contact      text,
  count        integer not null default 1 check (count > 0),
  stage        text check (stage in ('cold', 'follow_up', 'closing', 'other')),
  notes        text,
  occurred_at  timestamptz not null,
  created_at   timestamptz not null default now(),
  crm_ref      text
);
create index if not exists activities_ws_occurred_idx on public.activities (workspace_id, occurred_at desc);

create table if not exists public.suppressions (
  workspace_id text not null references public.workspaces(id) on delete cascade,
  value        text not null, -- lower-cased email or domain
  reason       text not null,
  created_at   timestamptz not null default now(),
  primary key (workspace_id, value)
);

alter table public.activities   enable row level security;
alter table public.suppressions enable row level security;
create policy "members read activities"   on public.activities   for select to authenticated using (public.is_workspace_member(workspace_id));
create policy "members read suppressions" on public.suppressions for select to authenticated using (public.is_workspace_member(workspace_id));

-- Analytics snapshots written by the SDR assistant's write_supabase_table tool (approval-gated)
create table if not exists public.lead_snapshots (
  id           bigint generated always as identity primary key,
  workspace_id text not null references public.workspaces(id) on delete cascade,
  payload      jsonb not null,
  captured_at  timestamptz not null default now()
);
create index if not exists lead_snapshots_ws_idx on public.lead_snapshots (workspace_id, captured_at desc);
alter table public.lead_snapshots enable row level security;
create policy "members read lead snapshots" on public.lead_snapshots for select to authenticated using (public.is_workspace_member(workspace_id));
