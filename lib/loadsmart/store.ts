import fs from "node:fs";
import path from "node:path";
import type { Pod, Account, Mailbox, PipelineStage } from "./types";
import { INITIAL_PODS, INITIAL_ACCOUNTS, INITIAL_MAILBOXES, PIPELINE_STAGES } from "./data";

interface LocalStoreData {
  pods: Pod[];
  accounts: Account[];
  mailboxes: Mailbox[];
  pipelineStages: PipelineStage[];
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "loadsmart-gtm.json");

function ensureDirectoryExists() {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch {
      // read-only env
    }
  }
}

export function readLocalStore(): LocalStoreData {
  try {
    ensureDirectoryExists();
    if (!fs.existsSync(DATA_FILE)) {
      const initial: LocalStoreData = {
        pods: INITIAL_PODS,
        accounts: INITIAL_ACCOUNTS,
        mailboxes: INITIAL_MAILBOXES,
        pipelineStages: PIPELINE_STAGES,
        updatedAt: new Date().toISOString()
      };
      try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), "utf-8");
      } catch {
        // ignore
      }
      return initial;
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    return {
      pods: INITIAL_PODS,
      accounts: INITIAL_ACCOUNTS,
      mailboxes: INITIAL_MAILBOXES,
      pipelineStages: PIPELINE_STAGES,
      updatedAt: new Date().toISOString()
    };
  }
}

export function writeLocalStore(data: Partial<LocalStoreData>): LocalStoreData {
  ensureDirectoryExists();
  const current = readLocalStore();
  const updated: LocalStoreData = {
    ...current,
    ...data,
    updatedAt: new Date().toISOString()
  };
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(updated, null, 2), "utf-8");
  } catch {
    // ignore
  }
  return updated;
}

export async function getPods(): Promise<Pod[]> {
  return readLocalStore().pods;
}

export async function getAccounts(podId?: string): Promise<Account[]> {
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

export async function updateAccountStage(
  accountId: string,
  newStage: Account["stage"],
  extra?: Partial<Account>
): Promise<Account | null> {
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
