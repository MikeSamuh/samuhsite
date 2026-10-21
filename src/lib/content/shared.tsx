// Small helpers the site uses to render content fields. No file system, no
// store: safe in client components.

import type { ReactNode } from "react";

/** "{tier}" style placeholders, filled from the values given. */
export function fill(text: string, values: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (m, k) => (k in values ? String(values[k]) : m));
}

/** A textarea's lines with <br /> between them. */
export function lines(text: string): ReactNode[] {
  return text.split("\n").flatMap((l, i) => (i ? [<br key={`b${i}`} />, l] : [l]));
}

/** *words* become an <em> with the class given, nothing else is parsed. */
export function mark(text: string, className?: string): ReactNode[] {
  return text.split(/(\*[^*]+\*)/).map((part, i) =>
    part.startsWith("*") && part.endsWith("*") && part.length > 2
      ? <em className={className} key={i}>{part.slice(1, -1)}</em>
      : part,
  );
}
