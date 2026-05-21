"use client";

import { useRef, useState, useTransition } from "react";
import { Upload, Loader2, ImageIcon, Trash2 } from "lucide-react";
import { uploadImage } from "@/app/admin/actions";

/**
 * File picker that uploads to /public/uploads and stores the resulting URL
 * in a hidden input so it submits with the surrounding form.
 */
export function ImageUpload({
  name,
  defaultValue = "",
  label,
  round = false,
}: {
  name: string;
  defaultValue?: string;
  label: string;
  round?: boolean;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handlePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    startTransition(async () => {
      const res = await uploadImage(fd);
      if (res.ok && res.url) setUrl(res.url);
      else setError(res.message || "Upload failed.");
    });
    e.target.value = "";
  }

  return (
    <div>
      <span className="field-label">{label}</span>
      <input type="hidden" name={name} value={url} />

      <div className="flex items-center gap-4">
        <div
          className={`flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden border border-line bg-bg-soft ${
            round ? "rounded-full" : "rounded-xl"
          }`}
        >
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-7 w-7 text-muted" />
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handlePick}
            className="hidden"
          />
          <button
            type="button"
            disabled={pending}
            onClick={() => inputRef.current?.click()}
            className="btn btn-ghost"
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {pending ? "Uploading…" : url ? "Replace" : "Upload image"}
          </button>
          {url ? (
            <button
              type="button"
              onClick={() => setUrl("")}
              className="btn btn-danger"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          ) : null}
        </div>
      </div>

      {error ? (
        <p className="mt-2 text-xs text-magenta">{error}</p>
      ) : (
        <p className="mt-2 text-xs text-muted">PNG, JPG or WebP · up to 5 MB</p>
      )}
    </div>
  );
}
