# Design system

## Status

**Round two, nothing locked yet.** `/design` is a configurator with seven
independent dials, a choose-your-own-adventure style guide. The client picks a
background, two accents, a type pairing, a line weight, an entrance and a
hover behaviour, and the URL records the exact combination.

`/design#synapse.pink-magenta.cyan-samuh.dm-serif.balanced.unblur.glow` is a
real, shareable state. Order does not matter, round-one links without a weight
still resolve, and so do the original three-part links.

The dials live in a left rail that minimises. It opens with two pressable
cards, Wilfred's recommendation and the client's own pick from 24 September,
then the choose-your-own-adventure dials. The page to the right is the
preview, with a top nav example and the logo at the top. Both cards are the
`PICKS` constant in `tokens.ts`. Arriving without a hash shows the
recommendation.

Round one (23 September) the client landed on
`#synapse.pink-magenta.pink-magenta.syne.unblur.glow`, said they had used cyan
as the second accent but struggled to choose it, and asked for classier type.
Round two answers that: a cyan family sampled from their decks, five refined
pairings, and line weight as its own dial.

After selection:

1. Cut `tokens.ts` down to the chosen background, accents, pairing and effects
2. Trim `layout.tsx` to the two or three faces that pairing uses. Nine families
   load right now purely so the preview can switch without a flash. That is not
   a production font budget
3. Promote the tokens into `globals.css` under Tailwind's `@theme`
4. Keep the winning `Backdrop` case, delete the rest
5. Delete `src/app/design/`
6. Record it in `docs/decisions.md`

## The palette is inherited from the decks, not the brand book

SAMUH's brand book contains no colour codes. The fields are unfilled
placeholders reading `Color 1: #HexCode (RGB: R, G, B)`. The only defined values
are black and white.

Their decks do carry colour, consistently. Reading the fill operators out of
the two PDFs in the reference folder:

| Source | Hex | Where |
|---|---|---|
| Introduction deck (July 2026) and Bangalore keynote | `#FC0097` | The pink, on nearly every page of both |
| Bangalore keynote | `#0CC0DF` | The cyan, the keynote's second colour |
| Introduction deck | `#48B1A5` | The teal, the introduction's second colour |
| Performance-levers chart screenshot | `#4394AF` | The bar colour |
| Performance-levers chart screenshot | `#8243F6` | The frame around the chart |

Those go into the picker as-is where they pass contrast, and the rest of each
family is a riff around them. The scope document says dark mode with pink,
blue and yellow accents on a black and white base, and that still holds.

## Axis 1: backgrounds

All dark. Each carries its own radius and motion character, so the background
choice also sets how the whole thing behaves. Line weight used to come from
the background too; it is now its own axis.

| # | id | Name | Treatment |
|---|---|---|---|
| 1 | `void` | Void | Pure black, nothing behind the content |
| 2 | `slate` | Slate | Dark slate, not black. Lighter at the top, darker as you scroll |
| 3 | `aurora` | Aurora | Toned-down colour rising and sinking under grain, lava lamp style, 18 to 23 second cycles. Each blob also parallaxes with scroll |
| 4 | `chalk` | Chalk | Blackboard. Changes with scroll: the board cools, the wiped dust drifts past, a chalk line along the bottom fills with progress |
| 5 | `synapse` | Synapse | A faint network of drifting nodes and curved connections with signals travelling along them. Nodes parallax with scroll at their own depth |

Synapse replaced Orbit after the client rejected the rings. It is the
creative-freedom slot: teams as a nervous system, where the connections are the
point. It has to stay quiet or it becomes a tech-company node graph.

Aurora is the most direct answer to "on mushrooms" and also the highest craft
cost. Watch legibility on it above everything else.

## Axis 2: accents

Four families, three hues each. Every one clears 4.5:1 against the darkest
stage (Synapse, `#04060A`), so all twelve are safe for text and not only
decoration.

