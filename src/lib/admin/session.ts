// The admin session: a signed cookie. This file is edge-safe (jose only, no
// node built-ins) because middleware.ts reads it too.

import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "samuh_admin";
export const SESSION_DAYS = 30;

/** The dev fallback keeps a laptop working with no env set. Production
 *  without ADMIN_SESSION_SECRET refuses to sign in rather than guess. */
const DEV_SECRET = "samuh-admin-dev-secret-not-for-production";

export function sessionSecret(): Uint8Array | null {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (s && s.length >= 16) return new TextEncoder().encode(s);
  if (process.env.NODE_ENV !== "production") return new TextEncoder().encode(DEV_SECRET);
  return null;
}

export interface Session {
  email: string;
}

/** The admin is open, no sign-in, while the site is in development:
 *  Wilfred's call on 23 October 2026, so the team can look around while
 *  the sign-in email only reaches Mike (Resend delivers to one address
 *  until samuh.work is verified) and nobody has Vercel access to set an
 *  env switch. A constant in code for that reason. Flip it to false
 *  before launch: it is on the Launch tab's list. */
export const ADMIN_OPEN = true;

export function adminOpen(): boolean {
  return ADMIN_OPEN;
}

/** Who an open admin acts as. */
export const OPEN_USER: Session = { email: "open-access@samuh.work" };

export async function signSession(email: string): Promise<string> {
  const secret = sessionSecret();
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set");
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secret);
}

export async function verifySession(token: string | undefined): Promise<Session | null> {
  if (!token) return null;
  const secret = sessionSecret();
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    return typeof payload.email === "string" ? { email: payload.email } : null;
  } catch {
    return null;
  }
}
