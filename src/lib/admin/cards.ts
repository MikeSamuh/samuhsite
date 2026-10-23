// The metaphor cards, as the team keeps them in the admin's Cards tab.
// Server only. One document under cards:list; without one, the cards in
// src/lib/site.ts show, which are the two Wilfred drew on 30 September.
// Each card is a drawing and a name; the name is what screen readers get
// and what a visitor's response is filed under. The home page reads the
// list through getCards(), cached under the "cards" tag, so it stays
// static between edits.

import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { store } from "./store";
import { SITE } from "@/lib/site";

export const CARDS_TAG = "cards";
const KEY = "cards:list";

export interface Card {
  id: string;
  /** read by screen readers; the card shows the drawing alone */
  name: string;
  /** a path in public or an upload URL, portrait, 4 by 5 or thereabouts */
  image: string;
}

interface CardsRecord {
  items: Card[];
  updatedAt: string;
  updatedBy: string;
}

export function defaultCards(): Card[] {
  return (SITE.copy?.cards ?? []).map(([name, , image], i) => ({ id: `site-${i}`, name, image }));
}

const read = unstable_cache(
  async (): Promise<Card[]> => {
    const rec = await store().get<CardsRecord>(KEY);
    return rec?.items ?? defaultCards();
  },
  ["cards-list"],
  { tags: [CARDS_TAG] },
);

/** The cards the site shows, in order. */
export async function getCards(): Promise<Card[]> {
  return read();
}

/** When the list was last saved, and by whom. Not cached. */
export async function cardsMeta(): Promise<Omit<CardsRecord, "items"> | null> {
  const rec = await store().get<CardsRecord>(KEY);
  return rec ? { updatedAt: rec.updatedAt, updatedBy: rec.updatedBy } : null;
}

export async function saveCards(input: unknown, email: string): Promise<Card[]> {
  if (!Array.isArray(input)) throw new Error("A list of cards");
  const items: Card[] = input.map((c, i) => {
    const name = typeof c?.name === "string" ? c.name.trim() : "";
    const image = typeof c?.image === "string" ? c.image.trim() : "";
    if (!image) throw new Error(`Card ${i + 1} has no drawing`);
    if (!name) throw new Error(`Card ${i + 1} has no name`);
    const id = typeof c?.id === "string" && /^[a-z0-9-]{1,40}$/.test(c.id) ? c.id : `card-${Date.now().toString(36)}-${i}`;
    return { id, name, image };
  });
  await store().set(KEY, { items, updatedAt: new Date().toISOString(), updatedBy: email } satisfies CardsRecord);
  revalidateTag(CARDS_TAG);
  revalidatePath("/");
  return items;
}

/** Back to the two in the code. */
export async function resetCards(): Promise<void> {
  await store().del(KEY);
  revalidateTag(CARDS_TAG);
  revalidatePath("/");
}
