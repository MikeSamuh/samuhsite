// Scores one slider setting for the TeamQ teaser. The models stay on the
// server, so the page asks here on every change.
// Spec: docs/sprint-intakes.md, "Flow 2".

import { NextResponse } from "next/server";
import { z } from "zod";
import { FACTORS } from "@/components/teamq-teaser/model";
import { score } from "@/lib/teaser/score";

const schema = z.object({
  values: z.object(
    Object.fromEntries(
      FACTORS.map((factor) => [factor.id, z.number().min(factor.min).max(factor.max)]),
    ),
  ),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });

  return NextResponse.json({ ok: true, ...score(parsed.data.values) });
}
