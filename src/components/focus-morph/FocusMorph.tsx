"use client";

import { useEffect, useRef, useState } from "react";

// Where we focus, then what we aspire to, in one picture. The section is a
// tall track; its content pins while the visitor scrolls it, and the scroll
// drives the morph. At the top: the three nested circles, organization
// housing team housing individual, with the team lit because the team is
// the subject. Scrolling on, the three circles glide apart and grow into a
// four-set Venn, a fourth rising from the centre: Cognitive, Relational,
// Emotional, Physical, the four kinds of capacity to perform. SAMUH's mark
// sits where all four meet. Scrolling back reverses it. No animation
// library: the scroll position is the clock, and the geometry is
// interpolated. Reduced motion changes nothing, since nothing moves on its
// own.
//
// Copy here is our draft, marked TODO(content). It describes and does not
// claim (CLAUDE.md rule 1). The mark is the supplied PNG, placed, never
// redrawn (rule 2).

type Key = "org" | "team" | "ind" | "phys";
interface Shape { cx: number; cy: number; r: number }

const FRAME = { w: 640, h: 440 };
const KEYS: Key[] = ["org", "team", "ind", "phys"];

/** the nested circles, as the Circles diagram draws them */
const START: Record<Key, Shape> = {
  org: { cx: 320, cy: 220, r: 190 },
  team: { cx: 320, cy: 182, r: 128 },
  ind: { cx: 320, cy: 120, r: 46 },
  // the fourth has not arrived yet: a point at the centre
  phys: { cx: 320, cy: 220, r: 0 },
};

/** the Venn: four equal circles on a square, every pair overlapping and all
 *  four sharing the middle, where the mark goes. As large as the frame
 *  allows, so it reads at the nested circles' size */
const END: Record<Key, Shape> = {
  org: { cx: 245, cy: 145, r: 140 },
  team: { cx: 395, cy: 145, r: 140 },
  ind: { cx: 245, cy: 295, r: 140 },
  phys: { cx: 395, cy: 295, r: 140 },
};

/** TODO(content): what each circle becomes, with its one line. The
 *  definitions are the ones the Aspirational section carried. Each label
 *  sits in the part of its circle that no other circle covers. */
const CAPACITY: Record<Key, { name: string; note: string; x: number; y: number }> = {
  org: { name: "Cognitive", note: "Judgment and focus that hold under load.", x: 180, y: 100 },
  team: { name: "Relational", note: "Trust, feedback and how decisions get made.", x: 460, y: 100 },
  ind: { name: "Emotional", note: "Energy, and the will to keep going.", x: 180, y: 348 },
  phys: { name: "Physical", note: "The stamina the other three depend on.", x: 460, y: 348 },
};

/** the labels of the nested circles, where the Circles diagram puts them */
const NESTED: Record<Exclude<Key, "phys">, { name: string; y: number }> = {
  org: { name: "Organization", y: 362 },
  team: { name: "Team", y: 246 },
  ind: { name: "Individual", y: 126 },
};

/** the supplied mark, 182 by 240, set small in the middle */
const MARK = { w: 46, h: 46 * (240 / 182) };

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** smoothstep: eases both ends so the circles settle rather than stop */
const ease = (t: number) => t * t * (3 - 2 * t);

