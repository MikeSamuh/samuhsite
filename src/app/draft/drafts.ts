// The drafts. Three sculpted versions of the site, all in the locked style
// and the Editorial layout, each at /draft/<letter>. /draft itself is the
// index: the style guide they share, and a preview of each at three widths.
//
// Same rule as tokens.ts and layout.ts: nothing outside this file carries a
// draft's name, note or owner.

import { PRESETS, parseLayoutHash, type Layout, type PageId } from "@/lib/layout";
import type { NavProps, CopyOverrides } from "../layout/sections";

export type DraftId = "a" | "b" | "c";

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
}

export const DRAFTS: Draft[] = [
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
    note: "Starts as A, then Wilfred's 28 September edits: copy over the hero video, the leak line as the thesis full width with the dictionary in its own section under it, pointer-active circles, icon nav that grows into the logos on scroll.",
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

export const draftBase = (id: DraftId) => `${DRAFT_ROOT}/${id}`;

export function getDraft(id: string): Draft {
  return DRAFTS.find((d) => d.id === id) ?? DRAFTS[0];
}

export function pageFromPath(path: string, id: DraftId): PageId {
  const rest = path.replace(draftBase(id), "").replace(/\/$/, "");
  return (Object.keys(ROUTES) as PageId[]).find((k) => ROUTES[k] === rest) ?? "home";
}
