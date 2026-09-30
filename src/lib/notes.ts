// Notes left on the drafts: what they are and where they are kept.
//
// One JSON document holds every note. On Vercel it lives in Blob storage,
// reached through BLOB_READ_WRITE_TOKEN, which Vercel sets when a Blob store
// is connected to the project. Without that token (local dev) the same
// document is a file at .notes/notes.json, which git ignores. Server only.

import { promises as fs } from "node:fs";
import path from "node:path";

export interface Note {
  id: string;
  /** the draft it was left on: a, b or c */
  draft: string;
  /** the path within the draft, so a note can say which page it meant */
  page: string;
  text: string;
  done: boolean;
  /** ISO time it was left */
  at: string;
}

const BLOB_PATH = "drafts/notes.json";
const LOCAL_PATH = path.join(process.cwd(), ".notes", "notes.json");

const onBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export async function readNotes(): Promise<Note[]> {
  if (onBlob()) {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: BLOB_PATH, limit: 1 });
    if (!blobs.length) return [];
    const res = await fetch(blobs[0].url, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) as Note[];
  }
  try {
    return JSON.parse(await fs.readFile(LOCAL_PATH, "utf8")) as Note[];
  } catch {
    return [];
  }
}

export async function writeNotes(notes: Note[]): Promise<void> {
  const body = JSON.stringify(notes, null, 2);
  if (onBlob()) {
    const { put } = await import("@vercel/blob");
    await put(BLOB_PATH, body, { access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json" });
    return;
  }
  await fs.mkdir(path.dirname(LOCAL_PATH), { recursive: true });
  await fs.writeFile(LOCAL_PATH, body);
}
