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
  // 2 November: the client's copy review. Hero, the dictionary as its own
  // block, where organizations focus becoming where performance happens
  // (the four capacities cut), the performance tax line as a band, then
  // TeamQ as the whole /teamq experience in place of the demo, the
  // metaphors, testimonials, the research claim with the case study, and
  // the close. docs/decisions.md, 2 Nov 2026
  // Then Mike's call the same day: the funnel narrows to the free LeadQ,
  // the tool sits straight under the circles with nothing explained
  // around it, and the thesis band goes
  layout: { ...BASE, sections: { ...BASE.sections, circles: "circles-morph", thesis: "thesis-band", cards: "cards-one" } },
  nav: { links: ["about", "process", "solutions", "insights"], brand: "icons" },
  order: ["hero", "meaning", "circles", "tool", "cards", "voices", "case", "faq", "start"],
  copy: {
    heroLede: null,
    thesis: "When the team environment is right, people thrive and results follow. Most teams pay a hidden performance tax instead, through their environment, not their effort. TeamQ shows where yours is.",
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
      title: "Find your team’s hidden performance tax",
      pitch: null,
      cta: "Take LeadQ, free",
      ctaHref: "/start?door=leadq",
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
  // "Get started": the fork. LeadQ, TeamQ, OrgQ, or log in (2 Nov 2026).
  // The TeamQ teaser stays at /teamq, linked from the TeamQ card and the
  // footer
  start: "/start",
};

/** The TeamQ explainer, not a nav page: linked from the tool on the home,
 *  the TeamQ card on Solutions and the footer. */
export const TEAMQ_PATH = "/teamq";

/** The platform, platform.samuh.org, where LeadQ and TeamQ run and the
 *  account lives. Unset until it exists: the doors on /start fall back to a
 *  form, and the login door is hidden. docs/decisions.md, 2 Nov 2026. */
export const PLATFORM_URL = process.env.NEXT_PUBLIC_PLATFORM_URL?.replace(/\/$/, "") || null;

/** Where a door on /start sends the person once the platform is up. */
export function platformLink(intent: "leadq" | "teamq" | "login"): string | null {
  if (!PLATFORM_URL) return null;
  return intent === "login" ? `${PLATFORM_URL}/login` : `${PLATFORM_URL}/start?intent=${intent}`;
}

/** The free LeadQ, the one way in (Mike's call of 2 Nov 2026). /start is
 *  the email box: the address, a magic link, the platform. The platform's
 *  own LeadQ entry once it exists. The home's call-out and close use it;
 *  the nav and footer say Let's talk and go to /contact (3 Nov). */
export const LEADQ_HREF: string = platformLink("leadq") ?? ROUTES.start;

/** The page a path belongs to, for the nav's current marker. A page owns
 *  its sub-paths: /insights/<slug> is still Insights. */
export function pageFromPath(path: string): PageId {
  const clean = path.replace(/\/$/, "") || "/";
  return (
    (Object.keys(ROUTES) as PageId[]).find((k) => k !== "home" && (clean === ROUTES[k] || clean.startsWith(`${ROUTES[k]}/`))) ?? "home"
  );
}
