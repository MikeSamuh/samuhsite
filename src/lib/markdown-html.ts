// The small markdown the MDX posts use, turned into the HTML the admin's
// editor works in, so a file post can be opened and edited there. Mirrors
// Markdown.tsx: ##, ###, paragraphs, - and 1. lists, **bold**, *italic*.
// The <Transcript /> tag is dropped; the page renders the transcript itself.

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function inline(s: string): string {
  return esc(s)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

export function markdownToHtml(source: string): string {
  const blocks = source.replace(/<Transcript[^>]*\/>/g, "").split(/\n{2,}/);
  const out: string[] = [];
  for (const raw of blocks) {
    const b = raw.trim();
    if (!b) continue;
    const h = b.match(/^(#{2,3})\s+(.+)$/);
    if (h) {
      // the transcript heading goes with the tag it introduced
      if (h[2].trim() === "Transcript") continue;
      out.push(h[1].length === 2 ? `<h2>${inline(h[2])}</h2>` : `<h3>${inline(h[2])}</h3>`);
      continue;
    }
    const lines = b.split("\n");
    if (lines.every((l) => /^- /.test(l))) {
      out.push(`<ul>${lines.map((l) => `<li><p>${inline(l.slice(2))}</p></li>`).join("")}</ul>`);
      continue;
    }
    if (lines.every((l) => /^\d+\. /.test(l))) {
      out.push(`<ol>${lines.map((l) => `<li><p>${inline(l.replace(/^\d+\. /, ""))}</p></li>`).join("")}</ol>`);
      continue;
    }
    out.push(`<p>${inline(lines.join(" "))}</p>`);
  }
  return out.join("\n");
}
