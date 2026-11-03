"use client";

import Link from "next/link";
import { mhqBand } from "@/lib/tokens";
import { TEAM_SIZE } from "./model";
import { EMPTY_VALUES, TeamQTeaser, type Answer, type TeaserResult } from "./TeamQTeaser";
import { TeaserValues } from "./TeaserValues";
import { DEFAULTS, type HomeContent } from "@/lib/content/defaults";
import { ROUTES } from "@/lib/site";
import "./teaser.css";

export interface HomeTeamQProps {
  baseline: TeaserResult;
  answer: Answer;
  /** the home's words: the section head, the pitch, the button */
  tool: HomeContent["tool"];
}

const one = (value: number) => value.toFixed(1);

/** The tool itself, right under the circles, usable on the page (Mike,
 *  2 Nov 2026). The head carries the sample team's line; the sliders start
 *  empty, a click animates the sample in, another the optimizer's answer;
 *  one button to LeadQ after it (Wilfred, the same evening). */
export function HomeTeamQ({ baseline, answer, tool = DEFAULTS.home.tool }: HomeTeamQProps) {
  return (
    <TeaserValues initial={EMPTY_VALUES}>
      <section className="L-sec teaser-sec L-s-tool" id="tool" data-n="04" aria-labelledby="home-tool-title">
        <div className="L-wrap">
          <p className="eyebrow L-eyebrow">{tool.kicker}</p>
          <h2 className="sec teaser-title" id="home-tool-title">
            {tool.title}
          </h2>
          <p className="L-mid teaser-lede">
            A team of {TEAM_SIZE}, as they are today. {one(baseline.days)} productive days a month. Capacity to perform {one(baseline.mhq)}, {mhqBand(baseline.mhq).name}.
          </p>
          <TeamQTeaser baseline={baseline} answer={answer} staged />
          {tool.pitch ? <p className="L-mid teaser-pitch">{tool.pitch}</p> : null}
        </div>
      </section>

      {/* the call-out between the tool and the cards: one line, one button to Start here */}
      <section className="L-sec teaser-callout" data-n="05" aria-labelledby="home-callout-title">
        <div className="L-wrap teaser-callout-in">
          <h2 className="sec" id="home-callout-title">{tool.callout}</h2>
          <Link className="btn" href={ROUTES.start}>{tool.cta} <span className="arrow">&rarr;</span></Link>
        </div>
      </section>
    </TeaserValues>
  );
}
