import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BlogForm } from "@/components/admin/BlogForm";
import { getAllBlogTags } from "@/lib/data";
import { ADMIN_PATH } from "@/lib/config";

export default async function NewBlogPage() {
  const allTags = await getAllBlogTags();

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
        <h1 className="mt-3 text-3xl font-bold">New Post</h1>
        <p className="mt-1 text-muted">
          Draft it now — it stays hidden until you switch on “Published”.
        </p>
      </header>

      <BlogForm allTags={allTags} />
    </div>
  );
}
