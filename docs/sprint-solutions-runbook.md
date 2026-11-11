# Solutions sprint runbook

Paste these into Claude Code in VS Code, one at a time, in order. Do the
check before pasting the next.

Spec: `docs/sprint-solutions.md`. If Claude and the spec disagree, the spec
wins. If you and the spec disagree, change the spec first, then prompt.

Each step is its own branch off `main`, committed locally. Nothing is
pushed until you say so (CLAUDE.md). `npm run build` passes at the end of
every step, with `npm run dev` stopped first.

Steps 1 to 8 are unblocked today. Step 9 waits for Jake's graphs.

One rule sits over every step: the "Design framework" section of the
spec. Existing sections, classes and tokens. If Claude proposes a new
pattern, the answer is no until you have seen why.

---

## 0. Orientation

```
Read CLAUDE.md, docs/sprint-solutions.md, docs/admin.md, and everything
in "../Reference material/2026-11-06 Solutions call/" (open the PDF and
the whiteboard photo, do not guess at them). Do not write code.

Then answer, in under 25 lines:
1. The four stages of the 90-day sprint and when each happens, and which
   document that comes from.
2. The sections of the new Solutions page, in order, with their ids, and
   the four items in its nav dropdown.
3. How the three assessments are laid out, and which existing drawing the
   figures come from.
4. The three levels in Who we work with, the assessment each one leads
   to, and which words are the whiteboard's.
5. Three numbers you may use and where each is written. One you may not.
6. Why the page id stays "process" when the route becomes /methodology.
7. What "Design framework" rules out, in two lines.
8. The one thing in the spec you would push back on, and why.
```

**Check:** 1 to 7 match the spec. If 8 is a good point, change the spec
before step 1.

---

## 1. Docs and vocabulary

```
Branch chore/solutions-sprint-docs. Section 7 of docs/sprint-solutions.md,
plus the docs. No layout changes.

- docs/decisions.md: one dated entry for the 6 November call, from the
  Decisions table in the spec. Say what is not decided (the hero line)
- docs/scope.md: the sitemap gains Methodology (was Process) and Careers
- docs/milestones.md: add this sprint as its own milestone with the spec's
  work items as checkboxes and its "Done when" line. Add the spec's
  "Client owes" rows to the client table. No dates
- CLAUDE.md: two rows in the context table for the sprint spec and the
  runbook. Rule 5: add Careers postings to the staff-access exception
- "DIY" becomes "Self-guided" everywhere under src/: defaults.ts (the tier
  name, the Supported line, the FAQ answer), schema.ts help text, the
  form error in pages.tsx. grep -ri "diy" src must return nothing
- public/llms.txt: drop /talk, fix what it says about engagement tiers.
  Leave /process and the domain for step 2 and the open question

Then tell me whether .data/store or the configured store holds a saved
content:solutions, content:process or content:about, and what in each
would override the new defaults.
```

**Check:**
- `grep -ri "diy" src` is empty
- The decisions entry reads like the others in the file and names no deadline
- You know whether saved content exists. If it does on the preview's
  store, decide now: reset those pages in the admin after this ships, or
  have Claude migrate them

---

## 2. Methodology

```
Branch feat/methodology. Section 1 of the spec.

- Route /methodology, permanent redirect from /process in next.config.ts.
  Keep the page id and content key "process"; comment why where PageId is
  defined. Update ROUTES, the PAGES name, the folder under src/app/(site),
  schema.ts path and name, sitemap.ts, the footer link, llms.txt, and the
  pageMeta title and description
- Head: research first. Use Jake's sentence about Theory U, systemic
  coaching and design thinking; credit Theory U to Otto Scharmer. Mark the
  head copy draft for Calina in a comment
- Stages: Discover, Align, Co-create, Ritualize, with the copy in the
  spec's table. Each carries its "when" (Pre-work, Day 1, Day 90). Assess
  and its stand-in icon go. Add the "when" field to defaults.ts and
  schema.ts together
- The rail: one line with the four stops and the star on the active one,
  driven by the same scroll state the stage head already uses. The star
  moves with a token duration; under prefers-reduced-motion it jumps.
  Ritualize has no traced pose: show the star at rest and leave
  TODO(asset) in a comment
- Under the stages: the ritual keepers line, then the three-sprint path
- A section with id "science": the partnership, the Sapien Labs figures
  from the claims table, the report link, and an empty, labelled slot for
  the graph carousel that renders nothing until step 9

No new design values outside tokens.ts. Before building, tell me in five
lines how the rail reads the active stage without a second scroll
listener.
```

**Check:**
- `/process` lands on `/methodology` with a 308 or 301. Nav, footer and sitemap say Methodology
- Four stages, in order, words match the three-pager. No "Assess"
- Scroll: the star moves stop to stop. With reduce motion on in the OS, it jumps
- Tab through the page: nothing in the rail steals focus
- The admin Content tab opens the page without the drift error

