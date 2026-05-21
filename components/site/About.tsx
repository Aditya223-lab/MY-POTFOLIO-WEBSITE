import { MapPin } from "lucide-react";
import type { Profile } from "@/app/generated/prisma/client";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function About({ profile }: { profile: Profile }) {
  const paragraphs = (profile.bio || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section id="about" className="relative px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading tag="whoami" title="About Me" />

        <div className="grid items-start gap-10 md:grid-cols-5">
          {/* avatar */}
          <Reveal className="md:col-span-2">
            <div className="relative mx-auto aspect-square w-full max-w-xs">
              <div className="glow-blob inset-4 bg-neon/30" />
              <div className="relative h-full w-full overflow-hidden rounded-2xl border border-neon/30 bg-panel">
                {profile.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neon/10 to-magenta/10">
                    <span className="neon-text text-7xl font-extrabold">
                      {initials(profile.name)}
                    </span>
                  </div>
                )}
                {/* corner brackets */}
                <span className="absolute left-2 top-2 h-5 w-5 border-l-2 border-t-2 border-neon" />
                <span className="absolute right-2 top-2 h-5 w-5 border-r-2 border-t-2 border-neon" />
                <span className="absolute bottom-2 left-2 h-5 w-5 border-b-2 border-l-2 border-neon" />
                <span className="absolute bottom-2 right-2 h-5 w-5 border-b-2 border-r-2 border-neon" />
              </div>
            </div>
            <div className="mt-5 text-center">
              <p className="text-lg font-bold">{profile.name}</p>
              <p className="font-mono text-sm text-neon">{profile.headline}</p>
              {profile.location ? (
                <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-muted">
                  <MapPin className="h-3.5 w-3.5" />
                  {profile.location}
                </p>
              ) : null}
            </div>
          </Reveal>

          {/* bio + terminal */}
          <Reveal delay={0.1} className="md:col-span-3">
            <div className="space-y-4 text-[15px] leading-relaxed text-muted">
              {paragraphs.length > 0 ? (
                paragraphs.map((p, i) => <p key={i}>{p}</p>)
              ) : (
                <p>
                  Add your story from the admin panel — head to{" "}
                  <span className="font-mono text-neon">/admin</span> and edit
                  your profile.
                </p>
              )}
            </div>

            {/* decorative terminal */}
            <div className="card mt-7 overflow-hidden">
              <div className="flex items-center gap-2 border-b border-line bg-bg-soft px-4 py-2.5">
                <span className="h-3 w-3 rounded-full bg-magenta/70" />
                <span className="h-3 w-3 rounded-full bg-neon/50" />
                <span className="h-3 w-3 rounded-full bg-violet/60" />
                <span className="ml-2 font-mono text-xs text-muted">
                  ~/profile
                </span>
              </div>
              <div className="space-y-1.5 p-4 font-mono text-sm">
                <p>
                  <span className="text-neon">$</span>{" "}
                  <span className="text-muted">whoami</span>
                </p>
                <p className="text-ink">
                  {profile.name.toLowerCase().replace(/\s+/g, "_")}
                </p>
                <p className="pt-2">
                  <span className="text-neon">$</span>{" "}
                  <span className="text-muted">cat focus.txt</span>
                </p>
                <p className="text-ink">&gt; offensive security &amp; pentesting</p>
                <p className="text-ink">&gt; ctf competitions</p>
                <p className="text-ink">&gt; secure software development</p>
                <p className="pt-2">
                  <span className="text-neon">$</span>{" "}
                  <span className="text-muted">status</span>
                </p>
                <p className="text-magenta">
                  [ online ] learning · building · breaking
                  <span className="animate-blink">_</span>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
