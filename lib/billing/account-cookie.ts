/**
 * Signed account cookie. Runs in the proxy and on the server (Web Crypto only,
 * no Node APIs), so it can be shared by both.
 *
 * Cookie value: `<accountId>.<base64url HMAC-SHA256(accountId)>`. The account id
 * is 128 random bits, so it doubles as the user's recovery code.
 */

export const ACCOUNT_COOKIE = "enably_acct";
/** Header the proxy sets (after stripping any incoming copy) with the verified account id. */
export const ACCOUNT_HEADER = "x-enably-account";
export const ACCOUNT_ID_RE = /^acct_[A-Za-z0-9_-]{22}$/;

const enc = new TextEncoder();

function b64url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** The signing secret: ENABLY_SESSION_SECRET, else derived from BYOK_ENCRYPTION_KEY. Empty → accounts are off. */
export function sessionSecret(): string {
  const s = process.env.ENABLY_SESSION_SECRET || process.env.BYOK_ENCRYPTION_KEY || "";
  return s ? `enably-account-v1:${s}` : "";
}

async function hmac(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64url(new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(data))));
}

export function newAccountId(): string {
  return `acct_${b64url(crypto.getRandomValues(new Uint8Array(16)))}`;
}

export async function signAccount(id: string, secret = sessionSecret()): Promise<string> {
  if (!secret) throw new Error("ENABLY_SESSION_SECRET or BYOK_ENCRYPTION_KEY is required for accounts");
  return `${id}.${await hmac(secret, id)}`;
}

/** Returns the account id when the cookie value is well-formed and correctly signed. */
export async function verifyAccount(value: string | undefined | null, secret = sessionSecret()): Promise<string | null> {
  if (!value || !secret) return null;
  const dot = value.indexOf(".");
  if (dot < 0) return null;
  const id = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  if (!ACCOUNT_ID_RE.test(id)) return null;
  const expected = await hmac(secret, id);
  if (expected.length !== sig.length) return null;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0 ? id : null;
}

export const ACCOUNT_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
};
