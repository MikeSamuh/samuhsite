"use client";

import { useRef, useState } from "react";

/** An image path or URL, with an upload button beside it. */
export function ImageField({ value, onChange, folder = "uploads" }: { value: string; onChange: (v: string) => void; folder?: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const upload = async (file: File) => {
    setBusy(true);
    setError(undefined);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", folder);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };
  return (
    <div className="adm-image">
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="adm-image-thumb" />
      ) : (
        <span className="adm-image-empty">No image</span>
      )}
      <div className="adm-image-tools">
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="/path/in/public or https://" className="adm-input-mono" />
        <div className="adm-actions">
          <input ref={input} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} disabled={busy} />
          {value ? <button type="button" className="adm-btn adm-btn-small adm-btn-ghost" onClick={() => onChange("")}>Clear</button> : null}
        </div>
        {busy ? <span className="adm-note">Uploading…</span> : null}
        {error ? <span className="adm-note adm-note-error">{error}</span> : null}
      </div>
    </div>
  );
}
