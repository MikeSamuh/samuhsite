import Image from "next/image";
import { ACCENTS, ruleWidths, type Accent } from "@/lib/tokens";
import { lockedCombo, LOCKED_HASH } from "@/lib/layout";

// The style guide, read from the same tokens the site renders with
// (src/lib/tokens.ts and the locked hash in src/lib/layout.ts), so it
// cannot drift from the pages. Nothing here is typed in by hand except the
// rules, which come from CLAUDE.md, docs/brief.md and docs/assets.md.

const ROLES: { accent: (c: ReturnType<typeof lockedCombo>) => Accent | null; role: string; where: string }[] = [
  { accent: (c) => c.accent, role: "Primary · loud", where: "Buttons, the team circle, the synapse nodes. One loud colour per screen." },
  { accent: (c) => c.accent2, role: "Secondary · quiet", where: "Eyebrows, inline links, tags, the second highlight." },
  { accent: (c) => c.accent3, role: "Data", where: "Tags, step numbers, card tags. Falls back to the secondary." },
  { accent: (c) => c.accent4, role: "Wash", where: "Tints only, never text. Falls back to the primary." },
];

function Swatch({ a, role, where }: { a: Accent; role?: string; where?: string }) {
  return (
    <div className="adm-swatch">
      <div className="adm-swatch-chip" style={{ background: a.hex }} />
      <div className="adm-swatch-body">
        <span className="adm-swatch-name">{a.family === "pink" ? "Pink" : a.family === "cyan" ? "Cyan" : a.family === "violet" ? "Violet" : "Yellow"} · {a.name}</span>
        <span className="adm-swatch-hex">{a.hex}</span>
        {role ? <span className="adm-swatch-role"><strong>{role}.</strong> {where}</span> : <span className="adm-swatch-role">{a.note}</span>}
      </div>
    </div>
  );
}

