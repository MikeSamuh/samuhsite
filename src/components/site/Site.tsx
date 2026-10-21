"use client";

import { SECTIONS, OFF, type PageId } from "@/lib/layout";
import { SITE } from "@/lib/site";
import { Page, type PageCopy } from "@/app/layout/pages";
import { Section, type SiteCopy } from "@/app/layout/sections";
import type { TeaserDemoProps } from "@/components/teamq-teaser/TeaserDemo";

/** The home, composed from SITE's section order and variants. `demo` is
 *  the tool's numbers, scored by the page on the server; with it, the tool
 *  section shows the bars moving. */
export function SiteHome({ demo, content }: { demo?: TeaserDemoProps; /** the admin's words, read by the server page */ content?: SiteCopy }) {
  const sections = SITE.order ? SITE.order.map((id) => SECTIONS.find((s) => s.id === id)!).filter(Boolean) : SECTIONS.filter((s) => !s.optIn);
  return (
    <>
      {sections.map((s) => {
        const v = SITE.layout.sections[s.id];
        if (v === `${s.id}-${OFF}`) return null;
        if (s.id === "meaning" && SITE.copy?.thesisWithMeaning) return null;
        return <Section key={s.id} def={s} variant={v} copy={SITE.copy} demo={s.id === "tool" ? demo : undefined} content={content} />;
      })}
    </>
  );
}

/** Any other page, from pages.tsx. */
export function SitePage({ id, content }: { id: PageId; /** the admin's words, read by the server page */ content?: PageCopy }) {
  return <Page id={id} figures={SITE.figures} content={content} />;
}
