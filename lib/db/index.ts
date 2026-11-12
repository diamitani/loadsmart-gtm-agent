import "server-only";
import type { Store } from "./types";
import { createLocalStore } from "./local";
import { createSupabaseStore } from "./supabase";
import { env } from "@/lib/env";

let store: Store | null = null;

/** Returns the configured store: Supabase when keys are present, otherwise the zero-setup local store. */
export function getStore(): Store {
  if (store) return store;
  const e = env();
  store =
    e.supabaseUrl && e.supabaseServiceKey
      ? createSupabaseStore(e.supabaseUrl, e.supabaseServiceKey, e.workspaceId)
      : createLocalStore(e.workspaceId);
  return store;
}

export * from "./pod-store";
export type * from "./types";

