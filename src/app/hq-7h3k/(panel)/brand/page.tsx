import Image from "next/image";
import { ACCENTS, MHQ_BANDS, ruleWidths } from "@/lib/tokens";
import { Copy } from "@/components/admin/Copy";
import { lockedCombo, LOCKED_HASH } from "@/lib/layout";

// The style guide, read from the same tokens the site renders with
// (src/lib/tokens.ts and the locked hash in src/lib/layout.ts), so it
// cannot drift from the pages. Nothing here is typed in by hand except the
// rules, which come from CLAUDE.md, docs/brief.md and docs/assets.md.

function Chip({ name, hex, role, light }: { name: string; hex: string; role: string; light?: boolean }) {
  return (
    <Copy text={hex} label={`${name} ${hex}`} className="adm-swatch">
      <span className="adm-swatch-chip" style={{ background: hex, borderBottom: light ? "1px solid var(--adm-border)" : undefined }} />
      <span className="adm-swatch-body">
        <span className="adm-swatch-name">{name}</span>
        <span className="adm-swatch-hex">{hex}</span>
        <span className="adm-swatch-role">{role}</span>
      </span>
    </Copy>
  );
}

const FILES = [
  { name: "Wordmark", file: "/samuh-logo.png" },
  { name: "Mark", file: "/samuh-icon.png" },
  { name: "Star", file: "/samuh-star.png" },
  { name: "Sapien Labs", file: "/sapien-labs.png" },
  { name: "Sapien mark", file: "/sapien-icon.png" },
];

export default function BrandPage() {
  const c = lockedCombo("void");
  const rule = ruleWidths(c);
  const yellow = ACCENTS.find((a) => a.id === "yellow-butter") ?? c.accent;
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://samuh.work";
  const faces = [
    { k: "Display", family: c.type.displayName, fallback: "serif", v: c.type.displayVar, sample: "High performance without the cost to people.", size: 34, weight: c.type.displayWeight, tracking: c.type.displayTracking },
    { k: "Body", family: c.body?.name ?? c.type.bodyName, fallback: "sans-serif", v: c.body?.var ?? c.type.bodyVar, sample: "Most teams leak performance through their environment, not their effort. Samuh finds where yours is leaking, and gives you the practices to close it.", size: 17, weight: 400 },
    { k: "Eyebrow", family: c.eyebrow?.name ?? "IBM Plex Mono", fallback: "monospace", v: c.eyebrow?.var ?? "var(--f-plex-mono)", sample: "ORGANIZATIONAL AND HIGH-PERFORMANCE CONSULTING", size: 12, weight: 500, tracking: "0.14em" },
    { k: "Captions and data", family: c.caption?.name ?? "IBM Plex Mono", fallback: "monospace", v: c.caption?.var ?? "var(--f-plex-mono)", sample: "Research · in partnership with Sapien Labs · 12 October 2026", size: 13, weight: 400 },
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
          <h1 className="adm-title">Brand</h1>
        </div>
        <a className="adm-btn" href={`/design${LOCKED_HASH}`} target="_blank" rel="noopener noreferrer">Style picker ↗</a>
      </div>

      <section className="adm-section" style={{ marginTop: 0 }}>
        <h2 className="adm-section-title">Logo</h2>
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
          <div className="adm-files" style={{ marginTop: 16 }}>
            {FILES.map((f) => (
              <div className="adm-file" key={f.file}>
                <span className="adm-file-name">{f.name} <span className="adm-mono adm-muted">{f.file.slice(1)}</span></span>
                <span className="adm-actions">
                  <a className="adm-btn adm-btn-small" href={f.file} download>Download</a>
                  <Copy text={`${site}${f.file}`} label={`${f.name} link`} className="adm-btn adm-btn-small" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="adm-section">
        <h2 className="adm-section-title">Colour</h2>
        <div className="adm-swatches">
          <Chip name="Magenta" hex={c.accent.hex} role="Primary. Buttons, team circle, links" />
          {c.accent2 ? <Chip name="Steel" hex={c.accent2.hex} role="Secondary. Eyebrows, tags, organization circle" /> : null}
          <Chip name="Butter" hex={yellow.hex} role="Physical capacity" />
        </div>
        <div className="adm-swatches" style={{ marginTop: 12 }}>
          {MHQ_BANDS.map((b) => <Chip key={b.id} name={b.name} hex={b.hex} role={`TeamQ scale ${b.min} to ${b.max}`} />)}
        </div>
        <div className="adm-swatches" style={{ marginTop: 12 }}>
          <Chip name="Base" hex={c.bg.base} role="Page background" />
          <Chip name="Surface" hex={c.bg.surface} role="Cards" />
          <Chip name="Surface alt" hex={c.bg.surfaceAlt} role="Raised cards, inputs" />
          <Chip name="Border" hex={c.bg.border} role="Rules and borders" />
          <Chip name="Text" hex={c.bg.text} role="Body text" light />
          <Chip name="Muted" hex={c.bg.muted} role="Secondary text" />
        </div>
      </section>

      <section className="adm-section">
        <h2 className="adm-section-title">Type</h2>
        <div className="adm-card">
          {faces.map((f) => (
            <div className="adm-type-sample" key={f.k}>
              <span className="adm-type-k">{f.k}</span>
              <span style={{ fontFamily: f.v, fontSize: f.size, fontWeight: f.weight, letterSpacing: f.tracking, lineHeight: 1.25 }}>{f.sample}</span>
              <span className="adm-actions" style={{ marginTop: 6 }}>
                <Copy text={f.family} label={`font name ${f.family}`} className="adm-btn adm-btn-small">{f.family}</Copy>
                <Copy text={`font-family: "${f.family}", ${f.fallback}; font-weight: ${f.weight};${f.tracking ? ` letter-spacing: ${f.tracking};` : ""}`} label="CSS" className="adm-btn adm-btn-small">CSS</Copy>
                <a className="adm-btn adm-btn-small" href={`https://fonts.google.com/specimen/${f.family.replace(/ /g, "+")}`} target="_blank" rel="noopener noreferrer">Google Fonts ↗</a>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="adm-section">
        <h2 className="adm-section-title">Line weight</h2>
        <div className="adm-card">
          <div className="adm-rules">
            <div className="adm-rule"><span>Thin · {rule.thin}</span><span className="adm-rule-line" style={{ "--w": rule.thin } as React.CSSProperties} /></div>
            <div className="adm-rule"><span>Fat · {rule.fat}</span><span className="adm-rule-line" style={{ "--w": rule.fat } as React.CSSProperties} /></div>
          </div>
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
        <h2 className="adm-section-title">Voice</h2>
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
