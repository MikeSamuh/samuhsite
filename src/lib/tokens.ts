// SAMUH design tokens.
//
// Independent axes the client can mix, choose-your-own-adventure style:
//   BACKGROUNDS  the stage and its motion character
//   ACCENTS      pink / cyan / violet / yellow, three hues each. Picked twice:
//                a loud primary and a quieter secondary
//   TYPE_PAIRS   display and body pairings, in two groups: expressive and refined
//   WEIGHTS      the gap between the hairline and the heavy stroke
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

export type BackdropId = "void" | "slate" | "aurora" | "chalk" | "synapse";

export interface Background {
  id: BackdropId;
  n: number;
  name: string;
  bet: string;
  risk: string;
  /** base page color behind every layer */
  base: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  muted: string;
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
    base: "#10141B",
    surface: "#171D26",
    surfaceAlt: "#1F2633",
    border: "#2B3340",
    text: "#F0F2F5",
    muted: "#9AA3B2",
    radius: "6px",
    motionDur: "420ms",
    motionEase: "cubic-bezier(0.32, 0.72, 0, 1)",
    motionNote: "Long, buoyant. Things rise into place rather than fade in.",
  },
  {
    id: "aurora",
    n: 3,
    name: "Aurora",
    bet: "Black with toned-down color rising and falling underneath, lava lamp style. This is the mushrooms one. Each blob takes 20 to 30 seconds to travel the screen, slow enough to be atmosphere, fast enough that you notice it moving.",
    risk: "Highest craft cost and the one that goes wrong fastest if the blur or the speed is off. Also the hardest to keep text legible on.",
    base: "#000000",
    surface: "rgba(20, 20, 24, 0.72)",
    surfaceAlt: "rgba(30, 30, 36, 0.85)",
    border: "rgba(255, 255, 255, 0.14)",
    text: "#FFFFFF",
    muted: "#9A9AA4",
    radius: "18px",
    motionDur: "560ms",
    motionEase: "cubic-bezier(0.34, 1.26, 0.64, 1)",
    motionNote: "Organic. Slight overshoot on arrival, continuous drift behind everything.",
  },
  {
    id: "chalk",
    n: 4,
    name: "Chalk",
    bet: "A blackboard. Slightly green-black, fine grain, wiped chalk dust that travels as you scroll, and a chalk line along the bottom that fills with your progress through the page. Teaching is literally the first job of this site, so the surface says so before a word is read.",
    risk: "Skews academic. Push it too far and it reads as a school, not a firm that charges six figures.",
    base: "#0A0D0B",
    surface: "#121613",
    surfaceAlt: "#191E1A",
    border: "#2A322C",
    text: "#F2F0E9",
    muted: "#93998F",
    radius: "3px",
    motionDur: "340ms",
    motionEase: "cubic-bezier(0.2, 0.9, 0.3, 1)",
    motionNote: "Marks appear the way chalk lands: quick stroke, then settle.",
  },
  {
    id: "synapse",
    n: 5,
    name: "Synapse",
    bet: "A faint network of nodes and connections, with signals travelling slowly along the lines. Teams as a nervous system: the connections are the point, not the nodes. Subtle enough to sit under body text.",
    risk: "Network diagrams are a cliché in consulting. It only works if it stays quiet and organic, never a tech-company node graph.",
    base: "#04060A",
    surface: "#0D1016",
    surfaceAlt: "#151920",
    border: "#242A34",
    text: "#F4F5F7",
    muted: "#8B939F",
    radius: "14px",
    motionDur: "480ms",
    motionEase: "cubic-bezier(0.16, 1, 0.3, 1)",
    motionNote: "Everything eases on a long curve. Something on screen is always faintly pulsing.",
  },
];

/* ------------------------------------------------------------------ */
/* Accents                                                             */
/* ------------------------------------------------------------------ */

// The brand book has no color codes, but SAMUH's own decks do. The
// introduction deck and the Bangalore keynote (July 2026) use these fills:
//   #FC0097  pink, on nearly every page of both decks
//   #0CC0DF  cyan, the keynote's second color
//   #48B1A5  teal, the introduction deck's second color
//   #8243F6  violet, the frame around the performance-levers chart
// Anything marked "sampled" below is one of those, taken as-is. The rest are
// riffs around them. Every hue clears 4.5:1 against the darkest stage so all
// twelve are safe for text, not only decoration.

