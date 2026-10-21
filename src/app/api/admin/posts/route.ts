import { NextResponse } from "next/server";
import { currentUser } from "@/lib/admin/auth";
import { getStoredPost, savePost } from "@/lib/admin/posts";

export const runtime = "nodejs";

/** Create. The slug comes from the title unless one is given. */
export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  try {
    const body = await req.json();
    const slug = typeof body?.slug === "string" && body.slug ? body.slug : undefined;
    if (slug && (await getStoredPost(slug))) {
      return NextResponse.json({ error: "A post with that slug already exists" }, { status: 409 });
    }
    const post = await savePost(body, user.email);
    return NextResponse.json({ ok: true, post });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not save" }, { status: 400 });
  }
}
