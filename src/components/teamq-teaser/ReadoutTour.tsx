"use client";

import { useEffect, useRef, useState } from "react";
import type { TeaserResult } from "./TeamQTeaser";
import "./teaser.css";

export type Lit = "days" | "teamQ" | "mhq" | "change";

export interface TourStep {
  lit: Lit;
  kicker: string;
  title: string;
  text: string;
}

const one = (value: number) => value.toFixed(1);

/** One frozen readout that stays put while the explanations scroll past it.
 *  Whichever step is in the middle of the viewport decides which figure is
 *  lit. Opacity only, so it reads the same with reduced motion. */
export function ReadoutTour({ baseline, steps }: { baseline: TeaserResult; steps: TourStep[] }) {
  const [active, setActive] = useState(0);
  const items = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = items.current.indexOf(entry.target as HTMLDivElement);
          if (index >= 0) setActive(index);
        }
      },
      // a step is current while it crosses the middle band of the viewport
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    for (const item of items.current) if (item) observer.observe(item);
    return () => observer.disconnect();
  }, []);

  const lit = steps[active]?.lit ?? "days";
  const dim = (part: Lit) => (lit === "change" || lit === part ? undefined : true);
  const change = lit === "change" || undefined;

  return (
    <div className="tour">
      <div className="tour-steps">
        {steps.map((step, index) => (
          <div
            className="tour-step"
            key={step.lit}
            data-active={index === active || undefined}
            ref={(element) => {
              items.current[index] = element;
            }}
          >
            <p className="eyebrow L-eyebrow">{step.kicker}</p>
            <h2 className="sec">{step.title}</h2>
            <p className="L-mid">{step.text}</p>
          </div>
        ))}
      </div>
      <div className="tour-stage">
        <div className="teaser-readout guide-exhibit" aria-hidden="true">
          <div className="teaser-headline" data-dim={dim("days")}>
            <span className="teaser-label">Productive days per month</span>
            <span className="teaser-days">{one(baseline.days)}</span>
            <span className="teaser-delta" data-lit={change}>no change</span>
          </div>
          <div className="teaser-minor" data-dim={dim("teamQ")}>
            <span className="teaser-label">TeamQ</span>
            <span className="teaser-figure">{one(baseline.teamQ)}</span>
            <span className="teaser-delta" data-lit={change}>no change</span>
          </div>
          <div className="teaser-minor" data-dim={dim("mhq")}>
            <span className="teaser-label">MHQ</span>
            <span className="teaser-figure">{one(baseline.mhq)}</span>
            <span className="teaser-delta" data-lit={change}>no change</span>
          </div>
        </div>
      </div>
    </div>
  );
}
