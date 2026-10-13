# Sprint 3: Intakes

Weeks of 5 and 12 Oct. The three lead capture flows, end to end, on real
production routes. When this sprint closes, a visitor can contact SAMUH, play
with the TeamQ teaser and ask to learn more, or book time with Jake. Every one
of those emails Jake and Mike, and lands in Clarify once Jake cuts a key.

Why first: integration is where projects slip. Retire that risk in week three,
not week eleven. Everything after this is design and copy, which does not
break.

Decisions below were confirmed by Wilfred on 5 Oct. Where this file and an
older note disagree, this file wins.

## Ground rules

- Flows are built at the **root**, not under `/draft/working`. `/contact`, `/talk`,
  `/teamq`, `/thank-you`, `/api/lead`. They are production. When the working draft is
  promoted nothing moves
- Working draft pages (and frozen B) link to the root routes. The existing `contact` and `start`
  cases in `src/app/layout/pages.tsx` get replaced or redirected
- The TeamQ teaser is a component, `src/components/teamq-teaser/`, rendered
  on its own page, `/teamq`, under an intro. Section 9 (`tool`) of the Draft
  B home becomes a short pitch with an "Explore TeamQ" button
- Nothing here waits on the client to start. Every external dependency has a
  stub. See "Client dependencies"
- All design values from `src/lib/tokens.ts`. No new hex codes, no new fonts

## Build order

1. Shared plumbing: lead type, delivery, `/api/lead`, form primitives, spam,
   UTM, GA4
2. Flow 1, `/contact`, complete end to end
3. Flow 2, TeamQ teaser on `/teamq`, model ported from the simulator repo
4. Flow 3, `/talk`, qualifying form then the Google booking embed
5. `/thank-you`, delete drafts A and C, the two cheap working draft items
6. Clarify, the moment Jake's key arrives

---

## Shared plumbing

### Lead shape

One type, every flow produces it.

```ts
// src/lib/lead.ts
export type LeadFlow = "contact" | "teaser" | "talk";

export interface Lead {
  flow: LeadFlow;
  name?: string;        // required for contact and talk, optional for teaser. Revisit at Clarify
  email: string;
  phone?: string;
  organization?: string;
  message?: string;
  reason?: "general" | "solutions" | "partnership" | "other";   // flow 1
  teamSize?: "1-10" | "11-50" | "51-200" | "200+";               // flow 3
  change?: string;                                                 // flow 3, what they hope to change
  tier?: "self-guided" | "supported" | "guided";                   // flow 3, from ?tier=
  answers?: Record<string, number>;                                // flow 2, the slider state
  source?: string;      // utm_source
  medium?: string;      // utm_medium
  campaign?: string;    // utm_campaign
  page: string;         // pathname the form was on
  submittedAt: string;  // ISO
}
```

### Delivery

`src/lib/lead-delivery.ts`. One function, `deliver(lead: Lead)`. It does two
things, always in this order:

1. **Notify.** Email the lead to `LEAD_NOTIFY_TO` (Jake) with `LEAD_NOTIFY_CC`
   (Mike). Plain text, subject `New lead: {flow} · {name} · {organization}`,
   leaving out any part that is empty. Every submission, every time. Skipped
   only when `LEAD_NOTIFY=off`. Unset means on in production and off in
   local dev, so a deploy that forgot the variable fails loudly
2. **Clarify.** If `CLARIFY_API_KEY` is set, upsert company and person per
   `docs/crm-integration.md`. Any error is logged, never thrown

Neither step stops the other. A failed email still attempts Clarify.
`deliver()` returns `{ delivered: boolean }`: true if at least one sink
accepted the lead, or if notify is off and no Clarify key is set, which is
local dev with nothing to deliver to.

The route fails the visitor in exactly one case: every configured sink
failed, so the lead exists nowhere. Then it logs the full lead and returns
`{ ok: false }` with a 502. The form shows its error state with the
`mailto:` fallback, so the visitor can still reach SAMUH. One sink failing
is logged and the visitor sees success.

This replaces the earlier `LEAD_SINK` either-or idea. Email is not a fallback,
it is the notification Jake and Mike asked for. Clarify is additive.

### `/api/lead`

