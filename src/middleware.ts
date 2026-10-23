import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, adminOpen, verifySession } from "@/lib/admin/session";
import { ADMIN_API, ADMIN_BASE } from "@/lib/admin/paths";

// Every admin page and admin API route needs the session cookie, except
// the three that make one: the login page, the login post and the link
// handler. Pages bounce to the login; API calls get a 401.

const OPEN = [`${ADMIN_BASE}/login`, `${ADMIN_API}/login`, `${ADMIN_API}/auth`];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith(ADMIN_BASE) && !pathname.startsWith(ADMIN_API)) return NextResponse.next();
  if (OPEN.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return NextResponse.next();
  if (adminOpen()) return NextResponse.next();
  const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
  if (session) return NextResponse.next();
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  const login = req.nextUrl.clone();
  login.pathname = `${ADMIN_BASE}/login`;
  login.search = "";
  if (pathname !== ADMIN_BASE) login.searchParams.set("next", pathname);
  return NextResponse.redirect(login);
}

export const config = {
  // the matcher must be a literal: keep it in step with ADMIN_BASE and ADMIN_API in src/lib/admin/paths.ts
  matcher: ["/hq-7h3k/:path*", "/api/hq-7h3k/:path*"],
};
