# Design system

## Status

**Direction not yet selected.** Five candidates live in `src/lib/directions.ts`
and render at `/design`.

Once the client picks one:

1. Delete the four losing entries from `directions.ts`
2. Trim `layout.tsx` to the two or three font families the winner uses.
   Eight families load right now purely so the preview can switch with no
   flash. That is not a production font budget
3. Promote the winning tokens into `globals.css` under Tailwind's `@theme`
4. Delete `src/app/design/`
5. Record the decision in `docs/decisions.md`

## Important: there is no inherited palette

SAMUH's brand book contains no colour codes. The fields are unfilled
placeholders reading `Color 1: #HexCode (RGB: R, G, B)`. The only defined
values are black `#000000` and white `#FFFFFF`.

So these directions propose a palette rather than match one. Say that plainly
to the client, because it means the colour decision is genuinely theirs to make
here and not a compliance exercise.

Earlier meeting notes describe a pink, blue and yellow palette on a black and
white base. That is the closest thing to a brief we have, and direction 4
(Kinetic) is the one that takes it literally.

## The five directions

All dark, per the client's call on 23 Sep.

| # | id | Name | The bet | Display / Body / Mono | Accent |
|---|---|---|---|---|---|
| 1 | `noir` | Editorial Noir | It is a body of thought, so read like a monograph | Fraunces / Inter / Inter | `#D98BA8` |
| 2 | `signal` | Signal | The product is evidence, so look like the instrument | Instrument Sans / Instrument Sans / IBM Plex Mono | `#5B8CFF` |
| 3 | `ember` | Ember | Belonging is the core, so warm the dark up | Newsreader / Figtree / Figtree | `#E8B44A` |
| 4 | `kinetic` | Kinetic | You were hired for motion, so build the one that needs it | Space Grotesk / Inter / Space Grotesk | `#FF4FA3` + `#5B7CFF` + `#FFD400` |
| 5 | `institute` | Institute | Credibility over personality, colour only where you click | Inter Tight / Inter Tight / IBM Plex Mono | `#9FB6D4` |

Each deep-links: `/design#signal`, and so on. Number keys 1 to 5 also switch.

## Token contract

Every direction defines the same shape. Nothing outside this set is allowed to
carry a design value.

| Token | CSS var | What it controls |
|---|---|---|
| bg | `--bg` | Page background |
| surface | `--surface` | Cards, panels, inputs |
| surfaceAlt | `--surface-alt` | Hover and raised state |
| border | `--border` | All hairlines and dividers |
| text | `--text` | Primary text |
| muted | `--muted` | Secondary text, captions, labels |
| accent | `--accent` | The single loud colour |
| onAccent | `--on-accent` | Text sitting on the accent |
| accent2, accent3 | `--accent-2`, `--accent-3` | Secondary accents, used sparingly |
| radius | `--radius` | Every corner |
| motionDur | `--dur` | Every transition |
| motionEase | `--ease` | Every easing curve |

Plus `--font-display`, `--font-body`, `--font-mono` and the display weight,
tracking and leading.

`src/app/design/design.css` contains zero hex values and zero font names. Keep
it that way in every file that follows.

## Button personalities

Set by `data-btn` on the wrapper, driven by the direction's `buttonStyle`.
This is deliberate: the interaction character is as much of the decision as the
colour, so each direction argues for its own.

- `text` — no chrome, a rule draws in under the label on hover
- `solid` — filled, lifts 2px and throws a soft ring
- `pill` — fully round, scales and brightens
- `block` — hard rectangle, instant colour swap
- `outline` — empty until hover, then fills

## Accessibility floor

Dark backgrounds make it easy to ship text that fails. Body and primary text
must clear WCAG AA (4.5:1) against `--bg` and `--surface`. Muted text is
allowed to sit at AA large (3:1) but never below. Check any new accent before
using it for text rather than decoration.