export type AccentFamily = "pink" | "cyan" | "violet" | "yellow";

export interface Accent {
  id: string;
  family: AccentFamily;
  name: string;
  hex: string;
  /** text color that sits on top of the accent */
  on: string;
  note: string;
}

export const ACCENTS: Accent[] = [
  // pink
  { id: "pink-samuh", family: "pink", name: "Samuh", hex: "#FC0097", on: "#0A0A0A", note: "Sampled from your decks. The loudest option and the one your audience has already seen." },
  { id: "pink-magenta", family: "pink", name: "Magenta", hex: "#D946A0", on: "#0A0A0A", note: "Deeper and more adult. Holds up better next to a client logo wall." },
  { id: "pink-rose", family: "pink", name: "Rose", hex: "#E28BA8", on: "#0A0A0A", note: "Muted and editorial. The quiet end of pink." },

  // cyan
  { id: "cyan-samuh", family: "cyan", name: "Samuh", hex: "#0CC0DF", on: "#05070B", note: "Sampled from the Bangalore keynote. Cold and bright, so it reads as a signal next to the pink." },
  { id: "cyan-teal", family: "cyan", name: "Teal", hex: "#48B1A5", on: "#05070B", note: "Sampled from the introduction deck. Greener and calmer, the closest to a true complement of magenta." },
  { id: "cyan-steel", family: "cyan", name: "Steel", hex: "#4394AF", on: "#05070B", note: "The bar color from your levers chart. The most muted, so it sits behind the pink rather than beside it." },

  // violet
  { id: "violet-ultra", family: "violet", name: "Ultraviolet", hex: "#8F55FF", on: "#05070B", note: "Your chart frame violet, lifted one step so it passes as text. Pink's neighbour on the wheel, so the pair reads as one glow." },
  { id: "violet-peri", family: "violet", name: "Periwinkle", hex: "#8B8BFF", on: "#05070B", note: "Blue drifting into violet. The strangest one, in a good way." },
  { id: "violet-lilac", family: "violet", name: "Lilac", hex: "#C4A6FF", on: "#05070B", note: "Pale and calm. Reads as a highlight rather than a color." },

  // yellow
  { id: "yellow-amber", family: "yellow", name: "Amber", hex: "#F5A524", on: "#0A0A0A", note: "Warm and human. Reads as energy rather than caution." },
  { id: "yellow-butter", family: "yellow", name: "Butter", hex: "#F5D547", on: "#0A0A0A", note: "Softer, friendlier. Best of the three for large areas." },
  { id: "yellow-acid", family: "yellow", name: "Acid", hex: "#D9F04B", on: "#0A0A0A", note: "Yellow pushed toward green. The most contemporary and the most divisive." },
];

/* ------------------------------------------------------------------ */
/* Typography                                                          */
/* ------------------------------------------------------------------ */

// Two groups. Expressive pairings put a display face with real personality
// against a sober body face. Refined pairings, added after the client asked
// for something classier, let the type carry the discipline and leave the
// personality to color and motion.

export type TypeGroup = "expressive" | "refined" | "formal";

