"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import type { PageId } from "@/lib/layout";
import { ROUTES } from "@/lib/site";
import { ContactAside } from "@/components/contact/ContactAside";
import { ContactForm } from "@/components/contact/ContactForm";
import { ProcessFigure, StageFigure } from "@/components/process-figure/ProcessFigure";
import type { PoseId } from "@/components/process-figure/figures";
import { DEFAULTS, type AboutContent, type ContactContent, type GlobalContent, type ProcessContent, type SolutionsContent } from "@/lib/content/defaults";
import { fill } from "@/lib/content/shared";

/** The words the admin's Content tab edits, passed down from the server.
 *  Without them a page shows the defaults, which are the same words. */
export interface PageCopy {
  global?: GlobalContent;
  about?: AboutContent;
  process?: ProcessContent;
  solutions?: SolutionsContent;
  contact?: ContactContent;
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

function Solutions({ c = DEFAULTS.solutions, g = DEFAULTS.global }: { c?: SolutionsContent; g?: GlobalContent }) {
  const TIERS = c.tiers.items;
  const [tier, setTier] = useState(TIERS[1]?.name ?? TIERS[0]?.name ?? "");
  const [sent, setSent] = useState(false);
  // a piece from the à la carte list, picked with its button: it goes to the
  // form the same way a tier does, and shows there beside the three tiers
  const piece = TIERS.some((t) => t.name === tier) ? "" : tier;
  const ask = (name: string) => {
    setTier(name);
    setSent(false);
    document.getElementById("talk")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const three = (f: (t: (typeof TIERS)[number]) => string) => [0, 1, 2].map((i) => (TIERS[i] ? f(TIERS[i]) : "")) as [string, string, string];
  const rows: [string, string, string, string][] = [
    [c.tiers.rowWhat, ...three((t) => t.what)],
    [c.tiers.rowWho, ...three((t) => t.who)],
    [c.tiers.rowGet, ...three((t) => t.get)],
    ...c.tiers.rows.map((r) => [r.label, r.a, r.b, r.c] as [string, string, string, string]),
  ];
  return (
    <>
      <PageHead n="01" kicker={c.head.kicker} title={c.head.title} lede={c.head.lede} />
      <Sec n="02" kicker={c.tiers.kicker} title={c.tiers.title} cls="L-sec-full">
        <div className="L-tiers-pick" aria-label="Which tier">
          {TIERS.map((t) => (
            <button key={t.name} type="button" className="L-tier-pick" onClick={() => setTier(t.name)} aria-pressed={t.name === tier}>
              <span className="L-cap">{t.tag}</span>
              <span>{t.name}</span>
            </button>
          ))}
        </div>
        <table className="L-table L-tiers" data-tier={tier}>
          <thead>
            <tr>
              <th />
              {TIERS.map((t) => (
                <th key={t.name} data-on={t.name === tier}>
                  <button className="L-tier-pick" onClick={() => setTier(t.name)} aria-pressed={t.name === tier}>
                    <span className="L-cap">{t.tag}</span>
                    <span>{t.name}</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([row, ...cells]) => (
              <tr key={row}>
                <th>{row}</th>
                {cells.map((cell, i) => <td key={i} data-on={TIERS[i]?.name === tier}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="L-cap">{c.tiers.note}</p>
      </Sec>
      <Sec n="03" kicker={c.carte.kicker} title={c.carte.title} id="a-la-carte">
        {c.carte.lede ? <p className="L-mid">{c.carte.lede}</p> : null}
        <ul className="L-carte">
          {c.carte.items.map((it) => (
            <li className="L-piece" key={it.name} data-on={it.name === tier}>
              <div className="L-piece-head">
                <span className="L-cap L-piece-tag">{it.tag}</span>
                <h3 className="L-piece-name">{it.name}</h3>
              </div>
              <div className="L-piece-body">
                <p className="L-piece-what">{it.what}</p>
                <dl className="L-piece-meta">
                  <div><dt className="L-cap">{c.tiers.rowWho}</dt><dd>{it.who}</dd></div>
                  <div><dt className="L-cap">Format</dt><dd>{it.format}</dd></div>
                </dl>
                <button type="button" className="inline-link L-text-cta L-piece-ask" onClick={() => ask(it.name)} aria-pressed={it.name === tier}>
                  {c.carte.ask} <span className="arrow">&rarr;</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
        {c.carte.note ? <p className="L-cap">{c.carte.note}</p> : null}
      </Sec>
      <Sec n="04" kicker={c.talk.kicker} title={c.talk.title} id="talk">
        {!sent ? (
          <form className="L-talk" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <div className="L-talk-tiers" role="radiogroup" aria-label="Which tier or piece">
              {TIERS.map((t) => (
                <button key={t.name} type="button" className="opt" aria-pressed={t.name === tier} onClick={() => setTier(t.name)}>{t.name}</button>
              ))}
              {piece ? <button type="button" className="opt" aria-pressed>{piece}</button> : null}
            </div>
            <div className="field L-talk-field">
              <input type="email" required placeholder="you@company.com" aria-label="Your email" />
              <button className="btn" type="submit">{c.talk.button} <span className="arrow">&rarr;</span></button>
            </div>
            <span className="L-cap">{fill(c.talk.note, { tier })}</span>
          </form>
        ) : (
          <div className="L-talk-thanks">
            <p className="L-big">{fill(c.talk.thanks, { tier })}</p>
            <Link href={ROUTES.process} className="inline-link L-text-cta">{c.talk.wait} <span className="arrow">&rarr;</span></Link>
          </div>
        )}
      </Sec>
      <Sec n="05" kicker={c.voices.kicker} title={c.voices.title}>
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

// icon (Wilfred's, public/icons, the same files the poses are traced from)
// and the traced pose the working draft morphs between (scripts/figures),
// one per stage. The words come from the content layer, in the same order.
// Assess has no icon of its own yet: Awareness stands in, and with no traced
// pose the figure path shows the icon instead
const STAGE_ART: [string, PoseId | null][] = [
  ["/icons/Awareness.png", null],
  ["/icons/Discover%202.png", "discover"],
  ["/icons/Align%202.png", "align"],
  ["/icons/Belonging%202.png", "cocreate"],
];

const HEAD_TOP = 28; // the sticky head's offset below the nav, as in layout.css
const STAGE_LINE = 96; // a stage takes over once its top is this far below that

/** The three stages in one section. On the editorial columns at desktop
 *  width, with figures on, the section's running head is the active stage's
 *  eyebrow, title and figure: it sticks in the left column and swaps in
 *  place as the bodies scroll past on the right, the figure morphing into
 *  the next pose. The running head is decorative; every stage carries its
 *  own heading, visually hidden there. Everywhere else the running head is
 *  off and the stages stack, each with its head and its own figure or icon. */
function Process({ figures, c = DEFAULTS.process }: { figures?: boolean; c?: ProcessContent }) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const STAGES: [string, string, string, string, PoseId | null][] = c.stages.items.slice(0, STAGE_ART.length).map((st, i) => [st.verb, st.line, st.body, STAGE_ART[i][0], STAGE_ART[i][1]]);

  useEffect(() => {
    const root = ref.current;
    if (!root || !figures) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>(".L-stage"));
    if (!items.length) return;
    let raf = 0;
    const tick = () => {
      raf = 0;
      const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 0;
      const line = navH + HEAD_TOP + STAGE_LINE;
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
  }, [figures]);

  const [verb, line, , icon, pose] = STAGES[Math.min(active, STAGES.length - 1)] ?? ["", "", "", "", "discover" as PoseId];
  return (
    <>
      <PageHead n="01" kicker={c.head.kicker} title={c.head.title} lede={c.head.lede} />
      <section className="L-sec L-sec-h L-stages" data-n="02" ref={ref} data-slot={figures ? "" : undefined}>
        <div className="L-wrap">
          <div className="L-head L-stages-head" aria-hidden>
            <span className="L-n">02</span>
            <div>
              <p className="eyebrow L-eyebrow" key={`line-${active}`}>{line}</p>
              <h2 className="sec" key={`verb-${active}`}>{verb}</h2>
            </div>
            {figures ? <span className="L-stage-fig">{pose ? <StageFigure pose={pose} /> : <Image src={icon} alt="" width={2048} height={2048} sizes="240px" />}</span> : null}
          </div>
          <ol className="L-stage-list">
            {STAGES.map(([verb, line, body, icon, pose], i) => (
              <li key={verb} className="L-stage" data-on={i === active ? "" : undefined}>
                <p className="eyebrow L-eyebrow L-stage-line">{line}</p>
                <h2 className="sec L-stage-verb">{verb}</h2>
                <div className="L-stage-copy">
                  <p className="L-mid">{body}</p>
                  {i === STAGES.length - 1 ? (
                    <div className="cta-row">
                      <Link className="btn" href={ROUTES.start}>{c.stages.ctaPrimary} <span className="arrow">&rarr;</span></Link>
                      <Link className="btn btn-secondary" href={ROUTES.solutions}>{c.stages.ctaSecondary}</Link>
                    </div>
                  ) : null}
                </div>
                <span className="L-stage-art" aria-hidden>
                  {figures && pose ? (
                    <ProcessFigure pose={pose} from={i ? STAGES[i - 1][4] ?? undefined : undefined} />
                  ) : (
                    <Image src={icon} alt="" width={2048} height={2048} sizes="320px" />
                  )}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>
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
// and the words are in the content layer now, editable in the admin
function About({ c = DEFAULTS.about }: { c?: AboutContent }) {
  return (
    <>
      <PageHead n="01" kicker={c.head.kicker} title={c.head.title} lede={c.head.lede} />
      <Sec n="02" kicker={c.believe.kicker} title={c.believe.title}>
        <p className="L-big">{c.believe.big}</p>
        <p className="L-mid">{c.believe.p1}</p>
        <p className="L-mid">{c.believe.p2}</p>
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
      <Sec n="04" kicker={c.team.kicker} title={c.team.title}>
        <div className="L-team">
          {c.team.members.map(({ name, role, bio, photo }) => (
            <article className="L-person" key={name}>
              {photo ? <Image className="L-person-photo" src={photo} alt={name} width={141} height={141} /> : <Frame label="Photo" />}
              <span className="L-person-name">{name}</span>
              <span className="L-cap">{role}</span>
              <p>{bio}</p>
            </article>
          ))}
        </div>
        <p className="L-mid">{c.team.closing}</p>
      </Sec>
      <Sec n="05" kicker={c.partners.kicker} title={c.partners.title}>
        <div className="L-logos">{[0, 1, 2, 3, 4].map((i) => <Frame key={i} label="Partner mark" />)}</div>
      </Sec>
    </>
  );
}

/* ------------------------------------------------------------------ */

function Contact({ c = DEFAULTS.contact, g = DEFAULTS.global }: { c?: ContactContent; g?: GlobalContent }) {
  return (
    <>
      <PageHead n="01" kicker={c.head.kicker} title={c.head.title} />
      <section className="L-sec contact-sec">
        <div className="L-wrap">
          <div className="contact-grid">
            <ContactForm />
            <ContactAside title={c.aside.title} email={g.contact.email} phone={g.contact.phone} />
          </div>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */

function Start() {
  return (
    <section className="L-sec L-intake">
      <div className="L-wrap L-wrap-narrow">
        <div className="L-intake-bar" aria-hidden><span style={{ width: "12%" }} /></div>
        <span className="L-cap">Question 1 · free and ungated · no email to start</span>
        <h1 className="display L-intake-q">How often does your team get the information it needs, when it needs it?</h1>
        <div className="L-scale">
          {[1, 2, 3, 4, 5, 6, 7].map((n) => <button className="opt L-scale-opt" key={n}>{n}</button>)}
        </div>
        <div className="L-scale-ends"><span className="L-cap">Rarely true</span><span className="L-cap">Almost always true</span></div>
        <aside className="card L-insight">
          <span className="card-tag">While you answer</span>
          <p>TeamQ reads thirteen factors of the team environment and thirteen practices. This one is about information flows: whether people hear things from the team, or from the corridor.</p>
        </aside>
        <div className="cta-row">
          <button className="btn">Next <span className="arrow">&rarr;</span></button>
          <Link className="btn btn-secondary" href={ROUTES.contact}>Talk to us instead</Link>
        </div>
        <p className="L-cap">Our own intake tool. Not TeamQ, not validated, not diagnostic. Result on screen with a shareable link; email or booking offered after.</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function Page({ id, figures, content }: { id: PageId; figures?: boolean; /** the admin's words; the defaults without them */ content?: PageCopy }) {
  switch (id) {
    case "solutions": return <Solutions c={content?.solutions} g={content?.global} />;
    case "process": return <Process figures={figures} c={content?.process} />;
    case "insights": return <Insights />;
    case "about": return <About c={content?.about} />;
    case "contact": return <Contact c={content?.contact} g={content?.global} />;
    case "start": return <Start />;
    default: return null;
  }
}
