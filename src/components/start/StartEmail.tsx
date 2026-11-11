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
import { track } from "@/lib/analytics";
import { PLATFORM_HANDOFF, PLATFORM_URL, ROUTES } from "@/lib/site";
import "./start.css";

type Intent = "leadq" | "teamq";

/** How long the hand-off waits for the lead post before leaving anyway. */
const LEAD_WAIT_MS = 2000;

/** Leaves for the platform with a form POST: the address travels in the
 *  body, never in the URL. */
function handOff(email: string, intent: Intent, utm: [string, string][]) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = `${PLATFORM_URL}${PLATFORM_HANDOFF.path}`;
  const add = (name: string, value: string) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  };
  add(PLATFORM_HANDOFF.fields.email, email);
  add(PLATFORM_HANDOFF.fields.intent, intent);
  utm.forEach(([key, value]) => add(key, value));
  document.body.appendChild(form);
  form.submit();
}

/** The one box (Wilfred, 3 Nov 2026): a work email. The address always
 *  posts first as flow "start", so sales has the person even if they stop
 *  on the platform (call of 6 Nov 2026). Then, once the platform exists,
 *  the box hands off to it and the platform sends the magic link that
 *  signs the person in as a free user and starts LeadQ. Until then SAMUH
 *  sends the link by hand.
 *  `?door=teamq` from the TeamQ card on Solutions tags the lead. The
 *  search params need the boundary so the page stays static. */
export function StartEmail({ c, talk = true, intent }: { c: StartContent["form"]; /** the "prefer to talk" line under the box; off where talking is beside it */ talk?: boolean; /** which assessment the box is for; the Solutions cards set it, the home means LeadQ */ intent?: Intent }) {
  return (
    <Suspense fallback={<EmailBox c={c} intent={intent ?? "leadq"} talk={talk} />}>
      <WithParams c={c} talk={talk} intent={intent} />
    </Suspense>
  );
}

function WithParams({ c, talk, intent }: { c: StartContent["form"]; talk: boolean; intent?: Intent }) {
  const params = useSearchParams();
  const which: Intent = intent ?? (params.get("door") === "teamq" ? "teamq" : "leadq");
  const utm = Array.from(params.entries()).filter(([key]) => key.startsWith("utm_"));
  return <EmailBox c={c} intent={which} talk={talk} utm={utm} />;
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
    setSent(email);
    track("start_submit", { intent });
    // the lead first, always
    const lead = submit({ email, intent, company_website: String(data.get("company_website") ?? "") || undefined, turnstileToken: token });
    if (!PLATFORM_URL) return;
    // then the platform. A slow or failed lead post does not hold the
    // person here for more than a couple of seconds
    const wait = new Promise<"slow">((resolve) => setTimeout(() => resolve("slow"), LEAD_WAIT_MS));
    void Promise.race([lead, wait]).then((result) => {
      if (result !== true) console.warn(`start: handing off with the lead post ${result === "slow" ? "still pending" : "failed"}`);
      handOff(email, intent, utm);
    });
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
