"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * A YouTube embed that starts as the still. The iframe, and YouTube's
 * scripts, only load when the visitor presses play, which keeps the page's
 * LCP on our image. youtube-nocookie keeps it out of their ad profile until
 * then too.
 */
export function YouTube({ id, title, cover, eager = true }: { id: string; title: string; cover?: string; /** the still loads first; off for embeds down the body */ eager?: boolean }) {
  const [on, setOn] = useState(false);
  if (on) {
    return (
      <div className="ins-video">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <button type="button" className="ins-video ins-video-still" onClick={() => setOn(true)} aria-label={`Play video: ${title}`}>
      {cover ? <Image src={cover} alt="" fill sizes="(max-width: 900px) 100vw, 760px" priority={eager} /> : null}
      <span className="ins-play" aria-hidden>
        <svg viewBox="0 0 24 24" width="28" height="28"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
      </span>
    </button>
  );
}
