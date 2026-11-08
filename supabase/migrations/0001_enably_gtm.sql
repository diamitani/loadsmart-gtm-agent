-- Enably GTM Architect — core schema
-- Apply with: supabase db push   (or paste into the Supabase SQL editor)
--
-- The Next.js server talks to these tables with the service-role key and always
-- filters by workspace_id. RLS is enabled on every table so that, when you add
-- Supabase Auth for end users, the browser can only ever see rows for
-- workspaces the signed-in user belongs to.

create table if not exists public.workspaces (
  id          text primary key,
  name        text not null,
  created_at  timestamptz not null default now()
);

create table if not exists public.workspace_members (
  workspace_id text not null references public.workspaces(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  role         text not null default 'member' check (role in ('owner', 'admin', 'member', 'viewer')),
  created_at   timestamptz not null default now(),
  primary key (workspace_id, user_id)
);
create index if not exists workspace_members_user_idx on public.workspace_members (user_id);

-- Helper used by every RLS policy. SECURITY DEFINER avoids recursive RLS on workspace_members.
create or replace function public.is_workspace_member(ws text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.workspace_members m
    where m.workspace_id = ws and m.user_id = (select auth.uid())
  );
$$;

create table if not exists public.conversations (
  id           text primary key,
  workspace_id text not null references public.workspaces(id) on delete cascade,
  title        text not null,
  messages     jsonb not null default '[]'::jsonb,
  last_run_id  text,
  pending      jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists conversations_ws_updated_idx on public.conversations (workspace_id, updated_at desc);

create table if not exists public.runs (
  id              text primary key,
  workspace_id    text not null references public.workspaces(id) on delete cascade,
  conversation_id text references public.conversations(id) on delete set null,
  status          text not null check (status in ('running', 'needs_input', 'completed', 'failed', 'handed_off')),
  title           text not null,
  source          text not null,
  model           text not null,
  wholeness       numeric(3, 2),
  quality_score   integer,
  duration_ms     integer,
  record          jsonb not null, -- full run manifest (intake, intent, foundation, plan, truth, quality, stages)
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists runs_ws_created_idx on public.runs (workspace_id, created_at desc);
create index if not exists runs_conversation_idx on public.runs (conversation_id);

create table if not exists public.artifacts (
  id             text primary key,
  workspace_id   text not null references public.workspaces(id) on delete cascade,
  run_id         text references public.runs(id) on delete cascade,
  kind           text not null,
  artifact_group text not null check (artifact_group in ('asset', 'pop')),
  code           text,
  title          text not null,
  markdown       text not null,
  status         text not null default 'draft' check (status in ('draft', 'approved', 'rejected', 'archived')),
  version        integer not null default 1,
  provenance     jsonb not null,
  created_at     timestamptz not null default now()
);
create index if not exists artifacts_ws_created_idx on public.artifacts (workspace_id, created_at desc);
create index if not exists artifacts_run_idx on public.artifacts (run_id);

create table if not exists public.knowledge_docs (
  id           text primary key,
  workspace_id text not null references public.workspaces(id) on delete cascade,
  name         text not null,
  kind         text not null check (kind in ('file', 'text', 'url')),
  source       text,
  content      text not null,
  chars        integer not null,
  created_at   timestamptz not null default now()
);
create index if not exists knowledge_ws_created_idx on public.knowledge_docs (workspace_id, created_at desc);

create table if not exists public.eval_runs (
  id            text primary key,
  workspace_id  text not null references public.workspaces(id) on delete cascade,
  name          text not null,
  model         text not null,
  summary       jsonb not null,
  results       jsonb not null,
  langsmith_url text,
  created_at    timestamptz not null default now()
);
create index if not exists eval_runs_ws_created_idx on public.eval_runs (workspace_id, created_at desc);

create table if not exists public.audit_events (
  id           text primary key,
  workspace_id text not null references public.workspaces(id) on delete cascade,
  at           timestamptz not null default now(),
  actor        text not null,
  action       text not null,
  target       text,
  detail       jsonb
);
create index if not exists audit_ws_at_idx on public.audit_events (workspace_id, at desc);

-- Row-level security -------------------------------------------------------
alter table public.workspaces        enable row level security;
alter table public.workspace_members enable row level security;
alter table public.conversations     enable row level security;
alter table public.runs              enable row level security;
alter table public.artifacts         enable row level security;
alter table public.knowledge_docs    enable row level security;
alter table public.eval_runs         enable row level security;
alter table public.audit_events      enable row level security;

create policy "members read their workspaces" on public.workspaces
  for select to authenticated using (public.is_workspace_member(id));
create policy "members read memberships" on public.workspace_members
  for select to authenticated using (user_id = (select auth.uid()));

create policy "members read conversations" on public.conversations for select to authenticated using (public.is_workspace_member(workspace_id));
create policy "members read runs"          on public.runs          for select to authenticated using (public.is_workspace_member(workspace_id));
create policy "members read artifacts"     on public.artifacts     for select to authenticated using (public.is_workspace_member(workspace_id));
create policy "members read knowledge"     on public.knowledge_docs for select to authenticated using (public.is_workspace_member(workspace_id));
create policy "members read evals"         on public.eval_runs     for select to authenticated using (public.is_workspace_member(workspace_id));
create policy "members read audit"         on public.audit_events  for select to authenticated using (public.is_workspace_member(workspace_id));
-- Writes go through the server (service role). Add insert/update policies here
-- only when you let the browser write directly.

-- Default workspace used by ENABLY_WORKSPACE_ID=default
insert into public.workspaces (id, name) values ('default', 'Default workspace') on conflict (id) do nothing;
