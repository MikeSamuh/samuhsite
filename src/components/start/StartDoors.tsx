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
import { ROUTES, platformLink } from "@/lib/site";
import "./start.css";

/** the two doors that run on the platform; OrgQ is a conversation */
type Door = "leadq" | "teamq";
const DOORS: Door[] = ["leadq", "teamq"];

/** Flow 4, the fork. Three doors and, once the platform exists, a login.
 *  `?door=leadq` from a Solutions card opens that door's form straight
 *  away. useSearchParams needs the boundary so the page stays static. */
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
  const initial = DOORS.find((d) => d === wanted) ?? null;
  // UTM tags ride along to the platform, so attribution survives the hop
  const utm = Array.from(params.entries()).filter(([key]) => key.startsWith("utm_"));
  return <Doors c={c} initial={initial} utm={utm} />;
}

function Doors({ c, initial = null, utm = [] }: { c: StartContent; initial?: Door | null; utm?: [string, string][] }) {
  const [open, setOpen] = useState<Door | null>(initial);
  const formWrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(initial);
  }, [initial]);
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
  const login = out("login");

  const door = (key: Door) => {
    const d = c.doors[key];
    const href = out(key);
    return (
      <li className="start-door" key={key}>
        <h2 className="start-door-name">{d.name}</h2>
        <p className="start-door-line">{d.line}</p>
        {d.note ? <span className="L-cap">{d.note}</span> : null}
        {href ? (
          <a className="btn start-door-cta" href={href}>
            {d.button} <span className="arrow">&rarr;</span>
          </a>
        ) : (
          <button type="button" className="btn start-door-cta" onClick={() => setOpen(key)} aria-pressed={open === key} aria-controls="start-form">
            {d.button} <span className="arrow">&rarr;</span>
          </button>
        )}
      </li>
    );
  };

  return (
    <>
      <ol className="start-doors">
        {door("leadq")}
        {door("teamq")}
        <li className="start-door">
          <h2 className="start-door-name">{c.doors.orgq.name}</h2>
          <p className="start-door-line">{c.doors.orgq.line}</p>
          {c.doors.orgq.note ? <span className="L-cap">{c.doors.orgq.note}</span> : null}
          <Link className="btn btn-secondary start-door-cta" href="/talk?tier=orgq">
            {c.doors.orgq.button} <span className="arrow">&rarr;</span>
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
          <StartForm c={c} door={open} key={open} />
        </div>
      ) : null}
    </>
  );
}

type Errors = Partial<Record<"name" | "email" | "organization", string>>;

/** Until the platform opens: name, email, organization, posted as flow
 *  "start" with the door as the intent. Jake and Mike get the email and
 *  Clarify gets the person; SAMUH runs the assessment by hand. */
function StartForm({ c, door }: { c: StartContent; door: Door }) {
  const { submit, state, attempt } = useLeadSubmit("start");
  const [errors, setErrors] = useState<Errors>({});
  const [token, setToken] = useState<string>();
  const form = useRef<HTMLFormElement>(null);
  const done = useRef<HTMLDivElement>(null);
  const label = c.doors[door].name;

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
      <div className="cta-row">
        <button className="btn" type="submit" disabled={pending}>
          {pending ? "Sending" : c.form.button} <span className="arrow">&rarr;</span>
        </button>
        <Link className="inline-link L-text-cta" href={ROUTES.solutions}>Compare the three first <span className="arrow">&rarr;</span></Link>
      </div>
    </form>
  );
}
