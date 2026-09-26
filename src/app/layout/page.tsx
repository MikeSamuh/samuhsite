"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { BACKGROUNDS, cssVars, comboName } from "@/lib/tokens";
import {
  ALIGNS, WIDTHS, SPACINGS, NAVS, DIVIDERS, NUMBERS, HEADS, BUTTONS, COMPS, VIEWS,
  SECTIONS, PAGES, PRESETS, FEEDBACK, OFF, LOCKED_HASH,
  DEFAULT_LAYOUT, lockedCombo, layoutHash, parseLayoutHash, sameLayout,
  layoutName, layoutVars,
  type Layout, type SectionId, type PageId, type Opt,
} from "@/lib/layout";
import { Page } from "./pages";
import Backdrop from "../design/Backdrop";
import "../design/backdrops.css";
import "../design/design.css";
import "./layout.css";

const stay = (e: React.MouseEvent) => e.preventDefault();
const LOGO_H = 285;

/**
 * The layout tool. Style is locked, the page is the twelve home sections,
 * and the rail changes how each one is composed. Same rail, same hash idea
 * as /design, so the client already knows how it works.
 */
export default function LayoutTool() {
  const [layout, setLayout] = useState<Layout>(DEFAULT_LAYOUT);
  const [railOpen, setRailOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const railRef = useRef<HTMLElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  // the pinned head's height, so section headers stack under it not behind it
  useEffect(() => {
    const rail = railRef.current;
    const top = topRef.current;
    if (!rail || !top) return;
    const ro = new ResizeObserver(() => rail.style.setProperty("--rail-top", `${top.offsetHeight}px`));
    ro.observe(top);
    return () => ro.disconnect();
  }, [railOpen]);
  const combo = lockedCombo(layout.bg);
  const set = (patch: Partial<Layout>) => setLayout((l) => ({ ...l, ...patch }));
  const setSection = (id: SectionId, v: string) =>
    setLayout((l) => ({ ...l, sections: { ...l.sections, [id]: v } }));
  const go = (p: PageId) => {
    set({ page: p });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const read = () =>
      setLayout(window.location.hash.length > 1 ? parseLayoutHash(window.location.hash) : DEFAULT_LAYOUT);
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  useEffect(() => {
    window.history.replaceState(null, "", layoutHash(layout));
  }, [layout]);

  // scroll progress for the backgrounds that use it
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      document.documentElement.style.setProperty("--scroll-p", p.toFixed(4));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  const copyLink = () => {
    const url = `${window.location.origin}/layout${layoutHash(layout)}`;
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  };

  const name = layoutName(layout);
  const view = layout.view;
  const viewPx = VIEWS.find((v) => v.id === view)?.px ?? 1440;

  const opts = <Id extends string>(label: string, list: Opt<Id>[], current: Opt<Id>, pick: (x: Opt<Id>) => void) => (
    <div className="ctrl">
      <span className="ctrl-label">{label}</span>
      <div className="ctrl-opts">
        {list.map((x) => (
          <button key={x.id} className="opt" aria-pressed={x.id === current.id} onClick={() => pick(x)} title={x.note}>
            {x.name}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div
      className="stage L-stage"
      style={{ ...cssVars(combo), ...layoutVars(layout) }}
      data-approach="modern"
      data-fill="solid"
      data-hover={combo.hover.id}
      data-entrance="still"
    >
      <aside className="rail" data-open={railOpen} aria-label="Layout tool" ref={railRef}>
        {railOpen ? (
          <>
            <div className="rail-pin" ref={topRef}>
            <div className="rail-preview" role="group" aria-label="Preview device">
              <span className="rail-preview-k">Preview:</span>
              {VIEWS.map((x) => (
                <button key={x.id} className="opt opt-tight" aria-pressed={x.id === view} onClick={() => set({ view: x.id })} title={`${x.px}px wide`}>
                  {x.name}
                </button>
              ))}
            </div>
            <div className="rail-top">
            <div className="rail-head">
              <span className="rail-title">
                <span className="rail-now">Layout · now showing</span>
                {name}
              </span>
              <span className="rail-actions">
                <button className="tbtn tbtn-accent" onClick={copyLink}>{copied ? "Copied" : "Copy link"}</button>
                <button className="tbtn" onClick={() => setRailOpen(false)} aria-expanded="true" aria-controls="rail-dials">Minimise</button>
              </span>
            </div>
            <div className="rail-sum" aria-label="Current selection, short form">
              <span className="rail-sum-line">
                {PAGES.find((x) => x.id === layout.page)?.name ?? layout.page} page · {comboName(combo)} · {viewPx}px
              </span>
              <span className="rail-sum-line">
                {layout.align.name} · {layout.width.name} · {layout.spacing.name} · {layout.nav.name} · {layout.comp.name}
              </span>
            </div>
            </div>
            </div>

            <div className="rail-block picks">
              <p className="rail-kicker">01 · Layouts</p>
              {PRESETS.map((p) => {
                const pl = parseLayoutHash(p.hash);
                const on = sameLayout(layout, { ...pl, bg: layout.bg });
                return (
                  <button className="pick" key={p.id} aria-pressed={on} onClick={() => setLayout({ ...pl, bg: layout.bg, view: layout.view })} title={p.note}>
                    <span className="pick-dot L-letter">{p.letter}</span>
                    <span className="pick-title">{p.name}</span>
                    <span className="pick-name">{p.note}</span>
                  </button>
                );
              })}
            </div>

            <div className="rail-block picks">
              <p className="rail-kicker">02 · Feedback</p>
              {FEEDBACK.map((f) => (
                <div className="pick pick-static" key={f.date + f.title}>
                  <span className="pick-dot" style={{ background: combo.accent.hex }} />
                  <span className="pick-title">{f.title}</span>
                  <span className="pick-name">{f.date}</span>
                  <span className="pick-quote">{f.quote}</span>
                </div>
              ))}
            </div>

            <div className="rail-block guide">
              <p className="rail-kicker">03 · Locked style</p>
              <div className="guide-chips">
                <div className="chip" style={{ background: combo.accent.hex, color: combo.accent.on }}>
                  <span className="chip-k">Primary</span>
                  <span className="chip-v">{combo.accent.family} {combo.accent.name}</span>
                  <span className="chip-hex">{combo.accent.hex}</span>
                </div>
                <div className="chip" style={{ background: combo.accent2.hex, color: combo.accent2.on }}>
                  <span className="chip-k">Secondary</span>
                  <span className="chip-v">{combo.accent2.family} {combo.accent2.name}</span>
                  <span className="chip-hex">{combo.accent2.hex}</span>
                </div>
              </div>
              <div className="guide-type">
                <span className="guide-aa">Aa</span>
                <span>
                  <span className="guide-v">{combo.type.displayName} {combo.type.displayWeight}</span>
                  <span className="guide-sub">{combo.type.bodyName} for body · {combo.caption?.name} captions · {combo.weight.name} {combo.scale.name}</span>
                </span>
              </div>
              <p className="rail-note">
                To revisit the style, <a className="rail-link" href={`/design${LOCKED_HASH}`}>open the style picker</a>.
              </p>
            </div>

            <div className="rail-block" id="rail-dials">
              <p className="rail-kicker">04 · Arrange</p>
              <div className="dials">
                <details className="sect" open>
                  <summary>Stage</summary>
                  <div className="ctrl">
                    <span className="ctrl-label">Page · the nav works too</span>
                    <div className="ctrl-opts">
                      {PAGES.map((x) => (
                        <button key={x.id} className="opt" aria-pressed={x.id === layout.page} onClick={() => go(x.id)} title={x.note}>
                          {x.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="ctrl">
                    <span className="ctrl-label">Background · site wide</span>
                    <div className="ctrl-opts">
                      {BACKGROUNDS.map((x) => (
                        <button key={x.id} className="opt" aria-pressed={x.id === layout.bg} onClick={() => set({ bg: x.id })} title={x.bet}>
                          <span className="opt-n">{x.n}</span>{x.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </details>

                <details className="sect" open>
                  <summary>Frame</summary>
                  {opts("Composition", COMPS, layout.comp, (x) => set({ comp: x }))}
                  {opts("Alignment", ALIGNS, layout.align, (x) => set({ align: x }))}
                  {opts("Column width", WIDTHS, layout.width, (x) => set({ width: x as typeof layout.width }))}
                  {opts("Section spacing", SPACINGS, layout.spacing, (x) => set({ spacing: x as typeof layout.spacing }))}
                  {opts("Navigation", NAVS, layout.nav, (x) => set({ nav: x }))}
                  {opts("Dividers", DIVIDERS, layout.divider, (x) => set({ divider: x }))}
                  {opts("Buttons", BUTTONS, layout.buttons, (x) => set({ buttons: x }))}
                  {opts("Section heads", HEADS, layout.heads, (x) => set({ heads: x }))}
                  {opts("Section numbers", NUMBERS, layout.numbers, (x) => set({ numbers: x }))}
                </details>

                <details className="sect" open={layout.page === "home"}>
                  <summary>Home sections</summary>
                  {SECTIONS.map((s) => (
                    <div className="ctrl" key={s.id}>
                      <span className="ctrl-label"><span className="opt-n">{String(s.n).padStart(2, "0")}</span>{s.title}</span>
                      <div className="ctrl-opts">
                        {s.variants.map((v) => (
                          <button key={v.id} className="opt" aria-pressed={layout.sections[s.id] === v.id} onClick={() => setSection(s.id, v.id)} title={v.note}>
                            {v.name}
                          </button>
                        ))}
                        <button className="opt opt-off" aria-pressed={layout.sections[s.id] === `${s.id}-${OFF}`} onClick={() => setSection(s.id, `${s.id}-${OFF}`)} title="Hide this section">
                          Off
                        </button>
                      </div>
                    </div>
                  ))}
                </details>
              </div>
              <p className="rail-hash">{layoutHash(layout)}</p>
            </div>
          </>
        ) : (
          <button className="rail-expand" onClick={() => setRailOpen(true)} aria-expanded="false" aria-controls="rail-dials">
            <span>{name} · layout tool</span>
          </button>
        )}
      </aside>

      <div className="content L-content">
        <div className="L-frame" style={{ "--view-w": `${viewPx}px` } as React.CSSProperties} data-view={view}>
          <div
            className="L-page"
            data-align={layout.align.id}
            data-comp={layout.comp.id}
            data-nav={layout.nav.id}
            data-rule={layout.divider.id}
            data-numbers={layout.numbers.id}
            data-heads={layout.heads.id}
            data-btn={layout.buttons.id}
          >
            <div className="L-bd" aria-hidden>
              <Backdrop id={layout.bg} pointer="well" />
            </div>
            <div className="L-body">
              <Nav page={layout.page} go={go} menu={layout.nav.id === "nav-menu"} explore={layout.nav.id === "nav-minimal"} />
              {layout.page === "home"
                ? SECTIONS.map((s) => {
                    const v = layout.sections[s.id];
                    if (v === `${s.id}-${OFF}`) return null;
                    return <Section key={s.id} def={s} variant={v} go={go} />;
                  })
                : <Page id={layout.page} go={go} />}
              <footer className="L-foot L-wrap">
                <span className="L-cap">SAMUH · in partnership with Sapien Labs</span>
                <nav className="L-foot-links" aria-label="Footer">
                  {PAGES.filter((x) => x.nav && x.id !== "home").map((x) => (
                    <a key={x.id} className="L-cap" onClick={() => go(x.id)}>{x.name}</a>
                  ))}
                </nav>
                <span className="L-cap">Privacy · Terms · Cookies</span>
              </footer>
            </div>
          </div>
        </div>
        <p className="L-under">
          {comboName(combo)} · {name} · {viewPx}px
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Nav                                                                 */
/* ------------------------------------------------------------------ */

function Nav({ page, go, menu, explore }: { page: PageId; go: (p: PageId) => void; menu: boolean; explore: boolean }) {
  const [open, setOpen] = useState(false);
  const overlay = menu || explore;
  const links = PAGES.filter((x) => x.nav && x.id !== "home");
  const jump = (p: PageId) => { setOpen(false); go(p); };
  return (
    <>
      <header className="L-nav L-wrap">
        {menu ? (
          <button className="L-burger" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="L-overlay" aria-label="Menu">
            <span /><span /><span />
          </button>
        ) : null}
        <a href="#" className="nav-logo" onClick={(e) => { stay(e); jump("home"); }} aria-label="SAMUH home">
          <Image src="/samuh-logo.png" alt="SAMUH" width={960} height={LOGO_H} priority />
        </a>
        <nav className="nav-links L-links" aria-label="Primary">
          {links.map((x) => (
            <a key={x.id} href="#" onClick={(e) => { stay(e); jump(x.id); }} aria-current={x.id === page ? "page" : undefined}>{x.name}</a>
          ))}
        </nav>
        <button className="btn btn-secondary btn-small L-menu" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="L-overlay">Explore</button>
        <button className="btn btn-small" onClick={() => jump("start")}>Get started <span className="arrow">&rarr;</span></button>
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

function Head({ def }: { def: (typeof SECTIONS)[number] }) {
  return (
    <div className="L-head">
      <span className="L-n">{String(def.n).padStart(2, "0")}</span>
      <div>
        {def.kicker ? <p className="eyebrow L-eyebrow">{def.kicker}</p> : null}
        <h2 className="sec">{def.title}</h2>
      </div>
    </div>
  );
}

/**
 * The three circles, after the client's sketch of 25 September: the
 * organization houses the team, the team houses the individual, and the
 * individual sits at the top of the team. Two callouts: the team is where
 * people experience their work life, the individual and the organization
 * are where organizations focus. Only the team circle carries the accent.
 */
function Circles() {
  const sq = (x: number, y: number, cls: string) => <rect x={x - 5} y={y - 5} width={10} height={10} className={`L-c-sq ${cls}`} />;
  return (
    <div className="L-circ">
      <p className="L-c-call L-c-left L-c-hi">Where people experience their work life</p>
      <svg className="L-c-svg" viewBox="0 0 640 440" role="img" aria-label="Three nested circles: organization, team, individual">
        {/* leader lines run to the edges, where the callouts sit. The left
            one lands inside the team, the right pair inside the individual
            and inside the organization ring */}
        <line x1={0} y1={220} x2={215} y2={220} className="L-c-line L-c-hi" />
        {sq(215, 220, "L-c-hi")}
        <polyline points="640,220 352,98" className="L-c-line L-c-alt" />
        <polyline points="640,220 440,352" className="L-c-line L-c-alt" />
        {sq(352, 98, "L-c-alt")}
        {sq(440, 352, "L-c-alt")}
        {/* circles */}
        <circle cx={320} cy={220} r={190} className="L-c-org" />
        <circle cx={320} cy={182} r={128} className="L-c-team" />
        <circle cx={320} cy={120} r={46} className="L-c-ind" />
        {/* labels */}
        <text x={320} y={126} className="L-c-t L-c-t-ind">Individual</text>
        <text x={320} y={246} className="L-c-t L-c-t-team">Team</text>
        <text x={320} y={362} className="L-c-t L-c-t-org">Organization</text>
      </svg>
      <p className="L-c-call L-c-right L-c-alt">Where organizations focus</p>
    </div>
  );
}

/**
 * "What SAMUH means", set like a dictionary entry: headword, a speaker
 * that says it, pronunciation, part of speech and origin, then the
 * definition. The audio is a placeholder made with the Mac speech engine
 * until SAMUH records the word; the browser's own voice is the fallback.
 */
function Dictionary() {
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
        <li>A group of people who come together for a purpose larger than themselves.</li>
      </ol>
      <span className="L-cap">Placeholder voice. SAMUH to confirm the pronunciation and record it.</span>
    </div>
  );
}

const QUOTES = [
  { q: "Sample testimonial. Two or three sentences in the client\u2019s own words about what changed for the team, and what it felt like to work this way.", who: "Name", role: "Role, Organization" },
  { q: "A second sample. Long enough to show how a real quote wraps at this size, short enough to read in one breath.", who: "Name", role: "Role, Organization" },
  { q: "A third sample, so the arrows and the dots have somewhere to go.", who: "Name", role: "Role, Organization" },
];

/** One elegant italic quote at a time, attribution under it, the client's mark under that. */
function Carousel() {
  const [i, setI] = useState(0);
  const n = QUOTES.length;
  const go = (d: number) => setI((x) => (x + d + n) % n);
  const cur = QUOTES[i];
  return (
    <div className="L-carousel">
      <button className="L-car-arrow" onClick={() => go(-1)} aria-label="Previous testimonial">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <figure className="L-car-slide" key={i}>
        <blockquote>&ldquo;{cur.q}&rdquo;</blockquote>
        <figcaption>
          <span className="L-car-who">{cur.who}</span>
          <span className="L-cap">{cur.role}</span>
          <span className="L-car-mark" aria-label="Client mark">Client mark</span>
        </figcaption>
      </figure>
      <button className="L-car-arrow" onClick={() => go(1)} aria-label="Next testimonial">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
    </div>
  );
}

function Frame({ label, tall }: { label: string; tall?: boolean }) {
  return <div className={`ph${tall ? " ph-tall" : ""}`}>{label}</div>;
}

function Section({ def, variant, go }: { def: (typeof SECTIONS)[number]; variant: string; go: (p: PageId) => void }) {
  const v = variant.replace(`${def.id}-`, "");
  const headed = !["hero", "thesis", "meaning", "start"].includes(def.id);
  return (
    <section className={`L-sec L-s-${def.id}${headed ? " L-sec-h" : ""}`} data-v={v} data-n={String(def.n).padStart(2, "0")} id={def.id}>
      <div className="L-wrap">
        {def.id === "hero" && (
          <div className="L-hero-grid">
            <div className="L-hero-copy">
              <p className="eyebrow">Organizational and high-performance consulting</p>
              <h1 className="display">High performance <em>without</em> the cost to people.</h1>
              <p className="lede">Most teams leak performance through their environment, not their effort. Samuh finds where yours is leaking, and gives you the practices to close it.</p>
              <div className="cta-row">
                <button className="btn" onClick={() => go("start")}>Get started <span className="arrow">&rarr;</span></button>
                <button className="btn btn-secondary" onClick={() => go("contact")}>Book a call</button>
              </div>
            </div>
            <Frame label="Hero video · muted loop, full video on click" tall />
          </div>
        )}

        {def.id === "thesis" && (
          <div className="L-thesis-in">
            <p className="L-big">Every leadership team leaks performance. Few can see where. You have already paid for the talent. The question is whether the team&rsquo;s conditions let you get the full return.</p>
            <span className="L-cap">In partnership with Sapien Labs</span>
          </div>
        )}

        {def.id === "meaning" && <Dictionary />}

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

        {def.id === "voices" && v === "carousel" && (
          <>
            <Head def={def} />
            <Carousel />
          </>
        )}

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
              <Frame label="Case study image or client mark · contract check first" />
              <div>
                <span className="card-tag">Case study · a Fortune 10 leadership team</span>
                <p className="L-mid">A business unit president wanted more rigor in how the team challenged and strengthened its biggest strategic bets. The team chose feedback on strategic initiatives as the practice to improve, and built one ritual around it.</p>
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

        {def.id === "cards" && (
          <>
            <Head def={def} />
            <div className="L-cards">
              {[
                ["The Fire Brigade", "Brilliant in a crisis, exhausted by Thursday. Nothing gets planned because everything gets rescued."],
                ["The Silo Farm", "Six strong people, six separate plans. Information travels by rumour."],
                ["The Quiet Room", "Meetings end in agreement and nothing changes. The real conversation happens afterwards, in pairs."],
                ["The Flywheel", "Feedback is a habit, not an event. The team knows what it is working on and why."],
              ].map(([name, line]) => (
                <article className="card L-arche" key={name}>
                  <Frame label="Illustration" />
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
                <button className="btn btn-secondary" onClick={() => go("contact")}>Book a call</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
