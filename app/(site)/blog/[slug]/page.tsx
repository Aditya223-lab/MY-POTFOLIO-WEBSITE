import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { getBlogBySlug } from "@/lib/data";
import { Markdown } from "@/components/site/Markdown";
import { formatDate, readingTime, parseTags } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return { title: "Post not found" };
  return {
    title: blog.title,
    description: blog.excerpt || undefined,
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog || !blog.published) notFound();

  const tags = parseTags(blog.tags);

  return (
    <article className="px-5 pb-24 pt-32">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 font-mono text-sm text-muted transition-colors hover:text-neon"
        >
          <ArrowLeft className="h-4 w-4" />
          back to blog
        </Link>

        <header className="mt-6">
          {tags.length > 0 ? (
            <div className="mb-4 flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
          ) : null}

          <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            {blog.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-5 border-y border-line py-3 font-mono text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(blog.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {readingTime(blog.content)} min read
            </span>
          </div>
        </header>

        {blog.coverUrl ? (
          <div className="mt-8 overflow-hidden rounded-2xl border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={blog.coverUrl}
              alt={blog.title}
              className="w-full object-cover"
            />
          </div>
        ) : null}

        <div className="mt-10">
          <Markdown content={blog.content} />
        </div>

        <div className="mt-14 border-t border-line pt-8 text-center">
          <Link href="/blog" className="btn btn-ghost">
            <ArrowLeft className="h-4 w-4" />
            All posts
          </Link>
        </div>
      </div>
    </article>
  );
}
