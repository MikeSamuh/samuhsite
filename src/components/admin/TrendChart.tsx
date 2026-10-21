"use client";

import { useState } from "react";

/**
 * One series over time, as a thin line with a soft area under it, and a
 * crosshair tooltip on hover. One axis, no legend (the title names the
 * series), the grid recessive. Every colour is an admin var.
 */
export function TrendChart({ points, label }: { points: { date: string; value: number }[]; label: string }) {
  const [hot, setHot] = useState<number | null>(null);
  const W = 720, H = 220, PX = 36, PY = 16;
  const n = points.length;
  if (n < 2) return <p className="adm-note">Not enough days yet to draw a line.</p>;
  const max = Math.max(1, ...points.map((p) => p.value));
  const x = (i: number) => PX + (i / (n - 1)) * (W - PX * 2);
  const y = (v: number) => H - PY - (v / max) * (H - PY * 2);
  const path = points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
  const area = `${path} L${x(n - 1).toFixed(1)},${(H - PY).toFixed(1)} L${x(0).toFixed(1)},${(H - PY).toFixed(1)} Z`;
  const ticks = [0, 0.5, 1].map((t) => ({ v: Math.round(max * t), y: y(max * t) }));
  const fmt = (d: string) => `${d.slice(6, 8)} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][Number(d.slice(4, 6)) - 1]}`;
  const labelsAt = [0, Math.floor((n - 1) / 2), n - 1];
  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    setHot(Math.max(0, Math.min(n - 1, Math.round(((px - PX) / (W - PX * 2)) * (n - 1)))));
  };
  const p = hot !== null ? points[hot] : null;
  return (
    <div style={{ position: "relative" }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="adm-chart" role="img" aria-label={`${label} by day`} onMouseMove={onMove} onMouseLeave={() => setHot(null)}>
        {ticks.map((t) => (
          <g key={t.v}>
            <line x1={PX} x2={W - PX} y1={t.y} y2={t.y} className="adm-chart-grid" />
            <text x={PX - 6} y={t.y + 3} textAnchor="end" className="adm-chart-axis">{t.v}</text>
          </g>
        ))}
        {labelsAt.map((i) => (
          <text key={i} x={x(i)} y={H - 2} textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"} className="adm-chart-axis">{fmt(points[i].date)}</text>
        ))}
        <path d={area} className="adm-chart-area" />
        <path d={path} className="adm-chart-line" />
        {p && hot !== null ? (
          <g>
            <line x1={x(hot)} x2={x(hot)} y1={PY} y2={H - PY} className="adm-chart-grid" style={{ stroke: "var(--adm-muted)" }} />
            <circle cx={x(hot)} cy={y(p.value)} r={5} fill="var(--adm-accent)" stroke="var(--adm-surface)" strokeWidth={2} />
          </g>
        ) : null}
      </svg>
      {p && hot !== null ? (
        <div role="status" style={{ position: "absolute", left: `${(x(hot) / W) * 100}%`, top: 0, transform: `translateX(${hot > n / 2 ? "-100%" : "0"})`, background: "var(--adm-text)", color: "var(--adm-surface)", fontSize: 12, padding: "4px 8px", borderRadius: 6, pointerEvents: "none", whiteSpace: "nowrap" }}>
          {fmt(p.date)} · {p.value.toLocaleString()} {label.toLowerCase()}
        </div>
      ) : null}
    </div>
  );
}
