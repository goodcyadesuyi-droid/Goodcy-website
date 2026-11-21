import "server-only";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "mfx_deriv_demo";
function key() {
  const raw = process.env.MFX_DERIV_TOKEN_ENCRYPTION_KEY;
  if (!raw) throw new Error("MFX_DERIV_TOKEN_ENCRYPTION_KEY is not configured.");
  const value = Buffer.from(raw, "base64");
  if (value.length !== 32) throw new Error("MFX_DERIV_TOKEN_ENCRYPTION_KEY must be a base64-encoded 32-byte key.");
  return value;
}
export type DerivDemoSession = { userId: string; accessToken: string; accountId: string; currency?: string; expiresAt: number };
export function encryptSession(value: DerivDemoSession) {
  const iv = randomBytes(12), cipher = createCipheriv("aes-256-gcm", key(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString("base64url");
}
export function decryptSession(value: string): DerivDemoSession {
  const data = Buffer.from(value, "base64url");
  if (data.length < 29) throw new Error("Invalid encrypted Deriv session.");
  const decipher = createDecipheriv("aes-256-gcm", key(), data.subarray(0,12));
  decipher.setAuthTag(data.subarray(12,28));
  return JSON.parse(Buffer.concat([decipher.update(data.subarray(28)),decipher.final()]).toString("utf8")) as DerivDemoSession;
}
export async function saveDerivSession(session: DerivDemoSession) {
  const jar = await cookies();
  jar.set(COOKIE, encryptSession(session), { httpOnly:true, secure:process.env.NODE_ENV==="production", sameSite:"lax", path:"/", expires:new Date(session.expiresAt), priority:"high" });
}
export async function readDerivSession(userId: string) {
  const jar = await cookies(), raw = jar.get(COOKIE)?.value;
  if (!raw) return null;
  try { const session=decryptSession(raw); if(session.userId!==userId || session.expiresAt<=Date.now()) return null; return session; }
  catch { return null; }
}
export async function clearDerivSession() {
  const jar = await cookies(); jar.delete(COOKIE);
}
