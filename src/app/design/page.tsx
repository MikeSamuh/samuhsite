"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  BACKGROUNDS,
  ACCENTS,
  TYPE_PAIRS,
  BODY_FONTS,
  FACES,
  FONT_ROLES,
  WEIGHTS,
  LINE_SCALES,
  FILLS,
  POINTERS,
  APPROACHES,
  ENTRANCES,
  HOVERS,
  PICKS,
  DEFAULT_COMBO,
  cssVars,
  comboHash,
  parseComboHash,
  pickCombo,
  ruleWidths,
  bodyName,
  comboName,
  sameCombo,
  type Combo,
  type Accent,
  type Face,
  type TypeGroup,
} from "@/lib/tokens";
import Backdrop from "./Backdrop";
import ColorWheel from "./ColorWheel";
import "./backdrops.css";
import "./design.css";

const NAV = ["Solutions", "Process", "Insights", "About", "Contact"];
const stay = (e: React.MouseEvent) => e.preventDefault();
// set from the cropped file in public/, 960 wide
const LOGO_H = 285;

const PROCESS = [
  ["Prepare", "Baseline the team before anything changes."],
  ["Launch", "Put the practices into the working week."],
  ["Discover", "Surface what the team does under load."],
  ["Awareness", "Name the patterns nobody could see."],
  ["Belonging", "Build the conditions people stay for."],
  ["Action", "Turn insight into standing rituals."],
];

const TIERS = [
  ["Tier 01", "Self-guided", "Fully automated. The team works through the material on its own.", "Price to confirm"],
  ["Tier 02", "Supported", "Self-guided plus periodic support calls from the Samuh team.", "Talk to us"],
  ["Tier 03", "Guided", "In person. The Samuh team delivers the work hands on.", "Talk to us"],
];

