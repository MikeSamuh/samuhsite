"use client";

import { useState } from "react";
import { TOPICS, type PostType, type Topic } from "@/lib/insights-shared";
import { InsightCard, type CardData } from "./InsightCard";

const KINDS: { id: PostType | "all"; name: string }[] = [
  { id: "all", name: "Everything" },
  { id: "video", name: "Video" },
  { id: "article", name: "Articles" },
];

/** The feed with its two filters: kind, and topic hub. Both are buttons,
 *  not links, so the page stays one URL and the back button stays sane. */
export function InsightsFeed({ posts }: { posts: CardData[] }) {
  const [kind, setKind] = useState<PostType | "all">("all");
  const [topic, setTopic] = useState<Topic | null>(null);
  const shown = posts.filter((p) => (kind === "all" || p.type === kind) && (!topic || p.tags.includes(topic)));
  return (
    <>
      <div className="ins-filters" role="group" aria-label="Filter the feed">
        <div className="ins-filter-row">
          {KINDS.map((k) => (
            <button key={k.id} type="button" className="ins-chip" aria-pressed={kind === k.id} onClick={() => setKind(k.id)}>{k.name}</button>
          ))}
        </div>
        <div className="ins-filter-row">
          <span className="L-cap ins-filter-h">Topic</span>
          {TOPICS.map((t) => (
            <button key={t} type="button" className="ins-chip ins-chip-topic" aria-pressed={topic === t} onClick={() => setTopic(topic === t ? null : t)}>{t}</button>
          ))}
        </div>
      </div>
      <p className="L-cap ins-count" aria-live="polite">{shown.length} of {posts.length}</p>
      <div className="ins-feed">
        {shown.map((p, i) => <InsightCard key={p.slug} post={p} priority={i < 3} />)}
      </div>
      {shown.length === 0 ? <p className="L-mid">Nothing here yet for that mix. Try another topic.</p> : null}
    </>
  );
}
