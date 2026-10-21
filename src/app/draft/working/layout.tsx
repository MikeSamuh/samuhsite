import type { Metadata } from "next";
import { getPageContent } from "@/lib/content/content";
import DraftShell from "../DraftShell";

export const metadata: Metadata = {
  title: "Samuh · working draft",
  description: "High performance without the cost to people.",
};

// The working draft reads the admin's site-wide words here, once, for the
// nav and the footer. Static between edits: a save in the admin
// revalidates the whole tree.
export default async function WorkingLayout({ children }: { children: React.ReactNode }) {
  const global = await getPageContent("global");
  return <DraftShell draft="working" content={global}>{children}</DraftShell>;
}
