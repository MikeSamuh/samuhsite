"use client";

import { usePathname, useRouter } from "next/navigation";
import { cssVars } from "@/lib/tokens";
import { PRESETS, parseLayoutHash, layoutVars, lockedCombo, type PageId } from "@/lib/layout";
import { Nav, Footer } from "../layout/sections";
import "../design/design.css";
import "../layout/layout.css";
import "./draft.css";

/**
 * Draft 1. The Editorial layout, the locked style, real routes. No rail, no
 * dials: this is the site as a first pass, to be sculpted from here. The
 * page composition comes from the Editorial preset in layout.ts so the tool
 * and the draft cannot drift apart.
 */
export const DRAFT = parseLayoutHash(PRESETS[0].hash);
export const DRAFT_BASE = "/draft-1";

const ROUTES: Record<PageId, string> = {
  home: "",
  solutions: "/solutions",
  process: "/process",
  insights: "/insights",
  about: "/about",
  contact: "/contact",
  start: "/get-started",
};

export function pageFromPath(path: string): PageId {
  const rest = path.replace(DRAFT_BASE, "").replace(/\/$/, "");
  return (Object.keys(ROUTES) as PageId[]).find((k) => ROUTES[k] === rest) ?? "home";
}

export default function DraftShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const page = pageFromPath(path);
  const combo = lockedCombo(DRAFT.bg);
  const go = (p: PageId) => {
    router.push(`${DRAFT_BASE}${ROUTES[p]}`);
    window.scrollTo({ top: 0 });
  };
  return (
    <div
      className="stage D-stage"
      style={{ ...cssVars(combo), ...layoutVars(DRAFT) }}
      data-approach="modern"
      data-fill="solid"
      data-hover={combo.hover.id}
      data-entrance="still"
    >
      <div
        className="L-page D-page"
        data-align={DRAFT.align.id}
        data-comp={DRAFT.comp.id}
        data-nav={DRAFT.nav.id}
        data-rule={DRAFT.divider.id}
        data-numbers={DRAFT.numbers.id}
        data-heads={DRAFT.heads.id}
        data-btn={DRAFT.buttons.id}
      >
        <div className="L-body D-body">
          <Nav page={page} go={go} menu={DRAFT.nav.id === "nav-menu"} explore={DRAFT.nav.id === "nav-minimal"} />
          {children}
          <Footer go={go} />
        </div>
      </div>
    </div>
  );
}