---

## 3. Solutions: the order, and the assessments on the org structure

```
Branch feat/solutions-sections. Section 2 of the spec, without Who we
work with (step 4). Follow "Design framework": Sec and PageHead, existing
classes, tokens only.

- Section order and ids exactly as the spec's table: who, assess, sprints
  (with executive-sprints inside it), workshops, talk, then proof. Leave a
  headed, empty "who" section for step 4. The three assessment rows carry
  the ids leadq, teamq, orgq
- Assessments on the org structure: three rows, LeadQ, TeamQ, OrgQ, top to
  bottom. Figure on the left, copy on the right. The figures are the
  people already drawn for the home's fourth beat in FocusMorph.tsx: one
  person, one team, several teams. Lift that drawing into something both
  pages import; do not draw it a second time. A hairline joins the three
  figures. On narrow screens the figure sits above its copy
- The copy is the fields the cards have now, unchanged. The buttons behave
  as now. The three side-by-side cards go
- Add the LeadQ description as TODO(content) per the spec, visible, not
  invented
- Sprints, part one: two tiers, Self-guided and Supported. The comparison
  rows lose their third column
- Sprints, part two, id executive-sprints: pre-work, then ninety days with
  two ritual keepers. No "month". The three cases from the three-pager,
  word for word, behind one flag in site.ts that is off until Rahul clears
  them. Button: Talk to us, to /contact. No price
- Keynotes and workshops, id workshops: head, TODO(content) body, Talk to
  us
- Talk form: options Self-guided, Supported, Executive Team Sprint,
  Keynote or workshop, Other. The pick still posts as flow "solutions"
- Every new string is a field in defaults.ts and schema.ts
- pageMeta title and description for the new shape

Before building, tell me in five lines how the figure is shared between
the home and this page, and which existing classes the rows use.
```

**Check:**
- Desktop: three rows, figure left, copy right, in the order LeadQ, TeamQ, OrgQ. The figures are plainly the home's people
- 375px wide: figure above copy, nothing scrolls sideways
- `/solutions#assess`, `#sprints`, `#executive-sprints`, `#workshops` each land on their section, below the stuck nav, not under it
- No "Guided" tier, no "DIY", no price and no "month" on Executive Team Sprints
- The cases do not render. Flip the flag locally: they render, and every number matches page 3 of the PDF
- Submit the talk form with "Keynote or workshop". The notify email names it
- The home's fourth beat still looks and moves as it did

---

## 4. Who we work with

```
Branch feat/solutions-who. The "Who we work with" part of section 2.
Follow "Design framework". This is a small section: no picker, no tabs.

- Three entries in the spec's order: Leaders, Teams, Organizations. Each
  has the who and the line from the whiteboard, word for word, and a real
  link to its assessment row below (#leadq, #teamq, #orgq). Where the spec
  says TODO(content), put TODO(content) on the page, visible
- Under the three, one line for coaches and consultants, TODO(content),
  linking to /contact
- It sits directly above Assessments, and the three entries line up with
  the three rows: same order, same names
- On /contact, add Consultant to the "I'm a" list

Before building, show me the three entries as a table: level, who, line,
link.
```

**Check:**
- The table matches the spec before it builds
- Read the page top to bottom: Leaders, Teams, Organizations, then LeadQ, TeamQ, OrgQ in the same order. It should feel like one thought
- Each entry's link lands on its assessment row, below the stuck nav
- The who and the lines match `rahul-whiteboard.md`
- It looks like the rest of the page, not like a new component

---

## 5. Nav and footer

```
Branch feat/nav-dropdowns. Section 3 of the spec. Follow "Design
framework": styled from what the nav already has.

- The nav structure moves into site.ts: each item has an optional list of
  links (page id plus hash, or a path)
- Solutions: Who we work with (#who), Assessments (#assess), Sprints
  (#sprints), Workshops (#workshops). Methodology: The 90-day sprint, The
  science, Work Culture Report. About: Team, Careers (Careers links to
  /careers, built in step 8; until then leave it out behind a flag)
- The label stays a link to the page. A chevron button beside it has
  aria-expanded and aria-controls and opens the list. Enter and Space
  open, Escape closes and returns focus, focus leaving closes. Hover may
  open, click always works
- Mobile overlay: the lists shown open, under their page
- Footer: Methodology replaces Process
- Every item is a <Link> reading ROUTES. No click handlers that navigate
```

**Check:**
- The Solutions dropdown has exactly four items, in that order, and each lands on its section
- Keyboard: Tab to Solutions, Tab to its chevron, Enter, Tab through the links, Escape returns to the chevron
- From another page, Solutions > Sprints lands on `/solutions#sprints`
- 375px wide: the overlay lists everything, nothing is cut off
- Lighthouse accessibility on the home is no lower than before

---

## 6. The way in

