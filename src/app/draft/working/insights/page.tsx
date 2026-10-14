import { redirect } from "next/navigation";

// Insights is live at the root since 12 October 2026. The working draft's
// link already points there (LIVE in drafts.ts); this catches a typed URL.
export default function WorkingInsights() {
  redirect("/insights");
}
