"use client";

import type { BackdropId } from "@/lib/tokens";

/**
 * The five background treatments. Pure CSS and inline SVG, no image assets.
 * Each reads --accent and --accent-2 so the stage and the accents always agree.
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
        <span className="blob blob-a" />
        <span className="blob blob-b" />
        <span className="blob blob-c" />
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
      </div>
    );
  }

  // orbit
  return (
    <div className="bd bd-orbit" aria-hidden>
      <div className="bd-glow" />
      <div className="bd-rings" />
      <div className="bd-arc" />
      <div className="bd-arc bd-arc-2" />
    </div>
  );
}
