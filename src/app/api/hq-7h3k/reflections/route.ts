import { NextResponse } from "next/server";
import { z } from "zod";
import { currentUser } from "@/lib/admin/auth";
import { addReflection } from "@/lib/admin/reflections";

export const runtime = "nodejs";

const schema = z.object({
  card: z.string().trim().min(1).max(120),
  text: z.string().trim().min(2).max(600),
});

/** The team writes a response of its own. It goes straight onto the card. */
export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "A card and a line or two" }, { status: 400 });
  const reflection = await addReflection({ ...parsed.data, by: "team", shown: true });
  return NextResponse.json({ ok: true, reflection });
}
