"use client";

import { useEffect, useRef, useState } from "react";

// Where we focus, then what we aspire to, in one picture. The section is a
// tall track; its content pins while the visitor scrolls it, and the scroll
// drives the morph. At the top: the three nested circles, organization
// housing team housing individual, with the team lit because the team is
// the subject, and a key under the picture saying what each circle is.
// Scrolling on, the three circles glide apart and grow into a four-set
// Venn, a fourth rising from the centre: Cognitive, Relational, Emotional,
// Physical, the four kinds of capacity to perform, each its own colour,
// SAMUH's mark where all four meet. The head and the key change with it.
// Scrolling back reverses it. No animation library: the scroll position is
// the clock, and the geometry is interpolated.
//
// Motion, as the Circles diagram has it: each circle floats on its own slow
// cycle, and all are drawn toward the pointer and tethered, so none moves
// more than five percent of the frame. Deeper circles follow with more
// lag. The pointer is smoothed on a requestAnimationFrame loop that writes
// transforms straight to the DOM, so nothing re-renders while the mouse
// moves. Hover is a geometric test against the live circle positions, in
// both states, and lights the circle, its label and its key entry. Reduced
// motion holds the circles still and keeps the hover and the scroll.
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

/** how each circle moves, the Circles diagram's numbers. share: how much
 *  of the tether it takes. lag: follow time in --dur units. float: idle
 *  drift in frame units. cycle: radians per second, all slow */
const MOTION: Record<Key, { share: number; lag: number; float: number; cycle: number; phase: number }> = {
  org: { share: 0.6, lag: 2.4, float: 3, cycle: 0.21, phase: 0.0 },
  team: { share: 0.8, lag: 1.6, float: 4, cycle: 0.27, phase: 2.1 },
  ind: { share: 1.0, lag: 1.0, float: 6, cycle: 0.34, phase: 4.2 },
  phys: { share: 0.7, lag: 2.0, float: 4, cycle: 0.24, phase: 1.1 },
};
const TETHER = 32; // five percent of the frame

/** TODO(content): the nested circles' key. The team line and the two
 *  callouts the Circles diagram shows on hover, here always shown. */
const FOCUS: { key: Exclude<Key, "phys">; name: string; label: string; note: string; y: number }[] = [
  { key: "team", name: "Team", label: "Where people experience their work life", note: "The subject. Where the work gets done, and where capacity is won or lost.", y: 246 },
  { key: "ind", name: "Individual", label: "Where organizations invest", note: "Hiring, coaching, training: one person at a time.", y: 126 },
  { key: "org", name: "Organization", label: "Where organizations look", note: "Strategy, structure, culture: the whole at once.", y: 362 },
];

/** TODO(content): what each circle becomes, with its one line. The
 *  definitions are the ones the Aspirational section carried. Each label
 *  sits in the part of its circle that no other circle covers. */
const CAPACITY: Record<Key, { name: string; note: string; x: number; y: number }> = {
  org: { name: "Cognitive", note: "Judgment and focus that hold under load.", x: 180, y: 100 },
  team: { name: "Relational", note: "Trust, feedback and how decisions get made.", x: 460, y: 100 },
  ind: { name: "Emotional", note: "Energy, and the will to keep going.", x: 180, y: 348 },
  phys: { name: "Physical", note: "The stamina the other three depend on.", x: 460, y: 348 },
};

/** the supplied mark, 182 by 240, set small in the middle */
const MARK = { w: 46, h: 46 * (240 / 182) };

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** smoothstep: eases both ends so the circles settle rather than stop */
const ease = (t: number) => t * t * (3 - 2 * t);

const shapesAt = (e: number): Record<Key, Shape> =>
  Object.fromEntries(
    KEYS.map((k) => [k, { cx: lerp(START[k].cx, END[k].cx, e), cy: lerp(START[k].cy, END[k].cy, e), r: lerp(START[k].r, END[k].r, e) }]),
  ) as Record<Key, Shape>;