export function FocusMorph() {
  const root = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const [hot, setHot] = useState<Key | null>(null);

  // the scroll is the clock. The section is the track and its content
  // pins under the nav (layout.css, "morph"); progress is how far the
  // content has travelled from where it pinned to where the section's
  // content box lets it go, so 0 is the first pinned frame and 1 the last
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const track = el.closest<HTMLElement>(".L-sec");
    const stage = el.closest<HTMLElement>(".L-wrap");
    if (!track || !stage) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const rect = track.getBoundingClientRect();
      const cs = getComputedStyle(track);
      const padTop = parseFloat(cs.paddingTop) || 0;
      const padBottom = parseFloat(cs.paddingBottom) || 0;
      const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 0;
      const travel = rect.height - padTop - padBottom - stage.offsetHeight;
      setP(travel > 0 ? clamp((navH - rect.top - padTop) / travel) : 1);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(read); };
    read();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, []);

  const e = ease(p);
  const venn = e > 0.5;
  const shapes = Object.fromEntries(
    KEYS.map((k) => [k, { cx: lerp(START[k].cx, END[k].cx, e), cy: lerp(START[k].cy, END[k].cy, e), r: lerp(START[k].r, END[k].r, e) }]),
  ) as Record<Key, Shape>;

  /** which Venn circle the pointer is in: of those containing it, the one
   *  whose centre is nearest, so the overlaps resolve one way */
  const hit = (clientX: number, clientY: number, svg: SVGSVGElement): Key | null => {
    if (!venn) return null;
    const b = svg.getBoundingClientRect();
    const x = ((clientX - b.left) / b.width) * FRAME.w;
    const y = ((clientY - b.top) / b.height) * FRAME.h;
    let best: Key | null = null;
    let near = Infinity;
    for (const k of KEYS) {
      const s = shapes[k];
      const d = Math.hypot(x - s.cx, y - s.cy);
      if (d <= s.r && d < near) { near = d; best = k; }
    }
    return best;
  };

  const shown = hot ? CAPACITY[hot] : null;

  return (
    <div className="L-circ L-fm" ref={root} style={{ "--p": e } as React.CSSProperties} data-venn={venn || undefined}>
      <p className="L-c-call L-c-left L-c-call-team L-c-hi L-fm-out" aria-hidden={venn || undefined}>
        Where people experience their work life
      </p>
      <svg
        className="L-c-svg"
        viewBox={`0 0 ${FRAME.w} ${FRAME.h}`}
        role="img"
        aria-label={venn
          ? "Four overlapping circles: Cognitive, Relational, Emotional and Physical capacity, with the SAMUH mark where all four meet"
          : "Three nested circles: organization, team, individual"}
        onPointerMove={(ev) => { if (ev.pointerType !== "touch") setHot(hit(ev.clientX, ev.clientY, ev.currentTarget)); }}
        onPointerLeave={() => setHot(null)}
        onClick={(ev) => { const k = hit(ev.clientX, ev.clientY, ev.currentTarget); setHot((was) => (was === k ? null : k)); }}
      >
        {/* the rings: the nested circles' look, fading as the Venn arrives */}
        {(["org", "team", "ind"] as const).map((k) => (
          <circle key={`ring-${k}`} cx={shapes[k].cx} cy={shapes[k].cy} r={shapes[k].r} className={`L-fm-ring L-c-${k} L-fm-out`} />
        ))}
        {/* the discs: the Venn's look, arriving as the rings go */}
        {KEYS.map((k) => (
          <circle key={`disc-${k}`} cx={shapes[k].cx} cy={shapes[k].cy} r={shapes[k].r} className={`L-fm-disc L-fm-disc-${k} L-fm-in`} data-on={hot === k || undefined} />
        ))}
        {/* the nested labels */}
        {(["org", "team", "ind"] as const).map((k) => (
          <text key={`t-${k}`} x={shapes[k].cx} y={shapes[k].cy + (NESTED[k].y - START[k].cy)} className={`L-c-t L-c-t-${k} L-fm-out`}>{NESTED[k].name}</text>
        ))}
        {/* the capacity labels */}
        {KEYS.map((k) => (
          <text key={`c-${k}`} x={CAPACITY[k].x} y={CAPACITY[k].y} className="L-c-t L-fm-cap L-fm-in" data-on={hot === k || undefined}>{CAPACITY[k].name}</text>
        ))}
        {/* the mark, where all four meet */}
        <image href="/samuh-icon.png" x={FRAME.w / 2 - MARK.w / 2} y={FRAME.h / 2 - MARK.h / 2} width={MARK.w} height={MARK.h} className="L-fm-in L-fm-mark" />
      </svg>
      <div className="L-c-right">
        {/* TODO(content): draft. The hovered or tapped circle's line, else the point of the picture */}
        <p className="L-c-call L-fm-in L-fm-def" aria-live="polite" aria-hidden={!venn || undefined}>
          {shown ? shown.name : "SAMUH works at the centre"}
          <span className="L-c-sub">{shown ? shown.note : "Four kinds of capacity to perform. A team needs all four, so we account for all four."}</span>
        </p>
      </div>
    </div>
  );
}
