import type { Metadata } from "next";
import DraftShell from "./DraftShell";

export const metadata: Metadata = {
  title: "Samuh · draft 1",
  description: "High performance without the cost to people.",
};

export default function DraftLayout({ children }: { children: React.ReactNode }) {
  return <DraftShell>{children}</DraftShell>;
}
