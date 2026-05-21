import { ArrowUpRight } from "lucide-react";
import type { SocialLink } from "@/app/generated/prisma/client";
import { getIcon } from "@/lib/icons";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

export function SocialsGrid({ socials }: { socials: SocialLink[] }) {
  return (
    <section id="connect" className="relative px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          tag="connect"
          title="Find Me Online"
          subtitle="Profiles, platforms, and places I hang out. Always open to a good conversation."
        />

        {socials.length === 0 ? (
          <p className="text-center font-mono text-sm text-muted">
            No links yet — add them from <span className="text-neon">/admin</span>.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {socials.map((s, i) => {
              const Icon = getIcon(s.icon);
              return (
                <Reveal key={s.id} delay={(i % 3) * 0.07}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card card-hover group flex h-full items-center gap-4 p-5"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-neon/25 bg-neon/5 text-neon transition-colors group-hover:bg-neon/15">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-ink">
                        {s.platform}
                      </span>
                      <span className="block truncate font-mono text-xs text-muted">
                        {s.label || s.url.replace(/^https?:\/\//, "")}
                      </span>
                    </span>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neon" />
                  </a>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
