// GA4 events. A no-op until NEXT_PUBLIC_GA_ID is set and gtag is on the page.
// Spec: docs/sprint-intakes.md, "Analytics".

import type { LeadFlow } from "./lead";

interface AnalyticsEvents {
  lead_submit: { flow: LeadFlow };
  /** the first slider move on the TeamQ teaser */
  teaser_interact: { factor: string };
  /** the Google booking embed was shown */
  booking_open: Record<string, never>;
}

declare global {
  interface Window {
    gtag?: (command: "event", event: string, params?: object) => void;
  }
}

export function track<E extends keyof AnalyticsEvents>(
  event: E,
  ...[params]: AnalyticsEvents[E] extends Record<string, never>
    ? []
    : [params: AnalyticsEvents[E]]
): void {
  if (!process.env.NEXT_PUBLIC_GA_ID) return;
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", event, params);
}
