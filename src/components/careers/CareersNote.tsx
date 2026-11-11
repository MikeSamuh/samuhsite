"use client";

import { useEffect, useRef, useState } from "react";
import { Field } from "@/components/lead/Field";
import { Honeypot } from "@/components/lead/Honeypot";
import { Turnstile } from "@/components/lead/Turnstile";
import { useLeadSubmit } from "@/components/lead/useLeadSubmit";
import { EMAIL_SHAPE } from "@/lib/lead";

/** The note on /careers when no role is open (Jake, call of 6 Nov 2026):
 *  a name, an email and a few lines, posted as flow "careers". It reaches
 *  the team by email and stays out of the CRM: these are not sales leads.
 *  Nothing is uploaded. */
export function CareersNote() {
  const { submit, state, attempt } = useLeadSubmit("careers");
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [token, setToken] = useState<string>();
  const done = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state === "done") done.current?.focus();
  }, [state]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const found = {
      name: name ? undefined : "Enter your name.",
      email: !email ? "Enter your email address." : !EMAIL_SHAPE.test(email) ? "Enter an email address like name@company.com." : undefined,
      message: message ? undefined : "Write a few lines.",
    };
    setErrors(found);
    if (found.name || found.email || found.message) return;
    void submit({ name, email, message, company_website: String(data.get("company_website") ?? "") || undefined, turnstileToken: token });
  };

  if (state === "done") {
    return (
      <div className="L-talk-thanks" ref={done} tabIndex={-1} role="status">
        <p className="L-big">Thank you. Your note is with the team.</p>
      </div>
    );
  }

  return (
    <form className="careers-note" onSubmit={onSubmit} noValidate>
      <Field label="Your name" name="name" required autoComplete="name" error={errors.name} />
      <Field label="Your email" name="email" type="email" required autoComplete="email" error={errors.email} />
      <Field as="textarea" label="A few lines on how you would like to work with us" name="message" required rows={4} error={errors.message} />
      {state === "error" ? <p className="lead-error" role="alert">That did not go through. Please try again.</p> : null}
      <Honeypot />
      <Turnstile onToken={setToken} resetKey={attempt} />
      <div className="cta-row">
        <button className="btn" type="submit" disabled={state === "pending"}>{state === "pending" ? "Sending" : "Send the note"} <span className="arrow">&rarr;</span></button>
      </div>
    </form>
  );
}
