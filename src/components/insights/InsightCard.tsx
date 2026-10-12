import Image from "next/image";
import Link from "next/link";
import { formatDate, timeLabel, type Post } from "@/lib/insights-shared";

/** The card's data, the part of a post the index needs. Serialisable, so
 *  the client-side filter can hold the list. */
export type CardData = Pick<Post, "slug" | "title" | "type" | "date" | "summary" | "tags" | "cover" | "episode" | "duration" | "readTime">;

export function toCard(p: Post): CardData {
  const { slug, title, type, date, summary, tags, cover, episode, duration, readTime } = p;
  return { slug, title, type, date, summary, tags, cover, episode, duration, readTime };
}

export function InsightCard({ post, priority }: { post: CardData; priority?: boolean }) {
  const kind = post.type === "video" ? "Video" : post.type === "research" ? "Research" : "Article";
  return (
    <article className="card ins-card">
      <Link href={`/insights/${post.slug}`} className="ins-card-link">
        <div className="ins-card-art" data-type={post.type}>
          {post.cover ? (
            <Image src={post.cover} alt="" width={1280} height={720} sizes="(max-width: 900px) 100vw, 33vw" priority={priority} />
          ) : (
            <span className="ins-card-word" aria-hidden>{kind}</span>
          )}
          {post.type === "video" ? <span className="ins-card-play" aria-hidden /> : null}
        </div>
        <span className="card-tag">
          {kind}{post.episode ? ` · Episode ${post.episode}` : ""}{post.tags[0] ? ` · ${post.tags[0]}` : ""}
        </span>
        <h3 className="ins-card-title">{post.title}</h3>
        <p className="ins-card-stand">{post.summary}</p>
        <span className="L-cap ins-card-meta">{formatDate(post.date)}{timeLabel(post as Post) ? ` · ${timeLabel(post as Post)}` : ""}</span>
      </Link>
    </article>
  );
}
