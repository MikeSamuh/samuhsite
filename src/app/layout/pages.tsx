"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import type { PageId } from "@/lib/layout";
import { ROUTES, SHOW_CASES } from "@/lib/site";
import "@/components/contact/contact.css";
import { StartEmail } from "@/components/start/StartEmail";
import { ContactForm } from "@/components/contact/ContactForm";
import { ReportCard, rich, useScrollReveal } from "@/app/layout/sections";
import { BarChart, CHART_FACTORS, CHART_RELATIONSHIPS } from "@/components/science/BarChart";
import { ProcessFigure, StageFigure } from "@/components/process-figure/ProcessFigure";
import type { PoseId } from "@/components/process-figure/figures";
import { DEFAULTS, type AboutContent, type ContactContent, type GlobalContent, type ProcessContent, type SolutionsContent, type StartContent } from "@/lib/content/defaults";

/** The words the admin's Content tab edits, passed down from the server.
 *  Without them a page shows the defaults, which are the same words. */
export interface PageCopy {
  global?: GlobalContent;
  about?: AboutContent;
  process?: ProcessContent;
  solutions?: SolutionsContent;
  contact?: ContactContent;
  /** the email box's words, shown on /contact too */
  start?: StartContent;
}

/**
 * The pages behind the nav, composed from docs/scope.md and docs/brief.md.
 * Copy is confirmed material or draft written from the introduction deck
 * and the brief, marked draft where it needs SAMUH's sign-off. No figures,
 * no invented endorsements. Same shared classes as the home sections so the frame
 * dials (alignment, width, spacing, rules, numbers) apply here too.
 */

const stay = (e: React.MouseEvent) => e.preventDefault();

export function Frame({ label, tall }: { label: string; tall?: boolean }) {
  return <div className={`ph${tall ? " ph-tall" : ""}`}>{label}</div>;
}

