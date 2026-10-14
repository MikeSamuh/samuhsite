"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import type { PageId } from "@/lib/layout";
import { ContactAside } from "@/components/contact/ContactAside";
import { ContactForm } from "@/components/contact/ContactForm";
import { ProcessFigure, StageFigure } from "@/components/process-figure/ProcessFigure";
import type { PoseId } from "@/components/process-figure/figures";

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

const TIERS = [
  { tag: "Tier 01", name: "Self-guided", what: "Fully automated. The team works through the material on its own.", who: "Teams with a strong leader who want the method without the meetings, and organizations rolling it out across many teams.", get: "The team process, the baseline and the re-measure, and the material to run one ritual for ninety days.", cta: "Talk to us" },
  { tag: "Tier 02", name: "Supported", what: "Self-guided plus periodic support calls from the Samuh team.", who: "Teams that want a second pair of eyes at the moments that matter: choosing the practice, and the check-in at day 45.", get: "Everything in Self-guided, with scheduled calls to read the data together and keep the ritual on track.", cta: "Talk to us" },
  { tag: "Tier 03", name: "Guided", what: "In person. The Samuh team delivers the work hands on.", who: "Leadership teams and mission-critical teams where the stakes justify having us in the room.", get: "Confidential interviews, a facilitated day one, coaching for two ritual keepers every two weeks, and the close.", cta: "Talk to us" },
];

