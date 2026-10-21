import type { Metadata } from "next";
import { getContent } from "@/lib/content/content";
import DraftShell from "../draft/DraftShell";
import { WORKING } from "../draft/drafts";
import { DraftPage } from "../draft/Go";

export const metadata: Metadata = {
  title: "Contact · SAMUH",
  description: "Let’s talk, human to human. A short form, or reach SAMUH directly.",
};

// A production route. It borrows the working draft's shell until that draft
// is promoted to the root, at which point the shell moves and this page does
// not. The words come from the admin's content layer.
export default async function ContactPage() {
  const { contact, global } = await getContent();
  return (
    <DraftShell draft={WORKING} content={global}>
      <DraftPage draft={WORKING} id="contact" content={{ contact, global }} />
    </DraftShell>
  );
}
