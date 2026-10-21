import { getContent } from "@/lib/content/content";
import { SitePage } from "@/components/site/Site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Solutions: Self-guided, Supported, Guided",
  description:
    "One methodology, the team process, delivered with as much or as little of SAMUH in the room as the team needs. Three ways to engage, side by side.",
  path: "/solutions",
});

export default async function SolutionsPage() {
  const { solutions, global } = await getContent();
  return <SitePage id="solutions" content={{ solutions, global }} />;
}
