# Decisions

Append only. Newest at the bottom. If you are about to relitigate something,
check here first, and if the decision genuinely should change, add a new entry
rather than editing the old one.

Format: date, decision, why, who.

---

**2026-09-10 — Education lives entirely inside Insights.**
No separate education hub, no page called "The Model". One less page to fill
with copy nobody has written. Wilfred proposed a standalone education page,
client rejected it. — Client

**2026-09-10 — Tier names are Self-guided, Supported, Guided.**
Not "Custom". Confirmed in the scope meeting. — Client

**2026-09-10 — Get Started is a CTA, not a nav item.**
The starting point is a section on the home page rather than a standalone
landing page in the navigation. — Client

**2026-09-16 — Phase 1 and Phase 2 language removed entirely.**
The engagement became a monthly retainer against one scope. Phased framing
implied a committed second engagement that does not exist. — Client

**2026-09-16 — The website is the primary focus and the confirmed deliverable.**
Marketing, landing pages, marketing technology and email marketing are
available within the same retainer as needed, but the site is what is
promised. — Client

**2026-09-18 — Proposal signed.**
$2,500/month for three months ($7,500), then $1,000/month minimum ongoing.
Site live by end of month three, conditional on assets arriving on agreed
dates. — Mike Gabour

**2026-09-22 — Git-based workflow on Vercel.**
Repo at github.com/MikeSamuh/samuhsite, deployed through SAMUH's Vercel Pro
team. Client owns the repo and the hosting account, which is the right end
state for a client-funded build. — Wilfred and Mike

**2026-09-23 — Mike's Claude-built prototype is reference, not the codebase.**
Taking over an undocumented generated repo is slower than starting clean, and
it would make every bug in it ours. Anything the client liked in it gets
rebuilt properly. — Wilfred

**2026-09-23 — All five design directions are dark.**
Dark was agreed in an earlier call as the luxury and thought-leadership look.
Light alternatives were offered and declined. — Client

**2026-09-23 — The palette is being set, not matched.**
SAMUH's brand book has no color codes in it; the hex fields are unfilled
placeholders. Whatever direction is chosen defines the brand's digital
palette. — Discovered during build

**2026-09-23 — The direction preview is a configurator, not five fixed looks.**
Background, accent and type move independently. The client was not going to
find one of five whole looks they liked completely, and splitting the axes
turns "none of these" into "that background with that yellow". — Wilfred

**2026-09-23 — Art direction is playful and organic, not corporate.**
The client's own framing: an onboarding process for new clients, but on
mushrooms. Constraint on it: they sell to Fortune 500 companies, so looseness
goes in the background, motion and line weights, and discipline stays in the
typography and spacing. — Client and Wilfred

**2026-09-23 — Sapien Labs is a credited partner throughout, not a footer
logo.** Named near the header logo, beside the data sections, and in the body
of the About page. It is also the research source the whole education layer
leans on. — Scope document

**2026-09-23 — Two accents, not one.**
The configurator picks Accent 1 (loud: buttons, Team circle, arc) and Accent 2
(quiet: eyebrows, links, tags). The client wants two colors to pick and choose
from rather than a single accent. — Client

**2026-09-23 — Ascent becomes Slate.**
Dark slate instead of black-to-charcoal, lighter at the top and darker as you
scroll. Void and Orbit were also indistinguishable, so Orbit's rings and arcs
were strengthened until they read. — Client

**2026-09-23 — Aurora is a lava lamp.**
Colors toned down and mixed into the base, movement is vertical rise and
sink rather than sideways drift. — Client

**2026-09-23 — The three circles are nested.**
The organization houses the team, the team houses the individual. Team is the
only accented circle because the team is the subject. Each circle has its own
slight movement. The client's sketch is the shape, not the look. — Client

**2026-09-23 — Effects are a dial too.**
Entrance and hover behaviour are chosen in the configurator alongside
background, accents and type. The style guide is choose-your-own-adventure
across every axis, not a fixed set of looks. — Client

**2026-09-23 — Orbit is out, Synapse is in.**
The client did not like the rings. Replaced with a faint network of nodes and
connections with travelling signals, kept subtle. Old orbit links resolve to
synapse. — Client

**2026-09-23 — Instrument Serif is out, Unbounded is in.**
Client rejected the serif. Replaced with a wide geometric display face, the
opposite kind of type, so the five pairings still cover the range. — Client

