// What visitors share beside a metaphor card. Server only.
//
// One document per response under reflection:<id>. Anonymous by design:
// the card's name, the words, when, and whether the team has put it on
// the back of the card. No email, no IP, nothing that points at a person
// (CLAUDE.md rule 5). A visitor's response arrives hidden; the Responses
// tab in the admin shows it on the card or deletes it. The team can also
// write one there, which arrives shown.

import { unstable_cache, revalidateTag } from "next/cache";
import { store } from "./store";

export const REFLECTIONS_TAG = "reflections";

export interface Reflection {
  id: string;
  /** the card's name, as the component reads it */
  card: string;
  text: string;
  /** on the back of the card for visitors */
  shown: boolean;
  by: "visitor" | "team";
  createdAt: string;
}

const KEY = (id: string) => `reflection:${id}`;

export async function listReflections(): Promise<Reflection[]> {
  const keys = await store().list("reflection:");
  const all = await Promise.all(keys.map((k) => store().get<Reflection>(k)));
  return all.filter((r): r is Reflection => !!r).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addReflection(input: { card: string; text: string; by: Reflection["by"]; shown: boolean }): Promise<Reflection> {
  const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const r: Reflection = { id, card: input.card, text: input.text, by: input.by, shown: input.shown, createdAt: new Date().toISOString() };
  await store().set(KEY(id), r);
  revalidateTag(REFLECTIONS_TAG);
  return r;
}

export async function setReflectionShown(id: string, shown: boolean): Promise<Reflection | null> {
  const r = await store().get<Reflection>(KEY(id));
  if (!r) return null;
  const next = { ...r, shown };
  await store().set(KEY(id), next);
  revalidateTag(REFLECTIONS_TAG);
  return next;
}

export async function deleteReflection(id: string): Promise<void> {
  await store().del(KEY(id));
  revalidateTag(REFLECTIONS_TAG);
}

const readShown = unstable_cache(
  async (): Promise<Pick<Reflection, "card" | "text" | "createdAt">[]> => {
    const all = await listReflections();
    return all.filter((r) => r.shown).map(({ card, text, createdAt }) => ({ card, text, createdAt }));
  },
  ["reflections-shown"],
  { tags: [REFLECTIONS_TAG] },
);

/** The words on the back of a card: what the team has chosen to show, newest first. */
export async function shownReflections(card: string): Promise<string[]> {
  return (await readShown()).filter((r) => r.card === card).map((r) => r.text);
}
