import "server-only";
import fs from "node:fs";
import path from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { ByokProvider } from "./config";
import type { Sealed } from "./crypto";

/**
 * Billing storage: accounts, the credit ledger, and encrypted BYOK keys.
 * Supabase when configured (supabase/migrations/0004_billing.sql), otherwise a
 * local store (memory + .data/billing.json outside serverless).
 *
 * Every balance change goes through grant()/consume(), which are atomic and
 * idempotent on `ref` — a Stripe session id can only ever grant once.
 */

export interface LedgerEntry {
  id: string;
  accountId: string;
  delta: number;
  balanceAfter: number;
  reason: string;
  ref: string;
  createdAt: string;
}

export interface StoredKey extends Sealed {
  accountId: string;
  provider: ByokProvider;
  last4: string;
  model?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BillingStore {
  readonly driver: "local" | "supabase";
  ensureAccount(id: string, email?: string | null): Promise<{ created: boolean }>;
  accountExists(id: string): Promise<boolean>;
  balance(id: string): Promise<number>;
  /** Adds credits once per ref. Returns the balance and whether this call applied it. */
  grant(id: string, amount: number, reason: string, ref: string): Promise<{ balance: number; applied: boolean }>;
  /** Atomically deducts credits if the balance covers them. Returns the new balance, or null if insufficient. */
  consume(id: string, amount: number, reason: string, ref: string): Promise<number | null>;
  ledger(id: string, limit?: number): Promise<LedgerEntry[]>;
  getKey(id: string): Promise<StoredKey | null>;
  putKey(k: StoredKey): Promise<void>;
  deleteKey(id: string): Promise<void>;
}

// ── local ───────────────────────────────────────────────────────────────────
interface LocalData {
  accounts: Record<string, { balance: number; createdAt: string }>;
  ledger: LedgerEntry[];
  refs: Record<string, true>;
  keys: Record<string, StoredKey>;
}
const g = globalThis as unknown as { __enablyBilling?: LocalData };
const FILE = path.join(process.cwd(), ".data", "billing.json");
const canPersist = () => !process.env.VERCEL && !process.env.ENABLY_EPHEMERAL;

function load(): LocalData {
  if (g.__enablyBilling) return g.__enablyBilling;
  let d: LocalData = { accounts: {}, ledger: [], refs: {}, keys: {} };
  if (canPersist() && fs.existsSync(FILE)) {
    try {
      d = { ...d, ...JSON.parse(fs.readFileSync(FILE, "utf8")) };
    } catch {
      /* start fresh */
    }
  }
  g.__enablyBilling = d;
  return d;
}
function persist() {
  if (!canPersist()) return;
  try {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(load()), { mode: 0o600 });
  } catch {
    /* read-only fs — memory only */
  }
}

export function createLocalBillingStore(): BillingStore {
  const now = () => new Date().toISOString();
  const entry = (accountId: string, delta: number, balanceAfter: number, reason: string, ref: string): LedgerEntry => ({ id: `led_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`, accountId, delta, balanceAfter, reason, ref, createdAt: now() });
  return {
    driver: "local",
    async ensureAccount(id) {
      const d = load();
      if (d.accounts[id]) return { created: false };
      d.accounts[id] = { balance: 0, createdAt: now() };
      persist();
      return { created: true };
    },
    async accountExists(id) {
      return !!load().accounts[id];
    },
    async balance(id) {
      return load().accounts[id]?.balance ?? 0;
    },
    async grant(id, amount, reason, ref) {
      const d = load();
      await this.ensureAccount(id);
      if (d.refs[ref]) return { balance: d.accounts[id].balance, applied: false };
      d.refs[ref] = true;
      d.accounts[id].balance += amount;
      d.ledger.unshift(entry(id, amount, d.accounts[id].balance, reason, ref));
      persist();
      return { balance: d.accounts[id].balance, applied: true };
    },
    async consume(id, amount, reason, ref) {
      const d = load();
      const a = d.accounts[id];
      if (!a || a.balance < amount) return null;
      a.balance -= amount;
      d.refs[ref] = true;
      d.ledger.unshift(entry(id, -amount, a.balance, reason, ref));
      d.ledger = d.ledger.slice(0, 20000);
      persist();
      return a.balance;
    },
    async ledger(id, limit = 50) {
      return load().ledger.filter((l) => l.accountId === id).slice(0, limit);
    },
    async getKey(id) {
      return load().keys[id] ?? null;
    },
    async putKey(k) {
      await this.ensureAccount(k.accountId);
      load().keys[k.accountId] = k;
      persist();
    },
    async deleteKey(id) {
      delete load().keys[id];
      persist();
    },
  };
}

