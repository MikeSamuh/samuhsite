"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/site";
import type { HomeContent } from "@/lib/content/defaults";
import { mark } from "@/lib/content/shared";
import { PERSON, Person, PersonDefs } from "./people";

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

// Who we work with, on the home ahead of the circles (Wilfred, 11 Nov 2026).
// The section is a tall track and its content pins, as the circles' does;
// the scroll is the picture's clock. Two beats since 16 Nov 2026: leaders,
// one person, then teams and organizations, the whole org, several teams
// each in its ring. On the left the head stays and its title is the beat's
// own line, the two taking turns under the one rule. At the end the
// people go and the rings come together as one circle, the first circle
// of the circles section below. That section is pulled up under this one
// (layout.css) so it is already pinned behind, unseen; its circle sits
// exactly where this one lands, and it fades in over it, head and key
// with it, before this picture lets go. One picture becomes the next and
// nothing slides.
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
/** the circle the rings become: the circles section's first, in its frame */
const ONE = { cx: 320, cy: 220, r: 190 };
/** the circles section is pinned behind for this share of a screen before
 *  this one lets go: layout.css pulls it up by as much. Its own first
 *  beat starts later than that, so it is still on its first frame */
const BEHIND = 0.2;
/** the beats, as shares of the pinned scroll */
const ORGS = { from: 0.3, to: 0.48 };
/** the one person becomes a team of three in the first half of that */
const TEAM = { from: ORGS.from, to: (ORGS.from + ORGS.to) / 2 };
const MERGE = { from: 0.72, to: 0.88 };
/** the handover, as shares of the stretch the next section is pinned
 *  behind: this head's words go, the next section comes in, then this
 *  picture and this rule go, so neither the circle nor the accent rule
 *  dims between them (Wilfred, 11 Nov 2026: the column never goes blank,
 *  the rule stays put and the words under it change) */
const WORDS_OUT = { from: 0, to: 0.3 };
const NEXT_IN = { from: 0.3, to: 0.65 };
const GONE = { from: 0.65, to: 0.98 };
/** the title changes halfway through the org's arrival */
const TURN = (ORGS.from + ORGS.to) / 2;

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => t * t * (3 - 2 * t);
const over = (p: number, span: { from: number; to: number }) => ease(clamp((p - span.from) / (span.to - span.from)));

/** an element's top inside the stage, by layout alone: transforms on the
 *  way up are not counted */
function topIn(el: HTMLElement, stage: HTMLElement) {
  let y = 0;
  for (let n: HTMLElement | null = el; n && n !== stage; n = n.offsetParent as HTMLElement | null) y += n.offsetTop;
  return y;
}

/** how far the pinned content has travelled, 0 at the first pinned frame
 *  and 1 at the last. The same reading the circles take */
function usePinned(root: React.RefObject<HTMLElement | null>) {
  const [p, setP] = useState(0);
  // the handover to the circles section, when it is the next one: how far
  // through it is, and where that section's picture sits against this one
  const [hand, setHand] = useState<{ t: number; dy: number; k: number } | null>(null);
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
      if (prev) {
        // the entry's own height, for where it stops
        const entry = prev.querySelector<HTMLElement>(":scope > .L-wrap");
        if (entry && track.parentElement) track.parentElement.style.setProperty("--entry-h", `${entry.offsetHeight}px`);
        // the words fade up with the scroll, as every section's do
        // (useScrollReveal in sections.tsx): from their own top at the
        // foot of the view to a third of the way up it, which they have
        // passed wherever they pin
        const vh = window.innerHeight;
        const sideTop = side ? side.getBoundingClientRect().top : rect.top;
        track.style.setProperty("--who-in", clamp((vh - sideTop) / (vh * 0.35)).toFixed(3));
      }
      if (!next || !nextStage || !nextPic || !pic) return;
      // this head's rule sits where the next head's does, so the rule holds
      // still through the handover and the head is as high as the heads
      // after it. Only with the columns side by side
      const cols = getComputedStyle(stage).gridTemplateColumns.split(" ").length;
      if (rule && nextRule && cols > 1) stage.style.setProperty("--who-up", `${(topIn(nextRule, nextStage) - topIn(rule, stage)).toFixed(1)}px`);
      else stage.style.removeProperty("--who-up");
      // how long the next section has been pinned, against the stretch it
      // is pinned behind this one
      const nr = next.getBoundingClientRect();
      const t = clamp((navH - nr.top - (parseFloat(getComputedStyle(next).paddingTop) || 0)) / (BEHIND * window.innerHeight));
      next.style.setProperty("--who-x", over(t, NEXT_IN).toFixed(4));
      next.toggleAttribute("data-who-wait", t < NEXT_IN.to);
      // both stages pin at the same line, so the pictures' places in their
      // stages say where one sits against the other, in this frame's units
      const a = pic.getBoundingClientRect();
      const b = nextPic.getBoundingClientRect();
      const unit = FRAME.w / (a.width || 1);
      const dy = ((b.top - nextStage.getBoundingClientRect().top) - (a.top - stage.getBoundingClientRect().top)) * unit;
      setHand({ t, dy, k: b.width / (a.width || 1) });
    };
    // the dictionary entry, when this follows it
    const before = track.previousElementSibling as HTMLElement | null;
    const prev = before?.matches(".L-s-meaning") ? before : null;
    // the circles section, when it follows this one
    const sib = track.nextElementSibling as HTMLElement | null;
    const next = sib?.matches('.L-s-circles[data-v="morph"]') ? sib : null;
    const nextStage = next?.querySelector<HTMLElement>(".L-wrap");
    const nextPic = next?.querySelector<SVGSVGElement>(".L-c-svg");
    const pic = el?.querySelector<SVGSVGElement>(".L-c-svg");
    const rule = stage.querySelector<HTMLElement>(".L-ws-head h2.sec");
    const side = stage.querySelector<HTMLElement>(".L-ws-side");
    const nextRule = next?.querySelector<HTMLElement>(".L-fm-titles");
    const on = () => { if (!raf) raf = requestAnimationFrame(read); };
    read();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
      stage.style.removeProperty("--who-up");
      track.parentElement?.style.removeProperty("--entry-h");
      track.style.removeProperty("--who-in");
      next?.style.removeProperty("--who-x");
      next?.removeAttribute("data-who-wait");
    };
  }, [root]);
  return { p, hand };
}

