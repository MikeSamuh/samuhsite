// SAMUH — five dark design directions.
// Every value here is a design token. Whichever direction wins, these
// variables become the real design system; nothing gets rebuilt.

export type ButtonStyle = "text" | "solid" | "pill" | "block" | "outline";

export interface Direction {
  id: string;
  n: number;
  name: string;
  bet: string;          // the one-line argument for this direction
  reads: string;         // what it feels like
  risk: string;          // the honest downside
  buttonStyle: ButtonStyle;
  fonts: {
    displayVar: string;
    displayName: string;
    bodyVar: string;
    bodyName: string;
    monoVar: string;
    monoName: string;
    displayWeight: number;
    displayTracking: string;
    displayLeading: string;
    displayTransform: "none" | "uppercase";
  };
  colors: {
    bg: string;
    surface: string;
    surfaceAlt: string;
    border: string;
    text: string;
    muted: string;
    accent: string;
    onAccent: string;
    accent2: string;
    accent3: string;
  };
  radius: string;
  motionDur: string;
  motionEase: string;
  motionNote: string;
}

export const DIRECTIONS: Direction[] = [
  {
    id: "noir",
    n: 1,
    name: "Editorial Noir",
    bet: "Samuh is a body of thought. Make the site read like a monograph, not a SaaS page.",
    reads: "Slow, confident, expensive. A serif does the talking and almost nothing moves quickly.",
    risk: "Can read as precious. Weakest direction if the site needs to convert fast.",
    buttonStyle: "text",
    fonts: {
      displayVar: "var(--font-fraunces)",
      displayName: "Fraunces",
      bodyVar: "var(--font-inter)",
      bodyName: "Inter",
      monoVar: "var(--font-inter)",
      monoName: "Inter",
      displayWeight: 400,
      displayTracking: "-0.02em",
      displayLeading: "1.05",
      displayTransform: "none",
    },
    colors: {
      bg: "#0B0A0A",
      surface: "#141212",
      surfaceAlt: "#1B1817",
      border: "#2A2626",
      text: "#F2EDE7",
      muted: "#9A918A",
      accent: "#D98BA8",
      onAccent: "#0B0A0A",
      accent2: "#C9B38C",
      accent3: "#8FA8B8",
    },
    radius: "0px",
    motionDur: "600ms",
    motionEase: "cubic-bezier(0.16, 1, 0.3, 1)",
    motionNote: "Long, decelerating. Things arrive rather than snap.",
  },
  {
    id: "signal",
    n: 2,
    name: "Signal",
    bet: "The product is evidence. Make the site look like the instrument that produced it.",
    reads: "Precise and technical. Mono numerals, tight panels, fast and exact interactions.",
    risk: "Cold. Undersells the belonging and human side of the thesis.",
    buttonStyle: "solid",
    fonts: {
      displayVar: "var(--font-instrument)",
      displayName: "Instrument Sans",
      bodyVar: "var(--font-instrument)",
      bodyName: "Instrument Sans",
      monoVar: "var(--font-plex-mono)",
      monoName: "IBM Plex Mono",
      displayWeight: 600,
      displayTracking: "-0.03em",
      displayLeading: "1.05",
      displayTransform: "none",
    },
    colors: {
      bg: "#08090C",
      surface: "#101319",
      surfaceAlt: "#161B23",
      border: "#222833",
      text: "#E8ECF2",
      muted: "#8A93A3",
      accent: "#5B8CFF",
      onAccent: "#05070B",
      accent2: "#4FD1C5",
      accent3: "#FFB020",
    },
    radius: "4px",
    motionDur: "200ms",
    motionEase: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    motionNote: "Quick and mechanical. Feedback is immediate.",
  },
  {
    id: "ember",
    n: 3,
    name: "Ember",
    bet: "Belonging is the emotional core. Warm the dark up so the site feels like a room, not a lab.",
    reads: "Warm charcoal, amber accent, softer shapes. Serious but human.",
    risk: "Warm plus rounded can slide into wellness-app territory. Needs discipline.",
    buttonStyle: "pill",
    fonts: {
      displayVar: "var(--font-newsreader)",
      displayName: "Newsreader",
      bodyVar: "var(--font-figtree)",
      bodyName: "Figtree",
      monoVar: "var(--font-figtree)",
      monoName: "Figtree",
      displayWeight: 500,
      displayTracking: "-0.015em",
      displayLeading: "1.1",
      displayTransform: "none",
    },
    colors: {
      bg: "#121010",
      surface: "#1C1918",
      surfaceAlt: "#241F1D",
      border: "#302B29",
      text: "#F4EEE8",
      muted: "#A59A91",
      accent: "#E8B44A",
      onAccent: "#17120A",
      accent2: "#D9787A",
      accent3: "#7FA88F",
    },
    radius: "14px",
    motionDur: "400ms",
    motionEase: "cubic-bezier(0.34, 1.3, 0.64, 1)",
    motionNote: "Eased with a slight overshoot. Friendly, never bouncy.",
  },
  {
    id: "kinetic",
    n: 4,
    name: "Kinetic",
    bet: "You were hired for motion. Build the direction that actually needs scroll animation to make sense.",
    reads: "Pure black, oversized tight type, hard edges, a different accent per section.",
    risk: "Highest craft cost and the shortest shelf life. Dates faster than the others.",
    buttonStyle: "block",
    fonts: {
      displayVar: "var(--font-space)",
      displayName: "Space Grotesk",
      bodyVar: "var(--font-inter)",
      bodyName: "Inter",
      monoVar: "var(--font-space)",
      monoName: "Space Grotesk",
      displayWeight: 700,
      displayTracking: "-0.045em",
      displayLeading: "0.92",
      displayTransform: "none",
    },
    colors: {
      bg: "#000000",
      surface: "#0D0D0D",
      surfaceAlt: "#151515",
      border: "#262626",
      text: "#FFFFFF",
      muted: "#8C8C8C",
      accent: "#FF4FA3",
      onAccent: "#000000",
      accent2: "#5B7CFF",
      accent3: "#FFD400",
    },
    radius: "0px",
    motionDur: "150ms",
    motionEase: "cubic-bezier(0.2, 0, 0, 1)",
    motionNote: "Snap on interaction, long scroll-driven sequences between sections.",
  },
  {
    id: "institute",
    n: 5,
    name: "Institute",
    bet: "Credibility beats personality. Near-monochrome, visible grid, colour only where you can click.",
    reads: "A research institute. Restrained to the point of austerity.",
    risk: "Forgettable if the photography and copy are not excellent. Nothing else carries it.",
    buttonStyle: "outline",
    fonts: {
      displayVar: "var(--font-inter-tight)",
      displayName: "Inter Tight",
      bodyVar: "var(--font-inter-tight)",
      bodyName: "Inter Tight",
      monoVar: "var(--font-plex-mono)",
      monoName: "IBM Plex Mono",
      displayWeight: 600,
      displayTracking: "-0.025em",
      displayLeading: "1.08",
      displayTransform: "none",
    },
    colors: {
      bg: "#0E0E0E",
      surface: "#151515",
      surfaceAlt: "#1C1C1C",
      border: "#2B2B2B",
      text: "#E6E6E6",
      muted: "#8F8F8F",
      accent: "#9FB6D4",
      onAccent: "#0E0E0E",
      accent2: "#B8B8B8",
      accent3: "#6E6E6E",
    },
    radius: "2px",
    motionDur: "120ms",
    motionEase: "ease-out",
    motionNote: "Barely there. Opacity and colour only, no movement.",
  },
];

export function cssVars(d: Direction): React.CSSProperties {
  return {
    "--bg": d.colors.bg,
    "--surface": d.colors.surface,
    "--surface-alt": d.colors.surfaceAlt,
    "--border": d.colors.border,
    "--text": d.colors.text,
    "--muted": d.colors.muted,
    "--accent": d.colors.accent,
    "--on-accent": d.colors.onAccent,
    "--accent-2": d.colors.accent2,
    "--accent-3": d.colors.accent3,
    "--radius": d.radius,
    "--dur": d.motionDur,
    "--ease": d.motionEase,
    "--font-display": d.fonts.displayVar,
    "--font-body": d.fonts.bodyVar,
    "--font-mono": d.fonts.monoVar,
    "--display-weight": String(d.fonts.displayWeight),
    "--display-tracking": d.fonts.displayTracking,
    "--display-leading": d.fonts.displayLeading,
  } as React.CSSProperties;
}
