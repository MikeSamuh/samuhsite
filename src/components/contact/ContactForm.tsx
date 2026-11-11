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
  // the phone is optional (Wilfred, 11 Nov 2026): checked only when given
  if (phone && !PHONE_SHAPE.test(phone)) errors.phone = "Enter a phone number with the country code.";
  return errors;
}

/** One word of the sentence that is a dropdown (Wilfred, 6 Nov 2026): the
 *  chosen option shown in the display type with a caret, the real select
 *  laid over it, invisible, so the native menu and the keyboard still
 *  work. Until something is chosen the placeholder sits there, muted. */
function Pick({ name, label, choose, options, error, errorId, after }: { name: string; label: string; choose: string; options: { label: string }[]; error?: string; errorId: string; /** punctuation after the word, kept on its line */ after?: string }) {
  const [value, setValue] = useState("");
  return (
    <span className={`contact-pick${value ? "" : " contact-pick-empty"}`}>
      <span className="contact-pick-text" aria-hidden="true">
        {value || choose}
        <svg className="contact-pick-caret" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {after ? <span className="contact-after" aria-hidden="true">{after}</span> : null}
      <select name={name} aria-label={label} value={value} onChange={(event) => setValue(event.target.value)} required aria-invalid={error ? true : undefined} aria-describedby={error ? errorId : undefined}>
        <option value="">{choose}</option>
        {options.map(({ label: option }) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </span>
  );
}

/** A blank in the sentence: a text input in the display type, as wide as
 *  what is typed in it (a hidden copy of the text sets the width), the
 *  placeholder showing while it is empty. */
function Blank({ name, label, hint, error, errorId, after, optional, ...rest }: { name: string; label: string; hint: string; error?: string; errorId: string; /** punctuation after the blank, kept on its line */ after?: string; /** may be left empty */ optional?: boolean } & Pick<React.InputHTMLAttributes<HTMLInputElement>, "type" | "autoComplete" | "inputMode">) {
  const [value, setValue] = useState("");
  return (
    <span className="contact-blank">
      <span className="contact-blank-box">
        <span className="contact-blank-size" aria-hidden="true">{value || hint}</span>
        <input {...rest} name={name} aria-label={label} placeholder={hint} value={value} onChange={(event) => setValue(event.target.value)} required={!optional} aria-invalid={error ? true : undefined} aria-describedby={error ? errorId : undefined} />
      </span>
      {after ? <span className="contact-after" aria-hidden="true">{after}</span> : null}
    </span>
  );
}

/** The contact form (Wilfred, 5 Nov 2026): who you are and what you are
 *  looking for as two dropdowns from Mike's Persona Journey sheet, email
 *  required, the phone and the message optional. Posts flow "contact" to
 *  /api/lead and swaps to a thanks block in place. The words and the two
 *  lists are the admin's, under Contact.
 *
 *  6 Nov 2026: the form is two sentences in the display type (the page's
 *  title until 11 Nov 2026, when the head went beside and they came down
 *  to a form's size): "I'm a [who] and [what]. My email is [ ], and phone is [ ]."
 *  The dropdowns and the blanks are words of them. The message box and
 *  the button sit under, and the whole form holds one screen. */
export function ContactForm({ c }: { c: ContactContent["form"] }) {
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
    // the options carry their article for the sentence; the record does not
    const role = text("role").replace(/^an? /i, "");
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
      phone: phone || undefined,
      message: text("message") || undefined,
      company_website: text("company_website") || undefined,
      turnstileToken: token,
    });
  };

  const pending = state === "pending";
  const errorId = (field: keyof Errors) => `${id}-${field}`;

  return (
    <form className="lead-form contact-form" ref={form} onSubmit={onSubmit} noValidate>
      <div className="contact-sentences">
        <p className="contact-sentence">
          {c.imA}{" "}
          <Pick name="role" label={c.imA} choose={c.choose} options={c.personas} error={errors.role} errorId={errorId("role")} />
          {" "}{c.lookingFor}{" "}
          <Pick name="need" label="Looking for" choose={c.choose} options={c.needs} error={errors.need} errorId={errorId("need")} after="." />
        </p>
        <p className="contact-sentence">
          {c.myEmail}{" "}
          <Blank name="email" label={c.email} hint={c.emailHint} type="email" autoComplete="email" inputMode="email" error={errors.email} errorId={errorId("email")} after="," />
          {" "}
          {/* the phone's words and its blank wrap as one, never the blank alone */}
          <span className="contact-clause">
            {c.myPhone}{" "}
            <Blank name="phone" label={c.phone} hint={c.phoneHint} type="tel" autoComplete="tel" inputMode="tel" optional error={errors.phone} errorId={errorId("phone")} after="." />
            {" "}<span className="contact-optional">(optional)</span>
          </span>
        </p>
      </div>
      {(["role", "need", "email", "phone"] as const).map((field) =>
        errors[field] ? <p className="lead-error contact-error" key={field} id={errorId(field)} role="alert">{errors[field]}</p> : null,
      )}
      <Field as="textarea" label={c.message} name="message" rows={2} />
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
