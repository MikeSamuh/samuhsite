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
// the clock, and the geometry is interpolated. Reduced motion changes
// nothing, since nothing moves on its own.
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

export function FocusMorph() {
  const root = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const [hot, setHot] = useState<Key | null>(null);

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
      stage.style.setProperty("--p", ease(next).toFixed(4));
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

      <div className="L-circ L-fm" ref={root} data-venn={venn || undefined}>
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
          {/* the Venn: the same stroke, each circle its own colour */}
          {KEYS.map((k) => (
            <circle key={`venn-${k}`} cx={shapes[k].cx} cy={shapes[k].cy} r={shapes[k].r} className={`L-fm-venn L-fm-venn-${k} L-fm-in`} data-on={hot === k || undefined} />
          ))}
          {/* the nested labels */}
          {FOCUS.map(({ key: k, name, y }) => (
            <text key={`t-${k}`} x={shapes[k].cx} y={shapes[k].cy + (y - START[k].cy)} className={`L-c-t L-c-t-${k} L-fm-out`}>{name}</text>
          ))}
          {/* the capacity labels */}
          {KEYS.map((k) => (
            <text key={`c-${k}`} x={CAPACITY[k].x} y={CAPACITY[k].y} className={`L-c-t L-fm-cap L-fm-cap-${k} L-fm-in`} data-on={hot === k || undefined}>{CAPACITY[k].name}</text>
          ))}
          {/* the mark, where all four meet */}
          <image href="/samuh-icon.png" x={FRAME.w / 2 - MARK.w / 2} y={FRAME.h / 2 - MARK.h / 2} width={MARK.w} height={MARK.h} className="L-fm-in L-fm-mark" />
        </svg>

        {/* the key under the picture: one for each state, crossfading */}
        <div className="L-fm-key">
          <dl className="L-fm-legend L-fm-legend-3 L-fm-out" aria-hidden={venn || undefined}>
            {FOCUS.map(({ key: k, name, label, note }) => (
              <div className={`L-fm-item L-fm-item-${k}`} key={k}>
                <dt>{name}</dt>
                <dd><strong>{label}.</strong> {note}</dd>
              </div>
            ))}
          </dl>
          <dl className="L-fm-legend L-fm-legend-4 L-fm-in" aria-hidden={!venn || undefined}>
            {KEYS.map((k) => (
              <div
                className={`L-fm-item L-fm-item-${k}`}
                key={k}
                data-on={hot === k || undefined}
                onPointerEnter={(ev) => { if (ev.pointerType !== "touch" && venn) setHot(k); }}
                onPointerLeave={() => setHot(null)}
              >
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
