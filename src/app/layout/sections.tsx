"use client";

import { useEffect, useId, useRef, useState, type TouchEvent } from "react";
import Image from "next/image";
import { PAGES, SECTIONS, type PageId } from "@/lib/layout";
import Synapse from "../design/Synapse";

const stay = (e: React.MouseEvent) => e.preventDefault();
const LOGO_H = 285;

/* ------------------------------------------------------------------ */
/* Nav                                                                 */
/* ------------------------------------------------------------------ */

export interface NavProps {
  page: PageId;
  go: (p: PageId) => void;
  menu: boolean;
  explore: boolean;
  /** which pages appear as links, in order. Default: every nav page but home */
  links?: PageId[];
  /** "wordmark" is the Samuh logo alone. "icons" shows the Samuh mark and the
   *  Sapien Labs mark at rest and swaps to both full logos once the page has
   *  scrolled, with the nav stuck to the top */
  brand?: "wordmark" | "icons";
  /** "in partnership with Sapien Labs" beside the wordmark, per the scope */
  partner?: boolean;
}

export function Nav({ page, go, menu, explore, links: order, brand = "wordmark", partner = false }: NavProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overlay = menu || explore;
  const links = order
    ? order.map((id) => PAGES.find((x) => x.id === id)!).filter(Boolean)
    : PAGES.filter((x) => x.nav && x.id !== "home");
  const jump = (p: PageId) => { setOpen(false); go(p); };
  const barRef = useRef<HTMLElement>(null);
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
          <a href="#" className="nav-logo L-brand" onClick={(e) => { stay(e); jump("home"); }} aria-label="SAMUH home, in partnership with Sapien Labs">
            <span className="L-brand-samuh">
              <Image className="L-brand-mark" src="/samuh-icon.png" alt="" width={182} height={240} priority />
              <Image className="L-brand-full" src="/samuh-logo.png" alt="SAMUH" width={960} height={LOGO_H} priority />
            </span>
            <span className="L-brand-rule" aria-hidden />
            <span className="L-brand-sapien">
              <span className="L-brand-powered">Powered by</span>
              <Image className="L-brand-mark" src="/sapien-icon.png" alt="" width={240} height={240} />
              <Image className="L-brand-full" src="/sapien-labs.png" alt="Sapien Labs" width={820} height={240} />
            </span>
          </a>
        ) : (
          <a href="#" className="nav-logo" onClick={(e) => { stay(e); jump("home"); }} aria-label="SAMUH home">
            <Image src="/samuh-logo.png" alt="SAMUH" width={960} height={LOGO_H} priority />
          </a>
        )}
        {partner && brand !== "icons" ? <span className="nav-partner">in partnership with Sapien Labs</span> : null}
        <nav className="nav-links L-links" aria-label="Primary">
          {links.map((x) => (
            <a key={x.id} href="#" onClick={(e) => { stay(e); jump(x.id); }} aria-current={x.id === page ? "page" : undefined}>{x.name}</a>
          ))}
        </nav>
        <button className="btn btn-secondary btn-small L-menu" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="L-overlay">Explore</button>
        <button className="btn btn-small" onClick={() => jump("start")}>Get started <span className="arrow">&rarr;</span></button>
      </div>
      </header>
      {overlay && open ? (
        <div className="L-overlay" id="L-overlay" role="dialog" aria-label="Site menu">
          <div className="L-overlay-head L-wrap">
            <button className="L-burger is-x" onClick={() => setOpen(false)} aria-label="Close menu"><span /><span /><span /></button>
            <span className="L-cap">Menu</span>
          </div>
          <nav className="L-overlay-links L-wrap" aria-label="Full menu">
            <a href="#" onClick={(e) => { stay(e); jump("home"); }} aria-current={page === "home" ? "page" : undefined}>Home</a>
            {links.map((x, i) => (
              <a key={x.id} href="#" onClick={(e) => { stay(e); jump(x.id); }} aria-current={x.id === page ? "page" : undefined} style={{ "--i": i + 1 } as React.CSSProperties}>{x.name}</a>
            ))}
          </nav>
          <div className="L-overlay-foot L-wrap">
            <button className="btn" onClick={() => jump("start")}>Get started <span className="arrow">&rarr;</span></button>
            <span className="L-cap">In partnership with Sapien Labs</span>
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

export function Head({ def }: { def: (typeof SECTIONS)[number] }) {
  return (
    <div className="L-head">
      <span className="L-n">{String(def.n).padStart(2, "0")}</span>
      <div>
        {def.kicker ? <p className="eyebrow L-eyebrow">{def.kicker}</p> : null}
        <h2 className="sec">{def.title}</h2>
        {def.sub ? (
          <p className="L-sub">
            {def.sub.split(/\*([^*]+)\*/).map((part, i) => (i % 2 ? <em className="L-hl" key={i}>{part}</em> : part))}
          </p>
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

export function Dictionary() {
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
        <span className="L-dict-word">Samuh</span>
        <button className="L-dict-say" onClick={say} aria-label="Hear how Samuh is pronounced" title="Hear it">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" /><path d="M16 8.5a4.5 4.5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </button>
        <span className="L-dict-pron">/s&#601;&#712;mu&#720;/</span>
        <span className="L-dict-pos">noun &middot; Sanskrit <span lang="sa">&#2360;&#2350;&#2370;&#2361;</span>, <i>sam&#363;ha</i></span>
      </div>
      <ol className="L-dict-defs">
        <li>A group of people who come together <em className="L-dict-hi">for a purpose larger than themselves.</em></li>
      </ol>
      <span className="L-cap">Placeholder voice. SAMUH to confirm the pronunciation and record it.</span>
    </div>
  );
}

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
export function MetaphorGallery() {
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
  const name = open !== null ? ARCHETYPES[open][0] : "";
  return (
    <>
      <div className="L-gallery">
        {ARCHETYPES.map(([n, , src], i) => (
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
              {open !== null ? <Art src={ARCHETYPES[open][2]} name={name} /> : null}
            </div>
            <div className="L-zoom-side">
              <span className="card-tag">{String(open + 1).padStart(2, "0")} / {String(ARCHETYPES.length).padStart(2, "0")}</span>
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

export function Footer({ go }: { go: (p: PageId) => void }) {
  return (
    <footer className="L-foot L-wrap">
      <span className="L-cap">SAMUH · in partnership with Sapien Labs</span>
      <nav className="L-foot-links" aria-label="Footer">
        {PAGES.filter((x) => x.nav && x.id !== "home").map((x) => (
          <a key={x.id} className="L-cap" onClick={() => go(x.id)}>{x.name}</a>
        ))}
      </nav>
      <span className="L-cap">Privacy · Terms · Cookies</span>
    </footer>
  );
}

export const QUOTES = [
  { q: "Sample testimonial. Two or three sentences in the client\u2019s own words about what changed for the team, and what it felt like to work this way.", who: "Name", role: "Role, Organization" },
  { q: "A second sample. Long enough to show how a real quote wraps at this size, short enough to read in one breath.", who: "Name", role: "Role, Organization" },
  { q: "A third sample, so the arrows and the dots have somewhere to go.", who: "Name", role: "Role, Organization" },
];

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
  const cur = quotes[i];
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
  return (
    <div className="L-car2" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="L-car2-logo" key={`m${i}`} aria-label="Client mark, temporary">
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
 */
export function HeroVideo() {
  const [full, setFull] = useState(false);
  return (
    <div className={`ph ph-tall L-video${full ? " is-full" : ""}`} onClick={() => setFull((f) => !f)} role="button" aria-label={full ? "Back to the loop" : "Play the full video"}>
      <video
        key={full ? "full" : "loop"}
        src="/hero-test.mp4"
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
}

export function Section({ def, variant, go, copy = {} }: { def: (typeof SECTIONS)[number]; variant: string; go: (p: PageId) => void; copy?: CopyOverrides }) {
  const v = variant.replace(`${def.id}-`, "");
  const headed = !["hero", "thesis", "meaning", "start"].includes(def.id) && !(def.id === "voices" && v === "carousel");
  return (
    <section className={`L-sec L-s-${def.id}${headed ? " L-sec-h" : ""}`} data-v={v} data-n={String(def.n).padStart(2, "0")} id={def.id}>
      {/* the close carries the synapse field, parallaxed against the band */}
      {def.id === "start" && <Synapse scope="section" />}
      <div className="L-wrap">
        {def.id === "hero" && (
          <div className="L-hero-grid">
            <div className="L-hero-copy">
              {copy.eyebrowOnThesis || copy.noEyebrow ? null : <p className="eyebrow">Organizational and high-performance consulting</p>}
              <h1 className="display">High performance <em>without</em> the cost to people.</h1>
              {copy.heroLede === null ? null : (
                <p className="lede">{copy.heroLede ?? "Most teams leak performance through their environment, not their effort. Samuh finds where yours is leaking, and gives you the practices to close it."}</p>
              )}
              {copy.noHeroCtas ? null : (
                <div className="cta-row">
                  <button className="btn" onClick={() => go("start")}>Get started <span className="arrow">&rarr;</span></button>
                  <button className="btn btn-secondary" onClick={() => go("contact")}>Talk to us</button>
                </div>
              )}
            </div>
            <HeroVideo />
          </div>
        )}

        {def.id === "thesis" && (
          <>
          {copy.eyebrowOnThesis && !copy.noEyebrow ? <p className="eyebrow L-thesis-eyebrow">Organizational and high-performance consulting</p> : null}
          <div className={`L-thesis-in${copy.thesisWithMeaning ? " L-thesis-duo" : ""}`}>
            <p className="L-big">{copy.thesis ?? "Every leadership team leaks performance. Few can see where. You have already paid for the talent. The question is whether the team\u2019s conditions let you get the full return."}</p>
            {copy.thesisWithMeaning ? <Dictionary /> : null}
            {copy.noPartnerLine ? null : <span className="L-cap">In partnership with Sapien Labs</span>}
          </div>
          </>
        )}

        {def.id === "meaning" && !copy.thesisWithMeaning && <Dictionary />}

        {def.id === "circles" && v === "nested" && (
          <>
            <Head def={def} />
            <Circles />
          </>
        )}

        {def.id === "circles" && v !== "nested" && (
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
            <blockquote className="L-research">
              <p className="L-big">The environment inside a team shapes how much capacity its people can bring to the work. What was previously inferred can now be measured.</p>
              <a href="#" className="inline-link" onClick={stay}>Sapien Labs Work Culture Report</a>
            </blockquote>
          </>
        )}

        {def.id === "voices" && v === "carousel" && <Carousel />}

        {def.id === "voices" && v !== "carousel" && (
          <>
            <Head def={def} />
            <div className="L-voices">
              {[0, 1, 2].map((i) => (
                <figure className="card L-quote" key={i}>
                  <blockquote>&ldquo;Sample testimonial. Two or three sentences in the client&rsquo;s own words about what changed for the team.&rdquo;</blockquote>
                  <figcaption className="L-cap">Name &middot; Role &middot; Organization</figcaption>
                </figure>
              ))}
            </div>
          </>
        )}

        {def.id === "case" && (
          <>
            <Head def={def} />
            <div className="L-case">
              <span className="L-case-img">
                <Image src="/case-study.png" alt="Samuh case study: 1 high-performance practice. 90 days. Measurable change." width={2490} height={1404} sizes="(max-width: 900px) 100vw, 560px" />
              </span>
              <div>
                <span className="card-tag">Case study · Senior leadership team, Fortune 10 healthcare company</span>
                <p className="L-big L-case-line">1 high-performance ritual. 90 days. Measurable change.</p>
                <dl className="L-case-stats">
                  {[
                    ["+39%", "most improved practice"],
                    ["12/13", "team practices improved"],
                    ["Embedded", "a new way of working that has stuck"],
                  ].map(([n, l]) => (
                    <div className="L-stat" key={n}>
                      <dt className="L-stat-n">{n}</dt>
                      <dd className="L-cap">{l}</dd>
                    </div>
                  ))}
                </dl>
                <a href="#" className="inline-link" onClick={stay}>Read the case study</a>
              </div>
            </div>
          </>
        )}

        {def.id === "tool" && (
          <>
            <Head def={def} />
            <div className="L-tool">
              <div className="L-sliders">
                {["Social", "Autonomous", "Meaningful", "Healthy"].map((f) => (
                  <label className="L-slider" key={f}>
                    <span>{f}</span>
                    <span className="L-track"><span className="L-thumb" /></span>
                  </label>
                ))}
              </div>
              <div className="L-result">
                <span className="L-cap">Estimated productive days lost per month</span>
                <span className="L-number">&mdash;</span>
                <span className="L-cap">Your estimate appears here as you move the sliders. Our own intake tool, not TeamQ, not diagnostic.</span>
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
            <MetaphorGallery />
          </>
        )}

        {def.id === "cards" && v !== "rotate" && v !== "gallery" && (
          <>
            <Head def={def} />
            <div className="L-cards">
              {ARCHETYPES.map(([name, line, src]) => (
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

        {def.id === "start" && (
          <div className="L-start">
            <div>
              <h2 className="sec">What could stronger performance look like for your team?</h2>
              <p className="L-mid">Free and ungated. The first insight lands before the first ask.</p>
            </div>
            <div className="L-start-actions">
              <div className="field">
                <input type="text" placeholder="How many people are on your team?" />
                <button className="btn">Start</button>
              </div>
              <div className="cta-row">
                <button className="btn" onClick={() => go("start")}>Get started <span className="arrow">&rarr;</span></button>
                <button className="btn btn-secondary" onClick={() => go("contact")}>Talk to us</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
