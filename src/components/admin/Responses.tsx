"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_API } from "@/lib/admin/paths";
import type { Reflection } from "@/lib/admin/reflections";

function when(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

/** The list of what visitors shared, and a switch to put each one on the
 *  back of its card. */
export function Responses({ rows }: { rows: Reflection[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
                  <td className="adm-response">{r.text}</td>
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

    </div>
  );
}
