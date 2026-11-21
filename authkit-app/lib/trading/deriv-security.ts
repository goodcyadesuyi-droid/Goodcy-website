import "server-only";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

function key() {
  const raw = process.env.MFX_DERIV_TOKEN_ENCRYPTION_KEY;
  if (!raw) throw new Error("MFX_DERIV_TOKEN_ENCRYPTION_KEY is not configured.");
  const decoded = Buffer.from(raw, "base64");
  if (decoded.length !== 32) throw new Error("MFX_DERIV_TOKEN_ENCRYPTION_KEY must be a base64-encoded 32-byte key.");
  return decoded;
}
export function encryptDerivValue(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return [iv.toString("base64url"), cipher.getAuthTag().toString("base64url"), ciphertext.toString("base64url")].join(".");
}
export function decryptDerivValue(value: string) {
  const [iv, tag, ciphertext] = value.split(".");
  if (!iv || !tag || !ciphertext) throw new Error("Invalid encrypted Deriv value.");
  const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(iv, "base64url"));
  decipher.setAuthTag(Buffer.from(tag, "base64url"));
  return Buffer.concat([decipher.update(Buffer.from(ciphertext, "base64url")), decipher.final()]).toString("utf8");
}
export function pkceChallenge(verifier: string) {
  return createHash("sha256").update(verifier).digest("base64url");
}
export function randomOAuthValue(bytes = 32) {
  return randomBytes(bytes).toString("base64url");
}
export const DERIV_REDIRECT_URI = "https://mambafxacademy.com/api/deriv/oauth/callback";
export const DERIV_APP_ID = process.env.DERIV_CLIENT_ID || "351H6KkG4TTezdP4S5Xvt";