| Family | Hue | Hex | Character |
|---|---|---|---|
| Pink | Samuh | `#FC0097` | Sampled from the decks. Loudest, and already familiar to their audience |
| Pink | Magenta | `#D946A0` | Deeper, more adult, better next to a client logo wall. The client's round-one pick |
| Pink | Rose | `#E28BA8` | Muted and editorial |
| Cyan | Samuh | `#0CC0DF` | Sampled from the keynote. Cold and bright, reads as a signal beside pink |
| Cyan | Teal | `#48B1A5` | Sampled from the introduction deck. Greener, calmer, the nearest true complement of magenta |
| Cyan | Steel | `#4394AF` | The levers-chart bar colour. Most muted, sits behind the pink |
| Violet | Ultraviolet | `#8F55FF` | The chart frame `#8243F6` lifted one step to pass 4.5:1. Pink's neighbour, so the pair reads as one glow |
| Violet | Periwinkle | `#8B8BFF` | Blue drifting into violet. The strangest one |
| Violet | Lilac | `#C4A6FF` | Pale and calm, a highlight rather than a colour |
| Yellow | Amber | `#F5A524` | Warm, reads as energy not caution |
| Yellow | Butter | `#F5D547` | Softer, best of the three for large areas |
| Yellow | Acid | `#D9F04B` | Pushed toward green. Most contemporary, most divisive |

Retired in round two, with old links redirected in `LEGACY_IDS`: Hot
(`#FF3D8B`, now Samuh pink), Electric and Sky (the blue family, now Periwinkle
and Samuh cyan).

Two accents are chosen, from any family. Accent 1 is the loud one: buttons,
the Team circle, the synapse nodes, the first aurora blob. Accent 2 is the quiet
one: eyebrows, inline links, tags, the second blob. One loud colour per screen.
The scope calls for pink, blue and yellow together, and this is how they work
as a system rather than all at once.

## Axis 3: typography

Two groups. The expressive five put a display face with real personality
against a sober body face, which is what keeps it playful without becoming
childish. The refined five, added when the client asked for something
classier, let the type carry the discipline and leave the personality to
colour, line and motion.

| id | Group | Pairing | Character |
|---|---|---|---|
| `fraunces` | Expressive | Fraunces / Inter | Serif with deliberate wonk. Warm up close, serious at a glance |
| `bricolage` | Expressive | Bricolage Grotesque / Inter | Irregular by design. Playful without a rounded corner |
| `unbounded` | Expressive | Unbounded / Instrument Sans | Wide and geometric, almost a wordmark |
| `syne` | Expressive | Syne / Inter | Architectural and genuinely strange. The client's round-one pick |
| `space` | Expressive | Space Grotesk / Figtree | Geometric with quirks in the details |
| `dm-serif` | Refined | DM Serif Display / DM Sans | High contrast, tight, quietly expensive. The most boardroom serif |
| `cormorant` | Refined | Cormorant Garamond / Hanken Grotesk | Old-style and unhurried. Lightest on the page |
| `newsreader` | Refined | Newsreader / Inter | Editorial serif drawn for screens. The compromise candidate |
| `manrope` | Refined | Manrope / Inter | Geometric sans, corners softened. Nearest cousin to the sans in their decks |
| `hanken` | Refined | Hanken Grotesk / Hanken Grotesk | One family for everything, the Swiss route |
| `playfair` | Formal | Playfair Display / Source Sans 3 | The formal serif everyone recognises |
| `baskerville` | Formal | Libre Baskerville / Inter | Bookish, wide, the most conservative |
| `garamond` | Formal | EB Garamond / Libre Franklin | Five hundred years of formal |
| `bodoni` | Formal | Bodoni Moda / Inter | Hairline serifs, fashion-house formal. Watch it on dark |

IBM Plex Mono carries captions and data in every pairing. Fifteen families
load while the picker is live; that is not a production font budget.

## Axis 4: line weight

Thin draws borders, dividers and the grid. Fat draws the eyebrow rule, the
Team circle, inline link underlines and the accent bar on cards and steps.

| id | Thin | Fat | Character |
|---|---|---|---|
| `fine` | 1px | 2px | Everything a hairline. Closest to a printed report |
| `balanced` | 1px | 3px | The default and what round one looked like |
| `heavy` | 1px | 5px | The heavy stroke starts to feel drawn |
| `marker` | 2px | 8px | Felt-tip. The loosest, watch it on the tier cards |

