"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_API } from "@/lib/admin/paths";
import type { Reflection } from "@/lib/admin/reflections";

function when(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

/** The list of what visitors shared, a switch to put each one on the back
 *  of its card, and a box for the team to write one of its own. */
export function Responses({ rows, cards }: { rows: Reflection[]; cards: string[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [card, setCard] = useState(cards[0] ?? "");
  const [text, setText] = useState("");

  const call = async (id: string, input: RequestInit) => {
    setBusy(id);
    setError(null);
    try {
      const res = await fetch(`${ADMIN_API}/reflections/${encodeURIComponent(id)}`, { headers: { "content-type": "application/json" }, ...input });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? "Could not save");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save");
    } finally {
      setBusy(null);
    }
  };

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !card) return;
    setBusy("new");
    setError(null);
    try {
      const res = await fetch(`${ADMIN_API}/reflections`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ card, text }) });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? "Could not save");
      setText("");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="adm-stack">
      {error ? <p className="adm-note adm-note-error" role="alert">{error}</p> : null}
      <div className="adm-card" style={{ padding: "6px 12px" }}>
        {rows.length ? (
          <table className="adm-table">
            <thead>
              <tr><th>Response</th><th>Card</th><th>When</th><th>On the card</th><th></th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="adm-response">{r.text}{r.by === "team" ? <div className="adm-mono adm-muted">Written by the team</div> : null}</td>
                  <td>{r.card}</td>
                  <td className="adm-muted">{when(r.createdAt)}</td>
                  <td>
                    <button type="button" className={`adm-btn adm-btn-small${r.shown ? "" : " adm-btn-primary"}`} disabled={busy === r.id} aria-pressed={r.shown} onClick={() => call(r.id, { method: "PATCH", body: JSON.stringify({ shown: !r.shown }) })}>
                      {r.shown ? "Hide from card" : "Show on card"}
                    </button>
                  </td>
                  <td>
                    <button type="button" className="adm-btn adm-btn-small adm-btn-ghost adm-btn-danger" disabled={busy === r.id} onClick={() => { if (window.confirm("Delete this response? It cannot be brought back.")) call(r.id, { method: "DELETE" }); }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="adm-note" style={{ padding: "14px 4px" }}>Nothing shared yet. When a visitor shares a line beside a card it lands here, hidden until you show it.</p>
        )}
      </div>

      <form className="adm-card adm-form" onSubmit={add}>
        <div>
          <div className="adm-card-title">Write one</div>
          <div className="adm-card-note">A response from the team goes straight onto the back of the card, marked as yours in this list and anonymous on the site.</div>
        </div>
        <div className="adm-row">
          <label className="adm-field">
            <span className="adm-label">Card</span>
            <select value={card} onChange={(e) => setCard(e.target.value)}>
              {cards.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
        </div>
        <label className="adm-field">
          <span className="adm-label">The response</span>
          <textarea rows={3} maxLength={600} value={text} onChange={(e) => setText(e.target.value)} placeholder="A line or two" />
        </label>
        <div>
          <button type="submit" className="adm-btn adm-btn-primary" disabled={busy === "new" || !text.trim() || !card}>Add to the card</button>
        </div>
      </form>
    </div>
  );
}
