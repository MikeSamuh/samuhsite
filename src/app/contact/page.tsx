import type { Metadata } from "next";
import DraftShell from "../draft/DraftShell";
import { WORKING } from "../draft/drafts";
import { DraftPage } from "../draft/Go";

export const metadata: Metadata = {
  title: "Contact · SAMUH",
  description: "Let\u2019s talk, human to human. A short form, or reach SAMUH directly.",
};

// A production route. It borrows the working draft's shell until that draft
// is promoted to the root, at which point the shell moves and this page does
// not.
export default function ContactPage() {
  return (
    <DraftShell draft={WORKING}>
      <DraftPage draft={WORKING} id="contact" />
    </DraftShell>
  );
}
