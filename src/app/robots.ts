import type { MetadataRoute } from "next";

// The admin and its API never index. The rest is open; the sitemap is an
// M5 item (docs/milestones.md).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }],
  };
}
