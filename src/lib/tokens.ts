// SAMUH design tokens.
//
// Independent axes the client can mix, choose-your-own-adventure style:
//   BACKGROUNDS  the stage and its motion character
//   ACCENTS      pink / yellow / blue, three hues each. Picked twice: a loud
//                primary and a quieter secondary
//   TYPE_PAIRS   display and body pairings
//   ENTRANCES    how content arrives as you scroll
//   HOVERS       how interactive things react to a pointer
//
// Nothing outside this file carries a design value. Every component reads a
// CSS custom property. That is what makes the preview switchable and what
// turns the chosen combination into a real design system rather than a mood
// board.
//
// Art direction brief: playful, organic, a bit psychedelic. Not childish.
// It has to survive a Fortune 500 boardroom, so the discipline lives in the
// typography and the spacing while the looseness lives in the background,
// the line weights and the motion.

/* ------------------------------------------------------------------ */
/* Backgrounds                                                         */
/* ------------------------------------------------------------------ */

export type BackdropId = "void" | "slate" | "aurora" | "chalk" | "orbit";

export interface Background {
  id: BackdropId;
  n: number;
  name: string;
  bet: string;
  risk: string;
  /** base page colour behind every layer */
  base: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  muted: string;
  /** hairline vs deliberate heavy stroke — the line-weight personality */
  ruleThin: string;
  ruleFat: string;
  radius: string;
  motionDur: string;
  motionEase: string;
  motionNote: string;
}

export const BACKGROUNDS: Background[] = [
  {
    id: "void",
    n: 1,
    name: "Void",
    bet: "Pure black, nothing behind the content. All the personality has to come from type, line and motion, which means none of it can hide behind a pretty gradient.",
    risk: "Unforgiving. If a section is weak, black shows it immediately.",
    base: "#000000",
    surface: "#0B0B0B",
    surfaceAlt: "#141414",
    border: "#242424",
    text: "#FFFFFF",
    muted: "#8A8A8A",
    ruleThin: "1px",
    ruleFat: "3px",
    radius: "0px",
    motionDur: "260ms",
    motionEase: "cubic-bezier(0.22, 1, 0.36, 1)",
    motionNote: "Clean entrances, no drift. The stage is still so the content moves.",
  },
  {
    id: "slate",
    n: 2,
    name: "Slate",
    bet: "Dark slate rather than black. The page starts lighter at the top and falls into near-black as you scroll, so the argument literally deepens. Warmer and less severe than a pure black stage.",
    risk: "The safest of the five. Reads considered, and the gradient only lands if the sections are long enough to travel through it.",
    base: "#141922",
    surface: "#1D2430",
    surfaceAlt: "#273040",
    border: "#364050",
    text: "#F0F2F5",
    muted: "#9AA3B2",
    ruleThin: "1px",
    ruleFat: "4px",
    radius: "6px",
    motionDur: "420ms",
    motionEase: "cubic-bezier(0.32, 0.72, 0, 1)",
    motionNote: "Long, buoyant. Things rise into place rather than fade in.",
  },
  {
    id: "aurora",
    n: 3,
    name: "Aurora",
    bet: "Black with toned-down colour rising and falling underneath, lava lamp style. This is the mushrooms one. Each blob takes 40 to 60 seconds to travel, so it reads as atmosphere, never as an animation you are being shown.",
    risk: "Highest craft cost and the one that goes wrong fastest if the blur or the speed is off. Also the hardest to keep text legible on.",
    base: "#000000",
    surface: "rgba(20, 20, 24, 0.72)",
    surfaceAlt: "rgba(30, 30, 36, 0.85)",
    border: "rgba(255, 255, 255, 0.14)",
    text: "#FFFFFF",
    muted: "#9A9AA4",
    ruleThin: "1px",
    ruleFat: "3px",
    radius: "18px",
    motionDur: "560ms",
    motionEase: "cubic-bezier(0.34, 1.26, 0.64, 1)",
    motionNote: "Organic. Slight overshoot on arrival, continuous drift behind everything.",
  },
  {
    id: "chalk",
    n: 4,
    name: "Chalk",
    bet: "A blackboard. Slightly green-black, fine grain, hand-drawn underlines and a dusty vignette. Teaching is literally the first job of this site, so the surface says so before a word is read.",
    risk: "Skews academic. Push it too far and it reads as a school, not a firm that charges six figures.",
    base: "#0A0D0B",
    surface: "#121613",
    surfaceAlt: "#191E1A",
    border: "#2A322C",
    text: "#F2F0E9",
    muted: "#93998F",
    ruleThin: "1px",
    ruleFat: "5px",
    radius: "3px",
    motionDur: "340ms",
    motionEase: "cubic-bezier(0.2, 0.9, 0.3, 1)",
    motionNote: "Marks appear the way chalk lands: quick stroke, then settle.",
  },
  {
    id: "orbit",
    n: 5,
    name: "Orbit",
    bet: "My pick. Concentric hairline rings with two slow counter-rotating arcs of colour, so the background is already the three-circles diagram before the visitor scrolls to it. Instrumentation and planetary motion at the same time.",
    risk: "The rings have to stay quiet. Too strong and it stops being atmosphere and starts being a graphic the content is sitting on top of.",
    base: "#050609",
    surface: "#0D0E12",
    surfaceAlt: "#15171C",
    border: "#23262E",
    text: "#F4F5F7",
    muted: "#888F9B",
    ruleThin: "1px",
    ruleFat: "3px",
    radius: "999px",
    motionDur: "480ms",
    motionEase: "cubic-bezier(0.16, 1, 0.3, 1)",
    motionNote: "Everything eases on a long curve. One element on screen is always rotating.",
  },
];

