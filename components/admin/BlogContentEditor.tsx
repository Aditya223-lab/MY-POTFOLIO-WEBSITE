"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { ImageIcon, Loader2 } from "lucide-react";
import { uploadImage } from "@/app/admin/actions";

/**
 * Markdown content textarea with an "Insert image" button that uploads a
 * file and drops the image markdown in at the cursor position — so you can
 * place screenshots between paragraphs while writing.
 */
export function BlogContentEditor({ defaultValue }: { defaultValue: string }) {
  const [content, setContent] = useState(defaultValue);
  const [error, setError] = useState("");
  const [uploading, startUpload] = useTransition();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const pendingCursor = useRef<number | null>(null);

  // Restore the caret after an insert re-renders the textarea.
  useEffect(() => {
    if (pendingCursor.current !== null && textareaRef.current) {
      const pos = pendingCursor.current;
      pendingCursor.current = null;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(pos, pos);
    }
  });

  function insertImage(url: string) {
    const ta = textareaRef.current;
    const snippet = `\n\n![describe the image](${url})\n\n`;
    const start = ta ? ta.selectionStart : content.length;
    const end = ta ? ta.selectionEnd : content.length;
    setContent(content.slice(0, start) + snippet + content.slice(end));
    pendingCursor.current = start + snippet.length;
  }

  function handlePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    startUpload(async () => {
      try {
        const res = await uploadImage(fd);
        if (res.ok && res.url) insertImage(res.url);
        else setError(res.message || "Upload failed.");
      } catch {
        setError("Upload failed — try a smaller image.");
      }
    });
    e.target.value = "";
  }

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handlePick}
          className="hidden"
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-neon/50 hover:text-neon disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <ImageIcon className="h-3.5 w-3.5" />
          )}
          {uploading ? "Uploading…" : "Insert image"}
        </button>
        <span className="text-xs">
          {error ? (
            <span className="text-magenta">{error}</span>
          ) : (
            <span className="text-muted">
              drops an image where your cursor is
            </span>
          )}
        </span>
      </div>

      <textarea
        ref={textareaRef}
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="field min-h-[420px] w-full resize-y font-mono text-sm leading-relaxed"
        placeholder={
          "## Introduction\n\nStart writing here…\n\nPut your cursor on a blank line and click “Insert image” to drop in a screenshot."
        }
      />
    </div>
  );
}
