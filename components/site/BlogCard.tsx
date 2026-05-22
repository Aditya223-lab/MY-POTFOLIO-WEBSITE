import Link from "next/link";
import { Calendar, Clock, ArrowUpRight, FileText } from "lucide-react";
import type { Blog } from "@/app/generated/prisma/client";
import { formatDate, readingTime, parseTags } from "@/lib/utils";

export function BlogCard({ blog }: { blog: Blog }) {
  const tags = parseTags(blog.tags).slice(0, 3);

  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="card card-hover group flex h-full flex-col overflow-hidden"
    >
      {/* cover */}
      <div className="relative aspect-[16/9] overflow-hidden border-b border-line">
        {blog.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={blog.coverUrl}
            alt={blog.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neon/10 via-violet/10 to-magenta/10">
            <span className="font-mono text-4xl text-neon/40">&lt;/&gt;</span>
          </div>
        )}
        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg border border-neon/30 bg-bg/80 text-neon opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-5">
        {tags.length > 0 ? (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <span
                key={t}
                className="rounded-md border border-line bg-white/[0.02] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-muted"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}

        <h3 className="text-lg font-bold leading-snug text-ink transition-colors group-hover:text-neon">
          {blog.title}
        </h3>

        {blog.excerpt ? (
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
            {blog.excerpt}
          </p>
        ) : (
          <div className="flex-1" />
        )}

        <div className="mt-4 flex items-center gap-4 border-t border-line pt-3 font-mono text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(blog.createdAt)}
          </span>
          {blog.pdfUrl ? (
            <span className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              PDF
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {readingTime(blog.content)} min read
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
