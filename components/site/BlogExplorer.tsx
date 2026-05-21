"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import type { Blog } from "@/app/generated/prisma/client";
import { parseTags } from "@/lib/utils";
import { BlogCard } from "./BlogCard";
import { Reveal } from "./Reveal";

function TagChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wide transition-colors ${
        active
          ? "border-neon/60 bg-neon/15 text-neon"
          : "border-line text-muted hover:border-neon/40 hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

/** Client-side search + tag filtering over the published posts. */
export function BlogExplorer({ blogs }: { blogs: Blog[] }) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  const tags = useMemo(() => {
    const set = new Set<string>();
    for (const b of blogs) for (const t of parseTags(b.tags)) set.add(t);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [blogs]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return blogs.filter((b) => {
      const bt = parseTags(b.tags);
      if (tag && !bt.some((t) => t.toLowerCase() === tag.toLowerCase())) {
        return false;
      }
      if (!q) return true;
      return (
        b.title.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q) ||
        b.content.toLowerCase().includes(q) ||
        bt.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [blogs, query, tag]);

  return (
    <div>
      {/* search box */}
      <div className="mx-auto mb-6 max-w-xl">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts by keyword or tag…"
            className="field"
            style={{ paddingLeft: "2.6rem", paddingRight: "2.6rem" }}
          />
          {query ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-neon"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      {/* tag filter */}
      {tags.length > 0 ? (
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          <TagChip active={tag === null} onClick={() => setTag(null)}>
            All
          </TagChip>
          {tags.map((t) => (
            <TagChip
              key={t}
              active={tag === t}
              onClick={() => setTag(tag === t ? null : t)}
            >
              {t}
            </TagChip>
          ))}
        </div>
      ) : null}

      {/* results */}
      {results.length === 0 ? (
        <div className="card mx-auto max-w-md p-10 text-center">
          <p className="font-mono text-4xl text-neon/40">{"</>"}</p>
          <p className="mt-4 text-muted">
            No posts match{" "}
            {query ? (
              <>
                “<span className="text-ink">{query}</span>”
              </>
            ) : (
              "that filter"
            )}
            .
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((blog, i) => (
              <Reveal key={blog.id} delay={(i % 3) * 0.07}>
                <BlogCard blog={blog} />
              </Reveal>
            ))}
          </div>
          <p className="mt-10 text-center font-mono text-xs text-muted">
            showing {results.length} of {blogs.length} posts
          </p>
        </>
      )}
    </div>
  );
}
