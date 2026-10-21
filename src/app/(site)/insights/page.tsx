import type { Metadata } from "next";
import { InsightsFeed } from "@/components/insights/InsightsFeed";
import { toCard } from "@/components/insights/InsightCard";
import { publishedPosts } from "@/lib/insights";
import { getContent } from "@/lib/content/content";
import { ReportCard } from "@/app/layout/sections";
import { pageMeta } from "@/lib/seo";
import "@/components/insights/insights.css";

export async function generateMetadata(): Promise<Metadata> {
  const { insights } = await getContent();
  return pageMeta({ title: "Insights", description: insights.meta.description, path: "/insights" });
}

// Posts come from content/insights and the admin's Blog tab; the page is
// static and a save in the admin revalidates it.
export default async function InsightsPage() {
  const [posts, { insights, global }] = await Promise.all([publishedPosts(), getContent()]);
  const research = posts.filter((p) => p.type === "research");
  const feed = posts.filter((p) => p.type !== "research").map(toCard);
  return (
    <>
      <section className="L-sec L-page-head ins-head" data-n="01">
        <div className="L-wrap">
          <div className="L-head">
            <span className="L-n">01</span>
            <div>
              <p className="eyebrow L-eyebrow">{insights.head.kicker}</p>
              <h1 className="display L-page-title">{insights.head.title}</h1>
              {insights.head.lede ? <p className="lede">{insights.head.lede}</p> : null}
            </div>
          </div>
        </div>
      </section>
      {research.length ? ( // the MDX entry keeps the report in the feed data; the card itself is shared with the home page
        <section className="L-sec L-sec-h ins-research-sec" aria-labelledby="research-title">
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
    </>
  );
}
