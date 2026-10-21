import { ImageResponse } from "next/og";
import fs from "node:fs/promises";
import path from "node:path";
import { cssVars } from "@/lib/tokens";
import { lockedCombo } from "@/lib/layout";
import { SITE } from "@/lib/site";
import { TAGLINE } from "@/lib/seo";

/**
 * The default sharing card, 1200 by 630: the supplied logo on the site's
 * base colour, the line under it in the display face. Drawn once at build.
 * Colours come from the locked combo, never typed here. Pages with their
 * own image (an Insights post's cover) pass it to pageMeta instead.
 */
export const dynamic = "force-static";

const MARCELLUS = "https://github.com/google/fonts/raw/main/ofl/marcellus/Marcellus-Regular.ttf";

async function displayFont(): Promise<ArrayBuffer | undefined> {
  try {
    const res = await fetch(MARCELLUS);
    return res.ok ? await res.arrayBuffer() : undefined;
  } catch {
    return undefined;
  }
}

export async function GET() {
  const vars = cssVars(lockedCombo(SITE.layout.bg)) as Record<string, string>;
  // the supplied lettering, untouched, in white: the site shows the same
  // PNG through a CSS invert, which a card renderer cannot do
  const logo = await fs.readFile(path.join(process.cwd(), "public", "samuh-logo-light.png"));
  const font = await displayFont();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "72px 84px",
          background: vars["--base"],
          color: vars["--text"],
          fontFamily: font ? "Marcellus" : "serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`data:image/png;base64,${logo.toString("base64")}`} width={404} height={120} alt="" />
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 68, lineHeight: 1.1, maxWidth: 980 }}>{TAGLINE}</div>
          <div style={{ fontSize: 26, color: vars["--accent-2"], letterSpacing: 2 }}>In partnership with Sapien Labs</div>
        </div>
        <div style={{ position: "absolute", right: 84, bottom: 72, width: 220, height: 6, background: vars["--accent"] }} />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: font ? [{ name: "Marcellus", data: font, style: "normal", weight: 400 }] : undefined,
    },
  );
}
