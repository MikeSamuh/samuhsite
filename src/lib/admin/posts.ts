// Blog posts written in the admin. Server only.
//
// A post written in the admin is a document in the store under
// post:<slug>, with its body as HTML from the editor. The Insights loader
// (src/lib/insights.ts) merges these with the MDX files in content/insights:
// a stored post with the same slug as a file wins, which is how a file post
// becomes editable: open it in the admin, save, and the store copy takes
// over from then on.

import { revalidatePath, revalidateTag } from "next/cache";
import { store } from "./store";
import { TOPICS, type Post, type PostType, type Topic } from "@/lib/insights-shared";

export const INSIGHTS_TAG = "insights";

export interface StoredPost {
  slug: string;
  title: string;
  type: Exclude<PostType, "research">;
  status: Post["status"];
  /** YYYY-MM-DD */
  date: string;
  author: string;
  summary: string;
  tags: Topic[];
  cover?: string;
  episode?: number;
  videoUrl?: string;
  duration?: string;
  readTime?: string;
  /** the transcript file beside the MDX post this came from, kept so the page still folds it under the video */
  transcript?: string;
  /** the body, HTML from the editor */
  html: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
}

const KEY = (slug: string) => `post:${slug}`;

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’'"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function listStoredPosts(): Promise<StoredPost[]> {
  const keys = await store().list("post:");
  const posts = await Promise.all(keys.map((k) => store().get<StoredPost>(k)));
  return posts.filter((p): p is StoredPost => !!p);
}

export async function getStoredPost(slug: string): Promise<StoredPost | null> {
  return store().get<StoredPost>(KEY(slug));
}

/** The browser-authored HTML, kept to what the editor produces. Authors
 *  are the team, so this is a guard against accidents, not an attacker:
 *  no scripts, no inline handlers, no javascript: links, and only YouTube
 *  in an iframe. */
export function cleanHtml(html: string): string {
  let out = html;
  out = out.replace(/<script[\s\S]*?<\/script>/gi, "");
  out = out.replace(/<style[\s\S]*?<\/style>/gi, "");
  out = out.replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  out = out.replace(/(href|src)\s*=\s*("|')\s*javascript:[^"']*\2/gi, '$1=$2#$2');
  out = out.replace(/<iframe\b([^>]*)>/gi, (m, attrs: string) => {
    const src = attrs.match(/src\s*=\s*"([^"]*)"/i)?.[1] ?? "";
    return /^https:\/\/(www\.)?(youtube-nocookie\.com|youtube\.com)\/embed\//.test(src) ? m : "";
  });
  return out.trim();
}

function videoId(url?: string): string | undefined {
  if (!url) return undefined;
  return url.match(/[?&]v=([A-Za-z0-9_-]{11})/)?.[1] ?? url.match(/youtu\.be\/([A-Za-z0-9_-]{11})/)?.[1] ?? url.match(/embed\/([A-Za-z0-9_-]{11})/)?.[1];
}

export type PostInput = Omit<StoredPost, "createdAt" | "updatedAt" | "updatedBy">;

function clean(input: unknown): PostInput {
  const i = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const str = (k: string) => (typeof i[k] === "string" ? (i[k] as string).trim() : "");
  const opt = (k: string) => str(k) || undefined;
  const slug = slugify(str("slug") || str("title"));
  if (!slug) throw new Error("A post needs a title.");
  const type = str("type") === "video" ? "video" : "article";
  const status = (["published", "review", "draft"] as const).find((s) => s === str("status")) ?? "draft";
  const date = /^\d{4}-\d{2}-\d{2}$/.test(str("date")) ? str("date") : "";
  const tags = (Array.isArray(i.tags) ? i.tags : []).filter((t): t is Topic => TOPICS.includes(t as Topic));
  const episode = typeof i.episode === "number" && i.episode > 0 ? Math.floor(i.episode) : undefined;
  return {
    slug,
    title: str("title") || slug,
    type,
    status,
    date,
    author: str("author"),
    summary: str("summary"),
    tags,
    cover: opt("cover"),
    episode,
    videoUrl: opt("videoUrl"),
    duration: opt("duration"),
    readTime: opt("readTime"),
    transcript: opt("transcript"),
    html: cleanHtml(str("html")),
  };
}

function revalidateInsights(slug?: string) {
  revalidateTag(INSIGHTS_TAG);
  revalidatePath("/insights");
  revalidatePath("/insights/[slug]", "page");
  if (slug) revalidatePath(`/insights/${slug}`);
}

export async function savePost(input: unknown, by: string, previousSlug?: string): Promise<StoredPost> {
  const data = clean(input);
  const existing = previousSlug ? await getStoredPost(previousSlug) : await getStoredPost(data.slug);
  const now = new Date().toISOString();
  const post: StoredPost = { ...data, createdAt: existing?.createdAt ?? now, updatedAt: now, updatedBy: by };
  await store().set(KEY(post.slug), post);
  if (previousSlug && previousSlug !== post.slug) await store().del(KEY(previousSlug));
  revalidateInsights(post.slug);
  if (previousSlug && previousSlug !== post.slug) revalidateInsights(previousSlug);
  return post;
}

export async function deletePost(slug: string): Promise<void> {
  await store().del(KEY(slug));
  revalidateInsights(slug);
}

/** A stored post in the shape the Insights pages render. */
export function toPost(p: StoredPost): Post {
  return {
    slug: p.slug,
    title: p.title,
    type: p.type,
    status: p.status,
    date: p.date,
    author: p.author,
    summary: p.summary,
    tags: p.tags,
    cover: p.cover,
    episode: p.episode,
    videoUrl: p.videoUrl,
    videoId: videoId(p.videoUrl),
    duration: p.duration,
    readTime: p.readTime,
    transcript: p.transcript,
    body: "",
    html: p.html,
  };
}
