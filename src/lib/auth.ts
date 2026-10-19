import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { createHash, timingSafeEqual } from "node:crypto";

const cookieName = "nb_session";
const attempts = new Map<string, { count: number; until: number }>();
function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("SESSION_SECRET muss mindestens 32 Zeichen lang sein.");
  return new TextEncoder().encode(value);
}
export function checkPassword(given: string, ip: string) {
  const now = Date.now();
  const state = attempts.get(ip);
  if (state && state.until > now && state.count >= 5) return false;
  const expected = process.env.ADMIN_PASSWORD;
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(expected ?? "").digest();
  const valid = Boolean(expected && expected.length >= 12 && timingSafeEqual(a, b));
  if (valid) attempts.delete(ip);
  else attempts.set(ip, { count: (state?.until ?? 0) > now ? (state?.count ?? 0) + 1 : 1, until: now + 15 * 60_000 });
  return valid;
}
export async function startSession() {
  const token = await new SignJWT({ role: "admin" }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("12h").sign(secret());
  (await cookies()).set(cookieName, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 12 * 60 * 60 });
}
export async function endSession() { (await cookies()).delete(cookieName); }
export async function isAdmin() {
  try { const token = (await cookies()).get(cookieName)?.value; if (!token) return false; const { payload } = await jwtVerify(token, secret()); return payload.role === "admin"; } catch { return false; }
}
export async function requireAdmin() { if (!(await isAdmin())) redirect("/admin/login"); }
export async function requireAction() {
  await requireAdmin();
  const h = await headers();
  const origin = h.get("origin");
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!origin || !host || new URL(origin).host !== host) throw new Error("Ungültige Anfragequelle.");
}
export async function loginIp() { const h = await headers(); return (h.get("x-forwarded-for") ?? "local").split(",")[0].trim(); }
