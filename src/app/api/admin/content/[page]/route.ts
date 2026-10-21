import { NextResponse } from "next/server";
import { currentUser } from "@/lib/admin/auth";
import { resetPageContent, savePageContent } from "@/lib/content/content";
import { pageSchema } from "@/lib/content/schema";
import type { PageKey } from "@/lib/content/defaults";

export const runtime = "nodejs";

type Params = { params: Promise<{ page: string }> };

export async function PUT(req: Request, { params }: Params) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const { page } = await params;
  if (!pageSchema(page)) return NextResponse.json({ error: "No such page" }, { status: 404 });
  try {
    const body = await req.json();
    await savePageContent(page as PageKey, body, user.email);
    return NextResponse.json({ ok: true, updatedAt: new Date().toISOString() });
  } catch (e) {
    console.error("[admin] content save failed", e);
    return NextResponse.json({ error: "Could not save" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const { page } = await params;
  if (!pageSchema(page)) return NextResponse.json({ error: "No such page" }, { status: 404 });
  await resetPageContent(page as PageKey);
  return NextResponse.json({ ok: true });
}
