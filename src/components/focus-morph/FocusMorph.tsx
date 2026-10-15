"use client";

import { useEffect, useRef, useState } from "react";

// Where others focus, where we focus, then what we aspire to, in one
// picture. The section is a tall track; its content pins while the visitor
// scrolls it, and the scroll drives the picture in two moves.
//
// At the top: a single dot, which grows as you scroll into two nested
// circles, the organization with the individual at its centre, headed
// "Where others focus", with a key beside the picture saying what each
// circle is. Scrolling on, the team circle grows in between them, lit
// because the team is the subject, the individual rises to the top of it,
// the head becomes "Where we focus" and the key keeps the team alone.
// Scrolling further, the three circles glide apart and grow into a four-set
// Venn, a fourth rising from the centre: Cognitive, Relational, Emotional,
// Physical, the four kinds of capacity to perform, each its own colour,
// SAMUH's star where all four meet, under "SAMUH works at the centre".
// Scrolling back reverses it. No animation library: the scroll position is
// the clock, and the geometry is interpolated.
//
// Motion, as the Circles diagram has it: each circle floats on its own slow
// cycle, and all are drawn toward the pointer and tethered, so none moves
// more than five percent of the frame. Deeper circles follow with more
// lag. The star follows the pointer too, on a shorter tether, and is held
// inside every circle, so it never leaves the lens where the four meet.
// The pointer is smoothed on a requestAnimationFrame loop that writes
// transforms straight to the DOM, so nothing re-renders while the mouse
// moves. Hover is a geometric test against the live circle positions:
// nested, the innermost circle under the pointer; in the Venn, every
// circle under it, so a lens lights both of its circles and their two
// fills blend. Each hot circle takes a light fill, a heavier stroke, and
// its label and key entry take its colour. Reduced motion holds the
// circles still and keeps the hover and the scroll.
//
// Copy here is our draft, marked TODO(content). It describes and does not
// claim (CLAUDE.md rule 1). The star is the supplied PNG, placed, never
// redrawn (rule 2).

type Key = "org" | "team" | "ind" | "phys";
interface Shape { cx: number; cy: number; r: number }
interface Pt { x: number; y: number }

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
/** where the individual sits before the team arrives: the centre */
const IND_ALONE = { cx: 320, cy: 220 };

/** the Venn: four equal circles on a square, every pair overlapping and all
 *  four sharing the middle, where the star goes. As large as the frame
 *  allows, so it reads at the nested circles' size */
const END: Record<Key, Shape> = {
  org: { cx: 245, cy: 145, r: 140 },
  team: { cx: 395, cy: 145, r: 140 },
  ind: { cx: 245, cy: 295, r: 140 },
  phys: { cx: 395, cy: 295, r: 140 },
};

/** the arrival, as a share of the section's climb from the foot of the
 *  view to where it pins: the head comes first, then the key and the two
 *  circles growing from a dot close behind it, so the picture is there by
 *  the time it stops */
const HEAD = { from: 0.05, to: 0.4 };
const GROW = { from: 0.2, to: 0.95 };
/** the track, as a share of the pinned scroll: the team arrives, the Venn
 *  comes last, a pause between each so it reads */
const ARRIVE = { from: 0.08, to: 0.28 };
const MORPH = { from: 0.55, to: 1 };

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

/** the supplied star, square, set small where the four circles meet. It
 *  follows the pointer on its own short tether and never leaves the lens:
 *  its centre is kept inside every circle by its own half-size */
const STAR = 44;
const STAR_TETHER = 14;
const STAR_LAG = 1.2;

/** TODO(content): the nested circles' key. The team at the top, since it
 *  is the subject; its entry opens up as its circle arrives. The team line
 *  and the two callouts the Circles diagram shows on hover, here always
 *  shown. */
