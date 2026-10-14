import type { ReactNode } from "react";

/**
 * The small markdown the Insights posts use: ##, ###, paragraphs, - and 1.
 * lists, **bold** and *italic*. Anything else is text. A `<Transcript />`
 * tag in the source is dropped; the page renders the transcript itself.
 */

function inline(s: string, key: number): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    out.push(m[1] ? <strong key={`${key}-${i++}`}>{m[1]}</strong> : <em key={`${key}-${i++}`}>{m[2]}</em>);
    last = m.index + m[0].length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

export function Markdown({ source, skip = [] }: { source: string; skip?: string[] }) {
  const blocks = source.replace(/<Transcript[^>]*\/>/g, "").split(/\n{2,}/);
  const nodes: ReactNode[] = [];
  let hidden = false;
  blocks.forEach((raw, i) => {
    const b = raw.trim();
    if (!b) return;
    const h = b.match(/^(#{2,3})\s+(.+)$/);
    if (h) {
      // a `skip` heading hides its section until the next heading
      hidden = skip.includes(h[2].trim());
      if (hidden) return;
      nodes.push(h[1].length === 2 ? <h2 key={i} className="ins-h2">{h[2]}</h2> : <h3 key={i} className="ins-h3">{h[2]}</h3>);
      return;
    }
    if (hidden) return;
    const lines = b.split("\n");
    if (lines.every((l) => /^- /.test(l))) {
      nodes.push(<ul key={i} className="ins-list">{lines.map((l, j) => <li key={j}>{inline(l.slice(2), i * 100 + j)}</li>)}</ul>);
      return;
    }
    if (lines.every((l) => /^\d+\. /.test(l))) {
      nodes.push(<ol key={i} className="ins-list">{lines.map((l, j) => <li key={j}>{inline(l.replace(/^\d+\. /, ""), i * 100 + j)}</li>)}</ol>);
      return;
    }
    if (b.startsWith("TODO(content)")) {
      nodes.push(<p key={i} className="ins-todo">{b}</p>);
      return;
    }
    nodes.push(<p key={i}>{inline(lines.join(" "), i)}</p>);
  });
  return <>{nodes}</>;
}