/* ------------------------------------------------------------------ */
/* Accents                                                             */
/* ------------------------------------------------------------------ */

export type AccentFamily = "pink" | "yellow" | "blue";

export interface Accent {
  id: string;
  family: AccentFamily;
  name: string;
  hex: string;
  /** text colour that sits on top of the accent */
  on: string;
  note: string;
}

export const ACCENTS: Accent[] = [
  // pink
  { id: "pink-hot", family: "pink", name: "Hot", hex: "#FF3D8B", on: "#0A0A0A", note: "Loudest option. Unmistakable, and the closest to the original brief." },
  { id: "pink-magenta", family: "pink", name: "Magenta", hex: "#D946A0", on: "#0A0A0A", note: "Deeper and more adult. Holds up better next to a client logo wall." },
  { id: "pink-rose", family: "pink", name: "Rose", hex: "#E28BA8", on: "#0A0A0A", note: "Muted and editorial. The quiet end of pink." },

  // yellow
  { id: "yellow-amber", family: "yellow", name: "Amber", hex: "#F5A524", on: "#0A0A0A", note: "Warm and human. Reads as energy rather than caution." },
  { id: "yellow-butter", family: "yellow", name: "Butter", hex: "#F5D547", on: "#0A0A0A", note: "Softer, friendlier. Best of the three for large areas." },
  { id: "yellow-acid", family: "yellow", name: "Acid", hex: "#D9F04B", on: "#0A0A0A", note: "Yellow pushed toward green. The most contemporary and the most divisive." },

  // blue
  { id: "blue-electric", family: "blue", name: "Electric", hex: "#4D7CFF", on: "#05070B", note: "Confident and technical. Safest choice for a boardroom." },
  { id: "blue-sky", family: "blue", name: "Sky", hex: "#5BC8FF", on: "#05070B", note: "Lighter and more open. Pairs best with the aurora background." },
  { id: "blue-peri", family: "blue", name: "Periwinkle", hex: "#8B8BFF", on: "#05070B", note: "Blue drifting into violet. The strangest blue, in a good way." },
];

