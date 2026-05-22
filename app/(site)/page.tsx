import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  getProfile,
  getSocials,
  getAchievements,
  getBlogs,
} from "@/lib/data";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { AchievementTimeline } from "@/components/site/AchievementTimeline";
import { SocialsGrid } from "@/components/site/SocialsGrid";
import { BlogCard } from "@/components/site/BlogCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";

export default async function HomePage() {
  const [profile, socials, achievements, blogs] = await Promise.all([
    getProfile(),
    getSocials({ visibleOnly: true }),
    getAchievements(),
    getBlogs({ publishedOnly: true }),
  ]);
  const recent = blogs.slice(0, 3);

  return (
    <>
      <Hero profile={profile} socials={socials} />
      <About profile={profile} />
      <AchievementTimeline achievements={achievements} />
      <SocialsGrid socials={socials} />

      {/* latest writing */}
      <section id="blog" className="relative bg-bg-soft px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            tag="logs"
            title="Latest Writing"
            subtitle="Write-ups, research notes, and lessons from the trenches."
          />

          {recent.length === 0 ? (
            <p className="text-center font-mono text-sm text-muted">
              No posts yet — publish one from{" "}
              <span className="text-neon">/admin</span>.
            </p>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {recent.map((blog, i) => (
                  <Reveal key={blog.id} delay={(i % 3) * 0.07}>
                    <BlogCard blog={blog} />
                  </Reveal>
                ))}
              </div>
              {blogs.length > 3 ? (
                <div className="mt-10 text-center">
                  <Link href="/blog" className="btn btn-ghost">
                    View all posts
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>
    </>
  );
}
