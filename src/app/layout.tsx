import type { Metadata } from "next";
import {
  Fraunces,
  Inter,
  Bricolage_Grotesque,
  Instrument_Serif,
  Instrument_Sans,
  Syne,
  Space_Grotesk,
  Figtree,
  IBM_Plex_Mono,
} from "next/font/google";
import "./globals.css";

// All pairings load here so the preview switches with no flash.
// After a pairing is chosen this drops to the two or three faces it uses.
const fraunces = Fraunces({ subsets: ["latin"], variable: "--f-fraunces" });
const inter = Inter({ subsets: ["latin"], variable: "--f-inter" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--f-bricolage" });
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--f-instrument-serif",
});
const instrumentSans = Instrument_Sans({ subsets: ["latin"], variable: "--f-instrument-sans" });
const syne = Syne({ subsets: ["latin"], variable: "--f-syne" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--f-space" });
const figtree = Figtree({ subsets: ["latin"], variable: "--f-figtree" });
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--f-plex-mono",
});

const fontVars = [
  fraunces,
  inter,
  bricolage,
  instrumentSerif,
  instrumentSans,
  syne,
  spaceGrotesk,
  figtree,
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
