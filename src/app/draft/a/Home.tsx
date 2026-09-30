"use client";

import { useState } from "react";
import { SECTIONS, type PageId } from "@/lib/layout";
import { HeroVideo, Carousel, MetaphorGallery, Frame, Section, QUOTES } from "../../layout/sections";
import { useGo } from "../Go";
import "./a.css";

/**
 * Draft A. The twelve sections of the signed scope, in the scope's order,
 * in the Editorial frame, sculpted rather than configured.
 *
 * What this pass adds over the baseline, section by section, and where in
 * the scope it comes from:
 *
 *   01 hero        video first, the promise, what Samuh does in one line
 *   02 thesis      the problem, on the hero's screen, Sapien Labs credited (scope 3.2, 7)
 *   03 meaning     the dictionary entry, shared with B and C
 *   04 circles     the nested circles, shared with B and C
 *   05 aspire      a framing you want to belong to, from the keynote (scope 3.5)
 *   06 research    one statement, the report link, the credit, and a visible
 *                  note that the wording is SAMUH's to land (scope 3.6, 6)
 *   07 voices      the carousel, with the one quote SAMUH has published (scope 3.7, 5)
 *   08 case        the Fortune 10 snippet and a link, no figures (scope 3.8)
 *   09 tool        working sliders, the estimate left visibly to SAMUH, the
 *                  optional email for the breakdown offered after (scope 3.9, 10)
 *   10 cards       the gallery, as asked on 27 September (scope 3.10)
 *   11 equation    a visual equation with hover definitions and the Sapien
 *                  credit, instead of a video placeholder (scope 3.11)
 *   12 start       the intake entry, then booking first and the form second (scope 3.12, 10)
 *
 * Copy is confirmed material from the scope, the introduction deck and the
 * Bangalore keynote, or draft marked as such. No figures. Where something
 * is SAMUH's to supply, a generic placeholder stands in on the page.
 */

const stay = (e: React.MouseEvent) => e.preventDefault();
const MEANING = SECTIONS.find((x) => x.id === "meaning")!;
const CIRCLES = SECTIONS.find((x) => x.id === "circles")!;
const pad = (n: number) => String(n).padStart(2, "0");

