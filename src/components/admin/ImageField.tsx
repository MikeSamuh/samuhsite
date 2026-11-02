"use client";

import { useRef, useState, type DragEvent } from "react";
import { ADMIN_API } from "@/lib/admin/paths";

export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif";

/** Sends one image to the admin's upload route and returns its URL. */
export async function uploadImage(file: File, folder = "uploads"): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);
  const res = await fetch(`${ADMIN_API}/upload`, { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Upload failed");
  return data.url as string;
}

/**
 * An image path or URL with a real upload button. The browser's file input
 * stays hidden; the button opens it, and a file dropped anywhere on the
 * field uploads too.
 */
export function ImageField({ value, onChange, folder = "uploads" }: { value: string; onChange: (v: string) => void; folder?: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);
  const [error, setError] = useState<string>();
  const upload = async (file: File) => {
    setBusy(true);
    setError(undefined);
    try {
      onChange(await uploadImage(file, folder));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && !busy) upload(file);
  };
  return (
    <div
      className="adm-image"
      data-over={over || undefined}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
    >
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="adm-image-thumb" />
      ) : (
        <span className="adm-image-empty">{busy ? "Uploading…" : "No image"}</span>
      )}
      <div className="adm-image-tools">
        <div className="adm-actions">
          <input ref={input} type="file" accept={IMAGE_ACCEPT} hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
          <button type="button" className="adm-btn adm-btn-small adm-btn-primary" onClick={() => input.current?.click()} disabled={busy}>
            {busy ? "Uploading…" : value ? "Replace image" : "Upload image"}
          </button>
          {value ? <button type="button" className="adm-btn adm-btn-small adm-btn-ghost" onClick={() => onChange("")} disabled={busy}>Clear</button> : null}
        </div>
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="or paste a path or URL" className="adm-input-mono" aria-label="Image path or URL" />
        <span className="adm-note">{error ? <span className="adm-note-error">{error}</span> : "jpg, png, webp, gif, svg or avif, under 8 MB. Drop a file here to upload it."}</span>
      </div>
    </div>
  );
}
