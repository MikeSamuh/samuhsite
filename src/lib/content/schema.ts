// What the Content tab shows for each page: the sections, the fields, and
// the words beside them. Every key here must exist in DEFAULTS; a check at
// module load catches drift between the two.

import { DEFAULTS, type PageKey } from "./defaults";

export type FieldType = "text" | "textarea" | "image" | "url";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  help?: string;
}

export interface ListDef {
  key: string;
  label: string;
  type: "list";
  help?: string;
  /** what one item is called in the add button, for example "question" */
  itemName: string;
  fields: FieldDef[];
}

export type AnyFieldDef = FieldDef | ListDef;

export interface SectionSchema {
  key: string;
  label: string;
  note?: string;
  fields: AnyFieldDef[];
}

export interface PageSchema {
  id: PageKey;
  name: string;
  note: string;
  /** where to see it, for the preview link */
  path: string;
  sections: SectionSchema[];
}

const MARKERS = "Wrap words in *asterisks* for the pink, ~tildes~ for the cyan.";

const t = (key: string, label: string, help?: string): FieldDef => ({ key, label, type: "text", help });
const ta = (key: string, label: string, help?: string): FieldDef => ({ key, label, type: "textarea", help });
const img = (key: string, label: string, help?: string): FieldDef => ({ key, label, type: "image", help });
const url = (key: string, label: string, help?: string): FieldDef => ({ key, label, type: "url", help });
const list = (key: string, label: string, itemName: string, fields: FieldDef[], help?: string): ListDef => ({ key, label, type: "list", itemName, fields, help });

