import type { Metadata } from "next";
import { InsightsFeed } from "@/components/insights/InsightsFeed";
import { toCard } from "@/components/insights/InsightCard";
import { publishedPosts } from "@/lib/insights";
import DraftShell from "../draft/DraftShell";
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
      <section className="L-sec L-page-head ins-head">
        <div className="L-wrap">
          <div className="L-head">
            <div>
              <p className="eyebrow L-eyebrow">Insights</p>
              <h1 className="display L-page-title">Perspectives based on cutting-edge research, and guided by timeless wisdom.</h1>
              <p className="lede">Video, articles and research on how teams perform, from Rahul Varma and SAMUH, in partnership with Sapien Labs.</p>
            </div>
          </div>
        </div>
      </section>

      {research.length ? (
        <section className="L-sec L-sec-h ins-research-sec" aria-labelledby="research-title">
          <div className="L-wrap">
            <div className="L-head">
              <div>
                <p className="eyebrow L-eyebrow">Research</p>
                <h2 className="sec" id="research-title">The research we build on.</h2>
              </div>
            </div>
            <div className="ins-research">
              {research.map((r) => (
                <a key={r.slug} className="card ins-research-card" href={r.externalUrl} target="_blank" rel="noopener noreferrer">
                  <span className="card-tag">Research · in partnership with Sapien Labs</span>
                  <h3 className="ins-card-title">{r.title}</h3>
                  <p className="ins-card-stand">{r.summary}</p>
                  <span className="inline-link">Read the report on sapienlabs.org <span className="arrow">&rarr;</span></span>
                </a>
              ))}
            </div>
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
