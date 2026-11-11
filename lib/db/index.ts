import { readLocalStore, writeLocalStore } from "./local";
import { getSupabase } from "./supabase";
import { Pod, Account, Mailbox, PipelineStage } from "../types";

export async function getPods(): Promise<Pod[]> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase.from("gtm_pods").select("*");
    if (!error && data && data.length > 0) return data as Pod[];
  }
  return readLocalStore().pods;
}

export async function getAccounts(podId?: string): Promise<Account[]> {
  const supabase = getSupabase();
  if (supabase) {
    let query = supabase.from("gtm_accounts").select("*");
    if (podId && podId !== "all") {
      query = query.eq("pod_id", podId);
    }
    const { data, error } = await query;
    if (!error && data && data.length > 0) return data as Account[];
  }
  const allAccounts = readLocalStore().accounts;
  if (!podId || podId === "all") return allAccounts;
  return allAccounts.filter((a) => a.pod_id === podId);
}

export async function getMailboxes(podId?: string): Promise<Mailbox[]> {
  const allMailboxes = readLocalStore().mailboxes;
  if (!podId || podId === "all") return allMailboxes;
  return allMailboxes.filter((m) => m.pod_id === podId);
}

export async function getPipelineStages(): Promise<PipelineStage[]> {
  return readLocalStore().pipelineStages;
}

export async function updateAccountStage(accountId: string, newStage: Account["stage"], extra?: Partial<Account>): Promise<Account | null> {
  const store = readLocalStore();
  const index = store.accounts.findIndex((a) => a.id === accountId);
  if (index === -1) return null;

  store.accounts[index] = {
    ...store.accounts[index],
    stage: newStage,
    ...extra
  };

  writeLocalStore({ accounts: store.accounts });
  return store.accounts[index];
}

export async function addAccount(account: Account): Promise<Account> {
  const store = readLocalStore();
  store.accounts.unshift(account);
  writeLocalStore({ accounts: store.accounts });
  return account;
}
