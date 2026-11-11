# Sprint: Solutions, Methodology, Careers

The edits agreed on the 6 November 2026 call (Jake, Rahul, Wilfred). No
dates. The sprint is done when the "Done when" line at the foot is true.

Runbook: `docs/sprint-solutions-runbook.md`.

**Superseded in part, 11 Nov 2026.** Wilfred's sitemap moved sections
between pages after this was written: who we work with is on the home,
the four stages are on Solutions under the sprints, Methodology is the
science then the path, and the dropdowns changed. The entry of 2026-11-11
in `docs/decisions.md` has the current order and wins over sections 1, 2,
3 and 5 below. The copy, the sources and the claims table still hold.

## Sources

Everything below traces to one of these. If a line of copy or a number is
not in one of them, it is `TODO(content)`.

| Source | Where | Carries |
|---|---|---|
| Call notes, 6 Nov (Gemini) | Drive, "Samuh Solutions Content - 2026/11/06" | The decisions. Spoken, machine-transcribed: good for what was agreed, not for figures |
| Three-pager, "Samuh Leadership Team Performance", Oct 2026 | `Reference material/2026-11-06 Solutions call/` | The written copy: the four steps, the sprint path, the three cases, the Sapien Labs figures |
| Jake's email, 29 Oct | same folder, `jake-email-2026-10-29.md` | What Samuh does, what sets TeamQ apart, the method in his words |
| Rahul's whiteboard, 6 Nov | same folder, `rahul-whiteboard.jpg` | Who Samuh works with, and the org structure: one person, one team, many teams |
| Jake's bio, forwarded 6 Nov | same folder, `jake-bio.md` | His About entry |
| Wilfred's notes, 10 and 11 Nov | This file | The Solutions dropdown, where the org structure goes, one design framework. Where it and the call notes differ, it wins |

Gemini misheard some names. Read them as: "lead Q" and "lead queue" are
**LeadQ**, "ORQ" is **OrgQ**, "Sapient Labs" is **Sapien Labs**,
"platform.samu.org" is **platform.samuh.org**.

## Decisions

| Decided on the call | What changes here |
|---|---|
| Process becomes Methodology, research and science up front | `/process` becomes `/methodology`, 301 from the old path. Nav, footer, sitemap, `llms.txt`, schema path |
| The 90-day journey is Discover (pre-work), Align, Co-create, Ritualize | Four stages replace Assess, Discover, Align, Co-create. The TeamQ baseline is part of Discover (three-pager, page 2) |
| A star moves across the steps | Built as a four-stop rail, then taken off (Wilfred, 11 Nov 2026). The stages scroll under the running head with no rail |
| Solutions stays one page, in sections, reached from a nav dropdown | Section ids. The dropdown is four items: Who we work with, Assessments, Sprints, Workshops |
| Solutions opens with who Samuh works with | "Who we work with": leaders, teams, organizations, the three levels on Rahul's whiteboard |
| The assessments go hand in hand with those three | Straight under it, the assessment for each level in the same order: LeadQ, TeamQ, OrgQ. The org structure draws them. Figure on the left, copy on the right |
| Then the sprints, then keynotes and workshops | New section order, below |
| One design framework | Every change is built from the sections, classes and tokens the site already has. See "Design framework" |
| "Self-guided", never "DIY" | Sweep copy, defaults, FAQ, the form's error line |
| Executive Team Sprints are the main offering and a sales conversation | Own section, Talk to us, no checkout, no public price |
| Coaches and consultants are an audience | A line under the three levels in Who we work with |
| A careers page the team can post to | `/careers`, a Careers tab in the admin |
| Sapien Labs graphs, redrawn in the brand, on Methodology | A carousel under the science section. Blocked on Jake's list |
| The home ask takes an email, then hands off to the platform | Email box in place on the home, hand-off to `platform.samuh.org` |
| Email is on `samuh.org` | Already in the code (3 Nov). Docs and `llms.txt` still say `.work` in places |

**Not decided:** the hero line. "Great team environments sustain high
performance." stays as the placeholder. Do not rewrite it.

## Design framework

Wilfred, 10 Nov: all changes use the same design format. That means:

