"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Field } from "@/components/lead/Field";
import { Honeypot } from "@/components/lead/Honeypot";
import { Turnstile } from "@/components/lead/Turnstile";
import { useLeadSubmit } from "@/components/lead/useLeadSubmit";
import { CONTACT_EMAIL } from "@/lib/contact-details";
import type { Lead } from "@/lib/lead";
import "./contact.css";

const REASONS: { value: NonNullable<Lead["reason"]>; label: string }[] = [
  { value: "general", label: "General inquiry" },
  { value: "solutions", label: "Learn more about our solutions" },
  { value: "partnership", label: "Partnership opportunity" },
  { value: "other", label: "Something else" },
];

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Errors = Partial<Record<"name" | "email" | "message", string>>;

function validate(name: string, email: string, message: string): Errors {
  const errors: Errors = {};
  if (!name) errors.name = "Enter your name.";
  if (!email) errors.email = "Enter your email address.";
  else if (!EMAIL_SHAPE.test(email)) errors.email = "Enter an email address like name@company.com.";
  if (!message) errors.message = "Enter a message.";
  return errors;
}

/** Flow 1. Posts flow "contact" to /api/lead and swaps to a success block in
 *  place. Spec: docs/sprint-intakes.md, "Flow 1". */
export function ContactForm() {
  const { submit, state, attempt } = useLeadSubmit("contact");
  const [errors, setErrors] = useState<Errors>({});
  const [token, setToken] = useState<string>();
  const form = useRef<HTMLFormElement>(null);
  const success = useRef<HTMLDivElement>(null);

  // the form is gone once it is sent, so focus moves to what replaced it
  useEffect(() => {
    if (state === "done") success.current?.focus();
  }, [state]);

  if (state === "done") {
    return (
      <div className="contact-done" ref={success} tabIndex={-1} role="status">
        <h2 className="contact-done-title">Message sent.</h2>
        <p>Thank you. A person at SAMUH will read it and reply.</p>
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
    const message = text("message");

    const found = validate(name, email, message);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    void submit({
      name,
      email,
      message,
      organization: text("organization") || undefined,
      reason: text("reason") as Lead["reason"],
      company_website: text("company_website") || undefined,
      turnstileToken: token,
    });
  };

  const pending = state === "pending";

  return (
    <form className="lead-form" ref={form} onSubmit={onSubmit} noValidate>
      <Field label="Name" name="name" autoComplete="name" required error={errors.name} />
      <Field label="Email" name="email" type="email" autoComplete="email" required error={errors.email} />
      <Field label="Organization" name="organization" autoComplete="organization" />
      <Field as="select" label="What brings you here" name="reason" defaultValue="general" required options={REASONS} />
      <Field as="textarea" label="Message" name="message" required error={errors.message} />
      <Honeypot />
      <Turnstile onToken={setToken} resetKey={attempt} />
      {state === "error" ? (
        <p className="lead-error contact-failed" role="alert">
          Your message was not sent. Please try again
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
  );
}