export interface TypePair {
  id: string;
  group: TypeGroup;
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
    group: "expressive",
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
    group: "expressive",
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
    id: "unbounded",
    group: "expressive",
    name: "Unbounded / Instrument Sans",
    displayVar: "var(--f-unbounded)",
    displayName: "Unbounded",
    bodyVar: "var(--f-instrument-sans)",
    bodyName: "Instrument Sans",
    displayWeight: 500,
    displayTracking: "-0.02em",
    displayLeading: "1.02",
    note: "Wide and geometric, almost a wordmark. The most contemporary of the expressive five and the one that takes up the most room.",
  },
  {
    id: "syne",
    group: "expressive",
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
    group: "expressive",
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
  {
    id: "antiqua",
    group: "expressive",
    name: "Modern Antiqua / Inter",
    displayVar: "var(--f-antiqua)",
    displayName: "Modern Antiqua",
    bodyVar: "var(--f-inter)",
    bodyName: "Inter",
    displayWeight: 400,
    displayTracking: "-0.01em",
    displayLeading: "1.06",
    note: "A blackletter-flavoured roman. Medieval at a glance, readable up close. One weight only.",
  },
  {
    id: "elite",
    group: "expressive",
    name: "Special Elite / Inter",
    displayVar: "var(--f-elite)",
    displayName: "Special Elite",
    bodyVar: "var(--f-inter)",
    bodyName: "Inter",
    displayWeight: 400,
    displayTracking: "0",
    displayLeading: "1.08",
    note: "A typewriter face, ink and all. Reads as field notes and confidential memos, which suits the research angle. One weight only.",
  },
  {
    id: "dm-serif",
    group: "refined",
    name: "DM Serif Display / DM Sans",
    displayVar: "var(--f-dm-serif)",
    displayName: "DM Serif Display",
    bodyVar: "var(--f-dm-sans)",
    bodyName: "DM Sans",
    displayWeight: 400,
    displayTracking: "-0.01em",
    displayLeading: "1.04",
    note: "High contrast, tight and quietly expensive. The most boardroom of the serifs, drawn as a pair with its body face.",
  },
  {
    id: "cormorant",
    group: "refined",
    name: "Cormorant Garamond / Hanken Grotesk",
    displayVar: "var(--f-cormorant)",
    displayName: "Cormorant Garamond",
    bodyVar: "var(--f-hanken)",
    bodyName: "Hanken Grotesk",
    displayWeight: 500,
    displayTracking: "-0.005em",
    displayLeading: "1.02",
    note: "Old-style and unhurried, the most literally classy option here. Lightest on the page, so it leans on size rather than weight.",
  },
  {
    id: "newsreader",
    group: "refined",
    name: "Newsreader / Inter",
    displayVar: "var(--f-newsreader)",
    displayName: "Newsreader",
    bodyVar: "var(--f-inter)",
    bodyName: "Inter",
    displayWeight: 400,
    displayTracking: "-0.015em",
    displayLeading: "1.06",
    note: "An editorial serif drawn for screens. Quieter than DM Serif, warmer than Cormorant. The compromise candidate.",
  },
  {
    id: "manrope",
    group: "refined",
    name: "Manrope / Inter",
    displayVar: "var(--f-manrope)",
    displayName: "Manrope",
    bodyVar: "var(--f-inter)",
    bodyName: "Inter",
    displayWeight: 600,
    displayTracking: "-0.03em",
    displayLeading: "1.02",
    note: "Geometric sans with the corners softened. Reads like a well-funded product company, and it is the nearest cousin to the sans in your own decks.",
  },
  {
    id: "hanken",
    group: "refined",
    name: "Hanken Grotesk / Hanken Grotesk",
    displayVar: "var(--f-hanken)",
    displayName: "Hanken Grotesk",
    bodyVar: "var(--f-hanken)",
    bodyName: "Hanken Grotesk",
    displayWeight: 500,
    displayTracking: "-0.025em",
    displayLeading: "1.04",
    note: "One family for everything, the Swiss route. All the personality has to come from color, line and motion, which is exactly the split in the brief.",
  },
  {
    id: "playfair",
    group: "formal",
    name: "Playfair Display / Source Sans 3",
    displayVar: "var(--f-playfair)",
    displayName: "Playfair Display",
    bodyVar: "var(--f-source-sans)",
    bodyName: "Source Sans 3",
    displayWeight: 500,
    displayTracking: "-0.01em",
    displayLeading: "1.06",
    note: "The formal serif everyone recognises. Transitional, high contrast, unmistakably a firm rather than a startup.",
  },
  {
    id: "baskerville",
    group: "formal",
    name: "Libre Baskerville / Inter",
    displayVar: "var(--f-baskerville)",
    displayName: "Libre Baskerville",
    bodyVar: "var(--f-inter)",
    bodyName: "Inter",
    displayWeight: 400,
    displayTracking: "-0.015em",
    displayLeading: "1.08",
    note: "Bookish and wide. The typeface of annual reports and university letterheads. The most conservative option on the page.",
  },
  {
    id: "garamond",
    group: "formal",
    name: "EB Garamond / Libre Franklin",
    displayVar: "var(--f-garamond)",
    displayName: "EB Garamond",
    bodyVar: "var(--f-franklin)",
    bodyName: "Libre Franklin",
    displayWeight: 500,
    displayTracking: "-0.005em",
    displayLeading: "1.04",
    note: "Five hundred years old and still the definition of formal. Small on the page for its size, so it runs a step larger.",
  },
  {
    id: "bodoni",
    group: "formal",
    name: "Bodoni Moda / Inter",
    displayVar: "var(--f-bodoni)",
    displayName: "Bodoni Moda",
    bodyVar: "var(--f-inter)",
    bodyName: "Inter",
    displayWeight: 500,
    displayTracking: "-0.01em",
    displayLeading: "1.04",
    note: "Hairline serifs against heavy stems. Formal in the fashion-house sense. The sharpest of the serifs and the one most at risk on a dark screen.",
  },
  {
    id: "overlock",
    group: "formal",
    name: "Overlock / Inter",
    displayVar: "var(--f-overlock)",
    displayName: "Overlock",
    bodyVar: "var(--f-inter)",
    bodyName: "Inter",
    displayWeight: 700,
    displayTracking: "-0.015em",
    displayLeading: "1.04",
    note: "Rounded and hand-cut, with true italics and a black weight. Softer than the serifs, warmer than the grotesks.",
  },
  {
    id: "imfell",
    group: "formal",
    name: "IM Fell French Canon / Inter",
    displayVar: "var(--f-imfell)",
    displayName: "IM Fell French Canon",
    bodyVar: "var(--f-inter)",
    bodyName: "Inter",
    displayWeight: 400,
    displayTracking: "-0.005em",
    displayLeading: "1.06",
    note: "A seventeenth-century type revived with the ink and wear left in. Vintage and formal at once. One weight only.",
  },
];

