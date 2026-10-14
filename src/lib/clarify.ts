// The Clarify sink: one lead becomes a person in the CRM, linked to a
// company, with the rest of what the form said as a note on the person.
//
// Built from Clarify's OpenAPI spec (https://api.clarify.ai/swagger-json,
// read 13 Oct 2026) and docs/crm-integration.md, "Option A". Three calls:
//
//   1. upsert the company on the email's domain, when it is a work domain
//   2. upsert the person on the email, with name, job title and company
//   3. a comment on the person carrying flow, message, answers, source,
//      page and time, so nothing the visitor typed is lost even though
//      the workspace has no custom fields for them yet
//
// Upserts use `match_on`, so the same address never makes a second person
// and the teaser's two posts (the email alone, then everything) land on
// one record. The API key and the workspace slug are server only.
//
// Server only. Import from lead-delivery.ts, nowhere else.

import { PERSONAL_DOMAINS, type Lead } from "./lead";

const BASE = "https://api.clarify.ai/v1/workspaces";
const TIMEOUT_MS = 8000;

export type ClarifyResult = "ok" | "failed" | "skipped";

interface Config {
  key: string;
  slug: string;
}

function config(): Config | "skipped" | "failed" {
  const key = process.env.CLARIFY_API_KEY;
  if (!key) return "skipped";
  const slug = process.env.CLARIFY_WORKSPACE;
  if (!slug) {
    console.error("[lead] CLARIFY_API_KEY is set but CLARIFY_WORKSPACE (the workspace slug) is missing");
    return "failed";
  }
  return { key, slug };
}

async function call(cfg: Config, path: string, body: unknown): Promise<{ ok: boolean; status: number; json: unknown }> {
  const response = await fetch(`${BASE}/${encodeURIComponent(cfg.slug)}${path}`, {
    method: "POST",
    headers: {
      authorization: `api-key ${cfg.key}`,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  let json: unknown = null;
  try {
    json = await response.json();
  } catch {
    json = null;
  }
  return { ok: response.ok, status: response.status, json };
}

/** the id of a created or matched record, or undefined */
function recordId(json: unknown): string | undefined {
  const data = (json as { data?: { id?: unknown } } | null)?.data;
  return typeof data?.id === "string" ? data.id : undefined;
}

/** "acme-corp.co.uk" offers "Acme Corp" when the form gave no company */
function nameFromDomain(domain: string): string {
  return domain
    .split(".")[0]
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

/** one BlockNote paragraph per line, the shape the comments endpoint takes */
function paragraphs(lines: string[]) {
  return lines.map((text, index) => ({
    id: String(index + 1),
    type: "paragraph",
    children: [],
    content: [{ type: "text", text, styles: {} }],
  }));
}

/** what the note on the person says: everything the form knew that has no
 *  field of its own */
function noteLines(lead: Lead): string[] {
  const lines = [`Website lead: ${lead.flow}${lead.stage ? `, ${lead.stage}` : ""}. Page ${lead.page}, ${lead.submittedAt}.`];
  if (lead.phone) lines.push(`Phone: ${lead.phone}`);
  if (lead.reason) lines.push(`Reason: ${lead.reason}`);
  if (lead.teamSize) lines.push(`Team size: ${lead.teamSize}`);
  if (lead.tier) lines.push(`Tier: ${lead.tier}`);
  if (lead.change) lines.push(`Hoping to change: ${lead.change}`);
  if (lead.message) lines.push(`Message: ${lead.message}`);
  if (lead.answers) {
    lines.push(`Answers: ${Object.entries(lead.answers).map(([factor, score]) => `${factor} ${score}`).join(", ")}`);
  }
  const utm = [lead.source && `source ${lead.source}`, lead.medium && `medium ${lead.medium}`, lead.campaign && `campaign ${lead.campaign}`].filter(Boolean);
  if (utm.length) lines.push(`Campaign: ${utm.join(", ")}`);
  return lines;
}

/** Send one lead to Clarify. Reports rather than throws. */
export async function upsertLead(lead: Lead): Promise<ClarifyResult> {
  const cfg = config();
  if (cfg === "skipped" || cfg === "failed") return cfg;

  try {
    const email = lead.email.trim().toLowerCase();
    const domain = email.split("@")[1] ?? "";
    const work = Boolean(domain) && !PERSONAL_DOMAINS.has(domain);

    // 1. the company, on a work domain. A personal address gets no company:
    //    a name alone has no unique key to upsert on and would duplicate
    let companyId: string | undefined;
    if (work) {
      const company = await call(cfg, "/objects/company/records", {
        match_on: "domains",
        data: {
          type: "company",
          attributes: {
            name: lead.organization || nameFromDomain(domain),
            domains: { items: [domain] },
          },
        },
      });
      if (company.ok) companyId = recordId(company.json);
      else console.error("[lead] clarify company upsert failed", company.status, JSON.stringify(company.json)?.slice(0, 300));
      // a failed company call is not fatal: the person still goes in
    }

    // 2. the person, on the email
    const [first, ...rest] = (lead.name ?? "").trim().split(/\s+/).filter(Boolean);
    const attributes: Record<string, unknown> = {
      email_addresses: { items: [email] },
    };
    if (first) attributes.name = rest.length ? { first_name: first, last_name: rest.join(" ") } : { first_name: first };
    if (lead.role) attributes.job_title = lead.role;
    if (companyId) attributes.company_id = companyId;
    const person = await call(cfg, "/objects/person/records", {
      match_on: "email_addresses",
      data: { type: "person", attributes },
    });
    if (!person.ok) {
      console.error("[lead] clarify person upsert failed", person.status, JSON.stringify(person.json)?.slice(0, 300));
      return "failed";
    }
    const personId = recordId(person.json);

    // 3. the note, once the whole thing is in. The teaser's email-only
    //    post gets the person and nothing more
    if (personId && lead.stage !== "email") {
      const comment = await call(cfg, "/comments", {
        entity: "person",
        owner_id: personId,
        message: paragraphs(noteLines(lead)),
      });
      if (!comment.ok) console.error("[lead] clarify comment failed", comment.status, JSON.stringify(comment.json)?.slice(0, 300));
    }
    return "ok";
  } catch (error) {
    console.error("[lead] clarify threw", error);
    return "failed";
  }
}
