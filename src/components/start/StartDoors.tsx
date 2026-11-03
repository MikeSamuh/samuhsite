"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Field } from "@/components/lead/Field";
import { Honeypot } from "@/components/lead/Honeypot";
import { Turnstile } from "@/components/lead/Turnstile";
import { useLeadSubmit } from "@/components/lead/useLeadSubmit";
import { CONTACT_EMAIL } from "@/lib/contact-details";
import type { StartContent } from "@/lib/content/defaults";
import { fill } from "@/lib/content/shared";
import { EMAIL_SHAPE } from "@/lib/lead";
import { platformLink } from "@/lib/site";
import "./start.css";

/** which assessment the form is for: LeadQ unless a Solutions card said TeamQ */
type Door = "leadq" | "teamq";

/** Start here: two choices. Take the assessment, or talk to us. The
 *  assessment is LeadQ, free; `?door=teamq` from the TeamQ card on
 *  Solutions keeps that intent on the form. The login shows once the
 *  platform exists. useSearchParams needs the boundary so the page
 *  stays static. */
export function StartDoors({ c }: { c: StartContent }) {
  return (
    <Suspense fallback={<Doors c={c} />}>
      <DoorsWithParams c={c} />
    </Suspense>
  );
}

function DoorsWithParams({ c }: { c: StartContent }) {
  const params = useSearchParams();
  const wanted = params.get("door");
  const door: Door = wanted === "teamq" ? "teamq" : "leadq";
  // UTM tags ride along to the platform, so attribution survives the hop
  const utm = Array.from(params.entries()).filter(([key]) => key.startsWith("utm_"));
  return <Doors c={c} door={door} open={wanted === "leadq" || wanted === "teamq"} utm={utm} />;
}

function Doors({ c, door = "leadq", open: openAtFirst = false, utm = [] }: { c: StartContent; door?: Door; open?: boolean; utm?: [string, string][] }) {
  const [open, setOpen] = useState(openAtFirst);
  const formWrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(openAtFirst);
  }, [openAtFirst]);
  useEffect(() => {
    if (open) formWrap.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [open]);

  const out = (intent: Door | "login") => {
    const base = platformLink(intent);
    if (!base || !utm.length) return base;
    const url = new URL(base);
    utm.forEach(([key, value]) => url.searchParams.set(key, value));
    return url.toString();
  };
  const assess = c.doors[door];
  const href = out(door);
  const login = out("login");

  return (
    <>
      <ol className="start-doors">
        <li className="start-door">
          <h2 className="start-door-name">{assess.name}</h2>
          <p className="start-door-line">{assess.line}</p>
          {assess.note ? <span className="L-cap">{assess.note}</span> : null}
          {href ? (
            <a className="btn start-door-cta" href={href}>
              {assess.button} <span className="arrow">&rarr;</span>
            </a>
          ) : (
            <button type="button" className="btn start-door-cta" onClick={() => setOpen(true)} aria-pressed={open} aria-controls="start-form">
              {assess.button} <span className="arrow">&rarr;</span>
            </button>
          )}
        </li>
        <li className="start-door">
          <h2 className="start-door-name">{c.doors.talk.name}</h2>
          <p className="start-door-line">{c.doors.talk.line}</p>
          {c.doors.talk.note ? <span className="L-cap">{c.doors.talk.note}</span> : null}
          <Link className="btn btn-secondary start-door-cta" href="/talk">
            {c.doors.talk.button} <span className="arrow">&rarr;</span>
          </Link>
        </li>
        {login ? (
          <li className="start-door start-door-login">
            <h2 className="start-door-name">{c.doors.login.name}</h2>
            <p className="start-door-line">{c.doors.login.line}</p>
            <a className="btn btn-secondary start-door-cta" href={login}>
              {c.doors.login.button} <span className="arrow">&rarr;</span>
            </a>
          </li>
        ) : null}
      </ol>
      {open ? (
        <div className="start-form-wrap" id="start-form" ref={formWrap} tabIndex={-1}>
          <StartForm c={c} door={door} key={door} />
        </div>
      ) : null}
    </>
  );
}

type Errors = Partial<Record<"name" | "email" | "organization", string>>;

/** Until the platform opens: name, email, organization, posted as flow
 *  "start" with the assessment as the intent. Jake and Mike get the email
 *  and Clarify gets the person; SAMUH runs the assessment by hand. */
function StartForm({ c, door }: { c: StartContent; door: Door }) {
  const { submit, state, attempt } = useLeadSubmit("start");
  const [errors, setErrors] = useState<Errors>({});
  const [token, setToken] = useState<string>();
  const form = useRef<HTMLFormElement>(null);
  const done = useRef<HTMLDivElement>(null);
  const label = door === "teamq" ? "TeamQ" : "LeadQ";

  useEffect(() => {
    if (state === "done") done.current?.focus();
    else form.current?.querySelector<HTMLElement>("input")?.focus();
  }, [state]);

  if (state === "done") {
    return (
      <div className="start-thanks" ref={done} tabIndex={-1} role="status">
        <h2 className="sec">{c.form.thanksTitle}</h2>
        <p className="L-mid">{fill(c.form.thanksText, { door: label })}</p>
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
    const name = text("name");
    const email = text("email");
    const organization = text("organization");
    const found: Errors = {};
    if (!name) found.name = "Enter your name.";
    if (!email) found.email = "Enter your email address.";
    else if (!EMAIL_SHAPE.test(email)) found.email = "Enter an email address like name@company.com.";
    if (!organization) found.organization = "Enter your organization.";
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    void submit({ name, email, organization, intent: door, company_website: text("company_website") || undefined, turnstileToken: token });
  };

  const pending = state === "pending";
  return (
    <form className="lead-form start-form" ref={form} onSubmit={onSubmit} noValidate>
      <div className="start-form-head">
        <p className="eyebrow L-eyebrow">{label}</p>
        <h2 className="sec">{c.form.title}</h2>
        <p className="L-cap">{fill(c.form.note, { door: label })}</p>
      </div>
      <Field label="Name" name="name" autoComplete="name" required error={errors.name} />
      <Field label="Work email" name="email" type="email" autoComplete="email" required error={errors.email} />
      <Field label="Organization" name="organization" autoComplete="organization" required error={errors.organization} />
      <Honeypot />
      <Turnstile onToken={setToken} resetKey={attempt} />
      {state === "error" ? (
        <p className="lead-error" role="alert">
          That did not go through. Please try again
          {CONTACT_EMAIL ? (
            <>
              , or email us at <a className="inline-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </>
          ) : null}
          .
        </p>
      ) : null}
      <button className="btn" type="submit" disabled={pending}>
        {pending ? "Sending" : c.form.button} <span className="arrow">&rarr;</span>
      </button>
    </form>
  );
}