// Paragraph font, chosen on its own. Every pairing above carries a default
// body face; this overrides it. Null means "use the pairing's own".

export interface BodyFont {
  id: string;
  name: string;
  var: string;
  note: string;
}

export const BODY_FONTS: BodyFont[] = [
  { id: "body-inter", name: "Inter", var: "var(--f-inter)", note: "The neutral default. Disappears behind the content." },
  { id: "body-dm-sans", name: "DM Sans", var: "var(--f-dm-sans)", note: "Geometric and low contrast. Slightly friendlier than Inter." },
  { id: "body-hanken", name: "Hanken Grotesk", var: "var(--f-hanken)", note: "Grotesk with a Swiss edge. Crisp at small sizes." },
  { id: "body-instrument", name: "Instrument Sans", var: "var(--f-instrument-sans)", note: "Narrower, a touch more character in the letterforms." },
  { id: "body-figtree", name: "Figtree", var: "var(--f-figtree)", note: "Rounded and warm. Reads casual." },
  { id: "body-source", name: "Source Sans 3", var: "var(--f-source-sans)", note: "Humanist, the most bookish of the sans faces." },
  { id: "body-franklin", name: "Libre Franklin", var: "var(--f-franklin)", note: "American gothic. Sturdy, a little formal." },
  { id: "body-manrope", name: "Manrope", var: "var(--f-manrope)", note: "Wide and soft. Premium product-company feel." },
  { id: "body-newsreader", name: "Newsreader", var: "var(--f-newsreader)", note: "A serif for body. Editorial, slower to read on screen." },
  { id: "body-garamond", name: "EB Garamond", var: "var(--f-garamond)", note: "A serif for body. Formal, runs small so it needs a size up." },
];

// Every face that is loaded, for the minor roles. Eyebrow is the small
// uppercase line above a heading, caption is data, tags, numbers and
// specs, ui is buttons and the nav. Each role is null by default, which
// means: eyebrow and caption use IBM Plex Mono, ui uses the paragraph face.

export interface Face {
  slug: string;
  name: string;
  var: string;
}

