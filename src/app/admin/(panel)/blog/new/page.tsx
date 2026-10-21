import { PostEditor } from "@/components/admin/PostEditor";

export default function NewPost() {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <PostEditor
      mode="new"
      initial={{ slug: "", title: "", type: "article", status: "draft", date: today, author: "Rahul Varma", summary: "", tags: [], cover: "", videoUrl: "", duration: "", readTime: "", html: "" }}
    />
  );
}
