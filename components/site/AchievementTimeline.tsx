import { ExternalLink } from "lucide-react";
import type { Achievement } from "@/app/generated/prisma/client";
import { getIcon } from "@/lib/icons";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

export function AchievementTimeline({
  achievements,
}: {
  achievements: Achievement[];
}) {
  return (
    <section id="achievements" className="relative bg-bg-soft px-5 py-24">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          tag="achievements"
          title="Milestones & Wins"
          subtitle="Certifications, CTF placements, projects, and the moments worth marking."
        />

        {achievements.length === 0 ? (
          <p className="text-center font-mono text-sm text-muted">
            No achievements yet — add them from{" "}
            <span className="text-neon">/admin</span>.
          </p>
        ) : (
          <div className="relative">
            {/* vertical line */}
            <div className="absolute bottom-3 left-4 top-3 w-px bg-gradient-to-b from-neon via-violet to-magenta" />

            {achievements.map((a, i) => {
              const Icon = getIcon(a.icon);
              return (
                <Reveal
                  key={a.id}
                  delay={i * 0.05}
                  className="relative pb-7 pl-16 last:pb-0"
                >
                  <span className="absolute left-4 top-1 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-neon/50 bg-bg text-neon glow-cyan">
                    <Icon className="h-4 w-4" />
                  </span>

                  <div className="card card-hover p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold text-ink">
                        {a.title}
                      </h3>
                      {a.date ? (
                        <span className="chip shrink-0">{a.date}</span>
                      ) : null}
                    </div>
                    {a.description ? (
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {a.description}
                      </p>
                    ) : null}
                    {a.link ? (
                      <a
                        href={a.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs text-neon hover:underline"
                      >
                        view <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : null}
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
