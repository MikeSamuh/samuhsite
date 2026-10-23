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
          <h1 className="adm-title">Content</h1>
        </div>
        {kind === "file" ? <span className="adm-badge adm-badge-warn" title="Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN for the shared store">Local store</span> : null}
      </div>
      <div className="adm-pages">
        {SCHEMA.map((p, i) => (
          <Link key={p.id} href={`${ADMIN_BASE}/content/${p.id}`} className="adm-page-card">
            <span className="adm-page-name">{p.name}</span>
            <span className="adm-page-meta">
              {p.sections.length} sections{metas[i] ? ` · saved ${when(metas[i]!.updatedAt)}` : " · defaults"}
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