```
Branch feat/start-handoff. Section 4 of the spec.

- Home: the ask under the fourth beat opens StartEmail in place, intent
  leadq. It is a link to LEADQ_HREF today, which turns into the platform
  URL once the env var is set and would skip the email and the lead
  entirely. ROUTES.start stays /contact#assess for the other pages
- StartEmail: always submit the lead as flow "start" first. Only then,
  if NEXT_PUBLIC_PLATFORM_URL is set, hand off. Do not block the hand-off
  on a slow or failed lead post for more than a couple of seconds; log it
- Hand-off: a form POST to the platform with email, intent and the UTM
  values, not a query string. Put the target path and field names in one
  constant in site.ts with a comment that Mike confirms them
- track("start_submit", { intent }) before leaving. Add the event to
  AnalyticsEvents in analytics.ts if it is not there
- With the env var unset, behaviour is what it is today

Tell me what you assumed about the platform's endpoint, in three lines,
so I can send them to Mike.
```

**Check:**
- Env var unset: email box on the home posts, thanks, notify email arrives
- Env var set to a request bin: the lead email arrives **and** the bin receives a POST. The address is in the body, not the URL
- Send Mike the three lines. The constant changes when he answers, nothing else

---

## 7. Home foot, Contact, About

```
Branch feat/home-contact-about. Section 5 of the spec.

- Home: a closing block above the footer, three lines, each a link to a
  Solutions section id (assess, sprints, workshops), built with Sec and
  existing classes.
  Copy from the three-pager's page 1 and 2, marked draft. Fields in
  defaults.ts and schema.ts, and a section id in the home order
- Contact: write out every combination of the "I'm a" and "and" lists as
  sentences in a scratch file, show me the ones that read badly, then fix
  the labels so all of them read as speech
- About: Jake's bio from the reference folder, the 17 September version,
  word for word, replacing the test copy. Then diff each of the five bios
  against its source and list any difference
```

**Check:**
- Jake's bio on `/about` matches the file. No "TEST COPY" anywhere: `grep -rn "TEST COPY" src` is empty
- Read five random contact sentences out loud
- The home block's three links land on the right sections

---

## 8. Careers

```
Branch feat/careers. Section 6 of the spec. Read docs/admin.md first and
follow how posts are stored, saved and revalidated.

- src/lib/admin/jobs.ts: the Job type, list, get, save, delete, under
  job:<slug>, validated with zod, HTML body cleaned the way posts are
- Admin: a Careers tab after Blog. List, new, edit, with status draft,
  open, closed. Reuse the post editor's rich text
- /careers: open roles, newest first. With none: the line saying so and a
  short form (name, email, note) posting to /api/lead as flow "careers".
  Add the flow to lead.ts. deliver() sends the notify email and skips
  Clarify for this flow
- /careers/<slug>: the role, how to apply (mailto or link). JobPosting
  JSON-LD through <JsonLd> on open roles only. Closed and draft roles 404
- pageMeta on both. Open roles in sitemap.ts. Careers in the footer and
  switch on the About dropdown item from step 5
- CLAUDE.md rule 5 and docs/admin.md: one line each

No uploads, no stored applications.
```

**Check:**
- No roles: the page invites a note. Send one. Email arrives, nothing in Clarify
- Create a role in the admin, set it open: it is on `/careers` without a redeploy
- Paste the role's URL into Google's Rich Results Test: JobPosting, no errors
- Set it closed: gone from the list, its URL 404s, gone from the sitemap

---

## 9. Science graphs

Wait for Jake's list and numbers. Save what he sends into the reference
folder first.

```
Branch feat/science-graphs. Section 8 of the spec.

- src/lib/science-graphs.ts: one entry per graph: Samuh's header, Sapien
  Labs' original title, the report and page, the values. Values only from
  the files in the reference folder. If a value is not written there, stop
  and ask
- Charts drawn in SVG from tokens, in the slot left in step 2. Direct
  labels where they fit, a text summary of each chart for screen readers
- The caption under every chart names the original measure and links the
  report
- Carousel: previous and next buttons, arrow keys, no autoplay, each slide
  a <figure>. Reduced motion: no slide animation

Show me the header and caption pairs as a table before drawing anything.
```

**Check:**
- Every value traces to a line in Jake's files
- Send the header and caption table to Jake and Rahul. Their yes, in writing, goes in `docs/decisions.md`
- Contrast holds on the dark palette. Keyboard moves the carousel

---

## 10. Review pass

```
On main with every step merged locally. No new features.

- npm run build
- grep -rn "TODO(content)" src and give me the list grouped by who owes it,
  using the "Client owes" table in the spec
- Every internal link on /, /solutions, /methodology, /about, /careers,
  /contact resolves. Every nav and dropdown link lands where it says
- Tab through /solutions and /methodology start to finish and tell me
  anywhere focus is lost or invisible
- Tick the milestone items that are true in docs/milestones.md
```

**Check:** the TODO list is what you take to the next call. Then tell
Claude to push.
