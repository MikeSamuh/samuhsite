"use client";

import { useMemo, useState } from "react";
import { ADMIN_API, ADMIN_BASE } from "@/lib/admin/paths";
import { OWNERS, type CustomItem, type LaunchGroup, type LaunchItem, type LaunchState, type Owner } from "@/lib/admin/launch-list";

// The go-live board. Every tick and note posts straight to the API; there
// is no save button, because two people may be on it at once and a stale
// save would undo the other's ticks. The server answers with the whole
// state, which replaces ours.

type Row = LaunchItem & { custom?: boolean };

function when(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

function isDone(item: Row, state: LaunchState): boolean {
  return state.items[item.id]?.done ?? item.done ?? false;
}

export function LaunchChecklist({ groups, initial }: { groups: LaunchGroup[]; initial: LaunchState }) {
  const [state, setState] = useState<LaunchState>(initial);
  const [hideDone, setHideDone] = useState(false);
  const [owner, setOwner] = useState<Owner | "all">("all");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const rows = useMemo(() => {
    const byGroup = new Map<string, Row[]>();
    for (const g of groups) {
      const custom: Row[] = state.custom.filter((c) => c.group === g.id).map((c) => ({ ...c, custom: true }));
      byGroup.set(g.id, [...g.items, ...custom]);
    }
    return byGroup;
  }, [groups, state.custom]);

  const all = useMemo(() => Array.from(rows.values()).flat(), [rows]);
  const total = all.length;
  const done = all.filter((i) => isDone(i, state)).length;
  const remainingByOwner = OWNERS.map((o) => [o, all.filter((i) => i.owner === o && !isDone(i, state)).length] as const).filter(([, n]) => n > 0);

  async function call(method: "PATCH" | "POST" | "DELETE", body?: unknown, query?: string) {
    setError(null);
    const res = await fetch(`${ADMIN_API}/launch${query ?? ""}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = (await res.json().catch(() => ({}))) as Partial<LaunchState> & { error?: string };
    if (!res.ok) throw new Error(json.error ?? "Could not save");
    setState({ items: json.items ?? {}, custom: json.custom ?? [] });
  }

  async function toggle(item: Row) {
    const next = !isDone(item, state);
    // optimistic, so the tick lands at once
    setState((s) => ({ ...s, items: { ...s.items, [item.id]: { ...(s.items[item.id] ?? { by: "", at: new Date().toISOString() }), done: next } } }));
    setBusy(item.id);
    try {
      await call("PATCH", { id: item.id, done: next });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save");
      setState((s) => ({ ...s, items: { ...s.items, [item.id]: { ...(s.items[item.id] ?? { by: "", at: new Date().toISOString() }), done: !next } } }));
    } finally {
      setBusy(null);
    }
  }

  async function note(item: Row, text: string) {
    const prev = state.items[item.id]?.note ?? "";
    if (text.trim() === prev.trim()) return;
    setBusy(item.id);
    try {
      await call("PATCH", { id: item.id, note: text });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save");
    } finally {
      setBusy(null);
    }
  }

  async function remove(item: CustomItem) {
    if (!confirm(`Remove "${item.title}"?`)) return;
    setBusy(item.id);
    try {
      await call("DELETE", undefined, `?id=${encodeURIComponent(item.id)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not remove");
    } finally {
      setBusy(null);
    }
  }

  async function add(group: string, input: { title: string; detail: string; owner: Owner }) {
    setBusy(group);
    try {
      await call("POST", { group, ...input });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not add");
      throw e;
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="adm-launch">
      <div className="adm-tiles adm-launch-tiles">
        <div className="adm-tile">
          <span className="adm-tile-k">Done</span>
          <span className="adm-tile-v">{done} <span className="adm-launch-of">of {total}</span></span>
          <div className="adm-bar-track" aria-hidden><div className="adm-bar-fill" style={{ width: `${total ? Math.round((done / total) * 100) : 0}%` }} /></div>
        </div>
        <div className="adm-tile adm-launch-owners">
          <span className="adm-tile-k">Still open, by owner</span>
          <div className="adm-launch-chips">
            <button type="button" className="adm-launch-chip" aria-pressed={owner === "all"} onClick={() => setOwner("all")}>Everyone <b>{total - done}</b></button>
            {remainingByOwner.map(([o, n]) => (
              <button key={o} type="button" className="adm-launch-chip" aria-pressed={owner === o} onClick={() => setOwner(owner === o ? "all" : o)}>{o} <b>{n}</b></button>
            ))}
          </div>
        </div>
      </div>

      <div className="adm-launch-tools">
        <label className="adm-check"><input type="checkbox" checked={hideDone} onChange={(e) => setHideDone(e.target.checked)} /> Hide what is done</label>
        {error ? <span className="adm-note adm-note-error" role="alert">{error}</span> : null}
      </div>

      {groups.map((g) => {
        const items = (rows.get(g.id) ?? []).filter((i) => (owner === "all" || i.owner === owner) && (!hideDone || !isDone(i, state)));
        const groupAll = rows.get(g.id) ?? [];
        const groupDone = groupAll.filter((i) => isDone(i, state)).length;
        if (items.length === 0 && (hideDone || owner !== "all")) return null;
        return (
          <section key={g.id} className="adm-section adm-launch-group" aria-labelledby={`lg-${g.id}`}>
            <div className="adm-launch-group-head">
              <h2 className="adm-section-title" id={`lg-${g.id}`}>{g.name}</h2>
              <span className={`adm-badge ${groupDone === groupAll.length ? "adm-badge-ok" : ""}`}>{groupDone} / {groupAll.length}</span>
            </div>
            <p className="adm-note adm-launch-group-note">{g.note}</p>
            <ul className="adm-launch-list">
              {items.map((item) => {
                const st = state.items[item.id];
                const checked = isDone(item, state);
                return (
                  <li key={item.id} className="adm-launch-item" data-done={checked || undefined} data-busy={busy === item.id || undefined}>
                    <label className="adm-launch-tick">
                      <input type="checkbox" checked={checked} onChange={() => toggle(item)} aria-label={`${item.title}, ${item.owner}`} />
                    </label>
                    <div className="adm-launch-body">
                      <div className="adm-launch-title-row">
                        <span className="adm-launch-title">{item.title}</span>
                        <span className={`adm-badge ${item.owner === "Wilfred" ? "" : "adm-badge-accent"}`}>{item.owner}</span>
                        {item.custom ? <span className="adm-badge">added</span> : null}
                      </div>
                      {item.detail ? <p className="adm-launch-detail">{item.detail}</p> : null}
                      <div className="adm-launch-meta">
                        {item.where ? (
                          <a className="adm-inline-link" href={item.where.href} target={item.where.href.startsWith(ADMIN_BASE) ? undefined : "_blank"} rel="noopener noreferrer">{item.where.label} &rarr;</a>
                        ) : null}
                        {st?.by ? <span className="adm-muted">{checked ? "Ticked" : "Updated"} by {st.by} · {when(st.at)}</span> : item.done ? <span className="adm-muted">Done in the code, 21 Oct</span> : null}
                        {item.custom ? <button type="button" className="adm-launch-remove" onClick={() => remove(item as CustomItem)}>Remove</button> : null}
                      </div>
                      <NoteField initial={st?.note ?? ""} onSave={(t) => note(item, t)} />
                    </div>
                  </li>
                );
              })}
            </ul>
            <AddRow onAdd={(input) => add(g.id, input)} />
          </section>
        );
      })}
    </div>
  );
}

function NoteField({ initial, onSave }: { initial: string; onSave: (t: string) => void }) {
  const [open, setOpen] = useState(Boolean(initial));
  const [text, setText] = useState(initial);
  if (!open) return <button type="button" className="adm-launch-note-btn" onClick={() => setOpen(true)}>Add a note</button>;
  return (
    <textarea
      className="adm-launch-note"
      rows={text.split("\n").length > 1 ? 3 : 1}
      value={text}
      placeholder="Where it stands, who has it, what is blocking"
      onChange={(e) => setText(e.target.value)}
      onBlur={() => { onSave(text); if (!text.trim()) setOpen(false); }}
      aria-label="Note"
    />
  );
}

function AddRow({ onAdd }: { onAdd: (input: { title: string; detail: string; owner: Owner }) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [owner, setOwner] = useState<Owner>("SAMUH");
  if (!open) return <button type="button" className="adm-btn adm-btn-small adm-btn-ghost adm-launch-add" onClick={() => setOpen(true)}>+ Add an item</button>;
  return (
    <form
      className="adm-launch-add-form"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        try {
          await onAdd({ title, detail, owner });
          setTitle(""); setDetail(""); setOpen(false);
        } catch { /* the board shows the error */ }
      }}
    >
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What needs doing" aria-label="Title" required autoFocus />
      <input type="text" value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="Detail, optional" aria-label="Detail" />
      <select value={owner} onChange={(e) => setOwner(e.target.value as Owner)} aria-label="Owner">
        {OWNERS.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <div className="adm-actions">
        <button type="submit" className="adm-btn adm-btn-small adm-btn-primary">Add</button>
        <button type="button" className="adm-btn adm-btn-small adm-btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
      </div>
    </form>
  );
}
