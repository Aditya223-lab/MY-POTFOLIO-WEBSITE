import type { Metadata } from "next";
import { getBlogs } from "@/lib/data";
import { BlogExplorer } from "@/components/site/BlogExplorer";
import { Reveal } from "@/components/site/Reveal";

export const metadata: Metadata = {
  title: "Blog",
  description: "Write-ups, research notes, and lessons from the trenches.",
};

export default async function BlogListPage() {
  const blogs = await getBlogs({ publishedOnly: true });

  return (
    <div className="px-5 pb-24 pt-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-14 flex flex-col items-center text-center">
          <span className="font-mono text-sm text-neon">// logs</span>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            The <span className="neon-text">Blog</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted">
            Security research, CTF write-ups, and notes from building things.
          </p>
          <span className="mt-5 h-px w-24 bg-gradient-to-r from-transparent via-neon to-transparent" />
        </Reveal>

        {blogs.length === 0 ? (
          <div className="card mx-auto max-w-md p-10 text-center">
            <p className="font-mono text-4xl text-neon/40">{"</>"}</p>
            <p className="mt-4 text-muted">
              No posts published yet. Check back soon.
            </p>
          </div>
        ) : (
          <BlogExplorer blogs={blogs} />
        )}
      </div>
    </div>
  );
}
