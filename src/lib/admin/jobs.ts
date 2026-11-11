// Careers postings written in the admin. Server only.
//
// A posting is a document in the store under job:<slug>, with its body as
// HTML from the same editor the Insights posts use, cleaned the same way.
// Only "open" postings are on the site: /careers lists them, newest first,
// and /careers/<slug> shows one. Draft and closed postings 404.
//
// Applying is an email address or a link on the posting. Nothing is
// uploaded and no application is stored (CLAUDE.md rule 5,
// docs/sprint-solutions.md section 6).

import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { z } from "zod";
import { store } from "./store";
import { cleanHtml, slugify } from "./posts";

export const JOBS_TAG = "jobs";

export const JOB_STATUSES = ["draft", "open", "closed"] as const;
export const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"] as const;

export interface Job {
  slug: string;
  title: string;
  /** a place, or empty when the role is remote and open to anywhere */
  location: string;
  remote: boolean;
  type: (typeof JOB_TYPES)[number];
  summary: string;
  /** the body, HTML from the editor */
  html: string;
  /** how to apply: an email address or a link */
  apply: string;
  status: (typeof JOB_STATUSES)[number];
  /** YYYY-MM-DD, the day it was posted */
  posted: string;
  /** YYYY-MM-DD, the last day to apply; empty for none */
  closes: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
}

export type JobInput = Omit<Job, "createdAt" | "updatedAt" | "updatedBy">;

const KEY = (slug: string) => `job:${slug}`;

const day = z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/);
const schema = z.object({
  slug: z.string().trim().max(120).default(""),
  title: z.string().trim().min(1, "A posting needs a title.").max(160),
  location: z.string().trim().max(120).default(""),
  remote: z.boolean().default(false),
  type: z.enum(JOB_TYPES).default("Full-time"),
  summary: z.string().trim().max(400).default(""),
  html: z.string().max(100_000).default(""),
  // an address or a link, nothing else: it becomes an href on the page
  apply: z.string().trim().max(300).default("").refine((v) => !v || z.email().safeParse(v).success || /^https:\/\/\S+$/.test(v), "How to apply is an email address or an https link."),
  status: z.enum(JOB_STATUSES).default("draft"),
  posted: day.or(z.literal("")).default(""),
  closes: day.or(z.literal("")).default(""),
});

function clean(input: unknown): JobInput {
  const parsed = schema.safeParse(input);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Could not read the posting.");
  const d = parsed.data;
  const slug = slugify(d.slug || d.title);
  if (!slug) throw new Error("A posting needs a title.");
  if (d.status === "open" && !d.apply) throw new Error("An open posting needs a way to apply: an email address or a link.");
  return { ...d, slug, html: cleanHtml(d.html), posted: d.posted || (d.status === "open" ? new Date().toISOString().slice(0, 10) : "") };
}

export async function listJobs(): Promise<Job[]> {
  const keys = await store().list("job:");
  const jobs = await Promise.all(keys.map((k) => store().get<Job>(k)));
  return jobs.filter((j): j is Job => !!j).sort((a, b) => (b.posted || b.updatedAt).localeCompare(a.posted || a.updatedAt));
}

export async function getJob(slug: string): Promise<Job | null> {
  return store().get<Job>(KEY(slug));
}

function revalidateJobs(slug?: string) {
  revalidateTag(JOBS_TAG);
  revalidatePath("/careers");
  revalidatePath("/careers/[slug]", "page");
  if (slug) revalidatePath(`/careers/${slug}`);
  revalidatePath("/sitemap.xml");
}

export async function saveJob(input: unknown, by: string, previousSlug?: string): Promise<Job> {
  const data = clean(input);
  const existing = await getJob(previousSlug ?? data.slug);
  const now = new Date().toISOString();
  const job: Job = { ...data, createdAt: existing?.createdAt ?? now, updatedAt: now, updatedBy: by };
  await store().set(KEY(job.slug), job);
  if (previousSlug && previousSlug !== job.slug) await store().del(KEY(previousSlug));
  revalidateJobs(job.slug);
  if (previousSlug && previousSlug !== job.slug) revalidateJobs(previousSlug);
  return job;
}

export async function deleteJob(slug: string): Promise<void> {
  await store().del(KEY(slug));
  revalidateJobs(slug);
}

/** What the site shows: open roles, newest first. Cached until a save. */
export const openJobs = unstable_cache(async () => (await listJobs()).filter((j) => j.status === "open"), ["jobs-open"], { tags: [JOBS_TAG] });

export async function getOpenJob(slug: string): Promise<Job | undefined> {
  return (await openJobs()).find((j) => j.slug === slug);
}

/** The apply line as a link: mailto for an address, the link itself otherwise. */
export function applyHref(apply: string): string {
  return apply.startsWith("https://") ? apply : `mailto:${apply}`;
}
