"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { Save, ExternalLink, Upload } from "lucide-react";
import {
  createBlog,
  updateBlog,
  deleteBlog,
  type FormState,
} from "@/app/admin/actions";
import type { Blog } from "@/app/generated/prisma/client";
import { SubmitButton, Feedback, Field } from "./ui";
import { ImageUpload } from "./ImageUpload";
import { BlogContentEditor } from "./BlogContentEditor";
import { DeleteButton } from "./DeleteButton";

const initialState: FormState = { ok: false, message: "" };

/** Turn an uploaded Markdown note (e.g. from Obsidian) into blog fields. */
function parseMarkdown(filename: string, raw: string) {
  let text = raw.replace(/\r\n/g, "\n");
  let fmTitle = "";
  let fmTags = "";

  // YAML frontmatter (Obsidian "properties")
  const fm = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (fm) {
    const block = fm[1];
    const t = block.match(/^title:\s*(.+)$/m);
    if (t) fmTitle = t[1].trim().replace(/^["']|["']$/g, "");

    const tagInline = block.match(/^tags:\s*(.+)$/m);
    if (tagInline) {
      fmTags = tagInline[1].replace(/[[\]]/g, "").trim();
    } else {
      const tagList = block.match(/^tags:\s*\n((?:[ \t]*-[ \t]*.+\n?)+)/m);
      if (tagList) {
        fmTags = tagList[1]
          .split("\n")
          .map((l) => l.replace(/^[ \t]*-[ \t]*/, "").trim())
          .filter(Boolean)
          .join(", ");
      }
    }
    text = text.slice(fm[0].length);
  }

  text = text.trim();

  // Title: frontmatter -> first H1 -> filename
  let title = fmTitle;
  if (!title) {
    const h1 = text.match(/^#\s+(.+)$/m);
    if (h1) title = h1[1].trim();
  }
  if (!title) {
    title = filename
      .replace(/\.(md|markdown|txt)$/i, "")
      .replace(/[-_]+/g, " ")
      .trim();
  }

  // Drop a leading H1 so the title isn't duplicated in the body.
  const body = text.replace(/^#\s+.+\n+/, "").trim();

  // Excerpt: first substantial paragraph, stripped of markdown.
  let excerpt = "";
  for (const para of body.split(/\n\s*\n/)) {
    const clean = para
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/[#>*`_~]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (clean.length > 24) {
      excerpt = clean.length > 180 ? `${clean.slice(0, 180)}…` : clean;
      break;
    }
  }

  return { title, tags: fmTags, excerpt, content: body };
}

export function BlogForm({ blog }: { blog?: Blog }) {
  const isEdit = Boolean(blog);
  const [state, formAction] = useActionState(
    isEdit ? updateBlog : createBlog,
    initialState,
  );

  const [title, setTitle] = useState(blog?.title ?? "");
  const [excerpt, setExcerpt] = useState(blog?.excerpt ?? "");
  const [tags, setTags] = useState(blog?.tags ?? "");
  const [content, setContent] = useState(blog?.content ?? "");
  const [importNote, setImportNote] = useState("");
  const mdInputRef = useRef<HTMLInputElement>(null);

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (
      content.trim() &&
      !window.confirm(
        "Replace the current title and content with this imported note?",
      )
    ) {
      return;
    }
    const raw = await file.text();
    const parsed = parseMarkdown(file.name, raw);
    setContent(parsed.content);
    if (parsed.title) setTitle(parsed.title);
    if (parsed.tags) setTags(parsed.tags);
    if (parsed.excerpt && !excerpt.trim()) setExcerpt(parsed.excerpt);
    setImportNote(
      `Imported "${file.name}" — review the fields below, then publish.`,
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {isEdit ? <input type="hidden" name="id" value={blog!.id} /> : null}

      {/* import from Obsidian / Markdown */}
      <div className="card flex flex-wrap items-center gap-3 border-neon/25 p-5">
        <input
          ref={mdInputRef}
          type="file"
          accept=".md,.markdown,.txt,text/markdown,text/plain"
          onChange={handleImport}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => mdInputRef.current?.click()}
          className="btn btn-ghost"
        >
          <Upload className="h-4 w-4" />
          Import a Markdown note
        </button>
        <span className="text-xs text-muted">
          {importNote ||
            "Turn an Obsidian note (.md file) into this post — fills the title, tags, and content automatically."}
        </span>
      </div>

      <div className="card flex flex-col gap-5 p-5">
        <Field label="Title">
          <input
            name="title"
            className="field"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My first write-up"
            required
          />
        </Field>

        <Field
          label="URL slug"
          hint="Leave blank to generate one automatically from the title."
        >
          <input
            name="slug"
            className="field font-mono"
            defaultValue={blog?.slug ?? ""}
            placeholder="my-first-write-up"
          />
        </Field>

        <Field
          label="Excerpt"
          hint="A one or two sentence summary shown on cards."
        >
          <textarea
            name="excerpt"
            className="field min-h-20 resize-y"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
        </Field>

        <Field label="Tags" hint="Comma-separated, e.g. web security, ctf">
          <input
            name="tags"
            className="field"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="web security, ctf"
          />
        </Field>
      </div>

      <div className="card p-5">
        <ImageUpload
          name="coverUrl"
          defaultValue={blog?.coverUrl ?? ""}
          label="Cover image"
        />
      </div>

      <div className="card p-5">
        <span className="field-label">Content</span>
        <BlogContentEditor value={content} onChange={setContent} />
        <p className="mt-2 text-xs text-muted">
          Supports Markdown — headings, bold, lists, links, and code blocks.
          Use “Insert image” to add screenshots between your paragraphs.
        </p>
      </div>

      <label className="card flex cursor-pointer items-center justify-between gap-4 p-5">
        <span>
          <span className="block font-semibold">Published</span>
          <span className="block text-sm text-muted">
            When on, this post is visible on your public site.
          </span>
        </span>
        <input
          type="checkbox"
          name="published"
          defaultChecked={blog?.published ?? false}
          className="h-5 w-5 accent-[var(--color-neon)]"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton icon={<Save className="h-4 w-4" />}>
          {isEdit ? "Save changes" : "Create post"}
        </SubmitButton>

        {isEdit && blog!.published ? (
          <Link
            href={`/blog/${blog!.slug}`}
            target="_blank"
            className="btn btn-ghost"
          >
            <ExternalLink className="h-4 w-4" />
            View live
          </Link>
        ) : null}

        {isEdit ? (
          <div className="ml-auto">
            <DeleteButton
              onDelete={deleteBlog.bind(null, blog!.id)}
              label="Delete post"
              confirmText={`Delete "${blog!.title}"? This can't be undone.`}
            />
          </div>
        ) : null}

        <Feedback state={state} />
      </div>
    </form>
  );
}
