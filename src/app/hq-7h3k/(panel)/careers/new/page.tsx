import { JobEditor } from "@/components/admin/JobEditor";

export default function NewJob() {
  return (
    <JobEditor
      mode="new"
      initial={{ slug: "", title: "", location: "", remote: false, type: "Full-time", summary: "", html: "", apply: "", status: "draft", posted: "", closes: "" }}
    />
  );
}
