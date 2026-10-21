import Link from "next/link";
import { listStoredPosts } from "@/lib/admin/posts";
import { filePosts, formatDate } from "@/lib/insights";
import { ADMIN_BASE } from "@/lib/admin/paths";

export default async function BlogIndex() {
  const stored = await listStoredPosts();
  const storedSlugs = new Set(stored.map((p) => p.slug));
  const files = filePosts().filter((p) => !storedSlugs.has(p.slug));
  const rows = [
    ...stored.map((p) => ({ slug: p.slug, title: p.title, type: p.type, status: p.status, date: p.date, episode: p.episode, where: "admin" as const, updatedAt: p.updatedAt })),
    ...files.map((p) => ({ slug: p.slug, title: p.title, type: p.type, status: p.status, date: p.date, episode: p.episode, where: "file" as const, updatedAt: "" })),
  ].sort((a, b) => (b.date || "").localeCompare(a.date || "") || (b.episode ?? 0) - (a.episode ?? 0));
  const published = rows.filter((r) => r.status === "published").length;
  return (
    <>
      <div className="adm-head">
        <div>
          <span className="adm-kicker">Blog</span>
          <h1 className="adm-title">Insights</h1>
          <p className="adm-lede">{rows.length} posts, {published} live at /insights. Open one to edit it, or write a new one. Drafts and posts in review never show on the site.</p>
        </div>
        <div className="adm-actions">
          <a className="adm-btn" href="/insights" target="_blank" rel="noopener noreferrer">Open Insights ↗</a>
          <Link className="adm-btn adm-btn-primary" href={`${ADMIN_BASE}/blog/new`}>+ New post</Link>
        </div>
      </div>
      <div className="adm-card" style={{ padding: "6px 12px" }}>
        <table className="adm-table">
          <thead>
            <tr><th>Title</th><th>Kind</th><th>Status</th><th>Date</th><th>Source</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.slug}>
                <td>
                  <Link href={`${ADMIN_BASE}/blog/${r.slug}`}>{r.title || r.slug}</Link>
                  <div className="adm-mono adm-muted">/insights/{r.slug}</div>
                </td>
                <td>{r.type === "video" ? `Video${r.episode ? ` · ep. ${r.episode}` : ""}` : r.type === "research" ? "Research" : "Article"}</td>
                <td><span className={`adm-badge${r.status === "published" ? " adm-badge-ok" : r.status === "review" ? " adm-badge-warn" : ""}`}>{r.status}</span></td>
                <td className="adm-muted">{r.date ? formatDate(r.date) : "no date"}</td>
                <td className="adm-muted">{r.where === "admin" ? "Admin" : "Repo file"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
