"use client";

import { useEffect, useState } from "react";
import {
  BACKGROUNDS,
  ACCENTS,
  TYPE_PAIRS,
  ENTRANCES,
  HOVERS,
  DEFAULT_COMBO,
  cssVars,
  comboHash,
  parseComboHash,
  type Combo,
} from "@/lib/tokens";
import Backdrop from "./Backdrop";
import "./backdrops.css";
import "./design.css";

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
  const [pickerOpen, setPickerOpen] = useState(true);
  const [notesOpen, setNotesOpen] = useState(false);
  const { bg, accent, accent2, type, entrance, hover } = combo;
  const set = (patch: Partial<Combo>) => setCombo((c) => ({ ...c, ...patch }));

  // deep link: /design#aurora.yellow-amber.blue-sky.syne.rise.lift
  useEffect(() => {
    const read = () => setCombo(parseComboHash(window.location.hash));
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  useEffect(() => {
    window.history.replaceState(null, "", comboHash(combo));
  }, [combo]);

  // 1-5 background, q-w-e-r-t type
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= BACKGROUNDS.length) set({ bg: BACKGROUNDS[n - 1] });
      const ti = ["q", "w", "e", "r", "t"].indexOf(e.key.toLowerCase());
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
      data-entrance={entrance.id}
      data-hover={hover.id}
    >
      <Backdrop id={bg.id} />

      <div className="content">
        {/* configurator */}
        <div className="chrome" data-open={pickerOpen}>
          <button
            className="chrome-toggle"
            onClick={() => setPickerOpen((o) => !o)}
            aria-expanded={pickerOpen}
            aria-controls="picker"
          >
            {pickerOpen ? "Hide picker" : "Show picker"}
          </button>
          {!pickerOpen && (
            <p className="chrome-summary">
              {bg.name} · {accent.name} + {accent2.name} · {type.name} ·{" "}
              {entrance.name} · {hover.name}
            </p>
          )}
          <div className="chrome-inner" id="picker" hidden={!pickerOpen}>
            <div className="ctrl">
              <span className="ctrl-label">Background</span>
              {BACKGROUNDS.map((x) => (
                <button
                  key={x.id}
                  className="opt"
                  aria-pressed={x.id === bg.id}
                  onClick={() => set({ bg: x })}
                >
                  <span className="opt-n">{x.n}</span>
                  {x.name}
                </button>
              ))}
            </div>

            <div className="ctrl">
              <span className="ctrl-label">Type</span>
              {TYPE_PAIRS.map((x) => (
                <button
                  key={x.id}
                  className="opt"
                  aria-pressed={x.id === type.id}
                  onClick={() => set({ type: x })}
                >
                  {x.name}
                </button>
              ))}
            </div>

            {(
              [
                ["Accent 1", accent, (x: (typeof ACCENTS)[number]) => set({ accent: x })],
                ["Accent 2", accent2, (x: (typeof ACCENTS)[number]) => set({ accent2: x })],
              ] as const
            ).map(([label, current, pick]) => (
              <div className="ctrl" key={label}>
                <span className="ctrl-label">{label}</span>
                {ACCENTS.map((x, i) => (
                  <span key={x.id} style={{ display: "contents" }}>
                    {i === 3 || i === 6 ? <span className="sw-gap" /> : null}
                    <button
                      className="sw"
                      aria-pressed={x.id === current.id}
                      onClick={() => pick(x)}
                      style={{ background: x.hex }}
                      title={`${x.family} ${x.name} · ${x.hex}`}
                      aria-label={`${label}: ${x.family} ${x.name}`}
                    />
                  </span>
                ))}
                <span className="ctrl-value">
                  {current.family} {current.name} · {current.hex}
                </span>
              </div>
            ))}

            <div className="ctrl">
              <span className="ctrl-label">Entrance</span>
              {ENTRANCES.map((x) => (
                <button
                  key={x.id}
                  className="opt"
                  aria-pressed={x.id === entrance.id}
                  onClick={() => set({ entrance: x })}
                >
                  {x.name}
                </button>
              ))}
            </div>

            <div className="ctrl">
              <span className="ctrl-label">Hover</span>
              {HOVERS.map((x) => (
                <button
                  key={x.id}
                  className="opt"
                  aria-pressed={x.id === hover.id}
                  onClick={() => set({ hover: x })}
                >
                  {x.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* the argument */}
        <section className="brief" aria-labelledby="design-notes">
          <div className="brief-inner" data-open={notesOpen}>
            <div className="brief-head">
              <h3 id="design-notes" className="brief-title">Design notes</h3>
              <button
                className="chrome-toggle brief-toggle"
                onClick={() => setNotesOpen((o) => !o)}
                aria-expanded={notesOpen}
                aria-controls="notes"
              >
                {notesOpen ? "Hide notes" : "Show notes"}
              </button>
            </div>
            <div className="brief-grid" id="notes" hidden={!notesOpen}>
            <div>
              <h4>The bet · {bg.name}</h4>
              <p>{bg.bet}</p>
            </div>
            <div className="is-risk">
              <h4>The risk</h4>
              <p>{bg.risk}</p>
            </div>
            <div>
              <h4>{type.displayName}</h4>
              <p>{type.note}</p>
            </div>
            <div>
              <h4>Accents · {accent.name} with {accent2.name}</h4>
              <p>
                Accent 1 is the loud one: buttons, the Team circle, the arc.
                Accent 2 is the quiet one: eyebrows, links, tags, the second
                blob. One loud colour per screen, never both at full volume.
              </p>
            </div>
            <div>
              <h4>Entrance · {entrance.name}</h4>
              <p>{entrance.note}</p>
            </div>
            <div>
              <h4>Hover · {hover.name}</h4>
              <p>{hover.note}</p>
            </div>
            </div>
          </div>
        </section>

        <div className="wrap">
          {/* hero */}
          <header className="hero reveal">
            <p className="eyebrow">In partnership with Sapien Labs</p>
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
                  <small>many teams</small>
                </span>
                <div className="orb orb-team">
                  <span className="orb-label">
                    Team
                    <small>the unit of change</small>
                  </span>
                  <div className="orb orb-ind">
                    <span className="orb-label">
                      Individual
                      <small>inside the team</small>
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
                  <span className="bench-label">Line weights</span>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--muted)" }}>
                    Hairlines at {bg.ruleThin}, deliberate heavy strokes at{" "}
                    {bg.ruleFat}. The contrast between the two is where the
                    playfulness lives.
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
                  {type.bodyName} 400 &middot; 17/1.65
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
                <h2 className="sec">Tokens</h2>
              </div>
            </div>
            <dl className="tokens">
              <div>
                <dt>Background</dt>
                <dd>{bg.n} &middot; {bg.name}</dd>
              </div>
              <div>
                <dt>Base colour</dt>
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
                <dt>Display</dt>
                <dd>
                  {type.displayName} {type.displayWeight} &middot; tracking{" "}
                  {type.displayTracking} &middot; leading {type.displayLeading}
                </dd>
              </div>
              <div>
                <dt>Body</dt>
                <dd>{type.bodyName}</dd>
              </div>
              <div>
                <dt>Line weights</dt>
                <dd>thin {bg.ruleThin} &middot; heavy {bg.ruleFat}</dd>
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
                <dt>Share this exact combination</dt>
                <dd>/design{comboHash(combo)}</dd>
              </div>
            </dl>
          </section>

          <footer className="foot">
            <p>
              <strong>Six dials, not five fixed options.</strong> Background,
              two accents, type, entrance and hover move independently, so you
              are not stuck picking a whole look you only half like. Find the
              background first, then the accents, then the type, then the
              effects. The URL updates as you go, so you can send a colleague
              the exact combination you landed on.
            </p>
            <p>
              <strong>What we are going for.</strong> Playful and a bit organic,
              never childish. The looseness lives in the background, the motion
              and the gap between the hairlines and the heavy strokes. The
              discipline lives in the typography and the spacing, which is what
              keeps it credible in front of a Fortune 500 buyer.
            </p>
            <p>
              <strong>Two notes.</strong> Your brand book has no colour codes in
              it, so these palettes are proposals rather than matches. And the
              logo sits on top of whichever we pick without changing, because
              the brand book is explicit that the handmade lettering must not be
              recreated.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
