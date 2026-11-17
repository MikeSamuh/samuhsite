"use client";

import { useEffect, useRef, useState } from "react";
import { DEFAULTS, type HomeContent, type StartContent } from "@/lib/content/defaults";
import { StartEmail } from "@/components/start/StartEmail";
import { mark } from "@/lib/content/shared";
import { MHQ_BANDS, MHQ_SCALE, mhqBand } from "@/lib/tokens";
import { TAX_STEPS, days as fmtDays, money } from "@/lib/performance-tax";

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
// The third move, the four-set Venn of capacities, was cut by the client on
// 2 November 2026; its geometry stays only so the shapes still interpolate.
// Between the circles and that beat a call-out holds the stage alone
// (Wilfred, 16 Nov 2026): how Samuh finds the tax, and with whom.
// In its place (Wilfred, 6 Nov 2026) a fourth beat in steps (three then,
// six since 17 Nov 2026, one for each band, Distressed first): the
// circles give way to three hollow people, the team, and water rises
// through all three as one level, a struggling team environment, then a
// managing one, then thriving, when the team is full. Beside them the
// capacity meter from the TeamQ section steps up through the same three
// MHQ windows, and under it a readout gives each step's days lost and the
// performance tax per person per year, from the client's sheet
// (src/lib/performance-tax.ts). The last step says the tax is gone, and
// the CTA to find your own follows under the people. Scrolling back
// reverses it. No animation library: the scroll position is the clock,
// and the geometry is interpolated; only the water's surface runs on its
// own time.
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
/** three beats on the pinned scroll (Wilfred, 2 Nov 2026): the enterprise
 *  alone, then the individual appears at its centre, then the team arrives
 *  between them */
/** the track grew when the steps went from three to six (17 Nov 2026):
 *  the beats keep the shares they were tuned at and TRACK, the old travel
 *  over the new (layout.css, the section's min-height), puts them on the
 *  longer track, so each still takes the scroll it took */
const TRACK = 0.647;
const span = (from: number, to: number) => ({ from: from * TRACK, to: to * TRACK });
const INDIVIDUAL = span(0.03, 0.105);
const ARRIVE = span(0.15, 0.2325);
/** the call-out between the circles and the people (Wilfred, 16 Nov 2026):
 *  the circles and the side column go (AWAY), one statement holds the
 *  stage alone (SAY in, SAID out), then the people come where it was */
const AWAY = span(0.27, 0.3075);
const SAY = span(0.2925, 0.33);
const SAID = span(0.3825, 0.4125);
/** the fourth beat (6 Nov 2026): the circles cross to three people (PEOPLE),
 *  then the steps, each the water rising to the next level and the
 *  meter and readout moving with it; the CTA last. The Venn never comes */
const PEOPLE = span(0.39, 0.465);
/** each step is a short move and a long hold, most of a screen of scroll,
 *  so a step is not scrolled past by accident (Wilfred, 16 Nov 2026) */
const STEP = { first: 0.49, move: 0.05, every: 0.14 };
const STEPS = TAX_STEPS.map((_, j) => span(STEP.first + j * STEP.every, STEP.first + j * STEP.every + STEP.move));
/** the ask comes in, then holds the stage alone for a screen of scroll,
 *  a section of its own (Wilfred, 17 Nov 2026): the track's last tenth */
const CTA = span(STEP.first + TAX_STEPS.length * STEP.every + 0.02, STEP.first + TAX_STEPS.length * STEP.every + 0.07);

/** the three people, hollow, in a row where the team circle was. One
 *  water level fills all three, held to their insides; the level is the step's place on the MHQ
 *  scale, and the last step fills them. The surface is two slow waves,
 *  calming as the team fills */
// the drawing is the client's own (17 Nov 2026), placed and never redrawn:
// two masks cut from it by scripts/figures/team.py, its lines and the
// inside of each figure, 1280 by 772. The masks say where; the colours
// are the tokens'. Solutions keeps the plain figure in ./people
const TEAM_H = 250;
const TEAM_W = (TEAM_H * 1280) / 772;
const TEAM = { x: FRAME.w / 2 - TEAM_W / 2, y: 56, w: TEAM_W, h: TEAM_H, lines: "/icons/home-team-lines.png", fill: "/icons/home-team-fill.png" };
const WATER = { x0: 100, x1: 540, top: TEAM.y, bottom: TEAM.y + TEAM.h, amp: 4, step: 16 };
/** how full the team is at each step: the window's middle on the scale, the last step full */
const LEVELS = TAX_STEPS.map((t, j) => (j === TAX_STEPS.length - 1 ? 1 : ((t.from + t.to) / 2 - MHQ_SCALE.min) / (MHQ_SCALE.max - MHQ_SCALE.min)));
/** where the needle points at each step: the window's middle, inside its band */
const SCORES = TAX_STEPS.map((t) => (t.from + t.to) / 2);
/** where each step's needle sits along the meter's gradient, 0 at the pink
 *  end and 1 at the cyan: the gradient runs across the arc, left to right.
 *  The step's figures take that colour (Wilfred, 16 Nov 2026) */
