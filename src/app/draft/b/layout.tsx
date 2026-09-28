import type { Metadata } from "next";
import DraftShell from "../DraftShell";

export const metadata: Metadata = {
  title: "Samuh · draft B",
  description: "High performance without the cost to people.",
};

export default function DraftBLayout({ children }: { children: React.ReactNode }) {
  return <DraftShell draft="b">{children}</DraftShell>;
}