function Solutions({ go }: { go: (p: PageId) => void }) {
  const [tier, setTier] = useState(TIERS[1].name);
  const [sent, setSent] = useState(false);
  const rows: [string, string, string, string][] = [
    ["What it is", ...TIERS.map((t) => t.what) as [string, string, string]],
    ["Who it is for", ...TIERS.map((t) => t.who) as [string, string, string]],
    ["What you get", ...TIERS.map((t) => t.get) as [string, string, string]],
    ["Support calls", "Not included", "Scheduled", "Ongoing"],
    ["In-person delivery", "Not included", "Not included", "Included"],
    ["TeamQ baseline and re-measure", "Included", "Included", "Included"],
    ["Ritual keeper coaching", "Self-directed", "At check-ins", "Every two weeks"],
  ];
  return (
    <>
      <PageHead n="01" kicker="Three ways to engage" title="Same process, three levels of support." lede="One methodology, the team process, delivered with as much or as little of us in the room as the team needs. Organization-wide work layers on top of it." />
      <Sec n="02" kicker="Side by side" title="The three tiers">
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
                {cells.map((c, i) => <td key={i} data-on={TIERS[i].name === tier}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="L-cap">Organization-wide engagements layer on top of the team process, not beside it.</p>
      </Sec>
      <Sec n="03" kicker="Talk to us" title="Tell us which one, and where to reach you">
        {!sent ? (
          <form className="L-talk" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <div className="L-talk-tiers" role="radiogroup" aria-label="Which tier">
              {TIERS.map((t) => (
                <button key={t.name} type="button" className="opt" aria-pressed={t.name === tier} onClick={() => setTier(t.name)}>{t.name}</button>
              ))}
            </div>
            <div className="field L-talk-field">
              <input type="email" required placeholder="you@company.com" aria-label="Your email" />
              <button className="btn" type="submit">Talk to us <span className="arrow">&rarr;</span></button>
            </div>
            <span className="L-cap">A person replies. Tagged {tier}, so we come prepared.</span>
          </form>
        ) : (
          <div className="L-talk-thanks">
            <p className="L-big">Thank you. We&rsquo;ll be in touch about {tier}.</p>
            <a href="#" className="inline-link L-text-cta" onClick={(e) => { stay(e); go("process"); }}>Read about the team process while you wait <span className="arrow">&rarr;</span></a>
          </div>
        )}
      </Sec>
      <Sec n="04" kicker="Trust before proof" title="What teams say">
        <div className="L-voices L-voices-grid">
          {[0, 1, 2].map((i) => (
            <figure className="card L-quote" key={i}>
              <blockquote>&ldquo;Sample testimonial. Two or three sentences in the client&rsquo;s own words about what changed for the team.&rdquo;</blockquote>
              <figcaption className="L-cap">Name &middot; Role &middot; Organization</figcaption>
            </figure>
          ))}
        </div>
      </Sec>
    </>
  );
}

/* ------------------------------------------------------------------ */

// verb, line, body, icon (Wilfred's, public/icons, the same files the poses are traced from),
// and the traced pose the working draft morphs between (scripts/figures)
const STAGES: [string, string, string, string, PoseId][] = [
  ["Discover", "The team turns the lens on itself.", "Through confidential conversations and a TeamQ baseline, the team gets a clear read on its own environment: what it is working toward, what already goes well, and what is quietly getting in the way.", "/icons/Discover%202.png", "discover"],
  ["Align", "The team agrees on what better looks like.", "With that picture in front of it, the team decides what better performance means here, and where one change would do the most for the work and for the people doing it.", "/icons/Align%202.png", "align"],
  ["Co-create", "Together, we turn moments into practice.", "Decisions, feedback, disagreement, change: the moments that shape performance become specific, repeatable practices. The team designs them, tests them, and runs them inside the work it already does.", "/icons/Belonging%202.png", "cocreate"],
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
function Process({ go, figures }: { go: (p: PageId) => void; figures?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

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

  const [verb, line, , , pose] = STAGES[active];
  return (
    <>
      <PageHead n="01" kicker="The methodology across all three tiers" title="The team process." lede="See the team clearly. Choose the practice together. Ritualize it in the flow of work." />
      <section className="L-sec L-sec-h L-stages" data-n="02" ref={ref} data-slot={figures ? "" : undefined}>
        <div className="L-wrap">
          <div className="L-head L-stages-head" aria-hidden>
            <span className="L-n">02</span>
            <div>
              <p className="eyebrow L-eyebrow" key={`line-${active}`}>{line}</p>
              <h2 className="sec" key={`verb-${active}`}>{verb}</h2>
            </div>
            {figures ? <span className="L-stage-fig"><StageFigure pose={pose} /></span> : null}
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
                      <button className="btn" onClick={() => go("start")}>Explore TeamQ <span className="arrow">&rarr;</span></button>
                      <button className="btn btn-secondary" onClick={() => go("solutions")}>Ways to engage</button>
                    </div>
                  ) : null}
                </div>
                <span className="L-stage-art" aria-hidden>
                  {figures ? (
                    <ProcessFigure pose={pose} from={i ? STAGES[i - 1][4] : undefined} />
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

// photos: the 141px headshots from the current samuh.work, until the
// client sends proper ones. Jake's is his own, sent 14 October 2026
const TEAM: [string, string, string, string?][] = [
  ["Rahul Varma", "Co-Founder & CEO", "Former CHRO, Accenture Technology.", "/team/rahul-varma.webp"],
  ["Calina Mircea", "Co-Founder & Methodology Lead", "Systemic coach, learning and leadership expert.", "/team/calina-mircea.webp"],
  ["Mike Gabour", "Co-Founder & CTO", "Global analytics strategy and design leader.", "/team/mike-gabour.webp"],
  ["Dr. Tara Thiagarajan", "Chief Scientific Advisor", "Founder, Sapien Labs. Ph.D., Stanford.", "/team/tara-thiagarajan.webp"],
  ["Jake DeBerry", "Lead, Enterprise Growth", "CEB/Gartner, Deloitte, NeuroLeadership Institute.", "/team/jake-deberry.webp"],
];

function About() {
  return (
    <>
      <PageHead n="01" kicker="About" title="A group of people who come together for a purpose larger than themselves." lede="That is what Samuh means in Sanskrit, and it is the standard the work is held to." />
      <Sec n="02" kicker="What we believe" title="Performance is created in teams">
        <p className="L-big">High performance without the cost to people. Sustained performance, where people thriving and results thriving reinforce each other rather than trading off.</p>
        <p className="L-mid">Most organizations invest above the team, in transformations and organization-wide programs, and below it, in individual evaluation and development. The work itself gets done in teams: information flows, trust builds, feedback happens and decisions get made there.</p>
        <p className="L-mid">The environment inside a team shapes how much capacity its people can bring to the work. Samuh shows a team where its capacity is leaking, the team chooses one practice to close the gap, and the change is measured.</p>
      </Sec>
      <Sec n="03" kicker="In partnership with Sapien Labs" title="The research behind the work">
        <div className="L-partner">
          <Image className="L-partner-logo" src="/sapien-labs.png" alt="Sapien Labs" width={820} height={240} sizes="200px" />
          <div>
            <p className="L-mid">Sapien Labs is the primary partner and the source of the research the site leans on. The Work Culture Report is the research spine, and the intake assessment is built on Sapien Labs team environment factors.</p>
            <p className="L-mid">Sapien Labs&rsquo; MHQ measures mental wellbeing across aspects of functioning and feeling, gathered through the Global Mind Project. TeamQ reads the team environment through it, so what was previously inferred about a team can now be measured.</p>
          </div>
        </div>
      </Sec>
      <Sec n="04" kicker="The people you would be working with" title="Team">
        <div className="L-team">
          {TEAM.map(([name, role, bio, photo]) => (
            <article className="L-person" key={name}>
              {photo ? <Image className="L-person-photo" src={photo} alt={name} width={141} height={141} /> : <Frame label="Photo" />}
              <span className="L-person-name">{name}</span>
              <span className="L-cap">{role}</span>
              <p>{bio}</p>
            </article>
          ))}
        </div>
        <p className="L-mid">An interdisciplinary team spanning enterprise transformation, team practice, data science and human performance research.</p>
      </Sec>
      <Sec n="05" kicker="Partners" title="Channel partners and coaching teams">
        <div className="L-logos">{[0, 1, 2, 3, 4].map((i) => <Frame key={i} label="Partner mark" />)}</div>
      </Sec>
    </>
  );
}

/* ------------------------------------------------------------------ */

function Contact() {
  return (
    <>
      <PageHead n="01" kicker="Contact" title={"Let\u2019s talk, human to human."} />
      <section className="L-sec contact-sec">
        <div className="L-wrap">
          <div className="contact-grid">
            <ContactForm />
            <ContactAside />
          </div>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */

function Start({ go }: { go: (p: PageId) => void }) {
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
          <button className="btn btn-secondary" onClick={() => go("contact")}>Talk to us instead</button>
        </div>
        <p className="L-cap">Our own intake tool. Not TeamQ, not validated, not diagnostic. Result on screen with a shareable link; email or booking offered after.</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function Page({ id, go, figures }: { id: PageId; go: (p: PageId) => void; figures?: boolean }) {
  switch (id) {
    case "solutions": return <Solutions go={go} />;
    case "process": return <Process go={go} figures={figures} />;
    case "insights": return <Insights />;
    case "about": return <About />;
    case "contact": return <Contact />;
    case "start": return <Start go={go} />;
    default: return null;
  }
}