export default function BrandPage() {
  const c = lockedCombo("void");
  const rule = ruleWidths(c);
  const faces = [
    { k: "Display", name: `${c.type.displayName} ${c.type.displayWeight}`, v: c.type.displayVar, sample: "High performance without the cost to people.", size: 34, weight: c.type.displayWeight, tracking: c.type.displayTracking },
    { k: "Body", name: c.body?.name ?? c.type.bodyName, v: c.body?.var ?? c.type.bodyVar, sample: "Most teams leak performance through their environment, not their effort. Samuh finds where yours is leaking, and gives you the practices to close it.", size: 17, weight: 400 },
    { k: "Eyebrow", name: c.eyebrow?.name ?? "IBM Plex Mono", v: c.eyebrow?.var ?? "var(--f-plex-mono)", sample: "ORGANIZATIONAL AND HIGH-PERFORMANCE CONSULTING", size: 12, weight: 500, tracking: "0.14em" },
    { k: "Captions and data", name: c.caption?.name ?? "IBM Plex Mono", v: c.caption?.var ?? "var(--f-plex-mono)", sample: "Research · in partnership with Sapien Labs · 12 October 2026", size: 13, weight: 400 },
  ];
  const motion = [
    ["Entrance", `${c.entrance.name}. ${c.entrance.note}`],
    ["Hover", `${c.hover.name}. ${c.hover.note}`],
    ["Duration and easing", `${c.bg.motionDur} · ${c.bg.motionEase}. Every transition reads these; nothing animates at its own speed`],
    ["Reduced motion", "Respected everywhere, backgrounds included. The picture holds still and the hover stays"],
  ];
  return (
    <>
      <div className="adm-head">
        <div>
          <span className="adm-kicker">Brand</span>
          <h1 className="adm-title">The SAMUH style guide</h1>
          <p className="adm-lede">The style the client locked on 25 September 2026, read straight from the site&rsquo;s tokens. Playful, organic, a little psychedelic. Never childish, and it has to survive a boardroom.</p>
        </div>
        <a className="adm-btn" href={`/design${LOCKED_HASH}`} target="_blank" rel="noopener noreferrer">Open the style picker ↗</a>
      </div>

      <section className="adm-section" style={{ marginTop: 0 }}>
        <h2 className="adm-section-title">The idea</h2>
        <div className="adm-grid adm-grid-2">
          <div className="adm-card">
            <div className="adm-card-title">Looseness</div>
            <p className="adm-note">Lives in the background treatment, the motion, the illustration, and the gap between the hairline and the heavy stroke.</p>
          </div>
          <div className="adm-card">
            <div className="adm-card-title">Discipline</div>
            <p className="adm-note">Lives in the typography, the spacing, and the restraint of one loud colour at a time. If a change makes a page more playful by making it less legible or less credible, it is the wrong change.</p>
          </div>
        </div>
      </section>

      <section className="adm-section">
        <h2 className="adm-section-title">The logo</h2>
        <div className="adm-grid adm-grid-2">
          <div className="adm-logo-stage" style={{ background: c.bg.base }} data-on="dark">
            <Image src="/samuh-logo.png" alt="SAMUH wordmark on the dark stage" width={960} height={285} />
          </div>
          <div className="adm-logo-stage" style={{ background: "var(--adm-surface)", border: "1px solid var(--adm-border)" }}>
            <Image src="/samuh-logo.png" alt="SAMUH wordmark on white" width={960} height={285} />
          </div>
        </div>
        <div className="adm-card" style={{ marginTop: 16 }}>
          <ul className="adm-dos">
            <li>The lettering is custom and handmade. Place the supplied file, at the size it was drawn for.</li>
            <li>The seven-point star is placed as supplied, white on transparent. It sits where the four capacities meet.</li>
            <li>Sapien Labs is credited as a partner beside the mark and in the body of the About page, never only in the footer.</li>
            <li data-no>Never recreate, redraw, recolour or modify the lettering. Never set &ldquo;SAMUH&rdquo; in a web font as a substitute.</li>
            <li data-no>Never stretch it, outline it, or put an effect on it. On the dark stage it is inverted with a filter, the file is untouched.</li>
          </ul>
          <div className="adm-actions" style={{ marginTop: 16 }}>
            <a className="adm-btn adm-btn-small" href="/samuh-logo.png" download>Wordmark PNG</a>
            <a className="adm-btn adm-btn-small" href="/samuh-icon.png" download>Mark PNG</a>
            <a className="adm-btn adm-btn-small" href="/samuh-star.png" download>Star PNG</a>
            <a className="adm-btn adm-btn-small" href="/sapien-labs.png" download>Sapien Labs PNG</a>
          </div>
        </div>
      </section>

      <section className="adm-section">
        <h2 className="adm-section-title">Colour in use</h2>
        <div className="adm-swatches">
          {ROLES.map(({ accent, role, where }) => {
            const a = accent(c);
            return a ? <Swatch key={role} a={a} role={role} where={where} /> : null;
          })}
          <div className="adm-swatch">
            <div className="adm-swatch-chip" style={{ background: c.bg.base, borderBottom: "1px solid var(--adm-border)" }} />
            <div className="adm-swatch-body">
              <span className="adm-swatch-name">Stage · {c.bg.name}</span>
              <span className="adm-swatch-hex">{c.bg.base}</span>
              <span className="adm-swatch-role">Text {c.bg.text} · muted {c.bg.muted} · surface {c.bg.surface} · border {c.bg.border}</span>
            </div>
          </div>
        </div>
        <p className="adm-note" style={{ marginTop: 12 }}>Body text clears 4.5:1 against the stage and every surface. Muted text may sit at 3:1, never below.</p>
      </section>

      <section className="adm-section">
        <h2 className="adm-section-title">The full palette</h2>
        <p className="adm-note" style={{ marginBottom: 12 }}>Sampled from SAMUH&rsquo;s own decks, since the brand book carries no colour codes. Every hue clears 4.5:1 on the darkest stage, so all are safe for text. Four families, three each.</p>
        <div className="adm-swatches">
          {ACCENTS.map((a) => <Swatch key={a.id} a={a} />)}
        </div>
      </section>

      <section className="adm-section">
        <h2 className="adm-section-title">Type</h2>
        <div className="adm-card">
          {faces.map((f) => (
            <div className="adm-type-sample" key={f.k}>
              <span className="adm-type-k">{f.k} · {f.name}</span>
              <span style={{ fontFamily: f.v, fontSize: f.size, fontWeight: f.weight, letterSpacing: f.tracking, lineHeight: 1.25 }}>{f.sample}</span>
            </div>
          ))}
          <p className="adm-note" style={{ marginTop: 14 }}>Display tracking {c.type.displayTracking}, leading {c.type.displayLeading}. Corners {c.bg.radius}. Headings stay sentence case; eyebrows alone are uppercase.</p>
        </div>
      </section>

      <section className="adm-section">
        <h2 className="adm-section-title">Line weight</h2>
        <div className="adm-card">
          <div className="adm-rules">
            <div className="adm-rule"><span>Thin · {rule.thin}</span><span className="adm-rule-line" style={{ "--w": rule.thin } as React.CSSProperties} /></div>
            <div className="adm-rule"><span>Fat · {rule.fat}</span><span className="adm-rule-line" style={{ "--w": rule.fat } as React.CSSProperties} /></div>
          </div>
          <p className="adm-note" style={{ marginTop: 14 }}>{c.weight.name} at {c.scale.name}. Thin draws borders, dividers and the grid. Fat draws the eyebrow rule, the team circle, link underlines and the accent bar on cards. The gap between the two is where the playfulness lives; uniform hairlines everywhere is what makes a site feel corporate.</p>
        </div>
      </section>

      <section className="adm-section">
        <h2 className="adm-section-title">Motion</h2>
        <div className="adm-card">
          <table className="adm-table">
            <tbody>
              {motion.map(([k, v]) => <tr key={k}><th style={{ width: 200, textTransform: "none", letterSpacing: 0, fontSize: 14 }}>{k}</th><td>{v}</td></tr>)}
            </tbody>
          </table>
        </div>
      </section>

      <section className="adm-section">
        <h2 className="adm-section-title">Voice and language</h2>
        <div className="adm-grid adm-grid-2">
          <div className="adm-card">
            <div className="adm-card-title">Say</div>
            <ul className="adm-dos">
              <li>&ldquo;A multi-team organization.&rdquo; Teams stay the subject of every sentence.</li>
              <li>Sapien Labs as a partner: &ldquo;in partnership with Sapien Labs&rdquo;, &ldquo;our research partner&rdquo;.</li>
              <li>&ldquo;See how TeamQ thinks.&rdquo; The tool on the site is a demonstration.</li>
              <li>Commas, colons or full stops. Short sentences. Plain English a founder and a procurement team both read.</li>
              <li>Performance and wellbeing at once. Skewed to metrics it reads cold; skewed to wellbeing it reads soft.</li>
            </ul>
          </div>
          <div className="adm-card">
            <div className="adm-card-title">Never</div>
            <ul className="adm-dos">
              <li data-no>&ldquo;An enterprise.&rdquo;</li>
              <li data-no>A statistic, sample size, percentage, client name or outcome SAMUH has not supplied in writing. Leave a visible TODO instead.</li>
              <li data-no>&ldquo;Your TeamQ score&rdquo; for the demonstration tool, or calling the intake validated, scientific or diagnostic.</li>
              <li data-no>Em dashes. Anywhere.</li>
              <li data-no>Corporate filler. If it could be on any consultancy&rsquo;s site, cut it.</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
