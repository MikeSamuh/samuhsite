"use client";

import { HeroVideo, Circles, Dictionary, Carousel, MetaphorGallery, Frame } from "../../layout/sections";
import { useGo } from "../Go";
import "./c.css";

/**
 * Draft C. Eight sections, from the 28 September review of Draft A:
 *
 * - the thesis is said once, in the hero, not four times
 * - the model (the equation) comes before the evidence for it
 * - one taxonomy on the page: the four environment factors. The four
 *   capacities go to Process or Insights
 * - one primary ask, Get started, with Book a call second, in the hero and
 *   the close only
 *
 * Copy is Draft A's, trimmed, plus section titles. Same primitives as the
 * other drafts so the style and the Editorial frame apply unchanged. Nothing
 * here is approved copy; the research line and the factor set are SAMUH's
 * to land.
 */

const stay = (e: React.MouseEvent) => e.preventDefault();
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

const FACTORS = ["Social", "Autonomous", "Meaningful", "Healthy"];

export default function HomeC() {
  const go = useGo("c");
  const ctas = (
    <div className="cta-row">
      <button className="btn" onClick={() => go("start")}>Get started <span className="arrow">&rarr;</span></button>
      <button className="btn btn-secondary" onClick={() => go("contact")}>Book a call</button>
    </div>
  );
  return (
    <>
      {/* 01 hero. The thesis lives here and nowhere else. */}
      <Sec id="hero" n={1} v="video" headed={false}>
        <div className="L-hero-grid">
          <div className="L-hero-copy">
            <p className="eyebrow">Organizational and high-performance consulting</p>
            <h1 className="display">High performance <em>without</em> the cost to people.</h1>
            <p className="lede">Most teams leak performance through their environment, not their effort. Samuh finds where yours is leaking, and gives you the practices to close it.</p>
            {ctas}
            <span className="L-cap C-credit">In partnership with Sapien Labs</span>
          </div>
          <HeroVideo />
        </div>
      </Sec>

      {/* 02 circles. The gap the whole argument rests on, with the word explained beside it. */}
      <Sec id="circles" n={2} v="nested" kicker="Teams, individuals, organizations" title="Where work life happens">
        <p className="L-big C-lead">Organizations invest in the individual and in the organization. People experience their work in the team, and that is where performance is won or lost.</p>
        <Circles />
        <div className="C-aside">
          <Dictionary />
        </div>
      </Sec>

      {/* 03 equation. The model, before any proof of it. */}
      <Sec id="equation" n={3} v="split" kicker="The model" title="The SAMUH equation">
        <div className="L-equation">
          <Frame label="The SAMUH equation · video, plays in place" tall />
          <div>
            <p className="L-big">Team practices shape the team environment. The environment sets the capacity people can bring. Capacity turns into performance.</p>
            <div className="L-eq" aria-label="Team environment plus team practices equals capacity, which becomes performance">
              <span className="L-eq-term">Team environment</span>
              <span className="L-eq-op">+</span>
              <span className="L-eq-term">Team practices</span>
              <span className="L-eq-op">=</span>
              <span className="L-eq-term">Capacity</span>
              <span className="L-eq-op">becomes</span>
              <span className="L-eq-term">Performance</span>
            </div>
            <p className="L-mid C-factors">
              Team environment, in four factors: {FACTORS.join(", ")}. The tool below runs on the same four.
            </p>
            <span className="L-cap">Draft. Factor set to be confirmed by SAMUH.</span>
          </div>
        </div>
      </Sec>

      {/* 04 research. Evidence for the model. Wording not landed. */}
      <Sec id="research" n={4} v="statement" kicker="The research" title="The evidence">
        <blockquote className="L-research">
          <p className="L-big">The environment inside a team shapes how much capacity its people can bring to the work. What was previously inferred can now be measured.</p>
          <a href="#" className="inline-link" onClick={stay}>Sapien Labs Work Culture Report</a>
          <span className="L-cap">In partnership with Sapien Labs &middot; wording to be confirmed by SAMUH</span>
        </blockquote>
      </Sec>

      {/* 05 proof. Trust first, then the case. One section. */}
      <Sec id="proof" n={5} v="card" kicker="In their words, and in practice" title="Proof">
        <div className="C-proof">
          <Carousel />
          <div className="L-case">
            <Frame label="Case study image or client mark · contract check first" />
            <div>
              <span className="card-tag">Case study · a Fortune 10 leadership team</span>
              <p className="L-mid">A business unit president wanted more rigor in how the team challenged and strengthened its biggest strategic bets. The team chose feedback on strategic initiatives as the practice to improve, and built one ritual around it.</p>
              <a href="#" className="inline-link" onClick={stay}>Read the case study</a>
            </div>
          </div>
        </div>
      </Sec>

      {/* 06 tool. The same four factors the equation named. */}
      <Sec id="tool" n={6} v="split" kicker="Try it on your own team" title="Where is your team leaking?">
        <div className="L-tool">
          <div className="L-sliders">
            {FACTORS.map((f) => (
              <label className="L-slider" key={f}>
                <span>{f}</span>
                <span className="L-track"><span className="L-thumb" /></span>
              </label>
            ))}
          </div>
          <div className="L-result">
            <span className="L-cap">Estimated productive days lost per month</span>
            <span className="L-number">&mdash;</span>
            <span className="L-cap">Your estimate appears here as you move the sliders. Our own intake tool, not TeamQ, not diagnostic.</span>
          </div>
        </div>
      </Sec>

      {/* 07 cards. As the client asked on 27 September. */}
      <Sec id="cards" n={7} v="gallery" kicker="Which team are you?" title="Four teams you might recognize">
        <MetaphorGallery />
      </Sec>

      {/* 08 start. One ask, and its second. No inline field. */}
      <Sec id="start" n={8} v="band" headed={false}>
        <div className="L-start">
          <div>
            <h2 className="sec">What could stronger performance look like for your team?</h2>
            <p className="L-mid">Free and ungated. The first insight lands before the first ask.</p>
          </div>
          <div className="L-start-actions">{ctas}</div>
        </div>
      </Sec>
    </>
  );
}
