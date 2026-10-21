import { NextResponse } from "next/server";
import { currentUser } from "@/lib/admin/auth";
import { deletePost, savePost } from "@/lib/admin/posts";

export const runtime = "nodejs";

type Params = { params: Promise<{ slug: string }> };

/** Save. A changed slug moves the post; the old key goes. */
export async function PUT(req: Request, { params }: Params) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const { slug } = await params;
  try {
    const post = await savePost(await req.json(), user.email, slug);
    return NextResponse.json({ ok: true, post });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not save" }, { status: 400 });
  }
}

/** Delete the stored copy. A post that came from a file falls back to the file. */
export async function DELETE(_req: Request, { params }: Params) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const { slug } = await params;
  await deletePost(slug);
  return NextResponse.json({ ok: true });
}
