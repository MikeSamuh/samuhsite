import { NextResponse } from "next/server";
import { currentUser } from "@/lib/admin/auth";
import { resetCards, saveCards } from "@/lib/admin/cards";

export const runtime = "nodejs";

/** The whole list, in order: [{ id?, name, image }] */
export async function PUT(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  try {
    const body = await req.json();
    const items = await saveCards(body?.items, user.email);
    return NextResponse.json({ ok: true, items, updatedAt: new Date().toISOString() });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Could not save";
    console.error("[admin] cards save failed", e);
    return NextResponse.json({ error: msg }, { status: msg.startsWith("Card ") || msg === "A list of cards" ? 400 : 500 });
  }
}

export async function DELETE() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  await resetCards();
  return NextResponse.json({ ok: true });
}