Line width scales the chosen weight in quarter steps from ×0.5 to ×2
(`scale-50` to `scale-200`), so the thin/fat gap is preserved while the whole
page gets lighter or heavier. Marker at ×2 is 4px against 16px.

## Axis 0: approach

How the page is composed. Same tokens, different amount of chrome. Applied as
`data-approach` on the stage; overrides are scoped to `.content` in
`design.css` so the rail is untouched.

| id | Name | Treatment |
|---|---|---|
| `modern` | Modern #1 | Round one. Boxed cards and steps, accent bar on hover |
| `minimal` | Minimal #1 | Very few boxes. Hairlines only, generous black space, content on the stage |
| `formal` | Formal Bold | Alternating contrast bands, large section numbers, full-width rules, heavy left stroke on cards |

The hash is now nine parts:
`#approach.background.accent1.accent2.type.weight.scale.entrance.hover`.
Anything missing falls back to the default (Modern, Balanced, ×1).

## The rail is the style guide

Block 03 in the rail shows the current selection as a spec: approach and
background, both accents as filled chips with name and hex, an "Aa" specimen
in the display face with the pairing named, the two rules drawn at their
current width, and the motion pair. Selected swatches carry a tick in their
own on-colour and the value line repeats the hex.

## Axis 5 and 6: effects

Entrance is how a section arrives as it scrolls into view. Hover is how
buttons, cards and steps react to a pointer. Both are applied as data
attributes on the stage and always run at the direction's `--dur` and `--ease`.

| Entrance | Behaviour |
|---|---|
| `rise` | Lifts from a few pixels below while fading in |
| `fade` | Opacity only |
| `unblur` | Soft focus to sharp |
| `wipe` | Revealed left to right, as if drawn |
| `still` | No entrance |

| Hover | Behaviour |
|---|---|
| `lift` | Rises with a soft accent shadow |
| `glow` | No movement, a ring of accent light |
| `fill` | Colour floods in, buttons invert |
| `scale` | Grows slightly |
| `quiet` | Colour and border only, no motion |

## Three circles

Nested, not overlapping. The organization houses the team, the team houses the
individual. Only the team circle carries the accent, because the team is the
subject. Each circle floats on its own slow cycle. The client's reference
sketch is the shape, not the look.

## Token contract

Nothing outside `src/lib/tokens.ts` carries a design value.

| CSS var | Controls |
|---|---|
| `--base` | Page colour behind every backdrop layer |
| `--surface`, `--surface-alt` | Cards, panels, inputs, hover state |
| `--border` | Hairlines and dividers |
| `--text`, `--muted` | Primary and secondary text |
| `--rule-thin`, `--rule-fat` | The two line weights |
| `--accent`, `--on-accent` | The loud colour and text sitting on it |
| `--accent-2`, `--on-accent-2` | The quiet colour and text sitting on it |
| `--radius` | Every corner |
| `--dur`, `--ease` | Every transition |
| `--font-display`, `--font-body`, `--font-mono` | Type |
| `--display-weight`, `--display-tracking`, `--display-leading` | Display metrics |

## Line weights

Called out because it is easy to miss. The gap between the thin rule and the
fat rule is deliberate. Uniform 1px everywhere is what makes a site feel
corporate. A hairline grid with a few confident heavy strokes is what makes it
feel drawn. Since round two the gap is the client's to set (see Axis 4) rather
than something each background carried.

## Motion

Three bespoke sequences per the scope: the three circles, the interactive data
tool, and the SAMUH equation. Everything else uses a shared entrance and reveal
system driven by `--dur` and `--ease`.

A component that animates at its own speed breaks the direction. Read the
tokens.

`prefers-reduced-motion` is handled in both stylesheets and must be carried
into anything new. The background animations stop too, not just the content.

## Accessibility floor

Dark backgrounds make it easy to ship text that fails.

- Body and primary text clear 4.5:1 against `--base` and `--surface`
- Muted text may sit at 3:1 but never below
- Aurora is the risk case. Text sits on translucent surfaces over moving
  colour, so check contrast against the brightest frame of the drift, not the
  darkest
