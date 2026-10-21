"use client";

import { usePathname } from "next/navigation";
import { cssVars } from "@/lib/tokens";
import { layoutVars, lockedCombo } from "@/lib/layout";
import { SITE, pageFromPath } from "@/lib/site";
import { Nav, Footer } from "@/app/layout/sections";
import type { GlobalContent } from "@/lib/content/defaults";
import "@/app/layout/design.css";
import "@/app/layout/backdrops.css";
import "@/app/layout/layout.css";

/**
 * The shell every page shares: the locked style, the Editorial frame, the
 * nav and the footer. Rendered once by src/app/(site)/layout.tsx, so it
 * stays mounted across navigations and the nav's scroll state survives.
 */
export function SiteShell({ children, content }: { children: React.ReactNode; /** site-wide words from the admin, read by the server layout */ content?: GlobalContent }) {
  const page = pageFromPath(usePathname());
  const combo = lockedCombo(SITE.layout.bg);
  return (
    <div
      className="stage D-stage"
      style={{ ...cssVars(combo), ...layoutVars(SITE.layout) }}
      data-approach="modern"
      data-fill="solid"
      data-hover={combo.hover.id}
      data-entrance="still"
    >
      <div
        className="L-page D-page"
        data-align={SITE.layout.align.id}
        data-comp={SITE.layout.comp.id}
        data-nav={SITE.layout.nav.id}
        data-rule={SITE.layout.divider.id}
        data-numbers={SITE.layout.numbers.id}
        data-heads={SITE.layout.heads.id}
        data-btn={SITE.layout.buttons.id}
      >
        <div className="L-body D-body">
          <Nav page={page} menu={SITE.layout.nav.id === "nav-menu"} explore={SITE.layout.nav.id === "nav-minimal"} {...SITE.nav} content={content} />
          {children}
          <Footer content={content} />
        </div>
      </div>
    </div>
  );
}
