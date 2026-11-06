import { redirect } from "next/navigation";
import { ADMIN_BASE } from "@/lib/admin/paths";

/** the Cards tab moved under Landing pages on 6 Nov 2026; old links still land */
export default function CardsMoved() {
  redirect(`${ADMIN_BASE}/landing/metaphor-cards`);
}
