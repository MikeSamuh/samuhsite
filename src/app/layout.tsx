import type { Metadata } from "next";
import {
  Fraunces,
  Inter,
  Inter_Tight,
  Instrument_Sans,
  IBM_Plex_Mono,
  Newsreader,
  Figtree,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";

// Loaded once here so every direction can switch instantly with no flash.
// Whichever direction wins, this list drops to the two or three faces it uses.
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight" });
const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument" });
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader" });
const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

const fontVars = [
  fraunces,
  inter,
  interTight,
  instrument,
  plexMono,
  newsreader,
  figtree,
  spaceGrotesk,
]
  .map((f) => f.variable)
  .join(" ");

export const metadata: Metadata = {
  title: "Samuh",
  description: "Performance is a property of teams, not individuals.",
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
