"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cssVars, bodyName } from "@/lib/tokens";
import { VIEWS, PRESETS, lockedCombo, type ViewId } from "@/lib/layout";
import { DRAFTS, draftBase, type DraftId } from "./drafts";
import "../design/design.css";
import "./draft.css";

/**
 * /draft. The third step after /design (style) and /layout (frame): the
 * site itself, in three drafts. This page is the style guide the drafts
 * share, then each draft in a frame at desktop, tablet and phone width.
 */
export default function DraftIndex() {
  const [draft, setDraft] = useState<DraftId>("a");
  const [view, setView] = useState<ViewId>("desktop");

  // the hash records the state, #<draft>.<view>, so a link opens where it was made
  useEffect(() => {
    const read = () => {
      const parts = window.location.hash.replace(/^#/, "").split(".").filter(Boolean);
      const d = DRAFTS.find((x) => parts.includes(x.id));
      const v = VIEWS.find((x) => parts.includes(x.id));
      if (d) setDraft(d.id);
      if (v) setView(v.id);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);
  useEffect(() => {
    window.history.replaceState(null, "", `#${draft}${view === "desktop" ? "" : `.${view}`}`);
  }, [draft, view]);

  const base = DRAFTS[0].layout;
  const combo = lockedCombo(base.bg);
  const preset = PRESETS[0];
  const px = VIEWS.find((v) => v.id === view)?.px ?? 1440;
  const cur = DRAFTS.find((d) => d.id === draft) ?? DRAFTS[0];

  const steps = [
    { n: "01", name: "Style", href: "/design", note: "Background, accents, type, lines, motion. Locked 25 September." },
    { n: "02", name: "Layout", href: "/layout", note: "Frame and a variant per section. Editorial, 27 September." },
    { n: "03", name: "Drafts", href: "/draft", note: "The site, sculpted. Three passes, one style.", here: true },
  ];

  const guide: { k: string; rows: [string, string][] }[] = [
    {
      k: "Colour",
      rows: [
        ["Background", combo.bg.name],
        ["Accent 1, loud", `${combo.accent.name} ${combo.accent.hex}`],
        ["Accent 2, quiet", `${combo.accent2.name} ${combo.accent2.hex}`],
      ],
    },
    {
      k: "Type",
      rows: [
        ["Display", combo.type.displayName],
        ["Body", bodyName(combo)],
        ["Captions", combo.caption?.name ?? "IBM Plex Mono"],
        ["Eyebrows", combo.eyebrow?.name ?? "IBM Plex Mono"],
      ],
    },
    {
      k: "Lines and motion",
      rows: [
        ["Line weight", `${combo.weight.name} ${combo.scale.name}`],
        ["Entrance", combo.entrance.name],
        ["Hover", combo.hover.name],
      ],
    },
    {
      k: "Frame",
      rows: [
        ["Composition", base.comp.name],
        ["Alignment", base.align.name],
        ["Column", `${base.width.name}, ${base.width.px}px`],
        ["Spacing", base.spacing.name],
        ["Nav", base.nav.name],
        ["Dividers", base.divider.name],
        ["Buttons", base.buttons.name],
      ],
    },
  ];

  return (
    <div className="stage I-stage" style={cssVars(combo)} data-approach="modern" data-fill="solid" data-hover={combo.hover.id} data-entrance="still">
      <div className="I-wrap">
        <header className="I-top">
          <span className="L-cap">Samuh &middot; drafts &middot; in partnership with Sapien Labs</span>
          <nav className="I-steps" aria-label="Where this sits">
            {steps.map((s) => (
              <Link key={s.n} href={s.href} className="I-step" aria-current={s.here ? "page" : undefined} title={s.note}>
                <span className="I-step-n">{s.n}</span>
                <span className="I-step-name">{s.name}</span>
              </Link>
            ))}
          </nav>
        </header>

        <section className="I-intro">
          <p className="eyebrow">Step three</p>
          <h1 className="display I-title">Three drafts, one style.</h1>
          <p className="lede">The design set the style. The layout set the frame. These are the site itself, sculpted three ways from the same choices. Pick a draft, then a width.</p>
        </section>

        <section className="I-guide" aria-label="Style guide">
          <div className="I-swatches" aria-hidden>
            <span className="I-swatch I-swatch-base"><i>Base</i></span>
            <span className="I-swatch I-swatch-surface"><i>Surface</i></span>
            <span className="I-swatch I-swatch-a1"><i>Accent 1</i></span>
            <span className="I-swatch I-swatch-a2"><i>Accent 2</i></span>
            <span className="I-swatch I-swatch-type"><b>Aa</b><i>{combo.type.displayName}</i></span>
          </div>
          <div className="I-guide-grid">
            {guide.map((g) => (
              <dl key={g.k} className="I-spec">
                <span className="L-cap I-spec-k">{g.k}</span>
                {g.rows.map(([k, v]) => (
                  <div key={k} className="I-spec-row">
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            ))}
          </div>
          <p className="I-guide-note">
            Every value above reads from <code>src/lib/tokens.ts</code> and <code>src/lib/layout.ts</code>. The style hash is <code>{preset.hash.split(".")[0]}</code> on <code>{combo.bg.name}</code>; the frame is preset {preset.letter}, {preset.name}.
          </p>
        </section>

        <section className="I-drafts" aria-label="Drafts">
          <div className="I-picks" role="group" aria-label="Pick a draft">
            {DRAFTS.map((d) => (
              <button key={d.id} className="I-pick" aria-pressed={d.id === draft} onClick={() => setDraft(d.id)}>
                <span className="I-pick-letter">{d.letter}</span>
                <span className="I-pick-body">
                  <span className="I-pick-name">{d.name}</span>
                  <span className="I-pick-owner L-cap">{d.owner}</span>
                  <span className="I-pick-note">{d.note}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="I-bar">
            <span className="I-bar-name">
              Draft {cur.letter} &middot; {cur.name}
            </span>
            <div className="I-views" role="group" aria-label="Preview width">
              {VIEWS.map((v) => (
                <button key={v.id} className="opt opt-tight" aria-pressed={v.id === view} onClick={() => setView(v.id)} title={`${v.px}px wide`}>
                  {v.name}
                </button>
              ))}
            </div>
            <Link href={draftBase(draft)} className="tbtn tbtn-accent I-open" target="_blank" rel="noopener">
              Open full screen &rarr;
            </Link>
          </div>

          <div className="I-frame" data-view={view} style={{ "--view-w": `${px}px` } as React.CSSProperties}>
            <iframe
              key={`${draft}-${view}`}
              className="I-iframe"
              src={draftBase(draft)}
              title={`Draft ${cur.letter} at ${px}px`}
            />
          </div>
          <p className="I-under">Draft {cur.letter} &middot; {px}px &middot; the frame scrolls on its own</p>
        </section>
      </div>
    </div>
  );
}
