import type { Metadata } from "next";
import DraftShell from "../draft/DraftShell";
import { DraftPage } from "../draft/Go";

export const metadata: Metadata = {
  title: "Contact · SAMUH",
  description: "Tell us about your team. A short form, or reach SAMUH directly.",
};

// A production route. It borrows Draft B's shell until Draft B is promoted to
// the root, at which point the shell moves and this page does not.
export default function ContactPage() {
  return (
    <DraftShell draft="b">
      <DraftPage draft="b" id="contact" />
    </DraftShell>
  );
}
