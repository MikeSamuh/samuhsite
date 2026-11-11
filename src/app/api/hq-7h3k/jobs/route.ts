import { NextResponse } from "next/server";
import { currentUser } from "@/lib/admin/auth";
import { getJob, saveJob } from "@/lib/admin/jobs";
import { slugify } from "@/lib/admin/posts";

export const runtime = "nodejs";

/** Create. The slug comes from the title unless one is given. */
export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  try {
    const body = await req.json();
    const slug = slugify(String(body?.slug || body?.title || ""));
    if (slug && (await getJob(slug))) {
      return NextResponse.json({ error: "A posting with that address already exists" }, { status: 409 });
    }
    const job = await saveJob(body, user.email);
    return NextResponse.json({ ok: true, job });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not save" }, { status: 400 });
  }
}
