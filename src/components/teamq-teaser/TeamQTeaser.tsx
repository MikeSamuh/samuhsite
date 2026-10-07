"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Field } from "@/components/lead/Field";
import { Honeypot } from "@/components/lead/Honeypot";
import { Turnstile } from "@/components/lead/Turnstile";
import { useLeadSubmit } from "@/components/lead/useLeadSubmit";
import { track } from "@/lib/analytics";
import { CONTACT_EMAIL } from "@/lib/contact-details";
import { EMAIL_SHAPE } from "@/lib/lead";
import {
  BASELINE,
  BASELINE_AVERAGES,
  CHALLENGE_MOVES,
  FACTORS,
  GROUP_LABELS,
  LIFESTYLE_HINTS,
  LIFESTYLE_OPTIONS,
  MODEL_VERIFIED,
  TEAM_SIZE,
  type Factor,
} from "./model";
import "./teaser.css";

/** What /api/teaser returns for one slider setting. */
export interface TeaserResult {
  teamQ: number;
  mhq: number;
  days: number;
}

type Values = Record<string, number>;

/** The optimizer's best setting for productive days within CHALLENGE_MOVES. */
export interface Answer extends TeaserResult {
  values: Values;
  levers: { id: string; label: string; value: number }[];
}

/** long enough to skip the settings a dragged slider passes through */
const SETTLE_MS = 120;

const one = (value: number) => value.toFixed(1);

/** The simulator's rule: a change under 0.05 rounds to nothing, so say so. */
function change(now: number, base: number, unit = ""): string {
  const delta = now - base;
  if (Math.abs(delta) < 0.05) return "no change";
  return `${delta > 0 ? "+" : "−"}${one(Math.abs(delta))}${unit}`;
}

const atBaseline = (values: Values) =>
  FACTORS.every((factor) => values[factor.id] === BASELINE[factor.id]);

const movedCount = (values: Values) =>
  FACTORS.filter((factor) => values[factor.id] !== BASELINE[factor.id]).length;

