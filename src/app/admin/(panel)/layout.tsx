import { redirect } from "next/navigation";
import { currentUser } from "@/lib/admin/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) redirect("/admin/login");
  return (
    <div className="adm-frame">
      <AdminNav email={user.email} />
      <main className="adm-main" id="adm-main">
        {children}
      </main>
    </div>
  );
}