**2026-09-23 — Backgrounds should respond to scroll where they can.**
Chalk now changes as you scroll rather than sitting still. Aurora's lava lamp
motion was sped up from 44 to 58 second cycles to 24 to 30 so it is visibly
moving. — Client

**2026-09-24 — Round one feedback: Synapse, Magenta, Syne, Unblur, Glow.**
The client's link was `#synapse.pink-magenta.pink-magenta.syne.unblur.glow`.
They said they had used cyan as the second accent but found it hard to
choose, pointed at their own materials for it, and asked for classier fonts
with more options. — Mike Gabour

**2026-09-25 — The palette is sampled from the decks, not invented.**
The brand book has no codes, but the introduction deck and the Bangalore
keynote use `#FC0097` pink throughout, `#0CC0DF` cyan and `#48B1A5` teal as
second colors, and `#8243F6` violet as a chart frame. Those enter the picker
as-is where they pass contrast and the rest of each family riffs on them. The
blue family is retired in favour of cyan and violet; old ids redirect.
Supersedes the 23 September "set, not matched" entry. — Wilfred

**2026-09-25 — Type pairings come in two groups.**
Five refined pairings (DM Serif Display, Cormorant Garamond, Newsreader,
Manrope, Hanken Grotesk) sit beside the five expressive ones rather than
replacing them, because the client's pick was Syne and the ask was more
options, not different ones. — Wilfred

**2026-09-25 — Line weight is a dial.**
Backgrounds no longer carry their own thin and fat rules. Fine, Balanced,
Heavy and Marker are picked independently, default Balanced so every round-one
link looks the same as it did. — Wilfred

**2026-09-25 — The picker shows two named picks.**
Wilfred's recommendation and the client's own pick from 24 September, as
pressable cards, so the two can be flipped between. — Wilfred

**2026-09-25 — Three approaches as a dial: Modern #1, Minimal #1, Formal Bold.**
Composition is independent of color and type. Minimal is very few boxes,
light lines, black space. Formal Bold is contrast bands, big section numbers
and elegant line flow. — Wilfred

**2026-09-25 — Line width scales line weight in quarter steps, ×0.5 to ×2.**
Relative to the chosen preset so presets stay distinct. — Wilfred

**2026-09-25 — Formal type group added.**
Playfair Display, Libre Baskerville, EB Garamond, Bodoni Moda, after the
client asked for more formal choices. — Client

**2026-09-25 — Nothing is pushed until Wilfred says so.**
Local commits only. Recorded in CLAUDE.md working style. — Wilfred

**2026-09-25 — Accents 3 and 4 are optional slots with fixed jobs.**
Accent 3 is data (tags, numbers, signals), accent 4 is wash (tints only,
never text). Both default to none so the one-loud-color rule holds unless
the client opts in. — Wilfred and Claude

**2026-09-25 — Style locked from Mike's link.**
`#modern.void.pink-magenta.cyan-steel.marcellus.caption-gilda.heavy.scale-125.unblur.glow`.
Magenta primary, Steel cyan secondary, Marcellus / Inter, Gilda Display
captions, Heavy lines at x1.25, Unblur, Glow. Fonts they like: Manrope /
Inter and Marcellus / Inter. Background stays open. — Mike Gabour

**2026-09-25 — Layout is its own tool at /layout.**
Style is fixed there; the dials are background, frame (alignment, column
width, spacing, nav, dividers, numbers) and a variant per home section, with
three presets A Editorial, B Keynote, C Cinema. Viewport preview via container
queries. /design stays as the archive. — Wilfred

**2026-09-25 — The layout tool carries the whole sitemap.**
Solutions, Process, Insights, About, Contact and Get Started are composed
in /layout from the scope and brief, with the nav, footer and CTAs wired
between them. Confirmed material only; the rest is visible TODO(content).
Page is part of the hash (`page-<id>`). — Wilfred and Claude

**2026-09-25 — Composition is a dial: Editorial, Keynote, Cinema.**
Beyond the frame dials, each preset now builds sections differently.
Editorial: a sticky margin column carries the numbered section head beside
the content, hairlines, boxless cards. Keynote: every section fills the
view, centred, slide counter, no rules, menu nav. Cinema: alternating
full-bleed bands tinted by the wash, big accent numbers, imagery to the
edges, heavy left strokes. Presets set it; the client can mix. — Wilfred and Claude

