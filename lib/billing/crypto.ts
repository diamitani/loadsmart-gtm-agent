import "server-only";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

/**
 * AES-256-GCM encryption for user-supplied (BYOK) provider keys.
 * BYOK_ENCRYPTION_KEY must be 32 random bytes, base64 or hex encoded:
 *   openssl rand -base64 32
 * The account id is bound as additional authenticated data, so a ciphertext
 * copied onto another account will not decrypt.
 */

export interface Sealed {
  ciphertext: string; // base64
  iv: string; // base64, 12 bytes
  tag: string; // base64, 16 bytes
}

export function parseKey(raw: string | undefined): Buffer | null {
  const v = (raw ?? "").trim();
  if (!v) return null;
  const buf = /^[0-9a-fA-F]{64}$/.test(v) ? Buffer.from(v, "hex") : Buffer.from(v, "base64");
  return buf.length === 32 ? buf : null;
}

export function encryptionKey(): Buffer | null {
  return parseKey(process.env.BYOK_ENCRYPTION_KEY);
}

export function seal(plaintext: string, aad: string, key: Buffer | null = encryptionKey()): Sealed {
  if (!key) throw new Error("BYOK_ENCRYPTION_KEY is missing or not 32 bytes");
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  cipher.setAAD(Buffer.from(aad, "utf8"));
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  return { ciphertext: ciphertext.toString("base64"), iv: iv.toString("base64"), tag: cipher.getAuthTag().toString("base64") };
}

export function open(s: Sealed, aad: string, key: Buffer | null = encryptionKey()): string {
  if (!key) throw new Error("BYOK_ENCRYPTION_KEY is missing or not 32 bytes");
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(s.iv, "base64"));
  decipher.setAAD(Buffer.from(aad, "utf8"));
  decipher.setAuthTag(Buffer.from(s.tag, "base64"));
  return Buffer.concat([decipher.update(Buffer.from(s.ciphertext, "base64")), decipher.final()]).toString("utf8");
}