`src/app/api/lead/route.ts`. POST only.

1. Parse JSON against a zod schema for `Lead` minus `submittedAt` and `page`,
   which the server fills from the clock and the referer. `name` is required
   unless `flow` is `teaser`
2. Reject if the honeypot field `company_website` is non-empty. Return 200
   anyway
3. Verify the Turnstile token if `TURNSTILE_SECRET_KEY` is set. Skip if not
4. `deliver(lead)`
5. `{ ok: true }`, or `{ ok: false }` with 502 when `delivered` is false

Add `zod` and `resend`. Nothing else.

### Form primitives

`src/components/lead/`:

- `Field.tsx`: label, input or textarea or select, inline error, from tokens
- `Honeypot.tsx`: visually hidden `company_website`, `tabIndex={-1}`,
  `autoComplete="off"`
- `Turnstile.tsx`: Cloudflare Turnstile, invisible. Renders nothing without
  `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `useLeadSubmit.ts`: takes a `LeadFlow`, returns `{ submit, state }`, state
  is `idle | pending | done | error`. Attaches UTM from `useUtm()`, posts to
  `/api/lead`, fires the GA4 event on success. On `error` every form shows
  one line and the SAMUH `mailto:`, and keeps what the visitor typed
- `useUtm.ts`: reads `utm_source`, `utm_medium`, `utm_campaign` on mount,
  keeps them in `sessionStorage` so they survive navigation. try/catch around
  storage
- `UtmCapture.tsx`: renders nothing, calls `useUtm()`. Mounted in the root
  layout so the params are stored on whichever page the visitor lands on

### Analytics

`src/lib/analytics.ts`. `track(event, params)`. No-op without
`NEXT_PUBLIC_GA_ID`. Events: `lead_submit { flow }`, `teaser_interact
{ factor }` on the first slider move, `booking_open` when the Google embed is
shown.

### Environment

```
LEAD_NOTIFY=on                       # off in local dev
LEAD_NOTIFY_TO=                      # jake@samuh.work
LEAD_NOTIFY_CC=                      # mike@samuh.work
RESEND_API_KEY=
RESEND_FROM=                         # site@samuh.work after domain verification
CLARIFY_API_KEY=                     # unset until Jake cuts one
CLARIFY_WORKSPACE=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_BOOKING_URL=             # Google Calendar appointment schedule link
NEXT_PUBLIC_GA_ID=
```

`.env.example` committed with every key and a comment. `.env` never. Local
dev needs nothing set: notify off, Turnstile skips, GA no-ops, booking shows a
placeholder. During the build, put your own address in `LEAD_NOTIFY_TO` on
preview so you watch leads flow.

---

## Flow 1: Contact, `/contact`

General inquiry form, plus SAMUH's email and Google Voice number so a visitor
can skip the form.

### Layout

Two columns on desktop, form left, direct contact right. Stacked on mobile.

**Form**

| Field | Type | Required |
|---|---|---|
| Name | text | yes |
| Email | email | yes |
| Organization | text | no |
| What brings you here | select: General inquiry · Learn more about our solutions · Partnership opportunity · Something else | yes, default General inquiry |
| Message | textarea | yes |
| Honeypot, Turnstile | hidden | |

Submit reads "Send". Pending disables it, label "Sending". On `done` the form
is replaced in place by a success block: heading, one line, secondary button
"Or book a time" to `/talk`. No navigation.

**Direct contact aside**

- Email as `mailto:`. `TODO(content)`
- Google Voice number as `tel:`. `TODO(content)`, SAMUH to provide

### Posts

`flow: "contact"`, `reason` from the select.

### Done when

- Valid submission on `LEAD_NOTIFY=on` lands an email in the notify inbox
  within a minute, with CC
- Empty required fields show inline errors, nothing posts
- Filled honeypot returns 200 and delivers nothing
- Keyboard only: sensible tab order, visible focus on every field
- 375px: no horizontal scroll, aside stacks under the form
- Working draft nav "Contact" lands here

---

## Flow 2: TeamQ teaser, `/teamq`

The simulator, cut down for the site, on its own page. The visitor reads a
short intro, sees a real team, moves the sliders and watches productive days
change in real time. If they are intrigued, they leave basic details.

**Nothing is gated.** The tool is meant to be fun to explore. The readout is
live from the first move and the ask never blocks, hides or delays a result.

The CTA label everywhere is **"Explore TeamQ"**. It replaces "Get Started".

### What it is not

Read `CLAUDE.md` rule 4. The teaser demonstrates how TeamQ thinks. It is not
TeamQ, and nothing it shows about the dummy team is a result for the
visitor's team. "See how TeamQ thinks" is fine. "Your TeamQ score" is not.

### Source of truth

**The SAMUH dashboard**, repo `github.com/jerzybala/samuh-dashboard` at
commit `53eb9f8`: the v2 dashboard in `samuh/` and `static_samuh/`, which
shows every factor on a 1 to 9 scale. We have repo access. The model gets
ported from there, not reinvented. (Until 10 Oct the source was the older
simulator deployed on Railway, with lifestyle on 1 to 5 and a TeamQ figure.)

| | |
|---|---|
| Headline | **Productive days per month**, with change from baseline |
| Also shown | **Capacity to perform**: the team's MHQ, with change from baseline, on the dashboard's six-band scale from Distressed to Thriving, a marker at the figure |
| Not shown | TeamQ as a number. Decided 10 Oct: the readout is productive days and capacity to perform, that is it |
| Mode | Team only. Individual mode and CSV upload are not in the teaser |
| Not in the teaser | The Optimize function, baseline setting, Max All, reports |

### Inputs

Labels exactly as the dashboard shows them. Every input is a slider from 1
to 9 in whole steps, lifestyle included (decided 10 Oct: lifestyle on the
same scale as the other factors, as the dashboard draws it).

**Work environment, eight sliders, 1 to 9**

1. Flexibility over Time
2. Workload
3. Pride & Purpose
4. Learning & Growth
5. Relationship with Colleagues
6. Relationship with Manager
7. Flow of Information
8. Reward & Recognition

**Lifestyle, two sliders, 1 to 9**

9. Exercise. Higher is more frequent
10. Healthy Diet. Higher is healthier, meaning less ultra-processed food.
    The CSV answer is a frequency; the dashboard inverts it

The survey has five answers for each lifestyle question. The dashboard shows
them at 1, 3, 5, 7 and 9 (`samuh.js`, 2v - 1) and converts back to 1 to 5
before the models see them. So do we.

Three columns the survey asks are not sliders. Flexibility over Work and
Sleep: the dashboard shows both, but its models take neither, so a slider
would move nothing. Job Security: the models take it, but the sample no
longer asks it; the dashboard feeds its default, 5, and so does `score.ts`.
If the client wants any of the three shown, that is a model question for
Jerzy, not a copy change.

One fold on desktop (decided 10 Oct): the readout on the left, the team
line, productive days and capacity to perform stacked; the ten sliders on
the right in two columns, lifestyle under work environment, Reset under
them. Stacked on mobile with the readout sticky at the top so the number
stays visible while scrolling the sliders. No "Baseline avg" under the
sliders: it did not help tell the story (10 Oct).

### Baseline

`training/data/sample/new_sample_20.csv` in the dashboard repo, a team of
20, supplied by the client on 10 Oct (with `new_sample_10.csv` and
`new_sample_5.csv`, smaller teams in the same shape, not used). The baseline
is the team's averages per factor, computed once and committed as a constant
in `model.ts` with the CSV's column names noted beside each value. The CSV
itself is not shipped to the browser.

The CSV's column headers are the survey questions, not the dashboard labels.
Map them explicitly in `model.ts`, by the dashboard's own
`samuh/data_loader.py`. Where a label has no obvious column, say so in a
comment and ask rather than guess.

### The model

Decided 5 Oct: the teaser is a **copy of the dashboard's scoring**, team
mode, running on the sample team only.

MHQ and productive days come from two trained LightGBM models run on every
row of the team. So the models themselves are copied, not approximated, and
they run on our server.

- `src/lib/teaser/models.json`: the two `models_west` models, exported tree
  for tree from `samuh-dashboard` at commit `53eb9f8`
- `src/lib/teaser/score.ts`: the dashboard's scoring. Server only. Holds the
  20 team rows, which never reach the browser
- `POST /api/teaser`: scores one slider setting, returns `{ mhq, days }`.
  The page calls it on every change
- `src/components/teamq-teaser/model.ts`: what the browser needs. `FACTORS`,
  `BASELINE`, the lifestyle answer labels, `MODEL_VERIFIED`

Inputs are whole-number steps, and the baseline is the team averages rounded
to the step.

The figures follow the dashboard's anchoring rule
(`docs/metrics_and_anchoring.md` there): what the team measured, plus the
change the models predict. Capacity to perform starts at the sample's mean
"Overall MHQ"; productive days at 22 working days less the mean days lost
the team reported. Moving a slider shifts every row by the same amount,
the models score the shifted team, and the difference from the unshifted
team is added to the measured figure. At baseline the change is exactly
zero. The band comes from the dashboard's thresholds, 50 wide from -100.

**Verified.** On 5 Oct our route was compared with the live simulator's
`/api/predict-batch` on 60 slider settings. Identical, to floating point.
`MODEL_VERIFIED` is true. To re-export the models after Jerzy retrains,
repeat that comparison before shipping.

**While `MODEL_VERIFIED` is false, no number renders.** The sliders work, a
qualitative gauge moves, the result slot shows `TODO(content): model
pending`. Set it false if the comparison ever fails.

### Layout

One page, two parts: the intro, then the tool.

**Intro**

An education that leads into the tool, one section at a time: the heading,
one bold line, What is TeamQ, How we use it, then How to understand it, with
each part of the tool explained on a frozen copy of the real readout and
inputs, the part in question lit. The lifestyle step says the values are
the sample team's averages and why SAMUH looks beyond the team to
individual habits. A "Skip to the tool" button at the top. The tool is on
the same page, so nothing stops a visitor scrolling straight past.

Copy is our draft for now, marked `TODO(content)` in the source for client
review. Rule 1 still applies to a draft: describe, do not claim. No
statistics, sample sizes or outcomes unless they are already in `docs/`. The
intro must also say plainly that the team shown is a demonstration, not the
visitor's team (rule 4).

**Tool**

1. Kicker and two lines on what the visitor is looking at
2. The team line: "A team of 20, as they are today." Baseline productive
   days, capacity to perform and its band
3. Readout: **productive days per month** large, delta from baseline beside
   it. Capacity to perform beside that: the figure, its band, the delta,
   and the six-band scale with a marker. Updates on every input change
4. The ten inputs, grouped and labelled as above. Native
   `<input type="range">`, styled from tokens. A "Reset" returns everything
   to baseline
5. "Show me the factors optimized", below the inputs. Applies the
   simulator's own optimizer result (its best three levers for productive
   days, the same search as its Optimize) to the inputs and explains it in
   a sentence
6. The ask, always visible below. Optional, never a gate. Heading "Want to
   get your team's TeamQ?" A light B2B intake in two steps (decided
   12 Oct): first the work email alone, then name, company and role, the
   company offered from the email's domain for the visitor to correct
   (nothing offered for a personal address). The email is posted as soon
   as it is given, `stage: "email"`, so the CRM has the person if the
   rest never comes; the whole thing is posted at the end,
   `stage: "complete"`. The notify email goes once, on complete. Honeypot
   and Turnstile. Inline success with "Or book a time" to `/talk`.
   `teaser_interact` fires on the first input change

### Posts

`flow: "teaser"`, `answers` is the full input state keyed by factor id,
`role` is the job title, `stage` says which of the two posts it is.

### Where it lives

`src/app/teamq/page.tsx`: the intro, then `<TeamQTeaser />`.

Section id `tool`, section 9 of the working draft home, keeps its wrapper. Its
content becomes a short pitch and an "Explore TeamQ" button to `/teamq`.

### Entry points

- Every "Get Started" CTA is relabelled "Explore TeamQ" and points to
  `/teamq`
- Home section 9 button
- `/get-started` redirects to `/teamq`, keep the route. The Noom-style
  intake from scope section 4 is not this sprint

### Done when

- `/teamq` renders the intro, then the tool. "Start exploring" reaches the
  tool
- No "Get Started" label remains on the site. Each one reads "Explore
  TeamQ" and lands on `/teamq`. `/get-started` redirects there
- The readout is visible and live without submitting anything
- Every input changes the readout live
- Reset returns to baseline exactly
- With `MODEL_VERIFIED = false`, no numeric result renders anywhere
- With it true, the readout for the untouched baseline matches what the
  Railway app shows for the same inputs, to the rounding
- Submitting the ask delivers a lead with `answers` populated
- `prefers-reduced-motion`: readout still updates, nothing animates
- Keyboard: arrow keys move ranges, selects open, tab reaches the form

---

## Flow 3: Talk to us, `/talk`

Two steps on one page. Qualify, then book.

### Why two steps

The booking tool is Google Calendar appointment schedules, because SAMUH runs
on Google and is not adding Cal.com. Google's booking page captures name and
email and, on paid Workspace plans, can add custom form fields, but it has no
webhook. So answers typed into Google's form would never reach Clarify.

Instead, our own short form asks the qualifying questions first and posts to
`/api/lead`. Then the Google embed appears for the time slot. Clarify gets
the answers from us and the calendar event from its own Google sync. Nothing
depends on what Google's form can or cannot do.

### Step 1, qualify

| Field | Type | Required |
|---|---|---|
| Name | text | yes |
| Email | email | yes |
| Organization | text | yes |
| Roughly how many people are on your team | select: 1 to 10 · 11 to 50 · 51 to 200 · more than 200 | yes |
| What are you hoping to change | textarea | no |
| Honeypot, Turnstile | hidden | |

Button reads "Pick a time". On `done`, step 1 collapses to a one-line summary
and step 2 renders.

`?tier=` on the URL, from the Solutions buttons, is recorded on the lead.
One booking schedule for all tiers, nothing routes differently.

### Step 2, book

Google Calendar appointment schedule embedded inline from
`NEXT_PUBLIC_BOOKING_URL`. Placeholder block when unset. `booking_open`
fires when it renders. Google handles the confirmation; after booking, a
line under the embed links to the Insights index.

Jake creates the schedule on his calendar: "Intro call", 30 minutes, his
availability. Until it exists, build against a schedule on Wilfred's own
Google Calendar.

### Entry points

- `/solutions`: one "Talk to us" per tier, `/talk?tier=self-guided` and so on
- `/`: closing CTA to `/talk`
- `/teamq`: teaser success block
- `/contact` and teaser success blocks: "Or book a time"

### Posts

`flow: "talk"`, `teamSize`, `change`, `tier`.

### Done when

- Submitting step 1 emails the notify inbox and reveals the embed
- The embed books a slot on the stub calendar
- `?tier=guided` on `/talk` arrives on the lead
- Refreshing the page after step 1 does not lose step 2. Keep a flag in
  `sessionStorage`, try/catch

---

## `/thank-you`

One page, reads `?flow=`. Three variants: contact, teaser, talk. Heading, one
line, one next step. Forms use inline success and do not navigate here; the
page exists so a flow can switch to it without a build.

---

## Client dependencies

Nothing here stops the sprint starting.

| Needed | Owner | Stub until it arrives |
|---|---|---|
| Jake's and Mike's addresses for notify | Confirm | Wilfred's own address |
| Clarify API key, workspace slug, custom attributes created | Jake | Delivery skips Clarify, email still goes |
| Google Calendar appointment schedule, "Intro call", 30 min | Jake | A schedule on Wilfred's calendar |
| SAMUH email, Google Voice number | Client | `TODO(content)` visible |
| Teaser explanatory copy | Client | `TODO(content)` |
| GA4 property | Client | No-op |
| Resend domain verification for `samuh.work` | Mike, DNS | Resend's onboarding domain, which only delivers to the account owner. Fine for the build, not launch |

The model is not on this list. We have the repo.

---

## Out of this sprint

- Shareable result links for the teaser. The scope asks for them; they need
  somewhere to store or encode the slider state. After M1
- Shortening the home scroll, process page rebuild, icon redraw. Sprint 4
- Email sequences after a lead. Retainer covers it, scope does not require it
  at launch
- Speaking and keynote enquiries. The scope mentioned a secondary path. Not
  wanted. Dropped
