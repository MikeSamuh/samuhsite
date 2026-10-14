"use client";

import { useEffect, useRef, useState } from "react";
import { Capacity } from "./Capacity";
import { BASELINE, FACTORS, GROUP_LABELS, LIFESTYLE_HINTS, type Factor } from "./model";
import type { TeaserResult } from "./TeamQTeaser";
import "./teaser.css";

/** which part of the tool a step lights */
export type Lit = "days" | "mhq" | "work" | "life";

export interface TourStep {
  lit: Lit;
  kicker: string;
  title: string;
  text: string;
}

const one = (value: number) => value.toFixed(1);

/** how many work sliders the exhibit shows; the rest are named as a count */
const WORK_SHOWN = 4;

/** One slider, frozen at the baseline. Decorative. */
function SliderExhibit({ factor }: { factor: Factor }) {
  const value = BASELINE[factor.id];
  const fill = ((value - factor.min) / (factor.max - factor.min)) * 100;
  const hint = LIFESTYLE_HINTS[factor.id];
  return (
    <div className="teaser-input">
      <span className="guide-exhibit-label">{factor.label}</span>
      <span className="teaser-value">{value}</span>
      <input className="teaser-range" type="range" min={factor.min} max={factor.max} step={factor.step} value={value} readOnly tabIndex={-1} style={{ "--fill": `${fill}%` } as React.CSSProperties} />
      {hint ? <span className="teaser-note">{hint}</span> : null}
    </div>
  );
}

/** One frozen copy of the tool and one explanation at a time. The whole
 *  thing pins while the visitor scrolls through a track as tall as the
 *  steps; the scroll position picks the step, each step swaps in where the
 *  last one was, and the part of the tool the step is about is the one
 *  left lit. Opacity only, so it reads the same with reduced motion. */
export function ToolTour({ baseline, steps }: { baseline: TeaserResult; steps: TourStep[] }) {
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
  const dim = (part: Lit) => (lit === part ? undefined : true);
  const work = FACTORS.filter((factor) => factor.group === "environment");
  const life = FACTORS.filter((factor) => factor.group === "lifestyle");

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
        <div className="tour-exhibit guide-exhibit" aria-hidden="true">
          <div className="tour-sliders">
            <div className="tour-group" data-dim={dim("work")}>
              <span className="tour-legend">{GROUP_LABELS.environment}</span>
              {work.slice(0, WORK_SHOWN).map((factor) => (
                <SliderExhibit factor={factor} key={factor.id} />
              ))}
              <span className="tour-more">and {work.length - WORK_SHOWN} more</span>
            </div>
            <div className="tour-group" data-dim={dim("life")}>
              <span className="tour-legend">{GROUP_LABELS.lifestyle}</span>
              {life.map((factor) => (
                <SliderExhibit factor={factor} key={factor.id} />
              ))}
            </div>
          </div>
          <div className="teaser-readout">
            <div className="teaser-headline" data-dim={dim("days")}>
              <span className="teaser-label">Productive days per month</span>
              <span className="teaser-days">{one(baseline.days)}</span>
              <span className="teaser-delta">no change</span>
            </div>
            <Capacity value={baseline.mhq} delta="no change" dim={dim("mhq")} />
          </div>
        </div>
      </div>
    </div>
  );
}
