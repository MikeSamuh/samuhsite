"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import type { PageId } from "@/lib/layout";
import { ROUTES, SHOW_CASES } from "@/lib/site";
import { OrgFigure, type OrgLevel } from "@/components/focus-morph/people";
import "@/components/contact/contact.css";
import { StartEmail } from "@/components/start/StartEmail";
import { ContactForm } from "@/components/contact/ContactForm";
import { ReportCard } from "@/app/layout/sections";
import { ProcessFigure, StageFigure } from "@/components/process-figure/ProcessFigure";
import type { PoseId } from "@/components/process-figure/figures";
import { Honeypot } from "@/components/lead/Honeypot";
import { Turnstile } from "@/components/lead/Turnstile";
import { useLeadSubmit } from "@/components/lead/useLeadSubmit";
import { DEFAULTS, type AboutContent, type ContactContent, type GlobalContent, type ProcessContent, type SolutionsContent, type StartContent } from "@/lib/content/defaults";
import { fill } from "@/lib/content/shared";
import { EMAIL_SHAPE } from "@/lib/lead";

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

function Sec({ n, kicker, title, children, id, cls }: { n: string; kicker: string; title: string; children: React.ReactNode; id?: string; cls?: string }) {
  return (
    <section className={`L-sec L-sec-h${cls ? ` ${cls}` : ""}`} id={id} data-n={n}>
      <div className="L-wrap">
        <div className="L-head">
          <span className="L-n">{n}</span>
          <div>
            <p className="eyebrow L-eyebrow">{kicker}</p>
            <h2 className="sec">{title}</h2>
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const HEAD_TOP = 28; // the sticky head's offset below the nav, as in layout.css

/** Which of a section's items the reader is on: the last one whose top has
 *  passed a line `below` px under the stuck head. One scroll listener,
 *  one frame at a time. The Methodology stages and Who we work with both
 *  read it. */
function useActiveItem(ref: React.RefObject<HTMLElement | null>, selector: string, below: number) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>(selector));
    if (!items.length) return;
    let raf = 0;
    const tick = () => {
      raf = 0;
      const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 0;
      const line = navH + HEAD_TOP + below;
      let i = 0;
      items.forEach((el, j) => { if (el.getBoundingClientRect().top <= line) i = j; });
      setActive(i);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const ro = new ResizeObserver(kick);
    ro.observe(root);
    kick();
    window.addEventListener("scroll", kick, { passive: true });
    return () => { ro.disconnect(); cancelAnimationFrame(raf); window.removeEventListener("scroll", kick); };
  }, [ref, selector, below]);
  return active;
}

const LEVELS: OrgLevel[] = ["one", "team", "teams"];

/** Who we work with (Wilfred, 11 Nov 2026): the org chart stays on the
 *  left, one person, one team, several teams, joined by a hairline, the
 *  home's people. On the right the three levels scroll past, and the one
 *  being read lights its figure, the way the Methodology stages swap. On a
 *  narrow page the chart is off and each level carries its own figure. */
function Who({ c }: { c: SolutionsContent["who"] }) {
  const ref = useRef<HTMLElement>(null);
  const active = useActiveItem(ref, ".L-who-item", 120);
  return (
    <section className="L-sec L-sec-h L-whos" id="who" data-n="02" ref={ref}>
      <div className="L-wrap">
        <div className="L-head">
          <span className="L-n">02</span>
          <div>
            <p className="eyebrow L-eyebrow">{c.kicker}</p>
            <h2 className="sec">{c.title}</h2>
          </div>
          <span className="L-who-chart" aria-hidden>
            {c.items.map((it, i) => (
              <span className="L-who-node" key={it.name} data-on={i === active ? "" : undefined}><OrgFigure level={LEVELS[i] ?? "teams"} /></span>
            ))}
          </span>
        </div>
        <ol className="L-who-list">
          {c.items.map((it, i) => (
            <li className="L-who-item" key={it.name} data-on={i === active ? "" : undefined}>
              <span className="L-who-art"><OrgFigure level={LEVELS[i] ?? "teams"} /></span>
              <h3 className="L-who-name">{it.name}</h3>
              <span className="L-who-who">{it.who}</span>
              <p className="L-mid">{it.line}</p>
              <Link className="inline-link" href={`${ROUTES.solutions}#${it.door}`}>{it.link} <span className="arrow">&darr;</span></Link>
            </li>
          ))}
        </ol>
        <p className="L-mid">{c.coaches} <Link className="inline-link" href={ROUTES.contact}>{c.coachesLink}</Link></p>
      </div>
    </section>
  );
}

/** Solutions (call of 6 Nov 2026, docs/sprint-solutions.md): one page in
 *  sections, each with an id the nav dropdown lands on. Who we work with
 *  first, on the org chart (Who, above), then the assessment for each of
 *  the three as three columns (Wilfred, 11 Nov 2026); the sprints, on the platform and then Executive Team
 *  Sprints; keynotes and workshops; the ask; proof. All of it is in the
 *  HTML from the start. */