const TINTS = SCORES.map((sc) => (1 - Math.cos(((sc - MHQ_SCALE.min) / (MHQ_SCALE.max - MHQ_SCALE.min)) * Math.PI)) / 2);
/** the water's outline at a level, its surface at time t (seconds) */
function waterPath(level: number, t: number): string {
  const surface = WATER.bottom - (WATER.bottom - WATER.top + 6) * level;
  const amp = WATER.amp * Math.min(1, (1 - level) * 6);
  let d = `M ${WATER.x0} ${WATER.bottom}`;
  for (let x = WATER.x0; x <= WATER.x1; x += WATER.step) {
    const y = surface + amp * Math.sin(x / 38 + t * 1.4) + amp * 0.6 * Math.sin(x / 21 - t * 2.1);
    d += ` L ${x} ${y.toFixed(2)}`;
  }
  return `${d} L ${WATER.x1} ${WATER.bottom} Z`;
}

/** the meter: the TeamQ section's half circle, from -100 on the left to
 *  200 on the right, the bands along it and a needle that steps through
 *  the steps' windows, resting in the middle of each */
const GAUGE = { cx: 100, cy: 100, r: 78, gap: 1.6 };
const gAngle = (score: number) => 180 - ((score - MHQ_SCALE.min) / (MHQ_SCALE.max - MHQ_SCALE.min)) * 180;
const gPoint = (deg: number) => {
  const rad = (deg * Math.PI) / 180;
  return { x: GAUGE.cx + GAUGE.r * Math.cos(rad), y: GAUGE.cy - GAUGE.r * Math.sin(rad) };
};
const gArc = (from: number, to: number) => {
  const a = gPoint(gAngle(from) - GAUGE.gap);
  const b = gPoint(gAngle(to) + GAUGE.gap);
  return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${GAUGE.r} ${GAUGE.r} 0 0 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
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

/** the supplied star, square, set small where the four circles meet. It
 *  follows the pointer on its own short tether and never leaves the lens:
 *  its centre is kept inside every circle by its own half-size */
const STAR_TETHER = 14;
const STAR_LAG = 1.2;

/** TODO(content): the nested circles' key. The team at the top, since it
 *  is the subject; its entry opens up as its circle arrives. The team line
 *  and the two callouts the Circles diagram shows on hover, here always
 *  shown. */
const FOCUS_GEOMETRY: { key: Exclude<Key, "phys">; y: number }[] = [
  // the key reads top to bottom in the order the circles arrive: the
  // enterprise, the individual, the team (Wilfred, 2 Nov 2026)
  { key: "org", y: 362 },
  { key: "ind", y: 126 },
  { key: "team", y: 246 },
];

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** smoothstep: eases both ends so the circles settle rather than stop */
const ease = (t: number) => t * t * (3 - 2 * t);
/** where a stretch of the track has got to, eased, 0 before it and 1 after */
const over = (p: number, span: { from: number; to: number }) => ease(clamp((p - span.from) / (span.to - span.from)));
/** how full the team is, from the steps' progress: each step lifts
 *  the water from the last level to its own */
const levelAt = (steps: number[]) => steps.reduce((acc, t, j) => lerp(acc, LEVELS[j], t), 0);

/** the circles at this point of the travel: g is the growth from the dot,
 *  i the individual's arrival, q the team's arrival (the individual rises
 *  with it), e the Venn */
const shapesAt = (e: number, q: number, g: number, i: number): Record<Key, Shape> =>
  Object.fromEntries(
    KEYS.map((k) => {
      // the individual glides up from below the frame, crosses the
      // enterprise's rim and settles at its centre (i); when the team comes
      // it rises to the top (q). The team breathes out from the individual:
      // its ring starts on the individual's own and grows up and out
      const indR = START.ind.r * g;
      const indCy = lerp(lerp(FRAME.h + indR + 24, IND_ALONE.cy, i), START.ind.cy, q);
      const r0 = k === "team" ? lerp(START.ind.r, START.team.r, q) * g : k === "ind" ? indR : START[k].r * g;
      const cy0 = k === "ind" ? indCy : k === "team" ? lerp(IND_ALONE.cy, START.team.cy, q) : START[k].cy;
      return [k, { cx: lerp(START[k].cx, END[k].cx, e), cy: lerp(cy0, END[k].cy, e), r: lerp(r0, END[k].r, e) }];
    }),
  ) as Record<Key, Shape>;

const same = (a: Key[], b: Key[]) => a.length === b.length && a.every((k, i) => k === b[i]);

export function FocusMorph({ words = DEFAULTS.home.focus, cta }: { /** the heads and the key, from the admin */ words?: HomeContent["focus"]; /** the ask at the end of the beat: the tool's title and button */ cta?: { title: string; label: string; /** the email box's words: the button opens it in place */ box: StartContent["form"] } }) {
  // the words sit on the geometry: levels in the order enterprise,
  // individual, team
  const FOCUS = FOCUS_GEOMETRY.map((f, i) => ({ ...f, name: words.levels[i]?.name ?? "", label: words.levels[i]?.label ?? "", note: words.levels[i]?.note ?? "" }));
  const root = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const gRefs = useRef<Partial<Record<Key, SVGGElement | null>>>({});
  const starRef = useRef<SVGGElement>(null);
  const [p, setP] = useState(0);
  const [g, setG] = useState(0);
  const [hot, setHot] = useState<Key[]>([]);
  // the ask: the button opens the email box in place, as on Solutions (6 Nov 2026)
  const [asked, setAsked] = useState(false);
  // everything the motion loop touches lives outside React state
  const m = useRef({
    pointer: null as Pt | null, // frame units, from the centre
    target: { x: 0, y: 0 } as Pt,
    cur: Object.fromEntries(KEYS.map((k) => [k, { x: 0, y: 0 }])) as Record<Key, Pt>,
    off: Object.fromEntries(KEYS.map((k) => [k, { x: 0, y: 0 }])) as Record<Key, Pt>, // where each circle is drawn, tether plus float
    star: { x: 0, y: 0 } as Pt,
    e: 0,
    away: 0, // the circles gone, for the call-out
    q: 0,
    i: 0,
    g: 0,
    level: 0, // how full the team is, for the water
    hot: [] as Key[],
  });
  const waterRef = useRef<SVGPathElement>(null);

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
      m.current.i = over(next, INDIVIDUAL);
      m.current.q = over(next, ARRIVE);
      m.current.e = over(next, PEOPLE);
      m.current.away = over(next, AWAY);
      m.current.level = levelAt(STEPS.map((sp) => over(next, sp)));
      stage.style.setProperty("--h", over(enter, HEAD).toFixed(4));
      stage.style.setProperty("--c", over(next, CTA).toFixed(4));
      // the ask takes the whole stage (Wilfred, 17 Nov 2026): how far the
      // picture is from the stage's middle, by layout alone, so the CSS
      // can carry it there as the head, the meter and the readout go
      stage.style.setProperty("--fm-dx", `${(stage.clientWidth / 2 - (el.offsetLeft + el.offsetWidth / 2)).toFixed(1)}px`);
      stage.style.setProperty("--fm-dy", `${(stage.clientHeight / 2 - (el.offsetTop + el.offsetHeight / 2)).toFixed(1)}px`);
      stage.style.setProperty("--g", m.current.g.toFixed(4));
      stage.style.setProperty("--i", m.current.i.toFixed(4));
      stage.style.setProperty("--q", m.current.q.toFixed(4));
      stage.style.setProperty("--p", m.current.e.toFixed(4));
      stage.style.setProperty("--a", m.current.away.toFixed(4));
      stage.style.setProperty("--k", (over(next, SAY) * (1 - over(next, SAID))).toFixed(4));
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
      stage.style.removeProperty("--i");
      stage.style.removeProperty("--q");
      stage.style.removeProperty("--p");
      stage.style.removeProperty("--a");
      stage.style.removeProperty("--k");
      stage.style.removeProperty("--c");
      stage.style.removeProperty("--fm-dx");
      stage.style.removeProperty("--fm-dy");
    };
  }, []);

  const i = over(p, INDIVIDUAL);
  const q = over(p, ARRIVE);
  const e = over(p, PEOPLE);
  const steps = STEPS.map((sp) => over(p, sp));
  const joined = i > 0.5;
  const arrived = q > 0.5;
  const people = e > 0.5;
  // the call-out: the circles are away, and the statement is up
  const away = over(p, AWAY) > 0.5;
  const saying = over(p, SAY) > 0.5 && over(p, SAID) < 0.5;
  // the circles hold their nested shape while they fade (no Venn)
  const shapes = shapesAt(0, q, g, i);
  const level = levelAt(steps);
  // the needle: before the first step it waits a little below the first
  // window (the foot of the scale, now the first is Distressed), then
  // steps through them; the band under it lights
  const meter = steps.reduce((acc, t, j) => lerp(acc, SCORES[j], t), Math.max(MHQ_SCALE.min, SCORES[0] - 30));
  const meterBand = mhqBand(meter);
  const meterTurn = 180 - gAngle(meter);
  /** each readout's presence: in over the second half of its step's move,
   *  out over the first half of the next, so two are never on screen
   *  together (Wilfred, 17 Nov 2026: they crossed and read as a muddle) */
  const readouts = steps.map((t, j) => clamp(t * 2 - 1) * (1 - clamp((steps[j + 1] ?? 0) * 2)));
  const stepNow = steps.reduce((acc, t) => (t > 0.5 ? acc + 1 : acc), 0);
  // the ask has the stage: the head, the meter and the readout are gone
  const asking = over(p, CTA) > 0.5;

  /** which circles the pointer is in, against the live positions. Nested:
   *  the innermost only, so the individual wins over the team, the team
   *  over the organization, and the team not before it has arrived. Venn:
   *  every one containing it, so a lens lights both of its circles */
  const hit = (pt: Pt | null): Key[] => {
    if (!pt) return [];
    const s = m.current;
    if (s.e > 0.5 || s.away > 0.5) return [];
    const live = shapesAt(0, s.q, s.g, s.i);
    const x = pt.x + FRAME.w / 2;
    const y = pt.y + FRAME.h / 2;
    const inside = (k: Key, pad = 0) => {
      const c = live[k];
      return Math.hypot(x - (c.cx + s.off[k].x), y - (c.cy + s.off[k].y)) <= c.r + pad;
    };
    for (const k of ["ind", "team", "org"] as const) {
      if (k === "team" && s.q < 0.5) continue;
      if (k === "ind" && s.i < 0.5) continue;
      if (inside(k, 4)) return [k];
    }
    return [];
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
        star.setAttribute("transform", `translate(${st.x.toFixed(2)} ${st.y.toFixed(2)})`);
      }
      // the water: its surface moves on its own clock, its level on the scroll's
      const water = waterRef.current;
      if (water && s.e > 0.02) water.setAttribute("d", waterPath(s.level, t));
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

  // the meter's bands are a way through the steps (Wilfred, 16 Nov 2026):
  // a band takes the page to the step nearest it on the scale, by
  // scrolling, since the scroll is the clock. Every band has its own
  // step (src/lib/performance-tax.ts)
  const stepOf = (b: { min: number; max: number }) => {
    const mid = (b.min + b.max) / 2;
    return SCORES.reduce((best, sc, j) => (Math.abs(sc - mid) < Math.abs(SCORES[best] - mid) ? j : best), 0);
  };
  const goStep = (j: number) => {
    const track = root.current?.closest<HTMLElement>(".L-sec");
    const stage = root.current?.closest<HTMLElement>(".L-wrap");
    if (!track || !stage) return;
    const rect = track.getBoundingClientRect();
    const cs = getComputedStyle(track);
    const padTop = parseFloat(cs.paddingTop) || 0;
    const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 0;
    const travel = rect.height - padTop - (parseFloat(cs.paddingBottom) || 0) - stage.offsetHeight;
    // the step at rest: after its own move, before the next begins
    const at = (STEPS[j].to + (STEPS[j + 1]?.from ?? CTA.from)) / 2;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: window.scrollY + rect.top + padTop - navH + travel * at, behavior: still ? "auto" : "smooth" });
  };

  const keyHover = (k: Key) => (ev: React.PointerEvent) => { if (ev.pointerType !== "touch") setHotIfChanged([k]); };
  const on = (k: Key) => hot.includes(k) || undefined;

  return (
    <>
      {/* the left column, centred against the picture: one head, its
          eyebrow and rule fixed and its title alone changing, one for each
          state taking turns, and under it the key, one for each state
          crossfading */}
      <div className="L-fm-side" data-people={people || undefined}>
        <div className="L-head L-fm-head">
          {/* TODO(content): the client's words, 13 Oct. One eyebrow for all three */}
          <div>
            <p className="eyebrow L-eyebrow">{words.eyebrow}</p>
            <div className="L-fm-titles">
              <h2 className="sec L-fm-title L-fm-h0" aria-hidden={arrived || undefined}>{mark(words.titleOthers, "L-hl")}</h2>
              <h2 className="sec L-fm-title L-fm-h1" aria-hidden={!arrived || away || undefined}>{mark(words.titleWe, "L-hl")}</h2>
              <h2 className="sec L-fm-title L-fm-h2 L-fm-in" aria-hidden={!people || asking || undefined}>{mark(words.titleHow ?? "", "L-hl")}</h2>
            </div>
          </div>
        </div>
        {/* two keys in one cell: the enterprise and the individual stack
            as they arrive, then give way to the team alone on the third
            beat (Wilfred, 2 Nov 2026). Neither changes height, so the
            column never moves */}
        <div className="L-fm-key">
          {(["others", "team"] as const).map((which) => (
            <dl className={`L-fm-legend L-fm-legend-3 L-fm-legend-${which} L-fm-out`} key={which} aria-hidden={(which === "team" ? !arrived || away : arrived) || undefined}>
              {FOCUS.filter(({ key: k }) => (which === "team") === (k === "team")).map(({ key: k, name, label, note }) => (
                <div className={`L-fm-item L-fm-item-${k}`} key={k} data-on={on(k)} data-off={(k === "team" ? !arrived : k === "ind" ? !joined || arrived : arrived) || undefined} onPointerEnter={keyHover(k)} onPointerLeave={onLeave}>
                  <dt>{name}</dt>
                  <dd><strong>{label}.</strong> {note}</dd>
                </div>
              ))}
            </dl>
          ))}
          {/* the fourth beat's left side: the meter from the TeamQ section
              stepping through the windows. The readout for the
              step (the window, the days, the money) is under the picture,
              across the section; they share one cell and take turns */}
          <div className="L-fm-legend L-fm-meter L-fm-in" aria-hidden={!people || asking || undefined}>
            <span className="L-cap">{words.howLabel}</span>
            <svg className="capacity-gauge L-fm-gauge" viewBox="0 0 200 116" role="group" aria-label={`A meter at ${meterBand.name}, stepping from ${mhqBand(SCORES[0]).name} to ${mhqBand(SCORES[SCORES.length - 1]).name}`}>
              {/* the brand's two colours along the arc (Wilfred, 6 Nov 2026): pink
                  at the left end, cyan at the right, blended between */}
              <defs>
                <linearGradient id="fm-gauge-grad" gradientUnits="userSpaceOnUse" x1={GAUGE.cx - GAUGE.r} y1={0} x2={GAUGE.cx + GAUGE.r} y2={0}>
                  <stop offset="0" style={{ stopColor: "var(--accent)" }} />
                  <stop offset="1" style={{ stopColor: "var(--accent-2)" }} />
                </linearGradient>
              </defs>
              {[...MHQ_BANDS].reverse().map((b) => (
                <path
                  key={b.id}
                  d={gArc(b.min, b.max)}
                  className="gauge-band L-fm-band"
                  data-on={b.id === meterBand.id || undefined}
                  role="button"
                  tabIndex={people && !asking ? 0 : -1}
                  aria-label={`${b.name}: show a ${(words.steps?.[stepOf(b)]?.label ?? "").replace(/^A /, "")}`}
                  onClick={() => goStep(stepOf(b))}
                  onKeyDown={(ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); goStep(stepOf(b)); } }}
                />
              ))}
              <line className="gauge-needle L-fm-needle" x1={GAUGE.cx - GAUGE.r + 18} y1={GAUGE.cy} x2={GAUGE.cx - GAUGE.r - 14} y2={GAUGE.cy} style={{ transform: `rotate(${meterTurn.toFixed(2)}deg)` }} />
              <text className="L-fm-gauge-word" x={GAUGE.cx} y={GAUGE.cy - 4}>{meterBand.name}</text>
            </svg>
            <p className="L-fm-meter-line">{words.source}</p>
          </div>
        </div>
      </div>

      {/* the call-out, alone on the stage between the circles and the people */}
      {words.callout ? (
        <div className="L-fm-callout" aria-hidden={!saying || undefined}>
          <p className="L-fm-callout-text">{mark(words.callout, "L-hl", "L-hl-2")}</p>
        </div>
      ) : null}

      <div className="L-circ L-fm" ref={root} data-people={people || undefined} data-hot={hot.join(" ") || undefined}>
        <svg
          ref={svgRef}
          className="L-c-svg"
          viewBox={`0 0 ${FRAME.w} ${FRAME.h}`}
          role="img"
          aria-label={saying ? "" : people ? "Three people, filling with water as the capacity meter steps up" : arrived ? "Three nested circles: enterprise, team, individual" : joined ? "Two nested circles: enterprise and individual" : "One circle: the enterprise"}
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
                {/* the individual grows in on the first beat, the team on the second, each word with its ring */}
                {k === "team" ? <g className="L-fm-arrive">{ring}{word}</g> : k === "ind" ? <g className="L-fm-arrive-ind">{ring}{word}</g> : <>{ring}{word}</>}
              </g>
            );
          })}

          {/* the fourth beat: the client's three people where the team was,
              and one water level through all three, held to their insides */}
          <g className="L-fm-people L-fm-in" aria-hidden={!people || undefined}>
            <defs>
              <mask id="fm-team-fill" maskUnits="userSpaceOnUse" x={TEAM.x} y={TEAM.y} width={TEAM.w} height={TEAM.h}>
                <image href={TEAM.fill} x={TEAM.x} y={TEAM.y} width={TEAM.w} height={TEAM.h} />
              </mask>
              <mask id="fm-team-lines" maskUnits="userSpaceOnUse" x={TEAM.x} y={TEAM.y} width={TEAM.w} height={TEAM.h}>
                <image href={TEAM.lines} x={TEAM.x} y={TEAM.y} width={TEAM.w} height={TEAM.h} />
              </mask>
            </defs>
            {/* a still surface from the scroll; the motion loop moves it */}
            <path ref={waterRef} className="L-fm-water" d={waterPath(level, 0)} mask="url(#fm-team-fill)" />
            <rect className="L-fm-team-lines" x={TEAM.x} y={TEAM.y} width={TEAM.w} height={TEAM.h} mask="url(#fm-team-lines)" />
          </g>
        </svg>

        {/* the end of the beat: the team is full, and the ask follows
            (Wilfred, 6 Nov 2026: the CTA moved up here from the foot of the page) */}
        {cta ? (
          <div className="L-fm-cta" aria-hidden={stepNow < TAX_STEPS.length || undefined}>
            <p className="L-fm-cta-title">{mark(cta.title, "L-hl")}</p>
            {asked ? (
              <div className="L-fm-cta-box" id="fm-cta-box"><StartEmail c={cta.box} intent="leadq" talk={false} /></div>
            ) : (
              <button type="button" className="btn" onClick={() => setAsked(true)} aria-expanded={false} aria-controls="fm-cta-box" tabIndex={stepNow < TAX_STEPS.length ? -1 : undefined}>{cta.label} <span className="arrow">&rarr;</span></button>
            )}
          </div>
        ) : null}
      </div>
      {/* the step's readout, out of the side column and across the whole
          section under the picture, larger (Wilfred, 11 Nov 2026) */}
      <div className="L-fm-readouts L-fm-in" aria-live="polite" aria-hidden={!people || asking || undefined}>
        {TAX_STEPS.map((t, j) => {
          const last = j === TAX_STEPS.length - 1;
          const w = words.steps?.[j];
          return (
            <div className="L-fm-readout" key={t.row} style={{ "--r": readouts[j].toFixed(3), "--at": `${(TINTS[j] * 100).toFixed(1)}%` } as React.CSSProperties} aria-hidden={stepNow !== j + 1 || asking || undefined}>
              <span className="L-cap">{w?.label} · MHQ {t.window}</span>
              {last ? (
                // the residual figures under it went on 17 Nov 2026 (Wilfred)
                <p className="L-fm-readout-big L-fm-readout-wide">{w?.line}</p>
              ) : (
                <>
                  <p className="L-fm-readout-big"><strong>{fmtDays(t.days)} days</strong> {words.daysLine}</p>
                  <p className="L-fm-readout-big"><strong>{money(t.perPerson)}</strong> {words.moneyLine}</p>
                  <p className="L-fm-readout-small">{w?.line}</p>
                </>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
