import { getContent } from "@/lib/content/content";
import { SitePage } from "@/components/site/Site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "About",
  description:
    "A group of people who come together for a purpose larger than themselves. That is what Samuh means in Sanskrit, and it is the standard the work is held to. The team, what we believe, and the Sapien Labs research behind the work.",
  path: "/about",
});

export default async function AboutPage() {
  const { about, global } = await getContent();
  return <SitePage id="about" content={{ about, global }} />;
}
