import { notFound } from "next/navigation";
import { PostEditor, type PostDraft } from "@/components/admin/PostEditor";
import { getStoredPost } from "@/lib/admin/posts";
import { filePosts } from "@/lib/insights";
import { markdownToHtml } from "@/lib/markdown-html";

export default async function EditPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const stored = await getStoredPost(slug);
  if (stored) {
    const { createdAt, updatedAt, updatedBy, episode, ...rest } = stored;
    const initial: PostDraft = { ...rest, cover: rest.cover ?? "", videoUrl: rest.videoUrl ?? "", duration: rest.duration ?? "", readTime: rest.readTime ?? "", episode: episode ? String(episode) : "" };
    return <PostEditor mode="edit" initial={initial} meta={{ updatedAt, updatedBy, createdAt, from: "admin" }} />;
  }
  const file = filePosts().find((p) => p.slug === slug);
  if (!file || file.type === "research") notFound();
  const initial: PostDraft = {
    slug: file.slug,
    title: file.title,
    type: file.type,
    status: file.status,
    date: file.date,
    author: file.author,
    summary: file.summary,
    tags: file.tags,
    cover: file.cover ?? "",
    videoUrl: file.videoUrl ?? "",
    duration: file.duration ?? "",
    readTime: file.readTime ?? "",
    episode: file.episode ? String(file.episode) : "",
    transcript: file.transcript,
    html: markdownToHtml(file.body),
  };
  return <PostEditor mode="file" initial={initial} />;
}
