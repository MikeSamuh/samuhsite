import { redirect } from "next/navigation";

// Get Started became Explore TeamQ, which is live at the root.
export default function DraftBStart() {
  redirect("/teamq");
}