const FOCUS: { key: Exclude<Key, "phys">; name: string; label: string; note: string; y: number }[] = [
  { key: "team", name: "Team", label: "Where people experience their work life", note: "Where Samuh works. Goals, feedback, rituals: where capacity is won or lost.", y: 246 },
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

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** smoothstep: eases both ends so the circles settle rather than stop */
const ease = (t: number) => t * t * (3 - 2 * t);
/** where a stretch of the track has got to, eased, 0 before it and 1 after */
const over = (p: number, span: { from: number; to: number }) => ease(clamp((p - span.from) / (span.to - span.from)));

/** the circles at this point of the travel: g is the growth from the dot,
 *  q the team's arrival (the individual rises with it), e the Venn */
const shapesAt = (e: number, q: number, g: number): Record<Key, Shape> =>
  Object.fromEntries(
    KEYS.map((k) => {
      const r0 = k === "team" ? START.team.r * q : START[k].r * g;
      const cy0 = k === "ind" ? lerp(IND_ALONE.cy, START.ind.cy, q) : START[k].cy;
      return [k, { cx: lerp(START[k].cx, END[k].cx, e), cy: lerp(cy0, END[k].cy, e), r: lerp(r0, END[k].r, e) }];
    }),
  ) as Record<Key, Shape>;

const same = (a: Key[], b: Key[]) => a.length === b.length && a.every((k, i) => k === b[i]);

export function FocusMorph() {
  const root = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const gRefs = useRef<Partial<Record<Key, SVGGElement | null>>>({});
  const starRef = useRef<SVGGElement>(null);
  const [p, setP] = useState(0);
  const [g, setG] = useState(0);
  const [hot, setHot] = useState<Key[]>([]);
  // everything the motion loop touches lives outside React state
  const m = useRef({
    pointer: null as Pt | null, // frame units, from the centre
    target: { x: 0, y: 0 } as Pt,
    cur: Object.fromEntries(KEYS.map((k) => [k, { x: 0, y: 0 }])) as Record<Key, Pt>,
    off: Object.fromEntries(KEYS.map((k) => [k, { x: 0, y: 0 }])) as Record<Key, Pt>, // where each circle is drawn, tether plus float
    star: { x: 0, y: 0 } as Pt,
    e: 0,
    q: 0,
    g: 0,
    hot: [] as Key[],
  });

  // the scroll is the clock. The section is the track and its content
  // pins under the nav (layout.css, "morph"); progress is how far the
  // content has travelled from where it pinned to where the section's
  // content box lets it go, so 0 is the first pinned frame and 1 the last.
  // --q (the team arriving) and --p (the Venn) go on the pinned content,
  // so the heads and the key beside the picture read them too
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
      // the climb: 0 with the section's top at the foot of the view, 1 pinned
      const enter = clamp((window.innerHeight - rect.top) / Math.max(1, window.innerHeight - navH));
      m.current.g = over(enter, GROW);
      m.current.q = over(next, ARRIVE);
      m.current.e = over(next, MORPH);
      stage.style.setProperty("--h", over(enter, HEAD).toFixed(4));
      stage.style.setProperty("--g", m.current.g.toFixed(4));
      stage.style.setProperty("--q", m.current.q.toFixed(4));
      stage.style.setProperty("--p", m.current.e.toFixed(4));
      setP(next);
      setG(m.current.g);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(read); };
    read();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
      stage.style.removeProperty("--h");
      stage.style.removeProperty("--g");
      stage.style.removeProperty("--q");
      stage.style.removeProperty("--p");
    };
  }, []);

  const q = over(p, ARRIVE);
  const e = over(p, MORPH);
  const arrived = q > 0.5;
  const venn = e > 0.5;
  const shapes = shapesAt(e, q, g);

  /** which circles the pointer is in, against the live positions. Nested:
   *  the innermost only, so the individual wins over the team, the team
   *  over the organization, and the team not before it has arrived. Venn:
   *  every one containing it, so a lens lights both of its circles */
  const hit = (pt: Pt | null): Key[] => {
    if (!pt) return [];
    const s = m.current;
    const live = shapesAt(s.e, s.q, s.g);
    const x = pt.x + FRAME.w / 2;
    const y = pt.y + FRAME.h / 2;
    const inside = (k: Key, pad = 0) => {
      const c = live[k];
      return Math.hypot(x - (c.cx + s.off[k].x), y - (c.cy + s.off[k].y)) <= c.r + pad;
    };
    if (s.e <= 0.5) {
      for (const k of ["ind", "team", "org"] as const) {
        if (k === "team" && s.q < 0.5) continue;
        if (inside(k, 4)) return [k];
      }
      return [];
    }
    return KEYS.filter((k) => inside(k));
  };
  const setHotIfChanged = (h: Key[]) => {
    if (!same(h, m.current.hot)) { m.current.hot = h; setHot(h); }
  };
  const toFrame = (ev: React.PointerEvent<SVGSVGElement> | React.MouseEvent<SVGSVGElement>): Pt => {
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
    setHotIfChanged([]);
  };

  // the motion loop: tether and float, written straight to the groups; the
  // star on its own tether, held inside every circle
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
      const star = starRef.current;
      if (star) {
        const st = s.star;
        const f = 1 - Math.exp(-dt / (dur * STAR_LAG));
        const scale = STAR_TETHER / TETHER;
        st.x += (s.target.x * scale - st.x) * f;
        st.y += (s.target.y * scale - st.y) * f;
        if (s.e > 0.5) {
          // held inside every circle, where they are drawn right now. A few
          // passes, since pulling toward one circle can push out of another
          const live = shapesAt(s.e, s.q, s.g);
          for (let pass = 0; pass < 3; pass += 1) {
            for (const k of KEYS) {
              const c = live[k];
              const cx = c.cx + s.off[k].x - FRAME.w / 2;
              const cy = c.cy + s.off[k].y - FRAME.h / 2;
              const dx = st.x - cx;
              const dy = st.y - cy;
              const d = Math.hypot(dx, dy);
              const max = c.r - STAR / 2;
              if (d > max && d > 0) { st.x = cx + (dx / d) * max; st.y = cy + (dy / d) * max; }
            }
          }
        }
        star.setAttribute("transform", `translate(${st.x.toFixed(2)} ${st.y.toFixed(2)})`);
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

  const keyHover = (k: Key) => (ev: React.PointerEvent) => { if (ev.pointerType !== "touch") setHotIfChanged([k]); };
  const on = (k: Key) => hot.includes(k) || undefined;

  return (
    <>
      {/* the left column, centred against the picture: one head, its
          eyebrow and rule fixed and its title alone changing, one for each
          state taking turns, and under it the key, one for each state
          crossfading */}
      <div className="L-fm-side" data-venn={venn || undefined}>
        <div className="L-head L-fm-head">
          {/* TODO(content): the client's words, 13 Oct. One eyebrow for all three */}
          <div>
            <p className="eyebrow L-eyebrow">What makes us different</p>
            <div className="L-fm-titles">
              <h2 className="sec L-fm-title L-fm-h0" aria-hidden={arrived || undefined}>Where <em className="L-hl">others</em> focus</h2>
              <h2 className="sec L-fm-title L-fm-h1" aria-hidden={!arrived || venn || undefined}>Where <em className="L-hl">we</em> focus</h2>
              <h2 className="sec L-fm-title L-fm-in" aria-hidden={!venn || undefined}>We consider all aspects</h2>
            </div>
          </div>
        </div>
        <div className="L-fm-key">
          <dl className="L-fm-legend L-fm-legend-3 L-fm-out" aria-hidden={venn || undefined}>
            {FOCUS.map(({ key: k, name, label, note }) => (
              <div className={`L-fm-item L-fm-item-${k}`} key={k} data-on={on(k)} data-off={((k === "team") !== arrived) || undefined} onPointerEnter={keyHover(k)} onPointerLeave={onLeave}>
                <dt>{name}</dt>
                <dd><strong>{label}.</strong> {note}</dd>
              </div>
            ))}
          </dl>
          <dl className="L-fm-legend L-fm-legend-4 L-fm-in" aria-hidden={!venn || undefined}>
            {KEYS.map((k) => (
              <div className={`L-fm-item L-fm-item-${k}`} key={k} data-on={on(k)} onPointerEnter={keyHover(k)} onPointerLeave={onLeave}>
                <dt>{CAPACITY[k].name}</dt>
                <dd>{CAPACITY[k].note}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="L-circ L-fm" ref={root} data-venn={venn || undefined} data-hot={hot.join(" ") || undefined}>
        <svg
          ref={svgRef}
          className="L-c-svg"
          viewBox={`0 0 ${FRAME.w} ${FRAME.h}`}
          role="img"
          aria-label={venn
            ? "Four overlapping circles: Cognitive, Relational, Emotional and Physical capacity, with the SAMUH star where all four meet"
            : arrived
              ? "Three nested circles: organization, team, individual"
              : "Two nested circles: organization and individual"}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          onClick={(ev) => { const ks = hit(toFrame(ev)); setHotIfChanged(same(ks, m.current.hot) ? [] : ks); }}
        >
          {/* each circle with its fill and labels in one group, so they move together */}
          {KEYS.map((k) => {
            const s = shapes[k];
            const nested = FOCUS.find((f) => f.key === k);
            // the ring: the nested circles' look, fading as the Venn arrives
            const ring = k !== "phys" ? <circle cx={s.cx} cy={s.cy} r={s.r} className={`L-fm-ring L-c-${k} L-fm-out`} /> : null;
            const word = nested ? <text x={s.cx} y={s.cy + (nested.y - START[k].cy)} className={`L-c-t L-c-t-${k} L-fm-out`}>{nested.name}</text> : null;
            return (
              <g key={k} className={`L-fm-g L-fm-g-${k}`} ref={(el) => { gRefs.current[k] = el; }} data-on={on(k)}>
                {/* the hover fill: light, the circle's colour, blending where two circles are both hot */}
                <circle cx={s.cx} cy={s.cy} r={s.r} className="L-fm-fill" />
                {/* the team grows in on the first stretch of the scroll, its word with it */}
                {k === "team" ? <g className="L-fm-arrive">{ring}{word}</g> : <>{ring}{word}</>}
                {/* the Venn: the same stroke, each circle its own colour */}
                <circle cx={s.cx} cy={s.cy} r={s.r} className={`L-fm-venn L-fm-venn-${k} L-fm-in`} />
                <text x={CAPACITY[k].x} y={CAPACITY[k].y} className={`L-c-t L-fm-cap L-fm-cap-${k} L-fm-in`}>{CAPACITY[k].name}</text>
              </g>
            );
          })}
          {/* the star, where all four meet; the loop moves it with the pointer */}
          <g ref={starRef} className="L-fm-in L-fm-mark">
            <image href="/samuh-star.png" x={FRAME.w / 2 - STAR / 2} y={FRAME.h / 2 - STAR / 2} width={STAR} height={STAR} />
          </g>
        </svg>

      </div>
    </>
  );
}
