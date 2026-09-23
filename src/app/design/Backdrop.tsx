"use client";

import type { BackdropId } from "@/lib/tokens";

/**
 * The five background treatments. Pure CSS and inline SVG, no image assets.
 * Each reads --accent and --accent-2 so the stage and the accents always agree.
 * Chalk also reads --scroll-p, the page's scroll progress from 0 to 1.
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
        <div className="bd-chalk-mark" />
      </div>
    );
  }

  // synapse
  return (
    <div className="bd bd-synapse" aria-hidden>
      <svg
        className="bd-net"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        {LINKS.map((l, i) => (
          <path key={`l${i}`} className="net-line" d={l.d} />
        ))}
        {LINKS.map((l, i) => (
          <path
            key={`s${i}`}
            className="net-signal"
            style={{ "--dur-s": `${l.dur}s`, "--delay-s": `${l.delay}s` } as React.CSSProperties}
            pathLength={100}
            d={l.d}
          />
        ))}
        {NODES.map((n, i) => (
          <circle
            key={`n${i}`}
            className="net-node"
            style={{ "--dur-n": `${n.dur}s`, "--delay-n": `${n.delay}s`, "--peak": n.peak } as React.CSSProperties}
            cx={n.x}
            cy={n.y}
            r={n.r}
          />
        ))}
      </svg>
    </div>
  );
}

// A seeded random constellation, so it looks scattered rather than gridded
// and still draws the same picture on every load. Nodes keep a minimum
// distance from each other, links curve, and every timing is its own.

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

interface Node { x: number; y: number; r: number; dur: number; delay: number; peak: number }
interface Link { d: string; dur: number; delay: number }

const rand = mulberry32(20260923);

const NODES: Node[] = (() => {
  const out: Node[] = [];
  let tries = 0;
  while (out.length < 44 && tries < 4000) {
    tries++;
    const x = -4 + rand() * 108;
    const y = -4 + rand() * 108;
    if (out.some((n) => (n.x - x) ** 2 + (n.y - y) ** 2 < 8 ** 2)) continue;
    out.push({
      x: +x.toFixed(2),
      y: +y.toFixed(2),
      r: +(0.14 + rand() * 0.24).toFixed(2),
      dur: +(5 + rand() * 7).toFixed(1),
      delay: +(-rand() * 12).toFixed(1),
      peak: +(0.25 + rand() * 0.3).toFixed(2),
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
        const a = NODES[i];
        const b = NODES[j];
        // control point off the midpoint, perpendicular, so each link bows
        // a little in its own direction
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const len = Math.hypot(dx, dy) || 1;
        const bow = (rand() - 0.5) * 0.5 * len;
        const cx = mx + (-dy / len) * bow;
        const cy = my + (dx / len) * bow;
        out.push({
          d: `M ${a.x} ${a.y} Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${b.x} ${b.y}`,
          dur: +(10 + rand() * 12).toFixed(1),
          delay: +(-rand() * 20).toFixed(1),
        });
      });
  });
  return out;
})();
