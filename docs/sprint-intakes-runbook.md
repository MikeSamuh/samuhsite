# Sprint 3 runbook

Paste these into Claude Code in VS Code, one at a time, in order. After each
one, do the check before pasting the next.

Spec: `docs/sprint-intakes.md`. If Claude and the spec disagree, the spec
wins. If you and the spec disagree, change the spec first, then prompt.

Every step is its own branch and PR. `npm run build` passes before any push.

---

## 0. Orientation

```
Read CLAUDE.md, docs/sprint-intakes.md and docs/crm-integration.md in full.
Do not write code.

Then answer, in under 15 lines total:
1. What are the three flows and what does each one post?
2. What does deliver() do, in order, and why does the route never fail the
   visitor?
3. Why does the TeamQ teaser render no number while MODEL_VERIFIED is
   false, and what flips it?
4. The one thing in the spec you would push back on, and why.
```

**Check:** 1 to 3 match the spec. If 4 is a good point, change the spec
before step 1.

---

## 1. Lead plumbing

```
Branch feat/lead-plumbing. Build "Shared plumbing" from
docs/sprint-intakes.md, nothing else:

- src/lib/lead.ts: Lead and LeadFlow
- src/lib/lead-delivery.ts: deliver(lead). Notify email via Resend to
  LEAD_NOTIFY_TO with LEAD_NOTIFY_CC, always, unless LEAD_NOTIFY=off.
  Then Clarify upsert only if CLARIFY_API_KEY is set, errors logged, never
  thrown. Returns { delivered }, false only when every configured sink
  failed. Leave the Clarify function as a clearly marked stub for now
- src/app/api/lead/route.ts: POST, zod (name optional only for flow
  "teaser"), honeypot, Turnstile when the secret is set, deliver,
  { ok: true }, or { ok: false } with 502 when delivered is false
- src/components/lead/: Field, Honeypot, Turnstile, useLeadSubmit, useUtm
- src/lib/analytics.ts: track(), no-op without NEXT_PUBLIC_GA_ID
- .env.example with every key from the spec and a one-line comment each

Add zod and resend. No other packages.

Before writing, tell me in five lines how lead-delivery.ts is structured
so the Clarify upsert can be filled in later without touching route.ts.
Then build. npm run build. PR.
```

**Check:**
- The five lines describe one `deliver()` with notify and clarify as
  separate functions behind it. If filling in Clarify means editing the
  route, stop and ask it to restructure
- `curl -X POST localhost:3000/api/lead -H 'content-type: application/json' -d '{"flow":"contact","name":"Test","email":"t@t.co","message":"hi","reason":"general"}'`
  returns `{"ok":true}`
- Same with `"company_website":"x"` added: ok, nothing delivered
- Set `LEAD_NOTIFY=on`, `RESEND_API_KEY`, `LEAD_NOTIFY_TO` to your address.
  Curl again. Email arrives
- Break `RESEND_API_KEY` with notify still on. Curl again. 502 and
  `{"ok":false}`, the lead is in the server log
- `.env.example` exists, `.env` is gitignored

---

## 2. Flow 1: Contact

```
Branch feat/contact. Build /contact per docs/sprint-intakes.md "Flow 1".
Production route at src/app/contact/page.tsx, not under /draft.

- Two columns, form left, direct contact aside right, stacked on mobile
- Fields exactly as specced. The select is "What brings you here" with
  General inquiry, Learn more about our solutions, Partnership
  opportunity, Something else
- Inline success block on done, no navigation, "Or book a time" to /talk
- Email and Google Voice number are TODO(content), visible
- Replace the contact case in src/app/layout/pages.tsx so the working draft's
  Contact link goes to the real /contact

All design values from src/lib/tokens.ts. No em dashes. Build, PR.
```

**Check:**
- Submit a real form. Email arrives with `flow: contact` and the reason
- Tab through with the mouse unplugged. Visible focus everywhere. Enter
  submits
- 375px. No horizontal scroll
- Working draft nav Contact lands on the new page

---

## 3. Flow 2: TeamQ teaser

Do this in two prompts. The model first, the UI second, so the maths gets
reviewed on its own.

### 3a. Port the model

```
Branch feat/teaser-model. Read docs/sprint-intakes.md "Flow 2" and
CLAUDE.md rule 4.

Clone github.com/jerzybala/samuh-dashboard into a sibling folder (not
inside this repo) and read it. Find the code that turns factor values into
TeamQ, MHQ and productive days.

Then create src/components/teamq-teaser/model.ts:
- FACTORS: the eleven inputs with the simulator's exact labels, ranges and
  groups
- BASELINE: per-factor averages of the 18 rows in
  "../Reference material/Simulator Dummy Data (1).csv", computed once and
  committed as constants. Comment each with the CSV column it came from.
  Flag any simulator label you cannot map to a column; do not guess. Note
  the Ultra-Processed Food inversion
- score(values): the scoring lifted from the repo. Comment the source file
  path and commit hash. Do not simplify or approximate it
- MODEL_VERIFIED: true only if score() is a faithful port. If the scoring
  is server side and not closed form, leave it false, leave score() as a
  stub, and tell me. We will add /api/teaser instead

Tell me, before writing, which file in samuh-dashboard holds the scoring
and whether it is portable client side. Then build. PR.
```

