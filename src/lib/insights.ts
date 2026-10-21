// Insights content. Two sources, one list:
//
//   content/insights/*.mdx   one file per post, read from disk. The 21
//                            posts carried over from samuh.work live here
//   the admin's store        posts written or edited in the admin's Blog
//                            tab (src/lib/admin/posts.ts). A stored post
//                            with a file's slug replaces the file
//
// Only `status: published` posts (and video posts, which are live on
// samuh.work today) are routable. `review` and `draft` posts never render.
// See docs/insights-pipeline.md and docs/admin.md.

import fs from "node:fs";
import path from "node:path";
import { unstable_cache } from "next/cache";
import { INSIGHTS_TAG, listStoredPosts, toPost } from "./admin/posts";

export * from "./insights-shared";
import { type Post, type PostType, type Topic } from "./insights-shared";

const DIR = path.join(process.cwd(), "content", "insights");

function parseValue(raw: string): string | number | string[] {
  let v = raw.trim();
  if (v.startsWith('"')) {
    const end = v.indexOf('"', 1);
    return end > 0 ? v.slice(1, end) : v.slice(1);
  }
  const hash = v.indexOf(" #");
  if (hash >= 0) v = v.slice(0, hash).trim();
  if (v.startsWith("[") && v.endsWith("]")) {
    return v.slice(1, -1).split(",").map((s) => s.trim()).filter(Boolean);
  }
  if (/^\d+$/.test(v)) return Number(v);
  return v;
}

function parse(file: string): Post {
  const src = fs.readFileSync(path.join(DIR, file), "utf8");
  const m = src.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error(`no frontmatter in ${file}`);
  const fm: Record<string, string | number | string[]> = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([a-zA-Z]+):\s*(.*)$/);
    if (kv) fm[kv[1]] = parseValue(kv[2]);
  }
  const str = (k: string) => (typeof fm[k] === "string" ? (fm[k] as string) : undefined);
  const videoUrl = str("videoUrl");
  const videoId = videoUrl?.match(/[?&]v=([A-Za-z0-9_-]{11})/)?.[1];
  const type = (str("type") ?? "article") as PostType;
  // every video post is live on samuh.work today, so it ships
  const status = (str("status") ?? (type === "video" ? "published" : "draft")) as Post["status"];
  return {
    slug: str("slug") ?? file.replace(/\.mdx$/, ""),
    title: str("title") ?? "",
    type,
    status,
    date: str("date") ?? "",
    author: str("author") ?? "",
    summary: str("summary") ?? "",
    tags: (Array.isArray(fm.tags) ? fm.tags : []) as Topic[],
    cover: str("cover"),
    episode: typeof fm.episode === "number" ? fm.episode : undefined,
    videoUrl,
    videoId,
    duration: str("duration"),
    readTime: str("readTime"),
    externalUrl: str("externalUrl"),
    transcript: str("transcript"),
    body: m[2].trim(),
  };
}

let fileCache: Post[] | null = null;

/** The posts in content/insights, as files. Synchronous, for the admin. */
export function filePosts(): Post[] {
  if (fileCache) return fileCache;
  fileCache = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map(parse);
  return fileCache;
}

function sortPosts(posts: Post[]): Post[] {
  return posts.sort((a, b) => (b.date || "").localeCompare(a.date || "") || (b.episode ?? 0) - (a.episode ?? 0));
}

const readAll = unstable_cache(
  async (): Promise<Post[]> => {
    const stored = (await listStoredPosts()).map(toPost);
    const taken = new Set(stored.map((p) => p.slug));
    return sortPosts([...stored, ...filePosts().filter((p) => !taken.has(p.slug))]);
  },
  ["insights-posts"],
  { tags: [INSIGHTS_TAG] },
);

/** Every post, newest first, the admin's over the files. */
export async function allPosts(): Promise<Post[]> {
  return readAll();
}

/** The posts that ship: published, with a date. */
export async function publishedPosts(): Promise<Post[]> {
  return (await allPosts()).filter((p) => p.status === "published" && p.date);
}

export async function getPost(slug: string): Promise<Post | undefined> {
  return (await publishedPosts()).find((p) => p.slug === slug);
}

/** Up to three published posts sharing a topic, nearest in the feed first. */
export async function relatedPosts(post: Post, n = 3): Promise<Post[]> {
  const pool = (await publishedPosts()).filter((p) => p.slug !== post.slug && p.type !== "research");
  const shared = pool.filter((p) => p.tags.some((t) => post.tags.includes(t)));
  const rest = pool.filter((p) => !shared.includes(p));
  return [...shared, ...rest].slice(0, n);
}

/** The episode before and after, by number. */
export async function neighbours(post: Post): Promise<{ prev?: Post; next?: Post }> {
  if (!post.episode) return {};
  const eps = (await publishedPosts()).filter((p) => p.episode);
  return {
    prev: eps.find((p) => p.episode === post.episode! - 1),
    next: eps.find((p) => p.episode === post.episode! + 1),
  };
}

/** The transcript as plain text, if the post has one. The .txt beside the .srt. */
export function transcriptText(post: Post): string | undefined {
  if (!post.transcript) return undefined;
  const file = path.join(DIR, post.transcript.replace(/\.srt$/, ".txt"));
  if (!fs.existsSync(file)) return undefined;
  // Whisper wraps lines mid-sentence. Rejoin, then break into paragraphs at
  // sentence ends every few hundred characters so it reads on a page
  const text = fs.readFileSync(file, "utf8").replace(/\s*\n\s*/g, " ").trim();
  const sentences = text.match(/[^.!?]+[.!?]+["’”]?\s*|[^.!?]+$/g) ?? [text];
  const paras: string[] = [];
  let cur = "";
  for (const s of sentences) {
    cur += s;
    if (cur.length > 520) { paras.push(cur.trim()); cur = ""; }
  }
  if (cur.trim()) paras.push(cur.trim());
  return paras.join("\n\n");
}
