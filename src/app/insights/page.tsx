import type { Metadata } from "next";
import { InsightsFeed } from "@/components/insights/InsightsFeed";
import { toCard } from "@/components/insights/InsightCard";
import { publishedPosts } from "@/lib/insights";
import { getContent } from "@/lib/content/content";
import DraftShell from "../draft/DraftShell";
import { ReportCard } from "../layout/sections";
import { WORKING } from "../draft/drafts";
import "@/components/insights/insights.css";

export async function generateMetadata(): Promise<Metadata> {
  const { insights } = await getContent();
  return {
    title: "Insights · SAMUH",
    description: insights.meta.description,
  };
}

// A production route. It borrows the working draft's shell until that draft
// is promoted to the root, at which point the shell moves and this page does
// not. Posts come from content/insights and the admin's Blog tab; the page
// is static and a save in the admin revalidates it.
export default async function InsightsPage() {
  const [posts, { insights, global }] = await Promise.all([publishedPosts(), getContent()]);
  const research = posts.filter((p) => p.type === "research");
  const feed = posts.filter((p) => p.type !== "research").map(toCard);
  return (
    <DraftShell draft={WORKING} content={global}>
      {research.length ? ( // the MDX entry keeps the report in the feed data; the card itself is shared with the home page
        <section className="L-sec L-sec-h ins-research-sec ins-first" aria-labelledby="research-title">
          <div className="L-wrap">
            <div className="L-head">
              <div>
                <p className="eyebrow L-eyebrow">{insights.research.eyebrow}</p>
                <h2 className="sec" id="research-title">{insights.research.title}</h2>
              </div>
            </div>
            <ReportCard report={global.report} />
          </div>
        </section>
      ) : null}

      <section className="L-sec L-sec-h ins-feed-sec" aria-labelledby="feed-title">
        <div className="L-wrap">
          <div className="L-head">
            <div>
              <p className="eyebrow L-eyebrow">{insights.feed.eyebrow}</p>
              <h2 className="sec" id="feed-title">{insights.feed.title}</h2>
            </div>
          </div>
          <InsightsFeed posts={feed} />
        </div>
      </section>
    </DraftShell>
  );
}