**2026-09-27 — Editorial is the layout.**
Client feedback: "We like editorial. Testimonial should auto scroll.
Metaphor cards: remove text; click > zoom in to the image > reflection
prompts > option to submit answers to us > see what others said." — Mike Gabour

**2026-09-28 — Draft 1 lives at /draft-1 and is sculpted, not configured.**
Real routes (home, solutions, process, insights, about, contact,
get-started), the locked style, the Editorial preset read from layout.ts so
the tool and the draft cannot drift. Wilfred edits the draft directly from
here; the tools stay as reference. — Wilfred

**2026-09-28 — Drafts live under /draft, lettered A, B and C.**
/draft is the index: the style guide the drafts share, the three steps
(design, layout, drafts) and each draft in a frame at desktop, tablet and
phone width. /draft/a is what was /draft-1, /draft/b starts as a copy for
Wilfred to sculpt, /draft/c is the eight-section restructure from the
homepage review (thesis once, model before proof, one taxonomy, one ask).
Wilfred works A and B, Claude works C. /draft-1 redirects. Supersedes the
earlier entry today. — Wilfred

**2026-09-28 — Draft A is sculpted from the signed scope.**
/draft/a keeps the twelve sections, the scope order and the Editorial
frame, and gets its own Home.tsx like C so it can be edited directly.
Per section, what the scope asks for that the baseline did not show: the
partner credit beside the header logo, the equation as a visual with hover
definitions and the Sapien Labs credit, the data tool with working sliders
and the optional email for the breakdown offered after, the closing call to
action with the assessment first then booking before the form, the one
testimonial and the case snippet SAMUH has published in its own decks, and
visible TODO(content) where the research claim, the estimate and the
remaining testimonials are theirs to supply. The word and the circles stay
shared with B and C. B stays on the shared sections. — Wilfred and Claude

**2026-09-30 — Leads go to Clarify.**
SAMUH's CRM is Clarify (clarify.ai), owned by Jake. Every capture point posts
through one server route to the Clarify API, with email fallback so an outage
never loses a lead. Resolves the open lead-destination item in the scope.
— Client, confirmed by Wilfred

**2026-10-01 — Draft B is the direction.**
Three full drafts were built at /draft/a, /draft/b and /draft/c. B is the one
the client is reacting to and the live working draft. A and C retire and get
deleted when B is promoted to the root. — Client

**2026-10-01 — Sapien Labs credit is text only in the header.**
"Partnered with Sapien Labs" next to the SAMUH logo. No Sapien icon, no second
logo. — Client

**2026-10-01 — Process page covers the three initial phases.**
Not all six stages. Content expanded on those three, from Calina. The six
stage arc at the bottom of the page is removed. — Client

**2026-10-01 — Three lead capture flows.**
Contact form on /contact, TeamQ teaser into contact on /, and Talk to us
booking on Jake's calendar from /solutions and /. Replaces the seven capture
point table in the original scope as the primary structure. — Wilfred

**2026-10-01 — The homepage scroll gets shorter.**
Sections combined or removed. The twelve section list in the scope is the
source to cut from, not the target. — Client

**2026-10-05 — Intake decisions.**
Teaser shows all eleven simulator inputs, free exploration, no game, no
optimizer; productive days is the headline; model is ported from the
samuh-dashboard repo, which we have access to. Contact select is "What
brings you here" (general, solutions, partnership, other); speaking and
keynote path dropped. Booking is Google Calendar appointment schedules, not
Cal.com; qualifying questions live on our form first, then the embed. Every
intake emails Jake with Mike in CC; Clarify is additive. — Wilfred

**2026-10-05 — The TeamQ teaser gets its own page, /teamq.**
An intro on what the tool is and how SAMUH uses TeamQ in its process, then
the tool. Results are never gated; the ask is optional, for visitors who are
intrigued. "Get Started" becomes "Explore TeamQ" everywhere and points to
/teamq. Home section 9 becomes a pitch and a button. Intro copy is our draft
until the client supplies theirs. A page outside the signed scope, accepted.
— Wilfred

**2026-10-05 — A lead that reached nowhere is an error, not a success.**
/api/lead returns ok unless every configured sink failed. Then it logs the
lead, returns 502, and the form shows an error with the mailto. One sink
failing still reads as success to the visitor. — Wilfred

**2026-10-05 — Name is optional on the teaser ask, for now.**
Required on contact and talk. Revisit when we have Clarify API access and
know what the person record needs. — Wilfred

