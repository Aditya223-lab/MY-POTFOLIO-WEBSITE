import Link from "next/link";
import { Plus, PenLine, FileText } from "lucide-react";
import { getBlogs } from "@/lib/data";
import { ADMIN_PATH } from "@/lib/config";
import { formatDate } from "@/lib/utils";

export default async function AdminBlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-neon">// blog posts</p>
          <h1 className="mt-1 text-3xl font-bold">Blog Posts</h1>
          <p className="mt-1 text-muted">
            Write, edit, publish, and delete your articles.
          </p>
        </div>
        <Link href={`${ADMIN_PATH}/blogs/new`} className="btn btn-primary">
          <Plus className="h-4 w-4" />
          New post
        </Link>
      </header>

      {blogs.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 p-12 text-center">
          <FileText className="h-8 w-8 text-muted" />
          <p className="text-muted">No posts yet. Write your first one!</p>
          <Link href={`${ADMIN_PATH}/blogs/new`} className="btn btn-primary">
            <Plus className="h-4 w-4" />
            New post
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={`${ADMIN_PATH}/blogs/${blog.id}`}
              className="group flex items-center gap-4 rounded-xl border border-line bg-panel p-4 transition-colors hover:border-neon/50"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold group-hover:text-neon">
                  {blog.title}
                </p>
                <p className="truncate font-mono text-xs text-muted">
                  /blog/{blog.slug} · {formatDate(blog.createdAt)}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-md border px-2 py-1 font-mono text-[10px] uppercase tracking-wide ${
                  blog.published
                    ? "border-neon/40 bg-neon/10 text-neon"
                    : "border-line bg-white/[0.03] text-muted"
                }`}
              >
                {blog.published ? "Published" : "Draft"}
              </span>
              <PenLine className="h-4 w-4 shrink-0 text-muted group-hover:text-neon" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
