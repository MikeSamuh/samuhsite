// Who ticked what on the go-live checklist, when, and any note against an
// item. One document under one key, so the team shares one board. The list
// itself is src/lib/admin/launch-list.ts. Server only.

import { store } from "./store";
import { LAUNCH, OWNERS, type ItemState, type LaunchState, type Owner } from "./launch-list";

export { LAUNCH, OWNERS } from "./launch-list";
export type { CustomItem, ItemState, LaunchGroup, LaunchItem, LaunchState, Owner } from "./launch-list";

const KEY = "launch:checklist";

export async function getLaunchState(): Promise<LaunchState> {
  const s = await store().get<Partial<LaunchState>>(KEY);
  return { items: s?.items ?? {}, custom: Array.isArray(s?.custom) ? s.custom : [] };
}

async function put(s: LaunchState) {
  await store().set(KEY, s);
}

export function knownItem(id: string, s: LaunchState): boolean {
  return LAUNCH.some((g) => g.items.some((i) => i.id === id)) || s.custom.some((c) => c.id === id);
}

/** tick, untick, or write a note. A note alone keeps the current done state */
export async function setLaunchItem(id: string, patch: { done?: boolean; note?: string }, email: string): Promise<LaunchState> {
  const s = await getLaunchState();
  if (!knownItem(id, s)) throw new Error("No such item");
  const prev = s.items[id];
  const fallbackDone = LAUNCH.flatMap((g) => g.items).find((i) => i.id === id)?.done ?? false;
  const next: ItemState = {
    done: patch.done ?? prev?.done ?? fallbackDone,
    by: email,
    at: new Date().toISOString(),
    note: patch.note !== undefined ? patch.note.trim() || undefined : prev?.note,
  };
  s.items[id] = next;
  await put(s);
  return s;
}

export async function addLaunchItem(input: { group: string; title: string; detail?: string; owner: Owner }, email: string): Promise<LaunchState> {
  const s = await getLaunchState();
  if (!LAUNCH.some((g) => g.id === input.group)) throw new Error("No such group");
  const title = input.title.trim();
  if (!title) throw new Error("A title is required");
  if (!OWNERS.includes(input.owner)) throw new Error("No such owner");
  const id = `custom-${Date.now().toString(36)}`;
  s.custom.push({ id, group: input.group, title, detail: input.detail?.trim() || undefined, owner: input.owner, by: email, at: new Date().toISOString() });
  await put(s);
  return s;
}

export async function removeLaunchItem(id: string): Promise<LaunchState> {
  const s = await getLaunchState();
  s.custom = s.custom.filter((c) => c.id !== id);
  delete s.items[id];
  await put(s);
  return s;
}
