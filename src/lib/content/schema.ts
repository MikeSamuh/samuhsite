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
  /** a soft limit: the editor counts against it, it never blocks a save */
  max?: number;
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
const ta = (key: string, label: string, help?: string, max?: number): FieldDef => ({ key, label, type: "textarea", help, max });
const img = (key: string, label: string, help?: string): FieldDef => ({ key, label, type: "image", help });
const url = (key: string, label: string, help?: string): FieldDef => ({ key, label, type: "url", help });
const list = (key: string, label: string, itemName: string, fields: FieldDef[], help?: string): ListDef => ({ key, label, type: "list", itemName, fields, help });

export const SCHEMA: PageSchema[] = [
  {
    id: "home",
    name: "Home",
    note: "The argument, then the ask. Ten sections.",
    path: "/",
    sections: [
      { key: "hero", label: "Hero", note: "Over the film", fields: [t("title", "Headline", MARKERS), ta("lede", "Lede", "The line under the headline. Leave empty for none"), t("ctaPrimary", "Primary button"), t("ctaSecondary", "Secondary button")] },
      { key: "thesis", label: "Thesis", note: "The performance tax line, below the circles", fields: [ta("text", "The line", MARKERS)] },
      { key: "dictionary", label: "What Samuh means", fields: [t("word", "Word"), t("pronunciation", "Pronunciation"), t("origin", "Part of speech and origin"), ta("definition", "Definition", "Asterisks around the part to colour")] },
      { key: "focus", label: "The overlooked performance driver", note: "Two nested circles become three", fields: [t("eyebrow", "Eyebrow"), t("titleOthers", "Title, first state", MARKERS), t("titleWe", "Title, second state", MARKERS), list("levels", "The three circles", "level", [t("name", "Name"), t("label", "Label"), ta("note", "Note")], "In this order: enterprise, individual, team. Keep three")] },
      { key: "tool", label: "TeamQ", note: "The section head, and the call-out between the tool and the cards", fields: [t("kicker", "Eyebrow"), t("title", "Title"), ta("pitch", "Pitch under the tool", "Leave empty for none"), t("callout", "Call-out line", "Above the button, between the tool and the cards"), t("cta", "Call-out button")] },
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
    path: "/about",
    sections: [
      { key: "head", label: "Page head", fields: [t("kicker", "Eyebrow"), ta("title", "Title"), ta("lede", "Lede")] },
      { key: "believe", label: "What we believe", fields: [t("kicker", "Eyebrow"), t("title", "Title"), ta("big", "Big line"), ta("p1", "Paragraph one"), ta("p2", "Paragraph two")] },
      { key: "partner", label: "Sapien Labs", fields: [t("kicker", "Eyebrow"), t("title", "Title"), ta("p1", "Paragraph one"), ta("p2", "Paragraph two")] },
      { key: "team", label: "Team", fields: [t("kicker", "Eyebrow"), t("title", "Title"), list("members", "People", "person", [t("name", "Name"), t("role", "Role"), ta("bio", "One line", "Shown when there is no full bio"), ta("about", "Full bio", "Blank line between paragraphs. Leave empty to show the one line"), img("photo", "Headshot", "Square works best")]), ta("closing", "Line under the team")] },
      { key: "partners", label: "Partners", note: "Logos are placeholders until SAMUH supplies them", fields: [t("kicker", "Eyebrow"), t("title", "Title")] },
    ],
  },
  {
    id: "process",
    name: "Process",
    note: "The team process in four stages.",
    path: "/process",
    sections: [
      { key: "head", label: "Page head", fields: [t("kicker", "Eyebrow"), t("title", "Title"), ta("lede", "Lede")] },
      { key: "stages", label: "Stages", fields: [list("items", "The stages", "stage", [t("verb", "Verb"), t("line", "One line"), ta("body", "Body")], "Four stages; Assess shows a placeholder icon until its figure is drawn"), t("ctaPrimary", "Primary button"), t("ctaSecondary", "Secondary button")] },
    ],
  },
  {
    id: "solutions",
    name: "Solutions",
    note: "The three measures, the three ways to run a cycle, and the ask.",
    path: "/solutions",
    sections: [
      { key: "head", label: "Page head", fields: [t("kicker", "Eyebrow"), t("title", "Title"), ta("lede", "Lede")] },
      { key: "assess", label: "The three measures", note: "LeadQ, TeamQ, OrgQ, three columns. The middle one has the filled button", fields: [t("kicker", "Eyebrow"), t("title", "Title"), ta("lede", "Lede", "Leave empty for none"), t("rowWho", "Label: who"), t("rowGet", "Label: get"), list("items", "Measures", "measure", [t("tag", "Tag", "You, Your team, Your organization"), t("name", "Name"), t("price", "Price"), ta("what", "What it is"), ta("who", "Who it is for"), ta("get", "What you get"), t("button", "Button"), t("door", "Door", "leadq, teamq or orgq: where the button goes")], "Three cards. Keep three"), ta("note", "Note under the cards")] },
      { key: "tiers", label: "The 90-day cycle", fields: [t("ask", "Button on each tier", "Sends the tier's name to the form below"), t("kicker", "Eyebrow"), t("title", "Title"), list("items", "Tiers", "tier", [t("tag", "Tag"), t("name", "Name"), ta("what", "What it is"), ta("who", "Who it is for"), ta("get", "What you get")], "Three tiers; the table has three columns"), t("rowWhat", "Row label: what"), t("rowWho", "Row label: who"), t("rowGet", "Row label: get"), list("rows", "Comparison rows", "row", [t("label", "Row"), t("a", "DIY"), t("b", "Supported"), t("c", "Guided")]), ta("note", "Note under the table")] },
      { key: "talk", label: "Talk to us", fields: [t("kicker", "Eyebrow"), t("title", "Title"), t("button", "Button"), t("other", "The fourth choice", "Beside DIY, Supported and Guided, for none of the three"), t("note", "Note under the form", "{tier} becomes the chosen tier"), t("thanks", "Thank you line", "{tier} becomes the chosen tier"), t("wait", "Link while they wait")] },
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
    note: "The assessment box beside the calendar, and the direct details.",
    path: "/contact",
    sections: [
      { key: "head", label: "Page head", fields: [t("kicker", "Eyebrow"), t("title", "Title")] },
      { key: "assess", label: "The assessment box", note: "The box's own words are under Start here", fields: [t("title", "Title"), ta("line", "Line")] },
      { key: "book", label: "Book a time", note: "The calendar comes from NEXT_PUBLIC_BOOKING_URL", fields: [t("title", "Title"), ta("line", "Line")] },
    ],
  },
  {
    id: "start",
    name: "The email box",
    note: "The way in: on the home under the tool, on Contact, and under the Solutions cards.",
    path: "/#assess",
    sections: [
      { key: "form", label: "The box", note: "{email} becomes the address given", fields: [t("label", "Field label"), t("placeholder", "Placeholder"), t("button", "Button"), t("thanksTitle", "Thank you title"), ta("thanksText", "Thank you text"), t("talk", "Prefer to talk line"), t("talkLink", "Its link text")] },
    ],
  },
  {
    id: "insights",
    name: "Insights",
    note: "The index page. Posts are in the Blog tab.",
    path: "/insights",
    sections: [
      { key: "head", label: "Page head", fields: [t("kicker", "Eyebrow"), t("title", "Title"), ta("lede", "Lede", "Leave empty for none")] },
      { key: "research", label: "Research", fields: [t("eyebrow", "Eyebrow"), t("title", "Title")] },
      { key: "feed", label: "The feed", fields: [t("eyebrow", "Eyebrow"), t("title", "Title")] },
      { key: "meta", label: "Search and sharing", fields: [ta("description", "Description", "What Google and link previews show")] },
    ],
  },
  {
    id: "global",
    name: "Site-wide",
    note: "Nav, footer, contact details, the report, testimonials.",
    path: "/",
    sections: [
      { key: "brand", label: "Navigation", fields: [ta("partnerLine", "Partner line", "Two lines; the break is kept"), t("navCta", "Nav button")] },
      { key: "footer", label: "Footer", fields: [t("line", "Line", MARKERS), ta("about", "About"), t("talkHeading", "Talk to us heading"), t("bookCall", "Book a call link"), t("cta", "Button"), t("reportLabel", "Report link"), t("youtubeLabel", "YouTube link"), url("youtubeUrl", "YouTube URL")] },
      { key: "contact", label: "Contact details", fields: [t("email", "Email"), t("phone", "Phone", "As dialled, for example +15551234567. Empty shows a TODO")] },
      { key: "report", label: "Sapien Labs report", fields: [t("tag", "Tag"), ta("line", "The claim"), t("kicker", "Kicker"), t("download", "Download link"), t("onSite", "Site link"), url("page", "Report page URL"), url("pdf", "PDF URL")] },
      { key: "testimonials", label: "Testimonials", note: "Shown on Home and Solutions, one at a time", fields: [list("items", "Quotes", "quote", [
        ta("quote", "Quote", "Two or three sentences in their own words. 120 to 220 characters reads best at this size; longer and the section grows", 220),
        t("who", "Name"),
        t("role", "Role, organization"),
        img("photo", "Photo or logo", "Square, 400 × 400 px or larger, jpg, png or webp, under 1 MB. Shown at 112 px beside the quote. Empty shows the placeholder mark"),
      ], "Only quotes cleared for publication. Three to five is right for the carousel")] },
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
