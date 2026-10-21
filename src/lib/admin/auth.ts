// Magic-link sign in for the team. Server only.
//
//   1. POST /api/admin/login with an email. If it is on ADMIN_EMAILS, a
//      single-use token goes into the store for fifteen minutes and a link
//      carrying it is emailed through Resend. The response is the same
//      either way, so the form never says who is on the list
//   2. GET /api/admin/auth?token=... consumes the token and sets the session
//      cookie, signed in session.ts. middleware.ts checks that cookie on
//      every /admin and /api/admin request
//
// Local dev with no RESEND_API_KEY prints the link to the terminal and hands
// it back to the login page, so nothing needs sending to sign in.

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { Resend } from "resend";
import { store } from "./store";
import { SESSION_COOKIE, SESSION_DAYS, signSession, verifySession, type Session } from "./session";

const TOKEN_TTL = 15 * 60;
const RESEND_ONBOARDING_FROM = "SAMUH admin <onboarding@resend.dev>";

export function allowedEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(/[,\s]+/)
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowed(email: string): boolean {
  return allowedEmails().includes(email.trim().toLowerCase());
}

const hash = (token: string) => createHash("sha256").update(token).digest("hex");

export async function createMagicToken(email: string): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  await store().set(`auth:magic:${hash(token)}`, { email: email.toLowerCase() }, { ttl: TOKEN_TTL });
  return token;
}

/** One use. Returns the email the token was issued to, or null. */
export async function consumeMagicToken(token: string): Promise<string | null> {
  const key = `auth:magic:${hash(token)}`;
  const rec = await store().get<{ email: string }>(key);
  if (!rec) return null;
  await store().del(key);
  return rec.email;
}

export async function sendMagicLink(email: string, link: string): Promise<{ sent: boolean; devLink?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV === "production") {
      console.error("[admin] RESEND_API_KEY is missing, no sign-in email can go out");
      return { sent: false };
    }
    console.log(`\n[admin] sign-in link for ${email}:\n${link}\n`);
    return { sent: false, devLink: link };
  }
  const { error } = await new Resend(key).emails.send({
    from: process.env.RESEND_FROM || RESEND_ONBOARDING_FROM,
    to: email,
    subject: "Your SAMUH admin sign-in link",
    text: [
      "Here is your link to the SAMUH admin. It works once and expires in fifteen minutes.",
      "",
      link,
      "",
      "If you did not ask for this, ignore it. Nothing happens unless the link is opened.",
    ].join("\n"),
  });
  if (error) {
    console.error("[admin] sign-in email failed", error);
    return { sent: false };
  }
  return { sent: true };
}

export async function setSessionCookie(email: string): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, await signSession(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
}

/** The signed-in team member, for server components and route handlers.
 *  middleware.ts already turned strangers away; this is the belt to its
 *  braces, and also where a removed email stops working. */
export async function currentUser(): Promise<Session | null> {
  const jar = await cookies();
  const session = await verifySession(jar.get(SESSION_COOKIE)?.value);
  if (!session || !isAllowed(session.email)) return null;
  return session;
}
