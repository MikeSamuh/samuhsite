"use client";

import { useEffect, useId, useRef, useState, type TouchEvent } from "react";
import { preload } from "react-dom";
import { REPORT } from "@/lib/report";
import Image from "next/image";
import Link from "next/link";
import { PAGES, SECTIONS, type PageId, type SectionId } from "@/lib/layout";
import { TEAM_SIZE } from "@/components/teamq-teaser/model";
import { TeaserDemo, type TeaserDemoProps } from "@/components/teamq-teaser/TeaserDemo";
import "@/components/teamq-teaser/teaser.css";
import Synapse from "./Synapse";
import { ROUTES } from "@/lib/site";
import { FocusMorph } from "@/components/focus-morph/FocusMorph";
import { DEFAULTS, type GlobalContent, type HomeContent } from "@/lib/content/defaults";
import { lines, mark } from "@/lib/content/shared";

/** The words the admin's Content tab edits, passed down from the server.
 *  Without it a section shows its hardcoded copy, which is what the frozen
 *  drafts and the layout tool want. */
export interface SiteCopy {
  home: HomeContent;
  global: GlobalContent;
}

/** The copy the frozen drafts and the layout tool show when no content is
 *  passed and no draft override applies. Kept so B never moves. */
const HARD = {
  heroLede: "Most teams leak performance through their environment, not their effort. Samuh finds where yours is leaking, and gives you the practices to close it.",
  thesis: "Every leadership team leaks performance. Few can see where. You have already paid for the talent. The question is whether the team\u2019s conditions let you get the full return.",
  toolPitch: (size: number) => `That was a demonstration team of ${size}, three factors moved. Every team leaks performance somewhere different. A TeamQ assessment finds where yours does, and what to move first.`,
  startSub: "Free and ungated. The first insight lands before the first ask.",
};

const stay = (e: React.MouseEvent) => e.preventDefault();
const LOGO_H = 285;

/* ------------------------------------------------------------------ */
/* Nav                                                                 */
/* ------------------------------------------------------------------ */

export interface NavProps {
  page: PageId;
  menu: boolean;
  explore: boolean;
  /** which pages appear as links, in order. Default: every nav page but home */
  links?: PageId[];
  /** "wordmark" is the Samuh logo alone. "icons" shows the Samuh wordmark
   *  with "Partnered with Sapien Labs" beside it, and swaps the wordmark for
   *  the Samuh mark once the page has scrolled, with the nav stuck to the top */
  brand?: "wordmark" | "icons";
  /** "in partnership with Sapien Labs" beside the wordmark, per the scope */
  partner?: boolean;
  /** site-wide words from the admin; the defaults without it */
  content?: GlobalContent;
}

