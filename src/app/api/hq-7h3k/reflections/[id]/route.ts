import { NextResponse } from "next/server";
import { currentUser } from "@/lib/admin/auth";
import { deleteReflection, setReflectionShown } from "@/lib/admin/reflections";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

/** Show on the card, or take it off. */
export async function PATCH(req: Request, { params }: Params) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (typeof body?.shown !== "boolean") return NextResponse.json({ error: "shown must be true or false" }, { status: 400 });
  const reflection = await setReflectionShown(id, body.shown);
  if (!reflection) return NextResponse.json({ error: "No such response" }, { status: 404 });
  return NextResponse.json({ ok: true, reflection });
}

export async function DELETE(_req: Request, { params }: Params) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const { id } = await params;
  await deleteReflection(id);
  return NextResponse.json({ ok: true });
}
