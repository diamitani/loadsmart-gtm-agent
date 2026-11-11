import fs from "fs";
import path from "path";
import { Pod, Account, Mailbox, PipelineStage } from "../types";
import { INITIAL_PODS, INITIAL_ACCOUNTS, INITIAL_MAILBOXES, PIPELINE_STAGES } from "../data/initial-pods";

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
    fs.mkdirSync(DATA_DIR, { recursive: true });
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
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.warn("Failed to read local store, returning initial fallback:", err);
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
  fs.writeFileSync(DATA_FILE, JSON.stringify(updated, null, 2), "utf-8");
  return updated;
}
