"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Field } from "@/components/lead/Field";
import { Honeypot } from "@/components/lead/Honeypot";
import { Turnstile } from "@/components/lead/Turnstile";
import { useLeadSubmit } from "@/components/lead/useLeadSubmit";
import { track } from "@/lib/analytics";
import { CONTACT_EMAIL } from "@/lib/contact-details";
import { EMAIL_SHAPE, PERSONAL_DOMAINS } from "@/lib/lead";
import { mhqBand } from "@/lib/tokens";
import { Capacity } from "./Capacity";
import {
  BASELINE,
  OPTIMIZER_MOVES,
  FACTORS,
  GROUP_LABELS,
  LIFESTYLE_HINTS,
  MODEL_VERIFIED,
  TEAM_SIZE,
  type Factor,
} from "./model";
import "./teaser.css";

/** What /api/teaser returns for one slider setting. */
export interface TeaserResult {
  /** capacity to perform: the team's MHQ */
  mhq: number;
  /** productive days a month */
  days: number;
}

type Values = Record<string, number>;

/** The optimizer's best setting for productive days in OPTIMIZER_MOVES moves. */
export interface Answer extends TeaserResult {
  values: Values;
  levers: { id: string; label: string; value: number }[];
}

/** long enough to skip the settings a dragged slider passes through */
const SETTLE_MS = 120;

const one = (value: number) => value.toFixed(1);

/** The dashboard's rule: a change under 0.05 rounds to nothing, so say so. */
function change(now: number, base: number, unit = ""): string {
  const delta = now - base;
  if (Math.abs(delta) < 0.05) return "no change";
  return `${delta > 0 ? "+" : "−"}${one(Math.abs(delta))}${unit}`;
}

const atBaseline = (values: Values) =>
  FACTORS.every((factor) => values[factor.id] === BASELINE[factor.id]);

/** "Pride & Purpose, Exercise and Workload" */
function list(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/** Flow 2. The dashboard's what-if on a demonstration team: ten inputs, a
 *  live readout, a button that applies the model's own best moves, and the
 *  ask. Nothing is gated. Spec: docs/sprint-intakes.md, "Flow 2". */
export function TeamQTeaser({ baseline, answer }: { baseline: TeaserResult; answer: Answer }) {
  const [values, setValues] = useState<Values>(BASELINE);
  const [result, setResult] = useState<TeaserResult>(baseline);
  const [stale, setStale] = useState(false);
  const [failed, setFailed] = useState(false);
  const [touched, setTouched] = useState(false);
  const [shown, setShown] = useState(false);
  const answerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (shown) answerRef.current?.focus();
  }, [shown]);

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
        setResult({ mhq: scored.mhq, days: scored.days });
        setStale(false);
        setFailed(false);
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
  }, [values, baseline]);

  const move = (factor: Factor, value: number) => {
    setValues((current) => ({ ...current, [factor.id]: value }));
    if (!touched) {
      setTouched(true);
      track("teaser_interact", { factor: factor.id });
    }
  };

  const showOptimized = () => {
    setValues(answer.values);
    setShown(true);
  };
  /** the sliders sit exactly where the optimizer put them */
  const optimized = FACTORS.every((factor) => values[factor.id] === answer.values[factor.id]);

  const environment = FACTORS.filter((factor) => factor.group === "environment");
  const lifestyle = FACTORS.filter((factor) => factor.group === "lifestyle");

  return (
    <div className="teaser">
      {/* one fold: the readout on the left, the eleven sliders on the right */}
      <div className="teaser-fold">
        <div className="teaser-left">
          {MODEL_VERIFIED ? (
            <div className="teaser-readout" data-stale={stale} aria-live="polite" aria-atomic="true">
              <div className="teaser-headline">
                <span className="teaser-label">Productive days per month</span>
                <span className="teaser-days">{one(result.days)}</span>
                <span className="teaser-delta">{change(result.days, baseline.days, " days")}</span>
              </div>
              <Capacity value={result.mhq} delta={change(result.mhq, baseline.mhq)} />
              {failed ? (
                <p className="teaser-failed" role="alert">
                  That change could not be scored. These are the last figures we have.
                </p>
              ) : null}
            </div>
          ) : (
            <Gauge values={values} />
          )}
          <p className="teaser-team">
            A team of {TEAM_SIZE}, as they are today.
            <span className="teaser-team-base">
              {" "}
              {one(baseline.days)} productive days a month. Capacity to perform {one(baseline.mhq)},{" "}
              {mhqBand(baseline.mhq).name}.
            </span>
          </p>
        </div>

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
              <Slider key={factor.id} factor={factor} value={values[factor.id]} onChange={move} />
            ))}
          </fieldset>
          <div className="teaser-actions">
            {MODEL_VERIFIED ? (
              <button className="btn btn-alt" type="button" onClick={showOptimized} disabled={optimized}>
                Show me the optimized TeamQ <span className="arrow">&rarr;</span>
              </button>
            ) : null}
            <button
              className="btn btn-secondary teaser-reset"
              type="button"
              onClick={() => setValues(BASELINE)}
              disabled={atBaseline(values)}
            >
              Reset
            </button>
          </div>
          {/* the moves, once applied. Brief: the readout tells the story */}
          {MODEL_VERIFIED && shown ? (
            <p className="teaser-moves" ref={answerRef} tabIndex={-1}>
              The model&rsquo;s best {OPTIMIZER_MOVES} moves for this team:{" "}
              {list(answer.levers.map((lever) => `${lever.label} to ${lever.value}`))}. Applied above; keep moving
              things, or Reset.
            </p>
          ) : null}
        </div>
      </div>

      <Ask values={values} />
    </div>
  );
}

