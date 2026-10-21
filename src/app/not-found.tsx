import type { Metadata } from "next";
import Link from "next/link";
import { getPageContent } from "@/lib/content/content";
import { SiteShell } from "@/components/site/SiteShell";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

/** The 404, in the site's shell. Next renders it outside the (site) group,
 *  so the shell is wrapped here. */
export default async function NotFound() {
  const global = await getPageContent("global");
  return (
    <SiteShell content={global}>
      <section className="L-sec L-page-head" data-n="404">
        <div className="L-wrap">
          <div className="L-head">
            <span className="L-n">404</span>
            <div>
              <p className="eyebrow L-eyebrow">Not found</p>
              <h1 className="display L-page-title">That page is not here.</h1>
              <p className="lede">The address may have changed. Everything on the site is one of these.</p>
              <div className="cta-row">
                <Link className="btn" href={ROUTES.home}>Home <span className="arrow">&rarr;</span></Link>
                <Link className="btn btn-secondary" href={ROUTES.insights}>Insights</Link>
                <Link className="btn btn-secondary" href={ROUTES.contact}>Contact</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
