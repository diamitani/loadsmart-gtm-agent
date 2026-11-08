"use client";
import { useState } from "react";
import { Logo } from "@/components/brand";
import { Button } from "@/components/ui";

export default function AccessPage() {
  const [code, setCode] = useState("");
  const [err, setErr] = useState(false);
  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <form
        className="card w-full max-w-sm p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          const res = await fetch("/api/access", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ code }) });
          if (res.ok) location.href = new URLSearchParams(location.search).get("next") || "/app";
          else setErr(true);
        }}
      >
        <Logo />
        <h1 className="display mt-6 text-2xl">Enter access code</h1>
        <p className="mt-1 text-sm text-muted">This workspace is private.</p>
        <input value={code} onChange={(e) => setCode(e.target.value)} type="password" autoFocus className="mt-4 w-full rounded-lg border hairline bg-paper px-3 py-2 text-sm outline-none focus:border-clay" aria-label="Access code" />
        {err && <p className="mt-2 text-xs text-rose">That code didn&apos;t work.</p>}
        <Button className="mt-4 w-full" type="submit">Continue</Button>
      </form>
    </main>
  );
}
