import { AuthForm } from "@/components/auth/auth-form";
import { authMode, safeNext, supabasePublicConfig } from "@/lib/auth/config";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sign in" };

export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;
  return <AuthForm mode="signin" supabase={supabasePublicConfig()} next={safeNext(next)} error={error?.slice(0, 200)} dev={authMode() === "dev"} />;
}