export function FocusMorph() {
  const root = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const gRefs = useRef<Partial<Record<Key, SVGGElement | null>>>({});
  const [p, setP] = useState(0);
  const [hot, setHot] = useState<Key | null>(null);
  // everything the motion loop touches lives outside React state
  const m = useRef({
    pointer: null as { x: number; y: number } | null, // frame units, from the centre
    target: { x: 0, y: 0 },
    cur: Object.fromEntries(KEYS.map((k) => [k, { x: 0, y: 0 }])) as Record<Key, { x: number; y: number }>,
    off: Object.fromEntries(KEYS.map((k) => [k, { x: 0, y: 0 }])) as Record<Key, { x: number; y: number }>, // where each circle is drawn, tether plus float
    e: 0,
    hot: null as Key | null,
  });

  // the scroll is the clock. The section is the track and its content
  // pins under the nav (layout.css, "morph"); progress is how far the
  // content has travelled from where it pinned to where the section's
  // content box lets it go, so 0 is the first pinned frame and 1 the last.
  // --p goes on the pinned content, so the head beside the picture reads
  // it too
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
      const next = travel > 0 ? clamp((navH - rect.top - padTop) / travel) : 1;
      m.current.e = ease(next);
      stage.style.setProperty("--p", m.current.e.toFixed(4));
      setP(next);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(read); };
    read();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
      stage.style.removeProperty("--p");
    };
  }, []);

  const e = ease(p);
  const venn = e > 0.5;
  const shapes = shapesAt(e);

  /** which circle the pointer is in, against the live positions. Nested:
   *  innermost first, so the individual wins over the team, the team over
   *  the organization. Venn: of those containing it, the nearest centre */
  const hit = (pt: { x: number; y: number } | null): Key | null => {
    if (!pt) return null;
    const s = m.current;
    const live = shapesAt(s.e);
    const x = pt.x + FRAME.w / 2;
    const y = pt.y + FRAME.h / 2;
    if (s.e <= 0.5) {
      for (const k of ["ind", "team", "org"] as const) {
        const c = live[k];
        if (Math.hypot(x - (c.cx + s.off[k].x), y - (c.cy + s.off[k].y)) <= c.r + 4) return k;
      }
      return null;
    }
    let best: Key | null = null;
    let near = Infinity;
    for (const k of KEYS) {
      const c = live[k];
      const d = Math.hypot(x - (c.cx + s.off[k].x), y - (c.cy + s.off[k].y));
      if (d <= c.r && d < near) { near = d; best = k; }
    }
    return best;
  };
  const setHotIfChanged = (h: Key | null) => {
    if (h !== m.current.hot) { m.current.hot = h; setHot(h); }
  };
  const toFrame = (ev: React.PointerEvent<SVGSVGElement> | React.MouseEvent<SVGSVGElement>) => {
    const b = ev.currentTarget.getBoundingClientRect();
    return {
      x: ((ev.clientX - b.left) / b.width) * FRAME.w - FRAME.w / 2,
      y: ((ev.clientY - b.top) / b.height) * FRAME.h - FRAME.h / 2,
    };
  };
  const onMove = (ev: React.PointerEvent<SVGSVGElement>) => {
    if (ev.pointerType === "touch") return; // a finger is for scrolling; touch taps instead
    const pt = toFrame(ev);
    m.current.pointer = pt;
    const d = Math.hypot(pt.x, pt.y) || 1;
    const k = Math.min(1, d / 260); // farther pointer, firmer pull, until the tether
    m.current.target = { x: (pt.x / d) * TETHER * k, y: (pt.y / d) * TETHER * k };
    setHotIfChanged(hit(pt)); // immediate, so the hover never waits on a frame
  };
  const onLeave = () => {
    m.current.pointer = null;
    m.current.target = { x: 0, y: 0 };
    setHotIfChanged(null);
  };

  // the motion loop: tether and float, written straight to the groups
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // still picture, hover only
    const dur = parseFloat(getComputedStyle(svg).getPropertyValue("--dur")) || 300;
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      const dt = last ? Math.min(64, now - last) : 16; // clamp so a background tab does not lurch on return
      last = now;
      const t = now / 1000;
      const s = m.current;
      for (const k of KEYS) {
        const g = gRefs.current[k];
        if (!g) continue;
        const mo = MOTION[k];
        const c = s.cur[k];
        // exponential follow: the deeper the ring, the longer it takes, frame-rate independent
        const f = 1 - Math.exp(-dt / (dur * mo.lag));
        c.x += (s.target.x * mo.share - c.x) * f;
        c.y += (s.target.y * mo.share - c.y) * f;
        const ox = c.x + Math.sin(t * mo.cycle + mo.phase) * mo.float;
        const oy = c.y + Math.cos(t * mo.cycle * 0.8 + mo.phase) * mo.float;
        s.off[k] = { x: ox, y: oy };
        g.setAttribute("transform", `translate(${ox.toFixed(2)} ${oy.toFixed(2)})`);
      }
      if (s.pointer) setHotIfChanged(hit(s.pointer)); // circles drift under a still pointer
      raf = requestAnimationFrame(tick);
    };
    const start = () => { if (!raf) { last = 0; raf = requestAnimationFrame(tick); } };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    // only spend frames while the picture is on screen
    const io = new IntersectionObserver(([en]) => (en.isIntersecting ? start() : stop()), { rootMargin: "80px" });
    io.observe(svg);
    return () => { stop(); io.disconnect(); };
  }, []);

  const keyHover = (k: Key) => (ev: React.PointerEvent) => { if (ev.pointerType !== "touch") setHotIfChanged(k); };

  return (
    <>
      {/* the head, in the margin column: one for each state, crossfading */}
      <div className="L-head L-fm-head L-fm-out" aria-hidden={venn || undefined}>
        <div>
          <p className="eyebrow L-eyebrow">Where others focus</p>
          <h2 className="sec">Where we focus</h2>
        </div>
      </div>
      <div className="L-head L-fm-head L-fm-in" aria-hidden={!venn || undefined}>
        <div>
          {/* TODO(content): the client's words, 12 Oct */}
          <p className="eyebrow L-eyebrow">SAMUH works at the centre</p>
          <h2 className="sec">Optimize the team as a whole</h2>
        </div>
      </div>

      <div className="L-circ L-fm" ref={root} data-venn={venn || undefined} data-hot={hot ?? undefined}>
        <svg
          ref={svgRef}
          className="L-c-svg"
          viewBox={`0 0 ${FRAME.w} ${FRAME.h}`}
          role="img"
          aria-label={venn
            ? "Four overlapping circles: Cognitive, Relational, Emotional and Physical capacity, with the SAMUH mark where all four meet"
            : "Three nested circles: organization, team, individual"}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          onClick={(ev) => { const k = hit(toFrame(ev)); setHotIfChanged(m.current.hot === k ? null : k); }}
        >
          {/* each circle with its labels in one group, so they move together */}
          {KEYS.map((k) => {
            const s = shapes[k];
            const nested = FOCUS.find((f) => f.key === k);
            return (
              <g key={k} className="L-fm-g" ref={(el) => { gRefs.current[k] = el; }} data-on={hot === k || undefined}>
                {/* the ring: the nested circles' look, fading as the Venn arrives */}
                {k !== "phys" ? <circle cx={s.cx} cy={s.cy} r={s.r} className={`L-fm-ring L-c-${k} L-fm-out`} /> : null}
                {/* the Venn: the same stroke, each circle its own colour */}
                <circle cx={s.cx} cy={s.cy} r={s.r} className={`L-fm-venn L-fm-venn-${k} L-fm-in`} />
                {nested ? (
                  <text x={s.cx} y={s.cy + (nested.y - START[k].cy)} className={`L-c-t L-c-t-${k} L-fm-out`}>{nested.name}</text>
                ) : null}
                <text x={CAPACITY[k].x} y={CAPACITY[k].y} className={`L-c-t L-fm-cap L-fm-cap-${k} L-fm-in`}>{CAPACITY[k].name}</text>
              </g>
            );
          })}
          {/* the mark, where all four meet */}
          <image href="/samuh-icon.png" x={FRAME.w / 2 - MARK.w / 2} y={FRAME.h / 2 - MARK.h / 2} width={MARK.w} height={MARK.h} className="L-fm-in L-fm-mark" />
        </svg>

        {/* the key under the picture: one for each state, crossfading */}
        <div className="L-fm-key">
          <dl className="L-fm-legend L-fm-legend-3 L-fm-out" aria-hidden={venn || undefined}>
            {FOCUS.map(({ key: k, name, label, note }) => (
              <div className={`L-fm-item L-fm-item-${k}`} key={k} data-on={hot === k || undefined} onPointerEnter={keyHover(k)} onPointerLeave={onLeave}>
                <dt>{name}</dt>
                <dd><strong>{label}.</strong> {note}</dd>
              </div>
            ))}
          </dl>
          <dl className="L-fm-legend L-fm-legend-4 L-fm-in" aria-hidden={!venn || undefined}>
            {KEYS.map((k) => (
              <div className={`L-fm-item L-fm-item-${k}`} key={k} data-on={hot === k || undefined} onPointerEnter={keyHover(k)} onPointerLeave={onLeave}>
                <dt>{CAPACITY[k].name}</dt>
                <dd>{CAPACITY[k].note}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </>
  );
}
