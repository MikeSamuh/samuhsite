import { redirect } from "next/navigation";
import { ADMIN_BASE } from "@/lib/admin/paths";

export default function AdminIndex() {
  redirect(`${ADMIN_BASE}/content`);
}