export function Nav({ page, menu, links: order, brand = "wordmark", partner = false, content }: NavProps) {
  const g = content ?? DEFAULTS.global;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const links = order
    ? order.map((id) => PAGES.find((x) => x.id === id)!).filter(Boolean)
    : PAGES.filter((x) => x.nav && x.id !== "home");
  // the overlay closes on its own link; the Link itself does the navigation
  const close = () => setOpen(false);
  const barRef = useRef<HTMLElement>(null);
  // the page does not scroll under the open menu
  useEffect(() => {
    if (!open) return;
    const was = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => { document.documentElement.style.overflow = was; };
  }, [open]);
  useEffect(() => {
    if (brand !== "icons") return;
    // two thresholds, not one: the swap shrinks the nav, which moves the
    // scroll position a little, and with a single threshold that could
    // flip the state straight back and leave the logos flickering between
    // the two. Past 80 it is scrolled, under 20 it is not, in between it
    // keeps whatever it was.
    const on = () => {
      const y = window.scrollY;
      setScrolled((was) => (y > 80 ? true : y < 20 ? false : was));
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [brand]);
  // the stuck nav's height, for anything else that sticks below it (the
  // section heads). Zero when the nav scrolls away with the page.
  useEffect(() => {
    const root = document.documentElement;
    const bar = barRef.current;
    if (brand !== "icons" || !bar) { root.style.setProperty("--nav-h", "0px"); return; }
    const set = () => root.style.setProperty("--nav-h", `${bar.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(bar);
    return () => { ro.disconnect(); root.style.setProperty("--nav-h", "0px"); };
  }, [brand]);
  return (
    <>
      <header ref={barRef} className={`L-navbar${brand === "icons" ? " L-nav-icons" : ""}`} data-scrolled={scrolled}>
      <div className="L-nav L-wrap">
        {menu ? (
          <button className="L-burger" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="L-overlay" aria-label="Menu">
            <span /><span /><span />
          </button>
        ) : null}
        {brand === "icons" ? (
          <Link href={ROUTES.home} className="nav-logo L-brand" onClick={close} aria-label="SAMUH home, in partnership with Sapien Labs">
            <span className="L-brand-samuh">
              <Image className="L-brand-mark" src="/samuh-icon.png" alt="" width={182} height={240} sizes="64px" priority />
              <Image className="L-brand-full" src="/samuh-logo.png" alt="SAMUH" width={960} height={LOGO_H} sizes="(max-width: 900px) 200px, 320px" priority />
            </span>
            <span className="L-brand-rule" aria-hidden />
            <span className="L-brand-partner">{lines(g.brand.partnerLine)}</span>
          </Link>
        ) : (
          <Link href={ROUTES.home} className="nav-logo" onClick={close} aria-label="SAMUH home">
            <Image src="/samuh-logo.png" alt="SAMUH" width={960} height={LOGO_H} sizes="200px" priority />
          </Link>
        )}
        {partner && brand !== "icons" ? <span className="nav-partner">in partnership with Sapien Labs</span> : null}
        <nav className="nav-links L-links" aria-label="Primary">
          {links.map((x) => (
            <Link key={x.id} href={ROUTES[x.id]} onClick={close} aria-current={x.id === page ? "page" : undefined}>{x.name}</Link>
          ))}
        </nav>
        <button className="btn btn-secondary btn-small L-menu" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="L-overlay">Explore</button>
        <Link className="btn btn-small L-cta" href={ROUTES.start} onClick={close}>{g.brand.navCta} <span className="arrow">&rarr;</span></Link>
        {/* on small screens every nav collapses to this: the links and the
            Explore button hide, and the burger opens the full menu */}
        {!menu ? (
          <button className="L-burger L-burger-m" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="L-overlay" aria-label="Menu">
            <span /><span /><span />
          </button>
        ) : null}
      </div>
      </header>
      {open ? (
        <div className="L-overlay" id="L-overlay" role="dialog" aria-label="Site menu">
          <div className="L-overlay-head L-wrap">
            <button className="L-burger is-x" onClick={() => setOpen(false)} aria-label="Close menu"><span /><span /><span /></button>
            <span className="L-cap">Menu</span>
          </div>
          <nav className="L-overlay-links L-wrap" aria-label="Full menu">
            <Link href={ROUTES.home} onClick={close} aria-current={page === "home" ? "page" : undefined}>Home</Link>
            {links.map((x, i) => (
              <Link key={x.id} href={ROUTES[x.id]} onClick={close} aria-current={x.id === page ? "page" : undefined} style={{ "--i": i + 1 } as React.CSSProperties}>{x.name}</Link>
            ))}
          </nav>
          <div className="L-overlay-foot L-wrap">
            <Link className="btn" href={ROUTES.start} onClick={close}>{g.brand.navCta} <span className="arrow">&rarr;</span></Link>
            <span className="L-cap">{lines(g.brand.partnerLine)}</span>
          </div>
        </div>
      ) : null}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

// Copy here is confirmed material or draft written from the introduction
// deck and the brief. No figures, no invented endorsements. Frames stand in
// for imagery and video.

/** Inline colour in copy strings: *words* take the primary, ~words~ the
 *  secondary. Nothing else is parsed. */
export function rich(text: string): React.ReactNode[] {
  return text.split(/(\*[^*]+\*|~[^~]+~)/).map((part, i) => {
    if (part.startsWith("*") && part.endsWith("*")) return <em className="L-hl" key={i}>{part.slice(1, -1)}</em>;
    if (part.startsWith("~") && part.endsWith("~")) return <em className="L-hl-2" key={i}>{part.slice(1, -1)}</em>;
    return part;
  });
}

export function Head({ def }: { def: (typeof SECTIONS)[number] }) {
  return (
    <div className="L-head">
      <span className="L-n">{String(def.n).padStart(2, "0")}</span>
      <div>
        {def.kicker ? <p className="eyebrow L-eyebrow">{def.kicker}</p> : null}
        <h2 className="sec">{def.title}</h2>
        {def.sub ? (
          <p className="L-sub">{rich(def.sub)}</p>
        ) : null}
      </div>
    </div>
  );
}

/**
 * The three circles, after the client's sketch of 25 September: the
 * organization houses the team, the team houses the individual, and the
 * individual sits at the top of the team. Only the team circle carries the
 * accent, because the team is the subject.
 *
 * Motion. Each circle floats on its own slow cycle, and all three are drawn
 * toward the pointer and tethered, so none moves more than five percent of
 * the frame. Deeper circles follow with more lag, which is what gives the
 * picture depth. The pointer is smoothed on a requestAnimationFrame loop
 * that writes transforms straight to the DOM, so nothing re-renders while
 * the mouse moves, and the follow speed reads --dur so it matches the rest
 * of the page. Hover is a geometric test against the live circle positions,
 * so it works anywhere inside a ring, not only on its stroke. The callouts
 * stay hidden until a circle is hovered: the team shows where people
 * experience their work life, the individual and the organization show
 * where organizations focus, each in its own words. The team callout is
 * always on and the team stays lit whichever circle is hovered, because
 * the team is the subject. Reduced
 * motion holds the circles still and keeps the hover.
 */
type Ring = "org" | "team" | "ind";
const RINGS: { id: Ring; cx: number; cy: number; r: number; share: number; lag: number; float: number; cycle: number; phase: number }[] = [
  // share: how much of the tether the ring takes. lag: follow time in --dur units.
  // float: idle drift in frame units. cycle: radians per second, all slow.
  { id: "org", cx: 320, cy: 220, r: 190, share: 0.6, lag: 2.4, float: 3, cycle: 0.21, phase: 0.0 },
  { id: "team", cx: 320, cy: 182, r: 128, share: 0.8, lag: 1.6, float: 4, cycle: 0.27, phase: 2.1 },
  { id: "ind", cx: 320, cy: 120, r: 46, share: 1.0, lag: 1.0, float: 6, cycle: 0.34, phase: 4.2 },
];
const FRAME = { w: 640, h: 440 };
/* the glow: a stroke painted with a radial gradient that peaks on the rim
   and fades to nothing on both sides. Smooth without a blur filter, which
   would repaint the whole circle every frame. GLOW is the stroke width per
   ring in frame units, the gradient reaches 1.2 radii from the centre */
const GLOW: Record<Ring, number> = { org: 26, team: 24, ind: 18 };
const REACH = 1.2;
/* where each leader meets its ring: a point on the rim, in the ring's own
   coordinates, so the end of the line travels with the circle */
const rim = (r: number, dx: number, dy: number) => { const d = Math.hypot(dx, dy); return { x: (dx / d) * r, y: (dy / d) * r }; };
const ANCHOR: Record<Ring, { x: number; y: number }> = { team: rim(128, -105, 38), ind: rim(46, 32, -22), org: rim(190, 120, 132) };
const EDGE: Record<Ring, { x: number; y: number }> = { team: { x: 0, y: 220 }, ind: { x: 640, y: 220 }, org: { x: 640, y: 220 } };
const TETHER = 32; // five percent of the frame

export function Circles() {
  const uid = useId().replace(/:/g, "");
  const svgRef = useRef<SVGSVGElement>(null);
  const gRefs = useRef<(SVGGElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const [hot, setHot] = useState<Ring | null>(null);
  // everything the loop touches lives outside React state
  const m = useRef({
    pointer: null as { x: number; y: number } | null, // frame units, from the centre
    target: { x: 0, y: 0 },
    cur: RINGS.map(() => ({ x: 0, y: 0 })),
    hot: null as Ring | null,
  });

  const hit = (p: { x: number; y: number } | null): Ring | null => {
    if (!p) return null;
    const half = { x: FRAME.w / 2, y: FRAME.h / 2 };
    // innermost first, so the individual wins over the team, the team over the organization
    for (let i = RINGS.length - 1; i >= 0; i--) {
      const r = RINGS[i];
      const c = m.current.cur[i];
      const d = Math.hypot(p.x + half.x - (r.cx + c.x), p.y + half.y - (r.cy + c.y));
      if (d <= r.r + 4) return r.id;
    }
    return null;
  };
  const setHotIfChanged = (h: Ring | null) => {
    if (h !== m.current.hot) { m.current.hot = h; setHot(h); }
  };

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.pointerType === "touch") return; // a finger is for scrolling; touch shows both callouts
    const b = e.currentTarget.getBoundingClientRect();
    const p = {
      x: ((e.clientX - b.left) / b.width) * FRAME.w - FRAME.w / 2,
      y: ((e.clientY - b.top) / b.height) * FRAME.h - FRAME.h / 2,
    };
    m.current.pointer = p;
    const d = Math.hypot(p.x, p.y) || 1;
    const k = Math.min(1, d / 260); // farther pointer, firmer pull, until the tether
    m.current.target = { x: (p.x / d) * TETHER * k, y: (p.y / d) * TETHER * k };
    setHotIfChanged(hit(p)); // immediate, so the hover never waits on a frame
  };
  const onLeave = () => {
    m.current.pointer = null;
    m.current.target = { x: 0, y: 0 };
    setHotIfChanged(null);
  };

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
      RINGS.forEach((r, i) => {
        const g = gRefs.current[i];
        if (!g) return;
        const c = s.cur[i];
        // exponential follow: the deeper the ring, the longer it takes, frame-rate independent
        const k = 1 - Math.exp(-dt / (dur * r.lag));
        c.x += (s.target.x * r.share - c.x) * k;
        c.y += (s.target.y * r.share - c.y) * k;
        const fx = Math.sin(t * r.cycle + r.phase) * r.float;
        const fy = Math.cos(t * r.cycle * 0.8 + r.phase) * r.float;
        const ox = c.x + fx, oy = c.y + fy;
        g.setAttribute("transform", `translate(${ox.toFixed(2)} ${oy.toFixed(2)})`);
        const l = lineRefs.current[i];
        if (l) {
          l.setAttribute("x2", (r.cx + ANCHOR[r.id].x + ox).toFixed(2));
          l.setAttribute("y2", (r.cy + ANCHOR[r.id].y + oy).toFixed(2));
        }
      });
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

  return (
    <div className="L-circ" data-hot={hot ?? undefined}>
      <p className="L-c-call L-c-left L-c-call-team L-c-hi">
        Where people experience their work life
      </p>
      <svg
        ref={svgRef}
        className="L-c-svg"
        viewBox={`0 0 ${FRAME.w} ${FRAME.h}`}
        role="img"
        aria-label="Three nested circles: organization, team, individual"
        data-hot={hot ?? undefined}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        <defs>
          {RINGS.map((r) => {
            const w = GLOW[r.id] / 2 / r.r; // half the glow, as a fraction of the radius
            const at = (k: number) => (k / REACH).toFixed(4);
            const stop = r.id === "team" ? "L-c-glow-hi" : "L-c-glow-alt";
            return (
              <radialGradient key={r.id} id={`${uid}-glow-${r.id}`} cx="50%" cy="50%" r={`${REACH * 50}%`}>
                <stop offset={at(1 - w)} className={stop} stopOpacity={0} />
                <stop offset={at(1 - w * 0.45)} className={stop} stopOpacity={0.35} />
                <stop offset={at(1)} className={stop} stopOpacity={1} />
                <stop offset={at(1 + w * 0.45)} className={stop} stopOpacity={0.35} />
                <stop offset={at(1 + w)} className={stop} stopOpacity={0} />
              </radialGradient>
            );
          })}
        </defs>
        {/* leaders: from the edge of the frame to the ring. The ends follow the rings */}
        {RINGS.map((r, i) => (
          <line
            key={r.id}
            ref={(el) => { lineRefs.current[i] = el; }}
            x1={EDGE[r.id].x} y1={EDGE[r.id].y}
            x2={r.cx + ANCHOR[r.id].x} y2={r.cy + ANCHOR[r.id].y}
            pathLength={1}
            className={`L-c-line L-c-leader-${r.id} ${r.id === "team" ? "L-c-hi" : "L-c-alt"}`}
          />
        ))}
        {RINGS.map((r, i) => (
          <g key={r.id} className="L-c-g" ref={(el) => { gRefs.current[i] = el; }} data-on={hot === r.id || (r.id === "team" && hot !== null)}>
            <circle cx={r.cx} cy={r.cy} r={r.r} className="L-c-halo" stroke={`url(#${uid}-glow-${r.id})`} strokeWidth={GLOW[r.id]} />
            <circle cx={r.cx} cy={r.cy} r={r.r} className={`L-c-${r.id}`} />
            {r.id === "org" && <text x={320} y={362} className="L-c-t L-c-t-org">Organization</text>}
            {r.id === "team" && <text x={320} y={246} className="L-c-t L-c-t-team">Team</text>}
            {r.id === "ind" && <text x={320} y={126} className="L-c-t L-c-t-ind">Individual</text>}
          </g>
        ))}
      </svg>
      <div className="L-c-right">
        <p className="L-c-call L-c-call-ind L-c-alt">
          Where organizations invest
          <span className="L-c-sub">Hiring, coaching, training: one person at a time.</span>
        </p>
        <p className="L-c-call L-c-call-org L-c-alt">
          Where organizations look
          <span className="L-c-sub">Strategy, structure, culture: the whole at once.</span>
        </p>
      </div>
    </div>
  );
}

/** Scroll-linked arrival: --r goes from 0, the element's top at the foot of
 *  the view, to 1, its top at the middle, and stays at 1 once there. The
 *  fade and the rise read --r (layout.css, "reveal"), so they move with the
 *  hand, not on a timer. Reduced motion shows the element in place. */
function useScrollReveal<T extends HTMLElement>(ref: React.RefObject<T | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.style.setProperty("--r", "1"); el.dataset.in = "true"; return; }
    let raf = 0;
    let done = false;
    const read = () => {
      raf = 0;
      if (done) return;
      const vh = window.innerHeight;
      const top = el.getBoundingClientRect().top;
      const r = Math.max(0, Math.min(1, (vh - top) / (vh * 0.5)));
      el.style.setProperty("--r", r.toFixed(3));
      if (r >= 1) { done = true; el.dataset.in = "true"; }
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(read); };
    read();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [ref]);
}