- New sections are built with `PageHead` and `Sec` from
  `src/app/layout/pages.tsx`, and sit in the same frame as every other
  section: the number, the eyebrow, the title, then the body
- Existing classes first: `card`, `L-assess`, `opt`, `btn`, `field`,
  `L-mid`, `L-big`, `L-cap`. A new class only where no existing one fits,
  and then built from tokens
- No new type sizes, colours, radii, line weights or durations (rule 3).
  One loud colour at a time
- No new interaction pattern where the site already has one. Pressed
  `opt` buttons already pick things on Solutions; the email box already
  opens in place
- If a section seems to need something the site does not have, stop and
  ask before inventing it

## 1. Methodology (was Process)

- Route `/methodology`. `/process` redirects permanently in
  `next.config.ts`. The internal page id and the content key stay
  `process`, so anything saved in the admin survives; only the route, the
  names and the labels change. Say so in a comment where the id is defined
- `ROUTES.process`, `PAGES` name, the folder under `src/app/(site)/`,
  `schema.ts` path, `sitemap.ts`, the footer link, `public/llms.txt`,
  `pageMeta()` title and description
- **Head.** Research first. The approach "mainly draws on Theory U,
  systemic coaching, and design thinking" (Jake, 29 Oct). The call also
  named Otto Scharmer and systemic constellation: name Theory U and its
  author, keep "systemic coaching" as written until Calina says which term
  she wants. Calina owns this page's copy and was not on the call
- **The four stages**, words from the three-pager, page 2:

| Stage | When | Copy |
|---|---|---|
| Discover | Pre-work | TeamQ and interviews with the team members. TeamQ is repeated before day 90 to measure what changed |
| Align | (none) | The team aligns on its goals and chooses a high-performance practice |
| Co-create | (none) | The practice is co-created within the rhythm of the team's work and iterated over a few weeks |
| Ritualize | (none) | The practice is ritualized and the team sees the impact in the second TeamQ result |

- Under the stages: two ritual keepers from the team are coached by Samuh,
  a call every two weeks, a midpoint check-in
- **No rail** (Wilfred, 11 Nov 2026). The four-stop rail with the
  travelling star was built and removed. The traced figures stay for
  Discover, Align and Co-create. Ritualize has no figure: the star at rest
  stands in, marked `TODO(asset)`. The Assess stand-in goes with Assess
- **The path** (three-pager): Sprint 1, ritualize one practice. Sprint 2,
  strengthen the team environment. Sprint 3, scale to the teams they lead
- **The science**, id `science`: the Sapien Labs partnership, the figures
  in the claims table below, the Work Culture Report link, and the graph
  carousel (section 8). Sapien Labs is a partner, not a footnote (rule 6)

## 2. Solutions

**Changed on review, 11 Nov 2026 (Wilfred).** The org structure belongs
to Who we work with, not to the assessments. Section 02, Who we work with:
the org chart stays on the left (one person, one team, several teams), and
the info on the right changes as the page scrolls, Leaders, Teams,
Organizations. Section 03, Assessments: the three side-by-side cards the
page had before, LeadQ, TeamQ, OrgQ. Where the text below says otherwise,
this wins.

One page. Every section has an id so the nav dropdown can land on it. All
copy is in the HTML from the start. Nothing is fetched on a click.

| # | id | Section | Notes |
|---|---|---|---|
| 01 | | Head | Existing |
| 02 | `who` | Who we work with | Leaders, teams, organizations, below |
| 03 | `assess` | Assessments | The assessment for each of the three, same order, on the org structure, below |
| 04 | `sprints` | Sprints | The 90-day sprint. Two parts: on the platform (Self-guided, or Self-guided with support), then Executive Team Sprints, id `executive-sprints` |
| 05 | `workshops` | Workshops and Keynotes | Short. Placeholder until Jake's copy |
| 06 | `talk` | Talk to us | Existing form. Options: Self-guided, Supported, Executive Team Sprint, Keynote or workshop, Other |
| 07 | | Proof | Testimonials, and client logos once cleared |

