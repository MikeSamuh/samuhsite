import { NextResponse } from "next/server";
import { consumeMagicToken, isAllowed, setSessionCookie } from "@/lib/admin/auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") ?? "";
  const email = token ? await consumeMagicToken(token) : null;
  if (!email || !isAllowed(email)) {
    return NextResponse.redirect(new URL("/admin/login?error=expired", url.origin));
  }
  await setSessionCookie(email);
  const next = url.searchParams.get("next") ?? "";
  const to = /^\/admin(\/[\w\-/?=&%]*)?$/.test(next) ? next : "/admin";
  return NextResponse.redirect(new URL(to, url.origin));
}
