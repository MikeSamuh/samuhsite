"use client";

import { useEffect, useState } from "react";
import { BACKGROUNDS, ACCENTS, TYPE_PAIRS, cssVars } from "@/lib/tokens";
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
  const [b, setB] = useState(0);
  const [a, setA] = useState(0);
  const [t, setT] = useState(0);

  const combo = { bg: BACKGROUNDS[b], accent: ACCENTS[a], type: TYPE_PAIRS[t] };
  const { bg, accent, type } = combo;

  // deep link: /design#aurora.yellow-amber.syne
  useEffect(() => {
    const read = () => {
      const [bi, ai, ti] = window.location.hash.replace("#", "").split(".");
      const nb = BACKGROUNDS.findIndex((x) => x.id === bi);
      const na = ACCENTS.findIndex((x) => x.id === ai);
      const nt = TYPE_PAIRS.findIndex((x) => x.id === ti);
      if (nb >= 0) setB(nb);
      if (na >= 0) setA(na);
      if (nt >= 0) setT(nt);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  useEffect(() => {
    window.history.replaceState(
      null,
      "",
      `#${bg.id}.${accent.id}.${type.id}`
    );
  }, [bg.id, accent.id, type.id]);

  // 1-5 background, q-w-e-r-t type
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= BACKGROUNDS.length) setB(n - 1);
      const ti = ["q", "w", "e", "r", "t"].indexOf(e.key.toLowerCase());
      if (ti >= 0 && ti < TYPE_PAIRS.length) setT(ti);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="stage" style={cssVars(combo)}>
      <Backdrop id={bg.id} />

      <div className="content">
        {/* configurator */}
        <div className="chrome">
          <div className="chrome-inner">
            <div className="ctrl">
              <span className="ctrl-label">Background</span>
              {BACKGROUNDS.map((x, i) => (
                <button
                  key={x.id}
                  className="opt"
                  aria-pressed={i === b}
                  onClick={() => setB(i)}
                >
                  <span className="opt-n">{x.n}</span>
                  {x.name}
                </button>
              ))}
            </div>

            <div className="ctrl">
              <span className="ctrl-label">Accent</span>
              {ACCENTS.map((x, i) => (
                <span key={x.id} style={{ display: "contents" }}>
                  {i === 3 || i === 6 ? <span className="sw-gap" /> : null}
                  <button
                    className="sw"
                    aria-pressed={i === a}
                    onClick={() => setA(i)}
                    style={{ background: x.hex }}
                    title={`${x.family} ${x.name} · ${x.hex}`}
                    aria-label={`${x.family} ${x.name}`}
                  />
                </span>
              ))}
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--muted)",
                  marginLeft: 8,
                }}
              >
                {accent.family} {accent.name} · {accent.hex}
              </span>
            </div>

            <div className="ctrl">
              <span className="ctrl-label">Type</span>
              {TYPE_PAIRS.map((x, i) => (
                <button
                  key={x.id}
                  className="opt"
                  aria-pressed={i === t}
                  onClick={() => setT(i)}
                >
                  {x.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* the argument */}
        <div className="brief">
          <div className="brief-inner">
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
          </div>
        </div>

        <div className="wrap">
          {/* hero */}
          <header className="hero">
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
          <section className="band">
            <div className="sec-head">
              <span className="sec-n">04</span>
              <div>
                <p className="kicker">Motion &middot; bespoke sequence</p>
                <h2 className="sec">Three circles</h2>
              </div>
            </div>
            <div className="rings">
              <div className="ring">
                <div>
                  <span>Team</span>
                  <small>the unit of change</small>
                </div>
              </div>
              <div className="ring">
                <div>
                  <span>Individual</span>
                  <small>inside the team</small>
                </div>
              </div>
              <div className="ring">
                <div>
                  <span>Organization</span>
                  <small>many teams</small>
                </div>
              </div>
            </div>
          </section>

          {/* process */}
          <section className="band">
            <div className="sec-head">
              <span className="sec-n">05</span>
              <div>
                <p className="kicker">Interaction &middot; panel hover</p>
                <h2 className="sec">The team process</h2>
              </div>
            </div>
            <div className="process">
              {PROCESS.map(([name, note], n) => (
                <div className="step" key={name}>
                  <span className="step-n">0{n + 1}</span>
                  <span className="step-name">{name}</span>
                  <span className="step-note">{note}</span>
                </div>
              ))}
            </div>
          </section>

          {/* tiers */}
          <section className="band">
            <div className="sec-head">
              <span className="sec-n">06</span>
              <div>
                <p className="kicker">Interaction &middot; card hover</p>
                <h2 className="sec">Ways to engage</h2>
              </div>
            </div>
            <div className="cards">
              {TIERS.map(([tag, title, body, cta]) => (
                <article className="card" key={title}>
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
          <section className="band">
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
          <section className="band">
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
          <section className="band">
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
                <dt>Accent</dt>
                <dd>{accent.family} {accent.name} &middot; {accent.hex} &middot; {accent.note}</dd>
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
                <dt>Share this exact combination</dt>
                <dd>/design#{bg.id}.{accent.id}.{type.id}</dd>
              </div>
            </dl>
          </section>

          <footer className="foot">
            <p>
              <strong>Three dials, not five fixed options.</strong> Background,
              accent and type move independently, so you are not stuck picking a
              whole look you only half like. Find the background first, then the
              accent, then the type. The URL updates as you go, so you can send
              a colleague the exact combination you landed on.
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
