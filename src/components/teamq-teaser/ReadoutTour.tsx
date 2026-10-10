"use client";

import { useEffect, useRef, useState } from "react";
import { Capacity } from "./Capacity";
import type { TeaserResult } from "./TeamQTeaser";
import "./teaser.css";

export type Lit = "days" | "mhq" | "change";

export interface TourStep {
  lit: Lit;
  kicker: string;
  title: string;
  text: string;
}

const one = (value: number) => value.toFixed(1);

/** One frozen readout and one explanation at a time. The whole thing pins
 *  while the visitor scrolls through a track as tall as the steps; the
 *  scroll position picks the step, and each step swaps in where the last
 *  one was, so nothing upcoming shows early. Opacity only, so it reads the
 *  same with reduced motion. */
export function ReadoutTour({ baseline, steps }: { baseline: TeaserResult; steps: TourStep[] }) {
  const [active, setActive] = useState(0);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pick = () => {
      const element = track.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress = scrollable > 0 ? -rect.top / scrollable : 0;
      const index = Math.floor(progress * steps.length);
      setActive(Math.max(0, Math.min(steps.length - 1, index)));
    };
    pick();
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
  }, [steps.length]);

  const lit = steps[active]?.lit ?? "days";
  const dim = (part: Lit) => (lit === "change" || lit === part ? undefined : true);
  const change = lit === "change" || undefined;

  return (
    <div className="tour" ref={track} style={{ "--tour-steps": steps.length } as React.CSSProperties}>
      <div className="tour-stage">
        {steps.map((step, index) => (
          <div className="tour-step" key={step.lit} data-active={index === active || undefined}>
            <div className="tour-head">
              <p className="eyebrow L-eyebrow">{step.kicker}</p>
              <h2 className="sec">{step.title}</h2>
              <p className="tour-count L-cap" aria-hidden="true">
                {index + 1} of {steps.length}
              </p>
            </div>
            <p className="L-mid tour-text">{step.text}</p>
          </div>
        ))}
        <div className="teaser-readout guide-exhibit" aria-hidden="true">
          <div className="teaser-headline" data-dim={dim("days")}>
            <span className="teaser-label">Productive days per month</span>
            <span className="teaser-days">{one(baseline.days)}</span>
            <span className="teaser-delta" data-lit={change}>no change</span>
          </div>
          <Capacity value={baseline.mhq} delta="no change" dim={dim("mhq")} lit={change} />
        </div>
      </div>
    </div>
  );
}
