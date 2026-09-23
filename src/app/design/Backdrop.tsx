"use client";

import type { BackdropId } from "@/lib/tokens";
import Synapse from "./Synapse";

/**
 * The five background treatments. Pure CSS and inline SVG, no image assets.
 * Each reads --accent and --accent-2 so the stage and the accents always agree.
 * Chalk and Aurora read --scroll-p, the page's scroll progress from 0 to 1.
 */
export default function Backdrop({ id }: { id: BackdropId }) {
  if (id === "void") return null;

  if (id === "slate") {
    // Absolute rather than fixed, so the gradient spans the whole document
    // and the page darkens as you scroll rather than on screen.
    return <div className="bd bd-slate" aria-hidden />;
  }

  if (id === "aurora") {
    return (
      <div className="bd bd-aurora" aria-hidden>
        {/* each blob sits in a wrapper that parallaxes with scroll, so the
            lava-lamp keyframes and the scroll offset never fight */}
        <span className="blob-wrap blob-wrap-a"><span className="blob blob-a" /></span>
        <span className="blob-wrap blob-wrap-b"><span className="blob blob-b" /></span>
        <span className="blob-wrap blob-wrap-c"><span className="blob blob-c" /></span>
        <div className="bd-grain" />
      </div>
    );
  }

  if (id === "chalk") {
    return (
      <div className="bd bd-chalk" aria-hidden>
        <div className="bd-chalk-grain" />
        <div className="bd-chalk-dust" />
        <div className="bd-vignette" />
        <div className="bd-chalk-mark" />
      </div>
    );
  }

  // synapse
  return <Synapse />;
}
