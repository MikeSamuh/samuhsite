import type { Metadata } from "next";
import {
  Fraunces,
  Inter,
  Bricolage_Grotesque,
  Unbounded,
  Instrument_Sans,
  Syne,
  Space_Grotesk,
  Figtree,
  DM_Serif_Display,
  DM_Sans,
  Cormorant_Garamond,
  Hanken_Grotesk,
  Newsreader,
  Manrope,
  IBM_Plex_Mono,
} from "next/font/google";
import "./globals.css";

// All pairings load here so the preview switches with no flash.
// After a pairing is chosen this drops to the two or three faces it uses.

// expressive
const fraunces = Fraunces({ subsets: ["latin"], variable: "--f-fraunces" });
const inter = Inter({ subsets: ["latin"], variable: "--f-inter" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--f-bricolage" });
const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--f-unbounded",
});
const instrumentSans = Instrument_Sans({ subsets: ["latin"], variable: "--f-instrument-sans" });
const syne = Syne({ subsets: ["latin"], variable: "--f-syne" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--f-space" });
const figtree = Figtree({ subsets: ["latin"], variable: "--f-figtree" });

// refined
const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400", variable: "--f-dm-serif" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--f-dm-sans" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--f-cormorant",
});
const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--f-hanken" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--f-newsreader" });
const manrope = Manrope({ subsets: ["latin"], variable: "--f-manrope" });

// captions and data, every pairing
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--f-plex-mono",
});

const fontVars = [
  fraunces,
  inter,
  bricolage,
  unbounded,
  instrumentSans,
  syne,
  spaceGrotesk,
  figtree,
  dmSerif,
  dmSans,
  cormorant,
  hanken,
  newsreader,
  manrope,
  plexMono,
]
  .map((f) => f.variable)
  .join(" ");

export const metadata: Metadata = {
  title: "Samuh",
  description: "High performance without the cost to people.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={fontVars}>{children}</body>
    </html>
  );
}