export const SCHEMA: PageSchema[] = [
  {
    id: "home",
    name: "Home",
    note: "The argument, then the ask. Ten sections.",
    path: "/draft/working",
    sections: [
      { key: "hero", label: "Hero", note: "Over the film", fields: [t("title", "Headline", MARKERS), t("ctaPrimary", "Primary button"), t("ctaSecondary", "Secondary button")] },
      { key: "thesis", label: "Thesis", note: "The leak line", fields: [ta("text", "The line", MARKERS)] },
      { key: "dictionary", label: "What Samuh means", fields: [t("word", "Word"), t("pronunciation", "Pronunciation"), t("origin", "Part of speech and origin"), ta("definition", "Definition", "Asterisks around the part to colour")] },
      { key: "focus", label: "Where we focus", note: "The circles that become the Venn", fields: [t("eyebrow", "Eyebrow"), t("titleOthers", "Title, first state", MARKERS), t("titleWe", "Title, second state", MARKERS), t("titleAll", "Title, the Venn"), list("levels", "The three circles", "level", [t("name", "Name"), t("label", "Label"), ta("note", "Note")], "In this order: team, individual, organization. Keep three"), list("capacities", "The four capacities", "capacity", [t("name", "Name"), ta("note", "Note")], "Cognitive, Relational, Emotional, Physical. Keep four")] },
      { key: "tool", label: "TeamQ tool", fields: [t("kicker", "Eyebrow"), t("title", "Title"), ta("pitch", "Pitch under the demo", "Leave empty for the button alone"), t("cta", "Button")] },
      { key: "cards", label: "Metaphor cards", fields: [t("kicker", "Eyebrow"), t("title", "Title"), t("question", "The question beside the card"), ta("thanks", "After sharing", "Asterisks around the words that link to Contact"), t("share", "Share button"), t("view", "View responses button"), t("back", "Back button"), t("next", "Next card button"), list("items", "Cards", "card", [t("name", "Name", "Read by screen readers; the card shows the drawing alone"), t("line", "One line"), img("image", "Drawing")])] },
      { key: "voices", label: "Testimonials", note: "The quotes themselves are under Site-wide", fields: [t("kicker", "Eyebrow"), t("title", "Title")] },
      { key: "case", label: "Case study", fields: [t("kicker", "Eyebrow"), t("title", "Title"), t("tag", "Tag line"), t("line", "Headline"), list("stats", "Figures", "figure", [t("n", "Number"), t("label", "Label")], "Only figures SAMUH has supplied in writing"), t("cta", "Download link")] },
      { key: "faq", label: "FAQ", fields: [t("kicker", "Eyebrow"), t("title", "Title"), list("items", "Questions", "question", [t("q", "Question"), ta("a", "Answer", MARKERS)])] },
      { key: "start", label: "The close", fields: [t("title", "Question"), ta("sub", "Line under it", "Leave empty for none"), t("placeholder", "Field placeholder"), t("startLabel", "Start button"), t("ctaPrimary", "Primary button"), t("ctaSecondary", "Secondary button")] },
    ],
  },
  {
    id: "about",
    name: "About",
    note: "What we believe, Sapien Labs, the team.",
    path: "/draft/working/about",
    sections: [
      { key: "head", label: "Page head", fields: [t("kicker", "Eyebrow"), ta("title", "Title"), ta("lede", "Lede")] },
      { key: "believe", label: "What we believe", fields: [t("kicker", "Eyebrow"), t("title", "Title"), ta("big", "Big line"), ta("p1", "Paragraph one"), ta("p2", "Paragraph two")] },
      { key: "partner", label: "Sapien Labs", fields: [t("kicker", "Eyebrow"), t("title", "Title"), ta("p1", "Paragraph one"), ta("p2", "Paragraph two")] },
      { key: "team", label: "Team", fields: [t("kicker", "Eyebrow"), t("title", "Title"), list("members", "People", "person", [t("name", "Name"), t("role", "Role"), ta("bio", "One line"), img("photo", "Headshot", "Square works best")]), ta("closing", "Line under the team")] },
      { key: "partners", label: "Partners", note: "Logos are placeholders until SAMUH supplies them", fields: [t("kicker", "Eyebrow"), t("title", "Title")] },
    ],
  },
  {
    id: "process",
    name: "Process",
    note: "The team process in four stages.",
    path: "/draft/working/process",
    sections: [
      { key: "head", label: "Page head", fields: [t("kicker", "Eyebrow"), t("title", "Title"), ta("lede", "Lede")] },
      { key: "stages", label: "Stages", fields: [list("items", "The stages", "stage", [t("verb", "Verb"), t("line", "One line"), ta("body", "Body")], "Four stages; Assess shows a placeholder icon until its figure is drawn"), t("ctaPrimary", "Primary button"), t("ctaSecondary", "Secondary button")] },
    ],
  },
  {
    id: "solutions",
    name: "Solutions",
    note: "Three tiers side by side, the pieces on their own, and the ask.",
    path: "/draft/working/solutions",
    sections: [
      { key: "head", label: "Page head", fields: [t("kicker", "Eyebrow"), t("title", "Title"), ta("lede", "Lede")] },
      { key: "tiers", label: "The tiers", fields: [t("kicker", "Eyebrow"), t("title", "Title"), list("items", "Tiers", "tier", [t("tag", "Tag"), t("name", "Name"), ta("what", "What it is"), ta("who", "Who it is for"), ta("get", "What you get")], "Three tiers; the table has three columns"), t("rowWhat", "Row label: what"), t("rowWho", "Row label: who"), t("rowGet", "Row label: get"), list("rows", "Comparison rows", "row", [t("label", "Row"), t("a", "Self-guided"), t("b", "Supported"), t("c", "Guided")]), ta("note", "Note under the table")] },
      { key: "carte", label: "À la carte", note: "Each way to work with SAMUH on its own", fields: [t("kicker", "Eyebrow"), t("title", "Title"), ta("lede", "Lede"), t("ask", "Button on each piece", "Sends the piece's name to the form below"), list("items", "Pieces", "piece", [t("tag", "Tag", "What it builds, for example Builds belief"), t("name", "Name"), ta("what", "What it is"), ta("who", "Who it is for"), t("format", "Format", "Length and setting")]), ta("note", "Note under the pieces")] },
      { key: "talk", label: "Talk to us", fields: [t("kicker", "Eyebrow"), t("title", "Title"), t("button", "Button"), t("note", "Note under the form", "{tier} becomes the chosen tier or piece"), t("thanks", "Thank you line", "{tier} becomes the chosen tier or piece"), t("wait", "Link while they wait")] },
      { key: "voices", label: "Testimonials", note: "The quotes themselves are under Site-wide", fields: [t("kicker", "Eyebrow"), t("title", "Title")] },
    ],
  },
  {
    id: "teamq",
    name: "Explore TeamQ",
    note: "The intro, the tour, the tool and the ask.",
    path: "/teamq",
    sections: [
      { key: "head", label: "Page head", fields: [t("eyebrow", "Eyebrow"), t("title", "Title"), t("ctaPrimary", "Primary button"), t("ctaSecondary", "Secondary button")] },
      { key: "what", label: "What is TeamQ", fields: [t("kicker", "Eyebrow"), t("title", "Title"), ta("p1", "Paragraph one"), ta("p2", "Paragraph two"), ta("p3", "Paragraph three", "{teamSize} becomes the demonstration team's size")] },
      { key: "tour", label: "The tour", fields: [list("items", "Steps", "step", [t("kicker", "Eyebrow"), t("title", "Title"), ta("text", "Text")], "Four steps, one per part of the tool. Keep four")] },
      { key: "tool", label: "The tool", fields: [t("title", "Title")] },
      { key: "ask", label: "The ask", fields: [t("title", "Title"), t("thanksTitle", "Thank you title"), t("thanksText", "Thank you text")] },
    ],
  },
  {
    id: "contact",
    name: "Contact",
    note: "The form and the direct details.",
    path: "/contact",
    sections: [
      { key: "head", label: "Page head", fields: [t("kicker", "Eyebrow"), t("title", "Title")] },
      { key: "aside", label: "Direct details", note: "Email and phone are under Site-wide", fields: [t("title", "Title")] },
    ],
  },
  {
    id: "insights",
    name: "Insights",
    note: "The index page. Posts are in the Blog tab.",
    path: "/insights",
    sections: [
      { key: "research", label: "Research", fields: [t("eyebrow", "Eyebrow"), t("title", "Title")] },
      { key: "feed", label: "The feed", fields: [t("eyebrow", "Eyebrow"), t("title", "Title")] },
      { key: "meta", label: "Search and sharing", fields: [ta("description", "Description", "What Google and link previews show")] },
    ],
  },
  {
    id: "global",
    name: "Site-wide",
    note: "Nav, footer, contact details, the report, testimonials.",
    path: "/draft/working",
    sections: [
      { key: "brand", label: "Navigation", fields: [ta("partnerLine", "Partner line", "Two lines; the break is kept"), t("navCta", "Nav button")] },
      { key: "footer", label: "Footer", fields: [t("line", "Line", MARKERS), ta("about", "About"), t("talkHeading", "Talk to us heading"), t("bookCall", "Book a call link"), t("cta", "Button"), t("reportLabel", "Report link"), t("youtubeLabel", "YouTube link"), url("youtubeUrl", "YouTube URL")] },
      { key: "contact", label: "Contact details", fields: [t("email", "Email"), t("phone", "Phone", "As dialled, for example +15551234567. Empty shows a TODO")] },
      { key: "report", label: "Sapien Labs report", fields: [t("tag", "Tag"), ta("line", "The claim"), t("kicker", "Kicker"), t("download", "Download link"), t("onSite", "Site link"), url("page", "Report page URL"), url("pdf", "PDF URL")] },
      { key: "testimonials", label: "Testimonials", note: "Shown on Home and Solutions", fields: [list("items", "Quotes", "quote", [ta("quote", "Quote"), t("who", "Name"), t("role", "Role, organization")], "Only quotes cleared for publication")] },
    ],
  },
];

export function pageSchema(id: string): PageSchema | undefined {
  return SCHEMA.find((p) => p.id === id);
}

// Drift check: every schema key exists in DEFAULTS with the right shape.
for (const page of SCHEMA) {
  const d = DEFAULTS[page.id] as Record<string, Record<string, unknown>>;
  for (const sec of page.sections) {
    const s = d[sec.key];
    if (!s) throw new Error(`content schema: ${page.id}.${sec.key} is not in DEFAULTS`);
    for (const f of sec.fields) {
      const v = s[f.key];
      if (f.type === "list" ? !Array.isArray(v) : typeof v !== "string") {
        throw new Error(`content schema: ${page.id}.${sec.key}.${f.key} is missing or the wrong type in DEFAULTS`);
      }
    }
  }
}
