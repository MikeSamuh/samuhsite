import { redirect } from "next/navigation";

// Contact is live at the root. The working draft's link already points
// there (LIVE in drafts.ts); this catches a typed URL.
export default function WorkingContact() {
  redirect("/contact");
}
