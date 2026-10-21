import type { Metadata } from "next";
import { Marcellus, Inter, Gilda_Display, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { UtmCapture } from "@/components/lead/UtmCapture";
import { GoogleTag } from "@/components/GoogleTag";
import { SITE_NAME, SITE_URL, TAGLINE } from "@/lib/seo";
import "./globals.css";

// The locked pairing only (src/lib/layout.ts, LOCKED_HASH): Marcellus for
// display, Inter for body, Gilda for captions and eyebrows, Plex Mono for
// data. The thirty-one faces the configurator loaded went with it on
// 21 October 2026; every unused face was a font file on every page.
const marcellus = Marcellus({ subsets: ["latin"], weight: "400", variable: "--f-marcellus", display: "swap" });
const inter = Inter({ subsets: ["latin"], style: ["normal", "italic"], variable: "--f-inter", display: "swap" });
const gilda = Gilda_Display({ subsets: ["latin"], weight: "400", variable: "--f-gilda", display: "swap", preload: false });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--f-plex-mono", display: "swap", preload: false });

const fontVars = [marcellus, inter, gilda, plexMono].map((f) => f.variable).join(" ");

const DESCRIPTION =
  "Organizational and high-performance consulting, in partnership with Sapien Labs. Most teams leak performance through their environment, not their effort. SAMUH finds where yours is leaking, and gives you the practices to close it.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} · ${TAGLINE}`, template: `%s · ${SITE_NAME}` },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  robots: { index: true, follow: true },
  // Search Console's HTML tag method. The value is the content attribute
  // Google shows, set in Vercel's env; nothing renders without it
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={fontVars}>
        <UtmCapture />
        {children}
        {/* GA4 once NEXT_PUBLIC_GA_ID is set; Vercel Analytics once it is
            switched on for the project. Both read in the admin's Analytics tab */}
        <GoogleTag />
        <Analytics />
      </body>
    </html>
  );
}
