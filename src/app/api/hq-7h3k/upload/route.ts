import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { currentUser } from "@/lib/admin/auth";

export const runtime = "nodejs";

// Images from the admin: covers, headshots, metaphor cards, pictures in a
// post. To Vercel Blob when BLOB_READ_WRITE_TOKEN is set (the store Mike
// creates, docs/milestones.md), else to public/uploads on the machine
// running `next dev`. Nothing in public/uploads is committed.

const MAX = 8 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml", "image/avif"];

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (!TYPES.includes(file.type)) return NextResponse.json({ error: "Images only: jpg, png, webp, gif, svg, avif" }, { status: 415 });
  if (file.size > MAX) return NextResponse.json({ error: "Keep images under 8 MB" }, { status: 413 });

  const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "") || "image";
  const folder = typeof form.get("folder") === "string" && /^[a-z-]+$/.test(form.get("folder") as string) ? (form.get("folder") as string) : "uploads";

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`${folder}/${safe}`, file, { access: "public", addRandomSuffix: true });
    return NextResponse.json({ ok: true, url: blob.url, where: "blob" });
  }
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Uploads need BLOB_READ_WRITE_TOKEN set in Vercel" }, { status: 500 });
  }
  const dir = path.join(process.cwd(), "public", "uploads");
  fs.mkdirSync(dir, { recursive: true });
  const name = `${Date.now().toString(36)}-${safe}`;
  fs.writeFileSync(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ ok: true, url: `/uploads/${name}`, where: "local" });
}
