import Link from "next/link";
import type { Profile, SocialLink } from "@/app/generated/prisma/client";
import { getIcon } from "@/lib/icons";
import { externalUrl } from "@/lib/utils";

export function Footer({
  profile,
  socials,
}: {
  profile: Profile;
  socials: SocialLink[];
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-line bg-bg-soft">
      <div className="cyber-grid absolute inset-0 opacity-30" />
      <div className="relative mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <Link
            href="/"
            className="font-mono text-lg font-bold text-ink"
          >
            <span className="text-neon">&gt;</span>{" "}
            {profile.name.trim().split(/\s+/)[0].toLowerCase()}
            <span className="text-neon">_</span>
          </Link>

          {socials.length > 0 ? (
            <div className="flex flex-wrap items-center justify-center gap-3">
              {socials.map((s) => {
                const Icon = getIcon(s.icon);
                return (
                  <a
                    key={s.id}
                    href={externalUrl(s.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.platform}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-line text-muted transition-all hover:-translate-y-0.5 hover:border-neon/60 hover:text-neon"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                );
              })}
            </div>
          ) : null}

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
            <Link href="/#about" className="hover:text-neon">About</Link>
            <Link href="/#achievements" className="hover:text-neon">Achievements</Link>
            <Link href="/#connect" className="hover:text-neon">Connect</Link>
            <Link href="/blog" className="hover:text-neon">Blog</Link>
          </nav>

          <p className="font-mono text-xs text-muted">
            © {year} {profile.name} · built with Next.js + Three.js
          </p>
        </div>
      </div>
    </footer>
  );
}
