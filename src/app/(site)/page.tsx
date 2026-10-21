import { BASELINE, DEMO_CAP, OPTIMIZER_MOVES } from "@/components/teamq-teaser/model";
import { bestForProductiveDays, score } from "@/lib/teaser/score";
import { getContent } from "@/lib/content/content";
import { SiteHome } from "@/components/site/Site";
import { JsonLd } from "@/components/site/JsonLd";
import { faqLd, pageMeta, SITE_NAME, TAGLINE } from "@/lib/seo";

export const metadata = pageMeta({
  title: `${SITE_NAME} · ${TAGLINE}`,
  absolute: true,
  description:
    "Organizational and high-performance consulting, in partnership with Sapien Labs. Most teams leak performance through their environment, not their effort. SAMUH finds where yours is leaking, and gives you the practices to close it.",
  path: "/",
});

export default async function Home() {
  // the tool section shows the tool moving. Scored here, on the server, the
  // same way /teamq does it, so the home page carries no typed-in numbers.
  // The moves stop at DEMO_CAP, never the ceiling
  const demo = { baseline: score(BASELINE), answer: bestForProductiveDays(OPTIMIZER_MOVES, DEMO_CAP) };
  const { home, global } = await getContent();
  return (
    <>
      <JsonLd data={faqLd(home.faq.items)} />
      <SiteHome demo={demo} content={{ home, global }} />
    </>
  );
}
