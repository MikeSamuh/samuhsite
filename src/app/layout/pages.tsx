"use client";

import type { PageId } from "@/lib/layout";

/**
 * The pages behind the nav, composed from docs/scope.md and docs/brief.md.
 * Confirmed material only; everything else is a visible TODO(content) or a
 * labelled frame. Same shared classes as the home sections so the frame
 * dials (alignment, width, spacing, rules, numbers) apply here too.
 */

const stay = (e: React.MouseEvent) => e.preventDefault();
const TODO = (what: string) => `TODO(content): ${what}`;

export function Frame({ label, tall }: { label: string; tall?: boolean }) {
  return <div className={`ph${tall ? " ph-tall" : ""}`}>{label}</div>;
}

function PageHead({ n, kicker, title, lede }: { n: string; kicker: string; title: string; lede?: string }) {
  return (
    <section className="L-sec L-page-head">
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

function Sec({ n, kicker, title, children, id }: { n: string; kicker: string; title: string; children: React.ReactNode; id?: string }) {
  return (
    <section className="L-sec" id={id}>
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
  { tag: "Tier 01", name: "Self-guided", what: "Fully automated. The team works through the material on its own.", cta: "Price to confirm · or talk to us" },
  { tag: "Tier 02", name: "Supported", what: "Self-guided plus periodic support calls from the Samuh team.", cta: "Talk to us" },
  { tag: "Tier 03", name: "Guided", what: "In person. The Samuh team delivers the work hands on.", cta: "Talk to us" },
];

function Solutions({ go }: { go: (p: PageId) => void }) {
  return (
    <>
      <PageHead n="01" kicker="Three ways to engage" title="Same process, three levels of support." lede={TODO("solutions intro, two sentences on how the tiers relate")} />
      {TIERS.map((t, i) => (
        <Sec key={t.name} n={`0${i + 2}`} kicker={t.tag} title={t.name} id={t.name.toLowerCase()}>
          <div className="L-tier">
            <div>
              <span className="L-cap">What it is</span>
              <p className="L-mid">{t.what}</p>
            </div>
            <div>
              <span className="L-cap">Who it is for</span>
              <p className="L-mid">{TODO(`who ${t.name} is for`)}</p>
            </div>
            <div>
              <span className="L-cap">What you get</span>
              <p className="L-mid">{TODO(`what a ${t.name} engagement includes`)}</p>
            </div>
            <div className="L-tier-cta">
              <button className="btn" onClick={() => go("contact")}>{t.cta} <span className="arrow">&rarr;</span></button>
            </div>
          </div>
        </Sec>
      ))}
      <Sec n="05" kicker="Side by side" title="Compare the tiers">
        <table className="L-table">
          <thead>
            <tr><th />{TIERS.map((t) => <th key={t.name}>{t.name}</th>)}</tr>
          </thead>
          <tbody>
            {["The team process", "Support calls", "In-person delivery", "TeamQ baseline and re-measure", "Ritual keeper coaching", "Price"].map((row) => (
              <tr key={row}>
                <th>{row}</th>
                {TIERS.map((t) => <td key={t.name}>{row === "Price" && t.name === "Self-guided" ? "To confirm" : TODO("confirm")}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="L-cap">Organization-wide engagements layer on top of the team process, not beside it.</p>
      </Sec>
      <Sec n="06" kicker="Trust before proof" title="What teams say">
        <div className="L-voices L-voices-grid">
          {[0, 1, 2].map((i) => (
            <figure className="card L-quote" key={i}>
              <blockquote>{TODO("testimonial quote")}</blockquote>
              <figcaption className="L-cap">{TODO("attribution, cleared for publication")}</figcaption>
            </figure>
          ))}
        </div>
      </Sec>
    </>
  );
}

/* ------------------------------------------------------------------ */

const STEPS = [
  ["Prepare", "Baseline the team before anything changes."],
  ["Launch", "Put the practices into the working week."],
  ["Discover", "Surface what the team does under load."],
  ["Awareness", "Name the patterns nobody could see."],
  ["Belonging", "Build the conditions people stay for."],
  ["Action", "Turn insight into standing rituals."],
];

const ARC = [
  ["Pre-sprint month", "Discovery + TeamQ", "Confidential interviews and a TeamQ baseline."],
  ["Day 1", "Agree goals, co-create the ritual", "The team reviews its findings and designs one practice it owns."],
  ["Day 45", "Refine the ritual", "A check-in to see how the practice is landing, and adjust."],
  ["Day 90", "Re-measure and close", "TeamQ is repeated and change is measured against the baseline."],
];

function Process({ go }: { go: (p: PageId) => void }) {
  return (
    <>
      <PageHead n="01" kicker="The methodology across all three tiers" title="The team process." lede="See the team clearly. Choose the practice together. Ritualize it in the flow of work." />
      <Sec n="02" kicker="Six moves · icons to come" title="From baseline to standing ritual">
        <div className="L-steps">
          {STEPS.map(([name, note], i) => (
            <div className="step L-step" key={name}>
              <span className="step-n">0{i + 1}</span>
              <Frame label="Icon" />
              <span className="step-name">{name}</span>
              <span className="step-note">{note}</span>
            </div>
          ))}
        </div>
        <p className="L-cap">Structure still TBD in the scope. Step names from the kickoff, one-liners are placeholders.</p>
      </Sec>
      <Sec n="03" kicker="About four months, end to end" title="The arc">
        <ol className="L-arc">
          {ARC.map(([when, what, note]) => (
            <li key={when}>
              <span className="L-cap">{when}</span>
              <span className="L-arc-what">{what}</span>
              <span className="L-arc-note">{note}</span>
            </li>
          ))}
        </ol>
        <p className="L-mid">Two ritual keepers are coached every two weeks, and the ritual runs inside work the team already does.</p>
      </Sec>
      <Sec n="04" kicker="Why it holds" title="Elite teams ritualize high-performance practices">
        <p className="L-big">A ritual turns an important behavior into a specific, repeatable practice the team owns and runs.</p>
        <p className="L-mid">Repeated over weeks, it converts intent into the way the team actually operates. The team creates its ritual from its own data, its own context, and its own commitment, which is why it holds.</p>
        <div className="cta-row">
          <button className="btn" onClick={() => go("start")}>Get started <span className="arrow">&rarr;</span></button>
          <button className="btn btn-secondary" onClick={() => go("solutions")}>Ways to engage</button>
        </div>
      </Sec>
    </>
  );
}

/* ------------------------------------------------------------------ */

const KINDS = ["All", "Foundations", "Articles", "Video", "Research"];
const HUBS = ["Capacity", "Team practices", "Rituals", "Measurement"];

function Insights() {
  return (
    <>
      <PageHead n="01" kicker="The education layer" title="Insights." lede="Foundations, articles, video and research in one feed. Start with the foundations if the argument is new to you." />
      <section className="L-sec L-sec-tight">
        <div className="L-wrap">
          <div className="L-filters">
            <div className="L-pills">{KINDS.map((k, i) => <span className={`pill${i === 0 ? " is-accent" : ""}`} key={k}>{k}</span>)}</div>
            <div className="L-pills">{HUBS.map((h) => <span className="pill" key={h}>{h}</span>)}</div>
          </div>
        </div>
      </section>
      <Sec n="02" kicker="Research · distinct treatment" title="Sapien Labs Work Culture Report">
        <div className="L-research-card card">
          <Frame label="Report cover" />
          <div>
            <span className="card-tag">Research · in partnership with Sapien Labs</span>
            <p className="L-mid">{TODO("one paragraph on what the report covers, no figures until cleared")}</p>
            <a href="#" className="inline-link" onClick={stay}>Read the report</a>
          </div>
        </div>
      </Sec>
      <Sec n="03" kicker="Latest" title="From the feed">
        <div className="L-feed">
          {["Foundations", "Article", "Video", "Foundations", "Article", "Video"].map((k, i) => (
            <article className="card L-post" key={i}>
              <Frame label={k === "Video" ? "Video still · YouTube or Vimeo embed" : "Illustration"} />
              <span className="card-tag">{k} · {TODO("topic")}</span>
              <h3>{TODO("title")}</h3>
              <p>{TODO("standfirst")}</p>
              <span className="L-cap">{TODO("author")} · {TODO("date")} · {k === "Video" ? "watch" : "read"} time</span>
            </article>
          ))}
        </div>
        <p className="L-cap">Email is offered after the content, never before it.</p>
      </Sec>
    </>
  );
}

/* ------------------------------------------------------------------ */

const TEAM = [
  ["Rahul Varma", "Co-Founder & CEO"],
  ["Calina Mircea", "Co-Founder & Methodology Lead"],
  ["Mike Gabour", "Co-Founder & CTO"],
  ["Dr. Tara Thiagarajan", "Chief Scientific Advisor"],
  ["Jake DeBerry", "Lead, Enterprise Growth"],
];

function About() {
  return (
    <>
      <PageHead n="01" kicker="About" title="A group of people who come together for a purpose larger than themselves." lede="That is what Samuh means in Sanskrit, and it is the standard the work is held to." />
      <Sec n="02" kicker="What we believe" title="Performance is created in teams">
        <p className="L-big">{TODO("the thesis in SAMUH's approved wording")}</p>
        <p className="L-mid">{TODO("two paragraphs on the model: team environment shapes capacity to perform, capacity shapes performance")}</p>
      </Sec>
      <Sec n="03" kicker="In partnership with Sapien Labs" title="The research behind the work">
        <div className="L-partner">
          <Frame label="Sapien Labs mark" />
          <div>
            <p className="L-mid">Sapien Labs is the primary partner and the source of the research the site leans on. The Work Culture Report is the research spine, and the intake assessment is built on Sapien Labs team environment factors.</p>
            <p className="L-mid">{TODO("one paragraph on the MHQ and the Global Mind Project, figures only when cleared")}</p>
          </div>
        </div>
      </Sec>
      <Sec n="04" kicker="The people you would be working with" title="Team">
        <div className="L-team">
          {TEAM.map(([name, role]) => (
            <article className="L-person" key={name}>
              <Frame label="Photo" />
              <span className="L-person-name">{name}</span>
              <span className="L-cap">{role}</span>
              <p>{TODO("two-line bio")}</p>
            </article>
          ))}
        </div>
        <p className="L-mid">An interdisciplinary team spanning enterprise transformation, team practice, data science and human performance research.</p>
      </Sec>
      <Sec n="05" kicker="TBA" title="Channel partners and coaching teams">
        <div className="L-logos">{[0, 1, 2, 3, 4].map((i) => <Frame key={i} label="Partner mark · contract check first" />)}</div>
      </Sec>
    </>
  );
}

/* ------------------------------------------------------------------ */

function Contact() {
  return (
    <>
      <PageHead n="01" kicker="Contact" title="Tell us about your team." lede="A short form or a call. Either way a person reads it, not a funnel." />
      <section className="L-sec">
        <div className="L-wrap">
          <div className="L-contact">
            <form className="L-form" onSubmit={(e) => e.preventDefault()}>
              <label><span className="L-cap">Name</span><input type="text" placeholder="Your name" /></label>
              <label><span className="L-cap">Email</span><input type="email" placeholder="you@company.com" /></label>
              <label><span className="L-cap">Organization</span><input type="text" placeholder="Where the team works" /></label>
              <label><span className="L-cap">What are you hoping to change?</span><textarea rows={4} placeholder="A sentence or two is plenty" /></label>
              <label><span className="L-cap">Goal</span>
                <select defaultValue=""><option value="" disabled>Choose one</option><option>Understand the model</option><option>Assess a team</option><option>Talk about a 90-day sprint</option><option>Something else</option></select>
              </label>
              <button className="btn" type="submit">Send <span className="arrow">&rarr;</span></button>
              <span className="L-cap">{TODO("where leads land: inbox, sheet or CRM. Owner Jake")}</span>
            </form>
            <aside className="L-contact-side">
              <div className="card L-book">
                <span className="card-tag">Book a call</span>
                <Frame label="Calendar embed" tall />
              </div>
              <div className="L-details">
                <span className="L-cap">Email</span><span>{TODO("public contact email")}</span>
                <span className="L-cap">Phone</span><span>{TODO("public phone, if any")}</span>
                <span className="L-cap">Where</span><span>{TODO("city, or remote")}</span>
              </div>
            </aside>
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
        <span className="L-cap">Question 1 of {TODO("N")} · free and ungated · no email to start</span>
        <h1 className="display L-intake-q">{TODO("first question, on one Sapien Labs team environment factor")}</h1>
        <div className="L-scale">
          {[1, 2, 3, 4, 5, 6, 7].map((n) => <button className="opt L-scale-opt" key={n}>{n}</button>)}
        </div>
        <div className="L-scale-ends"><span className="L-cap">Rarely true</span><span className="L-cap">Almost always true</span></div>
        <aside className="card L-insight">
          <span className="card-tag">While you answer</span>
          <p>{TODO("one data insight or testimonial, interlaced between questions, Noom style")}</p>
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

export function Page({ id, go }: { id: PageId; go: (p: PageId) => void }) {
  switch (id) {
    case "solutions": return <Solutions go={go} />;
    case "process": return <Process go={go} />;
    case "insights": return <Insights />;
    case "about": return <About />;
    case "contact": return <Contact />;
    case "start": return <Start go={go} />;
    default: return null;
  }
}