// ── supabase ────────────────────────────────────────────────────────────────
export function createSupabaseBillingStore(url: string, serviceKey: string, workspaceId: string): BillingStore {
  const db: SupabaseClient = createClient(url, serviceKey, { auth: { persistSession: false } });
  const must = <T>(res: { data: T; error: { message: string } | null }): T => {
    if (res.error) throw new Error(`Supabase billing: ${res.error.message}`);
    return res.data;
  };
  return {
    driver: "supabase",
    async ensureAccount(id, email) {
      const rows = must(await db.from("billing_accounts").upsert({ id, workspace_id: workspaceId, email: email ?? null }, { onConflict: "id", ignoreDuplicates: true }).select("id"));
      return { created: Array.isArray(rows) && rows.length > 0 };
    },
    async accountExists(id) {
      const row = must(await db.from("billing_accounts").select("id").eq("id", id).maybeSingle());
      return !!row;
    },
    async balance(id) {
      const row = must(await db.from("billing_accounts").select("balance").eq("id", id).maybeSingle());
      return (row as { balance: number } | null)?.balance ?? 0;
    },
    async grant(id, amount, reason, ref) {
      await this.ensureAccount(id);
      const rows = must(await db.rpc("enably_grant_credits", { p_account: id, p_amount: amount, p_reason: reason, p_ref: ref })) as { balance: number; applied: boolean }[];
      const r = rows?.[0] ?? { balance: await this.balance(id), applied: false };
      return { balance: r.balance, applied: r.applied };
    },
    async consume(id, amount, reason, ref) {
      const v = must(await db.rpc("enably_consume_credits", { p_account: id, p_amount: amount, p_reason: reason, p_ref: ref })) as number | null;
      return typeof v === "number" ? v : null;
    },
    async ledger(id, limit = 50) {
      const rows = must(await db.from("credit_ledger").select("*").eq("account_id", id).order("created_at", { ascending: false }).limit(limit)) as Record<string, unknown>[];
      return (rows ?? []).map((r) => ({ id: String(r.id), accountId: r.account_id as string, delta: r.delta as number, balanceAfter: r.balance_after as number, reason: r.reason as string, ref: r.ref as string, createdAt: r.created_at as string }));
    },
    async getKey(id) {
      const r = must(await db.from("byok_keys").select("*").eq("account_id", id).maybeSingle()) as Record<string, string> | null;
      if (!r) return null;
      return { accountId: r.account_id, provider: r.provider as ByokProvider, ciphertext: r.ciphertext, iv: r.iv, tag: r.tag, last4: r.last4, model: r.model, createdAt: r.created_at, updatedAt: r.updated_at };
    },
    async putKey(k) {
      await this.ensureAccount(k.accountId);
      must(await db.from("byok_keys").upsert({ account_id: k.accountId, provider: k.provider, ciphertext: k.ciphertext, iv: k.iv, tag: k.tag, last4: k.last4, model: k.model ?? null, created_at: k.createdAt, updated_at: k.updatedAt }));
    },
    async deleteKey(id) {
      must(await db.from("byok_keys").delete().eq("account_id", id));
    },
  };
}

let store: BillingStore | null = null;
export function getBillingStore(): BillingStore {
  if (store) return store;
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  store = url && key ? createSupabaseBillingStore(url, key, process.env.ENABLY_WORKSPACE_ID || "default") : createLocalBillingStore();
  return store;
}
