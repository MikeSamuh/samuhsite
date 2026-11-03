"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Honeypot } from "@/components/lead/Honeypot";
import { Turnstile } from "@/components/lead/Turnstile";
import { useLeadSubmit } from "@/components/lead/useLeadSubmit";
import { CONTACT_EMAIL } from "@/lib/contact-details";
import type { StartContent } from "@/lib/content/defaults";
import { fill } from "@/lib/content/shared";
import { EMAIL_SHAPE } from "@/lib/lead";
import { ROUTES, platformLink } from "@/lib/site";
import "./start.css";

type Intent = "leadq" | "teamq";

/** The one box (Wilfred, 3 Nov 2026): a work email. Once the platform
 *  exists the address goes there and the platform sends the magic link
 *  that signs the person in as a free user and starts LeadQ. Until then
 *  the address posts as flow "start" and SAMUH sends the link by hand.
 *  `?door=teamq` from the TeamQ card on Solutions tags the lead. The
 *  search params need the boundary so the page stays static. */
export function StartEmail({ c, talk = true }: { c: StartContent["form"]; /** the "prefer to talk" line under the box; off on /contact, where talking is beside it */ talk?: boolean }) {
  return (
    <Suspense fallback={<EmailBox c={c} intent="leadq" talk={talk} />}>
      <WithParams c={c} talk={talk} />
    </Suspense>
  );
}

function WithParams({ c, talk }: { c: StartContent["form"]; talk: boolean }) {
  const params = useSearchParams();
  const intent: Intent = params.get("door") === "teamq" ? "teamq" : "leadq";
  const utm = Array.from(params.entries()).filter(([key]) => key.startsWith("utm_"));
  return <EmailBox c={c} intent={intent} talk={talk} utm={utm} />;
}

function EmailBox({ c, intent, talk, utm = [] }: { c: StartContent["form"]; intent: Intent; talk: boolean; utm?: [string, string][] }) {
  const { submit, state, attempt } = useLeadSubmit("start");
  const [error, setError] = useState<string>();
  const [token, setToken] = useState<string>();
  const [sent, setSent] = useState("");
  const form = useRef<HTMLFormElement>(null);
  const done = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state === "done") done.current?.focus();
  }, [state]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const found = !email ? "Enter your work email." : !EMAIL_SHAPE.test(email) ? "Enter an email address like name@company.com." : undefined;
    setError(found);
    if (found) {
      form.current?.querySelector<HTMLElement>("input[name=email]")?.focus();
      return;
    }
    // the platform, once it exists, sends the link itself
    const platform = platformLink(intent);
    if (platform) {
      const url = new URL(platform);
      url.searchParams.set("email", email);
      utm.forEach(([key, value]) => url.searchParams.set(key, value));
      window.location.assign(url.toString());
      return;
    }
    setSent(email);
    void submit({ email, intent, company_website: String(data.get("company_website") ?? "") || undefined, turnstileToken: token });
  };

  if (state === "done") {
    return (
      <div className="start-thanks" ref={done} tabIndex={-1} role="status">
        <h2 className="sec">{c.thanksTitle}</h2>
        <p className="L-mid">{fill(c.thanksText, { email: sent })}</p>
      </div>
    );
  }

  const pending = state === "pending";
  return (
    <form className="start-email" ref={form} onSubmit={onSubmit} noValidate>
      <label className="L-cap" htmlFor="start-email">{c.label}</label>
      <div className="field start-field">
        <input id="start-email" name="email" type="email" autoComplete="email" inputMode="email" placeholder={c.placeholder} required aria-invalid={error ? true : undefined} aria-describedby={error ? "start-email-error" : undefined} />
        <button className="btn" type="submit" disabled={pending}>
          {pending ? "Sending" : c.button} <span className="arrow">&rarr;</span>
        </button>
      </div>
      {error ? <p className="lead-error" id="start-email-error" role="alert">{error}</p> : null}
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
      <Honeypot />
      <Turnstile onToken={setToken} resetKey={attempt} />
      {talk ? (
        <p className="L-cap start-talk">
          {c.talk} <Link className="inline-link" href={ROUTES.contact}>{c.talkLink}</Link>
        </p>
      ) : null}
    </form>
  );
}
