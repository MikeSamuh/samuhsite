# Design system

## Status

**Nothing selected yet.** `/design` is a configurator with six independent
dials, a choose-your-own-adventure style guide. The client picks a background,
two accents, a type pairing, an entrance and a hover behaviour, and the URL
records the exact combination.

`/design#aurora.yellow-amber.blue-sky.syne.unblur.glow` is a real, shareable
state. Order does not matter and the older three-part links still resolve.

The page opens with Wilfred's recommendation as its own section, then a
choose-your-own-adventure section with every dial inline, then the preview.
The dials also live in a left rail that minimises. The recommendation is the
`RECOMMENDED` constant in `tokens.ts`, six ids and a reason, marked TODO until
it is chosen.

After selection:

1. Cut `tokens.ts` down to the chosen background, accents, pairing and effects
2. Trim `layout.tsx` to the two or three faces that pairing uses. Nine families
   load right now purely so the preview can switch without a flash. That is not
   a production font budget
3. Promote the tokens into `globals.css` under Tailwind's `@theme`
4. Keep the winning `Backdrop` case, delete the rest
5. Delete `src/app/design/`
6. Record it in `docs/decisions.md`

## There is no inherited palette

SAMUH's brand book contains no colour codes. The fields are unfilled
placeholders reading `Color 1: #HexCode (RGB: R, G, B)`. The only defined values
are black and white.

The scope document says: dark mode, pink, blue and yellow accents on a black
and white base. That is the brief. The specific hues are ours to propose, which
is why the configurator offers three of each rather than one.

## Axis 1: backgrounds

All dark. Each carries its own line weights, radius and motion character, so
the background choice also sets how the whole thing behaves.

| # | id | Name | Treatment |
|---|---|---|---|
| 1 | `void` | Void | Pure black, nothing behind the content |
| 2 | `slate` | Slate | Dark slate, not black. Lighter at the top, darker as you scroll |
| 3 | `aurora` | Aurora | Toned-down colour rising and sinking under grain, lava lamp style, 24 to 30 second cycles |
| 4 | `chalk` | Chalk | Blackboard. Changes with scroll: the board cools, the wiped dust drifts past, a chalk line along the bottom fills with progress |
| 5 | `synapse` | Synapse | A faint network of nodes and hairline connections with signals travelling along them |

Synapse replaced Orbit after the client rejected the rings. It is the
creative-freedom slot: teams as a nervous system, where the connections are the
point. It has to stay quiet or it becomes a tech-company node graph.

Aurora is the most direct answer to "on mushrooms" and also the highest craft
cost. Watch legibility on it above everything else.

## Axis 2: accents

Three families, three hues each. Every one clears 4.5:1 against black, so all
nine are safe for text and not only decoration.

| Family | Hue | Hex | Character |
|---|---|---|---|
| Pink | Hot | `#FF3D8B` | Loudest. Closest to the original brief |
| Pink | Magenta | `#D946A0` | Deeper, more adult, better next to a client logo wall |
| Pink | Rose | `#E28BA8` | Muted and editorial |
| Yellow | Amber | `#F5A524` | Warm, reads as energy not caution |
| Yellow | Butter | `#F5D547` | Softer, best of the three for large areas |
| Yellow | Acid | `#D9F04B` | Pushed toward green. Most contemporary, most divisive |
| Blue | Electric | `#4D7CFF` | Confident and technical. Safest for a boardroom |
| Blue | Sky | `#5BC8FF` | Lighter and more open, pairs best with Aurora |
| Blue | Periwinkle | `#8B8BFF` | Drifting into violet. The strangest blue |

Two accents are chosen, from any family. Accent 1 is the loud one: buttons,
the Team circle, the synapse nodes, the first aurora blob. Accent 2 is the quiet
one: eyebrows, inline links, tags, the second blob. One loud colour per screen.
The scope calls for pink, blue and yellow together, and this is how they work
as a system rather than all at once.

## Axis 3: typography

Each pairing puts a display face with real personality against a sober body
face. The pairing is what keeps it playful without becoming childish.

| id | Pairing | Character |
|---|---|---|
| `fraunces` | Fraunces / Inter | Serif with deliberate wonk. Warm up close, serious at a glance |
| `bricolage` | Bricolage Grotesque / Inter | Irregular by design. Playful without a rounded corner |
| `unbounded` | Unbounded / Instrument Sans | Wide and geometric, almost a wordmark. The most contemporary |
| `syne` | Syne / Inter | Architectural and genuinely strange. The boldest swing |
| `space` | Space Grotesk / Figtree | Geometric with quirks in the details |

IBM Plex Mono carries captions and data in every pairing.

## Axis 4 and 5: effects

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

Called out because it is easy to miss. Every background defines a thin rule and
a fat rule, and the gap between them is deliberate. Uniform 1px everywhere is
what makes a site feel corporate. A hairline grid with a few confident heavy
strokes is what makes it feel drawn.

Chalk runs the widest gap, 1px against 5px. Void and Synapse run 1px against 3px.
Slate runs 1px against 4px.

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
