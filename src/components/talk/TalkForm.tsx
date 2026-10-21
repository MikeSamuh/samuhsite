"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Field } from "@/components/lead/Field";
import { Honeypot } from "@/components/lead/Honeypot";
import { Turnstile } from "@/components/lead/Turnstile";
import { useLeadSubmit } from "@/components/lead/useLeadSubmit";
import { track } from "@/lib/analytics";
import { CONTACT_EMAIL } from "@/lib/contact-details";
import { EMAIL_SHAPE, type Lead } from "@/lib/lead";
import { ROUTES } from "@/lib/site";
import "./talk.css";

const SIZES: { value: NonNullable<Lead["teamSize"]>; label: string }[] = [
  { value: "1-10", label: "1 to 10" },
  { value: "11-50", label: "11 to 50" },
  { value: "51-200", label: "51 to 200" },
  { value: "200+", label: "More than 200" },
];
const TIERS: NonNullable<Lead["tier"]>[] = ["self-guided", "supported", "guided"];
/** step 1 done, so a refresh lands on step 2 */
const DONE_KEY = "samuh-talk";

type Errors = Partial<Record<"name" | "email" | "organization" | "teamSize", string>>;

function validate(name: string, email: string, organization: string, teamSize: string): Errors {
  const errors: Errors = {};
  if (!name) errors.name = "Enter your name.";
  if (!email) errors.email = "Enter your email address.";
  else if (!EMAIL_SHAPE.test(email)) errors.email = "Enter an email address like name@company.com.";
  if (!organization) errors.organization = "Enter your organization.";
  if (!teamSize) errors.teamSize = "Choose a size.";
  return errors;
}

/** Flow 3. Qualify, then book. Spec: docs/sprint-intakes.md, "Flow 3".
 *  useSearchParams needs the boundary so the page stays static. */
export function TalkForm() {
  return (
    <Suspense fallback={null}>
      <Talk />
    </Suspense>
  );
}

function Talk() {
  const params = useSearchParams();
  const tierParam = params.get("tier");
  const tier = TIERS.find((t) => t === tierParam);
  const { submit, state, attempt } = useLeadSubmit("talk");
  const [errors, setErrors] = useState<Errors>({});
  const [token, setToken] = useState<string>();
  const [summary, setSummary] = useState<string | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const done = useRef<HTMLDivElement>(null);

  // a refresh after step 1 keeps step 2
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(DONE_KEY);
      if (saved) setSummary(saved);
    } catch {}
  }, []);
  useEffect(() => {
    if (summary !== null) done.current?.focus();
  }, [summary]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = (field: string) => String(data.get(field) ?? "").trim();
    const name = text("name");
    const email = text("email");
    const organization = text("organization");
    const teamSize = text("teamSize") as Lead["teamSize"];
    const found = validate(name, email, organization, teamSize ?? "");
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    void submit({
      name,
      email,
      organization,
      teamSize,
      change: text("change") || undefined,
      tier,
      company_website: text("company_website") || undefined,
      turnstileToken: token,
    }).then((ok) => {
      if (!ok) return;
      const line = `${name}, ${organization}`;
      try { sessionStorage.setItem(DONE_KEY, line); } catch {}
      setSummary(line);
    });
  };

  if (summary !== null) {
    return (
      <div className="talk-step2" ref={done} tabIndex={-1}>
        <p className="L-cap talk-summary" role="status">Step 1 done: {summary}. Now pick a time.</p>
        <Booking />
      </div>
    );
  }

  const pending = state === "pending";
  return (
    <form className="lead-form" ref={form} onSubmit={onSubmit} noValidate>
      <Field label="Name" name="name" autoComplete="name" required error={errors.name} />
      <Field label="Email" name="email" type="email" autoComplete="email" required error={errors.email} />
      <Field label="Organization" name="organization" autoComplete="organization" required error={errors.organization} />
      <Field as="select" label="Roughly how many people are on your team" name="teamSize" required defaultValue="" error={errors.teamSize} options={[{ value: "", label: "Choose one" }, ...SIZES]} />
      <Field as="textarea" label="What are you hoping to change" name="change" />
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
        {pending ? "Sending" : "Pick a time"} <span className="arrow">&rarr;</span>
      </button>
    </form>
  );
}

/** Step 2: the Google Calendar appointment schedule, inline. Google takes
 *  the booking and the confirmation; Clarify gets the event from its own
 *  Google sync. A placeholder until the schedule link is set. */
function Booking() {
  const url = process.env.NEXT_PUBLIC_BOOKING_URL;
  useEffect(() => {
    if (url) track("booking_open");
  }, [url]);
  if (!url) {
    return <div className="ph ph-tall talk-ph">TODO(content): the booking schedule. Set NEXT_PUBLIC_BOOKING_URL to Jake&rsquo;s Intro call link.</div>;
  }
  return (
    <>
      <iframe className="talk-embed" src={url} title="Pick a time for an intro call" loading="lazy" />
      <p className="L-cap talk-after">
        Once a time is booked, Google sends the confirmation. Meanwhile, <Link href={ROUTES.insights} className="inline-link">read or watch something from Insights</Link>.
      </p>
    </>
  );
}
