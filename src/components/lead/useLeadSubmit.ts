"use client";

import { useCallback, useState } from "react";
import { track } from "@/lib/analytics";
import type { LeadFlow, LeadInput } from "@/lib/lead";
import { useUtm } from "./useUtm";

export type LeadSubmitState = "idle" | "pending" | "done" | "error";

/** Posts one flow's form to /api/lead. On "error" the form keeps what the
 *  visitor typed and shows the mailto fallback. `attempt` counts failures,
 *  so a form can hand it to <Turnstile resetKey> for a fresh token. */
export function useLeadSubmit(flow: LeadFlow) {
  const utm = useUtm();
  const [state, setState] = useState<LeadSubmitState>("idle");
  const [attempt, setAttempt] = useState(0);

  const submit = useCallback(
    async (input: LeadInput): Promise<boolean> => {
      setState("pending");
      try {
        const response = await fetch("/api/lead", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ ...input, ...utm, flow }),
        });
        const result: { ok?: boolean } = await response.json();
        if (!response.ok || !result.ok) throw new Error(`lead rejected: ${response.status}`);
        track("lead_submit", { flow });
        setState("done");
        return true;
      } catch {
        setAttempt((count) => count + 1);
        setState("error");
        return false;
      }
    },
    [flow, utm],
  );

  /** Posts without touching the form's state or tracking: the intake's
   *  early email-only post, which the visitor never sees succeed or fail. */
  const send = useCallback(
    async (input: LeadInput): Promise<boolean> => {
      try {
        const response = await fetch("/api/lead", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ ...input, ...utm, flow }),
        });
        return response.ok;
      } catch {
        return false;
      }
    },
    [flow, utm],
  );

  return { submit, send, state, attempt };
}