export const FACES: Face[] = [
  { slug: "plex-mono", name: "IBM Plex Mono", var: "var(--f-plex-mono)" },
  { slug: "inter", name: "Inter", var: "var(--f-inter)" },
  { slug: "dm-sans", name: "DM Sans", var: "var(--f-dm-sans)" },
  { slug: "hanken", name: "Hanken Grotesk", var: "var(--f-hanken)" },
  { slug: "instrument", name: "Instrument Sans", var: "var(--f-instrument-sans)" },
  { slug: "figtree", name: "Figtree", var: "var(--f-figtree)" },
  { slug: "source", name: "Source Sans 3", var: "var(--f-source-sans)" },
  { slug: "franklin", name: "Libre Franklin", var: "var(--f-franklin)" },
  { slug: "manrope", name: "Manrope", var: "var(--f-manrope)" },
  { slug: "space", name: "Space Grotesk", var: "var(--f-space)" },
  { slug: "syne", name: "Syne", var: "var(--f-syne)" },
  { slug: "unbounded", name: "Unbounded", var: "var(--f-unbounded)" },
  { slug: "bricolage", name: "Bricolage Grotesque", var: "var(--f-bricolage)" },
  { slug: "elite", name: "Special Elite", var: "var(--f-elite)" },
  { slug: "fraunces", name: "Fraunces", var: "var(--f-fraunces)" },
  { slug: "dm-serif", name: "DM Serif Display", var: "var(--f-dm-serif)" },
  { slug: "cormorant", name: "Cormorant Garamond", var: "var(--f-cormorant)" },
  { slug: "newsreader", name: "Newsreader", var: "var(--f-newsreader)" },
  { slug: "playfair", name: "Playfair Display", var: "var(--f-playfair)" },
  { slug: "baskerville", name: "Libre Baskerville", var: "var(--f-baskerville)" },
  { slug: "garamond", name: "EB Garamond", var: "var(--f-garamond)" },
  { slug: "bodoni", name: "Bodoni Moda", var: "var(--f-bodoni)" },
  { slug: "antiqua", name: "Modern Antiqua", var: "var(--f-antiqua)" },
  { slug: "overlock", name: "Overlock", var: "var(--f-overlock)" },
  { slug: "imfell", name: "IM Fell French Canon", var: "var(--f-imfell)" },
];

export type FontRole = "eyebrow" | "caption" | "ui";

export const FONT_ROLES: { role: FontRole; label: string; fallback: string }[] = [
  { role: "eyebrow", label: "Eyebrow · the line above a heading", fallback: "IBM Plex Mono" },
  { role: "caption", label: "Captions, tags, numbers, data", fallback: "IBM Plex Mono" },
  { role: "ui", label: "Buttons and nav", fallback: "the paragraph face" },
];

export const roleId = (role: FontRole, f: Face) => `${role}-${f.slug}`;

/* ------------------------------------------------------------------ */
/* Line weights                                                        */
/* ------------------------------------------------------------------ */

// The gap between the hairline and the heavy stroke is where the playfulness
// lives. Uniform 1px everywhere is what makes a site feel corporate. Thin
// draws the borders, dividers and grid. Fat draws the eyebrow rule, the Team
// circle, link underlines and the accent bar on cards.

export type WeightId = "fine" | "balanced" | "heavy" | "marker";

export interface Weight {
  id: WeightId;
  name: string;
  thin: string;
  fat: string;
  note: string;
}

export const WEIGHTS: Weight[] = [
  { id: "fine", name: "Fine", thin: "1px", fat: "2px", note: "Everything is a hairline and the heavy stroke is only just heavier. Quiet, precise, closest to a printed report." },
  { id: "balanced", name: "Balanced", thin: "1px", fat: "3px", note: "A hairline grid with a stroke you notice. The default, and what the page looked like in round one." },
  { id: "heavy", name: "Heavy", thin: "1px", fat: "5px", note: "The heavy stroke starts to feel drawn. The eyebrow rule and the Team circle become marks rather than lines." },
  { id: "marker", name: "Marker", thin: "2px", fat: "8px", note: "Every line is deliberate and the heavy ones are felt-tip. The loosest option, and the one to watch on the tier cards." },
];

// Line width scales the chosen weight preset, in quarter steps, so the gap
// between thin and fat is preserved while the whole page gets lighter or
// heavier. Half is as light as a hairline can go and still render; double is
// as heavy as any preset stays reasonable at. Marker at double is 16px.

export interface LineScale {
  id: string;
  factor: number;
  name: string;
}

export const LINE_SCALES: LineScale[] = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((f) => ({
  id: `scale-${Math.round(f * 100)}`,
  factor: f,
  name: `×${f}`,
}));

/* ------------------------------------------------------------------ */
/* Fill                                                                */
/* ------------------------------------------------------------------ */

