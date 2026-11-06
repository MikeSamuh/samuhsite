"use client";

import { useEffect, useId, useRef, useState } from "react";
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
  if (!role) errors.role = "Choose who you are.";
  if (!need) errors.need = "Choose what you are looking for.";
  if (!email) errors.email = "Enter your email address.";
  else if (!EMAIL_SHAPE.test(email)) errors.email = "Enter an email address like name@company.com.";
  if (!phone) errors.phone = "Enter a phone number we can call back.";
  else if (!PHONE_SHAPE.test(phone)) errors.phone = "Enter a phone number with the country code.";
  return errors;
}

/** One word of the sentence that is a dropdown (Wilfred, 6 Nov 2026): the
 *  chosen option shown in the display type with a caret, the real select
 *  laid over it, invisible, so the native menu and the keyboard still
 *  work. Until something is chosen the placeholder sits there, muted. */
function Pick({ name, label, choose, options, error, errorId }: { name: string; label: string; choose: string; options: { label: string }[]; error?: string; errorId: string }) {
  const [value, setValue] = useState("");
  return (
    <span className={`contact-pick${value ? "" : " contact-pick-empty"}`}>
      <span className="contact-pick-text" aria-hidden="true">{value || choose}</span>
      <svg className="contact-pick-caret" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <select name={name} aria-label={label} value={value} onChange={(event) => setValue(event.target.value)} required aria-invalid={error ? true : undefined} aria-describedby={error ? errorId : undefined}>
        <option value="">{choose}</option>
        {options.map(({ label: option }) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </span>
  );
}

/** The contact form (Wilfred, 5 Nov 2026): who you are and what you are
 *  looking for as two dropdowns from Mike's Persona Journey sheet, email
 *  and phone required, the message optional. Posts flow "contact" to
 *  /api/lead and swaps to a thanks block in place. The words and the two
 *  lists are the admin's, under Contact.
 *
 *  6 Nov 2026: the two dropdowns are the page's title, one sentence in the
 *  display type: "I'm a [who] and [what]." The old title is the line under
 *  it. */
export function ContactForm({ c, line }: { c: ContactContent["form"]; /** the line between the sentence and the fields */ line?: string }) {
  const { submit, state, attempt } = useLeadSubmit("contact");
  const [errors, setErrors] = useState<Errors>({});
  const [token, setToken] = useState<string>();
  const form = useRef<HTMLFormElement>(null);
  const success = useRef<HTMLDivElement>(null);
  const id = useId();

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
  const roleError = `${id}-role`;
  const needError = `${id}-need`;

  return (
    <form className="lead-form contact-form" ref={form} onSubmit={onSubmit} noValidate>
      <h1 className="display L-page-title contact-sentence">
        {c.imA}{" "}
        <Pick name="role" label={c.imA} choose={c.choose} options={c.personas} error={errors.role} errorId={roleError} />
        {" "}{c.lookingFor}{" "}
        <Pick name="need" label="Looking for" choose={c.choose} options={c.needs} error={errors.need} errorId={needError} />
      </h1>
      {errors.role ? <p className="lead-error" id={roleError} role="alert">{errors.role}</p> : null}
      {errors.need ? <p className="lead-error" id={needError} role="alert">{errors.need}</p> : null}
      {line ? <p className="L-mid contact-line">{line}</p> : null}
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
