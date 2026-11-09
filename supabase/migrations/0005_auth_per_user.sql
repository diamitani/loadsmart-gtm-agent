-- Enably — Supabase Auth: per-user ownership of conversations, runs, artifacts and knowledge.
--
-- The Next.js server still uses the service-role key and filters every query by
-- user_id itself (see lib/db/supabase.ts). These policies are defence in depth so
-- that a browser holding a user's session (anon key + JWT) can only ever read its
-- own rows. Writes stay server-only (no insert/update/delete policies).
--
-- Rows created before this migration have user_id = null and are hidden from every
-- signed-in user. To hand them to one account, run (replace the email):
--   update public.conversations  set user_id = (select id from auth.users where email = 'you@example.com') where user_id is null;
--   update public.runs           set user_id = (select id from auth.users where email = 'you@example.com') where user_id is null;
--   update public.artifacts      set user_id = (select id from auth.users where email = 'you@example.com') where user_id is null;
--   update public.knowledge_docs set user_id = (select id from auth.users where email = 'you@example.com') where user_id is null;
--
-- Billing: billing_accounts.id is now the Supabase auth user id (as text). Accounts
-- created with the old acct_<random> recovery codes are no longer reachable from the app.

alter table public.conversations  add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.runs           add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.artifacts      add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.knowledge_docs add column if not exists user_id uuid references auth.users(id) on delete cascade;

create index if not exists conversations_user_updated_idx on public.conversations  (user_id, updated_at desc);
create index if not exists runs_user_created_idx          on public.runs           (user_id, created_at desc);
create index if not exists artifacts_user_created_idx     on public.artifacts      (user_id, created_at desc);
create index if not exists knowledge_user_created_idx     on public.knowledge_docs (user_id, created_at desc);

-- Replace the workspace-wide read policies with owner-only ones.
drop policy if exists "members read conversations" on public.conversations;
drop policy if exists "members read runs"          on public.runs;
drop policy if exists "members read artifacts"     on public.artifacts;
drop policy if exists "members read knowledge"     on public.knowledge_docs;

drop policy if exists "owners read conversations" on public.conversations;
drop policy if exists "owners read runs"          on public.runs;
drop policy if exists "owners read artifacts"     on public.artifacts;
drop policy if exists "owners read knowledge"     on public.knowledge_docs;

create policy "owners read conversations" on public.conversations  for select to authenticated using (user_id = (select auth.uid()));
create policy "owners read runs"          on public.runs           for select to authenticated using (user_id = (select auth.uid()));
create policy "owners read artifacts"     on public.artifacts      for select to authenticated using (user_id = (select auth.uid()));
create policy "owners read knowledge"     on public.knowledge_docs for select to authenticated using (user_id = (select auth.uid()));
