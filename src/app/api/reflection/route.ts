// The metaphor card's door. GET: what others said on a card, as the team
// has chosen to show it. POST: a visitor's own line, stored hidden until
// the team reads it in the admin. Anonymous: no email, no IP, no cookie.
// See docs/admin.md, "Responses".

import { NextResponse } from "next/server";
import { z } from "zod";
import { addReflection, shownReflections } from "@/lib/admin/reflections";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  card: z.string().trim().min(1).max(120),
  text: z.string().trim().min(2).max(600),
  /** honeypot: a bot fills it, a person never sees it */
  company_website: z.string().optional(),
});

export async function GET(request: Request) {
  const card = new URL(request.url).searchParams.get("card")?.trim();
  if (!card) return NextResponse.json({ responses: [] });
  const responses = await shownReflections(card);
  return NextResponse.json({ responses });
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });
  if (parsed.data.company_website) return NextResponse.json({ ok: true });
  try {
    await addReflection({ card: parsed.data.card, text: parsed.data.text, by: "visitor", shown: false });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[reflection] store failed", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