/** "Pride & Purpose, Exercise and Job Security" */
function list(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/** Flow 2. The simulator's team mode on a demonstration team: eleven inputs,
 *  a live readout, a challenge with an answer, and the ask after the answer.
 *  Nothing is gated. Spec: docs/sprint-intakes.md, "Flow 2". */
export function TeamQTeaser({ baseline, answer }: { baseline: TeaserResult; answer: Answer }) {
  const [values, setValues] = useState<Values>(BASELINE);
  const [result, setResult] = useState<TeaserResult>(baseline);
  const [stale, setStale] = useState(false);
  const [failed, setFailed] = useState(false);
  const [touched, setTouched] = useState(false);
  const [best, setBest] = useState<number>();
  /** the visitor's setting and score, frozen when they submit */
  const [submitted, setSubmitted] = useState<{ values: Values; result: TeaserResult }>();
  const revealed = submitted !== undefined;
  const answerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (revealed) answerRef.current?.focus();
  }, [revealed]);

  useEffect(() => {
    if (!MODEL_VERIFIED) return;
    if (atBaseline(values)) {
      setResult(baseline);
      setStale(false);
      setFailed(false);
      return;
    }

    setStale(true);
    const request = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/teaser", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ values }),
          signal: request.signal,
        });
        const scored: TeaserResult & { ok?: boolean } = await response.json();
        if (!response.ok || !scored.ok) throw new Error(`teaser rejected: ${response.status}`);
        setResult({ teamQ: scored.teamQ, mhq: scored.mhq, days: scored.days });
        setStale(false);
        setFailed(false);
        // the visitor's best within the rules. `values` is the setting this
        // score is for, so a figure never credits a different setting
        const moved = movedCount(values);
        if (moved > 0 && moved <= CHALLENGE_MOVES && !revealed) {
          setBest((current) => (current === undefined || scored.days > current ? scored.days : current));
        }
      } catch {
        if (request.signal.aborted) return;
        setStale(false);
        setFailed(true);
      }
    }, SETTLE_MS);

    return () => {
      window.clearTimeout(timer);
      request.abort();
    };
  }, [values, baseline, revealed]);

  const move = (factor: Factor, value: number) => {
    setValues((current) => ({ ...current, [factor.id]: value }));
    if (!touched) {
      setTouched(true);
      track("teaser_interact", { factor: factor.id });
    }
  };

  const submitAnswer = () => {
    setSubmitted({ values, result });
    setValues(answer.values);
  };

  const environment = FACTORS.filter((factor) => factor.group === "environment");
  const lifestyle = FACTORS.filter((factor) => factor.group === "lifestyle");
  const moves = movedCount(values);

  return (
    <div className="teaser">
      {MODEL_VERIFIED ? (
        <div className="teaser-challenge">
          <p className="teaser-challenge-title">
            Your challenge: can you optimize for productive days?
          </p>
          <p>
            Move up to {CHALLENGE_MOVES} factors and give this team of {TEAM_SIZE} the most productive days you
            can. Then submit your answer and see how close you came to the model&rsquo;s own {CHALLENGE_MOVES}{" "}
            moves.
          </p>
          <p className="teaser-challenge-status" aria-live="polite">
            {revealed
              ? "The optimized profile is applied below."
              : moves === 0
                ? "Nothing moved yet."
                : `${moves} of ${CHALLENGE_MOVES} factors moved${moves > CHALLENGE_MOVES ? ", which is more than the challenge allows" : ""}.${best !== undefined ? ` Your best so far: ${one(best)} days.` : ""}`}
          </p>
        </div>
      ) : null}

      {MODEL_VERIFIED ? (
        <div className="teaser-readout" data-stale={stale} aria-live="polite" aria-atomic="true">
          <div className="teaser-headline">
            <span className="teaser-label">Productive days per month</span>
            <span className="teaser-days">{one(result.days)}</span>
            <span className="teaser-delta">{change(result.days, baseline.days, " days")}</span>
          </div>
          <div className="teaser-minor">
            <span className="teaser-label">TeamQ</span>
            <span className="teaser-figure">{one(result.teamQ)}</span>
            <span className="teaser-delta">{change(result.teamQ, baseline.teamQ)}</span>
          </div>
          <div className="teaser-minor">
            <span className="teaser-label">MHQ</span>
            <span className="teaser-figure">{one(result.mhq)}</span>
            <span className="teaser-delta">{change(result.mhq, baseline.mhq)}</span>
          </div>
          {failed ? (
            <p className="teaser-failed" role="alert">
              That change could not be scored. These are the last figures we have.
            </p>
          ) : null}
        </div>
      ) : (
        <Gauge values={values} />
      )}

      <div className="teaser-inputs">
        <fieldset className="teaser-group">
          <legend>{GROUP_LABELS.environment}</legend>
          {environment.map((factor) => (
            <Slider key={factor.id} factor={factor} value={values[factor.id]} onChange={move} />
          ))}
        </fieldset>
        <fieldset className="teaser-group">
          <legend>{GROUP_LABELS.lifestyle}</legend>
          {lifestyle.map((factor) => (
            <Choice key={factor.id} factor={factor} value={values[factor.id]} onChange={move} />
          ))}
          <button
            className="btn btn-secondary teaser-reset"
            type="button"
            onClick={() => setValues(BASELINE)}
            disabled={atBaseline(values)}
          >
            Reset
          </button>
        </fieldset>
      </div>

      {MODEL_VERIFIED ? (
        <div className="teaser-answer" ref={answerRef} tabIndex={-1}>
          {submitted ? (
            <Comparison yours={submitted} answer={answer} baseline={baseline} />
          ) : (
            <>
              <p className="L-mid">Happy with your moves? Submit and see the optimized profile next to yours.</p>
              <button className="btn" type="button" onClick={submitAnswer} disabled={moves === 0 || moves > CHALLENGE_MOVES}>
                Submit my answer <span className="arrow">&rarr;</span>
              </button>
              {moves === 0 ? (
                <span className="teaser-note">Move at least one factor first.</span>
              ) : moves > CHALLENGE_MOVES ? (
                <span className="teaser-note">
                  Put {moves - CHALLENGE_MOVES} {moves - CHALLENGE_MOVES === 1 ? "factor" : "factors"} back to submit. The challenge
                  allows {CHALLENGE_MOVES}.
                </span>
              ) : null}
            </>
          )}
        </div>
      ) : null}

      {revealed || !MODEL_VERIFIED ? <Ask values={values} /> : null}
    </div>
  );
}