export default function DesignDirections() {
  const [combo, setCombo] = useState<Combo>(DEFAULT_COMBO);
  const [railOpen, setRailOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const railRef = useRef<HTMLElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  // the sticky head's height, so section headers stack under it not behind it
  useEffect(() => {
    const rail = railRef.current;
    const top = topRef.current;
    if (!rail || !top) return;
    const ro = new ResizeObserver(() => rail.style.setProperty("--rail-top", `${top.offsetHeight}px`));
    ro.observe(top);
    return () => ro.disconnect();
  }, [railOpen]);
  const copyLink = () => {
    const url = `${window.location.origin}/design${comboHash(combo)}`;
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  };
  const { bg, accent, accent2, accent3, accent4, type, weight, scale, approach, entrance, hover } = combo;
  const rule = ruleWidths(combo);
  const set = (patch: Partial<Combo>) => setCombo((c) => ({ ...c, ...patch }));

  // deep link: /design#aurora.yellow-amber.cyan-samuh.syne.balanced.rise.lift
  // No hash means the client has just arrived, so they see the recommendation.
  useEffect(() => {
    const read = () =>
      setCombo(
        window.location.hash.length > 1
          ? parseComboHash(window.location.hash)
          : pickCombo(PICKS[0])
      );
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  useEffect(() => {
    window.history.replaceState(null, "", comboHash(combo));
  }, [combo]);

  // 1-5 background, q to p across the ten type pairings
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= BACKGROUNDS.length) set({ bg: BACKGROUNDS[n - 1] });
      const ti = "qwertyuiop[]\\;',./".indexOf(e.key.toLowerCase());
      if (ti >= 0 && ti < TYPE_PAIRS.length) set({ type: TYPE_PAIRS[ti] });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Scroll progress, 0 to 1, for backgrounds that change with the scroll.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      document.documentElement.style.setProperty("--scroll-p", p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Entrance: mark each .reveal as it scrolls into view. Re-runs when the
  // entrance option changes so the client sees the new one play immediately.
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    nodes.forEach((n) => n.classList.remove("is-in"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [entrance.id]);

  return (
    <div
      className="stage"
      style={cssVars(combo)}
      data-approach={approach.id}
      data-fill={combo.fill.id}
      data-entrance={entrance.id}
      data-hover={hover.id}
    >
      <Backdrop id={bg.id} pointer={combo.pointer.id} />

      {/* the menu bar: a left rail with every dial, minimisable to a strip */}
      <aside className="rail" data-open={railOpen} aria-label="Style picker" ref={railRef}>
        {railOpen ? (
          <>
            <div className="rail-top" ref={topRef}>
            <div className="rail-head">
              <span className="rail-title">
                <span className="rail-now">Now showing</span>
                {comboName(combo)}
              </span>
              <span className="rail-actions">
                <button className="tbtn tbtn-accent" onClick={copyLink}>
                  {copied ? "Copied" : "Copy link"}
                </button>
                <button
                  className="tbtn"
                  onClick={() => setRailOpen(false)}
                  aria-expanded="true"
                  aria-controls="rail-dials"
                >
                  Minimise
                </button>
              </span>
            </div>
            <div className="rail-sum" aria-label="Current selection, short form">
              <span className="rail-sum-dots" aria-hidden="true">
                {[accent, accent2, accent3, accent4].map((a, i) =>
                  a ? <span key={i} className="rail-sum-dot" style={{ background: a.hex }} /> : <span key={i} className="rail-sum-dot rail-sum-none" />,
                )}
              </span>
              <span className="rail-sum-line">
                {type.displayName} · {bodyName(combo)} · {approach.name} on {bg.name}
              </span>
              <span className="rail-sum-line">
                {weight.name} {scale.name} · {entrance.name} in · {hover.name} on hover
              </span>
            </div>
            </div>

            {(["picks", "feedback"] as const).map((section, i) => (
              <div className="rail-block picks" key={section}>
                <p className="rail-kicker">0{i + 1} · {section === "picks" ? "Saved picks" : "Feedback"}</p>
                {PICKS.filter((p) => p.section === section).map((p) => {
                  const c = pickCombo(p);
                  const on = sameCombo(combo, c);
                  return (
                    <button className="pick" key={p.id} aria-pressed={on} onClick={() => setCombo(c)} title={c.type.name}>
                      <span className="pick-dot" style={{ background: c.accent.hex }} />
                      <span className="pick-title">{p.title}</span>
                      <span className="pick-name">{p.kicker} · {comboName(c)}</span>
                      {p.quote ? <span className="pick-quote">{p.quote}</span> : null}
                    </button>
                  );
                })}
              </div>
            ))}

            <div className="rail-block guide" aria-label="Current selection">
              <p className="rail-kicker">03 · Current selection, updates as you go</p>
              <p className="guide-name">{comboName(combo)}</p>
              <div className="guide-row">
                <span className="guide-k">Approach</span>
                <span className="guide-v">{approach.name} <span className="guide-sub">on {bg.name}</span></span>
              </div>
              <div className="guide-chips">
                <div className="chip" style={{ background: combo.fill.id === "gradient" ? "var(--accent-grad)" : accent.hex, color: accent.on }}>
                  <span className="chip-k">Accent 1 · loud{combo.fill.id === "gradient" ? " · gradient" : ""}</span>
                  <span className="chip-v">{accent.family} {accent.name}</span>
                  <span className="chip-hex">{accent.hex}</span>
                </div>
                <div className="chip" style={{ background: accent2.hex, color: accent2.on }}>
                  <span className="chip-k">Accent 2 · quiet</span>
                  <span className="chip-v">{accent2.family} {accent2.name}</span>
                  <span className="chip-hex">{accent2.hex}</span>
                </div>
                {accent3 ? (
                  <div className="chip" style={{ background: accent3.hex, color: accent3.on }}>
                    <span className="chip-k">Accent 3 · data</span>
                    <span className="chip-v">{accent3.family} {accent3.name}</span>
                    <span className="chip-hex">{accent3.hex}</span>
                  </div>
                ) : null}
                {accent4 ? (
                  <div className="chip chip-wash" style={{ "--wash": accent4.hex } as React.CSSProperties}>
                    <span className="chip-k">Accent 4 · wash</span>
                    <span className="chip-v">{accent4.family} {accent4.name}</span>
                    <span className="chip-hex">{accent4.hex}</span>
                  </div>
                ) : null}
              </div>
              <div className="guide-type">
                <span className="guide-aa">Aa</span>
                <span>
                  <span className="guide-v">{type.displayName} {type.displayWeight}</span>
                  <span className="guide-sub">{bodyName(combo)} for body{combo.body ? "" : " (paired)"} · {type.group}</span>
                </span>
              </div>
              <div className="guide-row">
                <span className="guide-k">Minor</span>
                <span className="guide-v">
                  <span className="guide-sub">eyebrow {combo.eyebrow?.name ?? "Plex Mono"} · captions {combo.caption?.name ?? "Plex Mono"} · ui {combo.ui?.name ?? bodyName(combo)}</span>
                </span>
              </div>
              <div className="guide-row">
                <span className="guide-k">Lines</span>
                <span className="guide-v">{weight.name} {scale.name} <span className="guide-sub">thin {rule.thin} · heavy {rule.fat}</span></span>
              </div>
              <div className="rules guide-rules" aria-hidden="true">
                <span className="rule-thin" />
                <span className="rule-fat" />
              </div>
              <div className="guide-row">
                <span className="guide-k">Motion</span>
                <span className="guide-v">{entrance.name} in · {hover.name} on hover{bg.id === "synapse" ? ` · pointer ${combo.pointer.name}` : ""}</span>
              </div>
            </div>

            <div className="rail-block" id="rail-dials">
              <p className="rail-kicker">04 · Choose your own adventure</p>
              <Dials combo={combo} set={set} />
              <p className="rail-hash">{comboHash(combo)}</p>
            </div>

          </>
        ) : (
          <button
            className="rail-expand"
            onClick={() => setRailOpen(true)}
            aria-expanded="false"
            aria-controls="rail-dials"
          >
            <span>{comboName(combo)} · style picker</span>
          </button>
        )}
      </aside>

      <div className="content">
        <div className="wrap">
          {/* top nav example. Nothing here navigates: the page is a style
              reference, so every link stays put. */}
          <div className="style-bar" aria-label="Current style">
            <span className="style-bar-name">{comboName(combo)}</span>
            <span className="style-bar-spec">
              {bg.name} · {accent.name} + {accent2.name} · {type.displayName} · {weight.name} {scale.name} · {entrance.name} · {hover.name}
            </span>
            <button className="tbtn tbtn-accent" onClick={copyLink}>{copied ? "Copied" : "Copy link"}</button>
          </div>

          <header className="site-nav">
            <a href="#" className="nav-logo" onClick={stay} aria-label="SAMUH home">
              <Image src="/samuh-logo.png" alt="SAMUH" width={960} height={LOGO_H} priority />
            </a>
            <span className="nav-partner">in partnership with Sapien Labs</span>
            <nav className="nav-links" aria-label="Primary">
              {NAV.map((item) => (
                <a key={item} href="#" onClick={stay}>{item}</a>
              ))}
            </nav>
            <button className="btn btn-small">
              Get started <span className="arrow">&rarr;</span>
            </button>
          </header>

          {/* hero */}
          <header className="hero reveal">
            <p className="eyebrow">Organizational and high-performance consulting</p>
            <h1 className="display">
              High performance <em>without</em> the cost to people.
            </h1>
            <p className="lede">
              Most teams leak performance through their environment, not their
              effort. Samuh finds where yours is leaking, and gives you the
              practices to close it.
            </p>
            <div className="cta-row">
              <button className="btn">
                Get started <span className="arrow">&rarr;</span>
              </button>
              <button className="btn btn-secondary">Book a call</button>
            </div>
          </header>

          {/* three circles */}
          <section className="band reveal">
            <div className="sec-head">
              <span className="sec-n">04</span>
              <div>
                <p className="kicker">Motion &middot; bespoke sequence &middot; the organization houses the team, the team houses the individual</p>
                <h2 className="sec">Three circles</h2>
              </div>
            </div>
            <div className="nest">
              <div className="orb orb-org">
                <span className="orb-label">
                  Organization
                </span>
                <div className="orb orb-team">
                  <span className="orb-label">
                    Team
                  </span>
                  <div className="orb orb-ind">
                    <span className="orb-label">
                      Individual
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* process */}
          <section className="band reveal">
            <div className="sec-head">
              <span className="sec-n">05</span>
              <div>
                <p className="kicker">Interaction &middot; panel hover</p>
                <h2 className="sec">The team process</h2>
              </div>
            </div>
            <div className="process">
              {PROCESS.map(([name, note], n) => (
                <div className="step reveal-item" key={name} style={{ "--i": n } as React.CSSProperties}>
                  <span className="step-n">0{n + 1}</span>
                  <span className="step-name">{name}</span>
                  <span className="step-note">{note}</span>
                </div>
              ))}
            </div>
          </section>

          {/* tiers */}
          <section className="band reveal">
            <div className="sec-head">
              <span className="sec-n">06</span>
              <div>
                <p className="kicker">Interaction &middot; card hover</p>
                <h2 className="sec">Ways to engage</h2>
              </div>
            </div>
            <div className="cards">
              {TIERS.map(([tag, title, body, cta], n) => (
                <article className="card reveal-item" key={title} style={{ "--i": n } as React.CSSProperties}>
                  <span className="card-tag">{tag}</span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                  <span className="card-link">
                    {cta} <span>&rarr;</span>
                  </span>
                </article>
              ))}
            </div>
          </section>

          {/* bench */}
          <section className="band reveal">
            <div className="sec-head">
              <span className="sec-n">07</span>
              <div>
                <p className="kicker">Element bench</p>
                <h2 className="sec">Everything that reacts to a pointer</h2>
              </div>
            </div>
            <div className="bench">
              <div>
                <div className="bench-row">
                  <span className="bench-label">Buttons</span>
                  <button className="btn">
                    Primary <span className="arrow">&rarr;</span>
                  </button>
                  <button className="btn btn-secondary">Secondary</button>
                </div>
                <div className="bench-row">
                  <span className="bench-label">Inline link</span>
                  <p style={{ margin: 0, fontSize: 15, lineHeight: 1.75 }}>
                    Read the{" "}
                    <a
                      href="#"
                      className="inline-link"
                      onClick={(e) => e.preventDefault()}
                    >
                      Sapien Labs Work Culture Report
                    </a>{" "}
                    or browse{" "}
                    <a
                      href="#"
                      className="inline-link"
                      onClick={(e) => e.preventDefault()}
                    >
                      the foundations
                    </a>
                    .
                  </p>
                </div>
                <div className="bench-row">
                  <span className="bench-label">Tags</span>
                  <span className="pill is-accent">Research</span>
                  <span className="pill">Team practice</span>
                  <span className="pill">Ritual</span>
                </div>
              </div>
              <div>
                <div className="bench-row">
                  <span className="bench-label">Lead capture &middot; click the field</span>
                  <div className="field">
                    <input type="email" placeholder="you@company.com" />
                    <button className="btn">Send</button>
                  </div>
                </div>
                <div className="bench-row">
                  <span className="bench-label">Motion character</span>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--muted)" }}>
                    {bg.motionNote}
                  </p>
                </div>
                <div className="bench-row">
                  <span className="bench-label">Line weights &middot; {weight.name} {scale.name}</span>
                  <div className="rules" aria-hidden="true">
                    <span className="rule-thin" />
                    <span className="rule-fat" />
                  </div>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--muted)" }}>
                    Hairlines at {rule.thin}, heavy strokes at {rule.fat}.{" "}
                    {weight.note}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* type */}
          <section className="band reveal">
            <div className="sec-head">
              <span className="sec-n">08</span>
              <div>
                <p className="kicker">Typography</p>
                <h2 className="sec">{type.name}</h2>
              </div>
            </div>
            <div className="specimen">
              <div>
                <span className="spec-meta">
                  Display
                  <br />
                  {type.displayName} {type.displayWeight}
                </span>
                <span className="spec-display" style={{ fontSize: 46 }}>
                  Teams change, not people
                </span>
              </div>
              <div>
                <span className="spec-meta">
                  Heading
                  <br />
                  {type.displayName}
                </span>
                <span className="spec-display" style={{ fontSize: 27 }}>
                  Rituals are the vehicle for change
                </span>
              </div>
              <div>
                <span className="spec-meta">
                  Body
                  <br />
                  {bodyName(combo)} 400 &middot; 17/1.65
                </span>
                <span style={{ fontSize: 17, lineHeight: 1.65 }}>
                  The practices only hold if they survive contact with a normal
                  working week. That is the whole design constraint, and it is
                  why the model starts with the team rather than the individual.
                </span>
              </div>
              <div>
                <span className="spec-meta">
                  Caption / data
                  <br />
                  IBM Plex Mono
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12.5,
                    letterSpacing: "0.05em",
                    color: "var(--muted)",
                  }}
                >
                  TODO(content) &middot; SAPIEN LABS TEAM ENVIRONMENT FACTORS
                </span>
              </div>
            </div>
          </section>

          {/* tokens */}
          <section className="band reveal">
            <div className="sec-head">
              <span className="sec-n">09</span>
              <div>
                <p className="kicker">The combination you are looking at</p>
                <h2 className="sec">Design specs</h2>
              </div>
            </div>
            <dl className="tokens">
              <div>
                <dt>Approach</dt>
                <dd>{approach.name} &middot; {approach.note}</dd>
              </div>
              <div>
                <dt>Background</dt>
                <dd>{bg.n} &middot; {bg.name}</dd>
              </div>
              <div>
                <dt>Base color</dt>
                <dd>{bg.base.toUpperCase()}</dd>
              </div>
              <div>
                <dt>Accent 1</dt>
                <dd>{accent.family} {accent.name} &middot; {accent.hex} &middot; {accent.note}</dd>
              </div>
              <div>
                <dt>Accent 2</dt>
                <dd>{accent2.family} {accent2.name} &middot; {accent2.hex} &middot; {accent2.note}</dd>
              </div>
              <div>
                <dt>Accent fill</dt>
                <dd>{combo.fill.name} &middot; {combo.fill.note}</dd>
              </div>
              <div>
                <dt>Accent 3 &middot; data</dt>
                <dd>{accent3 ? `${accent3.family} ${accent3.name} · ${accent3.hex}` : "none, data elements use accent 2"}</dd>
              </div>
              <div>
                <dt>Accent 4 &middot; wash</dt>
                <dd>{accent4 ? `${accent4.family} ${accent4.name} · ${accent4.hex}, tints only` : "none, tints come from accent 1"}</dd>
              </div>
              <div>
                <dt>Display</dt>
                <dd>
                  {type.displayName} {type.displayWeight} &middot; tracking{" "}
                  {type.displayTracking} &middot; leading {type.displayLeading}
                </dd>
              </div>
              <div>
                <dt>Eyebrow</dt>
                <dd>{combo.eyebrow?.name ?? "IBM Plex Mono (default)"}</dd>
              </div>
              <div>
                <dt>Captions and data</dt>
                <dd>{combo.caption?.name ?? "IBM Plex Mono (default)"}</dd>
              </div>
              <div>
                <dt>Buttons and nav</dt>
                <dd>{combo.ui?.name ?? `${bodyName(combo)} (the paragraph face)`}</dd>
              </div>
              <div>
                <dt>Body</dt>
                <dd>{bodyName(combo)}{combo.body ? ` · ${combo.body.note}` : " · the pairing's own"}</dd>
              </div>
              <div>
                <dt>Line weights</dt>
                <dd>{weight.name} {scale.name} &middot; thin {rule.thin} &middot; heavy {rule.fat}</dd>
              </div>
              <div>
                <dt>Corner radius</dt>
                <dd>{bg.radius}</dd>
              </div>
              <div>
                <dt>Transition</dt>
                <dd>{bg.motionDur} {bg.motionEase}</dd>
              </div>
              <div>
                <dt>Entrance</dt>
                <dd>{entrance.name}</dd>
              </div>
              <div>
                <dt>Hover</dt>
                <dd>{hover.name}</dd>
              </div>
              <div>
                <dt>Synapse pointer</dt>
                <dd>{combo.pointer.name} &middot; {combo.pointer.note}</dd>
              </div>
              <div>
                <dt>Share this exact combination</dt>
                <dd>/design{comboHash(combo)}</dd>
              </div>
            </dl>
          </section>

          <footer className="foot">
            <p>
              <strong>Nine dials, not five fixed options.</strong> Approach,
              background, two accents, type, line weight and width, entrance
              and hover move independently, so you are not stuck picking a whole look you only
              half like. Find the background first, then the accents, then the
              type, then the lines and the effects. The URL updates as you go, so you can send a colleague
              the exact combination you landed on. The picker on the left
              minimises out of the way when you want to look at the page.
            </p>
            <p>
              <strong>What we are going for.</strong> Playful and a bit organic,
              never childish. The looseness lives in the background, the motion
              and the gap between the hairlines and the heavy strokes. The
              discipline lives in the typography and the spacing, which is what
              keeps it credible in front of a Fortune 500 buyer.
            </p>
            <p>
              <strong>Two notes.</strong> Your brand book has no color codes in
              it, but your decks do. The pink, cyan, teal and steel marked
              &ldquo;Samuh&rdquo; or &ldquo;sampled&rdquo; in the specs are
              lifted straight from the introduction deck and the Bangalore
              keynote, and the rest of the palette is built around them. And
              the logo sits on top of whichever we pick without changing,
              because the brand book is explicit that the handmade lettering
              must not be recreated.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