**2026-10-05 — No dates on milestones. The Noom-style intake is the TeamQ
explore tool.** Milestones close on their "done when" line, not a week.
The only date is the three month term. The intake assessment from scope
section 4 and the interactive data tool from section 9 are one component:
the teaser, with insights and testimonials interlaced Noom-style. Motion is
built section by section as we go, not as a separate pass. — Wilfred

**2026-10-05 — The working draft replaces B as the draft that moves.**
/draft/working is created as an exact copy of Draft B on this date: same
layout hash, nav, copy overrides and pages. From here on every edit lands on
the working draft. B at /draft/b is frozen as the reference the client
reacted to on 1 October, so the two can be compared side by side. A and C
stay retired and are deleted with B when the working draft is promoted to the
root. Supersedes "Draft B is the direction" as the place edits go; the
direction itself is unchanged. — Wilfred

**2026-10-05 — The teaser is a copy of the simulator, models included.**
We take samuh-dashboard as deployed on Railway and run the same scoring on
our own server, on the dummy team only. The two LightGBM models are exported
into the site repo. No proxy to Railway, no approximation. — Wilfred

**2026-10-07 — Process figures morph stage to stage, on the working draft.**
The three process stages use Wilfred's two-figure icons (Discover 2, Align 2,
Belonging 2 as Co-create), traced to SVG. As each stage scrolls in, its figure
morphs out of the previous stage's: heads first, bodies follow, at
`--dur` x 2.5 on `--ease`. No animation library: the morphs are precomputed
point rings in `src/components/process-figure/morphs.ts`, generated by
`scripts/figures/` and lazy loaded. Reduced motion shows the rest pose.
Behind the `figures` flag in drafts.ts, so frozen B keeps its PNGs. Replace
with a Rive rig of named parts if the client wants richer motion. — Wilfred

**2026-10-10 — The teaser follows the dashboard: new sample team, lifestyle
on 1 to 9, capacity to perform instead of TeamQ.**
The demonstration team is the client's `new_sample_20.csv` (20 people; 10
and 5 person files were supplied too). The source is now the dashboard repo
at `53eb9f8`, the v2 app with the 9-point scale, not the older simulator on
Railway. Lifestyle factors are sliders on the same 1 to 9 scale as the work
factors. The readout is productive days per month and capacity to perform,
drawn on the dashboard's six-band MHQ scale as the client's desktop shows
it; the TeamQ number is gone. Figures anchor to what the team measured plus
the model's change, the dashboard's own rule. Flexibility over Work and
Sleep are in the sample but not in the models, and Job Security is in the
models but not in the sample, so none of the three is a slider. — Client,
via Wilfred

**2026-10-10 — The tool in one fold: readout left, sliders right, no
baseline averages.** Productive days and capacity to perform sit on the
left with the team line; the ten sliders on the right in two columns,
lifestyle under the work factors. "Baseline avg" is gone from under the
sliders, it did not help tell the story. Open: whether the education moves
from the scroll tour into popups beside the readout and the groups, so it
reads the same on mobile. — Client

**2026-10-12 — The shorter home, on the working draft.** The order is
hero, the leak line with the dictionary beside it, where we focus, the
tool, the metaphor cards, testimonials, the research claim with the case
study, and the close. Where we focus now carries the Aspirational section:
the nested circles stay as they were, with no highlight on the individual
or the organization, and as you scroll they become a four-way Venn of
Cognitive, Relational, Emotional and Physical capacity with the SAMUH mark
at the centre; the four definitions show on hover or tap. "Aspirational
moment" and its eyebrow are gone. The research claim opens the case study
section. The equation section is off. The hero's background is the client's
network video, a stand-in until the film, not committed. — Client

**2026-10-12 — The home flow, second pass, on the working draft.** The
dictionary comes first, straight under the hero, as one row: the word, how
to say it and its origin on the left, the sense on the right. The leak line
follows as its own section. Where we focus opens as "Where others focus"
with only the individual and the organization drawn; scrolling, the team
circle grows in and the head becomes "Where we focus"; scrolling on, the
Venn arrives under "SAMUH works at the centre", with the supplied star at
the middle. The eyebrows on those heads are gone. Hover in the Venn lights
every circle under the pointer with a light fill of its colour, so a lens
shows both of its circles and a third colour where the fills meet; the star
follows the pointer on a short tether and never leaves the lens. The tool
section asks for the assessment: "Find out where your team is leaking",
with the button "Get your team's assessment". — Client

