import { redirect } from "next/navigation";
import { WORKING, hrefFor } from "./draft/drafts";

// The root shows the working draft. Decided 14 Oct 2026: main is the
// development build Mike reviews, not the live site (samuh.work is not
// connected to this Vercel project), so the draft that moves is what the
// root should open on. When the working draft is promoted, its shell and
// pages move here and this redirect goes.
export default function Home() {
  redirect(hrefFor(WORKING, "home"));
}
