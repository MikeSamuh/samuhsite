// The site's one composition: the frame, the nav, the copy flags and the
// section order. Until 21 October 2026 this was the working draft's entry
// in src/app/draft/drafts.ts; that day the draft was promoted to the root
// and the drafts went (docs/decisions.md). Same rule as tokens.ts and
// layout.ts: nothing outside this file carries these choices.

import { PRESETS, parseLayoutHash, type Layout, type PageId, type SectionId } from "@/lib/layout";
import type { NavProps, CopyOverrides } from "@/app/layout/sections";
import { REPORT } from "@/lib/report";

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
  // the order of the call of 6 Nov 2026; the lists under each are NAV_MENUS
  nav: { links: ["solutions", "process", "insights", "about"], brand: "icons" },
  // the metaphor cards came off the home on 6 Nov 2026: they are a landing
  // page of their own now, /l/metaphor-cards, listed in src/lib/landing.ts
  // the TeamQ tool section ("Find your team's hidden performance tax") is
  // off the home too (Wilfred, 6 Nov 2026), to clean the page; the code
  // stays, put "tool" back in the order to have it again
  // the close at the foot is off too (6 Nov 2026): the ask is at the end of
  // the circles beat, and the FAQ ends the page
  // the closing block, what Samuh offers in three links, ends the page (call of 6 Nov 2026)
  order: ["hero", "meaning", "circles", "voices", "case", "faq", "offer"],
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
      ctaHref: "/#assess",
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
  // Methodology since the call of 6 Nov 2026; /process redirects here.
  // The page id stays "process", see PageId in layout.ts
  process: "/methodology",
  insights: "/insights",
  about: "/about",
  contact: "/contact",
  // the way in: the free assessment's email box on /contact (6 Nov 2026,
  // the home's tool section and its close are off the page). /start the
  // page is gone; Get started buttons on other pages land here
  start: "/contact#assess",
};

/** Careers (call of 6 Nov 2026): /careers and /careers/<slug>, under About
 *  in the nav and in the footer. Off takes the links away, not the pages. */
export const CAREERS_LIVE = true;
export const CAREERS_PATH = "/careers";

/** One link in a nav dropdown: a section of a page (page and hash), a path
 *  on the site, or a link out. */
export interface NavItem { label: string; page?: PageId; hash?: string; path?: string; external?: string }

/** The lists under the nav's pages (call of 6 Nov 2026,
 *  docs/sprint-solutions.md section 3). The page's own label stays a link
 *  to the page; a chevron button beside it opens its list. In the mobile
 *  overlay the lists are open under their page. */
export const NAV_MENUS: Partial<Record<PageId, NavItem[]>> = {
  solutions: [
    { label: "Who we work with", page: "solutions", hash: "who" },
    { label: "Assessments", page: "solutions", hash: "assess" },
    { label: "Sprints", page: "solutions", hash: "sprints" },
    { label: "Workshops", page: "solutions", hash: "workshops" },
  ],
  process: [
    { label: "The 90-day sprint", page: "process", hash: "sprint" },
    { label: "The science", page: "process", hash: "science" },
    { label: "Work Culture Report", external: REPORT.page },
  ],
  // About has no list (Wilfred, 11 Nov 2026): a plain link. Careers stays
  // in the footer
};

/** The three cases from the three-pager of Oct 2026, page 3, under
 *  Executive Team Sprints on Solutions. Off until Rahul clears them for
 *  the public site (docs/sprint-solutions.md, "Client owes"). */
export const SHOW_CASES = false;

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

/** The hand-off to the platform from the email box (docs/sprint-solutions.md
 *  section 4): a form POST, so the address stays out of the URL, the logs
 *  and the referrer. ASSUMED, Mike to confirm: the path, that it accepts a
 *  cross-site form POST, the field names, and that the platform then sends
 *  the magic link. Only this constant changes when he answers. */
export const PLATFORM_HANDOFF = { path: "/start", fields: { email: "email", intent: "intent" } } as const;

/** Where a nav item goes. */
export function navHref(item: NavItem): string {
  if (item.external) return item.external;
  if (item.path) return item.path;
  return `${ROUTES[item.page ?? "home"]}${item.hash ? `#${item.hash}` : ""}`;
}

export function pageFromPath(path: string): PageId {
  const clean = path.replace(/\/$/, "") || "/";
  return (
    (Object.keys(ROUTES) as PageId[]).find((k) => k !== "home" && (clean === ROUTES[k] || clean.startsWith(`${ROUTES[k]}/`))) ?? "home"
  );
}
