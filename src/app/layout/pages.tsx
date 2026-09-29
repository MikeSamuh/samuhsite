"use client";

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
  { tag: "Tier 01", name: "Self-guided", what: "Fully automated. The team works through the material on its own.", who: "Teams with a strong leader who want the method without the meetings, and organizations rolling it out across many teams.", get: "The team process, the baseline and the re-measure, and the material to run one ritual for ninety days.", cta: "Price to confirm · or talk to us" },
  { tag: "Tier 02", name: "Supported", what: "Self-guided plus periodic support calls from the Samuh team.", who: "Teams that want a second pair of eyes at the moments that matter: choosing the practice, and the check-in at day 45.", get: "Everything in Self-guided, with scheduled calls to read the data together and keep the ritual on track.", cta: "Talk to us" },
  { tag: "Tier 03", name: "Guided", what: "In person. The Samuh team delivers the work hands on.", who: "Leadership teams and mission-critical teams where the stakes justify having us in the room.", get: "Confidential interviews, a facilitated day one, coaching for two ritual keepers every two weeks, and the close.", cta: "Talk to us" },
];

function Solutions({ go }: { go: (p: PageId) => void }) {
  return (
    <>
      <PageHead n="01" kicker="Three ways to engage" title="Same process, three levels of support." lede="One methodology, the team process, delivered with as much or as little of us in the room as the team needs. Organization-wide work layers on top of it." />
      {TIERS.map((t, i) => (
        <Sec key={t.name} n={`0${i + 2}`} kicker={t.tag} title={t.name} id={t.name.toLowerCase()} cls="L-tier-sec">
          <div className="L-tier">
            <div>
              <span className="L-cap L-tier-k">What it is</span>
              <p className="L-mid">{t.what}</p>
            </div>
            <div>
              <span className="L-cap L-tier-k">Who it is for</span>
              <p className="L-mid">{t.who}</p>
            </div>
            <div>
              <span className="L-cap L-tier-k">What you get</span>
              <p className="L-mid">{t.get}</p>
            </div>
            <div className="L-tier-cta">
              <a href="#" className="inline-link L-text-cta" onClick={(e) => { stay(e); go("contact"); }}>Talk to us <span className="arrow">&rarr;</span></a>
            </div>
          </div>
        </Sec>
      ))}
      <Sec n="05" kicker="Trust before proof" title="What teams say">
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

const STEPS = [
  ["Prepare", "Baseline the team before anything changes."],
  ["Launch", "Put the practices into the working week."],
  ["Discover", "Surface what the team does under load."],
  ["Awareness", "Name the patterns nobody could see."],
  ["Belonging", "Build the conditions people stay for."],
  ["Action", "Turn insight into standing rituals."],
];

const ARC = [
  ["Pre-sprint month", "Discovery + TeamQ", "Confidential interviews and a TeamQ baseline."],
  ["Day 1", "Agree goals, co-create the ritual", "The team reviews its findings and designs one practice it owns."],
  ["Day 45", "Refine the ritual", "A check-in to see how the practice is landing, and adjust."],
  ["Day 90", "Re-measure and close", "TeamQ is repeated and change is measured against the baseline."],
];


/**
 * The arc run: sections 02 and 03 of the process page share one line, in
 * gold. It comes in from the left above the first row of moves, runs
 * across, turns down and comes back between the rows, turns down the left
 * side, comes back under the second row to the gap between the first two
 * columns, and drops into the arc, where it winds down like a backwards S,
 * bowing right then left. Corners are rounded, so it reads as one fluid
 * line. Everything is measured from the DOM.
 *
 * One ball rides the line: the point of the line nearest the pointer (the
 * middle of the view when there is no pointer), eased a little behind it.
 * Whatever it is beside lights up, the move or the arc point, and the icon
 * there glows. No other marks on the line. Reduced motion drops the easing.
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
    let listTop = 0;
    let ys: number[] = [];
    let items: HTMLElement[] = [];
    let steps: { el: HTMLElement; cx: number; cy: number; r: DOMRect }[] = [];

    const measure = () => {
      const box = run.getBoundingClientRect();
      const rel = (r: DOMRect) => new DOMRect(r.left - box.left, r.top - box.top, r.width, r.height);
      const list = run.querySelector<HTMLElement>(".L-arc");
      const lane = run.querySelector<HTMLElement>(".L-arc-lane");
      if (!list || !lane) return;
      const lr = rel(list.getBoundingClientRect());
      const la = rel(lane.getBoundingClientRect());
      listTop = lr.top;
      const listH = Math.max(1, lr.height);
      const cx = la.left + la.width / 2;
      const amp = Math.max(0, la.width / 2 - 14);
      items = Array.from(run.querySelectorAll<HTMLElement>(".L-arc-item"));
      ys = Array.from(run.querySelectorAll<HTMLElement>(".L-arc-lane")).map((el) => { const r = rel(el.getBoundingClientRect()); return r.top + r.height / 2; });

      // the S: a cosine from its first crest, a quarter of the way down the
      // list, where it is rightmost and level
      const crest = listTop + listH / 4;
      const sAt = (y: number) => cx + amp * Math.cos((2 * Math.PI * (y - crest)) / listH);

      const stepEls = Array.from(run.querySelectorAll<HTMLElement>(".L-step"));
      const rects = stepEls.map((el) => rel(el.getBoundingClientRect()));
      steps = stepEls.map((el, i) => ({ el, r: rects[i], cx: rects[i].left + rects[i].width / 2, cy: rects[i].top + rects[i].height / 2 }));
      const grid = run.querySelector<HTMLElement>(".L-steps");
      const g = grid ? rel(grid.getBoundingClientRect()) : null;
      const twoCols = rects.length > 1 && rects[1].left > rects[0].right;

      let d = "";
      let sweepFrom = listTop;   // where the line hands over to the S
      let fromX = cx;
      if (g && twoCols) {
        // channels: above row one, between the rows, below row two
        const rows: { top: number; bottom: number }[] = [];
        rects.forEach((r) => { const row = rows.find((q) => Math.abs(q.top - r.top) < 4); if (row) row.bottom = Math.max(row.bottom, r.bottom); else rows.push({ top: r.top, bottom: r.bottom }); });
        rows.sort((a, b) => a.top - b.top);
        const yTop = Math.max(g.top + 2, rows[0].top - 22);
        const yMid = rows.length > 1 ? (rows[0].bottom + rows[1].top) / 2 : rows[0].bottom + 30;
        const yBot = rows[rows.length - 1].bottom + 30;
        // the turns sit in the gutters, and never past the run's edges
        const xl = Math.max(14, g.left - 36);
        const xr = Math.min(box.width - 14, g.right + 36);
        const gapX = (rects[0].right + rects[1].left) / 2;
        const corners = [[xl, yTop], [xr, yTop], [xr, yMid], [xl, yMid], [xl, yBot], [gapX, yBot], [gapX, yBot + 60]];
        d = rounded(corners, 30);
        sweepFrom = yBot + 60;
        fromX = gapX;
      }
      // the sweep from the moves to the crest eases in, level at both ends,
      // then the S takes over
      const n = Math.max(12, Math.round((crest - sweepFrom) / 6));
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        const e = t * t * (3 - 2 * t);
        const y = sweepFrom + (crest - sweepFrom) * t;
        const x = fromX + (sAt(crest) - fromX) * e;
        d += `${d ? " L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`;
      }
      const m = Math.max(12, Math.round((lr.bottom - crest) / 5));
      for (let i = 1; i <= m; i++) {
        const y = crest + (lr.bottom - crest) * (i / m);
        d += ` L ${sAt(y).toFixed(1)} ${y.toFixed(1)}`;
      }
      // the line fades out over its last stretch
      const fade = svg.querySelector<SVGRectElement>(".L-arc-end-fade");
      if (fade) { fade.setAttribute("y", String(lr.bottom - 120)); fade.setAttribute("height", "120"); fade.setAttribute("width", String(box.width)); }
      const solid = svg.querySelector<SVGRectElement>(".L-arc-end-solid");
      if (solid) { solid.setAttribute("width", String(box.width)); solid.setAttribute("height", String(Math.max(0, lr.bottom - 120))); }
      svg.setAttribute("viewBox", `0 0 ${box.width} ${lr.bottom}`);
      svg.setAttribute("width", String(box.width));
      svg.setAttribute("height", String(lr.bottom));
      path.setAttribute("d", d);
      // sample it for the ball
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
    let lastOn = "";
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
      const i = Math.min(pts.length - 1, Math.max(0, Math.round(at)));
      const q = pts[i];
      ball.setAttribute("transform", `translate(${q.x.toFixed(1)} ${q.y.toFixed(1)})`);

      // what the ball is beside: the nearest move whose reach it is in, or
      // the arc point it is level with
      let step = -1;
      let sd = Infinity;
      steps.forEach((st, j) => {
        const inside = q.x > st.r.left - 44 && q.x < st.r.right + 44 && q.y > st.r.top - 44 && q.y < st.r.bottom + 44;
        if (!inside) return;
        const dd = (st.cx - q.x) ** 2 + (st.cy - q.y) ** 2;
        if (dd < sd) { sd = dd; step = j; }
      });
      const near = q.y >= listTop - 20 ? ys.reduce((best, py2, j) => (Math.abs(py2 - q.y) < 46 && (best < 0 || Math.abs(py2 - q.y) < Math.abs(ys[best] - q.y)) ? j : best), -1) : -1;
      const key = `${step}:${near}`;
      if (key !== lastOn) {
        lastOn = key;
        steps.forEach((st, j) => st.el.toggleAttribute("data-on", j === step));
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
          <linearGradient id="L-arc-end-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id="L-arc-end" maskUnits="userSpaceOnUse" x="0" y="0" width="100000" height="100000">
            <rect className="L-arc-end-solid" x="0" y="0" width="0" height="0" fill="#fff" />
            <rect className="L-arc-end-fade" x="0" y="0" width="0" height="0" fill="url(#L-arc-end-grad)" />
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

/** A polyline through the corners with each corner rounded to radius r:
 *  straight to r short of the corner, a quadratic through it, on. */
function rounded(corners: number[][], r: number) {
  let d = `M ${corners[0][0].toFixed(1)} ${corners[0][1].toFixed(1)}`;
  for (let i = 1; i < corners.length - 1; i++) {
    const [px, py] = corners[i - 1];
    const [x, y] = corners[i];
    const [nx, ny] = corners[i + 1];
    const inL = Math.hypot(x - px, y - py) || 1;
    const outL = Math.hypot(nx - x, ny - y) || 1;
    const rr = Math.min(r, inL / 2, outL / 2);
    const ax = x - ((x - px) / inL) * rr;
    const ay = y - ((y - py) / inL) * rr;
    const bx = x + ((nx - x) / outL) * rr;
    const by = y + ((ny - y) / outL) * rr;
    d += ` L ${ax.toFixed(1)} ${ay.toFixed(1)} Q ${x.toFixed(1)} ${y.toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)}`;
  }
  const [lx, ly] = corners[corners.length - 1];
  d += ` L ${lx.toFixed(1)} ${ly.toFixed(1)}`;
  return d;
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
      <Sec n="02" kicker="Six moves · icons to come" title="From baseline to standing ritual">
        <div className="L-steps">
          {STEPS.map(([name, note], i) => (
            <div className="step L-step" key={name}>
              <span className="step-n">0{i + 1}</span>
              <Frame label="Icon" />
              <span className="step-name">{name}</span>
              <span className="step-note">{note}</span>
            </div>
          ))}
        </div>
        <p className="L-cap">Step names from the kickoff. Structure to confirm with SAMUH.</p>
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
      <Sec n="05" kicker="TBA" title="Channel partners and coaching teams">
        <div className="L-logos">{[0, 1, 2, 3, 4].map((i) => <Frame key={i} label="Partner mark · contract check first" />)}</div>
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
