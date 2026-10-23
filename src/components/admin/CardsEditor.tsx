"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_API } from "@/lib/admin/paths";
import type { Card } from "@/lib/admin/cards";
import { ImageField } from "./ImageField";

/** The deck: each card's drawing and name, in order. Upload, rename, move,
 *  delete, then Save, which replaces the whole list. */
export function CardsEditor({ initial, stored }: { initial: Card[]; /** a saved list exists, so Reset means something */ stored: boolean }) {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>(initial);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const edit = (i: number, patch: Partial<Card>) => { setCards((v) => v.map((c, k) => (k === i ? { ...c, ...patch } : c))); setDirty(true); setSaved(false); };
  const move = (i: number, d: -1 | 1) => { setCards((v) => { const n = [...v]; const j = i + d; if (j < 0 || j >= n.length) return v; [n[i], n[j]] = [n[j], n[i]]; return n; }); setDirty(true); setSaved(false); };
  const remove = (i: number) => { if (!window.confirm(`Delete "${cards[i].name || "this card"}" from the deck?`)) return; setCards((v) => v.filter((_, k) => k !== i)); setDirty(true); setSaved(false); };
  const add = () => { setCards((v) => [...v, { id: `card-${Date.now().toString(36)}`, name: "", image: "" }]); setDirty(true); setSaved(false); };

  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${ADMIN_API}/cards`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ items: cards }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Could not save");
      setCards(data.items);
      setDirty(false);
      setSaved(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save");
    } finally {
      setBusy(false);
    }
  };
  const reset = async () => {
    if (!window.confirm("Go back to the two cards in the code? The saved list is deleted.")) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${ADMIN_API}/cards`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not reset");
      router.refresh();
      window.location.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not reset");
      setBusy(false);
    }
  };

  return (
    <div className="adm-stack">
      <div className="adm-cards">
        {cards.map((c, i) => (
          <div className="adm-card adm-card-item" key={c.id}>
            <div className="adm-card-art">
              {c.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.image} alt="" />
              ) : (
                <span className="adm-image-empty">No drawing</span>
              )}
            </div>
            <div className="adm-form">
              <label className="adm-field">
                <span className="adm-label">Name</span>
                <input type="text" value={c.name} onChange={(e) => edit(i, { name: e.target.value })} placeholder="Read by screen readers; the card shows the drawing alone" />
              </label>
              <div className="adm-field">
                <span className="adm-label">Drawing</span>
                <ImageField value={c.image} onChange={(v) => edit(i, { image: v })} folder="metaphor" />
                <span className="adm-help">Portrait, 4 by 5. White lines on black matches the others.</span>
              </div>
              <div className="adm-actions">
                <button type="button" className="adm-btn adm-btn-small adm-btn-ghost" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
                <button type="button" className="adm-btn adm-btn-small adm-btn-ghost" onClick={() => move(i, 1)} disabled={i === cards.length - 1} aria-label="Move down">↓</button>
                <span className="adm-list-n">{i + 1} of {cards.length}</span>
                <button type="button" className="adm-btn adm-btn-small adm-btn-ghost adm-btn-danger" onClick={() => remove(i)} style={{ marginLeft: "auto" }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <button type="button" className="adm-btn" onClick={add}>+ Add a card</button>
      </div>
      <div className="adm-savebar">
        <span className="adm-savebar-status" aria-live="polite">
          {error ? <span className="adm-note-error">{error}</span> : saved ? "Saved. The home page shows the new deck." : dirty ? "Unsaved changes" : `${cards.length} card${cards.length === 1 ? "" : "s"} in the deck`}
        </span>
        <div className="adm-actions">
          {stored ? <button type="button" className="adm-btn adm-btn-ghost" onClick={reset} disabled={busy}>Reset to the code</button> : null}
          <button type="button" className="adm-btn adm-btn-primary" onClick={save} disabled={busy || !dirty}>{busy ? "Saving…" : "Save"}</button>
        </div>
      </div>
    </div>
  );
}
