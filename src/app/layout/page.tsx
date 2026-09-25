"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BACKGROUNDS, cssVars, comboName } from "@/lib/tokens";
import {
  ALIGNS, WIDTHS, SPACINGS, NAVS, DIVIDERS, NUMBERS, COMPS, VIEWS,
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
      <aside className="rail" data-open={railOpen} aria-label="Layout tool">
        {railOpen ? (
          <>
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
                From Mike&apos;s link of 25 September. Colors, fonts, lines and motion are fixed here.
                To revisit them, <a className="rail-link" href={`/design${LOCKED_HASH}`}>open the style picker</a>.
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
                  <div className="ctrl">
                    <span className="ctrl-label">Viewport · preview only</span>
                    <div className="ctrl-opts">
                      {VIEWS.map((x) => (
                        <button key={x.id} className="opt" aria-pressed={x.id === view} onClick={() => set({ view: x.id })}>
                          {x.name} <span className="opt-n">{x.px}</span>
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
          >
            <div className="L-bd" aria-hidden>
              <Backdrop id={layout.bg} pointer="well" />
            </div>
            <div className="L-body">
              <Nav page={layout.page} go={go} menu={layout.nav.id === "nav-menu"} />
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

function Nav({ page, go, menu }: { page: PageId; go: (p: PageId) => void; menu: boolean }) {
  const [open, setOpen] = useState(false);
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
        <span className="L-menu tbtn" onClick={() => setOpen(true)}>Menu</span>
        <button className="btn btn-small" onClick={() => jump("start")}>Get started <span className="arrow">&rarr;</span></button>
      </header>
      {menu && open ? (
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

// Copy here is confirmed material only (docs/content.md). Everything else
// is a visible TODO(content) or a labelled placeholder frame.

function Head({ def }: { def: (typeof SECTIONS)[number] }) {
  return (
    <div className="L-head">
      <span className="L-n">{String(def.n).padStart(2, "0")}</span>
      <div>
        <p className="eyebrow L-eyebrow">{def.intent}</p>
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
  const sq = (x: number, y: number) => <rect x={x - 5} y={y - 5} width={10} height={10} className="L-c-sq" />;
  return (
    <div className="L-circ">
      <p className="L-c-call L-c-left">Where people experience their work life</p>
      <svg className="L-c-svg" viewBox="0 0 640 440" role="img" aria-label="Three nested circles: organization, team, individual">
        {/* leader lines run to the edges, where the callouts sit */}
        <line x1={0} y1={220} x2={205} y2={220} className="L-c-line" />
        {sq(205, 220)}
        <polyline points="640,220 470,110" className="L-c-line" />
        <polyline points="640,220 440,352" className="L-c-line" />
        {sq(470, 110)}
        {sq(440, 352)}
        {/* circles */}
        <circle cx={320} cy={220} r={190} className="L-c-org" />
        <circle cx={320} cy={182} r={128} className="L-c-team" />
        <circle cx={320} cy={100} r={52} className="L-c-ind" />
        {/* labels */}
        <text x={320} y={106} className="L-c-t L-c-t-ind">Individual</text>
        <text x={320} y={236} className="L-c-t L-c-t-team">Team</text>
        <text x={320} y={362} className="L-c-t L-c-t-org">Organization</text>
      </svg>
      <p className="L-c-call L-c-right">Where organizations focus</p>
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
      <span className="L-cap">{TODO("confirm pronunciation with SAMUH and record the word. Placeholder voice for now")}</span>
    </div>
  );
}

function Frame({ label, tall }: { label: string; tall?: boolean }) {
  return <div className={`ph${tall ? " ph-tall" : ""}`}>{label}</div>;
}

const TODO = (what: string) => `TODO(content): ${what}`;

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
              <p className="lede">{TODO("hero lede, must match Daniel's video script")}</p>
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
            <p className="L-big">{TODO("the problem SAMUH solves, one or two sentences")}</p>
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
              {["Organization", "Team", "Individual"].map((c, i) => (
                <div className={`L-circle L-circle-${i}`} key={c}>
                  <span className="L-circle-label">{c}</span>
                  <span className="L-circle-note">{TODO(`one line on the ${c.toLowerCase()}`)}</span>
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
              <p className="L-big">{TODO("the aspirational statement")}</p>
              <ul className="L-cols">
                {["Cognitive", "Relational", "Emotional", "Physical"].map((c) => (
                  <li key={c}><span className="L-col-title">{c}</span><span className="L-col-note">{TODO("competency line")}</span></li>
                ))}
              </ul>
            </div>
          </>
        )}

        {def.id === "research" && (
          <>
            <Head def={def} />
            <blockquote className="L-research">
              <p className="L-big">{TODO("one research-backed statement, SAMUH owns the wording")}</p>
              <a href="#" className="inline-link" onClick={stay}>Sapien Labs Work Culture Report</a>
            </blockquote>
          </>
        )}

        {def.id === "voices" && (
          <>
            <Head def={def} />
            <div className="L-voices">
              {[0, 1, 2].map((i) => (
                <figure className="card L-quote" key={i}>
                  <blockquote>{TODO("testimonial quote")}</blockquote>
                  <figcaption className="L-cap">{TODO("attribution, cleared for publication")}</figcaption>
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
                <p className="L-mid">{TODO("anonymised snippet, cleared by Rahul")}</p>
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
                <span className="L-number">{TODO("model")}</span>
                <span className="L-cap">Our own intake tool. Not TeamQ, not diagnostic.</span>
              </div>
            </div>
          </>
        )}

        {def.id === "cards" && (
          <>
            <Head def={def} />
            <div className="L-cards">
              {[0, 1, 2, 3].map((i) => (
                <article className="card L-arche" key={i}>
                  <Frame label="Illustration" />
                  <h3>{TODO("archetype name")}</h3>
                  <p>{TODO("two lines you recognise yourself in")}</p>
                </article>
              ))}
            </div>
          </>
        )}

        {def.id === "equation" && (
          <>
            <Head def={def} />
            <div className="L-equation">
              <div className="L-eq">
                {["Team environment", "+", "Team practices", "=", "Capacity to perform", "→", "Performance"].map((t, i) => (
                  <span key={i} className={/^[+=→]$/.test(t) ? "L-eq-op" : "L-eq-term"}>{t}</span>
                ))}
              </div>
              <p className="L-mid">{TODO("two sentences on how the equation reads, from the introduction deck")}</p>
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
