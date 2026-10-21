import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/admin/auth";
import { ADMIN_BASE } from "@/lib/admin/paths";

export const runtime = "nodejs";

export async function POST(req: Request) {
  await clearSessionCookie();
  return NextResponse.redirect(new URL(`${ADMIN_BASE}/login`, new URL(req.url).origin), { status: 303 });
}
