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
        {LINKS.map(([a, b], i) => (
          <line
            key={`l${i}`}
            className="net-line"
            x1={NODES[a][0]}
            y1={NODES[a][1]}
            x2={NODES[b][0]}
            y2={NODES[b][1]}
          />
        ))}
        {LINKS.map(([a, b], i) => (
          <line
            key={`s${i}`}
            className="net-signal"
            style={{ "--i": i } as React.CSSProperties}
            pathLength={100}
            x1={NODES[a][0]}
            y1={NODES[a][1]}
            x2={NODES[b][0]}
            y2={NODES[b][1]}
          />
        ))}
        {NODES.map(([x, y], i) => (
          <circle
            key={`n${i}`}
            className="net-node"
            style={{ "--i": i } as React.CSSProperties}
            cx={x}
            cy={y}
            r={0.28}
          />
        ))}
      </svg>
    </div>
  );
}

// A fixed constellation. Hand-placed so it reads as loose and organic rather
// than a grid, and so the same picture shows on every load.
const NODES: [number, number][] = [
  [8, 14], [21, 9], [34, 18], [47, 7], [62, 13], [77, 9], [91, 17],
  [12, 33], [28, 30], [43, 36], [58, 28], [72, 34], [88, 31],
  [6, 52], [19, 58], [36, 50], [52, 56], [67, 49], [83, 55], [95, 47],
  [14, 74], [30, 80], [46, 72], [61, 78], [76, 71], [90, 77],
  [9, 93], [25, 96], [41, 91], [57, 95], [73, 90], [88, 94],
];

// Each node links to its two nearest neighbours. Computed once.
const LINKS: [number, number][] = (() => {
  const seen = new Set<string>();
  const out: [number, number][] = [];
  NODES.forEach(([x, y], i) => {
    NODES.map(([nx, ny], j) => [j, (nx - x) ** 2 + (ny - y) ** 2] as const)
      .filter(([j]) => j !== i)
      .sort((p, q) => p[1] - q[1])
      .slice(0, 2)
      .forEach(([j]) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!seen.has(key)) {
          seen.add(key);
          out.push(i < j ? [i, j] : [j, i]);
        }
      });
  });
  return out;
})();