function Slider({ factor, value, onChange }: { factor: Factor; value: number; onChange: (factor: Factor, value: number) => void }) {
  const id = `teaser-${factor.id}`;
  const fill = ((value - factor.min) / (factor.max - factor.min)) * 100;
  const hint = LIFESTYLE_HINTS[factor.id];
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
        aria-describedby={hint ? `${id}-note` : undefined}
        style={{ "--fill": `${fill}%` } as React.CSSProperties}
      />
      {hint ? (
        <span className="teaser-note" id={`${id}-note`}>
          {hint}
        </span>
      ) : null}
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

/** A first guess at the company from a work email's domain, for the
 *  visitor to correct: "jane@acme-corp.co.uk" offers "Acme Corp". Nothing
 *  for a personal address. */
function companyFromEmail(email: string): string {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain || PERSONAL_DOMAINS.has(domain)) return "";
  const label = domain.split(".")[0];
  return label
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

/** Mailbox names that are a desk, not a person. */
const ROLE_MAILBOXES = new Set(["info", "hello", "contact", "admin", "office", "team", "sales", "support", "hr", "people", "mail", "enquiries", "inquiries"]);

/** A first guess at the name from the part before the @, for the visitor
 *  to correct: "jane.doe@" offers "Jane Doe", "j_doe@" offers "J Doe".
 *  Nothing for a desk address or a name that is only digits. */
function nameFromEmail(email: string): string {
  const local = email.split("@")[0]?.toLowerCase() ?? "";
  if (!local || ROLE_MAILBOXES.has(local)) return "";
  const words = local
    .split(/[._\-+]+/)
    .map((word) => word.replace(/\d+/g, ""))
    .filter(Boolean);
  if (!words.length) return "";
  return words.map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
}

const TEAM_SIZES = [
  { value: "", label: "Choose" },
  { value: "1-10", label: "1 to 10" },
  { value: "11-50", label: "11 to 50" },
  { value: "51-200", label: "51 to 200" },
  { value: "200+", label: "More than 200" },
];

type TeamSize = "1-10" | "11-50" | "51-200" | "200+";

interface Intake {
  email: string;
  name: string;
  role: string;
  phone: string;
  organization: string;
  teamSize: "" | TeamSize;
  change: string;
}

const EMPTY: Intake = { email: "", name: "", role: "", phone: "", organization: "", teamSize: "", change: "" };

/** The optional ask, as a light intake. Always there, below the tool, and
 *  never between the visitor and the readout. Three steps: the email,
 *  posted the moment it is given so the CRM has the person; then name,
 *  role and phone, the name offered from the address; then company, team
 *  size and what they hope to change, the company offered from the
 *  domain. Everything posts together at the end, with the slider state. */
function Ask({ values }: { values: Values }) {
  const { submit, send, state, attempt } = useLeadSubmit("teaser");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [intake, setIntake] = useState<Intake>(EMPTY);
  const [error, setError] = useState<string>();
  const [token, setToken] = useState<string>();
  const form = useRef<HTMLFormElement>(null);
  const success = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state === "done") success.current?.focus();
  }, [state]);

  useEffect(() => {
    if (step > 1) form.current?.querySelector<HTMLElement>(".lead-steps input, .lead-steps select")?.focus();
  }, [step]);

  if (state === "done") {
    return (
      <div className="teaser-ask teaser-done" id="ask" ref={success} tabIndex={-1} role="status">
        <h2 className="teaser-ask-title">Thank you.</h2>
        <p>A person at SAMUH will be in touch about your team.</p>
        <Link className="btn btn-secondary" href="/talk">
          Or book a time <span className="arrow">&rarr;</span>
        </Link>
      </div>
    );
  }

  const set = (field: keyof Intake) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setIntake((current) => ({ ...current, [field]: event.target.value }));
  const focusField = (name: string) => form.current?.querySelector<HTMLElement>(`[name="${name}"]`)?.focus();
  const honeypot = () => String(new FormData(form.current ?? undefined).get("company_website") ?? "") || undefined;

  const onStep1 = () => {
    const email = intake.email.trim();
    const found = !email
      ? "Enter your email address."
      : !EMAIL_SHAPE.test(email)
        ? "Enter an email address like name@company.com."
        : undefined;
    setError(found);
    if (found) return focusField("email");
    setIntake((current) => ({
      ...current,
      email,
      name: current.name || nameFromEmail(email),
      organization: current.organization || companyFromEmail(email),
    }));
    setStep(2);
    // the CRM gets the person now, in case the rest never comes
    void send({ email, answers: values, stage: "email", company_website: honeypot(), turnstileToken: token });
  };

  const onStep2 = () => {
    const found = !intake.name.trim() ? "Enter your name." : undefined;
    setError(found);
    if (found) return focusField("name");
    setStep(3);
  };

  const onStep3 = () => {
    const found = !intake.organization.trim() ? "Enter your company." : !intake.teamSize ? "Pick a team size." : undefined;
    setError(found);
    if (found) return focusField(!intake.organization.trim() ? "organization" : "teamSize");
    void submit({
      email: intake.email,
      name: intake.name.trim(),
      role: intake.role.trim() || undefined,
      phone: intake.phone.trim() || undefined,
      organization: intake.organization.trim(),
      teamSize: intake.teamSize || undefined,
      change: intake.change.trim() || undefined,
      answers: values,
      stage: "complete",
      company_website: honeypot(),
      turnstileToken: token,
    });
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step === 1) onStep1();
    else if (step === 2) onStep2();
    else onStep3();
  };

  const back = (to: 1 | 2) => () => { setStep(to); setError(undefined); };
  const pending = state === "pending";
  const errorFor = (message: string) => (error === message ? error : undefined);

  return (
    <section className="teaser-ask" id="ask" aria-labelledby="teaser-ask-title">
      <div>
        <h2 className="teaser-ask-title" id="teaser-ask-title">
          Start here to get your team&rsquo;s TeamQ assessment.
        </h2>
        <p>
          Let&rsquo;s see how optimized your team is. Leave your details and a person at SAMUH will be in touch
          about measuring it.
        </p>
      </div>
      <form className="lead-form" ref={form} onSubmit={onSubmit} noValidate>
        <p className="lead-step L-cap" aria-live="polite">Step {step} of 3</p>
        {step === 1 ? (
          <Field label="Work email" name="email" type="email" autoComplete="email" required value={intake.email} onChange={set("email")} error={error} />
        ) : null}
        {step === 2 ? (
          <div className="lead-steps">
            <p className="lead-step-lead">
              {intake.email}{" "}
              <button type="button" className="inline-link lead-back" onClick={back(1)}>
                Change
              </button>
            </p>
            <Field label="Name" name="name" autoComplete="name" required value={intake.name} onChange={set("name")} error={errorFor("Enter your name.")} />
            <Field label="Role" name="role" autoComplete="organization-title" placeholder="Head of People, Team Lead, CEO" value={intake.role} onChange={set("role")} />
            <Field label="Phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" value={intake.phone} onChange={set("phone")} />
          </div>
        ) : null}
        {step === 3 ? (
          <div className="lead-steps">
            <p className="lead-step-lead">
              {intake.name}, {intake.email}{" "}
              <button type="button" className="inline-link lead-back" onClick={back(2)}>
                Change
              </button>
            </p>
            <Field label="Company" name="organization" autoComplete="organization" required value={intake.organization} onChange={set("organization")} error={errorFor("Enter your company.")} />
            <Field as="select" label="Team size" name="teamSize" options={TEAM_SIZES} required value={intake.teamSize} onChange={set("teamSize")} error={errorFor("Pick a team size.")} />
            <Field as="textarea" label="What are you hoping to change?" name="change" rows={3} value={intake.change} onChange={set("change")} />
          </div>
        ) : null}
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
          {step < 3 ? "Continue" : pending ? "Sending" : "Send"} <span className="arrow">&rarr;</span>
        </button>
      </form>
    </section>
  );
}
