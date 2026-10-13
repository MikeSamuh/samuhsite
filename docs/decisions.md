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
