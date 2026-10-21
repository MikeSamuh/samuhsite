import type { Metadata } from "next";
import { adminVars } from "@/lib/tokens";
import "./admin.css";

export const metadata: Metadata = {
  title: "SAMUH admin",
  robots: { index: false, follow: false },
};

/** The admin's shell: its own light surface and stylesheet. Who may see
 *  what is decided in middleware.ts and the panel layout, not here. */
export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return (
    <div className="adm" style={adminVars()}>
      {children}
    </div>
  );
}