function PageHead({ n, kicker, title, lede }: { n: string; kicker: string; title: string; lede?: string }) {
  return (
    <section className="L-sec L-page-head" data-n={n}>
      <div className="L-wrap">
        <div className="L-head">
          <span className="L-n">{n}</span>
          <div>
            <p className="eyebrow L-eyebrow">{kicker}</p>
            <h1 className="display L-page-title">{title}</h1>
            {lede ? <p className="lede">{lede}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function Sec({ n, kicker, title, children, id, cls, extra, h1, reveal }: { /** fades up as it scrolls into view, as the home's sections do */ reveal?: boolean; n: string; kicker: string; title: string; children: React.ReactNode; id?: string; cls?: string; /** under the title, in the head */ extra?: React.ReactNode; /** the page's own title: an h1 */ h1?: boolean }) {
  const H = h1 ? "h1" : "h2";
  const secRef = useRef<HTMLElement>(null);
  const noRef = useRef<HTMLElement>(null);
  useScrollReveal(reveal ? secRef : noRef);
  return (
    <section className={`L-sec L-sec-h${cls ? ` ${cls}` : ""}`} id={id} data-n={n} ref={secRef} data-reveal={reveal || undefined}>
      <div className="L-wrap">
        <div className="L-head">
          <span className="L-n">{n}</span>
          <div>
            <p className="eyebrow L-eyebrow">{kicker}</p>
            <H className="sec">{title}</H>
          </div>
          {extra}
        </div>
        {children}
      </div>
    </section>
  );
}

/** A page's own questions, at its foot: the home FAQ's list, one open at
 *  a time. Every answer is in the HTML whether open or not, and the route
 *  carries the same items as FAQPage structured data (16 Nov 2026). */
function Faq({ n, c, reveal }: { reveal?: boolean; n: string; c: { kicker: string; title: string; items: { q: string; a: string }[] } }) {
  if (!c.items.length) return null;
  return (
    <Sec n={n} kicker={c.kicker} title={c.title} id="faq" reveal={reveal}>
      <div className="L-faq">
        {c.items.map(({ q, a }, i) => (
          <details className="L-faq-item" key={q} name="faq" open={i === 0 || undefined}>
            <summary className="L-faq-q">
              <span>{rich(q)}</span>
              <span className="L-faq-mark" aria-hidden>+</span>
            </summary>
            <p className="L-faq-a">{rich(a)}</p>
          </details>
        ))}
      </div>
    </Sec>
  );
}

/* ------------------------------------------------------------------ */

// the traced pose the page morphs between (scripts/figures), one per stage,
// in the order of the words in the content layer. Ritualize has no traced
// pose: the star at rest stands in.
// TODO(asset): a traced figure for Ritualize
const STAR = "/samuh-star.png";
const STAGE_ART: [string, PoseId | null][] = [
  ["/icons/Discover%202.png", "discover"],
  ["/icons/Align%202.png", "align"],
  ["/icons/Belonging%202.png", "cocreate"],
  [STAR, null],
];

const STAGE_SLACK = 72; // a stage takes over this far before its top meets the figure's

/** The stage the reader is on. On the editorial columns at desktop width
 *  the figure under the section's title waits for Pre-work to come level
 *  with it, each stage's words hold beside the figure, and only the stage
 *  the figure shows is seen (Wilfred, 16 Nov 2026). `live` is off where the
 *  figure is not shown: every stage is seen there, with its own art. */
function useStages(listRef: React.RefObject<HTMLElement | null>, figRef: React.RefObject<HTMLElement | null>) {
  const [st, setSt] = useState({ active: 0, started: false, live: false });
  useEffect(() => {
    const root = listRef.current, fig = figRef.current;
    if (!root || !fig) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>(".L-stage"));
    let raf = 0;
    const tick = () => {
      raf = 0;
      const head = fig.parentElement;
      if (!head || fig.offsetParent === null) {
        setSt((p) => (p.live ? { active: 0, started: false, live: false } : p));
        return;
      }
      const top = fig.getBoundingClientRect().top;
      // where the figure sits under the head, so the words stick level with it
      root.style.setProperty("--fig-y", `${Math.round(top - head.getBoundingClientRect().top)}px`);
      const line = top + STAGE_SLACK;
      let active = 0;
      items.forEach((el, j) => { if (el.getBoundingClientRect().top <= line) active = j; });
      const started = items.length > 0 && items[0].getBoundingClientRect().top <= line;
      setSt((p) => (p.active === active && p.started === started && p.live ? p : { active, started, live: true }));
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const ro = new ResizeObserver(kick);
    ro.observe(root);
    kick();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    return () => { ro.disconnect(); cancelAnimationFrame(raf); window.removeEventListener("scroll", kick); window.removeEventListener("resize", kick); };
  }, [listRef, figRef]);
  return st;
}

/** The four stages of an Executive Team Sprint, in the body of its section
 *  (Wilfred, 11 Nov 2026): the section keeps its own head, The main
 *  offering. On the editorial columns at desktop width the stage's figure
 *  is under the section's title (StageHeadFigure) and the stages come in
 *  one at a time beside it; narrower, each stage carries its own figure.
 *  `how` is still the nav's anchor. */
function Stages({ figures, c, listRef, stage }: { figures?: boolean; c: SolutionsContent["stages"]; listRef: React.RefObject<HTMLDivElement | null>; stage: { active: number; live: boolean } }) {
  return (
    <div className="L-exec-stages L-assess-anchor" id="how" data-live={stage.live ? "" : undefined}>
      <div ref={listRef}>
        <ol className="L-stage-list">
          {c.items.slice(0, STAGE_ART.length).map((st, i) => {
            const [icon, pose] = STAGE_ART[i];
            return (
              <li key={st.verb} className="L-stage" data-on={i === stage.active ? "" : undefined}>
                <div className="L-stage-text">
                  {st.when ? <p className="eyebrow L-eyebrow L-stage-line">{st.when}</p> : null}
                  <h3 className="sec L-stage-verb">{st.verb}</h3>
                  <div className="L-stage-copy">
                    <p className="L-mid">{st.body}</p>
                  </div>
                </div>
                <span className="L-stage-art" aria-hidden>
                  {figures && pose ? (
                    <ProcessFigure pose={pose} from={i ? STAGE_ART[i - 1][1] ?? undefined : undefined} />
                  ) : (
                    <Image src={icon} alt="" width={336} height={336} sizes="240px" />
                  )}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
      <p className="L-mid L-stages-keepers">{c.keepers}</p>
    </div>
  );
}

/** The active stage's figure, under the section's title: unseen until
 *  Pre-work is level with it, then one figure that morphs from stage to stage. */
function StageHeadFigure({ figures, active, started, figRef }: { figures?: boolean; active: number; started: boolean; figRef: React.RefObject<HTMLSpanElement | null> }) {
  const [icon, pose] = STAGE_ART[Math.min(active, STAGE_ART.length - 1)];
  return (
    <span className="L-stage-fig" ref={figRef} data-on={started ? "" : undefined} aria-hidden>
      {figures && pose ? <StageFigure pose={pose} /> : <Image src={icon} alt="" width={240} height={240} sizes="240px" />}
    </span>
  );
}

/** A row of tabs over one panel at a time (Wilfred, 16 Nov 2026): the two
 *  tiers, the three assessments. Every panel is in the HTML; the ones not
 *  picked are hidden. Arrow keys move along the row. */
function Tabs({ base, label, items, active, onPick }: { base: string; label: string; items: { tag: string; name: string; id?: string }[]; active: number; onPick: (i: number) => void }) {
  const row = useRef<HTMLDivElement>(null);
  const key = (e: React.KeyboardEvent) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (active + d + items.length) % items.length;
    onPick(n);
    row.current?.querySelectorAll<HTMLElement>('[role="tab"]')[n]?.focus();
  };
  return (
    <div className="L-tabs" role="tablist" aria-label={label} ref={row} onKeyDown={key}>
      {items.map((it, i) => (
        <button key={it.name} type="button" role="tab" id={it.id ?? `${base}-tab-${i}`} className="L-tab L-assess-anchor" aria-selected={i === active} aria-controls={`${base}-panel-${i}`} tabIndex={i === active ? 0 : -1} onClick={() => onPick(i)}>
          <span className="L-tab-tag">{it.tag}</span>
          <span className="L-tab-name">{it.name}</span>
        </button>
      ))}
    </div>
  );
}

/** Solutions (sitemap of 11 Nov 2026, docs/sprint-solutions.md): one page
 *  in sections, each with an id the nav dropdown lands on. Team sprints
 *  first: Executive Team Sprints with the four stages of a sprint, then
 *  the two tiers on the platform, then the assessments, then keynotes and
 *  workshops. The tiers and the assessments are tabs, one panel at a time,
 *  under the same head beside as every other section (Wilfred, 16 Nov
 *  2026). All of it is in the HTML from the start. */
function Solutions({ figures, c = DEFAULTS.solutions, s = DEFAULTS.start }: { figures?: boolean; c?: SolutionsContent; /** the email box's words */ s?: StartContent }) {
  const TIERS = c.tiers.items;
  const ASSESS = c.assess.items;
  const [tier, setTier] = useState(0);
  const [measure, setMeasure] = useState(0);
  // the email box under an assessment: LeadQ or TeamQ, opened by its button (3 Nov 2026)
  const [box, setBox] = useState<"leadq" | "teamq" | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const stagesRef = useRef<HTMLDivElement>(null);
  const figRef = useRef<HTMLSpanElement>(null);
  const stage = useStages(stagesRef, figRef);
  useEffect(() => {
    if (box) boxRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [box]);
  // a link to #leadq, #teamq or #orgq opens that assessment's tab
  useEffect(() => {
    const pick = (hash: string) => {
      const i = ASSESS.findIndex((it) => `#${it.door}` === hash);
      if (i >= 0) setMeasure(i);
    };
    pick(window.location.hash);
    const onHash = () => pick(window.location.hash);
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href*="#"]');
      if (a) pick(new URL(a.href, window.location.href).hash);
    };
    window.addEventListener("hashchange", onHash);
    document.addEventListener("click", onClick);
    return () => { window.removeEventListener("hashchange", onHash); document.removeEventListener("click", onClick); };
  }, [ASSESS]);
  const pickMeasure = (i: number) => { setMeasure(i); setBox(null); };
  return (
    <>
      <PageHead n="01" kicker={c.head.kicker} title={c.head.title} lede={c.head.lede} />
      {/* the main offering leads (Wilfred, 11 Nov 2026), set as the stages
          under it are: the head beside, the words in the column. A sales
          conversation: no checkout, no price, and no button, the nav has it */}
      <Sec n="02" kicker={c.exec.tag} title={c.exec.name} id="sprints" extra={<StageHeadFigure figures={figures} active={stage.active} started={stage.started} figRef={figRef} />}>
        <div className="L-exec-copy" id="executive-sprints">
          <dl className="L-exec-meta">
            <div><dt>{c.tiers.rowWho}</dt><dd>{c.exec.who}</dd></div>
            <div><dt>{c.tiers.rowGet}</dt><dd>{c.exec.get}</dd></div>
          </dl>
        </div>
        <Stages figures={figures} c={c.stages} listRef={stagesRef} stage={stage} />
        {SHOW_CASES ? (
          <div className="L-cases">
            <p className="L-big">{c.cases.title}</p>
            <p className="L-mid">{c.cases.lede}</p>
            <div className="L-voices L-voices-grid">
              {c.cases.items.map((k) => (
                <figure className="card L-quote" key={k.who}>
                  <span className="card-tag">{k.who} &middot; {k.span}</span>
                  <dl className="L-case-stats">
                    <div className="L-stat"><dt className="L-stat-n">{k.n1}</dt><dd className="L-cap">{k.l1}</dd></div>
                    <div className="L-stat"><dt className="L-stat-n">{k.n2}</dt><dd className="L-cap">{k.l2}</dd></div>
                  </dl>
                  <blockquote>{k.quote}</blockquote>
                  <figcaption className="L-cap">{k.by}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        ) : null}
      </Sec>
      <Sec n="02" kicker={c.tiers.kicker} title={c.tiers.title} id="platform">
        <Tabs base="tier" label={c.tiers.title} items={TIERS} active={tier} onPick={setTier} />
        {TIERS.map((t, i) => (
          <div className="L-panel" role="tabpanel" id={`tier-panel-${i}`} aria-labelledby={`tier-tab-${i}`} hidden={i !== tier} key={t.name}>
            <p className="L-panel-what">{t.what}</p>
            <dl className="L-rows">
              <div><dt>{c.tiers.rowWho}</dt><dd>{t.who}</dd></div>
              <div><dt>{c.tiers.rowGet}</dt><dd>{t.get}</dd></div>
              {c.tiers.rows.map((r) => (
                <div key={r.label}><dt>{r.label}</dt><dd>{[r.a, r.b][i]}</dd></div>
              ))}
            </dl>
          </div>
        ))}
        <p className="L-mid L-panel-note">{c.tiers.note}</p>
      </Sec>
      <Sec n="03" kicker={c.assess.kicker} title={c.assess.title} id="assess">
        {c.assess.lede ? <p className="L-mid">{c.assess.lede}</p> : null}
        <Tabs base="assess" label={c.assess.kicker} items={ASSESS.map((it) => ({ tag: it.tag, name: it.name, id: it.door }))} active={measure} onPick={pickMeasure} />
        {ASSESS.map((it, i) => (
          <div className="L-panel" role="tabpanel" id={`assess-panel-${i}`} aria-labelledby={it.door} hidden={i !== measure} key={it.name}>
            <p className="L-panel-price">{it.price}</p>
            <p className="L-panel-what">{it.what}</p>
            {it.more ? <p className="L-mid">{it.more}</p> : null}
            <dl className="L-rows">
              <div><dt>{c.assess.rowWho}</dt><dd>{it.who}</dd></div>
              <div><dt>{c.assess.rowGet}</dt><dd>{it.get}</dd></div>
            </dl>
            {it.door === "orgq" ? (
              <Link className="btn btn-secondary" href={ROUTES.contact}>{it.button}</Link>
            ) : (
              <button type="button" className={`btn${it.door === "teamq" ? "" : " btn-secondary"}`} onClick={() => setBox(it.door === "teamq" ? "teamq" : "leadq")} aria-pressed={box === it.door} aria-controls="assess-box">{it.button}</button>
            )}
          </div>
        ))}
        {box ? (
          <div className="L-assess-box" id="assess-box" ref={boxRef}>
            <p className="eyebrow L-eyebrow">{box === "teamq" ? "TeamQ" : "LeadQ"}</p>
            <StartEmail c={s.form} intent={box} talk={false} key={box} />
          </div>
        ) : null}
        {c.assess.note ? <p className="L-mid L-panel-note">{c.assess.note}</p> : null}
      </Sec>
      <Sec n="04" kicker={c.workshops.kicker} title={c.workshops.title} id="workshops">
        {c.workshops.lead ? <p className="L-panel-what">{c.workshops.lead}</p> : null}
        {c.workshops.body ? <p className="L-mid L-workshops-body">{c.workshops.body}</p> : null}
        <dl className="L-rows">
          {c.workshops.formats.map((f) => (
            <div key={f.name}><dt>{f.name}</dt><dd>{f.line}</dd></div>
          ))}
        </dl>
        {c.workshops.button ? <Link className="btn" href={ROUTES.contact}>{c.workshops.button}</Link> : null}
      </Sec>
      <Faq n="05" c={c.faq} />
    </>
  );
}

/* ------------------------------------------------------------------ */

/** The Science, was Methodology (Wilfred, 16 Nov 2026; the page id is
 *  still "process", the route is /science): the science alone, then
 *  the ask. The path of three sprints is off the page. The four stages of
 *  a sprint are on Solutions (Stages). */
function Process({ c = DEFAULTS.process, g = DEFAULTS.global }: { c?: ProcessContent; g?: GlobalContent }) {
  return (
    <>
      <PageHead n="01" kicker={c.head.kicker} title={c.head.title} lede={c.head.lede} />
      <Sec n="02" kicker={c.science.kicker} title={c.science.title} id="science" cls="L-sci" reveal>
        <p className="L-mid">{c.science.p1}</p>
        <p className="L-mid">{c.science.p2}</p>
        {/* the three figures as bullets under the paragraphs, the number
            in the accent (16 Nov 2026) */}
        <ul className="L-sci-list">
          {c.science.stats.map((st) => (
            <li key={st.n}><strong className="L-sci-n">{st.n}</strong> {st.label}</li>
          ))}
        </ul>
      </Sec>
      <Sec n="03" kicker={c.mhq.kicker} title={c.mhq.title} id="mhq" cls="L-sci" reveal>
        <p className="L-mid">{c.mhq.lede}</p>
        <dl className="L-dims">
          {c.mhq.items.map((it) => (
            <div className="L-dim" key={it.name}>
              <dt>{it.name}</dt>
              <dd>{it.line}</dd>
            </div>
          ))}
        </dl>
      </Sec>
      {/* the two Sapien Labs graphs Jake chose, redrawn in the brand, one
          under the other (16 Nov 2026), then the report they come from */}
      <Sec n="04" kicker={c.env.kicker} title={c.env.title} id="research" cls="L-sci" reveal>
        <p className="L-mid">{c.env.p1}</p>
        {c.env.p2 ? <p className="L-mid">{c.env.p2}</p> : null}
        <div className="L-charts">
          <BarChart n="Figure 1" title={c.env.chart1Title} note={c.env.chart1Note} chart={CHART_FACTORS} />
          <BarChart n="Figure 2" title={c.env.chart2Title} note={c.env.chart2Note} chart={CHART_RELATIONSHIPS} />
          <p className="L-cap L-chart-source">{c.env.source}</p>
        </div>
        {/* no tag on the card here: the section's eyebrow already says
            the research */}
        <ReportCard report={g.report} noTag />
        <div className="cta-row L-stages-cta">
          <Link className="btn" href={ROUTES.start}>{c.science.ctaPrimary} <span className="arrow">&rarr;</span></Link>
          <Link className="btn btn-secondary" href={ROUTES.solutions}>{c.science.ctaSecondary}</Link>
        </div>
      </Sec>
      <Faq n="05" c={c.faq} reveal />
    </>
  );
}

/* ------------------------------------------------------------------ */

function Insights() {
  return (
    <>
      <PageHead n="01" kicker="The education layer" title="Insights." lede="Foundations, articles, video and research in one feed. Start with the foundations if the argument is new to you." />
      <Sec n="02" kicker="Research · distinct treatment" title="Sapien Labs Work Culture Report">
        <div className="L-research-card card">
          <Frame label="Report cover" />
          <div>
            <span className="card-tag">Research · in partnership with Sapien Labs</span>
            <p className="L-mid">The research spine of the site. How the conditions people work in relate to how they feel and how they function, read across countries and industries, and what that means for the teams inside a multi-team organization.</p>
            <a href="#" className="inline-link" onClick={stay}>Read the report</a>
          </div>
        </div>
      </Sec>
      <Sec n="03" kicker="Latest" title="From the feed">
        <div className="L-feed">
          {[
            ["Foundations", "Capacity", "Why teams leak performance", "The environment, not the effort. The argument in one sitting."],
            ["Article", "Rituals", "What a ritual is, and is not", "A repeatable practice the team owns, against a meeting nobody asked for."],
            ["Video", "Measurement", "Reading a TeamQ report", "Thirteen factors, thirteen practices, and the one number that matters."],
            ["Foundations", "Team practices", "The four conditions of a team environment", "Social, autonomous, meaningful, healthy. What each looks like on a Tuesday."],
            ["Article", "Team practices", "Feedback as a practice", "How one leadership team turned the hardest conversation into a habit."],
            ["Video", "Rituals", "Ninety days, one ritual", "What changes when a team commits to a single practice and measures it."],
          ].map(([k, topic, title, stand], i) => (
            <article className="card L-post" key={i}>
              <Frame label={k === "Video" ? "Video still · YouTube or Vimeo embed" : "Illustration"} />
              <span className="card-tag">{k} · {topic}</span>
              <h3>{title}</h3>
              <p>{stand}</p>
              <span className="L-cap">Samuh · draft · {k === "Video" ? "watch" : "read"} time</span>
            </article>
          ))}
        </div>
        <p className="L-cap">Email is offered after the content, never before it.</p>
      </Sec>
    </>
  );
}

/* ------------------------------------------------------------------ */

// headshots: the 141px ones from the current samuh.work until the client
// sends proper ones; Jake's is his own, sent 14 October 2026. The files
// and the words are in the content layer now, editable in the admin.
// The team comes first and one person to a row (Wilfred, 5 Nov 2026), so
// the people are the page's most prominent thing. What we believe closes
// the page (Wilfred, 6 Nov 2026)
function About({ c = DEFAULTS.about }: { c?: AboutContent }) {
  return (
    <>
      <PageHead n="01" kicker={c.head.kicker} title={c.head.title} lede={c.head.lede} />
      <Sec n="02" kicker={c.team.kicker} title={c.team.title} id="team">
        <div className="L-team">
          {c.team.members.map(({ name, role, bio, about, photo }) => {
            const paras = (about ?? "").split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);
            return (
              <article className="L-person" key={name}>
                {photo ? <Image className="L-person-photo" src={photo} alt={name} width={141} height={141} /> : <Frame label="Photo" />}
                <div className="L-person-text">
                  <span className="L-person-name">{name}</span>
                  <span className="L-cap">{role}</span>
                  {paras.length ? paras.map((x, i) => <p key={i}>{x}</p>) : <p>{bio}</p>}
                </div>
              </article>
            );
          })}
        </div>
      </Sec>
      <Sec n="03" kicker={c.partner.kicker} title={c.partner.title}>
        <div className="L-partner">
          <Image className="L-partner-logo" src="/sapien-labs.png" alt="Sapien Labs" width={820} height={240} sizes="200px" />
          <div>
            <p className="L-mid">{c.partner.p1}</p>
            <p className="L-mid">{c.partner.p2}</p>
          </div>
        </div>
      </Sec>
      <Sec n="04" kicker={c.believe.kicker} title={c.believe.title}>
        <p className="L-big">{c.believe.big}</p>
        <p className="L-mid">{c.believe.p1}</p>
        <p className="L-mid">{c.believe.p2}</p>
      </Sec>
    </>
  );
}

/* ------------------------------------------------------------------ */

/** Let's talk (Wilfred, 5 Nov 2026): the call back form, then the free
 *  assessment's email box as the CTA at the foot. The direct details are
 *  in the footer's Talk to us column.
 *  6 Nov 2026: the form is two sentences in the display type, so it is the
 *  page head, and the whole of it fits one screen. Under the assessment, the email box
 *  first and the line under it. */
function Contact({ c = DEFAULTS.contact, s = DEFAULTS.start }: { c?: ContactContent; s?: StartContent }) {
  return (
    <>
      {/* set as the assessment under it is (Wilfred, 11 Nov 2026): the head
          beside, the form in the column, so it reads as a form to fill in */}
      <Sec n="01" kicker={c.head.kicker} title={c.head.title} cls="contact-sec" h1>
        <ContactForm c={c.form} />
      </Sec>
      <Sec n="02" kicker={c.assess.kicker} title={c.assess.title} cls="contact-assess" id="assess">
        <StartEmail c={s.form} talk={false} />
        <p className="L-mid contact-assess-line">{c.assess.line}</p>
      </Sec>
    </>
  );
}

/* ------------------------------------------------------------------ */

export function Page({ id, figures, content }: { id: PageId; figures?: boolean; /** the admin's words; the defaults without them */ content?: PageCopy }) {
  switch (id) {
    case "solutions": return <Solutions figures={figures} c={content?.solutions} s={content?.start} />;
    case "process": return <Process c={content?.process} g={content?.global} />;
    case "insights": return <Insights />;
    case "about": return <About c={content?.about} />;
    case "contact": return <Contact c={content?.contact} s={content?.start} />;
    default: return null;
  }
}
