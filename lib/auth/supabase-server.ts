import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabasePublicConfig } from "./config";

/** Supabase client bound to the request cookies (route handlers / server actions). */
export async function supabaseServer() {
  const cfg = supabasePublicConfig();
  if (!cfg) return null;
  const jar = await cookies();
  return createServerClient(cfg.url, cfg.anonKey, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (list) => {
        try {
          for (const c of list) jar.set(c.name, c.value, c.options);
        } catch {
          /* called from a Server Component — the proxy refreshes the session instead */
        }
      },
    },
  });
}
