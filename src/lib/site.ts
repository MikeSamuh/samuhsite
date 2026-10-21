// The site's one composition: the frame, the nav, the copy flags and the
// section order. Until 21 October 2026 this was the working draft's entry
// in src/app/draft/drafts.ts; that day the draft was promoted to the root
// and the drafts went (docs/decisions.md). Same rule as tokens.ts and
// layout.ts: nothing outside this file carries these choices.

import { PRESETS, parseLayoutHash, type Layout, type PageId, type SectionId } from "@/lib/layout";
import type { NavProps, CopyOverrides } from "@/app/layout/sections";

export interface Site {
  /** the frame and section variants, from layout.ts */
  layout: Layout;
  /** nav link order and brand treatment */
  nav?: Pick<NavProps, "links" | "brand" | "partner">;
  /** flags and copy that differ from the shared sections' defaults */
  copy?: CopyOverrides;
  /** process stages use the traced figures that morph stage to stage */
  figures?: boolean;
  /** which home sections render, in this order. A section left out is off */
  order?: SectionId[];
}

/** B's frame as frozen on 5 October 2026, which the site kept. */
const BASE = parseLayoutHash(PRESETS[0].hash.replace(".hero-video.", ".hero-cinema.").replace(".meaning-aside.", ".meaning-block."));

export const SITE: Site = {
  // 12 October: the shorter home. Hero, the dictionary in one row, the leak
  // line as its own section, where others focus becoming where we focus and
  // then the four capacities, the tool, the metaphors, testimonials, the
  // research claim with the case study, and the close
  layout: { ...BASE, sections: { ...BASE.sections, circles: "circles-morph", cards: "cards-one" } },
  nav: { links: ["about", "process", "solutions", "insights"], brand: "icons" },
  order: ["hero", "meaning", "thesis", "circles", "tool", "cards", "voices", "case", "faq", "start"],
  copy: {
    heroLede: null,
    thesis: "Most teams ~leak performance through their environment, not their effort~. Samuh finds where yours is leaking, and gives you the practices to close it.",
    noPartnerLine: true,
    noEyebrow: true,
    noHeroCtas: true,
    // the two redrawn cards Wilfred added on 30 September; the rest wait
    cards: [
      ["In a labyrinth with different maps", "Everyone is moving. Nobody is on the same page.", "/metaphor/maze.png"],
      ["Bottom of the mountain", "The summit is agreed. The route is not.", "/metaphor/mountain.png"],
    ],
    revealIntro: true,
    revealSections: ["tool", "faq"],
    startSub: null,
    // TODO(content): the tool asks for the assessment, draft words
    tool: {
      kicker: "TeamQ",
      title: "Find out where your team is leaking",
      pitch: null,
      cta: "Get your team’s assessment",
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
};

/** Where each page lives. Every internal link reads this. */
export const ROUTES: Record<PageId, string> = {
  home: "/",
  solutions: "/solutions",
  process: "/process",
  insights: "/insights",
  about: "/about",
  contact: "/contact",
  // "Explore TeamQ". The intake assessment that used to sit behind Get
  // Started is a later sprint
  start: "/teamq",
};

/** The page a path belongs to, for the nav's current marker. A page owns
 *  its sub-paths: /insights/<slug> is still Insights. */
export function pageFromPath(path: string): PageId {
  const clean = path.replace(/\/$/, "") || "/";
  return (
    (Object.keys(ROUTES) as PageId[]).find((k) => k !== "home" && (clean === ROUTES[k] || clean.startsWith(`${ROUTES[k]}/`))) ?? "home"
  );
}
