import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// The API never indexes and the admin pages carry noindex themselves; the
// admin path is not named here, since robots.txt is public. The sitemap is
// listed so a crawler finds every page without following links.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
