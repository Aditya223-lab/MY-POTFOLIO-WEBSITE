import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getBlogById, getAllBlogTags } from "@/lib/data";
import { BlogForm } from "@/components/admin/BlogForm";
import { ADMIN_PATH } from "@/lib/config";

type Props = { params: Promise<{ id: string }> };

export default async function EditBlogPage({ params }: Props) {
  const { id } = await params;
  const [blog, allTags] = await Promise.all([
    getBlogById(id),
    getAllBlogTags(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <Link
          href={`${ADMIN_PATH}/blogs`}
          className="inline-flex items-center gap-1.5 font-mono text-sm text-muted hover:text-neon"
        >
          <ArrowLeft className="h-4 w-4" />
          all posts
        </Link>
        <h1 className="mt-3 text-3xl font-bold">
          {blog ? "Edit Post" : "Post not found"}
        </h1>
      </header>

      {blog ? (
        <BlogForm blog={blog} allTags={allTags} />
      ) : (
        <div className="card p-10 text-center text-muted">
          That post doesn’t exist — it may have been deleted.
        </div>
      )}
    </div>
  );
}
