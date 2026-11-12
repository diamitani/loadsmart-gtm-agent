import { NextResponse, type NextRequest } from "next/server";
import { DEV_USER_EMAIL, DEV_USER_ID, USER_EMAIL_HEADER, USER_HEADER } from "@/lib/auth/config";

/**
 * Public evaluation proxy: passes all requests through cleanly.
 * Injects default evaluator identity into headers so all downstream API routes
 * and agent handlers function with ZERO mandatory sign up.
 */
export async function proxy(req: NextRequest) {
  const headers = new Headers(req.headers);
  if (!headers.get(USER_HEADER)) {
    headers.set(USER_HEADER, DEV_USER_ID);
  }
  if (!headers.get(USER_EMAIL_HEADER)) {
    headers.set(USER_EMAIL_HEADER, DEV_USER_EMAIL);
  }
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ["/api/:path*"] };

