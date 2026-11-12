import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { authMode, DEV_USER_EMAIL, DEV_USER_ID, isPublicPath, safeNext, supabasePublicConfig, USER_EMAIL_HEADER, USER_HEADER } from "@/lib/auth/config";

/**
 * Auth gate for /app/** and the API.
 *  1. Refreshes the Supabase session cookie and verifies the user (getClaims / getUser).
 *  2. Forwards the verified user id to the app in `x-enably-user` (any incoming copy is discarded).
 *  3. Unauthenticated: pages → /signin?next=…, APIs → 401. Public paths (landing, sign-in,
 *     auth callback, health, Stripe webhook, MCP, durable callbacks) authenticate themselves.
 *  4. No Supabase in a deployed environment → the app stays closed (/auth/not-configured, 503).
 *  5. ENABLY_ACCESS_CODE, if set, is an extra gate on top of sign-in.
 */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const headers = new Headers(req.headers);
  headers.delete(USER_HEADER);
  headers.delete(USER_EMAIL_HEADER);
  const isApi = pathname.startsWith("/api/");
  const publicPath = isPublicPath(pathname);
  const mode = authMode();

  if (mode === "unconfigured") {
    if (publicPath && !pathname.startsWith("/signin") && !pathname.startsWith("/signup")) return NextResponse.next({ request: { headers } });
    if (isApi) return NextResponse.json({ error: "Sign-in is not configured on this server." }, { status: 503 });
    if (pathname === "/auth/not-configured") return NextResponse.next({ request: { headers } });
    return NextResponse.redirect(new URL("/auth/not-configured", req.url));
  }

  // Server-to-server automations: POST /api/runs with the MCP bearer token (route re-checks it).
  const token = process.env.ENABLY_MCP_TOKEN;
  const operator = !!token && pathname === "/api/runs" && req.headers.get("authorization") === `Bearer ${token}`;

  let user: { id: string; email: string | null } | null = null;
  const cookieWrites: { name: string; value: string; options?: Record<string, unknown> }[] = [];
  if (mode === "dev") {
    user = { id: DEV_USER_ID, email: DEV_USER_EMAIL };
  } else {
    const cfg = supabasePublicConfig()!;
    const supabase = createServerClient(cfg.url, cfg.anonKey, {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (list) => {
          for (const c of list) {
            req.cookies.set(c.name, c.value);
            cookieWrites.push(c);
          }
        },
      },
    });
    try {
      const { data } = await supabase.auth.getClaims();
      const sub = data?.claims?.sub;
      if (sub) user = { id: String(sub), email: typeof data.claims.email === "string" ? data.claims.email : null };
    } catch {
      user = null;
    }
  }

  // Signed-in users skip the sign-in pages.
  if (user && (pathname === "/signin" || pathname === "/signup")) {
    return withCookies(NextResponse.redirect(new URL(safeNext(req.nextUrl.searchParams.get("next")), req.url)), cookieWrites);
  }

  if (!publicPath && !operator) {
    if (!user) {
      if (isApi) return withCookies(NextResponse.json({ error: "sign in required" }, { status: 401 }), cookieWrites);
      const url = req.nextUrl.clone();
      url.pathname = "/signin";
      url.search = "";
      url.searchParams.set("next", pathname + req.nextUrl.search);
      return withCookies(NextResponse.redirect(url), cookieWrites);
    }
    const code = process.env.ENABLY_ACCESS_CODE;
    if (code && req.cookies.get("enably_access")?.value !== code) {
      if (isApi) return withCookies(NextResponse.json({ error: "access code required" }, { status: 401 }), cookieWrites);
      const url = req.nextUrl.clone();
      url.pathname = "/access";
      url.search = "";
      url.searchParams.set("next", pathname);
      return withCookies(NextResponse.redirect(url), cookieWrites);
    }
  }

  if (user) {
    headers.set(USER_HEADER, user.id);
    if (user.email) headers.set(USER_EMAIL_HEADER, user.email);
  }
  // Rebuild the forwarded Cookie header so refreshed session cookies reach the app on this request.
  if (cookieWrites.length) headers.set("cookie", req.headers.get("cookie") ?? "");
  return withCookies(NextResponse.next({ request: { headers } }), cookieWrites);
}

function withCookies<T extends NextResponse>(res: T, writes: { name: string; value: string; options?: Record<string, unknown> }[]): T {
  for (const c of writes) res.cookies.set(c.name, c.value, c.options);
  return res;
}

export const config = { matcher: ["/app/:path*", "/api/:path*", "/signin", "/signup", "/auth/:path*", "/access"] };
