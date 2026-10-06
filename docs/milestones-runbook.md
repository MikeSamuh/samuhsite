# Milestones runbook, M2 to M5

Same rules as the intakes runbook. One prompt at a time, check before the
next, one branch per step, build clean before push. Spec is `docs/scope.md`
and `docs/milestones.md`. If Claude and the docs disagree, the docs win.

M1 is in `docs/sprint-intakes-runbook.md`.

---

## M2. Working draft revision

### 2.0 Orientation

```
Read CLAUDE.md, docs/milestones.md (M2) and docs/scope.md. Do not write
code.

The home is section-driven: src/lib/layout.ts defines SECTIONS, and
src/app/draft/drafts.ts composes the working draft from them. Read both.
Edit the `working` entry, never `b`: B is frozen as of 5 October.

Answer in under 12 lines:
1. Which of the twelve home sections would you combine or cut to shorten
   the scroll, and why? Propose a target of seven or eight.
2. How is the Process page built today, and what does rebuilding it around
   three phases touch?
3. Anything in M2 that depends on content we do not have yet.
```

**Check:** its cut list is an argument, not a shrug. Decide the target
sections yourself before 2.1, write them into `docs/scope.md` under "Home
page" as the agreed order, then prompt.

### 2.1 Shorter home

```
Branch feat/home-shorter. The agreed home order is now in docs/scope.md
under "Home page". Make the working draft match it: turn off or merge the sections
that are gone in drafts.ts, keep everything else. Where two sections
merge, the merged section keeps both ids' content and one wrapper. Do not
delete section definitions from layout.ts; only the composition changes.
Build, PR.
```

**Check:** scroll the preview. Count sections. Matches the list. Nothing
that was cut is reachable by its old anchor.

### 2.2 Process page

```
Branch feat/process-three. Rebuild the Process page around the three
initial phases per docs/scope.md. Content from Calina is in
[path or paste]. Each phase gets its own block with room for the expanded
copy. The six-stage arc stays removed. Icons stay as placeholders in this
PR; they get redrawn separately. TODO(content) for anything Calina has not
supplied. Build, PR.
```

**Check:** three phases, in order, expanded copy where supplied, no arc.

### 2.3 Icons

```
Branch feat/icons-team. The process icons need to read as group and team,
not individual. Current icons are at [path]. Redraw them as SVG on the
same grid and stroke weight as the SAMUH mark, per docs/scope.md section
11. Keep each under 2KB. Show me the six side by side on a scratch route
/icons before wiring them in. Build, PR.
```

**Check:** look at `/icons`. If any reads as one person, send it back.
Delete the scratch route when they are in.

### 2.4 Brand mark and favicon

```
Branch feat/mark. Produce three alternative brand mark and favicon
iterations derived from the SAMUH logo geometry. SVG, 32px and 16px
renderings. The logo lettering is untouchable per CLAUDE.md rule 2; these
are marks, not wordmarks. Show all three on /icons. Do not wire any in.
PR.
```

**Check:** the client picks. Then a one-line prompt to wire the winner.

### 2.5 Blob and headshots

```
Branch feat/blob. NEXT_PUBLIC_ images that are headshots, metaphor cards
or other client-supplied art move to Vercel Blob. Mike has created the
store and the token is in Vercel env. Write a small script in scripts/
that uploads a local folder to Blob and prints the URLs. Replace the local
references. Video stays out; it is embedded from YouTube or Vimeo per the
scope. Build, PR.
```

**Check:** images load from the Blob domain on preview. Repo has no new
binary over 500KB.

---

## M3. Copy

### 3.0 Audit

```
Read CLAUDE.md and docs/content.md. Run grep -rn "TODO(content)" src/
and give me the full list grouped by page, with the owner from
docs/milestones.md "Client owes" beside each. Do not write code.
```

**Check:** that list is your ask to the client. Send it.

### 3.1 Copy in, per page

```
Branch copy/[page]. Replace every TODO(content) on [page] with the copy
in [path or paste]. Keep the structure. No em dashes. Never invent a
figure; if a line needs a number we do not have, leave the TODO and tell
me. Build, PR.
```

Repeat per page. **Check:** read the page on the preview, not the diff.

### 3.2 Insights

```
Branch feat/insights-mdx. [If MDX:] Insights posts are MDX files in
content/insights/, one per post, with frontmatter: title, date, type
(article | video | research), author, readingTime, tags, videoUrl,
transcript. The index page lists them newest first with a type filter.
The detail template renders written and video posts from one layout, with
the transcript under a video. Add the first posts from [path]. Build, PR.
```

**Check:** index filters work, a video post shows the embed and the
transcript, share links carry correct Open Graph.

---

## M4. Promotion and polish

### 4.1 Promote

```
Branch feat/promote. Move the working draft to the root: the home becomes
src/app/page.tsx, the pages become top-level routes, the draft shell and
/draft are removed. ROUTES and navigation point at the root. /contact,
/talk, /thank-you and /api/lead do not move. Build, PR.
```

**Check:** every nav link, every CTA, all three flows, on the root.

### 4.2 Analytics and consent

```
Branch feat/analytics. GA4 (NEXT_PUBLIC_GA_ID) with conversion events on
lead_submit, booking_open and teaser submit. LinkedIn Insight Tag. A
cookie consent banner that blocks every tag until accepted, EU or not for
simplicity, from tokens. Build, PR.
```

### 4.3 Quality bar

```
Branch fix/quality. Run Lighthouse on throttled mobile for /, /solutions,
/process, /insights, /contact. Report the numbers before fixing. Then fix
to performance 90+ and LCP under 2.5s without removing content. Then a
WCAG 2.1 AA pass: keyboard, focus, semantics, contrast on the dark
palette. Report what you changed. Build, PR.
```

**Check:** numbers before and after, in the PR.

---

## M5. Launch

### 5.1 Redirects and SEO

```
Branch feat/launch-seo. Redirects in next.config.ts from every old
WordPress URL in [path] to its new home. Metadata and Open Graph on every
route. Structured data: Organization on the home, Article on Insights
posts. sitemap.xml and robots.txt. Build, PR.
```

### 5.2 Cutover

No prompt. Checklist:

- [ ] Resend domain verified, `RESEND_FROM` is `@samuh.work`
- [ ] All env vars set on production in Vercel
- [ ] `LEAD_NOTIFY_TO` is Jake, CC is Mike
- [ ] Clarify key is the production key
- [ ] Domain added in Vercel, DNS pointed, SSL issued
- [ ] Old site left up at a staging hostname for a week
- [ ] Search Console verified, sitemap submitted
- [ ] Google Business Profile website field updated
- [ ] Training recorded
