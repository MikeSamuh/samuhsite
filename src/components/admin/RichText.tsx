"use client";

import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Youtube from "@tiptap/extension-youtube";
import { ADMIN_API } from "@/lib/admin/paths";

/**
 * The post editor. Tiptap with the usual blocks, images, and YouTube: paste
 * a watch link on its own line and it becomes the video, or press the
 * YouTube button and give the link. The HTML it produces is what the site
 * renders (RichBody.tsx), with the embeds swapped for the site's own
 * click-to-play player.
 */
export function RichText({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const [yt, setYt] = useState<string | null>(null);
  const [img, setImg] = useState(false);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
        codeBlock: false,
      }),
      Image.configure({ inline: false }),
      Youtube.configure({ nocookie: true, modestBranding: true, width: 760, height: 428, HTMLAttributes: { title: "Video" } }),
      Placeholder.configure({ placeholder: "Write here. Paste a YouTube link on its own line to embed the video." }),
    ],
    content: value,
    editorProps: { attributes: { class: "tiptap" } },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return <div className="adm-editor"><div className="tiptap adm-muted">Loading the editor…</div></div>;

  const on = (name: string, attrs?: Record<string, unknown>) => editor.isActive(name, attrs);
  const addYoutube = () => {
    const src = (yt ?? "").trim();
    if (src) editor.chain().focus().setYoutubeVideo({ src }).run();
    setYt(null);
  };
  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link to", prev ?? "https://");
    if (url === null) return;
    if (!url || url === "https://") editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };
  const upload = async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    form.append("folder", "insights");
    const res = await fetch(`${ADMIN_API}/upload`, { method: "POST", body: form });
    const data = await res.json();
    if (!res.ok) { alert(data.error ?? "Upload failed"); return; }
    editor.chain().focus().setImage({ src: data.url, alt: file.name.replace(/\.[a-z0-9]+$/i, "") }).run();
  };

  return (
    <div className="adm-editor">
      <div className="adm-toolbar" role="toolbar" aria-label="Formatting">
        <button type="button" className="adm-tool" aria-pressed={on("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button type="button" className="adm-tool" aria-pressed={on("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
        <button type="button" className="adm-tool" aria-pressed={on("paragraph")} onClick={() => editor.chain().focus().setParagraph().run()}>Text</button>
        <span className="adm-tool-sep" />
        <button type="button" className="adm-tool" aria-pressed={on("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><strong>B</strong></button>
        <button type="button" className="adm-tool" aria-pressed={on("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><em>I</em></button>
        <button type="button" className="adm-tool" aria-pressed={on("link")} onClick={setLink}>Link</button>
        <span className="adm-tool-sep" />
        <button type="button" className="adm-tool" aria-pressed={on("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
        <button type="button" className="adm-tool" aria-pressed={on("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
        <button type="button" className="adm-tool" aria-pressed={on("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>Quote</button>
        <button type="button" className="adm-tool" onClick={() => editor.chain().focus().setHorizontalRule().run()}>Rule</button>
        <span className="adm-tool-sep" />
        <button type="button" className="adm-tool adm-tool-yt" onClick={() => setYt((v) => (v === null ? "" : null))} aria-expanded={yt !== null}>▶ YouTube</button>
        <button type="button" className="adm-tool" onClick={() => setImg((v) => !v)} aria-expanded={img}>Image</button>
        <span className="adm-tool-sep" />
        <button type="button" className="adm-tool" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>Undo</button>
        <button type="button" className="adm-tool" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>Redo</button>
      </div>
      {yt !== null ? (
        <form className="adm-yt-form" onSubmit={(e) => { e.preventDefault(); addYoutube(); }}>
          <input type="url" autoFocus placeholder="https://www.youtube.com/watch?v=…" value={yt} onChange={(e) => setYt(e.target.value)} className="adm-input-mono" />
          <button type="submit" className="adm-btn adm-btn-small adm-btn-primary">Embed</button>
          <button type="button" className="adm-btn adm-btn-small adm-btn-ghost" onClick={() => setYt(null)}>Cancel</button>
        </form>
      ) : null}
      {img ? (
        <div className="adm-yt-form">
          <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); setImg(false); }} />
          <button type="button" className="adm-btn adm-btn-small adm-btn-ghost" onClick={() => setImg(false)}>Cancel</button>
        </div>
      ) : null}
      <EditorContent editor={editor} />
    </div>
  );
}
