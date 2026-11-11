"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/site";
import type { HomeContent } from "@/lib/content/defaults";
import { PERSON, Person } from "./people";

const HEAD_TOP = 28; // the sticky head's offset below the nav, as in layout.css

/** Which of a section's items the reader is on: the last one whose top has
 *  passed a line `below` px under the stuck head. One scroll listener,
 *  one frame at a time. Who we work with and the sprint's stages both
 *  read it. */
export function useActiveItem(ref: React.RefObject<HTMLElement | null>, selector: string, below: number) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>(selector));
    if (!items.length) return;
    let raf = 0;
    const tick = () => {
      raf = 0;
      const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 0;
      const line = navH + HEAD_TOP + below;
      let i = 0;
      items.forEach((el, j) => { if (el.getBoundingClientRect().top <= line) i = j; });
      setActive(i);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const ro = new ResizeObserver(kick);
    ro.observe(root);
    kick();
    window.addEventListener("scroll", kick, { passive: true });
    return () => { ro.disconnect(); cancelAnimationFrame(raf); window.removeEventListener("scroll", kick); };
  }, [ref, selector, below]);
  return active;
}

/* ------------------------------------------------------------------ */

// Who we support, on the home ahead of the circles (Wilfred, 11 Nov 2026).
// The section is a tall track and its content pins, as the circles' does;
// the scroll is the clock. On the left the head stays and three lines
// take turns, one for each level, the open word in each shifting through
// the people it stands for. On the right the picture: one person, then
// three, the team, then several teams, each in its ring. At the end the
// people go and the rings fall together into one dot, the dot the
// circles section below grows its first circle from.
//
// The people are the home's own (./people), so nobody is drawn twice.

const FRAME = { w: 640, h: 440 };
const MID = { x: FRAME.w / 2, y: FRAME.h / 2 };
/** the team's row, as the circles' fourth beat sets it out */
const ROW_X = [172, 320, 468];
/** the row's own middle, and the ring that holds it */
const ROW = { cx: 320, cy: (PERSON.headCy - PERSON.headR + PERSON.footY) / 2, r: 240 };
/** a team among several: its size, and where each of the three sits */
const SMALL = 0.36;
const SPOTS = [{ x: 320, y: 112 }, { x: 190, y: 318 }, { x: 450, y: 318 }];
const DOT = 0.016; // the rings at the end, as a share of ROW.r

/** the beats, as shares of the pinned scroll */
const TEAM = { from: 0.2, to: 0.32 };
const ORGS = { from: 0.5, to: 0.64 };
const MERGE = { from: 0.84, to: 0.96 };
const GONE = { from: 0.96, to: 1 };
/** the line on the left changes halfway through each arrival */
const TURN = [(TEAM.from + TEAM.to) / 2, (ORGS.from + ORGS.to) / 2];

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => t * t * (3 - 2 * t);
const over = (p: number, span: { from: number; to: number }) => ease(clamp((p - span.from) / (span.to - span.from)));

/** how far the pinned content has travelled, 0 at the first pinned frame
 *  and 1 at the last. The same reading the circles take */
function usePinned(root: React.RefObject<HTMLElement | null>) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = root.current;
    const track = el?.closest<HTMLElement>(".L-sec");
    const stage = el?.closest<HTMLElement>(".L-wrap");
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
      setP(travel > 0 ? clamp((navH - rect.top - padTop) / travel) : 0);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(read); };
    read();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [root]);
  return p;
}

const SHIFT_MS = 2200; // how long each word holds

/** the open word in a line: it shifts through the list while its line is
 *  the one on show. With reduced motion nothing shifts and the whole list
 *  is set out */
function Shift({ words, on }: { words: string[]; on: boolean }) {
  const [i, setI] = useState(0);
  const [still, setStill] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setStill(true); return; }
    if (!on || words.length < 2) return;
    const id = window.setInterval(() => setI((n) => n + 1), SHIFT_MS);
    return () => window.clearInterval(id);
  }, [on, words.length]);
  if (!words.length) return null;
  return (
    <span className="L-ws-slot L-hl">
      {still ? words.join(", ") : <span className="L-ws-word" key={i}>{words[i % words.length]}</span>}
    </span>
  );
}

