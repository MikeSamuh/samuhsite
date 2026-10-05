// The one lead shape. Every capture flow produces it, /api/lead validates it,
// deliver() sends it. Spec: docs/sprint-intakes.md, "Lead shape".

export type LeadFlow = "contact" | "teaser" | "talk";

export interface Lead {
  flow: LeadFlow;
  /** required for contact and talk, optional for teaser. Revisit at Clarify */
  name?: string;
  email: string;
  phone?: string;
  organization?: string;
  message?: string;
  /** flow 1 */
  reason?: "general" | "solutions" | "partnership" | "other";
  /** flow 3 */
  teamSize?: "1-10" | "11-50" | "51-200" | "200+";
  /** flow 3, what they hope to change */
  change?: string;
  /** flow 3, from ?tier= */
  tier?: "self-guided" | "supported" | "guided";
  /** flow 2, the slider state keyed by factor id */
  answers?: Record<string, number>;
  /** utm_source */
  source?: string;
  /** utm_medium */
  medium?: string;
  /** utm_campaign */
  campaign?: string;
  /** pathname the form was on */
  page: string;
  /** ISO */
  submittedAt: string;
}

/** What a form hands to useLeadSubmit. The hook adds flow and UTM, the server
 *  adds page and submittedAt. The last two never reach a Lead: the honeypot
 *  and the Turnstile token are checked by the route and dropped. */
export type LeadInput = Omit<
  Lead,
  "flow" | "source" | "medium" | "campaign" | "page" | "submittedAt"
> & {
  company_website?: string;
  turnstileToken?: string;
};
