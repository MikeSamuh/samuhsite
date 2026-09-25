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
  Modern_Antiqua,
  Special_Elite,
  Overlock,
  IM_Fell_French_Canon,
  DM_Serif_Display,
  DM_Sans,
  Cormorant_Garamond,
  Hanken_Grotesk,
  Newsreader,
  Manrope,
  Playfair_Display,
  Source_Sans_3,
  Libre_Baskerville,
  EB_Garamond,
  Libre_Franklin,
  Bodoni_Moda,
  Marcellus,
  Italiana,
  Prata,
  Gilda_Display,
  Instrument_Serif,
  Tenor_Sans,
  IBM_Plex_Mono,
} from "next/font/google";
import "./globals.css";

// All pairings load here so the preview switches with no flash.
// After a pairing is chosen this drops to the two or three faces it uses.

// expressive
const fraunces = Fraunces({ subsets: ["latin"], variable: "--f-fraunces" });
const inter = Inter({ subsets: ["latin"], style: ["normal", "italic"], variable: "--f-inter" });
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
const antiqua = Modern_Antiqua({ subsets: ["latin"], weight: "400", variable: "--f-antiqua" });
const overlock = Overlock({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--f-overlock",
});
const imfell = IM_Fell_French_Canon({ subsets: ["latin"], weight: "400", variable: "--f-imfell" });
const elite = Special_Elite({ subsets: ["latin"], weight: "400", variable: "--f-elite" });

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

// formal
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--f-playfair" });
const sourceSans = Source_Sans_3({ subsets: ["latin"], variable: "--f-source-sans" });
const baskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--f-baskerville",
});
const garamond = EB_Garamond({ subsets: ["latin"], variable: "--f-garamond" });
const franklin = Libre_Franklin({ subsets: ["latin"], variable: "--f-franklin" });
const bodoni = Bodoni_Moda({ subsets: ["latin"], variable: "--f-bodoni" });

// classy. every display face here is a single weight
const marcellus = Marcellus({ subsets: ["latin"], weight: "400", variable: "--f-marcellus" });
const italiana = Italiana({ subsets: ["latin"], weight: "400", variable: "--f-italiana" });
const prata = Prata({ subsets: ["latin"], weight: "400", variable: "--f-prata" });
const gilda = Gilda_Display({ subsets: ["latin"], weight: "400", variable: "--f-gilda" });
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--f-instrument-serif",
});
const tenor = Tenor_Sans({ subsets: ["latin"], weight: "400", variable: "--f-tenor" });

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
  antiqua,
  elite,
  overlock,
  imfell,
  dmSerif,
  dmSans,
  cormorant,
  hanken,
  newsreader,
  manrope,
  playfair,
  sourceSans,
  baskerville,
  garamond,
  franklin,
  bodoni,
  marcellus,
  italiana,
  prata,
  gilda,
  instrumentSerif,
  tenor,
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
