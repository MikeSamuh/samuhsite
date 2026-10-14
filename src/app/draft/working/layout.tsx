import type { Metadata } from "next";
import DraftShell from "../DraftShell";

export const metadata: Metadata = {
  title: "Samuh · working draft",
  description: "High performance without the cost to people.",
};

export default function WorkingLayout({ children }: { children: React.ReactNode }) {
  return <DraftShell draft="working">{children}</DraftShell>;
}
