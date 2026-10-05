// The one door every lead capture form posts through.
// Spec: docs/sprint-intakes.md, "/api/lead".

import { NextResponse } from "next/server";
import { z } from "zod";
import type { Lead } from "@/lib/lead";
import { deliver } from "@/lib/lead-delivery";

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const short = z.string().trim().max(200);
const long = z.string().trim().max(5000);
/** an optional text field, where a form posting "" means not given */
const optional = (schema: z.ZodString) =>
  schema.optional().transform((value) => value || undefined);

const schema = z
  .object({
    flow: z.enum(["contact", "teaser", "talk"]),
    name: optional(short),
    email: z.email().max(200),
    phone: optional(short),
    organization: optional(short),
    message: optional(long),
    reason: z.enum(["general", "solutions", "partnership", "other"]).optional(),
    teamSize: z.enum(["1-10", "11-50", "51-200", "200+"]).optional(),
    change: optional(long),
    tier: z.enum(["self-guided", "supported", "guided"]).optional(),
    answers: z.record(z.string().max(60), z.number().finite()).optional(),
    source: optional(short),
    medium: optional(short),
    campaign: optional(short),
    company_website: z.string().optional(),
    turnstileToken: z.string().max(4096).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.flow !== "teaser" && !data.name) {
      ctx.addIssue({ code: "custom", path: ["name"], message: "Name is required" });
    }
  });

function pageFrom(request: Request): string {
  try {
    return new URL(request.headers.get("referer") ?? "").pathname;
  } catch {
    return "unknown";
  }
}

async function turnstilePasses(token: string | undefined, request: Request) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  try {
    const form = new URLSearchParams({ secret, response: token });
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    if (ip) form.set("remoteip", ip);
    const response = await fetch(TURNSTILE_VERIFY_URL, { method: "POST", body: form });
    const result: { success?: boolean } = await response.json();
    return result.success === true;
  } catch (error) {
    console.error("[lead] turnstile verification threw", error);
    return false;
  }
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: z.flattenError(parsed.error).fieldErrors },
      { status: 400 },
    );
  }

  const { company_website, turnstileToken, ...fields } = parsed.data;

  // A filled honeypot is a bot. It gets the same answer a person would, and
  // nothing is delivered.
  if (company_website) return NextResponse.json({ ok: true });

  if (!(await turnstilePasses(turnstileToken, request))) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const lead: Lead = {
    ...fields,
    page: pageFrom(request),
    submittedAt: new Date().toISOString(),
  };

  const { delivered } = await deliver(lead);
  if (!delivered) {
    // Every configured sink failed. This log line is the only copy.
    console.error("[lead] undelivered", JSON.stringify(lead));
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