/** Fades its content up as it scrolls into view. */
export function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref);
  return <div className={`L-reveal${className ? ` ${className}` : ""}`} ref={ref}>{children}</div>;
}

export function Dictionary({ d = DEFAULTS.home.dictionary }: { d?: HomeContent["dictionary"] }) {
  const say = () => {
    const a = new Audio("/samuh.m4a");
    a.play().catch(() => {
      const u = new SpeechSynthesisUtterance("Samuh");
      u.rate = 0.85;
      window.speechSynthesis?.speak(u);
    });
  };
  return (
    <div className="L-dict">
      <div className="L-dict-head">
        <span className="L-dict-word">{d.word}</span>
        <button className="L-dict-say" onClick={say} aria-label="Hear how Samuh is pronounced" title="Hear it">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" /><path d="M16 8.5a4.5 4.5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </button>
        <span className="L-dict-pron">{d.pronunciation}</span>
        <span className="L-dict-pos">{d.origin}</span>
      </div>
      <ol className="L-dict-defs">
        <li>{mark(d.definition, "L-dict-hi")}</li>
      </ol>
    </div>
  );
}

// TODO(content): ten questions and our draft answers, written from
// docs/brief.md and the confirmed items in docs/content.md. Nothing here is
// a figure or a claim SAMUH has not made; SAMUH to approve the wording.
// *words* take the primary, ~words~ the secondary (rich()).
export const FAQ: [string, string][] = DEFAULTS.home.faq.items.map((i) => [i.q, i.a]);

