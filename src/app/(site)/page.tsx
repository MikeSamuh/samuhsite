import { BASELINE, OPTIMIZER_MOVES } from "@/components/teamq-teaser/model";
import { bestForProductiveDays, score } from "@/lib/teaser/score";
import { getContent } from "@/lib/content/content";
import { getCards } from "@/lib/admin/cards";
import { SiteHome } from "@/components/site/Site";
import { JsonLd } from "@/components/site/JsonLd";
import { faqLd, pageMeta, SITE_NAME, TAGLINE } from "@/lib/seo";

export const metadata = pageMeta({
  title: `${SITE_NAME} · ${TAGLINE}`,
  absolute: true,
  description:
    "Great team environments sustain high performance. In partnership with Sapien Labs, SAMUH uses scientifically validated measures to reveal your team’s hidden performance tax and helps build practices that reduce it.",
  path: "/",
});

export default async function Home() {
  // the TeamQ section is the whole /teamq experience, the tool live on the
  // page (2 Nov 2026). Scored here, on the server, the same way /teamq does
  // it, so the home page carries no typed-in numbers
  const baseline = score(BASELINE);
  const { values, levers, score: best } = bestForProductiveDays(OPTIMIZER_MOVES);
  const answer = { values, levers, days: best.days, mhq: best.mhq };
  const { home, global, start } = await getContent();
  const cards = (await getCards()).map((c) => [c.name, "", c.image] as [string, string, string]);
  return (
    <>
      <JsonLd data={faqLd(home.faq.items)} />
      <SiteHome teamq={{ baseline, answer, tool: home.tool, box: start.form }} content={{ home, global }} cards={cards} />
    </>
  );
}