/* ------------------------------------------------------------------ */
/* Typography                                                          */
/* ------------------------------------------------------------------ */

export interface TypePair {
  id: string;
  name: string;
  displayVar: string;
  displayName: string;
  bodyVar: string;
  bodyName: string;
  displayWeight: number;
  displayTracking: string;
  displayLeading: string;
  note: string;
}

export const TYPE_PAIRS: TypePair[] = [
  {
    id: "fraunces",
    name: "Fraunces / Inter",
    displayVar: "var(--f-fraunces)",
    displayName: "Fraunces",
    bodyVar: "var(--f-inter)",
    bodyName: "Inter",
    displayWeight: 400,
    displayTracking: "-0.02em",
    displayLeading: "1.04",
    note: "A serif with deliberate wonk in it. Warm and slightly odd up close, completely serious at a glance.",
  },
  {
    id: "bricolage",
    name: "Bricolage Grotesque / Inter",
    displayVar: "var(--f-bricolage)",
    displayName: "Bricolage Grotesque",
    bodyVar: "var(--f-inter)",
    bodyName: "Inter",
    displayWeight: 600,
    displayTracking: "-0.035em",
    displayLeading: "0.98",
    note: "Irregular by design, letters that do not quite match. Playful without a single rounded corner.",
  },
  {
    id: "instrument",
    name: "Instrument Serif / Instrument Sans",
    displayVar: "var(--f-instrument-serif)",
    displayName: "Instrument Serif",
    bodyVar: "var(--f-instrument-sans)",
    bodyName: "Instrument Sans",
    displayWeight: 400,
    displayTracking: "-0.015em",
    displayLeading: "1.0",
    note: "High contrast and a little theatrical. The most expensive-looking of the five.",
  },
  {
    id: "syne",
    name: "Syne / Inter",
    displayVar: "var(--f-syne)",
    displayName: "Syne",
    bodyVar: "var(--f-inter)",
    bodyName: "Inter",
    displayWeight: 700,
    displayTracking: "-0.025em",
    displayLeading: "1.0",
    note: "Architectural and genuinely strange. The boldest swing here, and the one that will divide the room.",
  },
  {
    id: "space",
    name: "Space Grotesk / Figtree",
    displayVar: "var(--f-space)",
    displayName: "Space Grotesk",
    bodyVar: "var(--f-figtree)",
    bodyName: "Figtree",
    displayWeight: 700,
    displayTracking: "-0.04em",
    displayLeading: "0.95",
    note: "Geometric with quirks hidden in the details. Reads modern and technical without going cold.",
  },
];

/* ------------------------------------------------------------------ */
/* Effects                                                             */
/* ------------------------------------------------------------------ */

// Entrance: how a section arrives when it scrolls into view.
// Hover: how buttons, cards and steps react to a pointer.
// Both are applied as data attributes on the stage. The CSS that reads them
// lives next to the preview, and the speed always comes from --dur and --ease.

export type EntranceId = "rise" | "fade" | "unblur" | "wipe" | "still";
export type HoverId = "lift" | "glow" | "fill" | "scale" | "quiet";

export interface Effect<Id extends string> {
  id: Id;
  name: string;
  note: string;
}

export const ENTRANCES: Effect<EntranceId>[] = [
  { id: "rise", name: "Rise", note: "Sections lift into place from a few pixels below while fading in. The default web move, done at the direction's own speed." },
  { id: "fade", name: "Fade", note: "Opacity only. Nothing moves. The quietest option and the one least likely to feel like a template." },
  { id: "unblur", name: "Unblur", note: "Content resolves from soft focus to sharp. Reads organic and slightly dreamlike, which suits the brief." },
  { id: "wipe", name: "Wipe", note: "Revealed left to right as if drawn. Pairs naturally with the hairline and heavy stroke idea." },
  { id: "still", name: "Still", note: "No entrance at all. Everything is simply there. The boardroom control." },
];

