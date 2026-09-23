import Link from "next/link";
import HomeStage from "./home/HomeStage";
import "./home/home.css";

// Home shell. The twelve sections from docs/scope.md, in draft order, as
// empty labelled blocks. No copy, no design, no motion. The point is to see
// the shape of the argument at a scroll before any section is designed.
//
// Each block carries the scope note as its intent line so a reader knows
// what goes there. Every other value is TODO(content) and stays visible
// until SAMUH supplies it.

interface Section {
  n: number;
  id: string;
  title: string;
  intent: string;
  /** rough vertical weight, so the scroll length is honest */
  size: "tall" | "short";
}

const SECTIONS: Section[] = [
  {
    n: 1,
    id: "hero",
    title: "Hero video",
    intent: "Muted looping preview, full video on click. Supplied by SAMUH.",
    size: "tall",
  },
  {
    n: 2,
    id: "thesis",
    title: "Thesis statement",
    intent:
      "The problem SAMUH solves. Shares the screen with the hero. Carries the Sapien Labs association.",
    size: "short",
  },
  {
    n: 3,
    id: "what-samuh-means",
    title: "What SAMUH means",
    intent: "One sentence, because the word raises a question.",
    size: "short",
  },
  {
    n: 4,
    id: "three-circles",
    title: "Three circles",
    intent: "Team, individual, organization. Establishes teams as the subject.",
    size: "tall",
  },
  {
    n: 5,
    id: "aspirational-moment",
    title: "Aspirational moment",
    intent:
      "Core competencies. Imagery or a framing that makes you want to lead a team like this.",
    size: "tall",
  },
  {
    n: 6,
    id: "research-claim",
    title: "The research claim",
    intent:
      "One research-backed statement, links to the Sapien Labs report. Wording not landed.",
    size: "short",
  },
  {
    n: 7,
    id: "testimonials",
    title: "Testimonials",
    intent: "Trust before proof.",
    size: "short",
  },
  {
    n: 8,
    id: "case-study",
    title: "Case study reference",
    intent: "Snippet plus link. Likely anonymised.",
    size: "short",
  },
  {
    n: 9,
    id: "data-tool",
    title: "Interactive data tool",
    intent:
      "Visitor adjusts team environment factors, sees estimated productive days lost update live.",
    size: "tall",
  },
  {
    n: 10,
    id: "metaphor-cards",
    title: "Metaphor cards",
    intent:
      "Illustrated team archetypes to self-identify with. Sits after the data so it reads as insight.",
    size: "tall",
  },
  {
    n: 11,
    id: "equation",
    title: "The SAMUH equation",
    intent: "Visual section.",
    size: "tall",
  },
  {
    n: 12,
    id: "get-started",
    title: "Get Started",
    intent: "Entry to the intake assessment. May move off the homepage.",
    size: "short",
  },
];

function Block({ n, id, title, intent, size }: Section) {
  const headingId = `${id}-heading`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`home-section px-4 py-16 sm:px-8 ${n === 1 ? "home-section--hero" : ""}`}
    >
      <p className="home-section__meta text-xs uppercase tracking-widest mb-3">
        <span className="home-section__number">{String(n).padStart(2, "0")}</span>
        {" / 12"}
      </p>
      <h2 id={headingId} className="home-section__title text-4xl sm:text-6xl mb-4">
        {title}
      </h2>
      <p className="home-section__intent text-sm mb-8">{intent}</p>
      <div className={`home-placeholder home-placeholder--${size} p-6 text-xs`}>
        TODO(content)
      </div>
    </section>
  );
}

export default function Home() {
  const [hero, thesis, ...rest] = SECTIONS;

  return (
    <HomeStage>
      <header className="home-bar px-4 py-4 sm:px-8 text-xs">
        {/* The logo is a supplied SVG and is never set in type. See CLAUDE.md rule 2. */}
        <span className="home-section__meta">TODO(asset): logo SVG · in partnership with Sapien Labs</span>
        <nav aria-label="Primary">
          <Link href="/design" className="home-link">
            Direction configurator
          </Link>
        </nav>
      </header>

      <main>
        {/* Sections 1 and 2 are one scroll stop, per the scope. */}
        <div className="home-stop">
          <Block {...hero} />
          <Block {...thesis} />
        </div>

        {rest.map((s) => (
          <Block key={s.id} {...s} />
        ))}
      </main>

      <footer className="home-bar home-bar--footer px-4 py-4 sm:px-8 text-xs">
        <span className="home-section__meta">TODO(content): footer, contact details, utility links</span>
      </footer>
    </HomeStage>
  );
}
