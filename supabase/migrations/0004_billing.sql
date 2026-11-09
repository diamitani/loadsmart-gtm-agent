-- Enably — per-user accounts, credits ledger, and BYOK (bring-your-own-key) storage.
-- Server-only tables: the Next.js server reaches them with the service-role key.
-- RLS is enabled with no policies, so anon/authenticated clients can never read them.

create table if not exists public.billing_accounts (
  id           text primary key,                 -- acct_<random>; also the user's recovery code
  workspace_id text not null default 'default',
  balance      integer not null default 0 check (balance >= 0),
  email        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.credit_ledger (
  id            bigint generated always as identity primary key,
  account_id    text not null references public.billing_accounts(id) on delete cascade,
  delta         integer not null,
  balance_after integer not null,
  reason        text not null,                   -- 'purchase' | 'ai_call' | 'refund' | 'free_grant' | 'admin'
  ref           text not null unique,            -- idempotency key, e.g. stripe:cs_... or call:<id>
  created_at    timestamptz not null default now()
);
create index if not exists credit_ledger_account_idx on public.credit_ledger (account_id, created_at desc);

create table if not exists public.byok_keys (
  account_id text primary key references public.billing_accounts(id) on delete cascade,
  provider   text not null check (provider in ('anthropic', 'openai', 'gateway')),
  ciphertext text not null,                      -- AES-256-GCM, key = BYOK_ENCRYPTION_KEY, AAD = account id
  iv         text not null,
  tag        text not null,
  last4      text not null,
  model      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.billing_accounts enable row level security;
alter table public.credit_ledger    enable row level security;
alter table public.byok_keys        enable row level security;

-- Grant credits once per ref. Returns the resulting balance and whether it was applied.
create or replace function public.enably_grant_credits(p_account text, p_amount integer, p_reason text, p_ref text)
returns table (balance integer, applied boolean)
language plpgsql
security definer
set search_path = ''
as $$
#variable_conflict use_column
declare
  v_balance integer;
begin
  if p_amount <= 0 then raise exception 'amount must be positive'; end if;
  insert into public.billing_accounts (id) values (p_account) on conflict (id) do nothing;
  -- lock the account row so concurrent grants/consumes serialise
  select a.balance into v_balance from public.billing_accounts a where a.id = p_account for update;
  if exists (select 1 from public.credit_ledger l where l.ref = p_ref) then
    return query select v_balance, false;
    return;
  end if;
  update public.billing_accounts a set balance = a.balance + p_amount, updated_at = now()
    where a.id = p_account returning a.balance into v_balance;
  insert into public.credit_ledger (account_id, delta, balance_after, reason, ref)
    values (p_account, p_amount, v_balance, p_reason, p_ref);
  return query select v_balance, true;
end;
$$;

-- Deduct credits if the balance covers them. Returns the new balance, or null when insufficient.
create or replace function public.enably_consume_credits(p_account text, p_amount integer, p_reason text, p_ref text)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_balance integer;
begin
  if p_amount <= 0 then raise exception 'amount must be positive'; end if;
  update public.billing_accounts a set balance = a.balance - p_amount, updated_at = now()
    where a.id = p_account and a.balance >= p_amount
    returning a.balance into v_balance;
  if v_balance is null then return null; end if;
  insert into public.credit_ledger (account_id, delta, balance_after, reason, ref)
    values (p_account, -p_amount, v_balance, p_reason, p_ref);
  return v_balance;
end;
$$;

revoke execute on function public.enably_grant_credits(text, integer, text, text) from public, anon, authenticated;
revoke execute on function public.enably_consume_credits(text, integer, text, text) from public, anon, authenticated;
grant execute on function public.enably_grant_credits(text, integer, text, text) to service_role;
grant execute on function public.enably_consume_credits(text, integer, text, text) to service_role;
