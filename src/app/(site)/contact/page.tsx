import { getContent } from "@/lib/content/content";
import { SitePage } from "@/components/site/Site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Contact",
  description: "Let’s talk, human to human. A short form, or reach SAMUH directly by email or phone.",
  path: "/contact",
});

export default async function ContactPage() {
  const { contact, global } = await getContent();
  return <SitePage id="contact" content={{ contact, global }} />;
}
