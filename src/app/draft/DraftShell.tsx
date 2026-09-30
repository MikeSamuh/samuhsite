"use client";

import { usePathname, useRouter } from "next/navigation";
import { cssVars } from "@/lib/tokens";
import { layoutVars, lockedCombo, type PageId } from "@/lib/layout";
import { Nav, Footer } from "../layout/sections";
import { ROUTES, draftBase, getDraft, pageFromPath, type DraftId } from "./drafts";
import "../design/design.css";
import "../design/backdrops.css";
import "../layout/layout.css";
import "./draft.css";

/**
 * The shell every draft shares: the locked style, the Editorial frame, real
 * routes under /draft/<letter>. No rail, no dials. Each draft is sculpted in
 * its own folder; this only frames it.
 */
export default function DraftShell({ draft, children }: { draft: DraftId; children: React.ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const d = getDraft(draft);
  const page = pageFromPath(path, draft);
  const combo = lockedCombo(d.layout.bg);
  const go = (p: PageId) => {
    router.push(`${draftBase(draft)}${ROUTES[p]}`);
    window.scrollTo({ top: 0 });
  };
  return (
    <div
      className="stage D-stage"
      style={{ ...cssVars(combo), ...layoutVars(d.layout) }}
      data-approach="modern"
      data-fill="solid"
      data-hover={combo.hover.id}
      data-entrance="still"
      data-draft={draft}
    >
      <div
        className="L-page D-page"
        data-align={d.layout.align.id}
        data-comp={d.layout.comp.id}
        data-nav={d.layout.nav.id}
        data-rule={d.layout.divider.id}
        data-numbers={d.layout.numbers.id}
        data-heads={d.layout.heads.id}
        data-btn={d.layout.buttons.id}
      >
        <div className="L-body D-body">
          <Nav page={page} go={go} menu={d.layout.nav.id === "nav-menu"} explore={d.layout.nav.id === "nav-minimal"} {...d.nav} />
          {children}
          <Footer go={go} />
        </div>
      </div>
    </div>
  );
}
