import { createHmac, timingSafeEqual } from "crypto";

// No third-party auth provider anymore, so a verified phone number gets a
// small HMAC-signed token instead of a real session — same trust model as
// Supabase's JWT (the phone claim), just self-issued.
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export const isAuthConfigured = Boolean(process.env.AUTH_SECRET);

function sign(payload: string): string {
  return createHmac("sha256", process.env.AUTH_SECRET!).update(payload).digest("hex");
}

export function createSessionToken(phone: string): string {
  const payloadB64 = Buffer.from(`${phone}.${Date.now() + SESSION_TTL_MS}`).toString("base64url");
  return `${payloadB64}.${sign(payloadB64)}`;
}

export function verifySessionToken(token: string): string | null {
  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return null;

  const expectedSignature = sign(payloadB64);
  const expectedBuf = Buffer.from(expectedSignature);
  const actualBuf = Buffer.from(signature);
  if (expectedBuf.length !== actualBuf.length || !timingSafeEqual(expectedBuf, actualBuf)) return null;

  const [phone, expiresAtStr] = Buffer.from(payloadB64, "base64url").toString().split(".");
  if (!phone || Date.now() > Number(expiresAtStr)) return null;

  return phone;
}