function Slider({ factor, value, onChange }: { factor: Factor; value: number; onChange: (factor: Factor, value: number) => void }) {
  const id = `teaser-${factor.id}`;
  const fill = ((value - factor.min) / (factor.max - factor.min)) * 100;
  return (
    <div className="teaser-input">
      <label htmlFor={id}>{factor.label}</label>
      <output htmlFor={id} className="teaser-value">
        {value}
      </output>
      <input
        id={id}
        className="teaser-range"
        type="range"
        min={factor.min}
        max={factor.max}
        step={factor.step}
        value={value}
        onChange={(event) => onChange(factor, Number(event.target.value))}
        aria-describedby={`${id}-note`}
        style={{ "--fill": `${fill}%` } as React.CSSProperties}
      />
      <span className="teaser-note" id={`${id}-note`}>
        Baseline avg: {one(BASELINE_AVERAGES[factor.id])}
      </span>
    </div>
  );
}

function Choice({ factor, value, onChange }: { factor: Factor; value: number; onChange: (factor: Factor, value: number) => void }) {
  const id = `teaser-${factor.id}`;
  return (
    <div className="teaser-input teaser-choice">
      <label htmlFor={id}>{factor.label}</label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(factor, Number(event.target.value))}
        aria-describedby={`${id}-note`}
      >
        {LIFESTYLE_OPTIONS[factor.id].map((label, index) => (
          <option key={label} value={index + 1}>
            {label}
          </option>
        ))}
      </select>
      <span className="teaser-note" id={`${id}-note`}>
        Baseline avg: {one(BASELINE_AVERAGES[factor.id])} · {LIFESTYLE_HINTS[factor.id]}
      </span>
    </div>
  );
}

/** Shown in place of every number while the model is unverified. It moves
 *  with the inputs and claims nothing. */
function Gauge({ values }: { values: Values }) {
  const level =
    FACTORS.reduce((sum, factor) => sum + (values[factor.id] - factor.min) / (factor.max - factor.min), 0) /
    FACTORS.length;
  return (
    <div className="teaser-readout">
      <div className="teaser-headline">
        <span className="teaser-label">Productive days per month</span>
        <span className="teaser-gauge" role="img" aria-label="A gauge that rises as the factors improve">
          <span style={{ width: `${level * 100}%` }} />
        </span>
        <span className="teaser-pending">TODO(content): model pending</span>
      </div>
    </div>
  );
}

type Verdict = "match" | "close" | "off" | "extra";

const VERDICTS: Record<Verdict, string> = {
  match: "Spot on",
  close: "Close",
  off: "Missed",
  extra: "Not needed",
};

/** The optimized profile next to what the visitor submitted, factor by
 *  factor, for every factor either of them moved. */