**What the record says about this order.** There is no transcript of the
call, only Gemini's notes. Their detailed section, near the end of the
call, has Wilfred laying the page out as: hero, who we work with at the
individual, team and organization levels, then assessments, then the
self-guided and guided options, executive sprints, keynotes. Their
one-line summary says "assessments upfront, followed by target audience
sections", which reads the other way round. This spec follows the detailed
section and Wilfred's own notes of 10 and 11 Nov: who first, three levels,
then straight into the matching assessments. If Jake's recording says
otherwise, sections 02 and 03 swap and nothing else moves.

### Who we work with

Three entries, in the order of the whiteboard, top to bottom. Each names
who, carries the whiteboard's line, and links down to its assessment.

| Level | Who (whiteboard) | Line (whiteboard) | Goes hand in hand with |
|---|---|---|---|
| Leaders | Team leaders | "For team leaders curious about ..." The sentence was left open: `TODO(content)` | LeadQ, `#leadq` |
| Teams | CXOs, founders, NGO leaders, team leaders, managers | "seeking to accelerate their performance" | TeamQ, `#teamq` |
| Organizations | HR leaders, business leaders | "looking for scaled solutions for high-performing organizations" | OrgQ, `#orgq` |

Build notes:

- Short. A level's name, who, the line, and a real link to its assessment
  row just below. The section's job is to let a visitor find themselves
  and then read on
- No picker and no tabs. Three entries, all visible, existing classes
- The level names, "Leaders, Teams, Organizations", are Wilfred's. The who
  and the lines are the whiteboard's, word for word
- Coaches and consultants (Jake, on the call) are not on the whiteboard:
  one line under the three, `TODO(content)`, with a link to Talk to us
- "Enterprise" does not appear. The whiteboard says organizations

On `/contact`, add Consultant to the "I'm a" list.

### Assessments, on the org structure

Straight under Who we work with, three rows in the same order, so the
leader's row sits under Leaders, and so on. Each row is a figure on the
left and the copy on the right.

| Row | id | Figure, left | Copy, right |
|---|---|---|---|
| 1 | `leadq` | One person | LeadQ. Free |
| 2 | `teamq` | One team: a leader and their people | TeamQ |
| 3 | `orgq` | Several teams | OrgQ |

- The figures are the people from the home's fourth beat
  (`src/components/focus-morph/FocusMorph.tsx`), the same drawing, so the
  two pages share one figure. One person, then a team, then teams, as on
  the whiteboard
- A hairline joins the three figures down the left, so the column reads as
  one structure, the individual inside the team inside the organization
- The copy on the right is what the cards carry now: the tag, the name,
  the price, what it is, who it is for, what you get, the button. Same
  fields in `defaults.ts`, a different layout. The three side-by-side
  cards go
- The buttons behave as now: LeadQ and TeamQ open the email box in place
  with the intent set, OrgQ goes to `/contact`
- Narrow screens: the figure sits above its copy, the hairline stays
- LeadQ: add what it is, an individual read that mirrors TeamQ, the same
  13 team environment factors and 13 team practices, 26 questions. That
  description was spoken on the call, not written: it goes in once Jake
  confirms it by email, and is `TODO(content)` until then
- Buying happens on the platform. Nothing on this site takes a card
  (rule 5)

### Sprints

**On the platform.** Tier 01 is "Self-guided" (was DIY), Tier 02 is
"Supported", described as Self-guided plus calls. Two columns, not three.
Prices stay as they are until confirmed in writing.

**Executive Team Sprints.** The main offering, and what was "Guided".
Pre-work, then ninety days with two ritual keepers coached by Samuh
(three-pager, page 2). On the call the pre-work was described as about a
month of discovery: that length is spoken only, so it stays off the page
until Jake writes it. The three cases from page 3 of the three-pager sit
here, as written, once Rahul clears them for the public site. The button
is Talk to us. The Guided price `TODO(content)` stays a TODO and stays off
the page.

## 3. Nav

**Changed on review, 11 Nov 2026 (Wilfred).** The order across the top is
About, Methodology, Solutions, Insights. The dropdowns are unchanged.

