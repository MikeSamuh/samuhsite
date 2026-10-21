import { NextResponse } from "next/server";
import { consumeMagicToken, isAllowed, setSessionCookie } from "@/lib/admin/auth";
import { ADMIN_BASE } from "@/lib/admin/paths";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") ?? "";
  const email = token ? await consumeMagicToken(token) : null;
  if (!email || !isAllowed(email)) {
    return NextResponse.redirect(new URL(`${ADMIN_BASE}/login?error=expired`, url.origin));
  }
  await setSessionCookie(email);
  const next = url.searchParams.get("next") ?? "";
  const to = next === ADMIN_BASE || (next.startsWith(`${ADMIN_BASE}/`) && /^[\w\-/?=&%]*$/.test(next.slice(ADMIN_BASE.length))) ? next : ADMIN_BASE;
  return NextResponse.redirect(new URL(to, url.origin));
}
