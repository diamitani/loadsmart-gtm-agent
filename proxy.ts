import { NextResponse, type NextRequest } from "next/server";
import { ACCOUNT_COOKIE, ACCOUNT_COOKIE_OPTIONS, ACCOUNT_HEADER, newAccountId, sessionSecret, signAccount, verifyAccount } from "@/lib/billing/account-cookie";

/**
 * 1. Optional access gate. When ENABLY_ACCESS_CODE is set, the dashboard and API
 *    require the access cookie. Durable-agent callbacks, the MCP endpoint and the
 *    Stripe webhook authenticate with their own secrets, so they are excluded.
 * 2. Per-browser account (credits + BYOK). Verifies the signed `enably_acct`
 *    cookie or issues a new one, and forwards the verified id to the app in the
 *    `x-enably-account` header (any incoming copy of that header is discarded).
 */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/api/billing/webhook") return NextResponse.next();

  const code = process.env.ENABLY_ACCESS_CODE;
  if (code) {
    const open = pathname.startsWith("/api/access") || pathname.startsWith("/api/health") || pathname.startsWith("/api/mcp") || /^\/api\/runs\/[^/]+\/(continue|approved|reminder)$/.test(pathname);
    if (!open && req.cookies.get("enably_access")?.value !== code) {
      if (pathname.startsWith("/api/")) return NextResponse.json({ error: "access code required" }, { status: 401 });
      const url = req.nextUrl.clone();
      url.pathname = "/access";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  const headers = new Headers(req.headers);
  headers.delete(ACCOUNT_HEADER);
  if (!sessionSecret()) return NextResponse.next({ request: { headers } });

  let id = await verifyAccount(req.cookies.get(ACCOUNT_COOKIE)?.value);
  let issue = false;
  if (!id) {
    id = newAccountId();
    issue = true;
  }
  headers.set(ACCOUNT_HEADER, id);
  const res = NextResponse.next({ request: { headers } });
  if (issue) res.cookies.set(ACCOUNT_COOKIE, await signAccount(id), ACCOUNT_COOKIE_OPTIONS);
  return res;
}

export const config = { matcher: ["/app/:path*", "/api/:path*"] };
