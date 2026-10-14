import { TEAM_SIZE } from "./model";
import type { TeaserResult } from "./TeamQTeaser";
import { ToolTour, type TourStep } from "./ToolTour";
import "./teaser.css";

// TODO(content): every line of copy here is our draft, for SAMUH to replace.
// It describes and does not claim: no statistics, no outcomes, no client
// names. See CLAUDE.md rules 1 and 4.

/** The tool, one part at a time. One frozen copy of it stays on screen and
 *  the lit part follows these as they scroll. */
const TOUR_STEPS: TourStep[] = [
  {
    lit: "days",
    kicker: "Productive days per month",
    title: "The headline number.",
    text: "Of 22 working days in a month, how many this team gets full value from, as the team reported it. It is the number a leader feels first, so it is the one in colour, and it moves as the factors change.",
  },
  {
    lit: "mhq",
    kicker: "Capacity to perform",
    title: "How far the team is from Thriving.",
    text: "The team’s average Mental Health Quotient, the measure from our partner Sapien Labs that TeamQ is built on, read on its scale from Distressed to Thriving. The meter runs from -100 to 200 and the needle moves as the factors change. The number says how many points separate this team from Thriving.",
  },
  {
    lit: "work",
    kicker: "Work environment",
    title: "Nine factors, rated 1 to 9.",
    text: "What the work is like for the people doing it: flexibility, workload, purpose, learning, colleagues, manager, information and recognition. Each slider starts where this team’s average sits today. Drag it to see what happens when the whole team’s experience of that factor improves, or slips.",
  },
  {
    lit: "life",
    kicker: "Lifestyle factors",
    title: "Beyond the team, to the individual.",
    text: "Two factors from outside work, on the same 1 to 9 scale: exercise, and healthy diet, which is how rarely people eat ultra-processed food. This is what sets SAMUH apart. We do not stop at the team inside the organization. We go to individual habits and rituals, because a team performs with the whole person.",
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

/** The top of /teamq: the heading, what TeamQ is in one section, then the
 *  tool explained one part at a time on a frozen copy of the real thing. */
export function TeamQIntro({ baseline }: { baseline: TeaserResult }) {
  return (
    <>
      <section className="L-sec L-page-head teaser-intro">
        <div className="L-wrap">
          <p className="eyebrow L-eyebrow">Explore TeamQ</p>
          <h1 className="display L-page-title">Optimize your team, with science</h1>
          <div className="cta-row">
            <a className="btn" href="#ask">
              Assess your team <span className="arrow">&rarr;</span>
            </a>
            <a className="btn btn-secondary" href="#tool">
              Skip to the tool <span className="arrow">&darr;</span>
            </a>
          </div>
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
            test case data: a demonstration team of {TEAM_SIZE}, and eleven factors, nine in the work environment
            and two in how people live. First, what you are looking at.
          </p>
        </div>
      </Part>

      <section className="L-sec guide-tour">
        <div className="L-wrap">
          <ToolTour baseline={baseline} steps={TOUR_STEPS} />
        </div>
      </section>
    </>
  );
}
