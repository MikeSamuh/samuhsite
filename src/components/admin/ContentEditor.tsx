"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { FieldDef, ListDef, PageSchema } from "@/lib/content/schema";
import { ImageField } from "./ImageField";
import { ADMIN_API } from "@/lib/admin/paths";

type Section = Record<string, unknown>;
type PageValue = Record<string, Section>;
type Row = Record<string, string>;

function when(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

function Field({ def, value, onChange }: { def: FieldDef; value: string; onChange: (v: string) => void }) {
  const id = `f-${def.key}-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <div className="adm-field">
      <label className="adm-label" htmlFor={id}>{def.label}</label>
      {def.type === "textarea" ? (
        <textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} rows={Math.min(10, Math.max(3, Math.ceil(value.length / 90)))} />
      ) : def.type === "image" ? (
        <ImageField value={value} onChange={onChange} />
      ) : (
        <input id={id} type={def.type === "url" ? "url" : "text"} value={value} onChange={(e) => onChange(e.target.value)} className={def.type === "url" ? "adm-input-mono" : undefined} />
      )}
      {def.help ? <span className="adm-help">{def.help}</span> : null}
    </div>
  );
}

function ListField({ def, rows, onChange }: { def: ListDef; rows: Row[]; onChange: (rows: Row[]) => void }) {
  const set = (i: number, key: string, v: string) => onChange(rows.map((r, j) => (j === i ? { ...r, [key]: v } : r)));
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const remove = (i: number) => onChange(rows.filter((_, j) => j !== i));
  const add = () => onChange([...rows, Object.fromEntries(def.fields.map((f) => [f.key, ""]))]);
  const titleOf = (r: Row) => r[def.fields[0].key] || `${def.itemName} ${rows.indexOf(r) + 1}`;
  return (
    <div className="adm-field">
      <span className="adm-label">{def.label}</span>
      {def.help ? <span className="adm-help">{def.help}</span> : null}
      <div className="adm-list">
        {rows.map((r, i) => (
          <details className="adm-list-item" key={i} open={rows.length <= 4 || undefined}>
            <summary className="adm-list-head">
              <span><span className="adm-list-n">{String(i + 1).padStart(2, "0")}</span>&nbsp;&nbsp;{titleOf(r)}</span>
              <span className="adm-list-tools">
                <button type="button" className="adm-btn adm-btn-icon adm-btn-ghost" onClick={(e) => { e.preventDefault(); move(i, -1); }} disabled={i === 0} aria-label="Move up">↑</button>
                <button type="button" className="adm-btn adm-btn-icon adm-btn-ghost" onClick={(e) => { e.preventDefault(); move(i, 1); }} disabled={i === rows.length - 1} aria-label="Move down">↓</button>
                <button type="button" className="adm-btn adm-btn-icon adm-btn-ghost adm-btn-danger" onClick={(e) => { e.preventDefault(); if (confirm(`Remove this ${def.itemName}?`)) remove(i); }} aria-label="Remove">×</button>
              </span>
            </summary>
            {def.fields.map((f) => (
              <Field key={f.key} def={f} value={r[f.key] ?? ""} onChange={(v) => set(i, f.key, v)} />
            ))}
          </details>
        ))}
        <button type="button" className="adm-btn adm-btn-small adm-list-add" onClick={add}>+ Add {def.itemName}</button>
      </div>
    </div>
  );
}

export function ContentEditor({ schema, initial, meta }: { schema: PageSchema; initial: PageValue; meta: { updatedAt: string; updatedBy: string } | null }) {
  const router = useRouter();
  const [value, setValue] = useState<PageValue>(initial);
  const [saved, setSaved] = useState<PageValue>(initial);
  const [state, setState] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");
  const dirty = JSON.stringify(value) !== JSON.stringify(saved);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const setField = (sec: string, key: string, v: unknown) =>
    setValue((cur) => ({ ...cur, [sec]: { ...cur[sec], [key]: v } }));

  const save = async () => {
    setState("saving");
    try {
      const res = await fetch(`${ADMIN_API}/content/${schema.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(value) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not save");
      setSaved(value);
      setState("ok");
      setMessage(`Saved ${when(data.updatedAt)}. The site is updating.`);
      router.refresh();
    } catch (e) {
      setState("error");
      setMessage(e instanceof Error ? e.message : "Could not save");
    }
  };

  const reset = async () => {
    if (!confirm(`Reset ${schema.name} to the defaults? Everything saved for this page goes.`)) return;
    setState("saving");
    const res = await fetch(`${ADMIN_API}/content/${schema.id}`, { method: "DELETE" });
    if (res.ok) {
      setState("ok");
      setMessage("Reset. Reloading the defaults.");
      router.refresh();
      window.location.reload();
    } else {
      setState("error");
      setMessage("Could not reset");
    }
  };

  return (
    <>
      <div className="adm-head">
        <div>
          <span className="adm-kicker">Content · {schema.name}</span>
          <h1 className="adm-title">{schema.name}</h1>
          <p className="adm-lede">{schema.note}{meta ? ` Last saved ${when(meta.updatedAt)} by ${meta.updatedBy}.` : " Showing the defaults."}</p>
        </div>
        <div className="adm-actions">
          <a className="adm-btn" href={schema.path} target="_blank" rel="noopener noreferrer">Open the page ↗</a>
          <button type="button" className="adm-btn adm-btn-ghost adm-btn-danger" onClick={reset}>Reset to defaults</button>
        </div>
      </div>

      {schema.sections.map((sec, i) => (
        <details className="adm-sec" key={sec.key} open={i === 0 || undefined}>
          <summary>
            <span>{sec.label}</span>
            {sec.note ? <span className="adm-sec-note">{sec.note}</span> : null}
          </summary>
          <div className="adm-sec-body">
            {sec.fields.map((f) =>
              f.type === "list" ? (
                <ListField key={f.key} def={f} rows={(value[sec.key]?.[f.key] as Row[]) ?? []} onChange={(rows) => setField(sec.key, f.key, rows)} />
              ) : (
                <Field key={f.key} def={f} value={(value[sec.key]?.[f.key] as string) ?? ""} onChange={(v) => setField(sec.key, f.key, v)} />
              ),
            )}
          </div>
        </details>
      ))}

      <div className="adm-savebar">
        <span className="adm-savebar-status" data-tone={state === "error" ? "error" : dirty ? "dirty" : state === "ok" ? "ok" : undefined} role="status">
          {dirty ? "Unsaved changes" : message || "No changes"}
        </span>
        <div className="adm-actions">
          <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setValue(saved)} disabled={!dirty}>Discard</button>
          <button type="button" className="adm-btn adm-btn-primary" onClick={save} disabled={!dirty || state === "saving"}>{state === "saving" ? "Saving…" : "Save"}</button>
        </div>
      </div>
    </>
  );
}
