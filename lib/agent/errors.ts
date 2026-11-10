/** Turn provider/gateway failures into something the user can act on (never includes secrets). */
export function friendlyModelError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err ?? "");
  const status = (err as { statusCode?: number } | null)?.statusCode;
  if (/free tier users do not have access|restricted access|RestrictedModels/i.test(msg))
    return "The AI model isn't available on this workspace's free AI Gateway tier. The operator needs to add AI Gateway credits or switch ENABLY_MODEL to a free-tier model — or [add your own AI key](/app/billing) to keep going.";
  if (status === 401 || status === 403 || /unauthori[sz]ed|invalid api key|authentication/i.test(msg))
    return "The AI provider rejected the key. If you added your own key, check it in [Credits & keys](/app/billing); otherwise the operator's AI Gateway key/OIDC needs attention.";
  if (status === 429 || /rate limit|too many requests/i.test(msg)) return "The AI provider is rate-limiting requests right now — try again in a minute.";
  if (err instanceof Error && err.name === "InsufficientCreditsError") return err.message;
  return msg || "Something went wrong";
}
