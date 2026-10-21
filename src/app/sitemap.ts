import type { MetadataRoute } from "next";
import { publishedPosts } from "@/lib/insights";
import { SITE_URL } from "@/lib/seo";

// The pages a crawler should know about: the seven routes, then every
// published Insights post. The research entry is a link out to Sapien
// Labs, not a page here, so it stays off the list.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = (await publishedPosts()).filter((p) => p.type !== "research");
  const latest = posts.map((p) => p.date).sort().at(-1);
  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/process`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/solutions`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/teamq`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/insights`, changeFrequency: "weekly", priority: 0.8, lastModified: latest },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/talk`, changeFrequency: "yearly", priority: 0.5 },
  ];
  return [
    ...pages,
    ...posts.map((p) => ({
      url: `${SITE_URL}/insights/${p.slug}`,
      lastModified: p.date,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
