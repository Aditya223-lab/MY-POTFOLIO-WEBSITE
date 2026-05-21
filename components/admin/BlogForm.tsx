"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Save, ExternalLink } from "lucide-react";
import {
  createBlog,
  updateBlog,
  deleteBlog,
  type FormState,
} from "@/app/admin/actions";
import type { Blog } from "@/app/generated/prisma/client";
import { SubmitButton, Feedback, Field } from "./ui";
import { ImageUpload } from "./ImageUpload";
import { DeleteButton } from "./DeleteButton";

const initialState: FormState = { ok: false, message: "" };

export function BlogForm({ blog }: { blog?: Blog }) {
  const isEdit = Boolean(blog);
  const [state, formAction] = useActionState(
    isEdit ? updateBlog : createBlog,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {isEdit ? <input type="hidden" name="id" value={blog!.id} /> : null}

      <div className="card flex flex-col gap-5 p-5">
        <Field label="Title">
          <input
            name="title"
            className="field"
            defaultValue={blog?.title ?? ""}
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
            defaultValue={blog?.excerpt ?? ""}
          />
        </Field>

        <Field
          label="Tags"
          hint="Comma-separated, e.g. web security, ctf, writeup"
        >
          <input
            name="tags"
            className="field"
            defaultValue={blog?.tags ?? ""}
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
        <Field
          label="Content"
          hint="Supports Markdown — # headings, **bold**, `code`, lists, links and code blocks."
        >
          <textarea
            name="content"
            className="field min-h-[420px] resize-y font-mono text-sm leading-relaxed"
            defaultValue={blog?.content ?? ""}
            placeholder={"## Introduction\n\nStart writing here…"}
          />
        </Field>
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