function Comparison({ yours, answer, baseline }: { yours: { values: Values; result: TeaserResult }; answer: Answer; baseline: TeaserResult }) {
  const rows = FACTORS.filter(
    (factor) => yours.values[factor.id] !== BASELINE[factor.id] || answer.values[factor.id] !== BASELINE[factor.id],
  ).map((factor) => {
    const mine = yours.values[factor.id];
    const optimal = answer.values[factor.id];
    const modelMoved = optimal !== BASELINE[factor.id];
    const verdict: Verdict = !modelMoved ? "extra" : mine === optimal ? "match" : Math.abs(mine - optimal) <= 1 ? "close" : "off";
    return { factor, mine, optimal, verdict };
  });
  const hits = rows.filter((row) => row.verdict === "match" || row.verdict === "close").length;

  return (
    <>
      <p className="teaser-ask-title">The optimized profile, next to yours.</p>
      <p className="L-mid">
        You got this team to <strong>{one(yours.result.days)} productive days</strong>. The model&rsquo;s{" "}
        {CHALLENGE_MOVES} moves, {list(answer.levers.map((lever) => lever.label))}, get it to{" "}
        <strong>{one(answer.days)}</strong>, {change(answer.days, baseline.days)} on today. You were on or near{" "}
        {hits} of the {CHALLENGE_MOVES}.
      </p>
      <table className="teaser-compare">
        <thead>
          <tr>
            <th scope="col">Factor</th>
            <th scope="col">Today</th>
            <th scope="col">You</th>
            <th scope="col">Optimized</th>
            <th scope="col">
              <span className="sr-only">Verdict</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ factor, mine, optimal, verdict }) => (
            <tr key={factor.id} data-verdict={verdict}>
              <th scope="row">{factor.label}</th>
              <td>{BASELINE[factor.id]}</td>
              <td>{mine}</td>
              <td>{optimal}</td>
              <td className="teaser-verdict">{VERDICTS[verdict]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="L-mid">
        That is this demonstration team. Every team leaks somewhere different, which is why the first step with a
        real team is finding out where.
      </p>
    </>
  );
}

/** The optional ask. It appears once the visitor has moved something and
 *  never stands between them and the readout. */
function Ask({ values }: { values: Values }) {
  const { submit, state, attempt } = useLeadSubmit("teaser");
  const [error, setError] = useState<string>();
  const [token, setToken] = useState<string>();
  const form = useRef<HTMLFormElement>(null);
  const success = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state === "done") success.current?.focus();
  }, [state]);

  if (state === "done") {
    return (
      <div className="teaser-ask teaser-done" ref={success} tabIndex={-1} role="status">
        <h2 className="teaser-ask-title">Thank you.</h2>
        <p>A person at SAMUH will be in touch about your team.</p>
        <Link className="btn btn-secondary" href="/talk">
          Or book a time <span className="arrow">&rarr;</span>
        </Link>
      </div>
    );
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = (field: string) => String(data.get(field) ?? "").trim();
    const email = text("email");

    const found = !email
      ? "Enter your email address."
      : !EMAIL_SHAPE.test(email)
        ? "Enter an email address like name@company.com."
        : undefined;
    setError(found);
    if (found) {
      form.current?.querySelector<HTMLElement>('[name="email"]')?.focus();
      return;
    }

    void submit({
      email,
      name: text("name") || undefined,
      organization: text("organization") || undefined,
      answers: values,
      company_website: text("company_website") || undefined,
      turnstileToken: token,
    });
  };

  const pending = state === "pending";

  return (
    <section className="teaser-ask" aria-labelledby="teaser-ask-title">
      <div>
        <h2 className="teaser-ask-title" id="teaser-ask-title">
          Want to get your team&rsquo;s TeamQ?
        </h2>
        <p>Leave your details and a person at SAMUH will be in touch about measuring your team.</p>
      </div>
      <form className="lead-form" ref={form} onSubmit={onSubmit} noValidate>
        <Field label="Email" name="email" type="email" autoComplete="email" required error={error} />
        <Field label="Name" name="name" autoComplete="name" />
        <Field label="Organization" name="organization" autoComplete="organization" />
        <Honeypot />
        <Turnstile onToken={setToken} resetKey={attempt} />
        {state === "error" ? (
          <p className="lead-error" role="alert">
            Your details were not sent. Please try again
            {CONTACT_EMAIL ? (
              <>
                , or email us at <a className="inline-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </>
            ) : null}
            .
          </p>
        ) : null}
        <button className="btn" type="submit" disabled={pending}>
          {pending ? "Sending" : "Send"} <span className="arrow">&rarr;</span>
        </button>
      </form>
    </section>
  );
}
