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
SAMUH's brand book has no colour codes in it; the hex fields are unfilled
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
(quiet: eyebrows, links, tags). The client wants two colours to pick and choose
from rather than a single accent. — Client

**2026-09-23 — Ascent becomes Slate.**
Dark slate instead of black-to-charcoal, lighter at the top and darker as you
scroll. Void and Orbit were also indistinguishable, so Orbit's rings and arcs
were strengthened until they read. — Client

**2026-09-23 — Aurora is a lava lamp.**
Colours toned down and mixed into the base, movement is vertical rise and
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
second colours, and `#8243F6` violet as a chart frame. Those enter the picker
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
Composition is independent of colour and type. Minimal is very few boxes,
light lines, black space. Formal Bold is contrast bands, big section numbers
and elegant line flow. — Wilfred

**2026-09-25 — Line width scales line weight in quarter steps, ×0.5 to ×2.**
Relative to the chosen preset so presets stay distinct. — Wilfred

**2026-09-25 — Formal type group added.**
Playfair Display, Libre Baskerville, EB Garamond, Bodoni Moda, after the
client asked for more formal choices. — Client

**2026-09-25 — Nothing is pushed until Wilfred says so.**
Local commits only. Recorded in CLAUDE.md working style. — Wilfred