// How accent surfaces are painted. Solid uses accent 1 flat. Gradient runs
// accent 1 into accent 2, and on to accent 3 when one is set, across
// buttons, fat rules, card strokes, the highlighted word in the hero and
// the chips in the rail.

export type FillId = "solid" | "gradient";

export interface Fill {
  id: FillId;
  name: string;
  note: string;
}

export const FILLS: Fill[] = [
  { id: "solid", name: "Solid", note: "Accent 1 flat on every accent surface." },
  { id: "gradient", name: "Gradient", note: "Accent 1 into accent 2, and into accent 3 when set, at 135 degrees." },
];

/* ------------------------------------------------------------------ */
/* Approaches                                                          */
/* ------------------------------------------------------------------ */

// How the page is composed. Same tokens, different amount of chrome. Applied
// as data-approach on the stage; the overrides live in design.css.

export type ApproachId = "modern" | "minimal" | "formal";

export interface Approach {
  id: ApproachId;
  name: string;
  note: string;
}

export const APPROACHES: Approach[] = [
  { id: "modern", name: "Modern #1", note: "Round one. Cards and steps in soft boxes, an accent bar on hover, the grid you can see." },
  { id: "minimal", name: "Minimal #1", note: "Very few boxes. Hairlines only, generous black space, content sits on the stage rather than in panels." },
  { id: "formal", name: "Formal Bold", note: "Sections alternate in contrast, section numbers go large, rules run the full width and cards carry a heavy left stroke." },
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
  { id: "fill", name: "Fill", note: "Color floods in. Buttons invert, cards tint toward the accent. The loudest option." },
  { id: "scale", name: "Scale", note: "Element grows slightly toward the pointer. Playful, and easy to overdo." },
  { id: "quiet", name: "Quiet", note: "Color and border change only. No motion. Safest for a Fortune 500 buyer." },
];

/* ------------------------------------------------------------------ */

/** the id that stands for "no accent in this slot" in a hash */
export const NO_ACCENT = "none";

export interface Combo {
  bg: Background;
  /** the loud one: buttons, the Team circle, the arc */
  accent: Accent;
  /** the quiet one: eyebrows, links, the second blob */
  accent2: Accent;
  /** optional, data: tags, step numbers, captions, the synapse signals. Falls back to accent 2 */
  accent3: Accent | null;
  /** optional, wash: tints only, never text. Bands, blobs, hover tints. Falls back to accent 1 */
  accent4: Accent | null;
  type: TypePair;
  /** paragraph face override; null uses the pairing's own body face */
  body: BodyFont | null;
  /** minor roles, null means the role's default */
  eyebrow: Face | null;
  caption: Face | null;
  ui: Face | null;
  weight: Weight;
  scale: LineScale;
  fill: Fill;
  approach: Approach;
  entrance: Effect<EntranceId>;
  hover: Effect<HoverId>;
}

// Default is the first entry on each axis, except weight, which defaults to
// Balanced because that is what every round-one link looked like. Accent 2
// defaults to the first entry of a different family so the pair is visibly
// a pair.
export const DEFAULT_COMBO: Combo = {
  bg: BACKGROUNDS[0],
  accent: ACCENTS[0],
  accent2: ACCENTS.find((a) => a.family !== ACCENTS[0].family) ?? ACCENTS[1],
  accent3: null,
  accent4: null,
  type: TYPE_PAIRS[0],
  body: null,
  eyebrow: null,
  caption: null,
  ui: null,
  weight: WEIGHTS.find((w) => w.id === "balanced") ?? WEIGHTS[0],
  scale: LINE_SCALES.find((x) => x.factor === 1) ?? LINE_SCALES[0],
  fill: FILLS[0],
  approach: APPROACHES[0],
  entrance: ENTRANCES[0],
  hover: HOVERS[0],
};

/**
 * A named, pressable combination shown at the top of the picker. Two of
 * them: Wilfred's recommendation and the client's own pick, so the two can
 * be flipped between without hunting for either.
 */
export interface Pick {
  id: string;
  /** which rail block it sits in */
  section: "picks" | "feedback";
  kicker: string;
  title: string;
  hash: string;
}

