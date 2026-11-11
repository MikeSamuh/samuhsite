import { notFound } from "next/navigation";
import { JobEditor } from "@/components/admin/JobEditor";
import { getJob } from "@/lib/admin/jobs";

export default async function EditJob({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await getJob(slug);
  if (!job) notFound();
  const { createdAt, updatedAt, updatedBy, ...initial } = job;
  void createdAt;
  return <JobEditor mode="edit" initial={initial} meta={{ updatedAt, updatedBy }} />;
}
