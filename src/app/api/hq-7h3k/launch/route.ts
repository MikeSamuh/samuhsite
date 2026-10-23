import { NextResponse } from "next/server";
import { currentUser } from "@/lib/admin/auth";
import { addLaunchItem, getLaunchState, removeLaunchItem, setLaunchItem, type Owner } from "@/lib/admin/launch";

export const runtime = "nodejs";

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  return NextResponse.json(await getLaunchState());
}

/** one item: { id, done?, note? } */
export async function PATCH(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  try {
    const body = (await req.json()) as { id?: string; done?: boolean; note?: string };
    if (!body.id) return NextResponse.json({ error: "Which item?" }, { status: 400 });
    const state = await setLaunchItem(body.id, { done: body.done, note: body.note }, user.email);
    return NextResponse.json(state);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Could not save";
    console.error("[admin] launch save failed", e);
    return NextResponse.json({ error: msg }, { status: msg === "No such item" ? 404 : 500 });
  }
}

/** a new item of the team's own: { group, title, detail?, owner } */
export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  try {
    const body = (await req.json()) as { group?: string; title?: string; detail?: string; owner?: Owner };
    const state = await addLaunchItem({ group: body.group ?? "", title: body.title ?? "", detail: body.detail, owner: body.owner ?? "SAMUH" }, user.email);
    return NextResponse.json(state);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Could not save";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

/** remove an item the team added: ?id= */
export async function DELETE(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id || !id.startsWith("custom-")) return NextResponse.json({ error: "Only items added here can be removed" }, { status: 400 });
  return NextResponse.json(await removeLaunchItem(id));
}
