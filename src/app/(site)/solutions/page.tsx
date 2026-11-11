import { getContent } from "@/lib/content/content";
import { SitePage } from "@/components/site/Site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Solutions: assessments, sprints and workshops",
  description:
    "Who SAMUH works with, and how: LeadQ, TeamQ and OrgQ for a leader, a team and an organization, the 90-day sprint on the platform, Executive Team Sprints, keynotes and workshops.",
  path: "/solutions",
});

export default async function SolutionsPage() {
  const { solutions, global, start } = await getContent();
  return <SitePage id="solutions" content={{ solutions, global, start }} />;
}
