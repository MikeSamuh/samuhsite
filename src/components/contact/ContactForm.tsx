"use client";

import { useEffect, useRef, useState } from "react";
import { Field } from "@/components/lead/Field";
import { Honeypot } from "@/components/lead/Honeypot";
import { Turnstile } from "@/components/lead/Turnstile";
import { useLeadSubmit } from "@/components/lead/useLeadSubmit";
import { CONTACT_EMAIL } from "@/lib/contact-details";
import type { ContactContent } from "@/lib/content/defaults";
import { EMAIL_SHAPE } from "@/lib/lead";
import "./contact.css";

type Errors = Partial<Record<"role" | "need" | "email" | "phone", string>>;

/** enough digits to be a number someone can call back */
const PHONE_SHAPE = /^\+?[\d\s().-]{7,}$/;

function validate(role: string, need: string, email: string, phone: string): Errors {
  const errors: Errors = {};
  if (!role) errors.role = "Choose one.";
  if (!need) errors.need = "Choose one.";
  if (!email) errors.email = "Enter your email address.";
  else if (!EMAIL_SHAPE.test(email)) errors.email = "Enter an email address like name@company.com.";
  if (!phone) errors.phone = "Enter a phone number we can call back.";
  else if (!PHONE_SHAPE.test(phone)) errors.phone = "Enter a phone number with the country code.";
  return errors;
}

/** The contact form (Wilfred, 5 Nov 2026): "I'm a" and "looking for" as
 *  two dropdowns from Mike's Persona Journey sheet, email and phone
 *  required, the message optional. Posts flow "contact" to /api/lead and
 *  swaps to a thanks block in place. The words and the two lists are the
 *  admin's, under Contact. */
export function ContactForm({ c }: { c: ContactContent["form"] }) {
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
        <h2 className="contact-done-title">{c.doneTitle}</h2>
        <p>{c.doneText}</p>
      </div>
    );
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = (field: string) => String(data.get(field) ?? "").trim();
    const role = text("role");
    const need = text("need");
    const email = text("email");
    const phone = text("phone");

    const found = validate(role, need, email, phone);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    void submit({
      role,
      need,
      email,
      phone,
      message: text("message") || undefined,
      company_website: text("company_website") || undefined,
      turnstileToken: token,
    });
  };

  const pending = state === "pending";
  const choose = { value: "", label: c.choose };
  const personas = [choose, ...c.personas.map(({ label }) => ({ value: label, label }))];
  const needs = [choose, ...c.needs.map(({ label }) => ({ value: label, label }))];

  return (
    <form className="lead-form contact-form" ref={form} onSubmit={onSubmit} noValidate>
      <div className="contact-form-who">
        <Field as="select" label={c.imA} name="role" defaultValue="" required options={personas} error={errors.role} />
        <Field as="select" label={c.lookingFor} name="need" defaultValue="" required options={needs} error={errors.need} />
      </div>
      <div className="contact-form-reach">
        <Field label={c.email} name="email" type="email" autoComplete="email" inputMode="email" required error={errors.email} />
        <Field label={c.phone} name="phone" type="tel" autoComplete="tel" inputMode="tel" required error={errors.phone} />
      </div>
      <Field as="textarea" label={c.message} name="message" rows={4} />
      <Honeypot />
      <Turnstile onToken={setToken} resetKey={attempt} />
      {state === "error" ? (
        <p className="lead-error contact-failed" role="alert">
          Your message was not sent. Please try again
          {CONTACT_EMAIL ? <>, or email us at {CONTACT_EMAIL.replace("@", " [at] ")}</> : null}.
        </p>
      ) : null}
      <button className="btn" type="submit" disabled={pending}>
        {pending ? c.sending : c.button}
      </button>
    </form>
  );
}