function Solutions({ c = DEFAULTS.solutions, g = DEFAULTS.global, s = DEFAULTS.start }: { c?: SolutionsContent; g?: GlobalContent; /** the email box's words */ s?: StartContent }) {
  const TIERS = c.tiers.items;
  // nothing picked until the reader picks: a tier's button, or the form's
  const [tier, setTier] = useState("");
  // the email box in an assessment's row: LeadQ or TeamQ, opened by the row's button (3 Nov 2026)
  const [box, setBox] = useState<"leadq" | "teamq" | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (box) boxRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [box]);
  // the ask at the foot: an email and the pick, posted as flow "solutions"
  const { submit, state, attempt } = useLeadSubmit("solutions");
  const [token, setToken] = useState<string>();
  const [emailError, setEmailError] = useState<string>();
  const [nameError, setNameError] = useState<string>();
  const [pickError, setPickError] = useState<string>();
  const pickOf = (name: string) => { setTier(name); setPickError(undefined); };
  // a tier's button: it goes to the form and sits pressed there
  const ask = (name: string) => {
    pickOf(name);
    document.getElementById("talk")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const onTalk = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const noName = name ? undefined : "Enter your name.";
    const found = !email ? "Enter your email address." : !EMAIL_SHAPE.test(email) ? "Enter an email address like name@company.com." : undefined;
    const unpicked = tier ? undefined : c.talk.pickFirst;
    setNameError(noName);
    setEmailError(found);
    setPickError(unpicked);
    if (noName || found || unpicked) return;
    void submit({ name, phone: phone || undefined, email, pick: tier, company_website: String(data.get("company_website") ?? "") || undefined, turnstileToken: token });
  };
  return (
    <>
      <PageHead n="01" kicker={c.head.kicker} title={c.head.title} lede={c.head.lede} />
      <Who c={c.who} />
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
      <Sec n="04" kicker={c.tiers.kicker} title={c.tiers.title} cls="L-sec-full" id="sprints">
        <p className="L-cap L-sub-h">{c.tiers.platform}</p>
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
              <button type="button" className="btn btn-secondary" onClick={() => ask(t.name)} aria-pressed={t.name === tier}>{c.tiers.ask} <span className="arrow">&rarr;</span></button>
            </li>
          ))}
        </ul>
        <p className="L-mid">{c.tiers.note}</p>
        {/* the main offering, and a sales conversation: no checkout, no price */}
        <div className="L-assess L-exec" id="executive-sprints">
          <div className="card L-assess-card">
            <span className="card-tag">{c.exec.tag}</span>
            <h3 className="L-assess-name">{c.exec.name}</h3>
            <p className="L-assess-what">{c.exec.what}</p>
            <dl className="L-assess-meta">
              <div><dt className="L-cap">{c.tiers.rowWho}</dt><dd>{c.exec.who}</dd></div>
              <div><dt className="L-cap">{c.tiers.rowGet}</dt><dd>{c.exec.get}</dd></div>
            </dl>
            <Link className="btn" href={ROUTES.contact}>{c.exec.button} <span className="arrow">&rarr;</span></Link>
          </div>
        </div>
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
      <Sec n="05" kicker={c.workshops.kicker} title={c.workshops.title} id="workshops">
        <p className="L-mid">{c.workshops.body}</p>
        <div className="cta-row">
          <Link className="btn btn-secondary" href={ROUTES.contact}>{c.workshops.button} <span className="arrow">&rarr;</span></Link>
        </div>
      </Sec>
      <Sec n="06" kicker={c.talk.kicker} title={c.talk.title} id="talk">
        {state !== "done" ? (
          <form className="L-talk" onSubmit={onTalk} noValidate>
            <div className="L-talk-tiers" role="group" aria-label="Which one">
              {c.talk.options.map((o) => (
                <button key={o.label} type="button" className="opt" aria-pressed={o.label === tier} onClick={() => pickOf(o.label)}>{o.label}</button>
              ))}
            </div>
            <div className="L-talk-who">
              <div className="field"><input type="text" name="name" required autoComplete="name" placeholder="Your name" aria-label="Your name" aria-invalid={nameError ? true : undefined} /></div>
              <div className="field"><input type="tel" name="phone" autoComplete="tel" placeholder="Phone (optional)" aria-label="Your phone number, optional" /></div>
            </div>
            <div className="field L-talk-field">
              <input type="email" name="email" required autoComplete="email" placeholder="you@company.com" aria-label="Your email" aria-invalid={emailError ? true : undefined} />
              <button className="btn" type="submit" disabled={state === "pending"}>{state === "pending" ? "Sending" : c.talk.button} <span className="arrow">&rarr;</span></button>
            </div>
            {pickError ? <p className="lead-error" role="alert">{pickError}</p> : null}
            {nameError ? <p className="lead-error" role="alert">{nameError}</p> : null}
            {emailError ? <p className="lead-error" role="alert">{emailError}</p> : null}
            {state === "error" ? <p className="lead-error" role="alert">That did not go through. Please try again.</p> : null}
            <Honeypot />
            <Turnstile onToken={setToken} resetKey={attempt} />
            <span className="L-cap">{fill(c.talk.note, { tier: tier || "what you pick" })}</span>
          </form>
        ) : (
          <div className="L-talk-thanks">
            <p className="L-big">{fill(c.talk.thanks, { tier })}</p>
            <Link href={ROUTES.process} className="inline-link L-text-cta">{c.talk.wait} <span className="arrow">&rarr;</span></Link>
          </div>
        )}
      </Sec>
      <Sec n="07" kicker={c.voices.kicker} title={c.voices.title}>
        <div className="L-voices L-voices-grid">
          {g.testimonials.items.map((q, i) => (
            <figure className="card L-quote" key={i}>
              <blockquote>&ldquo;{q.quote}&rdquo;</blockquote>
              <figcaption className="L-cap">{q.who} &middot; {q.role}</figcaption>
            </figure>
          ))}
        </div>
      </Sec>
    </>
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

