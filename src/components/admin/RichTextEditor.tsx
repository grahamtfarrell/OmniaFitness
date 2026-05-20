"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";

const btnClass =
  "rounded-lg border border-black px-2 py-1 font-mono text-xs uppercase tracking-wide text-black transition-colors hover:bg-pink-primary disabled:opacity-40";

type RichTextEditorProps = {
  value: Record<string, unknown>;
  onChange: (json: Record<string, unknown>) => void;
};

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getJSON() as Record<string, unknown>);
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[240px] px-4 py-3 font-mono text-sm leading-relaxed text-black focus:outline-none prose-blog-editor",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = JSON.stringify(editor.getJSON());
    const incoming = JSON.stringify(value);
    if (current !== incoming) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  if (!editor) return null;

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="overflow-hidden rounded-lg border border-black bg-white">
      <div className="flex flex-wrap gap-2 border-b border-black bg-white px-3 py-2">
        <button
          type="button"
          className={`${btnClass} ${editor.isActive("bold") ? "bg-pink-primary" : ""}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </button>
        <button
          type="button"
          className={`${btnClass} ${editor.isActive("italic") ? "bg-pink-primary" : ""}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </button>
        <button
          type="button"
          className={`${btnClass} ${editor.isActive("heading", { level: 2 }) ? "bg-pink-primary" : ""}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </button>
        <button
          type="button"
          className={`${btnClass} ${editor.isActive("heading", { level: 3 }) ? "bg-pink-primary" : ""}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </button>
        <button
          type="button"
          className={`${btnClass} ${editor.isActive("bulletList") ? "bg-pink-primary" : ""}`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          List
        </button>
        <button type="button" className={btnClass} onClick={setLink}>
          Link
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
