import type { Metadata } from "next";
import { BASELINE } from "@/components/teamq-teaser/model";
import { TeamQIntro } from "@/components/teamq-teaser/TeamQIntro";
import { TeamQTeaser } from "@/components/teamq-teaser/TeamQTeaser";
import { score } from "@/lib/teaser/score";
import DraftShell from "../draft/DraftShell";

export const metadata: Metadata = {
  title: "Explore TeamQ · SAMUH",
  description: "See how TeamQ thinks. Change what work is like for a demonstration team and watch their productive days move.",
};

// A production route. It borrows Draft B's shell until Draft B is promoted to
// the root, at which point the shell moves and this page does not.
export default function TeamQPage() {
  // scored here, on the server, so the page arrives with its numbers
  const baseline = score(BASELINE);
  return (
    <DraftShell draft="b">
      <TeamQIntro />
      <section className="L-sec teaser-sec" id="tool" aria-label="The TeamQ demonstration">
        <div className="L-wrap">
          <TeamQTeaser baseline={baseline} />
        </div>
      </section>
    </DraftShell>
  );
}
