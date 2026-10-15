// The drafts. Sculpted versions of the site, all in the locked style and the
// Editorial layout, each at /draft/<id>. /draft itself is the index: the
// style guide they share, and a preview of each at three widths.
//
// Since 5 October 2026 the one that moves is the WORKING DRAFT at
// /draft/working. It started as an exact copy of B. B is frozen as the
// reference the client reacted to; A and C are retired. Every edit lands on
// the working draft, never on B. See docs/decisions.md.
//
// Same rule as tokens.ts and layout.ts: nothing outside this file carries a
// draft's name, note or owner.

import { PRESETS, parseLayoutHash, type Layout, type PageId, type SectionId } from "@/lib/layout";
import type { NavProps, CopyOverrides } from "../layout/sections";

export type DraftId = "a" | "b" | "c" | "working";

/** The draft that moves. Everything else is frozen. */
export const WORKING: DraftId = "working";

export interface Draft {
  id: DraftId;
  letter: string;
  name: string;
  owner: string;
  note: string;
  /** the frame and section variants, from layout.ts so the tool and the draft cannot drift */
  layout: Layout;
  /** nav link order and brand treatment, when they differ from the default */
  nav?: Pick<NavProps, "links" | "brand" | "partner">;
  /** copy that differs from the shared sections */
  copy?: CopyOverrides;
  /** process stages use the traced figures that morph stage to stage, not the PNG icons */
  figures?: boolean;
  /** which home sections render, in this order. A section left out is off.
   *  Without it, the scope's twelve in the scope's order, less the ones off */
  order?: SectionId[];
}

/** B's frame, nav and copy as frozen on 5 October 2026. The working draft
 *  starts from the same shape; its own edits go on its DRAFTS entry below. */
const B_SHAPE: Pick<Draft, "layout" | "nav" | "copy"> = {
  layout: parseLayoutHash(PRESETS[0].hash.replace(".hero-video.", ".hero-cinema.").replace(".meaning-aside.", ".meaning-block.")),
  nav: { links: ["about", "process", "solutions", "insights"], brand: "icons" },
  copy: {
    heroLede: null,
    thesis: "Most teams leak performance through their environment, not their effort. Samuh finds where yours is leaking, and gives you the practices to close it.",
    noPartnerLine: true,
    noEyebrow: true,
    noHeroCtas: true,
    // the two redrawn cards Wilfred added on 30 September; the rest wait
    cards: [
      ["In a labyrinth with different maps", "Everyone is moving. Nobody is on the same page.", "/metaphor/maze.png"],
      ["Bottom of the mountain", "The summit is agreed. The route is not.", "/metaphor/mountain.png"],
    ],
  },
};

export const DRAFTS: Draft[] = [
  {
    id: "working",
    letter: "W",
    name: "Working draft",
    owner: "Wilfred",
    note: "The live draft. Began on 5 October 2026 as an exact copy of B, and every edit from that day forward lands here. B stays as it was for comparison.",
    ...B_SHAPE,
    // 12 October: the shorter home. Hero, the dictionary in one row (the
    // word on the left, the sense on the right), the leak line as its own
    // section, where others focus becoming where we focus and then the four
    // capacities, the tool, the metaphors, testimonials, the research claim
    // with the case study, and the close. Aspirational, research and the
    // equation sections go, folded into their neighbours.
    layout: { ...B_SHAPE.layout, sections: { ...B_SHAPE.layout.sections, circles: "circles-morph", cards: "cards-one" } },
    order: ["hero", "meaning", "thesis", "circles", "tool", "cards", "voices", "case", "faq", "start"],
    copy: {
      ...B_SHAPE.copy,
      thesis: "Most teams ~leak performance through their environment, not their effort~. Samuh finds where yours is leaking, and gives you the practices to close it.",
      revealIntro: true,
      revealSections: ["tool", "faq"],
      startSub: null,
      // TODO(content): the tool asks for the assessment, draft words
      tool: {
        kicker: "TeamQ",
        title: "Find out where your team is leaking",
        pitch: null,
        cta: "Get your team\u2019s assessment",
        // straight to the ask on the live page, not the top of the tool
        ctaHref: "/teamq#ask",
      },
      // the client's network background, until the real film arrives. Not
      // in git (video never is): public/hero-bg.mp4 on the machine that
      // builds, see docs/assets.md
      heroVideo: "/hero-bg.mp4",
      heroBackground: true,
      caseWithResearch: true,
    },
    figures: true,
  },
  {
    id: "a",
    letter: "A",
    name: "Twelve sections",
    owner: "Wilfred",
    note: "The scope order, sculpted from the signed scope and the decks: the partner credit by the logo, the equation as a visual with hover definitions, working sliders with the estimate left visibly to SAMUH, the one published testimonial, and a close that asks for the assessment first and a call second.",
    layout: parseLayoutHash(PRESETS[0].hash),
    nav: { partner: true },
  },
  {
    id: "b",
    letter: "B",
    name: "Twelve sections, second pass",
    owner: "Wilfred",
    note: "Frozen 5 October 2026, the version the client reacted to. Starts as A, then Wilfred's 28 September edits: copy over the hero video, the leak line as the thesis full width with the dictionary in its own section under it, pointer-active circles, icon nav that grows into the logos on scroll.",
    ...B_SHAPE,
  },
  {
    id: "c",
    letter: "C",
    name: "Eight sections",
    owner: "Claude",
    note: "The homepage review, built: the thesis said once over the video, the team as the missing level, the model before the evidence, one taxonomy carried from the equation into the tool, proof in one section, one ask at the close.",
    layout: parseLayoutHash(PRESETS[0].hash),
  },
];

export const DRAFT_ROOT = "/draft";

export const ROUTES: Record<PageId, string> = {
  home: "",
  solutions: "/solutions",
  process: "/process",
  insights: "/insights",
  about: "/about",
  contact: "/contact",
  start: "/get-started",
};

/** Pages that are no longer drafts. They live at the root, in the working
 *  draft's shell, and the working draft (and frozen B) link straight to them. */
export const LIVE: Partial<Record<PageId, string>> = {
  contact: "/contact",
  // the 21 posts carried over from samuh.work, 12 October 2026
  insights: "/insights",
  // "Explore TeamQ". The intake assessment that used to sit behind Get
  // Started is a later sprint
  start: "/teamq",
};

export const draftBase = (id: DraftId) => `${DRAFT_ROOT}/${id}`;

/** Where a draft's link to a page goes: the live route for the working draft
 *  and B when one exists, otherwise the draft's own copy. */
export function hrefFor(id: DraftId, page: PageId): string {
  return ((id === WORKING || id === "b") && LIVE[page]) || `${draftBase(id)}${ROUTES[page]}`;
}

export function getDraft(id: string): Draft {
  return DRAFTS.find((d) => d.id === id) ?? DRAFTS[0];
}

export function pageFromPath(path: string, id: DraftId): PageId {
  const clean = path.replace(/\/$/, "");
  // a live page owns its sub-paths too: /insights/<slug> is still Insights
  const live = (Object.keys(LIVE) as PageId[]).find((k) => clean === LIVE[k] || clean.startsWith(`${LIVE[k]}/`));
  if (live) return live;
  const rest = path.replace(draftBase(id), "").replace(/\/$/, "");
  return (Object.keys(ROUTES) as PageId[]).find((k) => ROUTES[k] === rest) ?? "home";
}
