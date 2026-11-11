import { NextResponse } from "next/server";
import { currentUser } from "@/lib/admin/auth";
import { deleteJob, saveJob } from "@/lib/admin/jobs";

export const runtime = "nodejs";

type Params = { params: Promise<{ slug: string }> };

/** Save. A changed slug moves the posting; the old key goes. */
export async function PUT(req: Request, { params }: Params) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const { slug } = await params;
  try {
    const job = await saveJob(await req.json(), user.email, slug);
    return NextResponse.json({ ok: true, job });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not save" }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const { slug } = await params;
  await deleteJob(slug);
  return NextResponse.json({ ok: true });
}
