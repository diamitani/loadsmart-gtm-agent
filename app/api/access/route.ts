import { cookies } from "next/headers";
import { env } from "@/lib/env";

/** Exchange the access code for an httpOnly cookie (simple gate until full auth is added). */
export async function POST(req: Request) {
  const { code } = (await req.json().catch(() => ({}))) as { code?: string };
  const expected = env().accessCode;
  if (!expected || code !== expected) return Response.json({ ok: false }, { status: 401 });
  (await cookies()).set("enably_access", expected, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return Response.json({ ok: true });
}
