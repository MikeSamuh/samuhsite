import type { Metadata } from "next";
import DraftShell from "../DraftShell";

export const metadata: Metadata = {
  title: "Samuh · draft A",
  description: "High performance without the cost to people.",
};

export default function DraftALayout({ children }: { children: React.ReactNode }) {
  return <DraftShell draft="a">{children}</DraftShell>;
}