**2026-10-14 — The metaphor cards: one card, one question, then the door.**
Asked what the cards are for, a read on how people see their team or a way
in to a conversation, the client said both: start with the Rorschach, and
if they want to talk to us after, a button. So the working draft shows one
card at a time, drawn at random on each visit, no counter and no card
title: the question "How does this relate to your team?" is the head, one
box, "Share anonymously". "View responses" flips the card and what others
said is on its back; "View another card" moves on; a thank-you line after
sharing carries the link to talk to us. The three-prompt gallery stays as
the gallery variant, which B keeps. Nothing is stored yet: the lead route
needs a reflection flow, and the responses on the back are samples.
— Client, Wilfred

**2026-10-14 — FAQ and the footer, on the working draft.** Ten questions
sit before the close, one open at a time, written from the brief and the
confirmed content only and marked for SAMUH to approve. The section is
opt-in, so B does not get it. The footer carries the logo, the line, a
sentence on what SAMUH does, the Sapien Labs mark, and three columns:
Company, Resources (Insights, TeamQ, the Work Culture Report, the Human
Expansion channel) and Talk to us. Privacy, Terms and Cookies are links to
pages that do not exist yet. — Wilfred

**2026-10-13 — Home, third pass, on the working draft.** Where we focus
opens from a dot, the individual at the organization's centre, and the
head and key sit in a left column level with the picture, under the eyebrow
"What makes us different", with "others" and "we" in the primary and the
Venn headed "We consider all aspects"; the key shows the
individual and the organization first and the team alone once it arrives;
hot circles fill in their colour, the secondary for the two nested ones,
yellow for Physical; the track is long enough to hold each state. The
dictionary and the leak line fade up on entry under hairline rules. The
tool's demo lists every factor, the three movers first, the rest fading
out, with no pause over half a second; the pitch line is gone and the
button asks for the assessment. The case study takes the report's shape
beside it, its cover the mark and the tag on black, with one download link
each and no link to sapienlabs.org on the home. The close keeps its
question and the buttons, no sub line. — Client

