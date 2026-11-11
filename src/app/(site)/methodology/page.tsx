import { getContent } from "@/lib/content/content";
import { SitePage } from "@/components/site/Site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Methodology",
  description:
    "The research behind SAMUH, in partnership with Sapien Labs, and the 90-day sprint in four stages: Discover, Align, Co-create, Ritualize.",
  path: "/methodology",
});

export default async function MethodologyPage() {
  const { process, global } = await getContent();
  return <SitePage id="process" content={{ process, global }} />;
}