/** three people in a row inside their ring, drawn about the row's middle */
function Row({ x, y, s, spread = 1, ring, one = 0, people }: { x: number; y: number; s: number; /** the two at the sides: 0 behind the middle one, 1 in place */ spread?: number; /** the ring's presence */ ring: number; /** the ring drawn as the circles section's own circle: 0 not at all, 1 wholly */ one?: number; /** the people's presence */ people: number }) {
  return (
    <g transform={`translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${s.toFixed(4)}) translate(${-ROW.cx} ${-ROW.cy})`}>
      <circle cx={ROW.cx} cy={ROW.cy} r={ROW.r} className="L-ws-ring" style={{ opacity: ring * (1 - one) }} />
      {one > 0 ? <circle cx={ROW.cx} cy={ROW.cy} r={ROW.r} className="L-c-org" style={{ opacity: one }} /> : null}
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

const PICTURE = ["One person", "An organization: several teams, each in its ring"];

export function Who({ c }: { c: HomeContent["who"] }) {
  const root = useRef<HTMLDivElement>(null);
  const { p, hand } = usePinned(root);
  const team = over(p, TEAM);
  const orgs = over(p, ORGS);
  const merge = over(p, MERGE);
  // with the circles section behind, this picture goes once that one is
  // in; alone, it stays
  const gone = hand ? over(hand.t, GONE) : 0;
  const active = p < TURN ? 0 : 1;
  // the first team: the row at full size in the middle, then small at the
  // top; the other two come out from the middle as it goes. At the end
  // all three come together as one circle, the size and the place of the
  // circles section's first (hand: where that is against this frame)
  const end = { x: ONE.cx, y: ONE.cy * (hand?.k ?? 1) + (hand?.dy ?? 0), s: (ONE.r / ROW.r) * (hand?.k ?? 1) };
  const size = lerp(lerp(1, SMALL, orgs), end.s, merge);
  const at = (k: number) => {
    const out = k === 0 ? { x: MID.x, y: lerp(MID.y, SPOTS[0].y, orgs) } : { x: lerp(MID.x, SPOTS[k].x, orgs), y: lerp(MID.y, SPOTS[k].y, orgs) };
    return { x: lerp(out.x, end.x, merge), y: lerp(out.y, end.y, merge) };
  };
  const people = clamp(1 - merge * 2.5);
  // the head's words go as the next section's come in under the same rule
  const said = hand ? 1 - over(hand.t, WORDS_OUT) : 1;
  return (
    <>
      <div className="L-ws-side" aria-hidden={said < 0.5 || undefined}>
        <div className="L-head L-ws-head">
          <div>
            <p className="eyebrow L-eyebrow" style={{ opacity: said }}>{c.kicker}</p>
            {/* one title for each beat, in one cell; the one the picture is
                on shows. The rule over them is the h2's, and outlasts its words */}
            <h2 className="sec" style={{ opacity: 1 - gone }}>
              <span className="L-ws-titles" style={{ opacity: said }}>
                {c.items.slice(0, 2).map((it, i) => (
                  <span className="L-ws-title" key={i} data-on={i === active ? "" : undefined} aria-hidden={i !== active || undefined}>{(it.title ?? "").split("\n").map((line, k) => <span className="L-ws-title-line" key={k}>{mark(line, "L-hl", "L-hl-2")}</span>)}</span>
                ))}
              </span>
            </h2>
          </div>
        </div>
        {c.coaches ? <p className="L-ws-coaches" style={{ opacity: said }}>{c.coaches} <Link className="inline-link" href={ROUTES.contact}>{c.coachesLink}</Link></p> : null}
      </div>
      <div className="L-ws-pic" ref={root}>
        <svg className="L-c-svg" viewBox={`0 0 ${FRAME.w} ${FRAME.h}`} role="img" aria-label={PICTURE[active]} style={{ opacity: 1 - gone }}>
          <PersonDefs />
          {[1, 2].map((k) => (
            <g key={k} style={{ opacity: orgs * (1 - merge) }}><Row {...at(k)} s={size} ring={1} people={people} /></g>
          ))}
          <Row {...at(0)} s={size} spread={team} ring={orgs} one={merge} people={people} />
        </svg>
      </div>
    </>
  );
}
