import type { Metadata } from "next";
import { BASELINE, OPTIMIZER_MOVES } from "@/components/teamq-teaser/model";
import { TeamQIntro } from "@/components/teamq-teaser/TeamQIntro";
import { TeamQAsk, TeamQTeaser } from "@/components/teamq-teaser/TeamQTeaser";
import { TeaserValues } from "@/components/teamq-teaser/TeaserValues";
import { getContent } from "@/lib/content/content";
import { bestForProductiveDays, score } from "@/lib/teaser/score";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Explore TeamQ",
  description: "Optimize your team, with science. Change what work is like for a demonstration team and watch their productive days move.",
  path: "/teamq",
});

// The words come from the admin's content layer.
export default async function TeamQPage() {
  // scored here, on the server, so the page arrives with its numbers
  const baseline = score(BASELINE);
  const { values, levers, score: best } = bestForProductiveDays(OPTIMIZER_MOVES);
  const answer = { values, levers, days: best.days, mhq: best.mhq };
  const { teamq } = await getContent();
  return (
    // the form comes first; the sliders below share their state with it
    <TeaserValues>
      <TeamQIntro baseline={baseline} c={teamq} ask={<TeamQAsk words={teamq.ask} />} />
      <section className="L-sec teaser-sec" id="tool" aria-labelledby="tool-title">
        <div className="L-wrap">
          <h2 className="sec teaser-title" id="tool-title">
            {teamq.tool.title}
          </h2>
          <TeamQTeaser baseline={baseline} answer={answer} />
        </div>
      </section>
    </TeaserValues>
  );
}
