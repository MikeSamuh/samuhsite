"use client";

import { useEffect, useRef } from "react";
import type { PointerId } from "@/lib/tokens";

/**
 * A faint network that is never still. Every node drifts on its own slow
 * orbit, and the whole field parallaxes with scroll at a per-node depth, so
 * nearer nodes travel further than distant ones. Depth also sets focus: far
 * nodes are smaller, dimmer and blurred, near nodes are crisp. Links are
 * quadratic curves recomputed each frame so they stay attached. Signals and
 * pulses are CSS.
 *
 * The pointer has two modes. Well: a gravity well, nodes inside its reach
 * are drawn toward it with a slight swirl and ease back when it leaves.
 * Gather: nodes inside its reach close ranks on their own centre, only
 * while the pointer moves; speed sets how tight, stillness lets them go.
 * Links follow because they are rebuilt from node positions.
 *
 * Reduced motion: one static frame, no loop, no pointer.
 */
export default function Synapse({ mode = "well" }: { mode?: PointerId }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const modeRef = useRef<PointerId>(mode);
  modeRef.current = mode;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const nodeEls = Array.from(svg.querySelectorAll<SVGCircleElement>(".net-node"));
    const lineEls = Array.from(svg.querySelectorAll<SVGPathElement>(".net-line"));
    const signalEls = Array.from(svg.querySelectorAll<SVGPathElement>(".net-signal"));

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const t0 = performance.now();

    // pointer in viewBox units, or null when it is off the page
    let well: { x: number; y: number } | null = null;
    // smoothed pointer speed, viewBox units per second, for gather
    let energy = 0;
    let lastMove = 0;
    // per-node displacement, eased toward its target every frame
    const pull = NODES.map(() => ({ x: 0, y: 0 }));

    const toView = (clientX: number, clientY: number) => {
      const r = svg.getBoundingClientRect();
      // preserveAspectRatio slice: the 100x100 box is scaled to cover and
      // centred, so undo that
      const k = Math.max(r.width / 100, r.height / 100);
      return {
        x: (clientX - r.left - (r.width - 100 * k) / 2) / k,
        y: (clientY - r.top - (r.height - 100 * k) / 2) / k,
      };
    };
    const onMove = (e: PointerEvent) => {
      const next = toView(e.clientX, e.clientY);
      const now = performance.now();
      if (well && lastMove) {
        const dt = Math.max(8, now - lastMove) / 1000;
        const v = Math.hypot(next.x - well.x, next.y - well.y) / dt;
        energy = energy * 0.6 + v * 0.4;
      }
      lastMove = now;
      well = next;
    };
    const onLeave = () => { well = null; };
    if (!still) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
      document.addEventListener("mouseleave", onLeave);
    }

    const frame = (now: number) => {
      const t = (now - t0) / 1000;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;

      // gather strength decays when the pointer rests
      energy *= GATHER_DECAY;
      const gather = Math.min(1, energy / GATHER_SPEED);
      const m = modeRef.current;

      const base = NODES.map((n) => {
        const drift = still ? 0 : 1;
        const x = n.x + drift * n.ax * Math.sin(t * n.fx + n.px);
        const y =
          n.y +
          drift * n.ay * Math.cos(t * n.fy + n.py) -
          p * SCROLL_TRAVEL * n.depth;
        return [x, y] as const;
      });

      // gather: the centre of every node within reach of the pointer
      let gx = 0;
      let gy = 0;
      let gn = 0;
      if (well && m === "gather" && gather > 0.01) {
        base.forEach(([x, y]) => {
          if (Math.hypot(well!.x - x, well!.y - y) < GATHER_REACH) { gx += x; gy += y; gn++; }
        });
        if (gn) { gx /= gn; gy /= gn; }
      }

      const pos = NODES.map((n, i) => {
        const drift = still ? 0 : 1;
        const x = n.x + drift * n.ax * Math.sin(t * n.fx + n.px);
        // the field is taller than the view; scroll pulls it up by depth,
        // so new nodes arrive from below as the page goes on
        const y =
          n.y +
          drift * n.ay * Math.cos(t * n.fy + n.py) -
          p * SCROLL_TRAVEL * n.depth;

        // the well: target displacement toward the pointer, falling off
        // with distance, stronger for near nodes, with a quarter turn of
        // swirl so it reads as a vortex rather than a magnet
        let tx = 0;
        let ty = 0;
        if (well && m === "gather" && gn > 1) {
          const d = Math.hypot(well.x - x, well.y - y);
          if (d < GATHER_REACH) {
            const f = (1 - d / GATHER_REACH) * gather * GATHER_PULL * (0.5 + 0.5 * n.depth);
            tx = (gx - x) * f;
            ty = (gy - y) * f;
          }
        } else if (well && m === "well") {
          const dx = well.x - x;
          const dy = well.y - y;
          const d = Math.hypot(dx, dy);
          if (d < WELL_REACH && d > 0.001) {
            const f = (1 - d / WELL_REACH) ** 2 * (0.4 + 0.6 * n.depth);
            const g = f * WELL_PULL;
            tx = (dx / d) * g + (-dy / d) * g * WELL_SWIRL;
            ty = (dy / d) * g + (dx / d) * g * WELL_SWIRL;
          }
        }
        const q = pull[i];
        q.x += (tx - q.x) * WELL_EASE;
        q.y += (ty - q.y) * WELL_EASE;
        return [x + q.x, y + q.y] as const;
      });

      nodeEls.forEach((el, i) => {
        el.setAttribute("cx", pos[i][0].toFixed(2));
        el.setAttribute("cy", pos[i][1].toFixed(2));
      });

      LINKS.forEach((l, i) => {
        const [ax, ay] = pos[l.a];
        const [bx, by] = pos[l.b];
        const mx = (ax + bx) / 2;
        const my = (ay + by) / 2;
        const dx = bx - ax;
        const dy = by - ay;
        const len = Math.hypot(dx, dy) || 1;
        const bow = l.bow * len;
        const cx = mx + (-dy / len) * bow;
        const cy = my + (dx / len) * bow;
        const d = `M ${ax.toFixed(2)} ${ay.toFixed(2)} Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${bx.toFixed(2)} ${by.toFixed(2)}`;
        lineEls[i].setAttribute("d", d);
        signalEls[i].setAttribute("d", d);
      });

      if (!still) raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    // reduced motion still needs to follow scroll, just without drift
    const onScroll = () => {
      if (still) raf = requestAnimationFrame(frame);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="bd bd-synapse" aria-hidden>
      <svg
        ref={svgRef}
        className="bd-net"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        {LINKS.map((l, i) => (
          <path
            key={`l${i}`}
            className="net-line"
            style={{ "--depth": l.depth } as React.CSSProperties}
          />
        ))}
        {LINKS.map((l, i) => (
          <path
            key={`s${i}`}
            className="net-signal"
            style={{ "--dur-s": `${l.dur}s`, "--delay-s": `${l.delay}s`, "--depth": l.depth } as React.CSSProperties}
            pathLength={100}
          />
        ))}
        {NODES.map((n, i) => (
          <circle
            key={`n${i}`}
            className={`net-node ${i % 2 ? "net-node-b" : "net-node-a"}`}
            style={{ "--dur-n": `${n.dur}s`, "--delay-n": `${n.delay}s`, "--peak": n.peak, "--depth": n.depth } as React.CSSProperties}
            cx={n.x}
            cy={n.y}
            r={n.r}
          />
        ))}
      </svg>
    </div>
  );
}

