import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InsightCard, toCard } from "@/components/insights/InsightCard";
import { Markdown } from "@/components/insights/Markdown";
import { RichBody } from "@/components/insights/RichBody";
import { YouTube } from "@/components/insights/YouTube";
import { formatDate, getPost, neighbours, publishedPosts, relatedPosts, timeLabel, transcriptText } from "@/lib/insights";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbLd, pageMeta, postLd } from "@/lib/seo";
import "@/components/insights/insights.css";

// Built at deploy for every published post; a post published in the admin
// after that renders on its first visit and is cached until the next save
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await publishedPosts()).filter((p) => p.type !== "research").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return pageMeta({
    title: post.title,
    description: post.summary,
    path: `/insights/${post.slug}`,
    image: post.cover,
    article: { publishedTime: post.date, authors: [post.author] },
  });
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post || post.type === "research") notFound();
  const kind = post.type === "video" ? "Video" : "Article";
  const transcript = transcriptText(post);
  const related = (await relatedPosts(post)).map(toCard);
  const { prev, next } = await neighbours(post);
  const time = timeLabel(post);
  return (
    <>
      <JsonLd data={postLd(post)} />
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Insights", path: "/insights" }, { name: post.title, path: `/insights/${post.slug}` }])} />
      <article>
        <section className="L-sec L-page-head ins-head ins-post-head">
          <div className="L-wrap">
            <div className="L-head">
              <div>
                <p className="eyebrow L-eyebrow">
                  <Link href="/insights" className="ins-crumb">Insights</Link>
                  <span aria-hidden> · </span>
                  {kind}{post.episode ? ` · Episode ${post.episode}` : ""}
                </p>
                <h1 className="display L-page-title">{post.title}</h1>
                <p className="lede">{post.summary}</p>
                <dl className="ins-meta">
                  <div><dt>By</dt><dd>{post.author}</dd></div>
                  <div><dt>Date</dt><dd><time dateTime={post.date}>{formatDate(post.date)}</time></dd></div>
                  {time ? <div><dt>Time</dt><dd>{time}</dd></div> : null}
                  <div>
                    <dt>Topics</dt>
                    <dd>{post.tags.join(", ")}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section className="L-sec ins-body-sec">
          <div className="L-wrap L-wrap-narrow ins-body">
            {post.type === "video" && post.videoId ? <YouTube id={post.videoId} title={post.title} cover={post.cover} /> : null}
            {post.html !== undefined ? <RichBody html={post.html} /> : <Markdown source={post.body} skip={["Transcript"]} />}
            {transcript ? (
              <details className="ins-transcript">
                <summary>Transcript</summary>
                <p className="L-cap ins-transcript-note">As spoken, lightly cleaned for filler words. Meaning unchanged.</p>
                {transcript.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
              </details>
            ) : null}
            {post.videoUrl ? (
              <p className="ins-source">
                <a className="inline-link" href={post.videoUrl} target="_blank" rel="noopener noreferrer">Watch on YouTube <span className="arrow">&rarr;</span></a>
              </p>
            ) : null}
            {prev || next ? (
              <nav className="ins-neighbours" aria-label="Episodes">
                {prev ? <Link href={`/insights/${prev.slug}`} className="ins-neighbour"><span className="L-cap">Previous · Episode {prev.episode}</span><span>{prev.title}</span></Link> : <span />}
                {next ? <Link href={`/insights/${next.slug}`} className="ins-neighbour ins-neighbour-next"><span className="L-cap">Next · Episode {next.episode}</span><span>{next.title}</span></Link> : null}
              </nav>
            ) : null}
          </div>
        </section>

        {related.length ? (
          <section className="L-sec L-sec-h ins-related-sec" aria-labelledby="related-title">
            <div className="L-wrap">
              <div className="L-head">
                <div>
                  <p className="eyebrow L-eyebrow">Related</p>
                  <h2 className="sec" id="related-title">Keep going.</h2>
                </div>
              </div>
              <div className="ins-feed">
                {related.map((p) => <InsightCard key={p.slug} post={p} />)}
              </div>
              <p className="ins-back"><Link href="/insights" className="inline-link">All insights <span className="arrow">&rarr;</span></Link></p>
            </div>
          </section>
        ) : null}
      </article>
    </>
  );
}
