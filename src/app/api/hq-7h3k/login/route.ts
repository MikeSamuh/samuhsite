import { NextResponse } from "next/server";
import { createMagicToken, isAllowed, sendMagicLink } from "@/lib/admin/auth";
import { sessionSecret } from "@/lib/admin/session";
import { ADMIN_API, ADMIN_BASE } from "@/lib/admin/paths";

export const runtime = "nodejs";

/** The same answer whether or not the address is on the list. */
const REPLY = { ok: true, message: "If that address is on the team list, a sign-in link is on its way." };

export async function POST(req: Request) {
  let email = "";
  let next = "";
  try {
    const body = await req.json();
    email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    // where the link lands after sign in: an admin path only, never elsewhere
    const n = typeof body?.next === "string" ? body.next : "";
    next = n === ADMIN_BASE || (n.startsWith(`${ADMIN_BASE}/`) && /^[\w\-/?=&%]*$/.test(n.slice(ADMIN_BASE.length))) ? n : "";
  } catch {
    /* fall through */
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, message: "Enter your work email." }, { status: 400 });
  }
  if (!sessionSecret()) {
    return NextResponse.json({ ok: false, message: "Sign-in is not configured: ADMIN_SESSION_SECRET is missing." }, { status: 500 });
  }
  if (!isAllowed(email)) return NextResponse.json(REPLY);

  const token = await createMagicToken(email);
  const origin = process.env.ADMIN_ORIGIN || new URL(req.url).origin;
  const link = `${origin}${ADMIN_API}/auth?token=${token}${next ? `&next=${encodeURIComponent(next)}` : ""}`;
  const { sent, devLink } = await sendMagicLink(email, link);
  if (!sent && !devLink) {
    return NextResponse.json({ ok: false, message: "The sign-in email could not be sent. Check RESEND_API_KEY." }, { status: 500 });
  }
  return NextResponse.json({ ...REPLY, ...(devLink ? { devLink } : {}) });
}
