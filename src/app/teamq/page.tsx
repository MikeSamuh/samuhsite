import type { Metadata } from "next";
import { BASELINE, OPTIMIZER_MOVES } from "@/components/teamq-teaser/model";
import { TeamQIntro } from "@/components/teamq-teaser/TeamQIntro";
import { TeamQTeaser } from "@/components/teamq-teaser/TeamQTeaser";
import { getContent } from "@/lib/content/content";
import { bestForProductiveDays, score } from "@/lib/teaser/score";
import DraftShell from "../draft/DraftShell";
import { WORKING } from "../draft/drafts";

export const metadata: Metadata = {
  title: "Explore TeamQ · SAMUH",
  description: "Optimize your team, with science. Change what work is like for a demonstration team and watch their productive days move.",
};

// A production route. It borrows the working draft's shell until that draft
// is promoted to the root, at which point the shell moves and this page does
// not. The words come from the admin's content layer.
export default async function TeamQPage() {
  // scored here, on the server, so the page arrives with its numbers
  const baseline = score(BASELINE);
  const { values, levers, score: best } = bestForProductiveDays(OPTIMIZER_MOVES);
  const answer = { values, levers, days: best.days, mhq: best.mhq };
  const { teamq, global } = await getContent();
  return (
    <DraftShell draft={WORKING} content={global}>
      <TeamQIntro baseline={baseline} c={teamq} />
      <section className="L-sec teaser-sec" id="tool" aria-labelledby="tool-title">
        <div className="L-wrap">
          <h2 className="sec teaser-title" id="tool-title">
            {teamq.tool.title}
          </h2>
          <TeamQTeaser baseline={baseline} answer={answer} ask={teamq.ask} />
        </div>
      </section>
    </DraftShell>
  );
}