export const PICKS: Pick[] = [
  {
    id: "recommended",
    section: "picks",
    kicker: "01 · Wilfred's recommendation",
    title: "Wilfred’s recommendation",
    // Revised 25 September 2026, building on the client's pick: their
    // background and pink, their own cyan as the quiet accent, a refined
    // serif in place of Syne.
    hash: "#synapse.pink-magenta.cyan-samuh.dm-serif.unblur.glow.balanced",
  },
  {
    id: "recommended-2",
    section: "picks",
    kicker: "Wilfred's second recommendation",
    title: "Wilfred\u2019s second recommendation",
    // Formal Bold on the darker Slate, the deck pink with the deck teal,
    // Playfair for headings, heavier lines, unblur in and a quiet hover.
    hash: "#formal.slate.pink-samuh.cyan-teal.playfair.heavy.scale-100.unblur.quiet",
  },
  {
    id: "client",
    section: "feedback",
    kicker: "24 September",
    title: "Cyan and more formal font",
    // The link Mike sent, with the cyan the team said they used in place of
    // the doubled magenta.
    hash: "#synapse.pink-magenta.cyan-samuh.syne.unblur.glow.balanced",
  },
];

export function pickCombo(p: Pick): Combo {
  return parseComboHash(p.hash);
}

/**
 * A name for the combination, so people can talk about it without reading
 * a hash. Background becomes a word, accent 1 supplies the color, approach
 * prefixes when it is not the default. "Neural Magenta", "Formal Lava Amber".
 */
const BG_WORD: Record<BackdropId, string> = {
  void: "Midnight",
  slate: "Graphite",
  aurora: "Lava",
  chalk: "Blackboard",
  synapse: "Neural",
};

