// SAMUH layout options.
//
// The style is locked (see LOCKED_HASH). This file describes what can still
// move: the stage behind the page, the frame the page sits in, and how each
// of the twelve home sections is composed. Three named layouts, A, B and C,
// are presets over those choices and the client can mix from there.
//
// Same rules as tokens.ts: nothing outside this file carries a layout value,
// and every choice has a short id so the URL hash records the whole state.

import {
  BACKGROUNDS,
  parseComboHash,
  type BackdropId,
  type Combo,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* The locked style                                                    */
/* ------------------------------------------------------------------ */

// Mike's link, 25 September 2026: Magenta leads, Steel cyan second,
// Marcellus headings with Inter, Gilda Display captions, heavy lines at
// x1.25, unblur in, glow on hover. The background is the one thing left
// open, so it is a dial here.
export const LOCKED_HASH =
  "#modern.void.pink-magenta.cyan-steel.marcellus.caption-gilda.heavy.scale-125.unblur.glow";

export function lockedCombo(bg: BackdropId): Combo {
  const c = parseComboHash(LOCKED_HASH);
  return { ...c, bg: BACKGROUNDS.find((b) => b.id === bg) ?? c.bg };
}

/* ------------------------------------------------------------------ */
/* Frame                                                               */
/* ------------------------------------------------------------------ */

export interface Opt<Id extends string = string> {
  id: Id;
  name: string;
  note?: string;
}

export type AlignId = "align-left" | "align-center";
export type WidthId = "width-narrow" | "width-standard" | "width-wide";
export type SpacingId = "space-tight" | "space-regular" | "space-airy";
export type NavId = "nav-bar" | "nav-centered" | "nav-minimal" | "nav-menu";
export type DividerId = "rule-hairline" | "rule-none" | "rule-heavy";
export type NumbersId = "numbers-on" | "numbers-off";
export type ViewId = "desktop" | "tablet" | "phone";

export const ALIGNS: Opt<AlignId>[] = [
  { id: "align-left", name: "Left", note: "Headings and copy start at the left edge of the column. The editorial default." },
  { id: "align-center", name: "Centered", note: "Everything centred on the column. Calmer, more like a keynote." },
];

export const WIDTHS: (Opt<WidthId> & { px: number })[] = [
  { id: "width-narrow", name: "Narrow", px: 960, note: "A reading column. Long lines never happen." },
  { id: "width-standard", name: "Standard", px: 1120, note: "What the style picker used." },
  { id: "width-wide", name: "Wide", px: 1320, note: "Room for three and four columns. Needs the big screen." },
];

export const SPACINGS: (Opt<SpacingId> & { scale: number })[] = [
  { id: "space-tight", name: "Tight", scale: 0.7, note: "Sections close together. More on a screen." },
  { id: "space-regular", name: "Regular", scale: 1, note: "One clear beat between sections." },
  { id: "space-airy", name: "Airy", scale: 1.45, note: "Each section gets its own screen. Slow and confident." },
];

export const NAVS: Opt<NavId>[] = [
  { id: "nav-bar", name: "Bar", note: "Logo left, links and the button right, a hairline under." },
  { id: "nav-centered", name: "Centered", note: "Logo in the middle, links either side." },
  { id: "nav-minimal", name: "Minimal", note: "Logo and one button. Links live in a menu." },
  { id: "nav-menu", name: "Menu", note: "Logo centered, hamburger on the left, a full-screen menu drops down. Bold links." },
];

export const DIVIDERS: Opt<DividerId>[] = [
  { id: "rule-hairline", name: "Hairline", note: "A thin rule between sections." },
  { id: "rule-none", name: "None", note: "Space does the separating." },
  { id: "rule-heavy", name: "Heavy", note: "The fat rule, in the accent, between sections." },
];

export const NUMBERS: Opt<NumbersId>[] = [
  { id: "numbers-on", name: "On", note: "01 to 12 beside each section heading." },
  { id: "numbers-off", name: "Off" },
];

export const VIEWS: (Opt<ViewId> & { px: number })[] = [
  { id: "desktop", name: "Desktop", px: 1440 },
  { id: "tablet", name: "Tablet", px: 834 },
  { id: "phone", name: "Phone", px: 390 },
];

/* ------------------------------------------------------------------ */
/* Pages                                                               */
/* ------------------------------------------------------------------ */

// The sitemap from docs/scope.md. Home is the twelve sections below; the
// rest are composed in pages.tsx from confirmed material and visible TODOs.
// "start" is the intake assessment, reached from Get Started, not the nav.

export type PageId = "home" | "solutions" | "process" | "insights" | "about" | "contact" | "start";

export interface PageDef {
  id: PageId;
  name: string;
  nav: boolean;
  note: string;
}

export const PAGES: PageDef[] = [
  { id: "home", name: "Home", nav: true, note: "The argument, then conversion." },
  { id: "solutions", name: "Solutions", nav: true, note: "Self-guided, Supported, Guided on one page, a comparison table, testimonials." },
  { id: "process", name: "Process", nav: true, note: "The team process. Structure still TBD in the scope." },
  { id: "insights", name: "Insights", nav: true, note: "Foundations, articles, video and research in one filterable feed. Research gets its own weight." },
  { id: "about", name: "About", nav: true, note: "About SAMUH, the team, Sapien Labs in the body. Partners TBA." },
  { id: "contact", name: "Contact", nav: true, note: "Form plus calendar booking, contact details." },
  { id: "start", name: "Get Started", nav: false, note: "The intake assessment. Free, ungated, value before the first ask. Not TeamQ." },
];

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

export type SectionId =
  | "hero" | "thesis" | "meaning" | "circles" | "aspire" | "research"
  | "voices" | "case" | "tool" | "cards" | "equation" | "start";

export interface SectionDef {
  id: SectionId;
  n: number;
  title: string;
  intent: string;
  /** every variant id is prefixed with the section id so hashes stay unique */
  variants: Opt[];
}

export const SECTIONS: SectionDef[] = [
  {
    id: "hero", n: 1, title: "Hero video",
    intent: "Muted looping preview, full video on click. Supplied by SAMUH.",
    variants: [
      { id: "hero-split", name: "Split", note: "Copy left, video right." },
      { id: "hero-centered", name: "Copy first", note: "Copy centred, video below." },
      { id: "hero-video", name: "Video first", note: "Video full width on top, copy below." },
      { id: "hero-cinema", name: "Cinema", note: "Video behind the copy, full width." },
    ],
  },
  {
    id: "thesis", n: 2, title: "Thesis statement",
    intent: "The problem SAMUH solves. Shares the screen with the hero. Carries the Sapien Labs association.",
    variants: [
      { id: "thesis-under", name: "Under hero", note: "A strip at the foot of the hero, no scroll stop." },
      { id: "thesis-band", name: "Band", note: "Its own short section." },
    ],
  },
  {
    id: "meaning", n: 3, title: "What SAMUH means",
    intent: "One sentence, because the word raises a question.",
    variants: [
      { id: "meaning-line", name: "One line", note: "A single centred sentence." },
      { id: "meaning-aside", name: "Aside", note: "Small, beside a rule, like a footnote that got promoted." },
    ],
  },
  {
    id: "circles", n: 4, title: "Three circles",
    intent: "Team, individual, organization. Establishes teams as the subject.",
    variants: [
      { id: "circles-nested", name: "Nested", note: "The organization houses the team, the team houses the individual." },
      { id: "circles-row", name: "Row", note: "Three circles side by side, each with a line under." },
      { id: "circles-stack", name: "Stacked", note: "Three short bands, one per circle." },
    ],
  },
  {
    id: "aspire", n: 5, title: "Aspirational moment",
    intent: "Core competencies. Imagery or a framing that makes you want to lead a team like this.",
    variants: [
      { id: "aspire-image", name: "Image band", note: "Full-width image with the statement over it." },
      { id: "aspire-columns", name: "Columns", note: "Statement, then the competencies in columns." },
      { id: "aspire-statement", name: "Statement", note: "Type only, very large." },
    ],
  },
  {
    id: "research", n: 6, title: "The research claim",
    intent: "One research-backed statement, links to the Sapien Labs report. Wording not landed.",
    variants: [
      { id: "research-statement", name: "Statement", note: "The line, then the link." },
      { id: "research-card", name: "Card", note: "In a panel with the Sapien Labs credit." },
      { id: "research-quote", name: "Pull quote", note: "Set as a quotation with a heavy rule." },
    ],
  },
  {
    id: "voices", n: 7, title: "Testimonials",
    intent: "Trust before proof.",
    variants: [
      { id: "voices-grid", name: "Grid", note: "Three at once." },
      { id: "voices-single", name: "Single", note: "One large quote at a time." },
      { id: "voices-strip", name: "Strip", note: "A row that scrolls sideways." },
    ],
  },
  {
    id: "case", n: 8, title: "Case study reference",
    intent: "Snippet plus link. Likely anonymised.",
    variants: [
      { id: "case-card", name: "Card", note: "A panel with the snippet and the link." },
      { id: "case-split", name: "Split", note: "Image one side, snippet the other." },
      { id: "case-inline", name: "Inline", note: "One line and a link, no panel." },
    ],
  },
  {
    id: "tool", n: 9, title: "Interactive data tool",
    intent: "Visitor adjusts team environment factors, sees estimated productive days lost update live.",
    variants: [
      { id: "tool-card", name: "Card", note: "Sliders and result in one panel." },
      { id: "tool-split", name: "Split", note: "Sliders left, the number right and large." },
      { id: "tool-bleed", name: "Full bleed", note: "Edge to edge, on a contrast band." },
    ],
  },
  {
    id: "cards", n: 10, title: "Metaphor cards",
    intent: "Illustrated team archetypes to self-identify with. Sits after the data so it reads as insight.",
    variants: [
      { id: "cards-grid", name: "Grid", note: "Four across." },
      { id: "cards-strip", name: "Strip", note: "A row that scrolls sideways." },
      { id: "cards-list", name: "List", note: "One per row, illustration beside the text." },
    ],
  },
  {
    id: "equation", n: 11, title: "The SAMUH equation",
    intent: "Visual section.",
    variants: [
      { id: "equation-centered", name: "Centered", note: "The equation on its own, large." },
      { id: "equation-split", name: "Split", note: "The equation one side, the explanation the other." },
    ],
  },
  {
    id: "start", n: 12, title: "Get Started",
    intent: "Entry to the intake assessment. May move off the homepage.",
    variants: [
      { id: "start-band", name: "Band", note: "A contrast band with the button." },
      { id: "start-form", name: "Inline form", note: "The first question, right here." },
      { id: "start-split", name: "Split", note: "Statement one side, the two calls to action the other." },
    ],
  },
];

export const OFF = "off";

/* ------------------------------------------------------------------ */
/* The layout                                                          */
/* ------------------------------------------------------------------ */

export interface Layout {
  bg: BackdropId;
  align: Opt<AlignId>;
  width: (typeof WIDTHS)[number];
  spacing: (typeof SPACINGS)[number];
  nav: Opt<NavId>;
  divider: Opt<DividerId>;
  numbers: Opt<NumbersId>;
  /** preview width; in the hash only when not desktop, so links open at the size they were made */
  view: ViewId;
  /** which page the frame shows; in the hash only when not home */
  page: PageId;
  /** variant id per section, or "off" */
  sections: Record<SectionId, string>;
}

export interface Preset {
  id: string;
  letter: string;
  name: string;
  note: string;
  hash: string;
}

// Three starting points. Wilfred guides these; the client mixes from them.
export const PRESETS: Preset[] = [
  {
    id: "a",
    letter: "A",
    name: "Editorial",
    note: "Left aligned, standard column, a hairline between sections. Reads like a well-set report.",
    hash: "#void.align-left.width-standard.space-regular.nav-bar.rule-hairline.numbers-on.hero-split.thesis-under.meaning-aside.circles-nested.aspire-columns.research-statement.voices-grid.case-card.tool-split.cards-grid.equation-split.start-band",
  },
  {
    id: "b",
    letter: "B",
    name: "Keynote",
    note: "Centred, narrow, airy, no rules. One idea per screen, like a talk.",
    hash: "#void.align-center.width-narrow.space-airy.nav-menu.rule-none.numbers-off.hero-centered.thesis-band.meaning-line.circles-row.aspire-statement.research-quote.voices-single.case-inline.tool-card.cards-strip.equation-centered.start-split",
  },
  {
    id: "c",
    letter: "C",
    name: "Cinema",
    note: "Wide and tight, video behind the hero, full-bleed bands, heavy rules. The boldest of the three.",
    hash: "#void.align-left.width-wide.space-tight.nav-minimal.rule-heavy.numbers-on.hero-cinema.thesis-under.meaning-line.circles-stack.aspire-image.research-card.voices-strip.case-split.tool-bleed.cards-list.equation-centered.start-form",
  },
];

export interface Feedback {
  date: string;
  title: string;
  quote: string;
  /** a link into the layout tool, when the note came with one */
  hash?: string;
}

export const FEEDBACK: Feedback[] = [
  {
    date: "25 September",
    title: "Style locked",
    quote:
      "I like the new cyans, I swapped and made pink the primary:\n#modern.void.pink-magenta.cyan-steel.marcellus.caption-gilda.heavy.scale-125.unblur.glow.gather\n\nHere are the fonts we like;\n- Manrope / Inter\n- Marcellus / Inter",
  },
];

export const DEFAULT_LAYOUT: Layout = parseLayoutHash(PRESETS[0].hash);

export function layoutHash(l: Layout): string {
  const secs = SECTIONS.map((s) => l.sections[s.id]).join(".");
  const view = l.view === "desktop" ? "" : `.${l.view}`;
  const page = l.page === "home" ? "" : `.page-${l.page}`;
  return `#${l.bg}.${l.align.id}.${l.width.id}.${l.spacing.id}.${l.nav.id}.${l.divider.id}.${l.numbers.id}.${secs}${view}${page}`;
}

export function sameLayout(a: Layout, b: Layout): boolean {
  return layoutHash({ ...a, view: "desktop", page: "home" }) === layoutHash({ ...b, view: "desktop", page: "home" });
}

/**
 * Reads a hash back into a layout. Order does not matter. A section with no
 * token falls back to its first variant; "<section>-off" hides it.
 */
export function parseLayoutHash(hash: string): Layout {
  const parts = hash.replace(/^#/, "").split(".").filter(Boolean);
  const l: Layout = {
    bg: "void",
    align: ALIGNS[0],
    width: WIDTHS[1],
    spacing: SPACINGS[1],
    nav: NAVS[0],
    divider: DIVIDERS[0],
    numbers: NUMBERS[0],
    view: "desktop",
    page: "home",
    sections: Object.fromEntries(SECTIONS.map((s) => [s.id, s.variants[0].id])) as Record<SectionId, string>,
  };
  for (const id of parts) {
    if (BACKGROUNDS.some((b) => b.id === id)) { l.bg = id as BackdropId; continue; }
    const al = ALIGNS.find((x) => x.id === id); if (al) { l.align = al; continue; }
    const wd = WIDTHS.find((x) => x.id === id); if (wd) { l.width = wd; continue; }
    const sp = SPACINGS.find((x) => x.id === id); if (sp) { l.spacing = sp; continue; }
    const nv = NAVS.find((x) => x.id === id); if (nv) { l.nav = nv; continue; }
    const dv = DIVIDERS.find((x) => x.id === id); if (dv) { l.divider = dv; continue; }
    const nm = NUMBERS.find((x) => x.id === id); if (nm) { l.numbers = nm; continue; }
    const vw = VIEWS.find((x) => x.id === id); if (vw) { l.view = vw.id; continue; }
    if (id.startsWith("page-")) {
      const pg = PAGES.find((x) => x.id === id.slice(5)); if (pg) { l.page = pg.id; continue; }
    }
    const sec = SECTIONS.find((s) => id.startsWith(`${s.id}-`));
    if (sec) {
      if (id === `${sec.id}-${OFF}` || sec.variants.some((v) => v.id === id)) l.sections[sec.id] = id;
    }
  }
  return l;
}

/** "Editorial on Void", or "Custom on Synapse" when it matches no preset */
export function layoutName(l: Layout): string {
  const bg = BACKGROUNDS.find((b) => b.id === l.bg)?.name ?? l.bg;
  const p = PRESETS.find((x) => sameLayout(parseLayoutHash(x.hash), { ...l, bg: parseLayoutHash(x.hash).bg }));
  return `${p ? p.name : "Custom"} on ${bg}`;
}

export function layoutVars(l: Layout): React.CSSProperties {
  return {
    "--width-px": `${l.width.px}px`,
    "--space": String(l.spacing.scale),
  } as React.CSSProperties;
}