| Item | Dropdown |
|---|---|
| Solutions | Who we work with, Assessments, Sprints, Workshops. Each lands on its section id |
| Methodology | The 90-day sprint, The science, Work Culture Report |
| Insights | none |
| About | none (Wilfred, 11 Nov 2026). Careers is in the footer only |
| Let's talk | the button, unchanged |

- A dropdown is a button that discloses a list of real `<Link>`s. Opens on
  click and on Enter, closes on Escape and on focus leaving. Hover may
  open it too, never hover alone
- The parent stays a link to its page: the label navigates, a chevron
  button beside it opens the list
- In the mobile overlay the lists are open, under their page
- `site.ts` owns the structure, like the link order does now
- Styled from what the nav already has. No new type or colour
- Footer: Methodology replaces Process, Careers joins Company

## 4. The way in

The call: click, enter an email on the home page, arrive on the platform
signed in as a free user, take LeadQ, be offered TeamQ.

- The ask under the home's fourth beat opens the email box in place
  (`StartEmail`), as the Solutions buttons do. Today that ask is a link
  to `LEADQ_HREF`, which becomes the platform itself once the env var is
  set, so the visitor would arrive there with no email given and no lead
  posted. `ROUTES.start` stays `/contact#assess` for the other pages
- **Always post the lead first**, then hand off. Today, once
  `NEXT_PUBLIC_PLATFORM_URL` is set, the box redirects and `/api/lead`
  never hears about the person. Sales should have them even if they stop
  on the platform
- **Keep the address out of the URL.** Today it goes as `?email=`. URLs
  land in server logs, analytics and referrers. Hand off with a form POST
  to the platform if it accepts one; a query string only if Mike says it
  cannot
- Fire `track("start_submit", { intent })` before leaving
- The platform's entry point is Mike's to confirm: the URL, POST or GET,
  the parameter names, and whether the platform sends the magic link. Until
  he does, nothing changes for visitors: the box posts as flow `start` and
  thanks them

## 5. Home, Contact, About

- **Home, foot of the page.** A closing block above the footer that says
  what Samuh offers in three lines, each a link into a Solutions section:
  assessments, sprints, workshops, the same three the dropdown names.
  Copy drafted from the three-pager, marked draft
- **Home, design pass.** Wilfred's, by eye, on the preview. Not specified
  here
- **Contact.** The two sentences read as speech with every combination of
  the two lists. Fix the ones that do not, and add Consultant
- **About.** Jake's bio from `jake-bio.md`, the 17 September version,
  word for word, in place of the test copy. Then read all five bios
  against their sources

## 6. Careers

- `/careers` lists open roles. `/careers/<slug>` is one role
- **No open roles** (Jake): the page says so and invites a note from
  anyone who wants to collaborate. Name, email, a few lines, posted to
  `/api/lead` as flow `careers`. Notify email only, not Clarify: these are
  not sales leads
- **Applying** is an email address or a link on the posting. No uploads,
  no stored CVs
- **Admin.** A Careers tab beside Blog. A posting is a document under
  `job:<slug>`: title, location or Remote, type, summary, body (the
  Insights editor), how to apply, status (`draft`, `open`, `closed`),
  dates. Same store, same revalidation as posts
- `JobPosting` structured data through `<JsonLd>` on open roles only.
  `pageMeta()` on both pages. Open roles in the sitemap
- This is staff access, the same exception as the rest of the admin
  (rule 5). Add the line to CLAUDE.md and `docs/admin.md`

## 7. Vocabulary and stale references

- "DIY" becomes "Self-guided" in `defaults.ts` (tier name, the Supported
  line, the FAQ answer), in `schema.ts` help text, and in the form error in
  `pages.tsx`
- `public/llms.txt`: `/process`, `/talk`, and the `.work` URLs
- `docs/scope.md` sitemap, `docs/milestones.md`, CLAUDE.md context table
- **Saved content.** The admin merges what the team saved over the
  defaults, and a saved list replaces the default list whole. Before this
  ships anywhere with a real store, look for saved `content:solutions`,
  `content:process` and `content:about`. A saved tier list still says DIY
  and still has three tiers; a saved team list still has Jake's test copy

## 8. Science graphs

Blocked until Jake sends which graphs and their numbers.

- Redrawn as charts in the page, from tokens. Not screenshots of the
  Sapien Labs figures
