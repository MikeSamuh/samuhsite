// Where a lead goes once /api/lead has accepted it.
//
// deliver() is the only export and the only thing route.ts knows about.
// Behind it are two sinks, each of which reports rather than throws:
//
//   notify()   the email Jake and Mike asked for. Every lead, every time
//   clarify()  the CRM upsert, src/lib/clarify.ts. Additive, and only when
//              a key and a workspace slug are set
//
// Neither stops the other. Spec: docs/sprint-intakes.md, "Delivery".

import { Resend } from "resend";
import { upsertLead } from "./clarify";
import type { Lead } from "./lead";

type SinkResult = "ok" | "failed" | "skipped";

/** Resend's shared sender. It only delivers to the account owner, which is
 *  enough for the build and not for launch. */
const RESEND_ONBOARDING_FROM = "SAMUH site <onboarding@resend.dev>";

const LABELS: Record<keyof Lead, string> = {
  flow: "Flow",
  name: "Name",
  email: "Email",
  phone: "Phone",
  organization: "Organization",
  role: "Role",
  stage: "Stage",
  reason: "Reason",
  teamSize: "Team size",
  tier: "Tier",
  message: "Message",
  change: "Hoping to change",
  answers: "Answers",
  source: "Source",
  medium: "Medium",
  campaign: "Campaign",
  page: "Page",
  submittedAt: "Submitted",
};

/** Unset means on in production and off in local dev, so a deploy that
 *  forgot the variable fails loudly and a laptop needs nothing set. */
function notifyEnabled(): boolean {
  const flag = process.env.LEAD_NOTIFY?.toLowerCase();
  if (flag === "off") return false;
  if (flag === "on") return true;
  return process.env.NODE_ENV === "production";
}

function oneLine(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function subject(lead: Lead): string {
  const parts = [lead.flow, lead.name, lead.organization]
    .filter((part): part is string => Boolean(part))
    .map(oneLine);
  return `New lead: ${parts.join(" · ")}`;
}

function body(lead: Lead): string {
  const lines: string[] = [];
  for (const key of Object.keys(LABELS) as (keyof Lead)[]) {
    const value = lead[key];
    if (value === undefined || value === "") continue;
    if (key === "answers") {
      lines.push(`${LABELS.answers}:`);
      for (const [factor, score] of Object.entries(lead.answers ?? {})) {
        lines.push(`  ${factor}: ${score}`);
      }
      continue;
    }
    lines.push(`${LABELS[key]}: ${value}`);
  }
  return lines.join("\n");
}

async function notify(lead: Lead): Promise<SinkResult> {
  if (!notifyEnabled()) return "skipped";
  // the intake's first post is the email alone; the CRM takes that, the
  // inbox waits for the whole thing
  if (lead.stage === "email") return "skipped";

  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_TO;
  if (!key || !to) {
    console.error("[lead] notify is on but RESEND_API_KEY or LEAD_NOTIFY_TO is missing");
    return "failed";
  }

  try {
    const cc = process.env.LEAD_NOTIFY_CC;
    const { error } = await new Resend(key).emails.send({
      from: process.env.RESEND_FROM || RESEND_ONBOARDING_FROM,
      to,
      ...(cc ? { cc } : {}),
      replyTo: lead.email,
      subject: subject(lead),
      text: body(lead),
    });
    if (error) {
      console.error("[lead] notify failed", error);
      return "failed";
    }
    return "ok";
  } catch (error) {
    console.error("[lead] notify threw", error);
    return "failed";
  }
}

async function clarify(lead: Lead): Promise<SinkResult> {
  return upsertLead(lead);
}

/** Send the lead to every configured sink. `delivered` is false only when a
 *  sink was configured and none accepted the lead, so it exists nowhere. */
export async function deliver(lead: Lead): Promise<{ delivered: boolean }> {
  const results = [await notify(lead), await clarify(lead)];
  const delivered =
    results.includes("ok") || results.every((result) => result === "skipped");
  return { delivered };
}
