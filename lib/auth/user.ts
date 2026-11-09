import "server-only";
import { headers } from "next/headers";
import { authMode, USER_EMAIL_HEADER, USER_HEADER } from "./config";

export interface SessionUser {
  id: string;
  email: string | null;
}

/** The signed-in user, as verified by proxy.ts (which strips any client-supplied copy of these headers). */
export async function currentUser(): Promise<SessionUser | null> {
  if (authMode() === "unconfigured") return null;
  const h = await headers();
  const id = h.get(USER_HEADER);
  return id ? { id, email: h.get(USER_EMAIL_HEADER) } : null;
}
