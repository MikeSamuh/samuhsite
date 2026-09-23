"use client";

import { useEffect, useState } from "react";
import { DIRECTIONS, cssVars } from "@/lib/directions";
import "./design.css";

const PROCESS = [
  ["Prepare", "Baseline the team before anything changes."],
  ["Launch", "Put the practices into the working week."],
  ["Discover", "Surface what the team actually does under load."],
  ["Awareness", "Name the patterns people could not see."],
  ["Belonging", "Build the conditions people stay for."],
  ["Action", "Convert insight into standing rituals."],
];

const TIERS = [
  [
    "Tier 01",
    "Self-guided",
    "The full model, delivered as structured video, audio and written material. Teams run it at their own pace.",
  ],
  [
    "Tier 02",
    "Supported",
    "Everything in self-guided, with periodic coaching sessions to keep the practices honest.",
  ],
  [
    "Tier 03",
    "Guided",
    "In-person workshops and long-term partnership. Built for organisations changing how they operate.",
  ],
];

export default function DesignDirections() {
  const [i, setI] = useState(0);
  const d = DIRECTIONS[i];

  // deep link: /design#signal
  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.replace("#", "");
      const found = DIRECTIONS.findIndex((x) => x.id === h);
      if (found >= 0) setI(found);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  // 1-5 to switch
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= DIRECTIONS.length) select(n - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function select(idx: number) {
    setI(idx);
    window.history.replaceState(null, "", `#${DIRECTIONS[idx].id}`);
  }

  const swatches: [string, string][] = [
    ["Background", d.colors.bg],
    ["Surface", d.colors.surface],
    ["Surface alt", d.colors.surfaceAlt],
    ["Border", d.colors.border],
    ["Text", d.colors.text],
    ["Muted text", d.colors.muted],
    ["Accent", d.colors.accent],
    ["Accent 2", d.colors.accent2],
    ["Accent 3", d.colors.accent3],
  ];

  return (
    <div className="stage" style={cssVars(d)} data-btn={d.buttonStyle}>
      {/* switcher */}
      <div className="chrome">
        <div className="chrome-inner">
          <span className="chrome-label">Samuh · direction</span>
          <div className="tabs" role="tablist">
            {DIRECTIONS.map((x, idx) => (
              <button
                key={x.id}
                role="tab"
                aria-selected={idx === i}
                className="tab"
                onClick={() => select(idx)}
              >
                <span className="tab-num">{x.n}</span>
                {x.name}
              </button>
            ))}
          </div>
          <span className="chrome-label" style={{ marginLeft: "auto" }}>
            press 1&ndash;5
          </span>
        </div>
      </div>

      {/* the argument for this direction */}
      <div className="brief">
        <div className="brief-inner">
          <div className="brief-block">
            <h4>The bet</h4>
            <p>{d.bet}</p>
          </div>
          <div className="brief-block">
            <h4>How it reads</h4>
            <p>{d.reads}</p>
          </div>
          <div className="brief-block is-risk">
            <h4>The risk</h4>
            <p>{d.risk}</p>
          </div>
        </div>
      </div>

      {/* hero */}
      <div className="wrap">
        <header className="hero">
          <p className="eyebrow">Organisational performance</p>
          <h1 className="display">
            Performance is a property of teams, not individuals.
          </h1>
          <p className="lede">
            Samuh turns two decades of organisational research into a set of
            practices a team can actually run. Start by finding out where yours
            stands.
          </p>
          <div className="cta-row">
            <button className="btn">
              Take the assessment <span className="arrow">&rarr;</span>
            </button>
            <button className="btn btn-secondary">See the evidence</button>
          </div>
        </header>

        {/* process */}
        <section className="band">
          <p className="kicker">Interaction &middot; panel hover</p>
          <h2 className="sec">The six stages of the Samuh process</h2>
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

        {/* cards */}
        <section className="band">
          <p className="kicker">Interaction &middot; card hover and accent rule</p>
          <h2 className="sec">Three ways to work with Samuh</h2>
          <div className="cards">
            {TIERS.map(([tag, title, body]) => (
              <article className="card" key={title}>
                <span className="card-tag">{tag}</span>
                <h3>{title}</h3>
                <p>{body}</p>
                <span className="card-link">
                  Explore this tier <span>&rarr;</span>
                </span>
              </article>
            ))}
          </div>
        </section>

        {/* element bench */}
        <section className="band">
          <p className="kicker">Element bench &middot; hover and focus states</p>
          <h2 className="sec">Everything that changes colour when you touch it</h2>
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
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7 }}>
                  Read the{" "}
                  <a href="#" className="inline-link" onClick={(e) => e.preventDefault()}>
                    Fortune 10 leadership case study
                  </a>{" "}
                  or browse{" "}
                  <a href="#" className="inline-link" onClick={(e) => e.preventDefault()}>
                    the full research library
                  </a>
                  .
                </p>
              </div>
              <div className="bench-row">
                <span className="bench-label">Tags</span>
                <span className="pill is-accent">Validated</span>
                <span className="pill">Team practice</span>
                <span className="pill">Ritual</span>
              </div>
            </div>
            <div>
              <div className="bench-row">
                <span className="bench-label">Lead capture &middot; click the field</span>
                <div className="field">
                  <input type="email" placeholder="you@company.com" />
                  <button className="btn">Start</button>
                </div>
              </div>
              <div className="bench-row">
                <span className="bench-label">Motion character</span>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--muted)" }}>
                  {d.motionNote}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* type */}
        <section className="band">
          <p className="kicker">Typography</p>
          <h2 className="sec">
            {d.fonts.displayName} for display, {d.fonts.bodyName} for everything
            else
          </h2>
          <div className="specimen">
            <div>
              <span className="spec-meta">
                Display
                <br />
                {d.fonts.displayName} {d.fonts.displayWeight}
              </span>
              <span className="spec-display" style={{ fontSize: 46 }}>
                Teams change, not people
              </span>
            </div>
            <div>
              <span className="spec-meta">
                Heading
                <br />
                {d.fonts.displayName} {d.fonts.displayWeight}
              </span>
              <span className="spec-display" style={{ fontSize: 28 }}>
                Rituals are the vehicle for change
              </span>
            </div>
            <div>
              <span className="spec-meta">
                Body
                <br />
                {d.fonts.bodyName} 400 &middot; 17/1.65
              </span>
              <span style={{ fontSize: 17, lineHeight: 1.65 }}>
                The practices only hold if they survive contact with a normal
                working week. That is the whole design constraint, and it is why
                the model starts with the team rather than the individual.
              </span>
            </div>
            <div>
              <span className="spec-meta">
                Caption / data
                <br />
                {d.fonts.monoName}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  letterSpacing: "0.04em",
                  color: "var(--muted)",
                }}
              >
                FIG. 01 &middot; SAPIEN CAPACITY FACTORS &middot; N = 407,000
              </span>
            </div>
          </div>
        </section>

        {/* colour */}
        <section className="band">
          <p className="kicker">Palette</p>
          <h2 className="sec">Nine values, and only one of them is loud</h2>
          <div className="swatches">
            {swatches.map(([name, hex]) => (
              <div className="swatch" key={name}>
                <div className="swatch-chip" style={{ background: hex }} />
                <div className="swatch-meta">
                  <span className="swatch-name">{name}</span>
                  <span className="swatch-hex">{hex.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* tokens */}
        <section className="band">
          <p className="kicker">Tokens &middot; what gets built if you pick this</p>
          <dl className="tokens">
            <div>
              <dt>Direction</dt>
              <dd>
                {d.n} &middot; {d.name}
              </dd>
            </div>
            <div>
              <dt>Display face</dt>
              <dd>
                {d.fonts.displayName} {d.fonts.displayWeight} &middot; tracking{" "}
                {d.fonts.displayTracking} &middot; leading {d.fonts.displayLeading}
              </dd>
            </div>
            <div>
              <dt>Body face</dt>
              <dd>{d.fonts.bodyName}</dd>
            </div>
            <div>
              <dt>Mono / data face</dt>
              <dd>{d.fonts.monoName}</dd>
            </div>
            <div>
              <dt>Accent</dt>
              <dd>{d.colors.accent.toUpperCase()}</dd>
            </div>
            <div>
              <dt>Corner radius</dt>
              <dd>{d.radius}</dd>
            </div>
            <div>
              <dt>Transition</dt>
              <dd>
                {d.motionDur} {d.motionEase}
              </dd>
            </div>
            <div>
              <dt>Button treatment</dt>
              <dd>{d.buttonStyle}</dd>
            </div>
          </dl>
        </section>

        <footer className="foot">
          <p>
            <strong>How to use this page.</strong> Switch between the five
            directions and notice which one you stop arguing with. Hover the
            buttons, the cards, the process panels and the links, and click into
            the email field &mdash; the interaction character is as much of the
            decision as the colour.
          </p>
          <p>
            <strong>What we need back.</strong> One direction, plus anything you
            want carried over from the others. Type, palette and motion can be
            mixed; we are choosing a starting point, not signing something in
            blood.
          </p>
          <p>
            <strong>Two notes.</strong> All five are dark, per our earlier call.
            The logo sits on top of whichever we pick and does not change &mdash;
            the brand book is explicit that the handmade lettering must not be
            recreated. And the brand book has no colour codes in it, so these
            palettes are proposals rather than matches.
          </p>
        </footer>
      </div>
    </div>
  );
}
