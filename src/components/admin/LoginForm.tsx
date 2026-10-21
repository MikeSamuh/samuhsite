"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export function LoginForm() {
  const params = useSearchParams();
  const expired = params.get("error") === "expired";
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string>(expired ? "That link has expired or was already used. Ask for a new one." : "");
  const [devLink, setDevLink] = useState<string>();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    setDevLink(undefined);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, next: params.get("next") ?? undefined }),
      });
      const data = await res.json();
      setMessage(data.message ?? "");
      setDevLink(data.devLink);
      setState(res.ok ? "sent" : "error");
    } catch {
      setMessage("Something went wrong. Try again.");
      setState("error");
    }
  };

  if (state === "sent") {
    return (
      <div className="adm-login-sent" role="status">
        <p className="adm-login-check">Check your inbox</p>
        <p>{message}</p>
        {devLink ? (
          <p className="adm-login-dev">
            <span className="adm-badge adm-badge-warn">Local dev</span> No email is configured, so here is the link:{" "}
            <a href={devLink}>open the admin</a>
          </p>
        ) : null}
        <button type="button" className="adm-btn adm-btn-ghost adm-btn-small" onClick={() => setState("idle")}>Use a different address</button>
      </div>
    );
  }

  return (
    <form className="adm-form" onSubmit={submit}>
      <label className="adm-field">
        <span className="adm-label">Work email</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@samuh.work"
        />
      </label>
      {message ? <p className={`adm-note${state === "error" || expired ? " adm-note-error" : ""}`} role="alert">{message}</p> : null}
      <button type="submit" className="adm-btn adm-btn-primary" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Email me a link"}
      </button>
      <p className="adm-note">Team members only. Ask Wilfred or Mike to add your address to the list.</p>
    </form>
  );
}
