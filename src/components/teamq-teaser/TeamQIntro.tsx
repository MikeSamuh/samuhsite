import { BASELINE, BASELINE_AVERAGES, FACTORS, LIFESTYLE_OPTIONS, TEAM_SIZE } from "./model";
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
    text: "Of 22 working days in a month, how many this team is estimated to get full value from. It is the number a leader feels first, so it is the one in colour.",
  },
  {
    lit: "teamQ",
    kicker: "TeamQ",
    title: "The team's environment and habits, in one figure.",
    text: "A composite from 0 to 100, built from all eleven factors and weighted by how much each one matters. Higher means the conditions this team works and lives in are closer to their best.",
  },
  {
    lit: "mhq",
    kicker: "MHQ",
    title: "Capacity to perform.",
    text: "The team\u2019s average Mental Health Quotient, the measure from our partner Sapien Labs that TeamQ is built on. It estimates how much capacity the people on this team have to bring to their work.",
  },
  {
    lit: "change",
    kicker: "Change from today",
    title: "Every figure shows how far it has moved.",
    text: "The team starts as they are today. Move anything and each figure shows its change from that starting point, up or down.",
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

/** One work environment slider, frozen at the baseline. Decorative. */
function SliderExhibit() {
  const factor = FACTORS[0];
  const value = BASELINE[factor.id];
  const fill = ((value - factor.min) / (factor.max - factor.min)) * 100;
  return (
    <div className="guide-exhibit guide-exhibit-input" aria-hidden="true">
      <div className="teaser-input">
        <span className="guide-exhibit-label">{factor.label}</span>
        <span className="teaser-value">{value}</span>
        <input className="teaser-range" type="range" min={factor.min} max={factor.max} step={factor.step} value={value} readOnly tabIndex={-1} style={{ "--fill": `${fill}%` } as React.CSSProperties} />
        <span className="teaser-note">Baseline avg: {one(BASELINE_AVERAGES[factor.id])}</span>
      </div>
    </div>
  );
}

/** The two lifestyle selects, frozen at the baseline. Decorative. */
function LifestyleExhibit() {
  return (
    <div className="guide-exhibit guide-exhibit-input" aria-hidden="true">
      {FACTORS.filter((factor) => factor.group === "lifestyle").map((factor) => (
        <div className="teaser-input teaser-choice" key={factor.id}>
          <span className="guide-exhibit-label">{factor.label}</span>
          <span className="guide-exhibit-select">{LIFESTYLE_OPTIONS[factor.id][BASELINE[factor.id] - 1]}</span>
          <span className="teaser-note">Baseline avg: {one(BASELINE_AVERAGES[factor.id])}</span>
        </div>
      ))}
    </div>
  );
}

/** The top of /teamq: an education that leads into the tool. The heading,
 *  one bold line, what TeamQ is, how SAMUH uses it, then each part of the
 *  tool explained one at a time, lit on a frozen copy of the real thing. */
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

      <section className="L-sec guide-bold">
        <div className="L-wrap">
          <p className="L-big">
            A team&rsquo;s performance is shaped by the conditions it works in and the lives its people lead. TeamQ
            measures both, so a team can see where it is leaking and what to do about it.
          </p>
        </div>
      </section>

      <Part kicker="01" title="What is TeamQ">
        <div className="guide-copy">
          <p className="L-mid">
            TeamQ is how SAMUH reads a team: what the work is like for the people doing it, and what that does to
            their capacity to perform.
          </p>
          <p className="L-mid">
            It looks at eleven things that shape a working life. Nine are about the work environment, from workload
            to the relationship with a manager. Two are about how people live outside it.
          </p>
        </div>
      </Part>

      <Part kicker="02" title="How we use it">
        <div className="guide-copy">
          <p className="L-mid">
            With a real team, this is where the work starts. The team answers for itself, we read the result
            together, and the team chooses what to work on. Then we measure again.
          </p>
          <p className="L-mid">
            Capacity to perform is measured with the Mental Health Quotient (MHQ), from our partner Sapien Labs.
          </p>
        </div>
      </Part>

      <Part kicker="03" title="How to understand it">
        <div className="guide-copy">
          <p className="L-mid">
            Below, you can interact with the tool and see how different factors could positively or negatively
            affect a team, using example test case data: a demonstration team of {TEAM_SIZE}. Before you do, here
            is what each part of it shows.
          </p>
        </div>
      </Part>

      <section className="L-sec guide-tour">
        <div className="L-wrap">
          <ReadoutTour baseline={baseline} steps={READOUT_STEPS} />
        </div>
      </section>

      <Part kicker="Work environment" title="Nine factors, rated 1 to 9." cls="guide-step">
        <div className="guide-step-body">
          <p className="L-mid">
            Each slider starts at this team&rsquo;s average, with the exact average noted under it. Drag it to see
            what happens when the whole team&rsquo;s experience of that factor improves, or slips.
          </p>
          <SliderExhibit />
        </div>
      </Part>

      <Part kicker="Lifestyle factors" title="Beyond the team, to the individual." cls="guide-step">
        <div className="guide-step-body">
          <p className="L-mid">
            Two factors from outside work: exercise, and how often people eat ultra-processed food. The values
            shown are the sample team&rsquo;s baseline averages, not a recommendation.
          </p>
          <p className="L-mid">
            This is what sets SAMUH apart. We do not stop at the team inside the organization. We go to individual
            habits and rituals, all encompassing, because a team performs with the whole person.
          </p>
          <LifestyleExhibit />
        </div>
      </Part>

      <section className="L-sec guide-handoff">
        <div className="L-wrap">
          <p className="teaser-intro-note">
            The team below is a demonstration, not yours. Nothing on this page is a result for your team.
          </p>
          <p className="L-big">Now try it. There is a challenge waiting.</p>
        </div>
      </section>
    </>
  );
}
