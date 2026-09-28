"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { PAGES, SECTIONS, type PageId } from "@/lib/layout";

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
}

export function Nav({ page, go, menu, explore, links: order, brand = "wordmark" }: NavProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overlay = menu || explore;
  const links = order
    ? order.map((id) => PAGES.find((x) => x.id === id)!).filter(Boolean)
    : PAGES.filter((x) => x.nav && x.id !== "home");
  const jump = (p: PageId) => { setOpen(false); go(p); };
  useEffect(() => {
    if (brand !== "icons") return;
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [brand]);
  return (
    <>
      <header className={`L-navbar${brand === "icons" ? " L-nav-icons" : ""}`} data-scrolled={scrolled}>
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
/**
 * The three circles. All three are drawn toward the pointer and tethered,
 * so none moves more than five percent of the frame. The callouts stay
 * hidden until a circle is hovered: the team shows where people experience
 * their work life, the individual and the organization show where
 * organizations focus.
 */
export function Circles() {
  const sq = (x: number, y: number, cls: string) => <rect x={x - 5} y={y - 5} width={10} height={10} className={`L-c-sq ${cls}`} />;
  const [pull, setPull] = useState({ x: 0, y: 0 });
  const [hot, setHot] = useState<"org" | "team" | "ind" | null>(null);
  const LIMIT = 32; // five percent of the 640 frame
  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    // pointer in frame units, relative to the centre of the picture
    const px = ((e.clientX - r.left) / r.width) * 640 - 320;
    const py = ((e.clientY - r.top) / r.height) * 440 - 220;
    const d = Math.hypot(px, py) || 1;
    const k = Math.min(1, d / 260); // farther pointer, firmer pull, until the tether
    setPull({ x: (px / d) * LIMIT * k, y: (py / d) * LIMIT * k });
  };
  const at = (share: number) => `translate(${(pull.x * share).toFixed(1)} ${(pull.y * share).toFixed(1)})`;
  const side = hot === "team" ? "left" : hot ? "right" : "";
  return (
    <div className="L-circ" data-side={side}>
      <p className="L-c-call L-c-left L-c-hi">Where people experience their work life</p>
      <svg
        className="L-c-svg"
        viewBox="0 0 640 440"
        role="img"
        aria-label="Three nested circles: organization, team, individual"
        onMouseMove={onMove}
        onMouseLeave={() => { setPull({ x: 0, y: 0 }); setHot(null); }}
      >
        <g className="L-c-leaders L-c-leaders-left">
          <line x1={0} y1={220} x2={215} y2={220} className="L-c-line L-c-hi" />
          {sq(215, 220, "L-c-hi")}
        </g>
        <g className="L-c-leaders L-c-leaders-right">
          <polyline points="640,220 352,98" className="L-c-line L-c-alt" />
          <polyline points="640,220 440,352" className="L-c-line L-c-alt" />
          {sq(352, 98, "L-c-alt")}
          {sq(440, 352, "L-c-alt")}
        </g>
        <g className="L-c-g" transform={at(0.6)} onMouseEnter={() => setHot("org")} data-on={hot === "org"}>
          <circle cx={320} cy={220} r={190} className="L-c-org" />
          <text x={320} y={362} className="L-c-t L-c-t-org">Organization</text>
        </g>
        <g className="L-c-g" transform={at(0.8)} onMouseEnter={() => setHot("team")} data-on={hot === "team"}>
          <circle cx={320} cy={182} r={128} className="L-c-team" />
          <text x={320} y={246} className="L-c-t L-c-t-team">Team</text>
        </g>
        <g className="L-c-g" transform={at(1)} onMouseEnter={() => setHot("ind")} data-on={hot === "ind"}>
          <circle cx={320} cy={120} r={46} className="L-c-ind" />
          <text x={320} y={126} className="L-c-t L-c-t-ind">Individual</text>
        </g>
      </svg>
      <p className="L-c-call L-c-right L-c-alt">Where organizations focus</p>
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
        <li>A group of people who come together for a purpose larger than themselves.</li>
      </ol>
      <span className="L-cap">Placeholder voice. SAMUH to confirm the pronunciation and record it.</span>
    </div>
  );
}

export const ARCHETYPES = [
  ["The Fire Brigade", "Brilliant in a crisis, exhausted by Thursday. Nothing gets planned because everything gets rescued."],
  ["The Silo Farm", "Six strong people, six separate plans. Information travels by rumour."],
  ["The Quiet Room", "Meetings end in agreement and nothing changes. The real conversation happens afterwards, in pairs."],
  ["The Flywheel", "Feedback is a habit, not an event. The team knows what it is working on and why."],
];

/** One archetype at a time, rotating on a timer. A click on the card skips ahead. */
export function Rotator() {
  const [i, setI] = useState(0);
  const n = ARCHETYPES.length;
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setI((x) => (x + 1) % n), 4200);
    return () => window.clearInterval(t);
  }, [n]);
  const [name, line] = ARCHETYPES[i];
  return (
    <div className="L-rotator">
      <article className="card L-arche L-arche-rot" key={i} onClick={() => setI((x) => (x + 1) % n)}>
        <Frame label="Illustration" />
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
        {ARCHETYPES.map(([n], i) => (
          <button className="L-gal-tile" key={n} onClick={() => setOpen(i)} aria-label={`Open ${n}`}>
            <Frame label="Illustration" />
          </button>
        ))}
      </div>
      {open !== null ? (
        <div className="L-zoom" role="dialog" aria-modal="true" aria-label={name} onClick={close}>
          <div className="L-zoom-in" onClick={(e) => e.stopPropagation()}>
            <button className="L-zoom-x tbtn" onClick={close} aria-label="Close">Close</button>
            <div className="L-zoom-art">
              <Frame label={`Illustration · ${name}`} tall />
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

/** One elegant italic quote at a time, attribution under it, the client's mark under that. */
export function Carousel() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = QUOTES.length;
  const go = (d: number) => setI((x) => (x + d + n) % n);
  const cur = QUOTES[i];
  // auto-advances (client feedback, 27 September). Pauses while hovered
  // and under reduced motion.
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setI((x) => (x + 1) % n), 6500);
    return () => window.clearInterval(t);
  }, [paused, n]);
  return (
    <div className="L-carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
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
}

export function Section({ def, variant, go, copy = {} }: { def: (typeof SECTIONS)[number]; variant: string; go: (p: PageId) => void; copy?: CopyOverrides }) {
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
              {copy.heroLede === null ? null : (
                <p className="lede">{copy.heroLede ?? "Most teams leak performance through their environment, not their effort. Samuh finds where yours is leaking, and gives you the practices to close it."}</p>
              )}
              <div className="cta-row">
                <button className="btn" onClick={() => go("start")}>Get started <span className="arrow">&rarr;</span></button>
                <button className="btn btn-secondary" onClick={() => go("contact")}>Book a call</button>
              </div>
            </div>
            <HeroVideo />
          </div>
        )}

        {def.id === "thesis" && (
          <div className="L-thesis-in">
            <p className="L-big">{copy.thesis ?? "Every leadership team leaks performance. Few can see where. You have already paid for the talent. The question is whether the team\u2019s conditions let you get the full return."}</p>
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
              {ARCHETYPES.map(([name, line]) => (
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
