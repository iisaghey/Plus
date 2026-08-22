"use client";

import { useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  UnderlineIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading2,
  Heading3,
  Quote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n/language-provider";

export function RichTextEditor({
  name,
  defaultValue,
  placeholder,
  minHeight = 160,
  disabled = false,
}: {
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
  minHeight?: number;
  disabled?: boolean;
}) {
  const [html, setHtml] = useState(defaultValue ?? "");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
    ],
    content: defaultValue || "",
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "rich-text-content focus:outline-none",
      },
    },
  });

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-mist bg-white transition-colors focus-within:border-teal dark:bg-offwhite",
        disabled && "opacity-60"
      )}
    >
      {!disabled && <Toolbar editor={editor} />}
      <div className="px-3 py-2.5 text-sm text-ink" style={{ minHeight }}>
        <EditorContent editor={editor} />
      </div>
      <input type="hidden" name={name} value={html} readOnly />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor | null }) {
  const { t } = useTranslation();

  if (!editor) {
    return <div className="h-[41px] border-b border-mist bg-offwhite" />;
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-mist bg-offwhite px-1.5 py-1.5">
      <ToolbarButton
        label={t("editorWorkspace.richTextEditor.bold")}
        icon={Bold}
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        label={t("editorWorkspace.richTextEditor.italic")}
        icon={Italic}
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        label={t("editorWorkspace.richTextEditor.underline")}
        icon={UnderlineIcon}
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      />
      <Divider />
      <ToolbarButton
        label={t("editorWorkspace.richTextEditor.heading")}
        icon={Heading2}
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      />
      <ToolbarButton
        label={t("editorWorkspace.richTextEditor.subheading")}
        icon={Heading3}
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      />
      <ToolbarButton
        label={t("editorWorkspace.richTextEditor.quote")}
        icon={Quote}
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />
      <Divider />
      <ToolbarButton
        label={t("editorWorkspace.richTextEditor.bulletList")}
        icon={List}
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <ToolbarButton
        label={t("editorWorkspace.richTextEditor.numberedList")}
        icon={ListOrdered}
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
      <Divider />
      <ToolbarButton
        label={t("editorWorkspace.richTextEditor.alignLeft")}
        icon={AlignLeft}
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      />
      <ToolbarButton
        label={t("editorWorkspace.richTextEditor.alignCenter")}
        icon={AlignCenter}
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      />
      <ToolbarButton
        label={t("editorWorkspace.richTextEditor.alignRight")}
        icon={AlignRight}
        active={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      />
    </div>
  );
}

function Divider() {
  return <span className="mx-1 h-5 w-px shrink-0 bg-mist" />;
}

function ToolbarButton({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={cn(
        "flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors",
        active
          ? "bg-teal text-white"
          : "text-slate hover:bg-mist/60 hover:text-navy dark:hover:text-white"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}