**2026-10-12 — Insights migration: migrate all 21 live posts, keep the Sapien Labs report link.**
The live samuh.work Insights has 18 Human Expansion episodes (YouTube
embeds with Rahul's intro blurbs), three SAMUH articles from May and June
2025, and a link to the Sapien Labs Work Culture Report. All carry over with
Rahul's own copy, the blurbs kept as "From Rahul" on each episode, and
redirects from every WordPress slug in `next.config.ts`. The Drive folder
holds the raw assets behind those posts plus unpublished writing, which
sits in the repo as drafts for Rahul's approval. — Wilfred

**2026-10-12 — hello@samuh.work is the public address and where leads
go.** Shown wherever the site offers an email, and the launch value for
LEAD_NOTIFY_TO. The partner line by the mark reads on two lines. The home
demo's pitch asks for a TeamQ assessment rather than describing the demo.
— Client

**2026-10-12 — Ship Insights with the 21 posts that are already public. MDX, no CMS for launch.**
The 18 episodes, the three 2025 articles and the Sapien Labs report link,
exactly what samuh.work shows today, built at /insights as a live route in
the working draft's shell like /contact and /teamq. The nine unpublished
pieces from the Drive stay in the repo as `draft` and `review` and do not
render until Rahul says so. Content is MDX in `content/insights/`, read at
build time; a CMS is a retainer item after launch. — Wilfred


**2026-10-13 — The teaser ask is a two-step B2B intake.** Work email
first, posted at once so Clarify has the person; then name, company and
role, with the company guessed from the email's domain for the visitor to
correct. Light on purpose: no phone, no team size, no message. No prefill
from Clarify: a public form that shows what the CRM knows about an email
address would show it to anyone who typed that address. Clarify's own
enrichment on their side does that job. — Client, via Wilfred

**2026-10-13 — The teaser follows Jerzy's tested baseline, commit 1703158.**
From his 9 and 13 Oct emails to Mike: models retrained on lifestyle 1 to 5;
the models' second input is Flexibility over Work, not Job Security, so
Flexibility over Work is now a slider and Job Security stays out with Sleep,
both display-only in the dashboard; days lost counts a day unable as 1 and
a day of reduced output as 0.3, so the demo team's productive days read
16.5, not 11.6. The demo file is his `sample_20.csv`, real respondents
matching the population; the file Mike sent on 13 Oct is the same one. —
Jerzy and Mike, via Wilfred

**2026-10-13 — Leads go to Clarify through our own server route.** Mike
supplied an API key. `src/lib/clarify.ts` upserts the company on the email
domain, the person on the email with job title and company, and leaves the
rest of the form as a note on the person. Nothing is prefilled from Clarify
on the public site. Needs the workspace slug set as CLARIFY_WORKSPACE
before it does anything. — Mike, via Wilfred

**2026-10-14 — /teamq: the meter, and the tour on the whole tool.** Capacity
to perform reads as points from Thriving with a half-circle meter from -100
to 200, the six bands along it and a needle at the figure, the way the
client's dashboard draws it; the band column is gone. The page is hero,
what TeamQ is, then one frozen copy of the tool pinned while four steps
light its parts with their explanations, then the tool. The separate
readout tour and the factors section are gone. Sleep stays out of the
sliders: the dashboard shows it but its models do not use it (Jerzy,
9 Oct), so a slider would move nothing. — Client, via Wilfred

**2026-10-21 — The site gets its own admin at /hq-7h3k, and it replaces the
Sanity plan.** Magic-link sign in for the team (ADMIN_EMAILS in Vercel), four
tabs: Content, every page's copy as fields, page by page; Blog, a rich text
editor for Insights with one-step YouTube embeds, publishing beside the MDX
posts; Brand, the style guide read from the tokens; Analytics, GA4 through
the Data API, with Vercel Analytics linked. Content and posts live in
Upstash Redis, images in Vercel Blob, both set by env. Supersedes the 12
October "Sanity after launch" default. Rule 5 stands for visitors; this is
staff access. — Wilfred

**2026-10-21 — The working draft is the site. Drafts, `/design` and `/layout` removed.**
Home, About, Process and Solutions moved from `/draft/working` to the root,
in a `(site)` route group whose layout renders the one shell. The working
draft's entry in `drafts.ts` became `src/lib/site.ts`; A, B and C are in
git history before this date, which is where "frozen for comparison" now
means. Every old URL redirects. Done ahead of the SEO pass, because nothing
in it counts on URLs under `/draft`. — Wilfred

**2026-10-21 — Internal links are links.** Nav, footer and every CTA were
`href="#"` with a router push, which a crawler reads as a site with no
internal links. All of them are `<Link href>` reading `ROUTES` in
`site.ts`. Privacy, Terms and Cookies land on Contact until counsel's pages
exist, rather than nowhere. — Wilfred

**2026-10-21 — Search and sharing in one place.** `pageMeta()` in
`src/lib/seo.ts` gives every page its title, description, canonical URL,
Open Graph and Twitter card; the default card is drawn at `/og.png` from
the logo and the thesis line, posts use their cover. Structured data:
Organization and WebSite on every page, FAQPage on the home, Article or
VideoObject plus breadcrumbs on each post. `/sitemap.xml`, `/robots.txt`
and `/llms.txt` are generated. The thirty-one configurator fonts dropped to
the four the locked pairing uses, and the hero carries a poster frame so
the LCP is a still, not the film. — Wilfred

**2026-10-21 — `/talk` built to Flow 3 in sprint-intakes.md.** It was
linked from the contact and teaser success blocks and did not exist.
Qualify (name, email, organization, team size, what to change, `?tier=`),
post to `/api/lead` as `flow: "talk"`, then the Google booking embed from
`NEXT_PUBLIC_BOOKING_URL`, a placeholder until Jake's schedule link lands.
— Wilfred
**2026-10-23 — The metaphor cards are a deck you shuffle and draw from.**
Arrive on a pile of card backs with the star on each; Shuffle; "Pick a
card"; the card you pick lifts out of the pile and turns over, then "How
does this relate to your team?" and the box come in beside it. What a
visitor shares is now stored, anonymous (the card, the words, the time),
and lands on a fifth admin tab, Responses, where the team shows it on the
back of the card, deletes it, or writes one of its own. The Content tab's
Metaphor cards group went with this: the words beside the deck are in the
code. — Wilfred

**2026-11-02 — Three measures, one door, and the platform is a separate
build.** Mike and Jake's whiteboard: LeadQ (free, the leader alone, the
hook), TeamQ ($99 per team, the product; the services are the high-ticket work), OrgQ ($10 per person, packages), and under them
the 90-day cycle as DIY, Supported and Guided, Advisory, and keynotes and
workshops. The site sells the ladder; a platform at `platform.samuh.org`
(their `samuh-platform` repo, Supabase) will run the surveys and hold the
account, with the `samuh-dashboard` repo as the scoring engine. Neither
exists for customers yet. On the site: `/solutions` opens with three Assess
cards, then the cycle tiers (renamed DIY, Supported, Guided), then à la
carte; every "Explore TeamQ" button is "Get started" and lands on `/start`,
a fork of LeadQ, TeamQ, OrgQ, and a login that appears once
`NEXT_PUBLIC_PLATFORM_URL` is set. Until then LeadQ and TeamQ open a short
form posted as `flow: "start"` with the door as `intent`; the Solutions
email ask now really posts, as `flow: "solutions"` with the `pick`. Prices
are the whiteboard figures on Wilfred's call, swapped when confirmed in
writing; Guided's price is a visible TODO because the board reads "$200".
Account order agreed for the platform: LeadQ runs first and the email that
unlocks the result creates the account by magic link; TeamQ signs in first.
The site keeps hard rule 5: no accounts here, the platform owns them.
— Wilfred