/** three people in a row inside their ring, drawn about the row's middle */
function Row({ x, y, s, spread = 1, ring, people }: { x: number; y: number; s: number; /** the two at the sides: 0 behind the middle one, 1 in place */ spread?: number; /** the ring's presence */ ring: number; /** the people's presence */ people: number }) {
  return (
    <g transform={`translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${s.toFixed(4)}) translate(${-ROW.cx} ${-ROW.cy})`}>
      <circle cx={ROW.cx} cy={ROW.cy} r={ROW.r} className="L-ws-ring" style={{ opacity: ring }} />
      <g style={{ opacity: people }}>
        {ROW_X.map((px, j) => (
          <g key={j} style={j === 1 ? undefined : { opacity: spread }}>
            <Person x={lerp(ROW.cx, px, j === 1 ? 1 : spread)} />
          </g>
        ))}
      </g>
    </g>
  );
}

const words = (list: string) => list.split(",").map((w) => w.trim()).filter(Boolean);

const PICTURE = ["One person", "Three people: a team", "Several teams, each in its ring"];

export function Who({ c }: { c: HomeContent["who"] }) {
  const root = useRef<HTMLDivElement>(null);
  const p = usePinned(root);
  const team = over(p, TEAM);
  const orgs = over(p, ORGS);
  const merge = over(p, MERGE);
  const gone = over(p, GONE);
  const active = p < TURN[0] ? 0 : p < TURN[1] ? 1 : 2;
  // the first team: the row at full size in the middle, then small at the
  // top; the other two come out from the middle as it goes. At the end
  // all three fall back to the middle and down to a dot
  const size = lerp(lerp(1, SMALL, orgs), DOT, merge);
  const at = (k: number) => {
    const out = k === 0 ? { x: MID.x, y: lerp(MID.y, SPOTS[0].y, orgs) } : { x: lerp(MID.x, SPOTS[k].x, orgs), y: lerp(MID.y, SPOTS[k].y, orgs) };
    return { x: lerp(out.x, MID.x, merge), y: lerp(out.y, MID.y, merge) };
  };
  const people = clamp(1 - merge * 2.5);
  return (
    <>
      <div className="L-ws-side">
        <div className="L-head L-ws-head">
          <div>
            <p className="eyebrow L-eyebrow">{c.kicker}</p>
            <h2 className="sec">{c.title}</h2>
          </div>
        </div>
        <div className="L-ws-levels">
          {c.items.map((it, i) => (
            <div className="L-ws-level" key={it.name} data-on={i === active ? "" : undefined} aria-hidden={i !== active || undefined}>
              <span className="L-cap">{it.name}</span>
              <p className="L-ws-line">{it.before} <Shift words={words(it.words)} on={i === active} /> {it.after}</p>
              <Link className="inline-link" href={`${ROUTES.solutions}#${it.door}`} tabIndex={i === active ? undefined : -1}>{it.link} <span className="arrow">&rarr;</span></Link>
            </div>
          ))}
        </div>
        {c.coaches ? <p className="L-ws-coaches">{c.coaches} <Link className="inline-link" href={ROUTES.contact}>{c.coachesLink}</Link></p> : null}
      </div>
      <div className="L-ws-pic" ref={root}>
        <svg className="L-c-svg" viewBox={`0 0 ${FRAME.w} ${FRAME.h}`} role="img" aria-label={PICTURE[active]} style={{ opacity: 1 - gone }}>
          {[1, 2].map((k) => (
            <g key={k} style={{ opacity: orgs }}><Row {...at(k)} s={size} ring={1} people={people} /></g>
          ))}
          <Row {...at(0)} s={size} spread={team} ring={orgs} people={people} />
        </svg>
      </div>
    </>
  );
}
