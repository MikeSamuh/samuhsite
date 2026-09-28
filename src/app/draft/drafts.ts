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
  nav?: Pick<NavProps, "links" | "brand">;
  /** copy that differs from the shared sections */
  copy?: CopyOverrides;
}

export const DRAFTS: Draft[] = [
  {
    id: "a",
    letter: "A",
    name: "Twelve sections",
    owner: "Wilfred",
    note: "The scope order as sent on 28 September, with Mike's 27 September notes. The baseline.",
    layout: parseLayoutHash(PRESETS[0].hash),
  },
  {
    id: "b",
    letter: "B",
    name: "Twelve sections, second pass",
    owner: "Wilfred",
    note: "Starts as A, then Wilfred's 28 September edits: copy over the hero video, the leak line as the thesis, a bigger dictionary, pointer-active circles, icon nav that grows into the logos on scroll.",
    layout: parseLayoutHash(PRESETS[0].hash.replace(".hero-video.", ".hero-cinema.")),
    nav: { links: ["about", "solutions", "process", "contact"], brand: "icons" },
    copy: {
      heroLede: null,
      thesis: "Most teams leak performance through their environment, not their effort. Samuh finds where yours is leaking, and gives you the practices to close it.",
    },
  },
  {
    id: "c",
    letter: "C",
    name: "Eight sections",
    owner: "Claude",
    note: "The thesis said once, the model before the proof, one taxonomy, one ask. Hero and thesis merge, circles carry the meaning, testimonials and the case study share a section, the aspirational moment folds into the imagery.",
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