// The six team metaphors SAMUH already uses, drawn for the Bangalore keynote
// (July 2026, pages 33 and 34). The captions are theirs; the one-liners are
// draft. Pulled from the deck PDF at 509 by 720, so originals are wanted.
export const ARCHETYPES: [string, string, string][] = [
  ["Bottom of the mountain", "The summit is agreed. The route is not.", "/metaphor/bottom-of-the-mountain.jpg"],
  ["In a labyrinth with different maps", "Everyone is moving. Nobody is on the same page.", "/metaphor/labyrinth-different-maps.jpg"],
  ["Sometimes it\u2019s like pulling teeth", "Every decision hurts, and it still has to be pulled.", "/metaphor/pulling-teeth.jpg"],
  ["Same boat, different directions", "All rowing hard. Not the same way.", "/metaphor/same-boat-different-directions.jpg"],
  ["Firefighting vs. preventing", "Heroic every day, because nothing gets fixed at the source.", "/metaphor/firefighting-vs-preventing.jpg"],
  ["Unique chaos", "Busy, tangled, and somehow still shipping.", "/metaphor/unique-chaos.jpg"],
];

/** one metaphor drawing, on its white card */
export function Art({ src, name }: { src: string; name: string }) {
  return (
    <span className="L-art">
      <Image src={src} alt={name} width={509} height={720} sizes="(max-width: 900px) 50vw, 300px" />
    </span>
  );
}

/** One archetype at a time, rotating on a timer. A click on the card skips ahead. */
export function Rotator() {
  const [i, setI] = useState(0);
  const n = ARCHETYPES.length;
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setI((x) => (x + 1) % n), 4200);
    return () => window.clearInterval(t);
  }, [n]);
  if (!n) return null;
  const [name, line, src] = ARCHETYPES[i];
  return (
    <div className="L-rotator">
      <article className="card L-arche L-arche-rot" key={i} onClick={() => setI((x) => (x + 1) % n)}>
        <Art src={src} name={name} />
        <div>
          <span className="card-tag">{String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span>
          <h3>{name}</h3>
          <p>{line}</p>
        </div>
      </article>
      <div className="L-rot-bar" aria-hidden><span key={i} /></div>
    </div>
  );
}

const PROMPTS = [
  "Where do you see your team in this?",
  "What does a good week look like for a team like this?",
  "What is one practice that would move it?",
];

/**
 * Metaphor cards as the client asked on 27 September: no text on the
 * cards, click to zoom into the image, reflection prompts, an option to
 * send answers to Samuh, and a look at what others said. Submission and
 * the others' answers are placeholders until the lead capture exists.
 */
