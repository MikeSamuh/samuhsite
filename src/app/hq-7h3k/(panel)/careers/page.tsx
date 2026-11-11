import Link from "next/link";
import { listJobs } from "@/lib/admin/jobs";
import { formatDate } from "@/lib/insights";
import { ADMIN_BASE } from "@/lib/admin/paths";

export default async function CareersIndex() {
  const jobs = await listJobs();
  const open = jobs.filter((j) => j.status === "open").length;
  return (
    <>
      <div className="adm-head">
        <div>
          <h1 className="adm-title">Careers</h1>
          <p className="adm-lede">{jobs.length} {jobs.length === 1 ? "posting" : "postings"}, {open} open. With none open, the page says so and invites a note.</p>
        </div>
        <div className="adm-actions">
          <a className="adm-btn" href="/careers" target="_blank" rel="noopener noreferrer">Careers ↗</a>
          <Link className="adm-btn adm-btn-primary" href={`${ADMIN_BASE}/careers/new`}>+ New posting</Link>
        </div>
      </div>
      <div className="adm-card" style={{ padding: "6px 12px" }}>
        <table className="adm-table">
          <thead>
            <tr><th>Role</th><th>Where</th><th>Type</th><th>Status</th><th>Posted</th></tr>
          </thead>
          <tbody>
            {jobs.length ? jobs.map((j) => (
              <tr key={j.slug}>
                <td>
                  <Link href={`${ADMIN_BASE}/careers/${j.slug}`}>{j.title || j.slug}</Link>
                  <div className="adm-mono adm-muted">/careers/{j.slug}</div>
                </td>
                <td>{[j.remote ? "Remote" : "", j.location].filter(Boolean).join(" · ") || "Not set"}</td>
                <td>{j.type}</td>
                <td><span className={`adm-badge${j.status === "open" ? " adm-badge-ok" : j.status === "closed" ? " adm-badge-warn" : ""}`}>{j.status}</span></td>
                <td className="adm-muted">{j.posted ? formatDate(j.posted) : "not yet"}</td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="adm-muted">No postings yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
