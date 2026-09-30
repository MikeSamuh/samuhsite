"use client";

import { useState } from "react";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { PageId } from "@/lib/layout";

/**
 * The pages behind the nav, composed from docs/scope.md and docs/brief.md.
 * Copy is confirmed material or draft written from the introduction deck
 * and the brief, marked draft where it needs SAMUH's sign-off. No figures,
 * no invented endorsements. Same shared classes as the home sections so the frame
 * dials (alignment, width, spacing, rules, numbers) apply here too.
 */

const stay = (e: React.MouseEvent) => e.preventDefault();

export function Frame({ label, tall }: { label: string; tall?: boolean }) {
  return <div className={`ph${tall ? " ph-tall" : ""}`}>{label}</div>;
}

function PageHead({ n, kicker, title, lede }: { n: string; kicker: string; title: string; lede?: string }) {
  return (
    <section className="L-sec L-page-head" data-n={n}>
      <div className="L-wrap">
        <div className="L-head">
          <span className="L-n">{n}</span>
          <div>
            <p className="eyebrow L-eyebrow">{kicker}</p>
            <h1 className="display L-page-title">{title}</h1>
            {lede ? <p className="lede">{lede}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function Sec({ n, kicker, title, children, id, cls }: { n: string; kicker: string; title: string; children: React.ReactNode; id?: string; cls?: string }) {
  return (
    <section className={`L-sec L-sec-h${cls ? ` ${cls}` : ""}`} id={id} data-n={n}>
      <div className="L-wrap">
        <div className="L-head">
          <span className="L-n">{n}</span>
          <div>
            <p className="eyebrow L-eyebrow">{kicker}</p>
            <h2 className="sec">{title}</h2>
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const TIERS = [
  { tag: "Tier 01", name: "Self-guided", what: "Fully automated. The team works through the material on its own.", who: "Teams with a strong leader who want the method without the meetings, and organizations rolling it out across many teams.", get: "The team process, the baseline and the re-measure, and the material to run one ritual for ninety days.", cta: "Talk to us" },
  { tag: "Tier 02", name: "Supported", what: "Self-guided plus periodic support calls from the Samuh team.", who: "Teams that want a second pair of eyes at the moments that matter: choosing the practice, and the check-in at day 45.", get: "Everything in Self-guided, with scheduled calls to read the data together and keep the ritual on track.", cta: "Talk to us" },
  { tag: "Tier 03", name: "Guided", what: "In person. The Samuh team delivers the work hands on.", who: "Leadership teams and mission-critical teams where the stakes justify having us in the room.", get: "Confidential interviews, a facilitated day one, coaching for two ritual keepers every two weeks, and the close.", cta: "Talk to us" },
];

function Solutions({ go }: { go: (p: PageId) => void }) {
  const [tier, setTier] = useState(TIERS[1].name);
  const [sent, setSent] = useState(false);
  const rows: [string, string, string, string][] = [
    ["What it is", ...TIERS.map((t) => t.what) as [string, string, string]],
    ["Who it is for", ...TIERS.map((t) => t.who) as [string, string, string]],
    ["What you get", ...TIERS.map((t) => t.get) as [string, string, string]],
    ["Support calls", "Not included", "Scheduled", "Ongoing"],
    ["In-person delivery", "Not included", "Not included", "Included"],
    ["TeamQ baseline and re-measure", "Included", "Included", "Included"],
    ["Ritual keeper coaching", "Self-directed", "At check-ins", "Every two weeks"],
  ];
  return (
    <>
      <PageHead n="01" kicker="Three ways to engage" title="Same process, three levels of support." lede="One methodology, the team process, delivered with as much or as little of us in the room as the team needs. Organization-wide work layers on top of it." />
      <Sec n="02" kicker="Side by side" title="The three tiers">
        <table className="L-table L-tiers" data-tier={tier}>
          <thead>
            <tr>
              <th />
              {TIERS.map((t) => (
                <th key={t.name} data-on={t.name === tier}>
                  <button className="L-tier-pick" onClick={() => setTier(t.name)} aria-pressed={t.name === tier}>
                    <span className="L-cap">{t.tag}</span>
                    <span>{t.name}</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([row, ...cells]) => (
              <tr key={row}>
                <th>{row}</th>
                {cells.map((c, i) => <td key={i} data-on={TIERS[i].name === tier}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="L-cap">Organization-wide engagements layer on top of the team process, not beside it.</p>
      </Sec>
      <Sec n="03" kicker="Talk to us" title="Tell us which one, and where to reach you">
        {!sent ? (
          <form className="L-talk" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <div className="L-talk-tiers" role="radiogroup" aria-label="Which tier">
              {TIERS.map((t) => (
                <button key={t.name} type="button" className="opt" aria-pressed={t.name === tier} onClick={() => setTier(t.name)}>{t.name}</button>
              ))}
            </div>
            <div className="field L-talk-field">
              <input type="email" required placeholder="you@company.com" aria-label="Your email" />
              <button className="btn" type="submit">Talk to us <span className="arrow">&rarr;</span></button>
            </div>
            <span className="L-cap">A person replies. Tagged {tier}, so we come prepared.</span>
          </form>
        ) : (
          <div className="L-talk-thanks">
            <p className="L-big">Thank you. We&rsquo;ll be in touch about {tier}.</p>
            <a href="#" className="inline-link L-text-cta" onClick={(e) => { stay(e); go("process"); }}>Read about the team process while you wait <span className="arrow">&rarr;</span></a>
          </div>
        )}
      </Sec>
      <Sec n="04" kicker="Trust before proof" title="What teams say">
        <div className="L-voices L-voices-grid">
          {[0, 1, 2].map((i) => (
            <figure className="card L-quote" key={i}>
              <blockquote>&ldquo;Sample testimonial. Two or three sentences in the client&rsquo;s own words about what changed for the team.&rdquo;</blockquote>
              <figcaption className="L-cap">Name &middot; Role &middot; Organization</figcaption>
            </figure>
          ))}
        </div>
      </Sec>
    </>
  );
}

/* ------------------------------------------------------------------ */

// name, note, icon (Wilfred's, public/icons, 30 September; file names as supplied)
const STEPS: [string, string, string][] = [
  ["Prepare", "Baseline the team before anything changes.", "/icons/prepare.png"],
  ["Launch", "Put the practices into the working week.", "/icons/Launch.png"],
  ["Discover", "Surface what the team does under load.", "/icons/Discover.png"],
  ["Awareness", "Name the patterns nobody could see.", "/icons/Awareness.png"],
  ["Belonging", "Build the conditions people stay for.", "/icons/Belonging.png"],
  ["Action", "Turn insight into standing rituals.", "/icons/Action.png"],
];

const ARC = [
  ["Pre-sprint month", "Discovery + TeamQ", "Confidential interviews and a TeamQ baseline."],
  ["Day 1", "Agree goals, co-create the ritual", "The team reviews its findings and designs one practice it owns."],
  ["Day 45", "Refine the ritual", "A check-in to see how the practice is landing, and adjust."],
  ["Day 90", "Re-measure and close", "TeamQ is repeated and change is measured against the baseline."],
];


/**
 * The arc run: sections 02 and 03 of the process page share one line, in
 * gold, that winds down both like a backwards S. The wavelength is the
 * arc's four rows, so the six moves above get the same curve at the same
 * scale, and the arc is one S from its top. Everything is measured from the
 * DOM, and the line fades in at its start and out at its end.
 *
 * One ball rides the line: the point of the line nearest the pointer (the
 * middle of the view when there is no pointer), eased a little behind it.
 * The point it is level with lights up and its icon glows. No other marks
 * on the line. Reduced motion drops the easing.
 */
function ArcRun({ children }: { children: React.ReactNode }) {
  const runRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const ballRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const run = runRef.current;
    const svg = svgRef.current;
    const path = pathRef.current;
    const ball = ballRef.current;
    if (!run || !svg || !path || !ball) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // the line, sampled every few pixels, in run coordinates
    let pts: { x: number; y: number }[] = [];
    let ys: number[] = [];
    let items: HTMLElement[] = [];

    const setRect = (sel: string, x: number, y: number, w: number, h: number) => {
      const el = svg.querySelector<SVGRectElement>(sel);
      if (!el) return;
      el.setAttribute("x", String(x)); el.setAttribute("y", String(y));
      el.setAttribute("width", String(Math.max(0, w))); el.setAttribute("height", String(Math.max(0, h)));
    };

    const measure = () => {
      const box = run.getBoundingClientRect();
      const rel = (r: DOMRect) => new DOMRect(r.left - box.left, r.top - box.top, r.width, r.height);
      const lists = Array.from(run.querySelectorAll<HTMLElement>(".L-arc"));
      const arc = lists[lists.length - 1];
      const lane = arc?.querySelector<HTMLElement>(".L-arc-lane");
      if (!arc || !lane) return;
      const first = rel(lists[0].getBoundingClientRect());
      const ar = rel(arc.getBoundingClientRect());
      const la = rel(lane.getBoundingClientRect());
      const top = first.top;
      const bottom = ar.bottom;
      const cx = la.left + la.width / 2;
      const amp = Math.max(0, la.width / 2 - 14);
      const wave = Math.max(1, ar.height);
      items = Array.from(run.querySelectorAll<HTMLElement>(".L-arc-item"));
      ys = Array.from(run.querySelectorAll<HTMLElement>(".L-arc-lane")).map((el) => { const r = rel(el.getBoundingClientRect()); return r.top + r.height / 2; });

      // one sine, phase zero at the arc's top so the arc bows right first
      const xAt = (y: number) => cx + amp * Math.sin((2 * Math.PI * (y - ar.top)) / wave);
      const n = Math.max(24, Math.round((bottom - top) / 5));
      const d = Array.from({ length: n + 1 }, (_, i) => { const y = top + ((bottom - top) * i) / n; return `${i ? "L" : "M"} ${xAt(y).toFixed(1)} ${y.toFixed(1)}`; }).join(" ");

      const F = 120; // the fade at either end
      setRect(".L-arc-fade-in", 0, top, box.width, F);
      setRect(".L-arc-fade-solid", 0, top + F, box.width, bottom - top - 2 * F);
      setRect(".L-arc-fade-out", 0, bottom - F, box.width, F);
      svg.setAttribute("viewBox", `0 0 ${box.width} ${bottom}`);
      svg.setAttribute("width", String(box.width));
      svg.setAttribute("height", String(bottom));
      path.setAttribute("d", d);
      const L = path.getTotalLength();
      const k = Math.max(2, Math.round(L / 4));
      pts = Array.from({ length: k + 1 }, (_, i) => { const q = path.getPointAtLength((L * i) / k); return { x: q.x, y: q.y }; });
    };

    const nearest = (x: number, y: number) => {
      let best = 0;
      let bd = Infinity;
      for (let i = 0; i < pts.length; i++) {
        const dx = pts[i].x - x;
        const dy = pts[i].y - y;
        const dd = dx * dx + dy * dy;
        if (dd < bd) { bd = dd; best = i; }
      }
      return best;
    };

    // the ball: an index along the line that eases toward the nearest
    // point to the pointer
    let pointer: { x: number; y: number } | null = null;
    let at = -1;
    let raf = 0;
    let lastOn = -2;
    const tick = () => {
      raf = 0;
      if (!pts.length) return;
      const box = run.getBoundingClientRect();
      const px = pointer ? pointer.x - box.left : window.innerWidth / 2 - box.left;
      const py = pointer ? pointer.y - box.top : window.innerHeight / 2 - box.top;
      const target = nearest(px, py);
      if (at < 0) at = target;
      at += (target - at) * (still ? 1 : 0.14);
      if (Math.abs(target - at) < 0.05) at = target;
      const q = pts[Math.min(pts.length - 1, Math.max(0, Math.round(at)))];
      ball.setAttribute("transform", `translate(${q.x.toFixed(1)} ${q.y.toFixed(1)})`);
      // the point the ball is level with
      const near = ys.reduce((best, y, j) => (Math.abs(y - q.y) < 56 && (best < 0 || Math.abs(y - q.y) < Math.abs(ys[best] - q.y)) ? j : best), -1);
      if (near !== lastOn) {
        lastOn = near;
        items.forEach((el, j) => el.toggleAttribute("data-on", j === near));
      }
      if (Math.abs(target - at) > 0.05) raf = requestAnimationFrame(tick);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const onMove = (e: PointerEvent) => { pointer = { x: e.clientX, y: e.clientY }; kick(); };
    const onLeave = () => { pointer = null; kick(); };
    const onScroll = () => kick();
    const ro = new ResizeObserver(() => { measure(); kick(); });
    ro.observe(run);
    measure();
    kick();
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="L-arc-run" ref={runRef}>
      <svg ref={svgRef} className="L-arc-svg" aria-hidden>
        <defs>
          <filter id="L-arc-blur" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
          <linearGradient id="L-arc-grad-in" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#fff" />
          </linearGradient>
          <linearGradient id="L-arc-grad-out" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id="L-arc-end" maskUnits="userSpaceOnUse" x="0" y="0" width="100000" height="100000">
            <rect className="L-arc-fade-in" fill="url(#L-arc-grad-in)" />
            <rect className="L-arc-fade-solid" fill="#fff" />
            <rect className="L-arc-fade-out" fill="url(#L-arc-grad-out)" />
          </mask>
        </defs>
        <path ref={pathRef} className="L-arc-path" />
        <g ref={ballRef} className="L-arc-ball">
          <circle className="L-arc-ball-glow" r={20} filter="url(#L-arc-blur)" />
          <circle className="L-arc-ball-core" r={7} />
        </g>
      </svg>
      {children}
    </div>
  );
}

/** The six moves, in order, on the line: number, name and note one side,
 *  the icon the other, swapping sides each row. The icon the ball is level
 *  with grows and comes to full strength; the rest sit at 30 percent. */
function ArcMoves() {
  return (
    <ol className="L-arc L-arc-moves">
      {STEPS.map(([name, note, icon], i) => (
        <li key={name} className="L-arc-item">
          <div className="L-arc-copy">
            <span className="step-n">0{i + 1}</span>
            <span className="L-arc-what">{name}</span>
            <span className="L-arc-note">{note}</span>
          </div>
          <span className="L-arc-lane" aria-hidden />
          <span className="L-arc-art L-arc-icon">
            <Image src={icon} alt="" width={2048} height={2048} sizes="160px" />
          </span>
        </li>
      ))}
    </ol>
  );
}

/** The arc's four points: copy one side of the line, a spot for a small
 *  piece of art the other, swapping sides each row. Art is a white
 *  placeholder for now. The line itself is drawn by ArcRun. */
function ArcTimeline() {
  return (
    <ol className="L-arc">
      {ARC.map(([when, what, note]) => (
        <li key={when} className="L-arc-item">
          <div className="L-arc-copy">
            <span className="L-cap">{when}</span>
            <span className="L-arc-what">{what}</span>
            <span className="L-arc-note">{note}</span>
          </div>
          <span className="L-arc-lane" aria-hidden />
          <span className="L-arc-art">Art</span>
        </li>
      ))}
    </ol>
  );
}

function Process({ go }: { go: (p: PageId) => void }) {
  return (
    <>
      <PageHead n="01" kicker="The methodology across all three tiers" title="The team process." lede="See the team clearly. Choose the practice together. Ritualize it in the flow of work." />
      <ArcRun>
      <Sec n="02" kicker="Six moves" title="From baseline to standing ritual">
        <ArcMoves />
      </Sec>
      <Sec n="03" kicker="About four months, end to end" title="The arc">
        <ArcTimeline />
        <p className="L-mid">Two ritual keepers are coached every two weeks, and the ritual runs inside work the team already does.</p>
      </Sec>
      </ArcRun>
      <Sec n="04" kicker="Why it holds" title="Elite teams ritualize high-performance practices">
        <p className="L-big">A ritual turns an important behavior into a specific, repeatable practice the team owns and runs.</p>
        <p className="L-mid">Repeated over weeks, it converts intent into the way the team actually operates. The team creates its ritual from its own data, its own context, and its own commitment, which is why it holds.</p>
        <div className="cta-row">
          <button className="btn" onClick={() => go("start")}>Get started <span className="arrow">&rarr;</span></button>
          <button className="btn btn-secondary" onClick={() => go("solutions")}>Ways to engage</button>
        </div>
      </Sec>
    </>
  );
}

/* ------------------------------------------------------------------ */

const KINDS = ["All", "Foundations", "Articles", "Video", "Research"];
const HUBS = ["Capacity", "Team practices", "Rituals", "Measurement"];

function Insights() {
  return (
    <>
      <PageHead n="01" kicker="The education layer" title="Insights." lede="Foundations, articles, video and research in one feed. Start with the foundations if the argument is new to you." />
      <section className="L-sec L-sec-tight">
        <div className="L-wrap">
          <div className="L-filters">
            <div className="L-pills">{KINDS.map((k, i) => <span className={`pill${i === 0 ? " is-accent" : ""}`} key={k}>{k}</span>)}</div>
            <div className="L-pills">{HUBS.map((h) => <span className="pill" key={h}>{h}</span>)}</div>
          </div>
        </div>
      </section>
      <Sec n="02" kicker="Research · distinct treatment" title="Sapien Labs Work Culture Report">
        <div className="L-research-card card">
          <Frame label="Report cover" />
          <div>
            <span className="card-tag">Research · in partnership with Sapien Labs</span>
            <p className="L-mid">The research spine of the site. How the conditions people work in relate to how they feel and how they function, read across countries and industries, and what that means for the teams inside a multi-team organization.</p>
            <a href="#" className="inline-link" onClick={stay}>Read the report</a>
          </div>
        </div>
      </Sec>
      <Sec n="03" kicker="Latest" title="From the feed">
        <div className="L-feed">
          {[
            ["Foundations", "Capacity", "Why teams leak performance", "The environment, not the effort. The argument in one sitting."],
            ["Article", "Rituals", "What a ritual is, and is not", "A repeatable practice the team owns, against a meeting nobody asked for."],
            ["Video", "Measurement", "Reading a TeamQ report", "Thirteen factors, thirteen practices, and the one number that matters."],
            ["Foundations", "Team practices", "The four conditions of a team environment", "Social, autonomous, meaningful, healthy. What each looks like on a Tuesday."],
            ["Article", "Team practices", "Feedback as a practice", "How one leadership team turned the hardest conversation into a habit."],
            ["Video", "Rituals", "Ninety days, one ritual", "What changes when a team commits to a single practice and measures it."],
          ].map(([k, topic, title, stand], i) => (
            <article className="card L-post" key={i}>
              <Frame label={k === "Video" ? "Video still · YouTube or Vimeo embed" : "Illustration"} />
              <span className="card-tag">{k} · {topic}</span>
              <h3>{title}</h3>
              <p>{stand}</p>
              <span className="L-cap">Samuh · draft · {k === "Video" ? "watch" : "read"} time</span>
            </article>
          ))}
        </div>
        <p className="L-cap">Email is offered after the content, never before it.</p>
      </Sec>
    </>
  );
}

/* ------------------------------------------------------------------ */

// photos: the 141px headshots from the current samuh.work, until the
// client sends proper ones. Jake has none there
const TEAM: [string, string, string, string?][] = [
  ["Rahul Varma", "Co-Founder & CEO", "Former CHRO, Accenture Technology.", "/team/rahul-varma.webp"],
  ["Calina Mircea", "Co-Founder & Methodology Lead", "Systemic coach, learning and leadership expert.", "/team/calina-mircea.webp"],
  ["Mike Gabour", "Co-Founder & CTO", "Global analytics strategy and design leader.", "/team/mike-gabour.webp"],
  ["Dr. Tara Thiagarajan", "Chief Scientific Advisor", "Founder, Sapien Labs. Ph.D., Stanford.", "/team/tara-thiagarajan.webp"],
  ["Jake DeBerry", "Lead, Enterprise Growth", "CEB/Gartner, Deloitte, NeuroLeadership Institute."],
];

function About() {
  return (
    <>
      <PageHead n="01" kicker="About" title="A group of people who come together for a purpose larger than themselves." lede="That is what Samuh means in Sanskrit, and it is the standard the work is held to." />
      <Sec n="02" kicker="What we believe" title="Performance is created in teams">
        <p className="L-big">High performance without the cost to people. Sustained performance, where people thriving and results thriving reinforce each other rather than trading off.</p>
        <p className="L-mid">Most organizations invest above the team, in transformations and organization-wide programs, and below it, in individual evaluation and development. The work itself gets done in teams: information flows, trust builds, feedback happens and decisions get made there.</p>
        <p className="L-mid">The environment inside a team shapes how much capacity its people can bring to the work. Samuh shows a team where its capacity is leaking, the team chooses one practice to close the gap, and the change is measured.</p>
      </Sec>
      <Sec n="03" kicker="In partnership with Sapien Labs" title="The research behind the work">
        <div className="L-partner">
          <Frame label="Sapien Labs mark" />
          <div>
            <p className="L-mid">Sapien Labs is the primary partner and the source of the research the site leans on. The Work Culture Report is the research spine, and the intake assessment is built on Sapien Labs team environment factors.</p>
            <p className="L-mid">Sapien Labs&rsquo; MHQ measures mental wellbeing across aspects of functioning and feeling, gathered through the Global Mind Project. TeamQ reads the team environment through it, so what was previously inferred about a team can now be measured.</p>
          </div>
        </div>
      </Sec>
      <Sec n="04" kicker="The people you would be working with" title="Team">
        <div className="L-team">
          {TEAM.map(([name, role, bio, photo]) => (
            <article className="L-person" key={name}>
              {photo ? <Image className="L-person-photo" src={photo} alt={name} width={141} height={141} /> : <Frame label="Photo" />}
              <span className="L-person-name">{name}</span>
              <span className="L-cap">{role}</span>
              <p>{bio}</p>
            </article>
          ))}
        </div>
        <p className="L-mid">An interdisciplinary team spanning enterprise transformation, team practice, data science and human performance research.</p>
      </Sec>
      <Sec n="05" kicker="Partners" title="Channel partners and coaching teams">
        <div className="L-logos">{[0, 1, 2, 3, 4].map((i) => <Frame key={i} label="Partner mark" />)}</div>
      </Sec>
    </>
  );
}

/* ------------------------------------------------------------------ */

function Contact() {
  return (
    <>
      <PageHead n="01" kicker="Contact" title="Tell us about your team." lede="A short form or a call. Either way a person reads it, not a funnel." />
      <section className="L-sec">
        <div className="L-wrap">
          <div className="L-contact">
            <form className="L-form" onSubmit={(e) => e.preventDefault()}>
              <label><span className="L-cap">Name</span><input type="text" placeholder="Your name" /></label>
              <label><span className="L-cap">Email</span><input type="email" placeholder="you@company.com" /></label>
              <label><span className="L-cap">Organization</span><input type="text" placeholder="Where the team works" /></label>
              <label><span className="L-cap">What are you hoping to change?</span><textarea rows={4} placeholder="A sentence or two is plenty" /></label>
              <label><span className="L-cap">Goal</span>
                <select defaultValue=""><option value="" disabled>Choose one</option><option>Understand the model</option><option>Assess a team</option><option>Talk about a 90-day sprint</option><option>Something else</option></select>
              </label>
              <button className="btn" type="submit">Send <span className="arrow">&rarr;</span></button>
              <span className="L-cap">A person reads every message. No newsletter, no drip.</span>
            </form>
            <aside className="L-contact-side">
              <div className="card L-book">
                <span className="card-tag">Talk to us</span>
                <Frame label="Calendar embed" tall />
              </div>
              <div className="L-details">
                <span className="L-cap">Email</span><span>jake@samuh.work</span>
                <span className="L-cap">Partner</span><span>Sapien Labs</span>
                <span className="L-cap">Where</span><span>Working with teams across time zones.</span>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */

function Start({ go }: { go: (p: PageId) => void }) {
  return (
    <section className="L-sec L-intake">
      <div className="L-wrap L-wrap-narrow">
        <div className="L-intake-bar" aria-hidden><span style={{ width: "12%" }} /></div>
        <span className="L-cap">Question 1 · free and ungated · no email to start</span>
        <h1 className="display L-intake-q">How often does your team get the information it needs, when it needs it?</h1>
        <div className="L-scale">
          {[1, 2, 3, 4, 5, 6, 7].map((n) => <button className="opt L-scale-opt" key={n}>{n}</button>)}
        </div>
        <div className="L-scale-ends"><span className="L-cap">Rarely true</span><span className="L-cap">Almost always true</span></div>
        <aside className="card L-insight">
          <span className="card-tag">While you answer</span>
          <p>TeamQ reads thirteen factors of the team environment and thirteen practices. This one is about information flows: whether people hear things from the team, or from the corridor.</p>
        </aside>
        <div className="cta-row">
          <button className="btn">Next <span className="arrow">&rarr;</span></button>
          <button className="btn btn-secondary" onClick={() => go("contact")}>Talk to us instead</button>
        </div>
        <p className="L-cap">Our own intake tool. Not TeamQ, not validated, not diagnostic. Result on screen with a shareable link; email or booking offered after.</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function Page({ id, go }: { id: PageId; go: (p: PageId) => void }) {
  switch (id) {
    case "solutions": return <Solutions go={go} />;
    case "process": return <Process go={go} />;
    case "insights": return <Insights />;
    case "about": return <About />;
    case "contact": return <Contact />;
    case "start": return <Start go={go} />;
    default: return null;
  }
}
