import { Logo } from "@/components/brand";

export const metadata = { title: "Sign-in not configured" };

export default function NotConfigured() {
  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <div className="card w-full max-w-md p-6">
        <Logo />
        <h1 className="display mt-6 text-2xl">Sign-in isn&apos;t configured yet</h1>
        <p className="mt-2 text-sm text-muted">
          This deployment has no Supabase project connected, so accounts can&apos;t be created and the app stays closed. The site owner needs to set{" "}
          <code className="font-mono text-xs">NEXT_PUBLIC_SUPABASE_URL</code>, <code className="font-mono text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> and{" "}
          <code className="font-mono text-xs">SUPABASE_SERVICE_ROLE_KEY</code> (see docs/DEPLOY.md) and redeploy.
        </p>
      </div>
    </main>
  );
}
