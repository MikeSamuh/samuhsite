"use client";

import { useRouter } from "next/navigation";
import { SECTIONS, OFF, type PageId } from "@/lib/layout";
import { Page } from "../layout/pages";
import { Section } from "../layout/sections";
import { ROUTES, draftBase, getDraft, type DraftId } from "./drafts";

export function useGo(draft: DraftId) {
  const router = useRouter();
  return (p: PageId) => {
    router.push(`${draftBase(draft)}${ROUTES[p]}`);
    window.scrollTo({ top: 0 });
  };
}

/** The twelve-section home, composed from the draft's layout in drafts.ts. Drafts A and B start here. */
export function DraftHome({ draft }: { draft: DraftId }) {
  const go = useGo(draft);
  const d = getDraft(draft);
  return (
    <>
      {SECTIONS.map((s) => {
        const v = d.layout.sections[s.id];
        if (v === `${s.id}-${OFF}`) return null;
        return <Section key={s.id} def={s} variant={v} go={go} />;
      })}
    </>
  );
}

/** Any other page, from pages.tsx, with real navigation. */
export function DraftPage({ draft, id }: { draft: DraftId; id: PageId }) {
  const go = useGo(draft);
  return <Page id={id} go={go} />;
}
