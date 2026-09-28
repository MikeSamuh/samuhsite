"use client";

import { useEffect, useRef, useState } from "react";
import { BACKGROUNDS, cssVars, comboName } from "@/lib/tokens";
import {
  ALIGNS, WIDTHS, SPACINGS, NAVS, DIVIDERS, NUMBERS, HEADS, BUTTONS, COMPS, VIEWS,
  SECTIONS, PAGES, PRESETS, FEEDBACK, OFF, LOCKED_HASH,
  DEFAULT_LAYOUT, lockedCombo, layoutHash, parseLayoutHash, sameLayout,
  layoutName, layoutVars,
  type Layout, type SectionId, type PageId, type Opt,
} from "@/lib/layout";
import { Page } from "./pages";
import { Nav, Section, Footer } from "./sections";
import Backdrop from "../design/Backdrop";
import "../design/backdrops.css";
import "../design/design.css";
import "./layout.css";


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
              <Footer go={go} />
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
