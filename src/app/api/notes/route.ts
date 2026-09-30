import { NextResponse } from "next/server";
import { readNotes, writeNotes, type Note } from "@/lib/notes";

// GET  /api/notes?draft=b        the notes, newest first, optionally one draft's
// POST /api/notes                { draft, page, text } leaves a note
// PATCH /api/notes               { id, done } marks one complete or not

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const draft = new URL(req.url).searchParams.get("draft");
  const all = await readNotes();
  const notes = (draft ? all.filter((n) => n.draft === draft) : all).sort((a, b) => b.at.localeCompare(a.at));
  return NextResponse.json(notes);
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Partial<Note> | null;
  const text = body?.text?.trim();
  const draft = body?.draft?.trim();
  if (!text || !draft) return NextResponse.json({ error: "draft and text are required" }, { status: 400 });
  const note: Note = {
    id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
    draft,
    page: (body?.page ?? "").toString().slice(0, 200),
    text: text.slice(0, 4000),
    done: false,
    at: new Date().toISOString(),
  };
  const all = await readNotes();
  all.push(note);
  await writeNotes(all);
  return NextResponse.json(note, { status: 201 });
}

export async function PATCH(req: Request) {
  const body = (await req.json().catch(() => null)) as { id?: string; done?: boolean } | null;
  if (!body?.id || typeof body.done !== "boolean") return NextResponse.json({ error: "id and done are required" }, { status: 400 });
  const all = await readNotes();
  const note = all.find((n) => n.id === body.id);
  if (!note) return NextResponse.json({ error: "no such note" }, { status: 404 });
  note.done = body.done;
  await writeNotes(all);
  return NextResponse.json(note);
}
