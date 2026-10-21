// Search and sharing. One helper every page's metadata goes through, so the
// canonical URL, the Open Graph card and the Twitter card never drift from
// each other, and the structured data the site publishes.

import type { Metadata } from "next";
import type { GlobalContent } from "@/lib/content/defaults";
import type { Post } from "@/lib/insights-shared";

export const SITE_URL = "https://samuh.work";
export const SITE_NAME = "SAMUH";
export const TAGLINE = "High performance without the cost to people.";
/** the default sharing card, drawn by src/app/og.png/route.tsx */
export const DEFAULT_OG = "/og.png";
export const LINKEDIN_URL = "https://www.linkedin.com/company/samuh/";

interface PageMetaInput {
  title: string;
  /** the title as given, outside the "· SAMUH" template */
  absolute?: boolean;
  description: string;
  /** the path, from the root, that the page is canonical at */
  path: string;
  /** a sharing image other than the default. Site-relative or absolute */
  image?: string;
  /** an article's dates and author, for og:article */
  article?: { publishedTime: string; authors: string[] };
}

export function pageMeta({ title, absolute, description, path, image, article }: PageMetaInput): Metadata {
  const img = image ?? DEFAULT_OG;
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "en_US",
      images: [{ url: img, width: 1200, height: 630, alt: `${SITE_NAME}. ${TAGLINE}` }],
      ...(article ? { type: "article", ...article } : { type: "website" }),
    },
    twitter: { card: "summary_large_image", title, description, images: [img] },
  };
}

/* ------------------------------------------------------------------ */
/* Structured data                                                     */
/* ------------------------------------------------------------------ */

const abs = (p: string) => (p.startsWith("http") ? p : `${SITE_URL}${p}`);

/** The admin's *markers* and ~markers~ off a line, for data fields. */
const plain = (s: string) => s.replace(/[*~]/g, "");

export function organizationLd(g: GlobalContent) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: abs("/samuh-logo.png"),
    description: g.footer.about,
    slogan: TAGLINE,
    ...(g.contact.email ? { email: g.contact.email } : {}),
    sameAs: [LINKEDIN_URL, g.footer.youtubeUrl].filter(Boolean),
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function faqLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: plain(q),
      acceptedAnswer: { "@type": "Answer", text: plain(a) },
    })),
  };
}

export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: abs(t.path),
    })),
  };
}

/** "3:15" to PT3M15S; "1:02:10" to PT1H2M10S. */
function isoDuration(d?: string): string | undefined {
  if (!d) return undefined;
  const parts = d.split(":").map(Number);
  if (parts.some((n) => Number.isNaN(n))) return undefined;
  const [h, m, s] = parts.length === 3 ? parts : [0, parts[0] ?? 0, parts[1] ?? 0];
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}${s ? `${s}S` : ""}` || undefined;
}

/** An Insights post as an Article, or a VideoObject when it is an episode. */
export function postLd(post: Post) {
  const url = `${SITE_URL}/insights/${post.slug}`;
  const base = {
    "@context": "https://schema.org",
    name: post.title,
    description: post.summary,
    url,
    mainEntityOfPage: url,
    datePublished: post.date,
    author: { "@type": "Person", name: post.author },
    publisher: { "@id": `${SITE_URL}/#organization` },
    keywords: post.tags.join(", "),
  };
  if (post.type === "video" && post.videoId) {
    return {
      ...base,
      "@type": "VideoObject",
      thumbnailUrl: post.cover ? abs(post.cover) : undefined,
      uploadDate: post.date,
      duration: isoDuration(post.duration),
      embedUrl: `https://www.youtube-nocookie.com/embed/${post.videoId}`,
      contentUrl: post.videoUrl,
    };
  }
  return {
    ...base,
    "@type": "Article",
    headline: post.title,
    image: post.cover ? abs(post.cover) : abs(DEFAULT_OG),
  };
}
