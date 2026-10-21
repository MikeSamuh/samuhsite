import type { MetadataRoute } from "next";

// The API never indexes and the admin pages carry noindex themselves; the
// admin path is not named here, since robots.txt is public. The sitemap is
// an M5 item (docs/milestones.md).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
  };
}
