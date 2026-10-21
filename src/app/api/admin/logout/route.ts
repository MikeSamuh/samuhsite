import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/admin/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  await clearSessionCookie();
  return NextResponse.redirect(new URL("/admin/login", new URL(req.url).origin), { status: 303 });
}
