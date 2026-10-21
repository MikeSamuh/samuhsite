// Reading and writing the site's content. Server only.
//
// Each page's words are a document in the store under content:<page>,
// holding only what the team has saved; DEFAULTS fill in the rest at read
// time, so a field added to the code later shows its default until someone
// edits it. Reads are cached under the "content" tag and a save revalidates
// it, so the site stays static between edits.

import { unstable_cache, revalidatePath, revalidateTag } from "next/cache";
import { store } from "@/lib/admin/store";
import { DEFAULTS, type PageKey, type SiteContent } from "./defaults";
import { pageSchema, type AnyFieldDef } from "./schema";

export const CONTENT_TAG = "content";

export interface ContentRecord {
  data: Record<string, unknown>;
  updatedAt: string;
  updatedBy: string;
}

type Section = Record<string, unknown>;

function mergePage<P extends PageKey>(page: P, saved: Record<string, unknown> | undefined): SiteContent[P] {
  const base = DEFAULTS[page] as unknown as Record<string, Section>;
  if (!saved) return DEFAULTS[page];
  const out: Record<string, Section> = {};
  for (const key of Object.keys(base)) {
    const s = saved[key];
    out[key] = s && typeof s === "object" ? { ...base[key], ...(s as Section) } : base[key];
  }
  return out as unknown as SiteContent[P];
}

const readAll = unstable_cache(
  async (): Promise<SiteContent> => {
    const out = { ...DEFAULTS } as Record<PageKey, unknown>;
    for (const page of Object.keys(DEFAULTS) as PageKey[]) {
      const rec = await store().get<ContentRecord>(`content:${page}`);
      out[page] = mergePage(page, rec?.data);
    }
    return out as SiteContent;
  },
  ["site-content"],
  { tags: [CONTENT_TAG] },
);

/** Every page's words, defaults filled in. */
export async function getContent(): Promise<SiteContent> {
  return readAll();
}

export async function getPageContent<P extends PageKey>(page: P): Promise<SiteContent[P]> {
  return (await readAll())[page];
}

/** When a page was last saved in the admin, and by whom. Not cached. */
export async function contentMeta(page: PageKey): Promise<Omit<ContentRecord, "data"> | null> {
  const rec = await store().get<ContentRecord>(`content:${page}`);
  return rec ? { updatedAt: rec.updatedAt, updatedBy: rec.updatedBy } : null;
}

function cleanField(def: AnyFieldDef, value: unknown): unknown {
  if (def.type === "list") {
    if (!Array.isArray(value)) return [];
    return value
      .filter((item) => item && typeof item === "object")
      .map((item) => {
        const row: Record<string, string> = {};
        for (const f of def.fields) {
          const v = (item as Record<string, unknown>)[f.key];
          row[f.key] = typeof v === "string" ? v : "";
        }
        return row;
      });
  }
  return typeof value === "string" ? value : "";
}

/** Keeps the fields the schema knows and drops anything else. A section
 *  or field left out of the input is left out of the document too, so it
 *  keeps showing its default; a field sent empty is empty on purpose. */
export function cleanPage(page: PageKey, input: unknown): Record<string, Section> {
  const schema = pageSchema(page);
  if (!schema) throw new Error(`no schema for ${page}`);
  const src = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const out: Record<string, Section> = {};
  for (const sec of schema.sections) {
    const s = src[sec.key];
    if (!s || typeof s !== "object") continue;
    const row: Section = {};
    for (const f of sec.fields) {
      if (f.key in (s as Record<string, unknown>)) row[f.key] = cleanField(f, (s as Record<string, unknown>)[f.key]);
    }
    out[sec.key] = row;
  }
  return out;
}

function revalidateSite() {
  revalidateTag(CONTENT_TAG);
  // every page reads content through its layout, so the whole tree goes
  revalidatePath("/", "layout");
}

export async function savePageContent(page: PageKey, input: unknown, by: string): Promise<void> {
  const data = cleanPage(page, input);
  const rec: ContentRecord = { data, updatedAt: new Date().toISOString(), updatedBy: by };
  await store().set(`content:${page}`, rec);
  revalidateSite();
}

export async function resetPageContent(page: PageKey): Promise<void> {
  await store().del(`content:${page}`);
  revalidateSite();
}