**2026-11-02 — The home after the client's copy review (Notion, "Website
text").** Their words, taken as written: the partner line is "In partnership
with Sapien Labs"; the headline is "Great team environments sustain high
performance." with "Samuh uses scientifically validated measures to reveal
your team's hidden performance tax and helps build practices that reduce
it." under it; the circles section is "The overlooked performance driver",
"Where organizations focus" (enterprise, then individual) becoming "Where
performance happens" (team), with their three lines, and the third move,
the four capacities, is gone; the TeamQ head is "Find your team's hidden
performance tax". "Enterprise" is their word for that one line, an
exception to rule 6. Look and feel: no cyan markup anywhere (one colour),
the definition of Samuh is a plain line with no number or indent, and the
"leak" line leaves the top screen: it is now the thesis band below the
circles, reworded around the performance tax and thriving. The TeamQ
section is the whole of /teamq in place of the demo and its button, so the
tool is usable on the page; /teamq stays as its own page. Santosh's email
is the first testimonial, title and organization pending. Not done: the
pronunciation re-record (an audio file from the client) and the
"connecting line instead of labels" idea for the circles. — Wilfred

**2026-11-02 — Mike's call: one call to action, the free LeadQ.** The
funnel narrows: the nav button, the footer, the close and the button under
the tool all say Take LeadQ and go to the LeadQ door (`LEADQ_HREF`, the
platform once it exists). `/start` stays as the fork behind the Solutions
cards. The home loses the TeamQ explainer: the tool sits straight under the
circles with its head and one button, and a quiet link to `/teamq` for the
visitor with questions. The thesis band goes. TeamQ is $99, settled by
Wilfred after the call, and LeadQ is gated: email and magic link first,
then the questions, so the instrument is never public. Owed: a third scroll
in the circles for the performance tax, and the domain migration runbook
for the week of 9 November. — Wilfred

