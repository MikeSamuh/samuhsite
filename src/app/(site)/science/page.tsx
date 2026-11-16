import { getContent } from "@/lib/content/content";
import { SitePage } from "@/components/site/Site";
import { JsonLd } from "@/components/site/JsonLd";
import { faqLd, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "The Science",
  description:
    "The science behind SAMUH, in partnership with Sapien Labs: TeamQ, built on the MHQ, and the research on team environment and human capacity.",
  path: "/science",
});

export default async function SciencePage() {
  const { process, global } = await getContent();
  return (
    <>
      <JsonLd data={faqLd(process.faq.items)} />
      <SitePage id="process" content={{ process, global }} />
    </>
  );
}
