import Link from "next/link";
import { LANDING } from "@/lib/landing";

export const dynamic = "force-dynamic";

function when(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/** The landing pages: standalone, unlinked, for campaigns and experiments.
 *  Each card opens its editor where it has one, with a link to the page
 *  itself. New ones are added in src/lib/landing.ts. */
export default function LandingIndex() {
  return (
    <>
      <div className="adm-head">
        <div>
          <h1 className="adm-title">Landing pages</h1>
          <p className="adm-lede">Standalone pages that are not in the nav, the footer or the sitemap, and ask crawlers to stay out. Share the link directly.</p>
        </div>
      </div>
      <div className="adm-pages">
        {LANDING.map((l) => (
          <Link key={l.id} href={l.admin ?? l.path} className="adm-page-card">
            <span className="adm-page-name">{l.name}</span>
            <span className="adm-note">{l.note}</span>
            <span className="adm-page-meta">
              {l.path} · added {when(l.added)}
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
