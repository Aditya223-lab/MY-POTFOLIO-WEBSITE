import Link from "next/link";
import { ChevronRight, ArrowDown } from "lucide-react";
import type { Profile, SocialLink } from "@/app/generated/prisma/client";
import { getIcon } from "@/lib/icons";

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function Hero({
  profile,
  socials,
}: {
  profile: Profile;
  socials: SocialLink[];
}) {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden px-5 pb-20 pt-32"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-2">
        {/* ---- text ---- */}
        <div className="reveal">
          <span className="chip">
            <span className="h-2 w-2 animate-pulse-glow rounded-full bg-neon" />
            available for opportunities
          </span>

          <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="mb-2 block font-mono text-xl font-medium text-muted sm:text-2xl">
              Hi, I&apos;m
            </span>
            <span className="neon-text text-shadow-neon">{profile.name}</span>
          </h1>

          <p className="mt-4 font-mono text-lg text-neon">
            {profile.headline}
          </p>

          {profile.subheadline ? (
            <p className="mt-5 max-w-md leading-relaxed text-muted">
              {profile.subheadline}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/#achievements" className="btn btn-primary">
              Explore my work
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link href="/blog" className="btn btn-ghost">
              Read the blog
            </Link>
          </div>

          {socials.length > 0 ? (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs text-muted">find me /</span>
              {socials.slice(0, 6).map((s) => {
                const Icon = getIcon(s.icon);
                return (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.platform}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-line text-muted transition-all hover:-translate-y-0.5 hover:border-neon/60 hover:text-neon hover:glow-cyan"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                );
              })}
            </div>
          ) : null}
        </div>

        {/* ---- photo ---- */}
        <div className="flex justify-center md:justify-end">
          <div className="relative w-full max-w-[400px]">
            <div className="glow-blob inset-6 bg-neon/25" />
            <div className="glow-blob inset-16 bg-magenta/20" />
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-neon/30 bg-panel">
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neon/10 to-magenta/10">
                  <span className="neon-text text-8xl font-extrabold">
                    {initials(profile.name)}
                  </span>
                </div>
              )}
              {/* subtle corner accents */}
              <span className="absolute left-3 top-3 h-6 w-6 border-l-2 border-t-2 border-neon" />
              <span className="absolute right-3 top-3 h-6 w-6 border-r-2 border-t-2 border-neon" />
              <span className="absolute bottom-3 left-3 h-6 w-6 border-b-2 border-l-2 border-neon" />
              <span className="absolute bottom-3 right-3 h-6 w-6 border-b-2 border-r-2 border-neon" />
            </div>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <Link
        href="/#about"
        aria-label="Scroll to about"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-muted transition-colors hover:text-neon md:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest">
          scroll
        </span>
        <ArrowDown className="h-4 w-4 animate-bounce" />
      </Link>
    </section>
  );
}
