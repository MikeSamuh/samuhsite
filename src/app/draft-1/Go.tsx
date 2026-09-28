"use client";

import { useRouter } from "next/navigation";
import { SECTIONS, OFF, type PageId } from "@/lib/layout";
import { Page } from "../layout/pages";
import { Section } from "../layout/sections";
import { DRAFT, DRAFT_BASE } from "./DraftShell";

const ROUTES: Record<PageId, string> = {
  home: "",
  solutions: "/solutions",
  process: "/process",
  insights: "/insights",
  about: "/about",
  contact: "/contact",
  start: "/get-started",
};

function useGo() {
  const router = useRouter();
  return (p: PageId) => {
    router.push(`${DRAFT_BASE}${ROUTES[p]}`);
    window.scrollTo({ top: 0 });
  };
}

/** The home page: the twelve sections in the Editorial composition. */
export function DraftHome() {
  const go = useGo();
  return (
    <>
      {SECTIONS.map((s) => {
        const v = DRAFT.sections[s.id];
        if (v === `${s.id}-${OFF}`) return null;
        return <Section key={s.id} def={s} variant={v} go={go} />;
      })}
    </>
  );
}

/** Any other page, from pages.tsx, with real navigation. */
export function DraftPage({ id }: { id: PageId }) {
  const go = useGo();
  return <Page id={id} go={go} />;
}
