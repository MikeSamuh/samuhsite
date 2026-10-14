// The part of Insights the browser needs: types, the topic hubs, and the
// small formatters. No file system here; see insights.ts for the loader.

export type PostType = "video" | "article" | "research";
export type Topic = "capacity" | "team practices" | "rituals" | "measurement";

export interface Post {
  slug: string;
  title: string;
  type: PostType;
  status: "published" | "review" | "draft";
  date: string;
  author: string;
  summary: string;
  tags: Topic[];
  cover?: string;
  episode?: number;
  videoUrl?: string;
  videoId?: string;
  duration?: string;
  readTime?: string;
  externalUrl?: string;
  transcript?: string;
  /** the markdown body, without the frontmatter */
  body: string;
}

export const TOPICS: Topic[] = ["capacity", "team practices", "rituals", "measurement"];

export function formatDate(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

/** "Video · 3:15" or "Article · 3 min read" for cards and heads. */
export function timeLabel(p: Post): string {
  if (p.type === "video" && p.duration) return `${p.duration} watch`;
  if (p.readTime) return `${p.readTime} read`;
  return "";
}
