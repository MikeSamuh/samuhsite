// Landing pages: standalone pages that are not in the nav, the footer or
// the sitemap, for campaigns and experiments. The admin's Landing pages
// tab lists them from here, so a new one is an entry in LANDING, a route
// under src/app/(site)/l/<id>, and an editor under the admin's landing/<id>
// if it has one. The first (Wilfred, 6 Nov 2026) is the metaphor card
// deck, which came off the home page the same day.

import { ADMIN_BASE } from "@/lib/admin/paths";

export interface LandingPage {
  id: string;
  name: string;
  /** one line for the admin's list */
  note: string;
  /** where it lives on the site */
  path: string;
  /** the admin page that edits it, if there is one */
  admin?: string;
  /** when it was added, for the list */
  added: string;
}

/** every landing page lives under /l/ so they are easy to tell apart */
export const LANDING_BASE = "/l";

export const LANDING: LandingPage[] = [
  {
    id: "metaphor-cards",
    name: "Metaphor cards",
    note: "The card deck: shuffle, pick a card, say how it relates to your team. Was on the home page until 6 Nov 2026.",
    path: `${LANDING_BASE}/metaphor-cards`,
    admin: `${ADMIN_BASE}/landing/metaphor-cards`,
    added: "2026-11-06",
  },
];

export function landingPage(id: string): LandingPage | undefined {
  return LANDING.find((l) => l.id === id);
}
