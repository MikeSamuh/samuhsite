import Link from "next/link";
import { SCHEMA } from "@/lib/content/schema";
import { contentMeta } from "@/lib/content/content";
import { storeKind } from "@/lib/admin/store";
import { ADMIN_BASE } from "@/lib/admin/paths";

function when(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default async function ContentIndex() {
  const metas = await Promise.all(SCHEMA.map((p) => contentMeta(p.id)));
  const kind = storeKind();
  return (
    <>
      <div className="adm-head">
        <div>
          <span className="adm-kicker">Content</span>
          <h1 className="adm-title">Every page, in words</h1>
          <p className="adm-lede">Pick a page. Each one is split into its sections, and every line on it is a field. Save and the site updates.</p>
        </div>
        {kind === "file" ? <span className="adm-badge adm-badge-warn" title="Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN for the shared store">Saving to this machine only</span> : null}
      </div>
      <div className="adm-pages">
        {SCHEMA.map((p, i) => (
          <Link key={p.id} href={`${ADMIN_BASE}/content/${p.id}`} className="adm-page-card">
            <span className="adm-page-name">{p.name}</span>
            <span className="adm-page-note">{p.note}</span>
            <span className="adm-page-meta">
              {p.sections.length} sections{metas[i] ? ` · saved ${when(metas[i]!.updatedAt)}` : " · defaults"}
            </span>
          </Link>
        ))}
      </div>
      <div className="adm-section">
        <h2 className="adm-section-title">How the markers work</h2>
        <div className="adm-card">
          <p>Some fields take two markers, and nothing else. <span className="adm-code">*words*</span> colours the words in the pink. <span className="adm-code">~words~</span> colours them in the cyan. The field says so where it applies.</p>
          <p className="adm-note" style={{ marginTop: 10 }}>Rules carried from the brief: no figures SAMUH has not supplied in writing, no em dashes, teams stay the subject, and a multi-team organization, never an enterprise.</p>
        </div>
      </div>
    </>
  );
}
