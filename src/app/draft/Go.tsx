"use client";

import { useRouter } from "next/navigation";
import { SECTIONS, OFF, type PageId } from "@/lib/layout";
import { Page, type PageCopy } from "../layout/pages";
import { Section, type SiteCopy } from "../layout/sections";
import type { TeaserDemoProps } from "@/components/teamq-teaser/TeaserDemo";
import { getDraft, hrefFor, type DraftId } from "./drafts";

export function useGo(draft: DraftId) {
  const router = useRouter();
  return (p: PageId) => {
    router.push(hrefFor(draft, p));
    window.scrollTo({ top: 0 });
  };
}

/** The twelve-section home, composed from the draft's layout in drafts.ts. Drafts A and B start here. */
/** `demo` is the tool's numbers, scored by the page on the server. With
 *  it, section 9 shows the bars moving; without, the pitch alone. */
export function DraftHome({ draft, demo, content }: { draft: DraftId; demo?: TeaserDemoProps; /** the admin's words, read by the server page. The frozen drafts pass none */ content?: SiteCopy }) {
  const go = useGo(draft);
  const d = getDraft(draft);
  const sections = d.order ? d.order.map((id) => SECTIONS.find((s) => s.id === id)!).filter(Boolean) : SECTIONS.filter((s) => !s.optIn);
  return (
    <>
      {sections.map((s) => {
        const v = d.layout.sections[s.id];
        if (v === `${s.id}-${OFF}`) return null;
        if (s.id === "meaning" && d.copy?.thesisWithMeaning) return null;
        return <Section key={s.id} def={s} variant={v} go={go} copy={d.copy} demo={s.id === "tool" ? demo : undefined} content={content} />;
      })}
    </>
  );
}

/** Any other page, from pages.tsx, with real navigation. */
export function DraftPage({ draft, id, content }: { draft: DraftId; id: PageId; /** the admin's words, read by the server page */ content?: PageCopy }) {
  const go = useGo(draft);
  return <Page id={id} go={go} figures={getDraft(draft).figures} content={content} />;
}