function Sec({
  id, n, v, kicker, title, children, headed = true,
}: {
  id: string; n: number; v: string; kicker?: string; title?: string; children: React.ReactNode; headed?: boolean;
}) {
  return (
    <section className={`L-sec L-s-${id}${headed ? " L-sec-h" : ""}`} data-v={v} data-n={pad(n)} id={id}>
      <div className="L-wrap">
        {headed ? (
          <div className="L-head">
            <span className="L-n">{pad(n)}</span>
            <div>
              {kicker ? <p className="eyebrow L-eyebrow">{kicker}</p> : null}
              <h2 className="sec">{title}</h2>
            </div>
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 07 the one testimonial SAMUH has published, then two placeholders     */
/* ------------------------------------------------------------------ */

// The quote is on page 8 of the introduction deck and page 21 of the
// keynote, attributed there as below. The other two are generic placeholders
// until SAMUH supplies them.
const VOICES: typeof QUOTES = [
  { q: "You have really helped our team, and me, change the way we operate and we are so much better placed to tackle the challenges ahead.", who: "Business unit president", role: "Fortune 10 healthcare company" },
  { q: "Sample testimonial. Two or three sentences in the client\u2019s own words about what changed for the team, and what it felt like to work this way.", who: "Name", role: "Role, Organization" },
  { q: "A second sample. Long enough to show how a real quote wraps at this size, short enough to read in one breath.", who: "Name", role: "Role, Organization" },
];

/* ------------------------------------------------------------------ */
/* 09 the data tool                                                    */
/* ------------------------------------------------------------------ */

// The four team environment groups as the introduction deck names them
// (page 4). The keynote rates on a 1 to 9 scale (page 35). Which factors
// the tool finally uses, and the calculation, are SAMUH's (scope 4, open).
const FACTORS = ["Social", "Autonomous", "Meaningful", "Healthy"] as const;
const SCALE = { min: 1, max: 9 };

function Tool({ go }: { go: (p: PageId) => void }) {
  const [v, setV] = useState<number[]>(FACTORS.map(() => 5));
  const [asked, setAsked] = useState(false);
  const sum = v.reduce((a, b) => a + b, 0);
  const lo = FACTORS.length * SCALE.min;
  const hi = FACTORS.length * SCALE.max;
  // the picture moves as the sliders move. It is a picture of the sliders,
  // not an estimate: the estimate needs SAMUH's calculation
  const leak = (hi - sum) / (hi - lo);
  return (
    <div className="L-tool A-tool">
      <div>
        <p className="L-mid">Move each slider to where your team sits today, low to high. The picture on the right moves with you.</p>
        <div className="L-sliders A-sliders">
          {FACTORS.map((f, i) => (
            <label className="L-slider A-slider" key={f}>
              <span>{f}<b className="A-val">{v[i]}</b></span>
              <input
                className="A-range"
                type="range"
                min={SCALE.min}
                max={SCALE.max}
                step={1}
                value={v[i]}
                aria-valuetext={`${v[i]} of ${SCALE.max}`}
                onChange={(e) => setV((cur) => cur.map((x, k) => (k === i ? Number(e.target.value) : x)))}
              />
            </label>
          ))}
        </div>
        <span className="L-cap">Team environment factors from Sapien Labs research &middot; in partnership with Sapien Labs</span>
      </div>
      <div className="L-result A-result">
        <span className="L-cap">Estimated productive days lost per month</span>
        <span className="L-number A-number" aria-hidden>&mdash;</span>
        <div className="A-gauge" role="img" aria-label="Illustrative picture of the slider positions, not an estimate">
          <span style={{ width: `${Math.round(leak * 100)}%` }} />
        </div>
        <span className="L-cap">Modelled on Samuh&rsquo;s internal tool. Not TeamQ, not diagnostic. A prompt for a conversation.</span>
        {!asked ? (
          <form className="A-breakdown" onSubmit={(e) => { e.preventDefault(); setAsked(true); }}>
            <span className="L-cap">Optional &middot; the full breakdown by email</span>
            <div className="field">
              <input type="email" placeholder="you@company.com" aria-label="Email for the full breakdown" />
              <button className="btn btn-secondary btn-small" type="submit">Send it</button>
            </div>
          </form>
        ) : (
          <p className="L-mid A-sent">Thank you. The breakdown is on its way once the tool is live. <a href="#" className="inline-link" onClick={(e) => { stay(e); go("start"); }}>Or take the fuller assessment</a></p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 11 the equation, with hover definitions                             */
/* ------------------------------------------------------------------ */

// Terms and their parts from page 6 of the introduction deck. The wording
// of the equation is under discussion at SAMUH (meeting notes, 9 September).
type TermId = "practices" | "environment" | "capacity" | "performance";
const TERMS: { id: TermId; term: string; parts: string[]; def: string }[] = [
  { id: "practices", term: "Team practices", parts: ["Joining", "Belonging", "Leaving"], def: "How the team works. The moments of joining, belonging and leaving: onboarding, goal alignment, meetings, feedback, after-action reviews, conflict, celebration, handovers." },
  { id: "environment", term: "Team environment", parts: ["Social", "Autonomous", "Meaningful", "Healthy"], def: "The conditions inside the team. Whether the work is social, autonomous, meaningful and healthy. Practices shape it, and it can be strengthened." },
  { id: "capacity", term: "Capacity to perform", parts: ["Cognitive", "Relational", "Emotional", "Physical"], def: "What people can bring to the work: judgment and focus, trust and feedback, energy and drive, and the stamina the rest depend on. Not fixed. Set by the environment, and measurable." },
  { id: "performance", term: "Performance", parts: ["Business results"], def: "What capacity turns into. The results the organization already measures." },
];
const OPS: Record<number, string> = { 0: "+", 1: "=", 2: "becomes" };

function Equation() {
  const [active, setActive] = useState<TermId>("capacity");
  const cur = TERMS.find((t) => t.id === active)!;
  return (
    <div className="L-equation A-equation">
      <div>
        <div className="L-eq A-eq" aria-label="Team practices plus team environment equals capacity to perform, which becomes performance">
          {TERMS.map((t, i) => (
            <span key={t.id} className="A-eq-pair">
              <button
                type="button"
                className="L-eq-term A-eq-term"
                aria-pressed={active === t.id}
                onMouseEnter={() => setActive(t.id)}
                onFocus={() => setActive(t.id)}
                onClick={() => setActive(t.id)}
              >
                {t.term}
              </button>
              {i < TERMS.length - 1 ? <span className="L-eq-op">{OPS[i]}</span> : null}
            </span>
          ))}
        </div>
        <span className="L-cap">Hover or tap a term</span>
      </div>
      <div className="A-def" aria-live="polite">
        <span className="card-tag">{cur.term}</span>
        <p className="L-mid">{cur.def}</p>
        <ul className="A-parts">
          {cur.parts.map((p) => <li key={p}>{p}</li>)}
        </ul>
        <p className="L-mid A-credit">Capacity is measured with the MHQ, developed by Sapien Labs, which turns human capacity into a measurable performance variable across four dimensions.</p>
        <span className="L-cap">In partnership with Sapien Labs</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export default function HomeA() {
  const go = useGo("a");
  return (
    <>
      {/* 01 the film first, then the promise and what Samuh does */}
      <Sec id="hero" n={1} v="video" headed={false}>
        <div className="L-hero-grid">
          <div className="L-hero-copy">
            <p className="eyebrow">Organizational and high-performance consulting</p>
            <h1 className="display">High performance <em>without</em> the cost to people.</h1>
            <p className="lede">Samuh shows a team where its capacity is leaking. The team chooses one practice to close the gap, and the change is measured.</p>
            <div className="cta-row">
              <button className="btn" onClick={() => go("start")}>Get started <span className="arrow">&rarr;</span></button>
              <button className="btn btn-secondary" onClick={() => go("contact")}>Talk to us</button>
            </div>
          </div>
          <HeroVideo />
        </div>
      </Sec>

      {/* 02 the problem, on the same screen, with the partner credit.
          The line is from the introduction deck (page 2), widened from
          "leadership team" to "team" for the site's audience. Draft. */}
      <Sec id="thesis" n={2} v="under" headed={false}>
        <div className="L-thesis-in">
          <p className="L-big">Every team leaks performance. Few can see where. You have already paid for the talent. The question is whether the team&rsquo;s conditions let you get the full return.</p>
          <span className="L-cap">In partnership with Sapien Labs</span>
        </div>
      </Sec>

      {/* 03 the word, 04 the circles: shared with B and C */}
      <Section def={MEANING} variant="meaning-aside" go={go} />
      <Section def={CIRCLES} variant="circles-nested" go={go} />

      {/* 05 a team you would want to belong to. Keynote page 28 and
          introduction deck page 8. */}
      <Sec id="aspire" n={5} v="columns" kicker="The aspiration" title="A team you would want to lead">
        <div className="L-aspire A-aspire">
          <p className="L-big">High performance is a condition teams can build.</p>
          <p className="L-mid">Capacity can be measured. Team environments can be strengthened. Rituals make change stick.</p>
          <span className="L-cap A-cols-cap">By the end of one sprint, the team has</span>
          <ul className="L-cols A-cols">
            {[
              ["An evidence-based view", "of how the team is operating."],
              ["Shared ownership", "of the team environment."],
              ["One high-leverage ritual", "embedded in the team’s real work."],
              ["Honest conversations", "alignment, and collective decisions."],
              ["Measurable progress", "against the team’s own baseline."],
            ].map(([t, note]) => (
              <li key={t}><span className="L-col-title">{t}</span><span className="L-col-note">{note}</span></li>
            ))}
          </ul>
        </div>
      </Sec>

      {/* 06 one research-backed statement, credited. The line is from the
          introduction deck (page 4). */}
      <Sec id="research" n={6} v="statement" kicker="The research" title="Measured, not inferred">
        <blockquote className="L-research A-research">
          <p className="L-big">The environment inside a team shapes how much capacity its people can bring to the work. What was previously inferred can now be measured.</p>
          <a href="#" className="inline-link" onClick={(e) => { stay(e); go("insights"); }}>Sapien Labs Work Culture Report</a>
          <span className="L-cap">In partnership with Sapien Labs</span>
        </blockquote>
      </Sec>

      {/* 07 trust before proof */}
      <Sec id="voices" n={7} v="carousel" kicker="In their words" title="What teams say">
        <Carousel quotes={VOICES} />
      </Sec>

      {/* 08 the case, as a snippet and a link. Anonymised in SAMUH's own
          deck; no figures until the study is cleared for publication. */}
      <Sec id="case" n={8} v="card" kicker="In practice" title="One ritual, ninety days">
        <div className="L-case">
          <Frame label="Case study image" />
          <div>
            <span className="card-tag">Case study &middot; a Fortune 10 leadership team</span>
            <p className="L-mid">A business unit president wanted more rigor in how the team challenged and strengthened its biggest strategic bets. The team chose feedback on strategic initiatives as the practice to improve, built one weekly ritual around it, and measured the change against its own baseline.</p>
            <a href="#" className="inline-link" onClick={stay}>Read the case study</a>
          </div>
        </div>
      </Sec>

      {/* 09 try it on your own team */}
      <Sec id="tool" n={9} v="split" kicker="Try it on your own team" title="Where is your team leaking?">
        <Tool go={go} />
      </Sec>

      {/* 10 which team is yours, as asked on 27 September */}
      <Sec id="cards" n={10} v="gallery" kicker="Which team are you?" title="Six teams you have probably sat in">
        <p className="L-mid">Samuh&rsquo;s own drawings. Open the one that looks like your team, tell us where you see it, and read what others said.</p>
        <MetaphorGallery />
      </Sec>

      {/* 11 the equation, as a visual with hover definitions */}
      <Sec id="equation" n={11} v="split" kicker="How it adds up" title="The Samuh equation">
        <Equation />
      </Sec>

      {/* 12 the intake entry, then booking first and the form second */}
      <Sec id="start" n={12} v="band" headed={false}>
        <div className="L-start A-start">
          <div>
            <h2 className="sec">What could stronger performance look like for your team?</h2>
            <p className="L-mid">Reflect on how your team scores across the team environment factors and get a result on screen, with a link you can share. Free and ungated. No email to start, none to see the result.</p>
            <span className="L-cap">Our own intake tool, not TeamQ. Email or a booking is offered after the result, never before.</span>
          </div>
          <div className="L-start-actions A-start-actions">
            <div className="cta-row">
              <button className="btn" onClick={() => go("start")}>Get started <span className="arrow">&rarr;</span></button>
            </div>
            <span className="L-cap">Or talk to a person</span>
            <div className="cta-row">
              <button className="btn btn-secondary" onClick={() => go("contact")}>Talk to us</button>
              <a href="#" className="inline-link" onClick={(e) => { stay(e); go("contact"); }}>Send a message</a>
            </div>
          </div>
        </div>
      </Sec>
    </>
  );
}
