import { getContent } from "@/lib/content/content";
import { SitePage } from "@/components/site/Site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "The team process",
  description:
    "See the team clearly. Choose the practice together. Ritualize it in the flow of work. The methodology behind every way of working with SAMUH.",
  path: "/process",
});

export default async function ProcessPage() {
  const { process, global } = await getContent();
  return <SitePage id="process" content={{ process, global }} />;
}
