"use client";

import { useEffect, useRef, useState } from "react";
import { BASELINE, FACTORS, TEAM_SIZE } from "./model";

// Home section 9: the tool, shown rather than offered. Three bars move to
// where the optimizer puts them and the readout follows, on a loop, with
// nothing to touch. Every number comes from score() and
// bestForProductiveDays() on the server, passed in by the page. Nothing here
// is typed in. See CLAUDE.md rules 1 and 4.

export interface DemoScore {
  teamQ: number;
  mhq: number;
  days: number;
}

export interface DemoAnswer {
  values: Record<string, number>;
  levers: { id: string; label: string; value: number }[];
  score: DemoScore;
}

export interface TeaserDemoProps {
  baseline: DemoScore;
  answer: DemoAnswer;
}

const one = (value: number) => value.toFixed(1);

/** The simulator's rule: a change under 0.05 rounds to nothing, so say so. */
function change(now: number, base: number, unit = ""): string {
  const delta = now - base;
  if (Math.abs(delta) < 0.05) return "no change";
  return `${delta > 0 ? "+" : "−"}${one(Math.abs(delta))}${unit}`;
}

/** "Work-Life Balance to 9, Flow of Information to 9 and Reward & Recognition to 9" */
function list(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/* the timeline, in ms */
const LEAD_IN = 700;
const PER_BAR = 950;
const ROLL = 900;
const HOLD = 3400;
const RESET = 1500;

/** A number that rolls from where it was to `target` over `ms`, or snaps
 *  when rolling is off. */
function useRolling(target: number, ms: number, roll: boolean): number {
  const [shown, setShown] = useState(target);
  const shownRef = useRef(target);
  useEffect(() => {
    if (!roll) {
      shownRef.current = target;
      setShown(target);
      return;
    }
    const from = shownRef.current;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      shownRef.current = from + (target - from) * eased;
      setShown(shownRef.current);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms, roll]);
  return shown;
}

export function TeaserDemo({ baseline, answer }: TeaserDemoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);
  const [inView, setInView] = useState(false);
  /** how many of the levers have moved */
  const [step, setStep] = useState(0);
  /** the readout has caught up with the levers */
  const [landed, setLanded] = useState(false);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setReduced(mq.matches);
    read();
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (!entry.isIntersecting) {
          setStep(0);
          setLanded(false);
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // the loop. Reduced motion shows the end state and stays there
  const count = answer.levers.length;
  useEffect(() => {
    if (reduced) {
      setStep(count);
      setLanded(true);
      return;
    }
    if (!inView) return;
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    let t = LEAD_IN;
    for (let i = 1; i <= count; i += 1) {
      at(t, () => setStep(i));
      t += PER_BAR;
    }
    at(t, () => setLanded(true));
    t += ROLL + HOLD;
    at(t, () => {
      setStep(0);
      setLanded(false);
    });
    t += RESET;
    at(t, () => setCycle((c) => c + 1));
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [inView, reduced, cycle, count]);

  const shown = landed ? answer.score : baseline;
  const days = useRolling(shown.days, ROLL, !reduced);
  const teamQ = useRolling(shown.teamQ, ROLL, !reduced);
  const mhq = useRolling(shown.mhq, ROLL, !reduced);

  return (
    <div className="teaser-demo" ref={ref}>
      <p className="demo-sr">
        A demonstration team of {TEAM_SIZE}. Moving {list(answer.levers.map((l) => `${l.label} to ${l.value}`))} takes
        them from {one(baseline.days)} to {one(answer.score.days)} productive days a month.
      </p>
      <div className="demo-bars" aria-hidden="true">
        {answer.levers.map((lever, i) => {
          const factor = FACTORS.find((f) => f.id === lever.id);
          if (!factor) return null;
          const moved = step > i;
          const value = moved ? lever.value : BASELINE[lever.id];
          const fill = ((value - factor.min) / (factor.max - factor.min)) * 100;
          return (
            <div className="demo-bar" data-moved={moved} key={lever.id}>
              <span className="demo-bar-label">{lever.label}</span>
              <span className="demo-bar-value">{value}</span>
              <span className="demo-track" style={{ "--fill": `${fill}%` } as React.CSSProperties}>
                <span className="demo-fill" />
                <span className="demo-thumb" />
              </span>
            </div>
          );
        })}
      </div>
      <div className="teaser-readout demo-readout" data-landed={landed} aria-hidden="true">
        <div className="teaser-headline">
          <span className="teaser-label">Productive days per month</span>
          <span className="teaser-days">{one(days)}</span>
          <span className="teaser-delta">{change(shown.days, baseline.days, " days")}</span>
        </div>
        <div className="teaser-minor">
          <span className="teaser-label">TeamQ</span>
          <span className="teaser-figure">{one(teamQ)}</span>
          <span className="teaser-delta">{change(shown.teamQ, baseline.teamQ)}</span>
        </div>
        <div className="teaser-minor">
          <span className="teaser-label">MHQ</span>
          <span className="teaser-figure">{one(mhq)}</span>
          <span className="teaser-delta">{change(shown.mhq, baseline.mhq)}</span>
        </div>
      </div>
    </div>
  );
}
