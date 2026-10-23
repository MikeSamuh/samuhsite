"use client";

import { useEffect, useState, type ReactNode } from "react";

/** A button that puts `text` on the clipboard and says so for a moment. */
export function Copy({ text, label, children, className }: { text: string; label?: string; children?: ReactNode; className?: string }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 1400);
    return () => clearTimeout(t);
  }, [done]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setDone(true);
  };
  return (
    <button type="button" className={`adm-copy${className ? ` ${className}` : ""}`} onClick={copy} data-copied={done || undefined} title={`Copy ${label ?? text}`} aria-label={`Copy ${label ?? text}`}>
      {children ?? text}
      <span className="adm-copy-tag" aria-live="polite">{done ? "Copied" : "Copy"}</span>
    </button>
  );
}
