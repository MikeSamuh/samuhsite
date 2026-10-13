import type { Metadata } from "next";
import { InsightsFeed } from "@/components/insights/InsightsFeed";
import { toCard } from "@/components/insights/InsightCard";
import { publishedPosts } from "@/lib/insights";
import DraftShell from "../draft/DraftShell";
import { ReportCard } from "../layout/sections";
import { WORKING } from "../draft/drafts";
import "@/components/insights/insights.css";

export const metadata: Metadata = {
  title: "Insights · SAMUH",
  description: "Perspectives based on cutting-edge research, and guided by timeless wisdom. Video, articles and research from SAMUH, in partnership with Sapien Labs.",
};

export const dynamic = "force-static";

// A production route. It borrows the working draft's shell until that draft
// is promoted to the root, at which point the shell moves and this page does
// not. Content comes from content/insights at build time.
export default function InsightsPage() {
  const posts = publishedPosts();
  const research = posts.filter((p) => p.type === "research");
  const feed = posts.filter((p) => p.type !== "research").map(toCard);
  return (
    <DraftShell draft={WORKING}>
      {research.length ? ( // the MDX entry keeps the report in the feed data; the card itself is shared with the home page
        <section className="L-sec L-sec-h ins-research-sec ins-first" aria-labelledby="research-title">
          <div className="L-wrap">
            <div className="L-head">
              <div>
                <p className="eyebrow L-eyebrow">Research</p>
                <h2 className="sec" id="research-title">The research we build on.</h2>
              </div>
            </div>
            <ReportCard />
          </div>
        </section>
      ) : null}

      <section className="L-sec L-sec-h ins-feed-sec" aria-labelledby="feed-title">
        <div className="L-wrap">
          <div className="L-head">
            <div>
              <p className="eyebrow L-eyebrow">The feed</p>
              <h2 className="sec" id="feed-title">Video and articles.</h2>
            </div>
          </div>
          <InsightsFeed posts={feed} />
        </div>
      </section>
    </DraftShell>
  );
}