/** Every dial. Rendered twice: in the rail and inline in the adventure section. */
function Dials({ combo, set }: { combo: Combo; set: (patch: Partial<Combo>) => void }) {
  const { bg, accent, accent2, accent3, accent4, type, weight, scale, approach, entrance, hover } = combo;
  const swatches = (label: string, current: Accent | null, pick: (x: Accent | null) => void, optional = false) => (
    <div className="ctrl">
      <span className="ctrl-label">{label}</span>
      <div className="ctrl-opts">
        {optional ? (
          <>
            <button
              className="sw sw-none"
              aria-pressed={current === null}
              onClick={() => pick(null)}
              title="None"
              aria-label={`${label}: none`}
            />
            <span className="sw-gap" />
          </>
        ) : null}
        {ACCENTS.map((x, i) => (
          <span key={x.id} style={{ display: "contents" }}>
            {i > 0 && ACCENTS[i - 1].family !== x.family ? <span className="sw-gap" /> : null}
            <button
              className="sw"
              aria-pressed={x.id === current?.id}
              onClick={() => pick(x)}
              style={{ background: x.hex, "--on": x.on } as React.CSSProperties}
              title={`${x.family} ${x.name} · ${x.hex}`}
              aria-label={`${label}: ${x.family} ${x.name}`}
            />
          </span>
        ))}
        <span className="ctrl-value">
          {current ? (
            <>
              <span className="ctrl-dot" style={{ background: current.hex }} />
              {current.family} {current.name} · {current.hex}
            </>
          ) : (
            "none"
          )}
        </span>
      </div>
    </div>
  );

  return (
    <div className="dials">
      <details className="sect">
      <summary>Layout</summary>
      <div className="ctrl">
        <span className="ctrl-label">Approach</span>
        <div className="ctrl-opts">
          {APPROACHES.map((x) => (
            <button key={x.id} className="opt" aria-pressed={x.id === approach.id} onClick={() => set({ approach: x })} title={x.note}>
              {x.name}
            </button>
          ))}
        </div>
      </div>

      <div className="ctrl">
        <span className="ctrl-label">Background</span>
        <div className="ctrl-opts">
          {BACKGROUNDS.map((x) => (
            <button key={x.id} className="opt" aria-pressed={x.id === bg.id} onClick={() => set({ bg: x })}>
              <span className="opt-n">{x.n}</span>
              {x.name}
            </button>
          ))}
        </div>
      </div>

      </details>

      <details className="sect">
      <summary>Colors</summary>
      {swatches("Accent 1 · loud", accent, (x) => set({ accent: x ?? accent }))}
      {swatches("Accent 2 · quiet", accent2, (x) => set({ accent2: x ?? accent2 }))}
      {swatches("Accent 3 · data", accent3, (x) => set({ accent3: x }), true)}
      {swatches("Accent 4 · wash", accent4, (x) => set({ accent4: x }), true)}
      <ColorWheel
        bg={bg}
        current={{ accent, accent2, accent3, accent4 }}
        apply={(slot, x) => set({ [slot]: x } as Partial<Combo>)}
      />

      <div className="ctrl">
        <span className="ctrl-label">Accent fill</span>
        <div className="ctrl-opts">
          {FILLS.map((x) => (
            <button key={x.id} className="opt" aria-pressed={x.id === combo.fill.id} onClick={() => set({ fill: x })} title={x.note}>
              {x.name}
            </button>
          ))}
        </div>
      </div>

      </details>

      <details className="sect">
      <summary>Fonts</summary>
      <div className="ctrl">
        <span className="ctrl-label ctrl-label-row">
          Headlines · display pairing
          <span className="stepper">
            <button className="tbtn" onClick={() => set({ type: TYPE_PAIRS[(TYPE_PAIRS.indexOf(type) - 1 + TYPE_PAIRS.length) % TYPE_PAIRS.length] })} aria-label="Previous type pairing">&larr; prev</button>
            <button className="tbtn" onClick={() => set({ type: TYPE_PAIRS[(TYPE_PAIRS.indexOf(type) + 1) % TYPE_PAIRS.length] })} aria-label="Next type pairing">next &rarr;</button>
          </span>
        </span>
        {(["expressive", "refined", "formal", "classy"] as TypeGroup[]).map((g) => (
          <div className="ctrl-group" key={g}>
            <span className="ctrl-sub">{g}</span>
            <div className="ctrl-opts">
              {TYPE_PAIRS.filter((x) => x.group === g).map((x) => (
                <button key={x.id} className="opt" aria-pressed={x.id === type.id} onClick={() => set({ type: x })}>
                  {x.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="ctrl">
        <span className="ctrl-label ctrl-label-row">
          Paragraph font
          <span className="stepper">
            <button className="tbtn" onClick={() => set({ body: combo.body ? (BODY_FONTS.indexOf(combo.body) === 0 ? null : BODY_FONTS[BODY_FONTS.indexOf(combo.body) - 1]) : BODY_FONTS[BODY_FONTS.length - 1] })} aria-label="Previous paragraph font">&larr; prev</button>
            <button className="tbtn" onClick={() => set({ body: combo.body ? (BODY_FONTS[BODY_FONTS.indexOf(combo.body) + 1] ?? null) : BODY_FONTS[0] })} aria-label="Next paragraph font">next &rarr;</button>
          </span>
        </span>
        <div className="ctrl-opts">
          <button className="opt" aria-pressed={combo.body === null} onClick={() => set({ body: null })} title="Use the pairing's own body face">
            Paired · {type.bodyName}
          </button>
          {BODY_FONTS.map((x) => (
            <button key={x.id} className="opt" aria-pressed={x.id === combo.body?.id} onClick={() => set({ body: x })} title={x.note} style={{ fontFamily: x.var }}>
              {x.name}
            </button>
          ))}
        </div>
      </div>

      {FONT_ROLES.map(({ role, label, fallback }) => {
        const current = combo[role];
        const idx = current ? FACES.indexOf(current) : -1;
        const pick = (f: Face | null) => set({ [role]: f } as Partial<Combo>);
        return (
          <div className="ctrl" key={role}>
            <span className="ctrl-label ctrl-label-row">
              {label}
              <span className="stepper">
                <button className="tbtn" onClick={() => pick(idx <= 0 ? (idx === 0 ? null : FACES[FACES.length - 1]) : FACES[idx - 1])} aria-label={`Previous ${role} font`}>&larr; prev</button>
                <button className="tbtn" onClick={() => pick(FACES[idx + 1] ?? null)} aria-label={`Next ${role} font`}>next &rarr;</button>
              </span>
            </span>
            <div className="ctrl-opts">
              <button className="opt" aria-pressed={current === null} onClick={() => pick(null)} title={`Default: ${fallback}`}>
                Default · {fallback}
              </button>
              {FACES.map((f) => (
                <button key={f.slug} className="opt" aria-pressed={f.slug === current?.slug} onClick={() => pick(f)} style={{ fontFamily: f.var }}>
                  {f.name}
                </button>
              ))}
            </div>
          </div>
        );
      })}
      </details>

      <details className="sect">
      <summary>Lines</summary>
      <div className="ctrl">
        <span className="ctrl-label">Line weight</span>
        <div className="ctrl-opts">
          {WEIGHTS.map((x) => (
            <button key={x.id} className="opt" aria-pressed={x.id === weight.id} onClick={() => set({ weight: x })} title={`thin ${x.thin} · heavy ${x.fat}`}>
              {x.name}
            </button>
          ))}
        </div>
      </div>

      <div className="ctrl">
        <span className="ctrl-label">Line width · scales the weight above</span>
        <div className="ctrl-opts">
          {LINE_SCALES.map((x) => (
            <button key={x.id} className="opt opt-tight" aria-pressed={x.id === scale.id} onClick={() => set({ scale: x })}>
              {x.name}
            </button>
          ))}
        </div>
      </div>

      </details>

      <details className="sect">
      <summary>Motion</summary>
      <div className="ctrl">
        <span className="ctrl-label">Entrance</span>
        <div className="ctrl-opts">
          {ENTRANCES.map((x) => (
            <button key={x.id} className="opt" aria-pressed={x.id === entrance.id} onClick={() => set({ entrance: x })}>
              {x.name}
            </button>
          ))}
        </div>
      </div>

      <div className="ctrl">
        <span className="ctrl-label">Hover</span>
        <div className="ctrl-opts">
          {HOVERS.map((x) => (
            <button key={x.id} className="opt" aria-pressed={x.id === hover.id} onClick={() => set({ hover: x })}>
              {x.name}
            </button>
          ))}
        </div>
      </div>

      <div className="ctrl">
        <span className="ctrl-label">Synapse pointer · background 5 only</span>
        <div className="ctrl-opts">
          {POINTERS.map((x) => (
            <button key={x.id} className="opt" aria-pressed={x.id === combo.pointer.id} onClick={() => set({ pointer: x })} title={x.note}>
              {x.name}
            </button>
          ))}
        </div>
      </div>
      </details>
    </div>
  );
}
