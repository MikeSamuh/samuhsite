"use client";

import { useEffect, useRef } from "react";

/**
 * A faint network that is never still. Every node drifts on its own slow
 * orbit, and the whole field parallaxes with scroll at a per-node depth, so
 * nearer nodes travel further than distant ones. Depth also sets focus: far
 * nodes are smaller, dimmer and blurred, near nodes are crisp. Links are
 * quadratic curves recomputed each frame so they stay attached. Signals and
 * pulses are CSS.
 *
 * Reduced motion: one static frame, no loop.
 */
export default function Synapse() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const nodeEls = Array.from(svg.querySelectorAll<SVGCircleElement>(".net-node"));
    const lineEls = Array.from(svg.querySelectorAll<SVGPathElement>(".net-line"));
    const signalEls = Array.from(svg.querySelectorAll<SVGPathElement>(".net-signal"));

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const t0 = performance.now();

    const frame = (now: number) => {
      const t = (now - t0) / 1000;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;

      const pos = NODES.map((n) => {
        const drift = still ? 0 : 1;
        const x = n.x + drift * n.ax * Math.sin(t * n.fx + n.px);
        // the field is taller than the view; scroll pulls it up by depth,
        // so new nodes arrive from below as the page goes on
        const y =
          n.y +
          drift * n.ay * Math.cos(t * n.fy + n.py) -
          p * SCROLL_TRAVEL * n.depth;
        return [x, y] as const;
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
            className="net-node"
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
