import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="grid min-h-[70dvh] place-items-center px-4 text-center">
      <div>
        <div className="eyebrow">404</div>
        <h1 className="display mt-2 text-3xl">That page isn&apos;t here.</h1>
        <ButtonLink href="/app" className="mt-6">Back to the Architect</ButtonLink>
      </div>
    </main>
  );
}
