"use client";

import { useState } from "react";
import type { ExtraProps } from "react-markdown";
import { Check, Copy } from "lucide-react";

/** Recursively collect the plain-text content of a hast node. */
function nodeText(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as { type?: string; value?: string; children?: unknown[] };
  if (n.type === "text") return n.value ?? "";
  return (n.children ?? []).map(nodeText).join("");
}

/**
 * `<pre>` replacement for ReactMarkdown that adds a "Copy" button to every
 * fenced code block. Wired up in components/site/Markdown.tsx.
 */
export function CodeBlock({
  node,
  children,
  ...preProps
}: React.ComponentPropsWithoutRef<"pre"> & ExtraProps) {
  const [copied, setCopied] = useState(false);
  const code = nodeText(node).replace(/\n+$/, "");

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // The Clipboard API is unavailable on insecure (non-HTTPS) origins.
    }
  }

  return (
    <div className="code-block">
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy code"}
        className={`code-copy${copied ? " is-copied" : ""}`}
      >
        {copied ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
        {copied ? "Copied" : "Copy"}
      </button>
      <pre {...preProps}>{children}</pre>
    </div>
  );
}
