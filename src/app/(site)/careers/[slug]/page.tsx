import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RichBody } from "@/components/insights/RichBody";
import { JsonLd } from "@/components/site/JsonLd";
import { applyHref, getOpenJob, openJobs } from "@/lib/admin/jobs";
import { formatDate } from "@/lib/insights";
import { breadcrumbLd, jobLd, pageMeta } from "@/lib/seo";
import { CAREERS_PATH } from "@/lib/site";
import "@/components/insights/insights.css";

// Built at deploy for every open role; one opened in the admin after that
// renders on its first visit. Draft and closed roles are not found
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await openJobs()).map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const job = await getOpenJob(slug);
  if (!job) return {};
  return pageMeta({ title: `${job.title} · Careers`, description: job.summary || `${job.title} at SAMUH.`, path: `${CAREERS_PATH}/${job.slug}` });
}

export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await getOpenJob(slug);
  if (!job) notFound();
  const email = !job.apply.startsWith("https://");
  return (
    <>
      <JsonLd data={jobLd(job)} />
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Careers", path: CAREERS_PATH }, { name: job.title, path: `${CAREERS_PATH}/${job.slug}` }])} />
      <article>
        <section className="L-sec L-page-head ins-head ins-post-head">
          <div className="L-wrap">
            <div className="L-head">
              <div>
                <p className="eyebrow L-eyebrow">
                  <Link href={CAREERS_PATH} className="ins-crumb">Careers</Link>
                  <span aria-hidden> · </span>
                  {job.type}
                </p>
                <h1 className="display L-page-title">{job.title}</h1>
                {job.summary ? <p className="lede">{job.summary}</p> : null}
                <dl className="ins-meta">
                  <div><dt>Where</dt><dd>{[job.remote ? "Remote" : "", job.location].filter(Boolean).join(" · ") || "To be agreed"}</dd></div>
                  <div><dt>Type</dt><dd>{job.type}</dd></div>
                  {job.posted ? <div><dt>Posted</dt><dd><time dateTime={job.posted}>{formatDate(job.posted)}</time></dd></div> : null}
                  {job.closes ? <div><dt>Closes</dt><dd><time dateTime={job.closes}>{formatDate(job.closes)}</time></dd></div> : null}
                </dl>
              </div>
            </div>
          </div>
        </section>
        <section className="L-sec ins-body-sec">
          <div className="L-wrap L-wrap-narrow ins-body">
            <RichBody html={job.html} />
            <h2 className="sec">How to apply</h2>
            <p>
              {email ? "Write to " : null}
              <a className="inline-link" href={applyHref(job.apply)} {...(email ? {} : { target: "_blank", rel: "noopener noreferrer" })}>
                {email ? job.apply : <>Apply for this role <span className="arrow">&rarr;</span></>}
              </a>
              {email ? "." : null}
            </p>
            <p className="ins-back"><Link href={CAREERS_PATH} className="inline-link">All open roles <span className="arrow">&rarr;</span></Link></p>
          </div>
        </section>
      </article>
    </>
  );
}
