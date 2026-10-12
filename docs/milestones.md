# Milestones

No dates. Each milestone is done when its "done when" line is true, and the
next one starts. Motion is built as we go inside whichever milestone the
section belongs to, not as its own pass.

The term is three months from 22 Sep 2026 and the site is live at the end of
it. That is the only date, and it lives in the proposal.

Runbooks: `docs/sprint-intakes-runbook.md` for M1,
`docs/milestones-runbook.md` for the rest.

---

## M1. Intakes

Spec: `docs/sprint-intakes.md`.

- [ ] Lead plumbing: `Lead` type, `deliver()` (notify Jake, CC Mike, Clarify
      additive), `/api/lead`, form primitives, spam, UTM, GA4 events
- [ ] Flow 1, `/contact`
- [ ] Flow 2, TeamQ explore tool in section 9 of the home. Model ported from
      `samuh-dashboard`. Noom-style: insights and testimonials interlaced as
      the visitor moves the sliders
- [ ] Flow 3, `/talk`, qualifying form then the Google Calendar booking embed
- [ ] `/thank-you`
- [ ] Drafts A and C deleted. B stays frozen until promotion
- [ ] "Partnered with Sapien Labs" as header text, Sapien icon removed
- [ ] Arc section removed from Process
- [ ] Clarify filled in once Jake cuts a key

**Done when:** a visitor can do all three flows on the preview URL, Jake and
Mike get the email each time, and the teaser shows real numbers from the
ported model.

---

## M2. Working draft revision

Everything else from the 1 Oct call. All of it lands on `/draft/working`,
the copy of B made on 5 Oct. B itself does not change.

- [x] Home scroll shortened, first pass 12 Oct: eight sections, see
      `docs/decisions.md`. The twelve in `docs/scope.md` were the list to
      cut from
- [ ] Process page rebuilt around the three initial phases, content from
      Calina
- [ ] Process icons redrawn to read as group and team
- [ ] Alternative brand mark and favicon, a few iterations for the client
- [ ] Metaphor cards: illustrator onboarded to Drive and the draft, style
      agreed, first cards in
- [ ] Vercel Blob store created by Mike, images and headshots moved to it
- [ ] Team headshots in

**Done when:** Mike signs off the revised draft on the preview URL.

---

## M3. Copy

- [ ] Script call. Hero video script and site copy on the same line
- [ ] Hero line and the research claim confirmed by Rahul
- [ ] Real copy in every section. Every `TODO(content)` resolved
- [ ] Team bios
- [ ] Testimonials and case study snippets cleared for publication. Sankora
      contract checked
- [ ] Teaser explanatory copy, and the insight and testimonial lines it
      interlaces
- [ ] Contact page email, Google Voice number, response time
- [x] Insights: transcripts and posts for episodes 1 to 18, 12 Oct 2026.
      Rahul to review summaries and confirm which of 1 to 10 stay
- [x] Insights: written pieces from the Drive folder. Three articles for
      review, six drafts needing Rahul's approval (HBR outline, five
      booklet chapters). 12 Oct 2026
- [ ] Insights: four videos not on YouTube (Leaders Lounge keynote,
      Wellbeing=Performance, HR Academy Welcome, 1st Email video) and the
      2024 Summit deck. Wilfred downloads from Drive, SAMUH uploads the
      videos to YouTube, then transcribe and post
- [x] Video hosting: all eighteen episodes are on the Human Expansion
      YouTube channel, URLs in the post frontmatter
- [ ] WordPress migration decision: migrate all, curate, or leave. Redirect
      list either way
- [ ] CMS decision. See below

**Done when:** `grep -r "TODO(content)" src/` returns nothing.

**CMS.** The scope says Insights is CMS driven so SAMUH publishes without a
developer, with recorded training at handover. Not yet scheduled. Two ways:

- MDX files in the repo for launch. Wilfred publishes. CMS added on the
  retainer after launch
- Sanity now. Free tier, two to three days to wire, SAMUH publishes from
  day one

Decide during M3. Default if nobody decides: MDX for launch.

---

## M4. Promotion and polish

- [ ] Working draft promoted from `/draft/working` to the root. `/draft`, A, B and C removed
- [ ] Intake flows re-tested on the root
- [ ] GA4 with conversion events on form, booking and teaser submit
- [ ] LinkedIn Insight Tag. Meta pixel if asked
- [ ] Cookie consent, required before any tag fires for EU visitors
- [ ] Motion pass across every section: shared entrance and reveal system,
      reduced motion respected everywhere
- [ ] Chrome, Safari, Firefox, Edge. Desktop and mobile
- [ ] Lighthouse performance 90 or better on throttled mobile. LCP under 2.5s
- [ ] WCAG 2.1 AA: keyboard, focus states, semantic structure, contrast
      across the dark palette
- [ ] Logo SVGs optimised or redrawn

**Done when:** the root is the site and it passes the quality bar in the
scope.

---

## M5. Launch

- [ ] Redirects from every old URL
- [ ] Metadata, Open Graph, structured data for articles and organization,
      sitemap, robots
- [ ] Resend domain verified so email sends from `samuh.work`
- [ ] Domain cutover
- [ ] Google Search Console and Google Business Profile
- [ ] CMS or publishing training recorded for SAMUH
- [ ] Hours allowance for the ongoing retainer agreed in writing

**Done when:** samuh.work serves the new site.

---

## Client owes

| Item | Owner | Blocks |
|---|---|---|
| Clarify API key, workspace slug, custom attributes | Jake | M1 Clarify step |
| Google Calendar appointment schedule, Intro call, 30 min | Jake | M1 Flow 3 |
| SAMUH email, Google Voice number, response time | Client | M3 |
| Process page content, three sections | Calina | M2 |
| Illustrator onboarded | Mike or Calina | M2 |
| Vercel Blob store | Mike | M2 |
| Team headshots | Each team member | M2 |
| Hero line and research claim | Rahul | M3 |
| Sankora clearance | Rahul | M3 |
| Testimonial attributions | Client | M3 |
| WordPress migration decision | Client | M3 |
| Font licence | Mike | M3 |
| GA4 property and LinkedIn Insight Tag ID | Client | M4 |
| Resend DNS record | Mike | M5 |
| Registrar and DNS access for cutover | Mike | M5 |

## Open

- Hours allowance in the $1,000/month ongoing tier is not numbered
- Drive scope document still carries Phase language in sections 1, 4 and 13
