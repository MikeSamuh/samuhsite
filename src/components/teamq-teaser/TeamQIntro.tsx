import { BASELINE, BASELINE_AVERAGES, FACTORS, LIFESTYLE_HINTS, TEAM_SIZE, type Factor } from "./model";
import { ReadoutTour, type TourStep } from "./ReadoutTour";
import type { TeaserResult } from "./TeamQTeaser";
import "./teaser.css";

// TODO(content): every line of copy here is our draft, for SAMUH to replace.
// It describes and does not claim: no statistics, no outcomes, no client
// names. See CLAUDE.md rules 1 and 4.

const one = (value: number) => value.toFixed(1);

/** The readout, one figure at a time. One frozen readout stays on screen
 *  and the lit figure follows these as they scroll. */
const READOUT_STEPS: TourStep[] = [
  {
    lit: "days",
    kicker: "Productive days per month",
    title: "The headline number.",
    text: "Of 22 working days in a month, how many this team gets full value from, as the team reported it. It is the number a leader feels first, so it is the one in colour, and it moves as the factors change.",
  },
  {
    lit: "mhq",
    kicker: "Capacity to perform",
    title: "How much the people on this team have to give.",
    text: "The team’s average Mental Health Quotient, the measure from our partner Sapien Labs that TeamQ is built on, on its scale from Distressed to Thriving. The marker shows where this team sits today. As the factors change, it moves along the scale.",
  },
];

/** A section in the editorial frame: heading left, content right. */
function Part({ kicker, title, children, cls }: { kicker: string; title: string; children: React.ReactNode; cls?: string }) {
  return (
    <section className={`L-sec L-sec-h guide-part${cls ? ` ${cls}` : ""}`}>
      <div className="L-wrap">
        <div className="L-head">
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

/** One slider, frozen at the baseline. Decorative. */
function SliderExhibit({ factor }: { factor: Factor }) {
  const value = BASELINE[factor.id];
  const fill = ((value - factor.min) / (factor.max - factor.min)) * 100;
  const hint = LIFESTYLE_HINTS[factor.id];
  return (
    <div className="teaser-input">
      <span className="guide-exhibit-label">{factor.label}</span>
      <span className="teaser-value">{value}</span>
      <input className="teaser-range" type="range" min={factor.min} max={factor.max} step={factor.step} value={value} readOnly tabIndex={-1} style={{ "--fill": `${fill}%` } as React.CSSProperties} />
      <span className="teaser-note">
        Baseline avg: {one(BASELINE_AVERAGES[factor.id])}
        {hint ? ` · ${hint}` : null}
      </span>
    </div>
  );
}

/** The first work environment slider, frozen. */
function WorkExhibit() {
  return (
    <div className="guide-exhibit guide-exhibit-input" aria-hidden="true">
      <SliderExhibit factor={FACTORS[0]} />
    </div>
  );
}

/** The two lifestyle sliders, frozen. */
function LifestyleExhibit() {
  return (
    <div className="guide-exhibit guide-exhibit-input" aria-hidden="true">
      {FACTORS.filter((factor) => factor.group === "lifestyle").map((factor) => (
        <SliderExhibit factor={factor} key={factor.id} />
      ))}
    </div>
  );
}

/** The top of /teamq: a short education that leads into the tool. The
 *  heading, what TeamQ is and how SAMUH uses it in one section, then each
 *  part of the tool explained one at a time on a frozen copy of the real
 *  thing. */
export function TeamQIntro({ baseline }: { baseline: TeaserResult }) {
  return (
    <>
      <section className="L-sec L-page-head teaser-intro">
        <div className="L-wrap">
          <p className="eyebrow L-eyebrow">Explore TeamQ</p>
          <h1 className="display L-page-title">Optimize your team, with science</h1>
          <a className="btn" href="#tool">
            Skip to the tool <span className="arrow">&darr;</span>
          </a>
        </div>
      </section>

      <Part kicker="What is TeamQ" title="A read on how a team works, and how its people live.">
        <div className="guide-copy">
          <p className="L-mid">
            TeamQ is how SAMUH reads a team: what the work is like for the people doing it, and what that does to
            their capacity to perform. It looks at the work environment, and at how people live outside it.
          </p>
          <p className="L-mid">
            With a real team, this is where the work starts. The team answers for itself, we read the result
            together, and the team chooses what to work on. Then we measure again. Capacity to perform is
            measured with the Mental Health Quotient (MHQ), from our partner Sapien Labs.
          </p>
          <p className="L-mid">
            Below, you can see how different factors could positively or negatively affect a team, using example
            test case data: a demonstration team of {TEAM_SIZE}, and ten factors, eight in the work environment
            and two in how people live. First, what the numbers mean.
          </p>
        </div>
      </Part>

      <section className="L-sec guide-tour">
        <div className="L-wrap">
          <ReadoutTour baseline={baseline} steps={READOUT_STEPS} />
        </div>
      </section>

      <Part kicker="Work environment" title="Eight factors, rated 1 to 9." cls="guide-step">
        <div className="guide-step-body">
          <p className="L-mid">
            Each slider starts at this team&rsquo;s average, with the exact average noted under it. Drag it to see
            what happens when the whole team&rsquo;s experience of that factor improves, or slips.
          </p>
          <WorkExhibit />
        </div>
      </Part>

      <Part kicker="Lifestyle factors" title="Beyond the team, to the individual." cls="guide-step">
        <div className="guide-step-body">
          <p className="L-mid">
            Two factors from outside work, on the same 1 to 9 scale as the rest: exercise, and healthy diet, which
            is how rarely people eat ultra-processed food. The sliders start at the sample team&rsquo;s averages,
            not at a recommendation.
          </p>
          <p className="L-mid">
            This is what sets SAMUH apart. We do not stop at the team inside the organization. We go to individual
            habits and rituals, all encompassing, because a team performs with the whole person.
          </p>
          <LifestyleExhibit />
        </div>
      </Part>

    </>
  );
}