**Check:**
- It named a real file in the repo. Open it yourself and eyeball that
  `score()` matches
- Run `score(BASELINE)` in a scratch test. Compare to the Railway app with
  the same eleven values. Same numbers, to rounding
- If it said "not portable", stop. Ask me and we spec the proxy route

### 3b. Build the UI

```
Branch feat/teaser. Build the teaser UI per docs/sprint-intakes.md
"Flow 2", using model.ts from the last PR.

- src/components/teamq-teaser/TeamQTeaser.tsx and teaser.css
- Readout: productive days large with delta, TeamQ and MHQ smaller.
  Sticky at the top on mobile
- Nine native range inputs and two native selects, labels from FACTORS,
  grouped Work Environment and Lifestyle Factors. Reset button
- While MODEL_VERIFIED is false: gauge only, no digits in the readout,
  visible TODO(content)
- "Show me the factors optimized" below the inputs applying the
  optimizer's result, and the ask, "Want to get your team's TeamQ?",
  always visible under it, posting flow "teaser" with answers.
  teaser_interact fires on the first change. The readout is never gated
- src/app/teamq/page.tsx: the intro (what the tool is, how SAMUH uses
  TeamQ in its process, "Start exploring" button to the tool), then
  <TeamQTeaser />. Draft the intro copy yourself, mark it TODO(content),
  claim nothing that is not in docs/, and say the team is a demonstration
- Section 9 (tool) of the working draft home: wrapper stays, content becomes a
  short pitch and an "Explore TeamQ" button to /teamq
- Relabel every "Get Started" CTA to "Explore TeamQ", pointing at /teamq
- Redirect /get-started to /teamq

No slider library. All values from tokens. Build, PR.
```

**Check:**
- `/teamq` shows the intro, then the tool. No "Get Started" left anywhere
- The readout works without filling in the form
- Move each of the eleven inputs. Readout changes every time
- Reset returns the exact baseline numbers
- Submit the ask. Email arrives with `answers` keyed by factor id
- Arrow keys move ranges. Tab reaches the form
- Reduced motion on: numbers update, nothing animates

---

## 4. Flow 3: Talk to us

```
Branch feat/talk. Build /talk per docs/sprint-intakes.md "Flow 3".

- src/app/talk/page.tsx. Step 1: the qualifying form, posts flow "talk"
  with teamSize, change and tier from ?tier=. On done it collapses to a
  summary line and step 2 renders
- Step 2: Google Calendar appointment schedule embedded inline from
  NEXT_PUBLIC_BOOKING_URL. Placeholder block when unset. Fire
  booking_open. One line under it linking to Insights
- A sessionStorage flag so a refresh after step 1 lands on step 2.
  try/catch around storage
- Solutions: one "Talk to us" per tier to /talk?tier=...
- Home closing CTA to /talk
- Contact and teaser success blocks already link here. Verify

Build, PR.
```

**Check:**
- Create an appointment schedule on your own Google Calendar, 30 min. Put
  its link in `NEXT_PUBLIC_BOOKING_URL`
- Submit step 1. Email arrives with teamSize and change. Embed appears
- Book a slot. It lands on your calendar
- Refresh. Still on step 2
- `/talk?tier=guided` submits with `tier: guided` on the lead

---

## 5. Thank you and cleanup

```
Branch feat/thank-you.
- src/app/thank-you/page.tsx reading ?flow=, three variants per the spec
- Delete src/app/draft/a and src/app/draft/c and their entries in
  src/app/draft/drafts.ts. /draft lists the working draft and frozen B
- "Partnered with Sapien Labs" as header text. Remove the Sapien icon and
  second logo
- Remove the Arc section from the Process page
Build, PR.
```

**Check:** `/draft/a` 404s. `/thank-you?flow=talk` renders the talk
variant. Build clean.

---

## 6. Clarify, when Jake's key arrives

```
Branch feat/clarify. Fill in the Clarify function in
src/lib/lead-delivery.ts per docs/crm-integration.md:
- Upsert company on the email domain, skip personal providers, match_on
  domains
- Upsert person, match_on email_addresses, company_id from above
- Custom attributes using the exact API names below
- Any error: log, swallow. The notify email already went
Do not touch route.ts. Build, PR.

Attribute API names from the Clarify person schema:
[paste them here]
```

**Check:** Set the key on preview. Submit `/contact`. The person appears in
Clarify with attributes set. Remove the key, submit again, email still
arrives and the visitor still sees success.

---

## When something goes wrong

- Claude invents or approximates the scoring: revert, re-prompt 3a with
  "lift it verbatim"
- Claude shows a number with MODEL_VERIFIED false: revert, rule 1 and 4
- Claude adds a package you did not ask for: ask why, usually revert
- Claude edits route.ts in step 6: revert, the boundary exists for a reason
- Build fails on fonts: network, not code. `npm run dev` is enough to check
  layout
