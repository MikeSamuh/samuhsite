import { TEAM_SIZE } from "./model";
import type { TeaserResult } from "./TeamQTeaser";
import { ToolTour, type TourStep } from "./ToolTour";
import { DEFAULTS, type TeamQContent } from "@/lib/content/defaults";
import { fill } from "@/lib/content/shared";
import "./teaser.css";

// TODO(content): every line of copy here is our draft, for SAMUH to replace.
// It describes and does not claim: no statistics, no outcomes, no client
// names. See CLAUDE.md rules 1 and 4.

/** The tool, one part at a time. One frozen copy of it stays on screen and
 *  the lit part follows these as they scroll. The words come from the
 *  content layer, one per part, in this order. */
const TOUR_LIT: TourStep["lit"][] = ["days", "mhq", "work", "life"];

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
export function TeamQIntro({ baseline, c = DEFAULTS.teamq }: { baseline: TeaserResult; /** the page's words, from the admin */ c?: TeamQContent }) {
  const steps: TourStep[] = TOUR_LIT.map((lit, i) => ({ lit, kicker: c.tour.items[i]?.kicker ?? "", title: c.tour.items[i]?.title ?? "", text: c.tour.items[i]?.text ?? "" }));
  return (
    <>
      <section className="L-sec L-page-head teaser-intro">
        <div className="L-wrap">
          <p className="eyebrow L-eyebrow">{c.head.eyebrow}</p>
          <h1 className="display L-page-title">{c.head.title}</h1>
          <div className="cta-row">
            <a className="btn" href="#ask">
              {c.head.ctaPrimary} <span className="arrow">&rarr;</span>
            </a>
            <a className="btn btn-secondary" href="#tool">
              {c.head.ctaSecondary} <span className="arrow">&darr;</span>
            </a>
          </div>
        </div>
      </section>

      <Part kicker={c.what.kicker} title={c.what.title}>
        <div className="guide-copy">
          <p className="L-mid">{c.what.p1}</p>
          <p className="L-mid">{c.what.p2}</p>
          <p className="L-mid">{fill(c.what.p3, { teamSize: TEAM_SIZE })}</p>
        </div>
      </Part>

      <section className="L-sec guide-tour">
        <div className="L-wrap">
          <ToolTour baseline={baseline} steps={steps} />
        </div>
      </section>
    </>
  );
}
