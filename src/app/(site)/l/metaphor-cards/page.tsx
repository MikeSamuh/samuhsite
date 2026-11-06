import type { Metadata } from "next";
import { SECTIONS } from "@/lib/layout";
import { getContent } from "@/lib/content/content";
import { getCards } from "@/lib/admin/cards";
import { landingPage } from "@/lib/landing";
import { Section } from "@/app/layout/sections";
import { pageMeta } from "@/lib/seo";

const PAGE = landingPage("metaphor-cards")!;

// A landing page: not linked from the site, not in the sitemap, and told
// to crawlers to stay out of the index. The deck itself is the home page's
// former section, unchanged, with the cards from the admin.
export const metadata: Metadata = {
  ...pageMeta({ title: PAGE.name, description: "Pick a card. How does it relate to your team?", path: PAGE.path }),
  robots: { index: false, follow: false },
};

const DEF = SECTIONS.find((s) => s.id === "cards")!;

export default async function MetaphorCardsLanding() {
  const { home, global } = await getContent();
  const cards = (await getCards()).map((c) => [c.name, "", c.image] as [string, string, string]);
  return <Section def={DEF} variant="cards-one" copy={{ cards }} content={{ home, global }} />;
}
