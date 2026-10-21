"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TOPICS, type Topic } from "@/lib/insights-shared";
import { ImageField } from "./ImageField";
import { RichText } from "./RichText";
import { ADMIN_API, ADMIN_BASE } from "@/lib/admin/paths";

export interface PostDraft {
  slug: string;
  title: string;
  type: "article" | "video";
  status: "published" | "review" | "draft";
  date: string;
  author: string;
  summary: string;
  tags: Topic[];
  cover: string;
  videoUrl: string;
  duration: string;
  readTime: string;
  episode?: string;
  transcript?: string;
  html: string;
}

type Mode = "new" | "edit" | "file";

function slugify(s: string): string {
  return s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[’'"]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

function when(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function PostEditor({ mode, initial, meta }: { mode: Mode; initial: PostDraft; meta?: { createdAt: string; updatedAt: string; updatedBy: string; from: "admin" } }) {
  const router = useRouter();
  const [post, setPost] = useState<PostDraft>(initial);
  const [saved, setSaved] = useState<PostDraft>(initial);
  const [slugTouched, setSlugTouched] = useState(mode !== "new");
  const [state, setState] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");
  const dirty = mode === "new" || JSON.stringify(post) !== JSON.stringify(saved);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = <K extends keyof PostDraft>(k: K, v: PostDraft[K]) => setPost((p) => ({ ...p, [k]: v }));
  const setTitle = (title: string) => setPost((p) => ({ ...p, title, slug: slugTouched ? p.slug : slugify(title) }));
  const toggleTag = (t: Topic) => set("tags", post.tags.includes(t) ? post.tags.filter((x) => x !== t) : [...post.tags, t]);

  const save = async (status?: PostDraft["status"]) => {
    const body = { ...post, status: status ?? post.status, episode: post.episode ? Number(post.episode) : undefined };
    setState("saving");
    try {
      const isNew = mode === "new";
      const res = await fetch(isNew ? `${ADMIN_API}/posts` : `${ADMIN_API}/posts/${saved.slug}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not save");
      const next = { ...post, status: body.status, slug: data.post.slug };
      setPost(next);
      setSaved(next);
      setState("ok");
      setMessage(`Saved ${when(data.post.updatedAt)}.${body.status === "published" ? " Live at /insights." : ""}`);
      if (isNew || data.post.slug !== saved.slug) router.replace(`${ADMIN_BASE}/blog/${data.post.slug}`);
      router.refresh();
    } catch (e) {
      setState("error");
      setMessage(e instanceof Error ? e.message : "Could not save");
    }
  };

  const remove = async () => {
    const q = mode === "file" ? "Nothing to delete: this post is a file in the repo." : "Delete this post? If it came from a file in the repo, the file shows again.";
    if (mode === "file") { alert(q); return; }
    if (!confirm(q)) return;
    const res = await fetch(`${ADMIN_API}/posts/${saved.slug}`, { method: "DELETE" });
    if (res.ok) router.push(`${ADMIN_BASE}/blog`);
  };

  return (
    <>
      <div className="adm-head">
        <div>
          <span className="adm-kicker">Blog · {mode === "new" ? "New post" : "Edit"}</span>
          <h1 className="adm-title">{post.title || "Untitled"}</h1>
          <p className="adm-lede">
            {mode === "file" ? "This post is a file in the repo. Saving here makes a copy the admin owns, and the site shows that copy from then on." : meta ? `Last saved ${when(meta.updatedAt)} by ${meta.updatedBy}.` : "Give it a title, write, then publish."}
          </p>
        </div>
        <div className="adm-actions">
          {post.status === "published" && mode !== "new" ? <a className="adm-btn" href={`/insights/${saved.slug}`} target="_blank" rel="noopener noreferrer">Open the post ↗</a> : null}
          {mode === "edit" ? <button type="button" className="adm-btn adm-btn-ghost adm-btn-danger" onClick={remove}>Delete</button> : null}
        </div>
      </div>

      <div className="adm-post">
        <div className="adm-stack">
          <div className="adm-field adm-post-title">
            <input type="text" value={post.title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" aria-label="Title" />
          </div>
          <div className="adm-field">
            <label className="adm-label">Summary</label>
            <textarea value={post.summary} onChange={(e) => set("summary", e.target.value)} rows={2} placeholder="One or two sentences for the card and for link previews" />
          </div>
          {post.type === "video" ? (
            <div className="adm-card">
              <div className="adm-card-title">The video</div>
              <div className="adm-card-note">The player sits at the top of the post. The body below is the summary, key points and anything else.</div>
              <div className="adm-row">
                <div className="adm-field">
                  <label className="adm-label">YouTube URL</label>
                  <input type="url" value={post.videoUrl} onChange={(e) => set("videoUrl", e.target.value)} placeholder="https://www.youtube.com/watch?v=…" className="adm-input-mono" />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Length</label>
                  <input type="text" value={post.duration} onChange={(e) => set("duration", e.target.value)} placeholder="3:15" />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Episode number</label>
                  <input type="number" min={1} value={post.episode ?? ""} onChange={(e) => set("episode", e.target.value)} placeholder="19" />
                </div>
              </div>
            </div>
          ) : null}
          <RichText value={post.html} onChange={(html) => set("html", html)} />
        </div>

        <aside className="adm-post-side">
          <div className="adm-card">
            <div className="adm-card-title">Publish</div>
            <div className="adm-form">
              <div className="adm-field">
                <label className="adm-label">Status</label>
                <select value={post.status} onChange={(e) => set("status", e.target.value as PostDraft["status"])}>
                  <option value="draft">Draft, not on the site</option>
                  <option value="review">In review, not on the site</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="adm-field">
                <label className="adm-label">Date</label>
                <input type="date" value={post.date} onChange={(e) => set("date", e.target.value)} />
                <span className="adm-help">Needed before it shows. Newest first on the feed.</span>
              </div>
              <div className="adm-field">
                <label className="adm-label">Kind</label>
                <select value={post.type} onChange={(e) => set("type", e.target.value as PostDraft["type"])}>
                  <option value="article">Article</option>
                  <option value="video">Video</option>
                </select>
              </div>
              <div className="adm-actions">
                <button type="button" className="adm-btn adm-btn-primary" onClick={() => save("published")} disabled={state === "saving" || !post.title}>{post.status === "published" ? "Update" : "Publish"}</button>
                <button type="button" className="adm-btn" onClick={() => save(post.status === "published" ? "published" : post.status)} disabled={state === "saving" || !post.title}>Save</button>
              </div>
              {message ? <p className={`adm-note${state === "error" ? " adm-note-error" : ""}`} role="status">{message}</p> : dirty && mode !== "new" ? <p className="adm-note">Unsaved changes</p> : null}
            </div>
          </div>

          <div className="adm-card">
            <div className="adm-card-title">Details</div>
            <div className="adm-form">
              <div className="adm-field">
                <label className="adm-label">Author</label>
                <input type="text" value={post.author} onChange={(e) => set("author", e.target.value)} />
              </div>
              <div className="adm-field">
                <label className="adm-label">Topics</label>
                <div className="adm-tags">
                  {TOPICS.map((t) => (
                    <button type="button" key={t} className="adm-tag" data-on={post.tags.includes(t)} onClick={() => toggleTag(t)} aria-pressed={post.tags.includes(t)}>{t}</button>
                  ))}
                </div>
              </div>
              {post.type !== "video" ? (
                <div className="adm-field">
                  <label className="adm-label">Read time</label>
                  <input type="text" value={post.readTime} onChange={(e) => set("readTime", e.target.value)} placeholder="4 min" />
                </div>
              ) : null}
              <div className="adm-field">
                <label className="adm-label">Cover image</label>
                <ImageField value={post.cover} onChange={(v) => set("cover", v)} folder="insights" />
                <span className="adm-help">16:9 works best. For a video, YouTube&rsquo;s still is fine.</span>
              </div>
              <div className="adm-field">
                <label className="adm-label">Address</label>
                <input type="text" value={post.slug} onChange={(e) => { setSlugTouched(true); set("slug", slugify(e.target.value)); }} className="adm-input-mono" />
                <span className="adm-help">/insights/{post.slug || "…"}{mode === "edit" && post.slug !== saved.slug ? ". Changing it breaks old links" : ""}</span>
              </div>
              {post.transcript ? <p className="adm-note">Transcript: {post.transcript}, kept under the video.</p> : null}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
