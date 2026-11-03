import { getContent } from "@/lib/content/content";
import { SitePage } from "@/components/site/Site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Let’s talk",
  description: "Take the free LeadQ assessment, or book a time with Jake at SAMUH. Or reach us directly by email or phone.",
  path: "/contact",
});

export default async function ContactPage() {
  const { contact, global, start } = await getContent();
  return <SitePage id="contact" content={{ contact, global, start }} />;
}