**2026-11-02 — Start here, two choices.** The nav and footer button is
"Start here" and opens `/start`, which now offers two things: take the
assessment (LeadQ, free; the TeamQ words when the TeamQ card on Solutions
sent them) or talk to us. OrgQ and everything else is a conversation. The
home's close keeps its two buttons, LeadQ and Talk to us. The synapse
field came off the close, which keeps the band's gradient. The circles'
head no longer sticks under the nav (an editorial rule was outranking the
section's own), and the text swap runs in three beats so nothing
overlaps. — Wilfred

**2026-11-03 — The intake is one email box.** `/start` asks for a work
email and nothing else. Once the platform exists the address goes there
with the intent and the platform sends the magic link that signs the
person in as a free user and starts LeadQ. Until then the address posts to
`/api/lead` as flow `start` (name no longer required for that flow) and the
thank-you says the link is on its way, so SAMUH has to send it by hand
from the notify email. The nav and footer button is "Let's talk" and opens
`/contact`, which now offers the same email box beside Jake's calendar
(the `/talk` booking embed, a visible TODO until `NEXT_PUBLIC_BOOKING_URL`
is set), with the direct details under both. The general inquiry form came
off `/contact`; `ContactForm` stays in the tree, unused. The two-door
`/start` of 2 Nov is gone with its component. — Wilfred

**2026-11-03 — No `/start`, no `/talk`.** The email box lives where the
person already is: on the home under the tool, as the call-out's own box
(`/#assess`); under the three measures on Solutions, opened in place by the
LeadQ and TeamQ buttons with the intent set; and on `/contact` beside the
calendar. OrgQ's button and every "Talk to us" go to `/contact`. Both
retired paths redirect. The booking embed moved from the talk component
into `src/components/contact/Booking.tsx`. — Wilfred

**2026-11-06 — The home tells the chain, then asks.** The circles beat
gains a fourth move in three steps: the team circle becomes three hollow
people, water rises through all three as one level (a struggling team
environment, a managing one, a thriving one, when the team is full), the
TeamQ meter steps through the same three MHQ windows in pink to cyan,
and a readout gives each step's days lost and the performance tax per
person per year, from the client's sheet ("Copy of Samuh Graph Base
File", rows 4, 8, 13, in `src/lib/performance-tax.ts`). Per person at a
$115,000 fully loaded cost, never the sheet's org-wide column. The
Thriving step says the tax is gone and still shows its residual, since we
never claim zero. The ask ("Find your team's hidden performance tax",
the tool's words) follows under the people, so the tool section and the
close came off the page; the way in is `/contact#assess`. The metaphor
cards came off the home the same day to a landing page of their own,
`/l/metaphor-cards`, listed in the admin's new Landing pages tab. Order:
hero, meaning, circles, testimonials, case study, FAQ. — Wilfred

**2026-11-06 — The Solutions call: Methodology, the four stages, Solutions in sections.**
Jake, Rahul and Wilfred. The spec is `docs/sprint-solutions.md`, with the
source of every line and number. What was decided:
Process becomes Methodology at `/methodology`, research and science up
front, `/process` redirecting. The 90-day journey is Discover (pre-work),
Align, Co-create, Ritualize, the three-pager's words, with the TeamQ
baseline inside Discover, and a star that moves across the steps.
Solutions stays one page, in sections, reached from a nav dropdown: who
Samuh works with (leaders, teams, organizations, Rahul's whiteboard), the
assessment for each in the same order (LeadQ, TeamQ, OrgQ) drawn on the
org structure, the sprints, then keynotes and workshops. "Self-guided",
never "DIY". Executive Team Sprints are the main offering and a sales
conversation: no checkout, no public price. Coaches and consultants are
an audience. A careers page the team can post to from the admin. The
Sapien Labs graphs, redrawn in the brand, on Methodology, once Jake sends
which ones. The home ask takes an email, then hands off to the platform.
Every change is built from the sections, classes and tokens the site
already has (Wilfred, 10 Nov).
Not decided: the hero line. "Great team environments sustain high
performance." stays as the placeholder. Open, with defaults in the spec:
the nav label (Methodology), Careers under About and not in the top nav,
and the site's domain, which this sprint does not change. — Client and Wilfred

**2026-11-11 — The sitemap: who we work with on the home, the stages on Solutions.**
Wilfred's sitemap doc of 11 Nov ("SAMUH Site Map", Drive), with his answers
the same day. Where it and `docs/sprint-solutions.md` differ, it wins.
Home: hero, what Samuh means, who we work with (the org chart, id `who`),
the circles and the overlooked performance driver with the email ask,
testimonials, case study, FAQ. The closing block of three links is off.
Methodology: head, the science, the path. Research first; the four stages
left the page.
Solutions: head, team sprints (`sprints`: Self-guided, Supported, Executive
Team Sprints, then how a sprint runs, the four stages, id `how`),
assessments (`assess`), workshops and keynotes (`workshops`). Who we work
with left for the home. The Talk to us form and the testimonials at the
foot are off, since the sitemap does not list them: every ask goes to
`/contact`.
Nav dropdowns follow the pages: Solutions is Team Sprints, Assessments,
Workshops & Keynotes; Methodology is The science, The path. The Work
Culture Report is off the dropdown and stays in the science section and
the footer.
Confirmed by Wilfred the same day: the Methodology dropdown, and the
Solutions form and quotes staying off. New copy for the Solutions head and
the sprints title, which still assume the assessments come first, is the
client's to supply.
Who we work with (the eyebrow; "Who we support" for an hour, then back)
is a pinned beat ahead of the circles, three screens of scroll at most (`src/components/focus-morph/Who.tsx`): the title is "Leaders,
Teams, and entire Organizations.", and one line for each level takes its
turn on the left with its open word shifting through the people it stands
for, while the picture goes from one person to three to several teams,
which then fall into a dot, the one the circles grow from. The lines are
Wilfred's. Owed by Rahul: more of what team leaders are curious about
(two words so far). — Wilfred