// How far, in viewBox units, the nearest nodes travel over the whole page.
const SCROLL_TRAVEL = 69;

// The gravity well under the pointer, in viewBox units (100 = the short
// side of the view). Reach is how far it is felt, pull is the most a node
// moves toward it, swirl is the sideways share of that, ease is how fast
// nodes settle per frame.
const WELL_REACH = 24;
const WELL_PULL = 9;
const WELL_SWIRL = 0.45;
const WELL_EASE = 0.07;

// Gather: reach around the pointer, the share of the distance to the
// cluster centre a node closes at full strength, the pointer speed that
// counts as full strength, and how fast the strength fades per frame.
const GATHER_REACH = 30;
const GATHER_PULL = 0.55;
const GATHER_SPEED = 140;
const GATHER_DECAY = 0.965;

// A seeded random constellation, so it looks scattered rather than gridded
// and still draws the same picture on every load. Nodes keep a minimum
// distance from each other, and every timing and orbit is its own.

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Node {
  x: number; y: number; r: number;
  dur: number; delay: number; peak: number;
  /** drift amplitude and frequency, per axis, plus phase */
  ax: number; ay: number; fx: number; fy: number; px: number; py: number;
  /** 0.25 far and slow, 1 near and fast */
  depth: number;
}
interface Link { a: number; b: number; bow: number; dur: number; delay: number; depth: number }

const rand = mulberry32(20260923);

const NODES: Node[] = (() => {
  const out: Node[] = [];
  let tries = 0;
  // the field runs from above the top to well below the bottom of the view,
  // so scroll can pull it up without it running out
  while (out.length < 64 && tries < 6000) {
    tries++;
    const x = -4 + rand() * 108;
    const y = -4 + rand() * 164;
    if (out.some((n) => (n.x - x) ** 2 + (n.y - y) ** 2 < 8 ** 2)) continue;
    const depth = 0.2 + rand() * 0.8;
    out.push({
      x: +x.toFixed(2),
      y: +y.toFixed(2),
      // far nodes are smaller and dimmer, near ones no brighter than before
      r: +((0.14 + rand() * 0.24) * (0.55 + 0.45 * depth)).toFixed(2),
      dur: +(5 + rand() * 7).toFixed(1),
      delay: +(-rand() * 12).toFixed(1),
      peak: +((0.22 + rand() * 0.28) * (0.45 + 0.55 * depth)).toFixed(2),
      // drift: a quarter more amplitude and a quarter more speed than before
      ax: (0.8 + rand() * 1.6) * 1.25,
      ay: (0.8 + rand() * 1.6) * 1.25,
      fx: (0.05 + rand() * 0.09) * 1.25,
      fy: (0.05 + rand() * 0.09) * 1.25,
      px: rand() * Math.PI * 2,
      py: rand() * Math.PI * 2,
      depth: +depth.toFixed(2),
    });
  }
  return out;
})();

const LINKS: Link[] = (() => {
  const seen = new Set<string>();
  const out: Link[] = [];
  NODES.forEach((n, i) => {
    NODES.map((m, j) => [j, (m.x - n.x) ** 2 + (m.y - n.y) ** 2] as const)
      .filter(([j]) => j !== i)
      .sort((p, q) => p[1] - q[1])
      .slice(0, 2)
      .forEach(([j]) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (seen.has(key)) return;
        seen.add(key);
        out.push({
          a: Math.min(i, j),
          b: Math.max(i, j),
          depth: +((NODES[i].depth + NODES[j].depth) / 2).toFixed(2),
          bow: (rand() - 0.5) * 0.5,
          dur: +(10 + rand() * 12).toFixed(1),
          delay: +(-rand() * 20).toFixed(1),
        });
      });
  });
  return out;
})();
