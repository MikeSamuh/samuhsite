"use client";

import type { BackdropId } from "@/lib/tokens";

/**
 * The five background treatments. Pure CSS and inline SVG, no image assets.
 * Each reads --accent so the stage and the accent always agree.
 */
export default function Backdrop({ id }: { id: BackdropId }) {
  if (id === "void") return null;

  if (id === "ascent") {
    return (
      <div className="bd bd-ascent" aria-hidden>
        <div className="bd-ascent-wash" />
      </div>
    );
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
      <div className="bd-rings" />
      <div className="bd-arc" />
      <div className="bd-vignette" />
    </div>
  );
}
