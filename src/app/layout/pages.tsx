"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import type { PageId } from "@/lib/layout";
import { ROUTES, SHOW_CASES } from "@/lib/site";
import "@/components/contact/contact.css";
import { StartEmail } from "@/components/start/StartEmail";
import { useActiveItem } from "@/components/focus-morph/Who";
import { ContactForm } from "@/components/contact/ContactForm";
import { ReportCard } from "@/app/layout/sections";
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

function Sec({ n, kicker, title, children, id, cls, extra, h1 }: { n: string; kicker: string; title: string; children: React.ReactNode; id?: string; cls?: string; /** under the title, in the head */ extra?: React.ReactNode; /** the page's own title: an h1 */ h1?: boolean }) {
  const H = h1 ? "h1" : "h2";
  return (
    <section className={`L-sec L-sec-h${cls ? ` ${cls}` : ""}`} id={id} data-n={n}>
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

const STAGE_LINE = 96; // a stage takes over once its top is this far below the nav

/** The stage the reader is on, and whether the stages have come up the
 *  page yet: the figure under the section's title waits for Pre-work. */
function useStages(ref: React.RefObject<HTMLElement | null>) {
  const active = useActiveItem(ref, ".L-stage", STAGE_LINE);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const tick = () => setStarted(el.getBoundingClientRect().top <= window.innerHeight * 0.7);
    tick();
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
    return () => { window.removeEventListener("scroll", tick); window.removeEventListener("resize", tick); };
  }, [ref]);
  return { active, started };
}

/** The four stages of an Executive Team Sprint, in the body of its section
 *  (Wilfred, 11 Nov 2026): the section keeps its own head, The main
 *  offering. Pre-work is the one stage with a line over its verb. On the
 *  editorial columns at desktop width the stage's figure is under the
 *  section's title (StageHeadFigure) and swaps as the stages scroll past;
 *  narrower, each stage carries its own. `how` is still the nav's anchor. */