export const HOVERS: Effect<HoverId>[] = [
  { id: "lift", name: "Lift", note: "Element rises a few pixels and gains a soft shadow in the accent. Tactile, familiar." },
  { id: "glow", name: "Glow", note: "No movement. A ring of accent light around the element. Calm and a little sci-fi." },
  { id: "fill", name: "Fill", note: "Colour floods in. Buttons invert, cards tint toward the accent. The loudest option." },
  { id: "scale", name: "Scale", note: "Element grows slightly toward the pointer. Playful, and easy to overdo." },
  { id: "quiet", name: "Quiet", note: "Colour and border change only. No motion. Safest for a Fortune 500 buyer." },
];

/* ------------------------------------------------------------------ */

export interface Combo {
  bg: Background;
  /** the loud one: buttons, the Team circle, the arc */
  accent: Accent;
  /** the quiet one: eyebrows, links, tags, the second blob */
  accent2: Accent;
  type: TypePair;
  entrance: Effect<EntranceId>;
  hover: Effect<HoverId>;
}

// Default is the first entry on each axis. Accent 2 defaults to the first
// entry of a different family so the pair is visibly a pair.
export const DEFAULT_COMBO: Combo = {
  bg: BACKGROUNDS[0],
  accent: ACCENTS[0],
  accent2: ACCENTS.find((a) => a.family !== ACCENTS[0].family) ?? ACCENTS[1],
  type: TYPE_PAIRS[0],
  entrance: ENTRANCES[0],
  hover: HOVERS[0],
};

/** The shareable form: #background.accent1.accent2.type.entrance.hover */
export function comboHash(c: Combo): string {
  return `#${c.bg.id}.${c.accent.id}.${c.accent2.id}.${c.type.id}.${c.entrance.id}.${c.hover.id}`;
}

/**
 * Reads a hash back into a combo. Order does not matter, every id is unique
 * across the axes, and anything unrecognised falls back to the default. The
 * older three-part links (#background.accent.type) still resolve.
 */
export function parseComboHash(hash: string): Combo {
  const parts = hash.replace(/^#/, "").split(".").filter(Boolean);
  const c: Combo = { ...DEFAULT_COMBO };
  const accents: Accent[] = [];
  for (const raw of parts) {
    const id = raw === "ascent" ? "slate" : raw;
    const bg = BACKGROUNDS.find((x) => x.id === id);
    if (bg) { c.bg = bg; continue; }
    const ac = ACCENTS.find((x) => x.id === id);
    if (ac) { accents.push(ac); continue; }
    const tp = TYPE_PAIRS.find((x) => x.id === id);
    if (tp) { c.type = tp; continue; }
    const en = ENTRANCES.find((x) => x.id === id);
    if (en) { c.entrance = en; continue; }
    const hv = HOVERS.find((x) => x.id === id);
    if (hv) { c.hover = hv; continue; }
  }
  if (accents[0]) c.accent = accents[0];
  if (accents[1]) c.accent2 = accents[1];
  return c;
}

export function cssVars({ bg, accent, accent2, type }: Combo): React.CSSProperties {
  return {
    "--base": bg.base,
    "--surface": bg.surface,
    "--surface-alt": bg.surfaceAlt,
    "--border": bg.border,
    "--text": bg.text,
    "--muted": bg.muted,
    "--rule-thin": bg.ruleThin,
    "--rule-fat": bg.ruleFat,
    "--radius": bg.radius,
    "--dur": bg.motionDur,
    "--ease": bg.motionEase,
    "--accent": accent.hex,
    "--on-accent": accent.on,
    "--accent-2": accent2.hex,
    "--on-accent-2": accent2.on,
    "--font-display": type.displayVar,
    "--font-body": type.bodyVar,
    "--font-mono": "var(--f-plex-mono)",
    "--display-weight": String(type.displayWeight),
    "--display-tracking": type.displayTracking,
    "--display-leading": type.displayLeading,
  } as React.CSSProperties;
}
