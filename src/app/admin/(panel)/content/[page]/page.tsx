import { notFound } from "next/navigation";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { contentMeta, getPageContent } from "@/lib/content/content";
import { pageSchema } from "@/lib/content/schema";
import type { PageKey } from "@/lib/content/defaults";

export default async function ContentPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const schema = pageSchema(page);
  if (!schema) notFound();
  const [value, meta] = await Promise.all([getPageContent(page as PageKey), contentMeta(page as PageKey)]);
  return <ContentEditor schema={schema} initial={value as unknown as Record<string, Record<string, unknown>>} meta={meta} />;
}
