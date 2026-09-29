"use client";

import { SECTIONS } from "@/lib/layout";
import { HeroVideo, Carousel, MetaphorGallery, Frame, Section } from "../../layout/sections";
import { useGo } from "../Go";
import "./c.css";

/**
 * Draft C. The homepage review of 28 September, built.
 *
 * Eight sections that read as one argument:
 *
 *   01 the promise, said once, over the film
 *   02 the word, then the gap: the three circles, as in A and B
 *   03 the model, before any proof of it
 *   04 the evidence, credited to Sapien Labs
 *   05 the proof: voices, then a case, one section
 *   06 try it: the same four factors the model named
 *   07 which team is yours
 *   08 one ask, and its second
 *
 * Same style, same Editorial frame, same primitives as A and B, so only
 * the argument and its composition differ. Copy is draft. The research
 * line and the factor set are SAMUH's to land; both carry a visible note.
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

/** the four team environment factors, as Draft A's tool named them. Not confirmed. */
const FACTORS: [string, string][] = [
  ["Social", "Is the work social?"],
  ["Autonomous", "Is it autonomous?"],
  ["Meaningful", "Is it meaningful?"],
  ["Healthy", "Is it healthy?"],
];

export default function HomeC() {
  const go = useGo("c");
  const ctas = (
    <div className="cta-row">
      <button className="btn" onClick={() => go("start")}>Get started <span className="arrow">&rarr;</span></button>
      <button className="btn btn-secondary" onClick={() => go("contact")}>Talk to us</button>
    </div>
  );
  return (
    <>
      {/* 01 the promise, once, over the film */}
      <Sec id="hero" n={1} v="over" headed={false}>
        <div className="L-hero-grid">
          <div className="L-hero-copy">
            <p className="eyebrow">In partnership with Sapien Labs</p>
            <h1 className="display">High performance <em>without</em> the cost to people.</h1>
            <p className="lede">Teams leak performance through their environment, not their effort. Samuh shows a team where it is leaking, and gives it the practices that close the gap.</p>
            {ctas}
          </div>
          <HeroVideo />
        </div>
      </Sec>

      {/* 02 the word, then the gap. The same two sections as A and B, from
          sections.tsx, so the circles look and move the same in every draft. */}
      <Section def={MEANING} variant="meaning-aside" go={go} />
      <Section def={CIRCLES} variant="circles-nested" go={go} />

      {/* 03 the model */}
      <Sec id="equation" n={3} v="split" kicker="The model" title="How performance is made">
        <div className="L-equation">
          <Frame label="The SAMUH equation · film, plays in place" tall />
          <div>
            <p className="L-big">Practices shape the environment. The environment sets capacity. Capacity becomes performance.</p>
            <div className="L-eq" aria-label="Team environment plus team practices equals capacity, which becomes performance">
              <span className="L-eq-term">Team environment</span>
              <span className="L-eq-op">+</span>
              <span className="L-eq-term">Team practices</span>
              <span className="L-eq-op">=</span>
              <span className="L-eq-term">Capacity</span>
              <span className="L-eq-op">becomes</span>
              <span className="L-eq-term">Performance</span>
            </div>
            <p className="L-mid">The environment is four questions. The tool below asks the same four about your team.</p>
            <ul className="L-cols C-factors">
              {FACTORS.map(([f, q]) => (
                <li key={f}><span className="L-col-title">{f}</span><span className="L-col-note">{q}</span></li>
              ))}
            </ul>
            <span className="L-cap">Draft. Factor set to be confirmed by SAMUH.</span>
          </div>
        </div>
      </Sec>

      {/* 04 the evidence */}
      <Sec id="research" n={4} v="card" kicker="The research" title="Measured, not inferred">
        <blockquote className="L-research">
          <p className="L-big">The environment inside a team shapes how much capacity its people can bring to the work. What was previously inferred can now be measured.</p>
          <a href="#" className="inline-link" onClick={stay}>Sapien Labs Work Culture Report</a>
          <span className="L-cap">In partnership with Sapien Labs &middot; wording to be confirmed by SAMUH</span>
        </blockquote>
      </Sec>

      {/* 05 the proof: voices, then a case */}
      <Sec id="proof" n={5} v="card" kicker="In their words, and in practice" title="What changes">
        <div className="C-proof">
          <Carousel />
          <div className="L-case">
            <Frame label="Case study image or client mark · contract check first" />
            <div>
              <span className="card-tag">Case study &middot; a Fortune 10 leadership team</span>
              <p className="L-mid">A business unit president wanted more rigor in how the team challenged and strengthened its biggest strategic bets. The team chose feedback on strategic initiatives as the practice to improve, and built one ritual around it.</p>
              <a href="#" className="inline-link" onClick={stay}>Read the case study</a>
            </div>
          </div>
        </div>
      </Sec>

      {/* 06 try it, on the four factors the model named */}
      <Sec id="tool" n={6} v="split" kicker="Try it" title="Where is your team leaking?">
        <div className="L-tool">
          <div>
            <p className="L-mid">One slider per factor. Move each to where your team sits and watch the estimate change.</p>
            <div className="L-sliders">
              {FACTORS.map(([f]) => (
                <label className="L-slider" key={f}>
                  <span>{f}</span>
                  <span className="L-track"><span className="L-thumb" /></span>
                </label>
              ))}
            </div>
          </div>
          <div className="L-result">
            <span className="L-cap">Estimated productive days lost per month</span>
            <span className="L-number">&mdash;</span>
            <span className="L-cap">Our own intake tool, not TeamQ, not diagnostic. The estimate is a prompt for a conversation.</span>
          </div>
        </div>
      </Sec>

      {/* 07 which team is yours. As the client asked on 27 September. */}
      <Sec id="cards" n={7} v="gallery" kicker="Four teams" title="Which one is yours?">
        <p className="L-mid">Four teams you have probably sat in. Open one and tell us where you see yours.</p>
        <MetaphorGallery />
      </Sec>

      {/* 08 one ask, and its second */}
      <Sec id="start" n={8} v="split" headed={false}>
        <div className="L-start">
          <div>
            <h2 className="sec">See where your team is leaking.</h2>
            <p className="L-mid">Free and ungated. The first insight lands before the first ask. From there, three ways to work with us: Self-guided, Supported, or Guided in person.</p>
            <a href="#" className="inline-link" onClick={(e) => { stay(e); go("solutions"); }}>Compare the three</a>
          </div>
          <div className="L-start-actions">{ctas}</div>
        </div>
      </Sec>
    </>
  );
}