- The values are typed from the source into one data file with the report
  and page beside each. Never read off a picture of a chart
- **Headers in Samuh's words, sources in Sapien Labs' words.** The call
  asked for headers about performance, not mental wellbeing. The header
  can be renamed; the caption names the original measure and links the
  report, so the chart still says what was measured. Jake or Rahul
  approves each renamed header in writing
- A carousel: previous and next buttons, no autoplay, each slide a
  `<figure>` with a `<figcaption>`, arrow keys, reduced motion respected

## Claims: where each one comes from

Rule 1. Use these as written. Anything else is `TODO(content)`.

| Claim | Source | Use |
|---|---|---|
| In a Distressed team, people report about 8 fewer productive days a month | Three-pager, p1 | Yes, in those words |
| Most leadership teams lose 15 to 20% each month | Three-pager, p1 | Yes |
| Leadership teams Samuh has measured lose about 3 to 3.5 days a month on average | Jake, 29 Oct | Yes |
| MHQ: 3 million+ people, 130+ countries, about 2,000 more every day | Three-pager, p1 | Yes |
| Work culture research: 55,000 employed people, 64 countries | Three-pager, p1 | Yes |
| TeamQ: about five minutes, 13 team environment factors, 13 team practices | Jake, 29 Oct | Yes |
| Benchmarked against Sapien Labs data on tens of thousands of senior employees | Jake, 29 Oct | Yes |
| The three cases: +39% and 12 of 13; +30% and 13 of 13; +1.1 days a month, up 23% | Three-pager, p3 | After Rahul clears them for the public site |
| LeadQ mirrors TeamQ: 26 questions, 13 factors and 13 practices | Said on the call only | Confirm with Jake first |
| What Fortune 500 companies lose | Nobody. Rahul ruled it out on the call | Never |
| "No company can outperform its leadership team" | Jake's email quotes it back to the person he was writing to. It is that person's line | Never as Samuh's |

## Client owes

| Item | Owner | Blocks |
|---|---|---|
| Which graphs, and their numbers | Jake | Section 8 |
| Recording and transcript of the call | Jake | Nothing. It settles the order of sections 02 and 03 on Solutions, and anything else the notes got wrong |
| Platform entry point: URL, method, parameters | Mike | The hand-off in section 4 |
| Methodology copy and the term for "systemic" | Calina | Section 1 sign-off |
| End of the team leaders line | Rahul | Who we work with copy |
| What Samuh offers coaches and consultants | Jake | Who we work with copy |
| Length of the Executive Team Sprint pre-work, in writing | Jake | One line in Sprints |
| Clearance to publish the three cases, and client logos | Rahul | Proof on Solutions |
| What LeadQ is, in writing: question count, what it covers | Jake | One line on the LeadQ card |
| Keynotes and workshops copy | Jake | Section 05 on Solutions |
| Signatures and social links moved to `.org` | Everyone | Nothing here |

## Open, with the default if nobody answers

1. **Nav label: Methodology or Science.** Jake asked for a Science
   dropdown, the call renamed the page Methodology. Default: Methodology,
   because a nav label should match the page it opens, with "The science"
   as the second item
2. **Careers in the top nav.** The call said top nav. It went under About
   first; on 11 Nov 2026 Wilfred took the About dropdown off, so Careers
   is in the footer only
3. **Site domain.** `SITE_URL` is still `https://samuh.work`. Email moved
   to `.org`; nobody has said the site does. Not changed in this sprint

## Not in this sprint

- The admin package builder that makes a PDF for a prospect. Raised as a
  later phase
- A partner or reseller programme for coaches
- A salary-based ROI calculator for Executive Team Sprints
- Payments. They live on the platform
- A new hero line

## Done when

Every item Wilfred owns in the call notes is on the preview: Methodology
at its new path with the four stages and the star, Solutions in its new
order, Who we work with leading straight into the assessments on the
org structure, the nav dropdowns,
the email box on the home handing off after posting the lead, Jake's bio
in, `/careers` live with a posting made from the admin, no "DIY" anywhere,
and `npm run build` passes. The graphs follow when Jake sends them.
