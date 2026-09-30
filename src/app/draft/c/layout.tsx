import type { Metadata } from "next";
import DraftShell from "../DraftShell";

export const metadata: Metadata = {
  title: "Samuh · draft C",
  description: "High performance without the cost to people.",
};

export default function DraftCLayout({ children }: { children: React.ReactNode }) {
  return <DraftShell draft="c">{children}</DraftShell>;
}
