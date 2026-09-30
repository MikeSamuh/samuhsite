"use client";

import { useCallback, useEffect, useState } from "react";
import type { Note } from "@/lib/notes";
import { DRAFTS, draftBase, type DraftId } from "./drafts";

/** The notes API, shared by the widget on a draft and the list on /draft. */
export function useNotes(draft: DraftId) {
  const [notes, setNotes] = useState<Note[] | null>(null);
  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/notes?draft=${draft}`, { cache: "no-store" });
      setNotes(res.ok ? await res.json() : []);
    } catch {
      setNotes([]);
    }
  }, [draft]);
  useEffect(() => { load(); }, [load]);
  const add = async (text: string, page: string) => {
    const res = await fetch("/api/notes", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ draft, page, text }) });
    if (res.ok) { const n = (await res.json()) as Note; setNotes((xs) => [n, ...(xs ?? [])]); return true; }
    return false;
  };
  const mark = async (id: string, done: boolean) => {
    setNotes((xs) => (xs ?? []).map((n) => (n.id === id ? { ...n, done } : n)));
    const res = await fetch("/api/notes", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id, done }) });
    if (!res.ok) load();
  };
  return { notes, add, mark, reload: load };
}

const when = (iso: string) => new Date(iso).toLocaleString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

/** One draft's notes, newest first, each with its checkbox. */
export function NotesList({ draft, notes, mark }: { draft: DraftId; notes: Note[] | null; mark: (id: string, done: boolean) => void }) {
  if (notes === null) return <p className="N-empty L-cap">Loading&hellip;</p>;
  if (!notes.length) return <p className="N-empty L-cap">No notes on draft {draft.toUpperCase()} yet.</p>;
  return (
    <ul className="N-list">
      {notes.map((n) => (
        <li key={n.id} className="N-item" data-done={n.done || undefined}>
          <label className="N-check">
            <input type="checkbox" checked={n.done} onChange={(e) => mark(n.id, e.target.checked)} aria-label={n.done ? "Mark as open" : "Mark as complete"} />
            <span aria-hidden />
          </label>
          <div className="N-body">
            <p className="N-text">{n.text}</p>
            <span className="L-cap N-meta">
              {when(n.at)}
              {n.page ? <> &middot; {n.page.replace(draftBase(draft), "") || "home"}</> : null}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

/**
 * The Notes button that floats at the bottom right of every draft page.
 * Click it and it opens: the draft's name, a box for the note, submit, and
 * the notes already left on this draft with their checkboxes. Stored
 * through /api/notes, so they show on /draft too.
 */
export default function Notes({ draft, page }: { draft: DraftId; page: string }) {
  const d = DRAFTS.find((x) => x.id === draft);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const { notes, add, mark } = useNotes(draft);
  const openCount = notes?.filter((n) => !n.done).length ?? 0;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || busy) return;
    setBusy(true);
    if (await add(text, page)) setText("");
    setBusy(false);
  };

  return (
    <div className="N-root" data-open={open || undefined}>
      {open ? (
        <section className="N-panel" role="dialog" aria-label={`Notes on draft ${d?.letter ?? draft}`}>
          <header className="N-head">
            <div>
              <span className="L-cap">Notes &middot; draft {d?.letter ?? draft.toUpperCase()}</span>
              <h2 className="N-title">{d?.name ?? "Draft"}</h2>
            </div>
            <button className="N-close" onClick={() => setOpen(false)} aria-label="Close notes">&times;</button>
          </header>
          <form className="N-form" onSubmit={submit}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="What should change on this page?"
              aria-label="Your note"
              autoFocus
            />
            <div className="N-form-row">
              <span className="L-cap">{page.replace(draftBase(draft), "") || "home"}</span>
              <button className="btn btn-small" type="submit" disabled={busy || !text.trim()}>{busy ? "Saving…" : "Submit"}</button>
            </div>
          </form>
          <NotesList draft={draft} notes={notes} mark={mark} />
        </section>
      ) : null}
      <button className="N-fab" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Notes">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden><path d="M5 4h11l3 3v13H5z M8 10h8 M8 14h6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" /></svg>
        <span>Notes</span>
        {openCount ? <b className="N-count">{openCount}</b> : null}
      </button>
    </div>
  );
}
