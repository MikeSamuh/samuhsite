"use client";

import Link from "next/link";
import { TeamQTeaser, type Answer, type TeaserResult } from "./TeamQTeaser";
import { TeaserValues } from "./TeaserValues";
import { DEFAULTS, type HomeContent } from "@/lib/content/defaults";
import { LEADQ_HREF, TEAMQ_PATH } from "@/lib/site";
import "./teaser.css";

export interface HomeTeamQProps {
  baseline: TeaserResult;
  answer: Answer;
  /** the home's words: the section head, the pitch, the button */
  tool: HomeContent["tool"];
}

/** The tool itself, right under the circles, usable on the page (Mike,
 *  2 Nov 2026). No explainer around it: the head, the dials, one button
 *  to LeadQ and a quiet link to /teamq for the visitor with questions. */
export function HomeTeamQ({ baseline, answer, tool = DEFAULTS.home.tool }: HomeTeamQProps) {
  return (
    <TeaserValues>
      <section className="L-sec teaser-sec L-s-tool" id="tool" data-n="04" aria-labelledby="home-tool-title">
        <div className="L-wrap">
          <p className="eyebrow L-eyebrow">{tool.kicker}</p>
          <h2 className="sec teaser-title" id="home-tool-title">
            {tool.title}
          </h2>
          <TeamQTeaser baseline={baseline} answer={answer} />
          <div className="teaser-pitch">
            {tool.pitch ? <p className="L-mid">{tool.pitch}</p> : null}
            <div className="cta-row">
              <Link className="btn" href={LEADQ_HREF}>{tool.cta} <span className="arrow">&rarr;</span></Link>
              <Link className="inline-link L-text-cta" href={TEAMQ_PATH}>How TeamQ reads a team <span className="arrow">&rarr;</span></Link>
            </div>
          </div>
        </div>
      </section>
    </TeaserValues>
  );
}