export function comboName(c: Combo): string {
  const prefix = c.approach.id === "modern" ? "" : c.approach.name.replace(/ #\d+$/, "") + " ";
  return `${prefix}${BG_WORD[c.bg.id]} ${c.accent.name}`;
}

/** the paragraph face in use: the override, else the pairing's own */
export function bodyName(c: Combo): string {
  return c.body ? c.body.name : c.type.bodyName;
}

/** kept for the home shell and older callers */
export function recommendedCombo(): Combo {
  return pickCombo(PICKS[0]);
}

export function sameCombo(a: Combo, b: Combo): boolean {
  return comboHash(a) === comboHash(b);
}

/**
 * The shareable form:
 * #approach.background.accent1.accent2[.accent3[.accent4]].type.weight.scale.entrance.hover
 * Accents 3 and 4 only appear when set; "none" holds slot 3 open when only
 * slot 4 is set.
 */
export function comboHash(c: Combo): string {
  const accents = [c.accent.id, c.accent2.id];
  if (c.accent4) accents.push(c.accent3?.id ?? NO_ACCENT, c.accent4.id);
  else if (c.accent3) accents.push(c.accent3.id);
  const roles = (["eyebrow", "caption", "ui"] as FontRole[])
    .filter((r) => c[r])
    .map((r) => `.${roleId(r, c[r] as Face)}`)
    .join("");
  const body = (c.body ? `.${c.body.id}` : "") + roles;
  const fill = c.fill.id === "solid" ? "" : `.${c.fill.id}`;
  return `#${c.approach.id}.${c.bg.id}.${accents.join(".")}${fill}.${c.type.id}${body}.${c.weight.id}.${c.scale.id}.${c.entrance.id}.${c.hover.id}`;
}

// Ids that were renamed or retired after links went out.
const LEGACY_IDS: Record<string, string> = {
  ascent: "slate",
  orbit: "synapse",
  instrument: "unbounded",
  "pink-hot": "pink-samuh",
  "blue-sky": "cyan-samuh",
  "blue-electric": "violet-peri",
  "blue-peri": "violet-peri",
  bilbo: "elite",
  sugiyama: "elite",
};

/**
 * Reads a hash back into a combo. Order does not matter, every id is unique
 * across the axes, and anything unrecognised falls back to the default. The
 * older links without a weight, and the original three-part links, still
 * resolve.
 */
export function parseComboHash(hash: string): Combo {
  const parts = hash.replace(/^#/, "").split(".").filter(Boolean);
  const c: Combo = { ...DEFAULT_COMBO };
  const accents: (Accent | null)[] = [];
  for (const raw of parts) {
    const id = LEGACY_IDS[raw] ?? raw;
    if (id === NO_ACCENT) { accents.push(null); continue; }
    const bg = BACKGROUNDS.find((x) => x.id === id);
    if (bg) { c.bg = bg; continue; }
    const ac = ACCENTS.find((x) => x.id === id);
    if (ac) { accents.push(ac); continue; }
    const tp = TYPE_PAIRS.find((x) => x.id === id);
    if (tp) { c.type = tp; continue; }
    const bf = BODY_FONTS.find((x) => x.id === id);
    if (bf) { c.body = bf; continue; }
    const m = /^(eyebrow|caption|ui)-(.+)$/.exec(id);
    if (m) {
      const face = FACES.find((x) => x.slug === m[2]);
      if (face) { c[m[1] as FontRole] = face; continue; }
    }
    const wt = WEIGHTS.find((x) => x.id === id);
    if (wt) { c.weight = wt; continue; }
    const sc = LINE_SCALES.find((x) => x.id === id);
    if (sc) { c.scale = sc; continue; }
    const ap = APPROACHES.find((x) => x.id === id);
    if (ap) { c.approach = ap; continue; }
    const fl = FILLS.find((x) => x.id === id);
    if (fl) { c.fill = fl; continue; }
    const en = ENTRANCES.find((x) => x.id === id);
    if (en) { c.entrance = en; continue; }
    const hv = HOVERS.find((x) => x.id === id);
    if (hv) { c.hover = hv; continue; }
  }
  if (accents[0]) c.accent = accents[0];
  if (accents[1]) c.accent2 = accents[1];
  c.accent3 = accents[2] ?? null;
  c.accent4 = accents[3] ?? null;
  if (!parts.some((raw) => BODY_FONTS.some((b) => b.id === raw))) c.body = null;
  for (const r of ["eyebrow", "caption", "ui"] as FontRole[]) {
    if (!parts.some((raw) => raw.startsWith(`${r}-`))) c[r] = null;
  }
  if (!parts.includes("gradient")) c.fill = FILLS[0];
  return c;
}

/** the two rule widths after the scale is applied, as CSS lengths */
export function ruleWidths({ weight, scale }: { weight: Weight; scale: LineScale }): { thin: string; fat: string } {
  const px = (v: string) => `${parseFloat(v) * scale.factor}px`;
  return { thin: px(weight.thin), fat: px(weight.fat) };
}

export function cssVars(combo: Combo): React.CSSProperties {
  const { bg, accent, accent2, accent3, accent4, type, body, eyebrow, caption, ui } = combo;
  const bodyVar = body?.var ?? type.bodyVar;
  const rule = ruleWidths(combo);
  const data = accent3 ?? accent2;
  const wash = accent4 ?? accent;
  return {
    "--base": bg.base,
    "--surface": bg.surface,
    "--surface-alt": bg.surfaceAlt,
    "--border": bg.border,
    "--text": bg.text,
    "--muted": bg.muted,
    "--rule-thin": rule.thin,
    "--rule-fat": rule.fat,
    "--radius": bg.radius,
    "--dur": bg.motionDur,
    "--ease": bg.motionEase,
    "--accent": accent.hex,
    "--on-accent": accent.on,
    "--accent-2": accent2.hex,
    "--on-accent-2": accent2.on,
    "--accent-3": data.hex,
    "--on-accent-3": data.on,
    "--accent-4": wash.hex,
    "--accent-grad": accent3
      ? `linear-gradient(135deg, ${accent.hex}, ${accent2.hex}, ${accent3.hex})`
      : `linear-gradient(135deg, ${accent.hex}, ${accent2.hex})`,
    /* how strongly a wash tints large areas: nothing unless accent 4 is set */
    "--wash-mix": accent4 ? "10%" : "0%",
    "--font-display": type.displayVar,
    "--font-body": bodyVar,
    "--font-mono": "var(--f-plex-mono)",
    "--font-eyebrow": eyebrow?.var ?? "var(--f-plex-mono)",
    "--font-caption": caption?.var ?? "var(--f-plex-mono)",
    "--font-ui": ui?.var ?? bodyVar,
    "--display-weight": String(type.displayWeight),
    "--display-tracking": type.displayTracking,
    "--display-leading": type.displayLeading,
  } as React.CSSProperties;
}