function Stages({ figures, c, lead, listRef }: { figures?: boolean; c: SolutionsContent["stages"]; /** what the sprint is, over the stages */ lead?: string; listRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div className="L-exec-stages L-assess-anchor" id="how">
      {lead ? <p className="L-mid L-stages-lead">{lead}</p> : null}
      <div ref={listRef}>
        <ol className="L-stage-list">
          {c.items.slice(0, STAGE_ART.length).map((st, i) => {
            const [icon, pose] = STAGE_ART[i];
            return (
              <li key={st.verb} className="L-stage">
                {st.when ? <p className="eyebrow L-eyebrow L-stage-line">{st.when}</p> : null}
                <h3 className="sec L-stage-verb">{st.verb}</h3>
                <div className="L-stage-copy">
                  <p className="L-mid">{st.body}</p>
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

/** The active stage's figure, under the section's title: unseen until the
 *  stages come up, then one figure that morphs from stage to stage. */
function StageHeadFigure({ figures, active, started }: { figures?: boolean; active: number; started: boolean }) {
  const [icon, pose] = STAGE_ART[Math.min(active, STAGE_ART.length - 1)];
  return (
    <span className="L-stage-fig" data-on={started ? "" : undefined} aria-hidden>
      {figures && pose ? <StageFigure pose={pose} /> : <Image src={icon} alt="" width={240} height={240} sizes="240px" />}
    </span>
  );
}

/** Solutions (sitemap of 11 Nov 2026, docs/sprint-solutions.md): one page
 *  in sections, each with an id the nav dropdown lands on. Team sprints
 *  first: Executive Team Sprints, then how a sprint runs, the four stages
 *  that were on Methodology, then the two tiers on the platform. Then the
 *  assessments as three cards, then keynotes and workshops. Who we work
 *  with went to the home; the form and the quotes at the foot are off,
 *  and no section ends on a Talk to us button (Wilfred, 11 Nov 2026): the
 *  nav carries it. All of it is in the HTML from the start. */
function Solutions({ figures, c = DEFAULTS.solutions, s = DEFAULTS.start }: { figures?: boolean; c?: SolutionsContent; /** the email box's words */ s?: StartContent }) {
  const TIERS = c.tiers.items;
  // the email box in an assessment's row: LeadQ or TeamQ, opened by the row's button (3 Nov 2026)
  const [box, setBox] = useState<"leadq" | "teamq" | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const stagesRef = useRef<HTMLDivElement>(null);
  const stage = useStages(stagesRef);
  useEffect(() => {
    if (box) boxRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [box]);
  return (
    <>
      <PageHead n="01" kicker={c.head.kicker} title={c.head.title} lede={c.head.lede} />
      {/* the main offering leads (Wilfred, 11 Nov 2026), set as the stages
          under it are: the head beside, the words in the column. A sales
          conversation: no checkout, no price, and no button, the nav has it */}
      <Sec n="02" kicker={c.exec.tag} title={c.exec.name} id="sprints" extra={<StageHeadFigure figures={figures} active={stage.active} started={stage.started} />}>
        <div className="L-exec-copy" id="executive-sprints">
          <dl className="L-exec-meta">
            <div><dt>{c.tiers.rowWho}</dt><dd>{c.exec.who}</dd></div>
            <div><dt>{c.tiers.rowGet}</dt><dd>{c.exec.get}</dd></div>
          </dl>
        </div>
        <Stages figures={figures} c={c.stages} lead={c.exec.what} listRef={stagesRef} />
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
      <Sec n="02" kicker={c.tiers.kicker} title={c.tiers.title} cls="L-sec-full" id="platform">
        <ul className="L-assess L-tiers">
          {TIERS.map((t, i) => (
            <li className="card L-assess-card" key={t.name}>
              <span className="card-tag">{t.tag}</span>
              <h3 className="L-assess-name">{t.name}</h3>
              <p className="L-assess-what">{t.what}</p>
              <dl className="L-assess-meta">
                <div><dt className="L-cap">{c.tiers.rowWho}</dt><dd>{t.who}</dd></div>
                <div><dt className="L-cap">{c.tiers.rowGet}</dt><dd>{t.get}</dd></div>
                {c.tiers.rows.map((r) => (
                  <div key={r.label}><dt className="L-cap">{r.label}</dt><dd>{[r.a, r.b][i]}</dd></div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
        <p className="L-mid">{c.tiers.note}</p>
      </Sec>
      <Sec n="03" kicker={c.assess.kicker} title={c.assess.title} cls="L-sec-full" id="assess">
        {c.assess.lede ? <p className="L-mid">{c.assess.lede}</p> : null}
        <ul className="L-assess">
          {c.assess.items.map((it, i) => (
            <li className="card L-assess-card L-assess-anchor" key={it.name} id={it.door}>
              <span className="card-tag">{it.tag}</span>
              <h3 className="L-assess-name">{it.name}</h3>
              <span className="L-assess-price">{it.price}</span>
              <p className="L-assess-what">{it.what}</p>
              {it.more ? <p className="L-assess-what L-org-more">{it.more}</p> : null}
              <dl className="L-assess-meta">
                <div><dt className="L-cap">{c.assess.rowWho}</dt><dd>{it.who}</dd></div>
                <div><dt className="L-cap">{c.assess.rowGet}</dt><dd>{it.get}</dd></div>
              </dl>
              {it.door === "orgq" ? (
                <Link className="btn btn-secondary" href={ROUTES.contact}>{it.button}</Link>
              ) : (
                <button type="button" className={`btn${i === 1 ? "" : " btn-secondary"}`} onClick={() => setBox(it.door === "teamq" ? "teamq" : "leadq")} aria-pressed={box === it.door} aria-controls="assess-box">{it.button}</button>
              )}
            </li>
          ))}
        </ul>
        {box ? (
          <div className="L-assess-box" id="assess-box" ref={boxRef}>
            <p className="eyebrow L-eyebrow">{box === "teamq" ? "TeamQ" : "LeadQ"}</p>
            <StartEmail c={s.form} intent={box} talk={false} key={box} />
          </div>
        ) : null}
        {c.assess.note ? <p className="L-mid">{c.assess.note}</p> : null}
      </Sec>
      <Sec n="04" kicker={c.workshops.kicker} title={c.workshops.title} id="workshops">
        {c.workshops.body ? <p className="L-mid">{c.workshops.body}</p> : null}
      </Sec>
    </>
  );
}

/* ------------------------------------------------------------------ */

/** Methodology (the page id is still "process"), research first
 *  (sitemap of 11 Nov 2026): the science, then the path of three sprints,
 *  and the ask. The four stages of a sprint are on Solutions (Stages). */
function Process({ c = DEFAULTS.process, g = DEFAULTS.global }: { c?: ProcessContent; g?: GlobalContent }) {
  return (
    <>
      <PageHead n="01" kicker={c.head.kicker} title={c.head.title} lede={c.head.lede} />
      <Sec n="02" kicker={c.science.kicker} title={c.science.title} id="science">
        <p className="L-mid">{c.science.p1}</p>
        <p className="L-mid">{c.science.p2}</p>
        <dl className="L-case-stats L-sci-stats">
          {c.science.stats.map((st) => (
            <div className="L-stat" key={st.n}>
              <dt className="L-stat-n">{st.n}</dt>
              <dd className="L-cap">{st.label}</dd>
            </div>
          ))}
        </dl>
        <ReportCard report={g.report} />
        {/* the Sapien Labs graphs, redrawn, as a carousel: step 9 of the
            runbook, once Jake sends which graphs and their numbers.
            Nothing renders until then (docs/sprint-solutions.md, section 8) */}
      </Sec>
      <Sec n="03" kicker={c.path.kicker} title={c.path.title} id="path">
        <ol className="L-steps L-path">
          {c.path.items.map((it) => (
            <li className="L-step" key={it.tag}>
              <span className="card-tag">{it.tag}</span>
              <span className="L-path-line">{it.line}</span>
            </li>
          ))}
        </ol>
        <p className="L-mid">{c.path.note}</p>
        <div className="cta-row L-stages-cta">
          <Link className="btn" href={ROUTES.start}>{c.science.ctaPrimary} <span className="arrow">&rarr;</span></Link>
          <Link className="btn btn-secondary" href={ROUTES.solutions}>{c.science.ctaSecondary}</Link>
        </div>
      </Sec>
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
