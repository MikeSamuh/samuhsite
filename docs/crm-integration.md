# CRM integration: Clarify

SAMUH's sales tool is Clarify (clarify.ai), an AI-native CRM. Jake owns it.
Every lead capture point on the site posts there.

This resolves the open item in `docs/scope.md`: "Destination for submitted
leads. Inbox, shared sheet, or CRM."

## What Clarify gives us

Confirmed from developer.clarify.ai on 30 Sep 2026.

| | |
|---|---|
| Auth | API key. `Authorization: api-key YOUR_KEY`. Created in Settings > API Keys. OAuth 2.0 exists but is for partner apps, not us |
| Base URL | `https://api.clarify.ai/v1/workspaces/{slug}/...` where `{slug}` is the workspace slug from their login URL |
| Standard | JSON:API. Filtering, search, pagination, batch endpoints |
| Objects | `person`, `company`, `deal`, `meeting`, plus custom objects prefixed `c_` |
| Person unique key | `email_addresses` (a collection: `{ "items": ["a@b.com"] }`) |
| Company unique key | `domains` (same collection shape) |
| Upsert | `match_on: "email_addresses"` on person create. No dedupe logic needed on our side |
| Linking | `company_id` foreign key at creation, or the Relationships endpoints after |
| Rate limit | 3,000 requests per minute per workspace per endpoint. `429` with `Retry-After` when exceeded. Irrelevant at lead-form volume |
| Webhooks | Inbound only in the docs. A Clarify Workflow or AI Agent exposes a URL that accepts any JSON POST. The URL is the credential. No outbound event subscriptions documented |
| Spec | OpenAPI 3.1 at `https://api.clarify.ai/swagger-json` |

## The create person call

From the docs:

```
POST https://api.clarify.ai/v1/workspaces/{slug}/objects/person/records
Authorization: api-key ...
Content-Type: application/json

{
  "match_on": "email_addresses",
  "data": {
    "type": "person",
    "attributes": {
      "name": { "first_name": "Jane", "last_name": "Doe" },
      "email_addresses": { "items": ["jane@company.com"] }
    }
  }
}
```

Company is the same shape against `/objects/company/records` with
`domains: { items: ["company.com"] }` as the match key.

## What is built (13 Oct 2026)

`src/lib/clarify.ts`, called from `lead-delivery.ts` for every accepted
lead when `CLARIFY_API_KEY` and `CLARIFY_WORKSPACE` are both set. Option A
below, as written. Three calls per lead:

1. Company: `POST /objects/company/records` with `match_on: "domains"`,
   on the email's domain, named from the form or from the domain. Not for
   a personal address (gmail and the like): a name alone has no unique key.
2. Person: `POST /objects/person/records` with `match_on:
   "email_addresses"`: name split on the first space, `job_title` from the
   role field, `company_id` from step 1. The teaser's two posts (email
   alone, then everything) land on the same person.
3. Note: `POST /comments` on the person with everything that has no field
   of its own: flow and stage, page and time, phone, reason, team size,
   tier, message, the slider answers, and the UTM values. Not for the
   teaser's email-only post.

The key alone, without the slug, logs an error and counts as a failed
delivery, the same as notify without its key, so a half-configured deploy
fails loudly. A failed company call does not stop the person. Custom
attributes on the person are not used until Jake adds fields for them; the
note carries the same information meanwhile.

Checked against the OpenAPI spec and with a stubbed API on 13 Oct. Not yet
run against the real workspace: that needs the slug.

## Two ways to wire it

### Option A: server route calling the API (recommended)

```
browser form
  -> POST /api/lead              (Next.js route handler, server only)
     -> validate + spam check
     -> upsert company on email domain     (optional, skip for gmail etc.)
     -> upsert person, match_on email, company_id from step above
     -> set custom attributes: source, campaign, goal, tier, message, answers
     -> the notify email to Jake and Mike has already gone; Clarify errors are logged
  <- 200
browser fires GA4 conversion event
```

Why this one: dedupe is deterministic, the field mapping is in code we can
test and version, errors are visible in our logs, and the API key never
leaves the server. About forty lines.

### Option B: post to a Clarify Workflow inbound webhook

Jake builds a Workflow in Clarify with an "On inbound webhook" trigger. We
POST the raw form JSON to the URL it gives us. He maps fields inside Clarify.

Why you might want it: zero API key handling, and the client can change the
mapping without a deploy. Why it is second choice: the logic lives in a tool
we cannot test from code, dedupe depends on how Jake builds the workflow, and
if it breaks we find out from him rather than from a log.

Fine as a fallback or for a campaign landing page that needs to go up fast.

## Field mapping

From `docs/scope.md`, the lead record carries: name, email, organization,
message, goal, assessment answers where given, recommended tier, source and
campaign.

| Site field | Clarify | Note |
|---|---|---|
| name | `person.attributes.name.first_name` / `last_name` | Split on first space if the form takes one field |
| email | `person.attributes.email_addresses.items[0]` | Match key |
| organization | `company` record via `domains` or name, linked by `company_id` | Skip company creation for personal email domains |
| role | `person.attributes.title` | The teaser intake's job title field |
| stage | nothing | The teaser posts the email alone first, then everything. Both upsert on the email; the second overwrites |
| message | custom attribute on person | Name TBD |
| goal | custom attribute on person | Name TBD |
| recommended tier | custom attribute on person | Self-guided / Supported / Guided |
| assessment answers | custom attribute on person, JSON or one per factor | Depends on how many factors ship |
| source, campaign | custom attributes on person | Read from UTM params |
| capture point | custom attribute on person | Which of the seven capture points fired |

**Custom attributes must exist in Clarify before we can write to them.** Jake
creates them in the workspace, then we read their API names from the schema
endpoint. Do not guess attribute names.

## What needs to happen before a line of code

1. Jake confirms Clarify is the tool of record, not a trial
2. Jake creates an API key for the site and shares it through a password
   manager, not email or Slack. It goes in Vercel as an environment variable
3. Jake creates the custom attributes above on the person object
4. We pull the OpenAPI spec and the person schema to get exact attribute names
5. Agree the company rule: create a company on every business email, or only
   when the visitor typed an organization

## Rules

- The API key is server-side only. It never appears in client code, a
  `NEXT_PUBLIC_` variable, or a commit
- Every capture point goes through the same `/api/lead` route. One place to
  fix, one place to log
- A Clarify outage must not lose a lead. The notify email goes first, every
  time; Clarify is additive. The visitor sees success unless every sink
  failed, in which case the form shows an error and the `mailto:`
- The intake assessment result page works without Clarify. The CRM write is
  a side effect, not a dependency

## Not yet verified

The docs summarise the create call but the full attribute list for `person`
and the exact custom attribute naming were not visible. Pull the spec and
confirm before building:

```
curl -o clarify-openapi.json https://api.clarify.ai/swagger-json
```

Look for the `person` entity schema and the relationships block on the
records create body.
