import Link from "next/link";

/**
 * The three steps the work went through, as a strip: style at /design,
 * frame at /layout, the site itself at /draft. Shown on all three so the
 * client can move between them. Styles live in design.css (.steps).
 */

export type StepId = "design" | "layout" | "draft";

export const STEPS: { id: StepId; n: string; name: string; href: string; note: string }[] = [
  { id: "design", n: "01", name: "Style", href: "/design", note: "Background, accents, type, lines, motion. Locked 25 September." },
  { id: "layout", n: "02", name: "Layout", href: "/layout", note: "Frame and a variant per section. Editorial, 27 September." },
  { id: "draft", n: "03", name: "Drafts", href: "/draft", note: "The site, sculpted. Three passes, one style." },
];

export function Steps({ here }: { here: StepId }) {
  return (
    <nav className="stepnav" aria-label="Where this sits">
      {STEPS.map((s) => (
        <Link key={s.id} href={s.href} className="stepnav-item" aria-current={s.id === here ? "page" : undefined} title={s.note}>
          <span className="stepnav-n">{s.n}</span>
          <span className="stepnav-name">{s.name}</span>
        </Link>
      ))}
    </nav>
  );
}
