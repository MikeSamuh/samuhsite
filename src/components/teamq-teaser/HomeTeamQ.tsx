"use client";

import Link from "next/link";
import { TEAM_SIZE } from "./model";
import { TeamQTeaser, type Answer, type TeaserResult } from "./TeamQTeaser";
import { TeaserValues } from "./TeaserValues";
import { ToolTour, type TourStep } from "./ToolTour";
import { DEFAULTS, type HomeContent, type TeamQContent } from "@/lib/content/defaults";
import { fill } from "@/lib/content/shared";
import { ROUTES } from "@/lib/site";
import "./teaser.css";

export interface HomeTeamQProps {
  baseline: TeaserResult;
  answer: Answer;
  /** the /teamq words: what TeamQ is, the tour, the tool's title */
  c: TeamQContent;
  /** the home's words for the section head and the button after the tool */
  tool: HomeContent["tool"];
}

/** The tool, one part at a time, in the order /teamq uses. */
const TOUR_LIT: TourStep["lit"][] = ["days", "mhq", "work", "life"];

/** The whole of /teamq on the home, in place of the demo and its button
 *  (the client, 2 Nov 2026: the tool should be usable right here, not
 *  behind a click). The section head carries the home's own title, the
 *  rest is the same copy and the same components as /teamq, the h1
 *  dropped to an h2, and the ask is one button to Get started. */
export function HomeTeamQ({ baseline, answer, c = DEFAULTS.teamq, tool = DEFAULTS.home.tool }: HomeTeamQProps) {
  const steps: TourStep[] = TOUR_LIT.map((lit, i) => ({ lit, kicker: c.tour.items[i]?.kicker ?? "", title: c.tour.items[i]?.title ?? "", text: c.tour.items[i]?.text ?? "" }));
  return (
    <TeaserValues>
      <section className="L-sec L-sec-h L-s-tool guide-part" id="tool" data-n="05">
        <div className="L-wrap">
          <div className="L-head">
            <div>
              <p className="eyebrow L-eyebrow">{tool.kicker}</p>
              <h2 className="sec">{tool.title}</h2>
            </div>
          </div>
          <div className="guide-copy">
            <p className="L-mid">{c.what.p1}</p>
            <p className="L-mid">{c.what.p2}</p>
            <p className="L-mid">{fill(c.what.p3, { teamSize: TEAM_SIZE })}</p>
          </div>
        </div>
      </section>

      <section className="L-sec guide-tour">
        <div className="L-wrap">
          <ToolTour baseline={baseline} steps={steps} />
        </div>
      </section>

      <section className="L-sec teaser-sec" id="teamq" aria-labelledby="home-tool-title">
        <div className="L-wrap">
          <h2 className="sec teaser-title" id="home-tool-title">
            {c.tool.title}
          </h2>
          <TeamQTeaser baseline={baseline} answer={answer} />
          <div className="teaser-pitch">
            {tool.pitch ? <p className="L-mid">{tool.pitch}</p> : null}
            <div className="cta-row">
              <Link className="btn" href={ROUTES.start}>{tool.cta} <span className="arrow">&rarr;</span></Link>
            </div>
          </div>
        </div>
      </section>
    </TeaserValues>
  );
}
