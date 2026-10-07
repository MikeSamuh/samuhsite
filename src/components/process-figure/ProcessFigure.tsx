"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { POSES, type PoseId } from "./figures";
import type { MorphPart } from "./morphs";

/**
 * The process-stage figures. At rest a figure is the traced pose for its
 * stage. A morph runs heads first, bodies after. Timing reads --dur and
 * --ease, so it moves at the direction's speed. Reduced motion shows the rest
 * pose only. Morph data is generated (scripts/figures) and loaded lazily.
 *
 * ProcessFigure sits in its own section and morphs out of the previous pose
 * as it scrolls in. StageFigure is one figure that stays put and morphs
 * whenever its pose changes, for the slot under the section head.
 */

const LEAD = 0.2; // share of the morph the heads run ahead of the bodies
const STRETCH = 2.5; // morph length in --dur units, same as the stage art hover

/** The live morph: paths for one stage-to-stage pair, drawn over --dur × STRETCH.
 *  Morph data is loaded once per figure; a pair with no data in that direction
 *  runs the other direction's data backwards. */
function makePlayer(svg: SVGSVGElement, rest: SVGGElement, live: SVGGElement) {
  const style = getComputedStyle(svg);
  const duration = readMs(style.getPropertyValue("--dur")) * STRETCH;
  const ease = readEase(style.getPropertyValue("--ease"));
  let morphs: Record<string, MorphPart[]> | null = null;
  let parts: MorphPart[] = [];
  let paths: SVGPathElement[] = [];
  let raf = 0;

  const draw = (p: number) => {
    parts.forEach((part, k) => {
      const q = part.head ? Math.min(1, p / (1 - LEAD)) : Math.max(0, (p - LEAD) / (1 - LEAD));
      paths[k].setAttribute("d", ring(part, ease(q)));
    });
  };
  const showLive = (on: boolean) => {
    live.style.display = on ? "" : "none";
    rest.style.display = on ? "none" : "";
    svg.classList.toggle("is-moving", on);
  };
  const load = () => import("./morphs").then(({ MORPHS }) => { morphs = MORPHS; });
  /** picks the parts for from → to; false when there is no data either way */
  const pair = (from: PoseId, to: PoseId) => {
    if (!morphs) return false;
    let m = morphs[`${from}>${to}`];
    if (!m) {
      const back = morphs[`${to}>${from}`];
      if (back) m = back.map((x) => ({ head: x.head, from: x.to, to: x.from }));
    }
    if (!m) return false;
    parts = m;
    const ns = "http://www.w3.org/2000/svg";
    paths = parts.map(() => document.createElementNS(ns, "path"));
    live.replaceChildren(...paths);
    return true;
  };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; showLive(false); };
  const arm = () => { cancelAnimationFrame(raf); draw(0); showLive(true); };
  const play = () => {
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      draw(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else showLive(false);
    };
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(tick);
  };
  return { ok: duration > 0, load, pair, arm, play, stop };
}

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Figure({ pose, svgRef, restRef, liveRef }: { pose: PoseId; svgRef: React.RefObject<SVGSVGElement | null>; restRef: React.RefObject<SVGGElement | null>; liveRef: React.RefObject<SVGGElement | null> }) {
  return (
    <svg ref={svgRef} className="process-figure" viewBox="0 0 512 512" aria-hidden="true" focusable="false">
      <g ref={restRef}>
        {POSES[pose].map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <g ref={liveRef} style={{ display: "none" }} />
    </svg>
  );
}

/** A figure that morphs out of `from` each time it scrolls into view. */
export function ProcessFigure({ pose, from }: { pose: PoseId; from?: PoseId }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const restRef = useRef<SVGGElement>(null);
  const liveRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const svg = svgRef.current, rest = restRef.current, live = liveRef.current;
    if (!svg || !rest || !live || !from || reduced()) return;
    const pl = makePlayer(svg, rest, live);
    if (!pl.ok) return;
    let alive = true;
    let armed = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio >= 0.5) { if (armed) { armed = false; pl.play(); } }
        else if (!e.isIntersecting) { pl.arm(); armed = true; }
      },
      { threshold: [0, 0.5] },
    );
    pl.load().then(() => { if (alive && pl.pair(from, pose)) io.observe(svg); });
    return () => { alive = false; io.disconnect(); pl.stop(); };
  }, [pose, from]);

  return <Figure pose={pose} svgRef={svgRef} restRef={restRef} liveRef={liveRef} />;
}

/** One figure that stays put and morphs whenever `pose` changes, in either
 *  direction. Before the morph data is in, or with reduced motion, it snaps. */
export function StageFigure({ pose }: { pose: PoseId }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const restRef = useRef<SVGGElement>(null);
  const liveRef = useRef<SVGGElement>(null);
  const player = useRef<ReturnType<typeof makePlayer> | null>(null);
  const prev = useRef(pose);

  useEffect(() => {
    const svg = svgRef.current, rest = restRef.current, live = liveRef.current;
    if (!svg || !rest || !live || reduced()) return;
    const pl = makePlayer(svg, rest, live);
    if (!pl.ok) return;
    player.current = pl;
    pl.load();
    return () => { pl.stop(); player.current = null; };
  }, []);

  // before paint, so the rest pose never shows for a frame between the two
  useLayoutEffect(() => {
    const from = prev.current;
    prev.current = pose;
    const pl = player.current;
    if (from === pose || !pl || !pl.pair(from, pose)) return;
    pl.arm();
    pl.play();
  }, [pose]);

  return <Figure pose={pose} svgRef={svgRef} restRef={restRef} liveRef={liveRef} />;
}

function ring(part: MorphPart, t: number) {
  const a = part.from, b = part.to;
  let d = "";
  for (let i = 0; i < a.length; i += 2) {
    const x = a[i] + (b[i] - a[i]) * t, y = a[i + 1] + (b[i + 1] - a[i + 1]) * t;
    d += `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
  }
  return d + "Z";
}

/** "420ms" or "0.42s" to milliseconds. 0 when the token is missing, which skips the morph. */
function readMs(v: string) {
  const n = parseFloat(v);
  if (Number.isNaN(n)) return 0;
  return v.trim().endsWith("ms") ? n : n * 1000;
}

/** The --ease token as a function. Handles cubic-bezier(); anything else is linear. */
function readEase(v: string): (t: number) => number {
  const m = v.match(/cubic-bezier\(([^)]+)\)/);
  if (!m) return (t) => t;
  const [x1, y1, x2, y2] = m[1].split(",").map(Number);
  const bx = (t: number) => 3 * (1 - t) ** 2 * t * x1 + 3 * (1 - t) * t ** 2 * x2 + t ** 3;
  const by = (t: number) => 3 * (1 - t) ** 2 * t * y1 + 3 * (1 - t) * t ** 2 * y2 + t ** 3;
  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let lo = 0, hi = 1, t = x;
    for (let i = 0; i < 24; i++) {
      t = (lo + hi) / 2;
      if (bx(t) < x) lo = t;
      else hi = t;
    }
    return by(t);
  };
}