const STAGE_LINE = 172; // a stage takes over once its top is this far below that: the rail (76) and 96 more

/** Methodology (the page id is still "process"). The four stages of the
 *  90-day sprint in one section, under a rail: one line, four stops, the
 *  star on the active one. The rail draws from the same `active` the
 *  running head reads, so there is one scroll listener, not two; it is
 *  decorative and hidden from readers, who get each stage's own heading.
 *  On the editorial columns at desktop width, with figures on, the
 *  section's running head is the active stage's eyebrow, title and figure:
 *  it sticks in the left column and swaps in place as the bodies scroll
 *  past on the right. Everywhere else the running head is off and the
 *  stages stack, each with its head and its own figure. Then the sprint
 *  path, and the science. */
function Process({ figures, c = DEFAULTS.process, g = DEFAULTS.global }: { figures?: boolean; c?: ProcessContent; g?: GlobalContent }) {
  const ref = useRef<HTMLElement>(null);
  const active = useActiveItem(ref, ".L-stage", STAGE_LINE);
  const STAGES: [string, string, string, string, PoseId | null][] = c.stages.items.slice(0, STAGE_ART.length).map((st, i) => [st.verb, st.when, st.body, STAGE_ART[i][0], STAGE_ART[i][1]]);

  const [verb, when, , icon, pose] = STAGES[Math.min(active, STAGES.length - 1)] ?? ["", "", "", STAR, null];
  return (
    <>
      <PageHead n="01" kicker={c.head.kicker} title={c.head.title} lede={c.head.lede} />
      <section className="L-sec L-sec-h L-stages" id="sprint" data-n="02" ref={ref} data-slot={figures ? "" : undefined}>
        <div className="L-wrap">
          <div className="L-head L-stages-head" aria-hidden>
            <span className="L-n">02</span>
            <div>
              <p className="eyebrow L-eyebrow" key={`when-${active}`}>{when}</p>
              <h2 className="sec" key={`verb-${active}`}>{verb}</h2>
            </div>
            {figures ? <span className="L-stage-fig">{pose ? <StageFigure pose={pose} /> : <Image src={icon} alt="" width={240} height={240} sizes="240px" />}</span> : null}
          </div>
          <div className="L-rail" aria-hidden style={{ "--at": active } as React.CSSProperties}>
            {STAGES.map(([verb, when], i) => (
              <span className="L-rail-stop" key={verb} data-on={i === active ? "" : undefined}>
                <span className="L-cap">{when}</span>
                <span className="L-rail-verb">{verb}</span>
              </span>
            ))}
            <span className="L-rail-star"><Image src={STAR} alt="" width={48} height={48} sizes="24px" /></span>
          </div>
          <ol className="L-stage-list">
            {STAGES.map(([verb, when, body, icon, pose], i) => (
              <li key={verb} className="L-stage" data-on={i === active ? "" : undefined}>
                <p className="eyebrow L-eyebrow L-stage-line">{when}</p>
                <h2 className="sec L-stage-verb">{verb}</h2>
                <div className="L-stage-copy">
                  <p className="L-mid">{body}</p>
                </div>
                <span className="L-stage-art" aria-hidden>
                  {figures && pose ? (
                    <ProcessFigure pose={pose} from={i ? STAGES[i - 1][4] ?? undefined : undefined} />
                  ) : (
                    <Image src={icon} alt="" width={336} height={336} sizes="320px" />
                  )}
                </span>
              </li>
            ))}
          </ol>
          <p className="L-mid L-stages-keepers">{c.stages.keepers}</p>
        </div>
      </section>
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
      </Sec>
      <Sec n="04" kicker={c.science.kicker} title={c.science.title} id="science">
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
      <section className="L-sec L-page-head contact-sec" data-n="01">
        <div className="L-wrap">
          <div className="L-head">
            <span className="L-n">01</span>
            <div>
              <p className="eyebrow L-eyebrow">{c.head.kicker}</p>
              <ContactForm c={c.form} />
            </div>
          </div>
        </div>
      </section>
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
    case "solutions": return <Solutions c={content?.solutions} g={content?.global} s={content?.start} />;
    case "process": return <Process figures={figures} c={content?.process} g={content?.global} />;
    case "insights": return <Insights />;
    case "about": return <About c={content?.about} />;
    case "contact": return <Contact c={content?.contact} s={content?.start} />;
    default: return null;
  }
}
