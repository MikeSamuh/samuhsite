"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/site";
import type { HomeContent } from "@/lib/content/defaults";
import { OrgFigure, type OrgLevel } from "./people";

const HEAD_TOP = 28; // the sticky head's offset below the nav, as in layout.css

/** Which of a section's items the reader is on: the last one whose top has
 *  passed a line `below` px under the stuck head. One scroll listener,
 *  one frame at a time. Who we work with and the sprint's stages both
 *  read it. */
export function useActiveItem(ref: React.RefObject<HTMLElement | null>, selector: string, below: number) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>(selector));
    if (!items.length) return;
    let raf = 0;
    const tick = () => {
      raf = 0;
      const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 0;
      const line = navH + HEAD_TOP + below;
      let i = 0;
      items.forEach((el, j) => { if (el.getBoundingClientRect().top <= line) i = j; });
      setActive(i);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const ro = new ResizeObserver(kick);
    ro.observe(root);
    kick();
    window.addEventListener("scroll", kick, { passive: true });
    return () => { ro.disconnect(); cancelAnimationFrame(raf); window.removeEventListener("scroll", kick); };
  }, [ref, selector, below]);
  return active;
}

const LEVELS: OrgLevel[] = ["one", "team", "teams"];

/** Who we work with, on the home since the sitemap of 11 Nov 2026 (it was
 *  Solutions' section 02): the org chart stays on the left and builds as
 *  the page scrolls: one person alone at first, then the team arrives
 *  under it and takes the light, then the teams. A level not yet reached
 *  is not shown; one already passed stays, dimmed. On the right the three
 *  levels scroll past. On a narrow page the chart is off and each level
 *  carries its own figure. The circles follow it. The section element is
 *  the caller's: this is what goes in its wrap. */
export function Who({ c, n }: { c: HomeContent["who"]; /** the section number, when numbers are on */ n: string }) {
  const ref = useRef<HTMLOListElement>(null);
  const active = useActiveItem(ref, ".L-who-item", 120);
  return (
    <>
      <div className="L-head">
        <span className="L-n">{n}</span>
        <div>
          <p className="eyebrow L-eyebrow">{c.kicker}</p>
          <h2 className="sec">{c.title}</h2>
        </div>
        <span className="L-who-chart" aria-hidden>
          {c.items.map((it, i) => (
            <span className="L-who-node" key={it.name} data-on={i === active ? "" : undefined} data-wait={i > active ? "" : undefined}><OrgFigure level={LEVELS[i] ?? "teams"} /></span>
          ))}
        </span>
      </div>
      <ol className="L-who-list" ref={ref}>
        {c.items.map((it, i) => (
          <li className="L-who-item" key={it.name} data-on={i === active ? "" : undefined}>
            <span className="L-who-art"><OrgFigure level={LEVELS[i] ?? "teams"} /></span>
            <h3 className="L-who-name">{it.name}</h3>
            <span className="L-who-who">{it.who}</span>
            <p className="L-mid">{it.line}</p>
            <Link className="inline-link" href={`${ROUTES.solutions}#${it.door}`}>{it.link} <span className="arrow">&rarr;</span></Link>
          </li>
        ))}
      </ol>
      <p className="L-mid">{c.coaches} <Link className="inline-link" href={ROUTES.contact}>{c.coachesLink}</Link></p>
    </>
  );
}
