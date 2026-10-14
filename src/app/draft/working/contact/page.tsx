import { redirect } from "next/navigation";

// Contact is live at the root. The draft URL still lands somewhere.
export default function WorkingContact() {
  redirect("/contact");
}
