"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RichText } from "./RichText";
import { ADMIN_API, ADMIN_BASE } from "@/lib/admin/paths";

// the same lists as src/lib/admin/jobs.ts, which is server only
const TYPES = ["Full-time", "Part-time", "Contract", "Internship"] as const;

export interface JobDraft {
  slug: string;
  title: string;
  location: string;
  remote: boolean;
  type: (typeof TYPES)[number];
  summary: string;
  html: string;
  apply: string;
  status: "draft" | "open" | "closed";
  posted: string;
  closes: string;
}

function slugify(s: string): string {
  return s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[’'"]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

function when(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

/** One careers posting, the Blog editor's layout: the words on the left,
 *  status and details on the right. */
export function JobEditor({ mode, initial, meta }: { mode: "new" | "edit"; initial: JobDraft; meta?: { updatedAt: string; updatedBy: string } }) {
  const router = useRouter();
  const [job, setJob] = useState<JobDraft>(initial);
  const [saved, setSaved] = useState<JobDraft>(initial);
  const [slugTouched, setSlugTouched] = useState(mode !== "new");
  const [state, setState] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");
  const dirty = mode === "new" || JSON.stringify(job) !== JSON.stringify(saved);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = <K extends keyof JobDraft>(k: K, v: JobDraft[K]) => setJob((j) => ({ ...j, [k]: v }));
  const setTitle = (title: string) => setJob((j) => ({ ...j, title, slug: slugTouched ? j.slug : slugify(title) }));

  const save = async (status?: JobDraft["status"]) => {
    const body = { ...job, status: status ?? job.status };
    setState("saving");
    try {
      const isNew = mode === "new";
      const res = await fetch(isNew ? `${ADMIN_API}/jobs` : `${ADMIN_API}/jobs/${saved.slug}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not save");
      const next: JobDraft = { ...job, status: body.status, slug: data.job.slug, posted: data.job.posted };
      setJob(next);
      setSaved(next);
      setState("ok");
      setMessage(`Saved ${when(data.job.updatedAt)}.${body.status === "open" ? " Live at /careers." : ""}`);
      if (isNew || data.job.slug !== saved.slug) router.replace(`${ADMIN_BASE}/careers/${data.job.slug}`);
      router.refresh();
    } catch (e) {
      setState("error");
      setMessage(e instanceof Error ? e.message : "Could not save");
    }
  };

  const remove = async () => {
    if (!confirm("Delete this posting? Closing it takes it off the site and keeps it here.")) return;
    const res = await fetch(`${ADMIN_API}/jobs/${saved.slug}`, { method: "DELETE" });
    if (res.ok) router.push(`${ADMIN_BASE}/careers`);
  };

  return (
    <>
      <div className="adm-head">
        <div>
          <span className="adm-kicker">Careers</span>
          <h1 className="adm-title">{job.title || "Untitled"}</h1>
          <p className="adm-lede">{meta ? `Saved ${when(meta.updatedAt)} by ${meta.updatedBy}` : "New posting"}</p>
        </div>
        <div className="adm-actions">
          {saved.status === "open" && mode !== "new" ? <a className="adm-btn" href={`/careers/${saved.slug}`} target="_blank" rel="noopener noreferrer">Open the posting ↗</a> : null}
          {mode === "edit" ? <button type="button" className="adm-btn adm-btn-ghost adm-btn-danger" onClick={remove}>Delete</button> : null}
        </div>
      </div>

      <div className="adm-post">
        <div className="adm-stack">
          <div className="adm-field adm-post-title">
            <input type="text" value={job.title} onChange={(e) => setTitle(e.target.value)} placeholder="Role title" aria-label="Role title" />
          </div>
          <div className="adm-field">
            <label className="adm-label">Summary</label>
            <textarea value={job.summary} onChange={(e) => set("summary", e.target.value)} rows={2} placeholder="One or two sentences for the list and for link previews" />
          </div>
          <RichText value={job.html} onChange={(html) => set("html", html)} />
        </div>

        <aside className="adm-post-side">
          <div className="adm-card">
            <div className="adm-card-title">Status</div>
            <div className="adm-form">
              <div className="adm-field">
                <label className="adm-label">Status</label>
                <select value={job.status} onChange={(e) => set("status", e.target.value as JobDraft["status"])}>
                  <option value="draft">Draft, not on the site</option>
                  <option value="open">Open, on the site</option>
                  <option value="closed">Closed, off the site</option>
                </select>
              </div>
              <div className="adm-actions">
                <button type="button" className="adm-btn adm-btn-primary" onClick={() => save("open")} disabled={state === "saving" || !job.title}>{job.status === "open" ? "Update" : "Open the role"}</button>
                <button type="button" className="adm-btn" onClick={() => save()} disabled={state === "saving" || !job.title}>Save</button>
              </div>
              {message ? <p className={`adm-note${state === "error" ? " adm-note-error" : ""}`} role="status">{message}</p> : dirty && mode !== "new" ? <p className="adm-note">Unsaved changes</p> : null}
            </div>
          </div>

          <div className="adm-card">
            <div className="adm-card-title">Details</div>
            <div className="adm-form">
              <div className="adm-field">
                <label className="adm-label">How to apply</label>
                <input type="text" value={job.apply} onChange={(e) => set("apply", e.target.value.trim())} placeholder="name@samuh.org or https://…" className="adm-input-mono" />
                <span className="adm-help">An email address or an https link. Needed before the role opens. Nothing is uploaded or stored here.</span>
              </div>
              <div className="adm-field">
                <label className="adm-label">Location</label>
                <input type="text" value={job.location} onChange={(e) => set("location", e.target.value)} placeholder="New York, or the country for a remote role" />
                <label className="adm-help"><input type="checkbox" checked={job.remote} onChange={(e) => set("remote", e.target.checked)} /> Remote</label>
              </div>
              <div className="adm-field">
                <label className="adm-label">Type</label>
                <select value={job.type} onChange={(e) => set("type", e.target.value as JobDraft["type"])}>
                  {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="adm-field">
                <label className="adm-label">Posted</label>
                <input type="date" value={job.posted} onChange={(e) => set("posted", e.target.value)} />
                <span className="adm-help">Left empty, it is the day the role opens.</span>
              </div>
              <div className="adm-field">
                <label className="adm-label">Closes</label>
                <input type="date" value={job.closes} onChange={(e) => set("closes", e.target.value)} />
                <span className="adm-help">Optional. It does not close the role by itself: set the status to Closed.</span>
              </div>
              <div className="adm-field">
                <label className="adm-label">Address</label>
                <input type="text" value={job.slug} onChange={(e) => { setSlugTouched(true); set("slug", slugify(e.target.value)); }} className="adm-input-mono" />
                <span className="adm-help">/careers/{job.slug || "…"}{mode === "edit" && job.slug !== saved.slug ? ". Changing it breaks old links" : ""}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
