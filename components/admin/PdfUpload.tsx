"use client";

import { useRef, useState, useTransition } from "react";
import {
  Upload,
  Loader2,
  Trash2,
  FileText,
  ExternalLink,
} from "lucide-react";
import { uploadPdf } from "@/app/admin/actions";

const MAX_PDF = 4 * 1024 * 1024; // 4 MB

/**
 * Uploads a PDF and stores the resulting URL in a hidden input so it submits
 * with the surrounding form. Used for the CV and for blog PDF attachments.
 */
export function PdfUpload({
  name,
  defaultValue = "",
  label,
}: {
  name: string;
  defaultValue?: string;
  label: string;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handlePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    if (file.type !== "application/pdf") {
      setError("Please choose a PDF file.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_PDF) {
      setError("PDF must be under 4 MB — try compressing it.");
      e.target.value = "";
      return;
    }
    const fd = new FormData();
    fd.append("file", file);
    startTransition(async () => {
      try {
        const res = await uploadPdf(fd);
        if (res.ok && res.url) setUrl(res.url);
        else setError(res.message || "Upload failed.");
      } catch {
        setError("Upload failed — please try again.");
      }
    });
    e.target.value = "";
  }

  return (
    <div>
      <span className="field-label">{label}</span>
      <input type="hidden" name={name} value={url} />

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
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
          {pending ? "Uploading…" : url ? "Replace PDF" : "Upload PDF"}
        </button>

        {url ? (
          <>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-neon hover:underline"
            >
              <FileText className="h-4 w-4" />
              View PDF
              <ExternalLink className="h-3 w-3" />
            </a>
            <button
              type="button"
              onClick={() => setUrl("")}
              className="btn btn-danger"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          </>
        ) : null}
      </div>

      {error ? (
        <p className="mt-2 text-xs text-magenta">{error}</p>
      ) : (
        <p className="mt-2 text-xs text-muted">PDF file · up to 4 MB</p>
      )}
    </div>
  );
}
