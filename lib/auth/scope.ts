import "server-only";
import { AsyncLocalStorage } from "node:async_hooks";
import { USER_HEADER } from "./config";

/**
 * Who data reads and writes belong to.
 *   user   → only rows owned by this auth user (conversations, runs, Library, Knowledge)
 *   system → trusted server paths with their own secret (MCP, durable callbacks, evals): unfiltered
 *   none   → a request with no signed-in user: sees nothing, can write nothing
 */
export type DataScope = { kind: "user"; userId: string } | { kind: "system" } | { kind: "none" };

const als = new AsyncLocalStorage<DataScope>();

export const withUserScope = <T>(userId: string, fn: () => T): T => als.run({ kind: "user", userId }, fn);
export const withSystemScope = <T>(fn: () => T): T => als.run({ kind: "system" }, fn);

export async function currentScope(): Promise<DataScope> {
  const s = als.getStore();
  if (s) return s;
  let h: Headers;
  try {
    const { headers } = await import("next/headers");
    h = await headers();
  } catch {
    return { kind: "system" }; // outside a request: scripts, evals, tests
  }
  const id = h.get(USER_HEADER);
  return id ? { kind: "user", userId: id } : { kind: "none" };
}

export class OwnershipError extends Error {
  constructor(message = "Not allowed") {
    super(message);
    this.name = "OwnershipError";
  }
}

/** The owner to stamp on a record being saved, enforcing that users only write their own rows. */
export function ownerFor(scope: DataScope, recordOwner: string | null | undefined, existingOwner?: string | null): string | null {
  if (scope.kind === "none") throw new OwnershipError("Sign in required");
  const owner = recordOwner ?? (scope.kind === "user" ? scope.userId : null) ?? existingOwner ?? null;
  if (scope.kind === "user") {
    if (owner !== scope.userId) throw new OwnershipError();
    if (existingOwner !== undefined && existingOwner !== scope.userId) throw new OwnershipError();
  }
  return owner;
}

/** Whether a row with this owner is visible in the scope. */
export function visible(scope: DataScope, owner: string | null | undefined): boolean {
  if (scope.kind === "system") return true;
  if (scope.kind === "none") return false;
  return owner === scope.userId;
}