export function MetaphorGallery({ cards = ARCHETYPES }: { cards?: [string, string, string][] }) {
  const [open, setOpen] = useState<number | null>(null);
  const [sent, setSent] = useState(false);
  const [others, setOthers] = useState(false);
  const close = () => { setOpen(null); setSent(false); setOthers(false); };
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  const name = open !== null ? cards[open][0] : "";
  if (!cards.length) return null;
  return (
    <>
      <div className="L-gallery">
        {cards.map(([n, , src], i) => (
          <button className="L-gal-tile" key={n} onClick={() => setOpen(i)} aria-label={`Open ${n}`}>
            <Art src={src} name={n} />
          </button>
        ))}
      </div>
      {open !== null ? (
        <div className="L-zoom" role="dialog" aria-modal="true" aria-label={name} onClick={close}>
          <div className="L-zoom-in" onClick={(e) => e.stopPropagation()}>
            <button className="L-zoom-x tbtn" onClick={close} aria-label="Close">Close</button>
            <div className="L-zoom-art">
              {open !== null ? <Art src={cards[open][2]} name={name} /> : null}
            </div>
            <div className="L-zoom-side">
              <span className="card-tag">{String(open + 1).padStart(2, "0")} / {String(cards.length).padStart(2, "0")}</span>
              <h3 className="L-zoom-title">{name}</h3>
              {!sent ? (
                <form className="L-form L-zoom-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                  {PROMPTS.map((q) => (
                    <label key={q}><span className="L-cap">{q}</span><textarea rows={2} placeholder="A line or two" /></label>
                  ))}
                  <div className="cta-row">
                    <button className="btn" type="submit">Send to Samuh <span className="arrow">&rarr;</span></button>
                    <button className="btn btn-secondary" type="button" onClick={() => setOthers((o) => !o)}>{others ? "Hide" : "See what others said"}</button>
                  </div>
                </form>
              ) : (
                <div className="L-zoom-thanks">
                  <p className="L-big">Thank you. A person reads these.</p>
                  <button className="btn btn-secondary" type="button" onClick={() => setOthers(true)}>See what others said</button>
                </div>
              )}
              {others ? (
                <ul className="L-others">
                  {["Sample answer from another visitor, one or two lines.", "A second sample answer, kept anonymous.", "A third, so the list reads as a list."].map((a, k) => (
                    <li key={k}><span className="L-cap">Anonymous</span>{a}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

/** The words beside the deck. In the code since 23 October 2026: the
 *  admin's Metaphor cards group went, and what visitors share lands on
 *  the admin's Responses tab, where the team puts it on the card's back. */
const DECK = {
  deckTitle: "A deck of teams.",
  deckLine: "Each card is a team you have probably sat in. Shuffle the deck, then take one.",
  shuffle: "Shuffle",
  pickTitle: "Pick a card.",
  pickLine: "Take the one on top and see which team you get.",
  pick: "Pick a card",
  question: "How does this relate to your team?",
  thanks: "Shared, thank you. A person reads these. If this one hit home, *talk to us*.",
  failed: "That did not send. Try again in a moment.",
  share: "Share anonymously",
  view: "View responses",
  back: "Back to the card",
  next: "View another card",
  loading: "Fetching what others said.",
  empty: "Nothing shared on this card yet. Yours could be the first.",
};

type DeckPhase = "deck" | "shuffling" | "pick" | "drawing" | "drawn";

/** How long the shuffle and the reveal run, in beats of --dur. The CSS
 *  (L-deck-shuffle, L-deck-lift and L-deck-reveal in layout.css) adds up
 *  to the same, so a change there needs one here. */
const SHUFFLE_BEATS = 5;
const REVEAL_BEATS = 4;

/**
 * The metaphor cards as a deck, the client's ask on 23 October: arrive on
 * a pile of Samuh cards, shuffle it from the button over the pile, be
 * asked to pick one while it still moves, and the card
 * you pick rises out of the pile and turns over. Then "How does this
 * relate to your team?" and the box come in beside it. "View responses"
 * flips the card to what others said on its back, which is what the team
 * has chosen to show in the admin; "View another card" puts it back and
 * shuffles again. The card is drawn at random. Nothing about the visitor
 * is stored: the line they share goes to /api/reflection with the card's
 * name and nothing else.
 */
export function CardDeck({ cards = ARCHETYPES }: { cards?: [string, string, string][] }) {
  const [phase, setPhase] = useState<DeckPhase>("deck");
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [shared, setShared] = useState<string[]>([]);
  /** what the team shows on the back; null while it loads */
  const [others, setOthers] = useState<string[] | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [failed, setFailed] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  /** move on after the CSS has run: beats of the page's --dur, none with reduced motion */
  const after = (beats: number, then: () => void) => {
    window.clearTimeout(timer.current);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dur = reduced ? 0 : parseFloat(getComputedStyle(root.current ?? document.documentElement).getPropertyValue("--dur")) || 0;
    timer.current = window.setTimeout(then, dur * beats);
  };

  // no cards in the draft: no section body, rather than a crash
  if (!cards.length) return null;
  const [name, , src] = cards[i % cards.length];
  const backs = Math.min(7, Math.max(cards.length, 5));
  const drawn = phase === "drawing" || phase === "drawn";

  const shuffle = () => {
    setFlipped(false);
    setText("");
    setShared([]);
    setOthers(null);
    setFailed(false);
    setI(Math.floor(Math.random() * cards.length));
    setPhase("shuffling");
    after(SHUFFLE_BEATS, () => setPhase("pick"));
  };
  const draw = () => {
    setPhase("drawing");
    fetch(`/api/reflection?card=${encodeURIComponent(name)}`)
      .then((r) => (r.ok ? r.json() : { responses: [] }))
      .then((d: { responses?: unknown }) => setOthers(Array.isArray(d.responses) ? d.responses.filter((x): x is string => typeof x === "string") : []))
      .catch(() => setOthers([]));
    after(REVEAL_BEATS, () => setPhase("drawn"));
  };
  const share = async (e: React.FormEvent) => {
    e.preventDefault();
    const line = text.trim();
    if (!line) return;
    setShared((v) => [line, ...v]);
    setText("");
    setFailed(false);
    try {
      const res = await fetch("/api/reflection", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ card: name, text: line }) });
      if (!res.ok) throw new Error(String(res.status));
    } catch {
      setFailed(true);
    }
  };
  const responses = [...shared, ...(others ?? [])];

  return (
    <div className="L-one L-deck" data-phase={phase} ref={root}>
      <div className="L-deck-stage">
        {/* the one button, over the pile: Shuffle, then Pick a card while the
            pile is still moving. A pick mid-shuffle just draws */}
        {!drawn ? (
          <span className="L-deck-btn">
            <button type="button" className="btn" onClick={phase === "deck" ? shuffle : draw}>{phase === "deck" ? DECK.shuffle : DECK.pick} <span className="arrow">&rarr;</span></button>
          </span>
        ) : null}
        {/* the pile: card backs, the star on each */}
        <div className="L-deck-stack" aria-hidden>
          {Array.from({ length: backs }, (_, k) => (
            <span className="L-deck-back" key={k} style={{ "--i": k, "--dir": k % 2 ? -1 : 1 } as React.CSSProperties}>
              <Image src="/samuh-star.png" alt="" width={120} height={120} sizes="120px" />
            </span>
          ))}
        </div>
        {/* the card drawn: the drawing on the front, the responses on the back */}
        {drawn ? (
          <div className="L-one-card L-deck-card" data-flipped={flipped || undefined} key={src}>
            <div className="L-one-face L-one-front">
              <Art src={src} name={name} />
            </div>
            <div className="L-one-face L-one-back" aria-hidden={!flipped || undefined}>
              <span className="card-tag">What others said</span>
              {others === null && !shared.length ? (
                <p className="L-one-empty">{DECK.loading}</p>
              ) : responses.length ? (
                <ul className="L-one-list">
                  {responses.map((a, k) => (
                    <li key={k}>{a}</li>
                  ))}
                </ul>
              ) : (
                <p className="L-one-empty">{DECK.empty}</p>
              )}
            </div>
          </div>
        ) : null}
      </div>
      <div className="L-one-side">
        {phase === "drawn" ? (
          <div className="L-deck-ask">
            <h3 className="L-one-title">{DECK.question}</h3>
            <form className="L-form L-one-form" onSubmit={share}>
              <textarea className="L-one-box" rows={4} maxLength={600} placeholder="A line or two" aria-label="Your response" value={text} onChange={(e) => setText(e.target.value)} />
              {shared.length ? (
                <p className="L-one-thanks">{failed ? DECK.failed : DECK.thanks.split(/(\*[^*]+\*)/).map((part, k) => part.startsWith("*") && part.endsWith("*") ? <Link href={ROUTES.contact} className="inline-link" key={k}>{part.slice(1, -1)}</Link> : part)}</p>
              ) : null}
              <div className="cta-row">
                <button className="btn" type="submit" disabled={!text.trim()}>{DECK.share} <span className="arrow">&rarr;</span></button>
                <button className="btn btn-secondary" type="button" onClick={() => setFlipped((f) => !f)} aria-pressed={flipped}>{flipped ? DECK.back : DECK.view}</button>
                <button className="btn btn-secondary" type="button" onClick={shuffle}>{DECK.next}</button>
              </div>
            </form>
          </div>
        ) : phase === "drawing" ? null : (
          <div className="L-deck-prompt" key={phase === "deck" ? "deck" : "pick"} aria-live="polite">
            <h3 className="L-one-title">{phase === "deck" ? DECK.deckTitle : DECK.pickTitle}</h3>
            <p className="L-deck-line">{phase === "deck" ? DECK.deckLine : DECK.pickLine}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/** The Sapien Labs report: its cover, the one-line claim, and the download.
 *  The research spine of the site, so it shows on the home page and again
 *  at the top of Insights. */
export function ReportCard({ cls, onlyDownload, report: r = DEFAULTS.global.report }: { cls?: string; /** the download alone, no link to the page on sapienlabs.org */ onlyDownload?: boolean; /** the words and links, from the admin */ report?: GlobalContent["report"] }) {
  return (
    <blockquote className={`L-research L-report${cls ? ` ${cls}` : ""}`}>
      <a className="L-report-cover" href={r.pdf} target="_blank" rel="noopener noreferrer" aria-label={`${REPORT.title}, PDF`}>
        <Image src={REPORT.cover} alt="" width={REPORT.coverWidth} height={REPORT.coverHeight} sizes="(max-width: 900px) 60vw, 220px" />
      </a>
      <div className="L-report-copy">
        <span className="card-tag">{r.tag}</span>
        <p className="L-big">{r.line}</p>
        <span className="L-cap">{r.kicker}</span>
        <p className="L-report-links">
          <a href={r.pdf} className="inline-link" target="_blank" rel="noopener noreferrer">{r.download} <span className="arrow">&rarr;</span></a>
          {onlyDownload ? null : <a href={r.page} className="inline-link" target="_blank" rel="noopener noreferrer">{r.onSite}</a>}
        </p>
      </div>
    </blockquote>
  );
}

export function Footer({ content }: { /** site-wide words from the admin; the defaults without it */ content?: GlobalContent }) {
  const g = content ?? DEFAULTS.global;
  return (
    <footer className="L-foot">
      <div className="L-wrap L-foot-grid">
        <div className="L-foot-brand">
          <Link href={ROUTES.home} className="L-foot-logo" aria-label="SAMUH home">
            <Image src="/samuh-logo.png" alt="SAMUH" width={960} height={LOGO_H} sizes="(max-width: 900px) 100vw, 360px" />
          </Link>
          <p className="L-foot-line">{mark(g.footer.line, "L-hl")}</p>
          <p className="L-foot-about">{g.footer.about}</p>
          <a className="L-foot-partner" href={g.report.page} target="_blank" rel="noopener noreferrer" aria-label="In partnership with Sapien Labs">
            <span className="L-cap">In partnership with</span>
            <Image src="/sapien-labs.png" alt="Sapien Labs" width={820} height={240} sizes="132px" />
          </a>
        </div>
        <nav className="L-foot-col" aria-label="Company">
          <span className="L-cap L-foot-h">Company</span>
          <Link className="L-foot-link" href={ROUTES.about}>About</Link>
          <Link className="L-foot-link" href={ROUTES.process}>Process</Link>
          <Link className="L-foot-link" href={ROUTES.solutions}>Solutions</Link>
          <Link className="L-foot-link" href={ROUTES.contact}>Contact</Link>
        </nav>
        <nav className="L-foot-col" aria-label="Resources">
          <span className="L-cap L-foot-h">Resources</span>
          <Link className="L-foot-link" href={ROUTES.insights}>Insights</Link>
          <Link className="L-foot-link" href={ROUTES.start}>TeamQ</Link>
          <a className="L-foot-link" href={g.report.page} target="_blank" rel="noopener noreferrer">{g.footer.reportLabel}</a>
          <a className="L-foot-link" href={g.footer.youtubeUrl} target="_blank" rel="noopener noreferrer">{g.footer.youtubeLabel}</a>
        </nav>
        <div className="L-foot-col">
          <span className="L-cap L-foot-h">{g.footer.talkHeading}</span>
          {g.contact.email ? (
            <a className="L-foot-link" href={`mailto:${g.contact.email}`}>{g.contact.email}</a>
          ) : (
            <span className="L-foot-link L-foot-todo">TODO(content): email address</span>
          )}
          <Link className="L-foot-link" href="/talk">{g.footer.bookCall}</Link>
          <Link className="btn L-foot-cta" href={ROUTES.start}>{g.footer.cta} <span className="arrow">&rarr;</span></Link>
        </div>
      </div>
      <div className="L-wrap L-foot-base">
        <span className="L-cap">&copy; {new Date().getFullYear()} SAMUH. All rights reserved.</span>
        {/* TODO(content): the privacy, terms and cookie pages, from SAMUH's
            counsel. Until they exist the links land on Contact, where the
            question can be asked, rather than nowhere */}
        <nav className="L-foot-legal" aria-label="Legal">
          <Link className="L-cap" href={ROUTES.contact}>Privacy</Link>
          <Link className="L-cap" href={ROUTES.contact}>Terms</Link>
          <Link className="L-cap" href={ROUTES.contact}>Cookies</Link>
          <a className="L-cap" href="#top" onClick={(e) => { stay(e); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Back to top <span className="arrow">&uarr;</span></a>
        </nav>
      </div>
    </footer>
  );
}

export const QUOTES = DEFAULTS.global.testimonials.items.map((i) => ({ q: i.quote, who: i.who, role: i.role }));

/** the admin's testimonials in the carousel's shape */
export const quotesOf = (g: GlobalContent) => g.testimonials.items.map((i) => ({ q: i.quote, who: i.who, role: i.role }));

/** Temporary marks standing in for client logos, one shape per testimonial. */
function TempMark({ i }: { i: number }) {
  const shapes = [
    <circle key="c" cx={32} cy={32} r={22} />,
    <polygon key="t" points="32,9 56,53 8,53" />,
    <polygon key="h" points="32,8 53,20 53,44 32,56 11,44 11,20" />,
    <rect key="r" x={12} y={12} width={40} height={40} />,
  ];
  return (
    <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden className="L-car2-mark">
      {shapes[i % shapes.length]}
    </svg>
  );
}

/**
 * One bold italic quote at a time, the client's mark in the margin column
 * where the section head would sit, changing every 5.55 seconds. The
 * quote block keeps one height from slide to slide.
 */
export function Carousel({ quotes = QUOTES }: { quotes?: typeof QUOTES }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = quotes.length;
  const go = (d: number) => setI((x) => (x + d + n) % n);
  const cur = quotes[i % Math.max(1, n)];
  // a swipe on touch moves one slide, arrows stay for everyone
  const touch = useRef<number | null>(null);
  const onTouchStart = (e: TouchEvent) => { touch.current = e.touches[0].clientX; };
  const onTouchEnd = (e: TouchEvent) => {
    if (touch.current === null) return;
    const dx = e.changedTouches[0].clientX - touch.current;
    touch.current = null;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
  };
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setI((x) => (x + 1) % n), 5550);
    return () => window.clearInterval(t);
  }, [paused, n]);
  if (!cur) return null;
  return (
    <div className="L-car2" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="L-car2-logo" key={`m${i}`} role="img" aria-label="Client mark, temporary">
        <TempMark i={i} />
      </div>
      <figure className="L-car2-slide" key={i}>
        <blockquote>&ldquo;{cur.q}&rdquo;</blockquote>
        <figcaption>
          <span className="L-car-who">{cur.who}</span>
          <span className="L-cap">{cur.role}</span>
        </figcaption>
        <div className="L-car2-nav">
          <button className="L-car-arrow" onClick={() => go(-1)} aria-label="Previous testimonial">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button className="L-car-arrow" onClick={() => go(1)} aria-label="Next testimonial">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </figure>
    </div>
  );
}

/**
 * The hero video. A muted loop; click for the full video with sound and
 * controls, click again to go back to the loop. /hero-test.mp4 is a stock
 * clip for testing the flow, not committed (video is never committed).
 * As a `background` it only loops: a moving picture behind the copy, with
 * nothing to click, until SAMUH's own film arrives.
 */
export function HeroVideo({ src = "/hero-test.mp4", background = false, poster = "/hero-poster.jpg" }: { src?: string; background?: boolean; /** the first frame as a still, painted before the film arrives */ poster?: string }) {
  const [full, setFull] = useState(false);
  // As a background the poster is the page's largest paint, so it is fetched
  // first and the film only after the page has loaded. Until then the still
  // stands in, and the loop fades in over it once it can play.
  const [loaded, setLoaded] = useState(false);
  if (background) preload(poster, { as: "image", fetchPriority: "high" });
  useEffect(() => {
    if (!background) return;
    const go = () => setLoaded(true);
    if (document.readyState === "complete") { go(); return; }
    window.addEventListener("load", go, { once: true });
    return () => window.removeEventListener("load", go);
  }, [background]);
  if (background) {
    return (
      <div className="ph ph-tall L-video is-bg" aria-hidden>
        <video src={loaded ? src : undefined} poster={poster} muted loop autoPlay playsInline preload="none" />
      </div>
    );
  }
  return (
    <div className={`ph ph-tall L-video${full ? " is-full" : ""}`} onClick={() => setFull((f) => !f)} role="button" aria-label={full ? "Back to the loop" : "Play the full video"}>
      <video
        key={full ? "full" : "loop"}
        src={src}
        poster={poster}
        muted={!full}
        loop={!full}
        autoPlay
        playsInline
        controls={full}
        preload="metadata"
      />
    </div>
  );
}

export function Frame({ label, tall }: { label: string; tall?: boolean }) {
  return <div className={`ph${tall ? " ph-tall" : ""}`}>{label}</div>;
}

export interface CopyOverrides {
  /** null removes the hero lede */
  heroLede?: string | null;
  /** *words* in the primary, ~words~ in the secondary */
  thesis?: string;
  /** the dictionary entry sits beside the thesis on desktop, and the meaning section is not rendered on its own */
  thesisWithMeaning?: boolean;
  /** drop the partner line under the thesis */
  noPartnerLine?: boolean;
  /** the hero eyebrow moves down to sit above the thesis rule */
  eyebrowOnThesis?: boolean;
  /** no eyebrow line anywhere */
  noEyebrow?: boolean;
  /** no buttons in the hero */
  noHeroCtas?: boolean;
  /** the hero's video file; default is the stock test clip */
  heroVideo?: string;
  /** the hero video is a background loop, nothing to click */
  heroBackground?: boolean;
  /** the research claim opens the case study section, and the research section is not rendered on its own */
  caseWithResearch?: boolean;
  /** which metaphor cards to show, in order; default is every card */
  cards?: [string, string, string][];
  /** the line under the close's question; null for none */
  startSub?: string | null;
  /** the dictionary and the leak line fade up as they come into view */
  revealIntro?: boolean;
  /** whole sections whose content fades up as they come into view */
  revealSections?: SectionId[];
  /** the tool section's words: its head, the pitch under the demo and the button */
  tool?: { kicker?: string; title?: string; /** null: no pitch, the button alone */ pitch?: string | null; cta?: string; /** a link instead of the page button, for an anchor on the live page */ ctaHref?: string };
}

export function Section({ def, variant, copy = {}, demo, content }: { def: (typeof SECTIONS)[number]; variant: string; copy?: CopyOverrides; /** the tool's numbers, scored on the server; with them, section 9 shows the bars moving */ demo?: TeaserDemoProps; /** the admin's words. With them, they win over `copy`'s text; the flags in `copy` still apply */ content?: SiteCopy }) {
  const v = variant.replace(`${def.id}-`, "");
  const h = content?.home ?? DEFAULTS.home;
  const g = content?.global ?? DEFAULTS.global;
  // text: the admin's words, else the draft's override, else the hardcoded line
  const heroLede = content ? h.hero.lede || null : copy.heroLede === null ? null : copy.heroLede ?? HARD.heroLede;
  const thesisText = content ? h.thesis.text : copy.thesis ?? HARD.thesis;
  const toolKicker = content ? h.tool.kicker : copy.tool?.kicker ?? def.kicker;
  const toolTitle = content ? h.tool.title : copy.tool?.title ?? def.title;
  const toolPitch = content ? h.tool.pitch : copy.tool?.pitch === null ? "" : copy.tool?.pitch ?? HARD.toolPitch(TEAM_SIZE);
  const toolCta = content ? h.tool.cta : copy.tool?.cta ?? "Explore TeamQ";
  const startSub = content ? h.start.sub : copy.startSub === null ? "" : copy.startSub ?? HARD.startSub;
  const cardItems = copy.cards;
  const quotes = quotesOf(g);
  /** a section head with the admin's eyebrow and title */
  const headOf = (w: { kicker: string; title: string }) => ({ ...def, kicker: w.kicker, title: w.title });
  const headed = !["hero", "thesis", "meaning", "start"].includes(def.id) && !(def.id === "voices" && v === "carousel");
  const reveal = !!copy.revealSections?.includes(def.id);
  const secRef = useRef<HTMLElement>(null);
  const noRef = useRef<HTMLElement>(null);
  useScrollReveal(reveal ? secRef : noRef);
  return (
    <section className={`L-sec L-s-${def.id}${headed ? " L-sec-h" : ""}`} data-v={v} data-n={String(def.n).padStart(2, "0")} id={def.id} ref={secRef} data-reveal={reveal || undefined}>
      {/* the close carries the synapse field, parallaxed against the band */}
      {def.id === "start" && <Synapse scope="section" />}
      <div className="L-wrap">
        {def.id === "hero" && (
          <div className="L-hero-grid">
            <div className="L-hero-copy">
              {copy.eyebrowOnThesis || copy.noEyebrow ? null : <p className="eyebrow">{h.hero.eyebrow}</p>}
              <h1 className="display">{mark(h.hero.title)}</h1>
              {heroLede ? <p className="lede">{heroLede}</p> : null}
              {copy.noHeroCtas ? null : (
                <div className="cta-row">
                  <Link className="btn" href={ROUTES.start}>{h.hero.ctaPrimary} <span className="arrow">&rarr;</span></Link>
                  <Link className="btn btn-secondary" href={ROUTES.contact}>{h.hero.ctaSecondary}</Link>
                </div>
              )}
            </div>
            <HeroVideo src={copy.heroVideo} background={copy.heroBackground} />
          </div>
        )}

        {def.id === "thesis" && (
          <>
          {copy.eyebrowOnThesis && !copy.noEyebrow ? <p className="eyebrow L-thesis-eyebrow">{h.hero.eyebrow}</p> : null}
          {(() => {
            const inner = (
              <div className={`L-thesis-in${copy.thesisWithMeaning ? " L-thesis-duo" : ""}`}>
                <p className="L-big">{rich(thesisText)}</p>
                {copy.thesisWithMeaning ? <Dictionary d={h.dictionary} /> : null}
                {copy.noPartnerLine ? null : <span className="L-cap">In partnership with Sapien Labs</span>}
              </div>
            );
            return copy.revealIntro ? <Reveal>{inner}</Reveal> : inner;
          })()}
          </>
        )}

        {def.id === "meaning" && !copy.thesisWithMeaning && (copy.revealIntro ? <Reveal><Dictionary d={h.dictionary} /></Reveal> : <Dictionary d={h.dictionary} />)}

        {def.id === "circles" && v === "nested" && (
          <>
            <Head def={def} />
            <Circles />
          </>
        )}

        {/* the morph carries its own head: it changes as the picture does */}
        {def.id === "circles" && v === "morph" && <FocusMorph words={h.focus} />}

        {def.id === "circles" && v !== "nested" && v !== "morph" && (
          <>
            <Head def={def} />
            <div className="L-circles">
              {[
                ["Organization", "Where transformations and organization-wide programs land."],
                ["Team", "Where the work gets done, and where capacity is won or lost."],
                ["Individual", "Where evaluation and development are aimed."],
              ].map(([c, note], i) => (
                <div className={`L-circle L-circle-${i}`} key={c}>
                  <span className="L-circle-label">{c}</span>
                  <span className="L-circle-note">{note}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {def.id === "aspire" && (
          <>
            <Head def={def} />
            <div className="L-aspire">
              <Frame label="Imagery · a team you would want to lead" tall />
              <p className="L-big">Sustained performance, where people thriving and results thriving reinforce each other instead of trading off.</p>
              <ul className="L-cols">
                {[
                  ["Cognitive", "Judgment and focus that hold under load."],
                  ["Relational", "Trust, feedback and how decisions get made."],
                  ["Emotional", "Energy, and the will to keep going."],
                  ["Physical", "The stamina the other three depend on."],
                ].map(([c, note]) => (
                  <li key={c}><span className="L-col-title">{c}</span><span className="L-col-note">{note}</span></li>
                ))}
              </ul>
            </div>
          </>
        )}

        {def.id === "research" && (
          <>
            <Head def={def} />
            <ReportCard />
          </>
        )}

        {def.id === "voices" && v === "carousel" && <Carousel quotes={quotes} />}

        {def.id === "voices" && v !== "carousel" && (
          <>
            <Head def={headOf(h.voices)} />
            <div className="L-voices">
              {quotes.map((q, i) => (
                <figure className="card L-quote" key={i}>
                  <blockquote>&ldquo;{q.q}&rdquo;</blockquote>
                  <figcaption className="L-cap">{q.who} &middot; {q.role}</figcaption>
                </figure>
              ))}
            </div>
          </>
        )}

        {def.id === "case" && (
          <>
            <Head def={headOf(h.case)} />
            <div className="L-case-wrap">
            {copy.caseWithResearch ? (
              <ReportCard cls="L-case-research" onlyDownload report={g.report} />
            ) : null}
            {copy.caseWithResearch ? (
              /* the case study in the report's shape: a portrait cover, the
                 mark and the tag on black, beside the line and the numbers.
                 TODO(content): the case study PDF, when SAMUH supplies it */
              <blockquote className="L-research L-report L-case-report">
                <a className="L-report-cover L-case-cover" href="#" onClick={stay} aria-label={`${h.case.tag}. SAMUH case study, PDF`}>
                  <Image src="/samuh-logo.png" alt="" width={960} height={LOGO_H} sizes="160px" />
                  <span className="L-case-cover-tag">{h.case.tag}</span>
                </a>
                <div className="L-report-copy">
                  <span className="card-tag">{h.case.tag}</span>
                  <p className="L-big">{h.case.line}</p>
                  <dl className="L-case-stats">
                    {h.case.stats.map(({ n, label }) => (
                      <div className="L-stat" key={n}>
                        <dt className="L-stat-n">{n}</dt>
                        <dd className="L-cap">{label}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="L-report-links">
                    <a href="#" className="inline-link" onClick={stay}>{h.case.cta} <span className="arrow">&rarr;</span></a>
                  </p>
                </div>
              </blockquote>
            ) : (
            <div className="L-case">
              <span className="L-case-img">
                <Image src="/case-study.png" alt="Samuh case study: 1 high-performance practice. 90 days. Measurable change." width={2490} height={1404} sizes="(max-width: 900px) 100vw, 560px" />
              </span>
              <div>
                <span className="card-tag">{h.case.tag}</span>
                <p className="L-big L-case-line">{h.case.line}</p>
                <dl className="L-case-stats">
                  {h.case.stats.map(({ n, label }) => (
                    <div className="L-stat" key={n}>
                      <dt className="L-stat-n">{n}</dt>
                      <dd className="L-cap">{label}</dd>
                    </div>
                  ))}
                </dl>
                <a href="#" className="inline-link" onClick={stay}>{h.case.cta}</a>
              </div>
            </div>
            )}
            </div>
          </>
        )}

        {def.id === "tool" && (
          <>
            <Head def={{ ...def, kicker: toolKicker, title: toolTitle }} />
            {demo ? <TeaserDemo {...demo} /> : null}
            {/* TODO(content): draft pitch, for SAMUH to replace. It describes and does not claim */}
            <div className="teaser-pitch">
              {toolPitch ? <p className="L-mid">{toolPitch}</p> : null}
              <div className="cta-row">
                <Link className="btn" href={copy.tool?.ctaHref ?? ROUTES.start}>{toolCta} <span className="arrow">&rarr;</span></Link>
              </div>
            </div>
          </>
        )}

        {def.id === "cards" && v === "rotate" && (
          <>
            <Head def={def} />
            <Rotator />
          </>
        )}

        {def.id === "cards" && v === "gallery" && (
          <>
            <Head def={def} />
            <MetaphorGallery cards={cardItems} />
          </>
        )}

        {def.id === "cards" && v === "one" && (
          <>
            <Head def={def} />
            <CardDeck cards={cardItems} />
          </>
        )}

        {def.id === "cards" && v !== "rotate" && v !== "gallery" && v !== "one" && (
          <>
            <Head def={def} />
            <div className="L-cards">
              {(cardItems ?? ARCHETYPES).map(([name, line, src]) => (
                <article className="card L-arche" key={name}>
                  <Art src={src} name={name} />
                  <h3>{name}</h3>
                  <p>{line}</p>
                </article>
              ))}
            </div>
          </>
        )}

        {def.id === "equation" && (
          <>
            <Head def={def} />
            <div className="L-equation">
              <Frame label="The SAMUH equation · video, plays in place" tall />
              <div>
                <p className="L-big">Team practices shape the team environment. The environment sets the capacity people can bring. Capacity turns into performance.</p>
                <p className="L-mid">Team environment + team practices = capacity to perform, and capacity is what becomes performance. The film walks the equation one term at a time.</p>
              </div>
            </div>
          </>
        )}

        {def.id === "faq" && (
          <>
            <Head def={headOf(h.faq)} />
            <div className="L-faq">
              {h.faq.items.map(({ q, a }, i) => (
                <details className="L-faq-item" key={q} name="faq" open={i === 0 || undefined}>
                  <summary className="L-faq-q">
                    <span>{rich(q)}</span>
                    <span className="L-faq-mark" aria-hidden>+</span>
                  </summary>
                  <p className="L-faq-a">{rich(a)}</p>
                </details>
              ))}
            </div>
          </>
        )}

        {def.id === "start" && (
          <div className="L-start">
            <div>
              <h2 className="sec">{h.start.title}</h2>
              {startSub ? <p className="L-mid">{startSub}</p> : null}
            </div>
            <div className="L-start-actions">
              <div className="field">
                <input type="text" placeholder={h.start.placeholder} />
                <button className="btn">{h.start.startLabel}</button>
              </div>
              <div className="cta-row">
                <Link className="btn" href={ROUTES.start}>{h.start.ctaPrimary} <span className="arrow">&rarr;</span></Link>
                <Link className="btn btn-secondary" href={ROUTES.contact}>{h.start.ctaSecondary}</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
