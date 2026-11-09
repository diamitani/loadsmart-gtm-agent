import { NextResponse, type NextRequest } from "next/server";

/**
 * Optional access gate. When ENABLY_ACCESS_CODE is set, the dashboard and API
 * require the access cookie. Durable-agent callbacks authenticate with their
 * own Bearer secret, so they are excluded. Replace with Supabase Auth when
 * you add multi-user workspaces (see docs/ROADMAP.md).
 */
export function proxy(req: NextRequest) {
  const code = process.env.ENABLY_ACCESS_CODE;
  if (!code) return NextResponse.next();
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/api/access") || pathname.startsWith("/api/health") || pathname.startsWith("/api/mcp") || /^\/api\/runs\/[^/]+\/(continue|approved|reminder)$/.test(pathname)) {
    return NextResponse.next();
  }
  if (req.cookies.get("enably_access")?.value === code) return NextResponse.next();
  if (pathname.startsWith("/api/")) return NextResponse.json({ error: "access code required" }, { status: 401 });
  const url = req.nextUrl.clone();
  url.pathname = "/access";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/app/:path*", "/api/:path*"] };
