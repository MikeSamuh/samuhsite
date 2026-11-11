import Link from "next/link";
import { CareersNote } from "@/components/careers/CareersNote";
import { openJobs } from "@/lib/admin/jobs";
import { formatDate } from "@/lib/insights";
import { pageMeta } from "@/lib/seo";
import { CAREERS_PATH } from "@/lib/site";
import "@/components/contact/contact.css";

export const metadata = pageMeta({
  title: "Careers",
  description: "Open roles at SAMUH, and how to get in touch if you would like to work with us.",
  path: CAREERS_PATH,
});

/** /careers (call of 6 Nov 2026): the open roles, newest first, posted from
 *  the admin's Careers tab. With none open the page says so and invites a
 *  note. Draft copy, Wilfred's to confirm with Jake. */
export default async function CareersPage() {
  const jobs = await openJobs();
  return (
    <>
      <section className="L-sec L-page-head" data-n="01">
        <div className="L-wrap">
          <div className="L-head">
            <span className="L-n">01</span>
            <div>
              <p className="eyebrow L-eyebrow">Careers</p>
              <h1 className="display L-page-title">Work with Samuh.</h1>
              <p className="lede">{jobs.length ? "The roles open now." : "There are no open roles right now."}</p>
            </div>
          </div>
        </div>
      </section>
      {jobs.length ? (
        <section className="L-sec L-sec-h" data-n="02" id="roles">
          <div className="L-wrap">
            <div className="L-head">
              <span className="L-n">02</span>
              <div>
                <p className="eyebrow L-eyebrow">Open roles</p>
                <h2 className="sec">{jobs.length === 1 ? "One role" : `${jobs.length} roles`}</h2>
              </div>
            </div>
            <ul className="L-offer">
              {jobs.map((j) => (
                <li key={j.slug}>
                  <Link className="L-offer-line" href={`${CAREERS_PATH}/${j.slug}`}>
                    <span className="L-offer-name">{j.title}</span>
                    <span className="L-mid">
                      {j.summary}
                      <span className="L-cap careers-meta">{[j.remote ? "Remote" : "", j.location, j.type, j.posted ? `Posted ${formatDate(j.posted)}` : ""].filter(Boolean).join(" · ")}</span>
                    </span>
                    <span className="arrow" aria-hidden>&rarr;</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : (
        <section className="L-sec L-sec-h" data-n="02" id="note">
          <div className="L-wrap">
            <div className="L-head">
              <span className="L-n">02</span>
              <div>
                <p className="eyebrow L-eyebrow">Collaborate</p>
                <h2 className="sec">Write to us</h2>
              </div>
            </div>
            <p className="L-mid">If you would like to collaborate with Samuh, send a note. A person reads it.</p>
            <CareersNote />
          </div>
        </section>
      )}
    </>
  );
}
