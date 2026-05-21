import { MapPin } from "lucide-react";
import type { Profile } from "@/app/generated/prisma/client";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

export function About({ profile }: { profile: Profile }) {
  const paragraphs = (profile.bio || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section id="about" className="relative px-5 py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading tag="whoami" title="About Me" />

        <div className="grid items-start gap-8 md:grid-cols-2">
          {/* bio */}
          <Reveal>
            <div className="space-y-4 text-[15px] leading-relaxed text-muted">
              {paragraphs.length > 0 ? (
                paragraphs.map((p, i) => <p key={i}>{p}</p>)
              ) : (
                <p>Add your story from the admin panel — edit your profile.</p>
              )}
            </div>
            {profile.location ? (
              <p className="mt-5 flex items-center gap-1.5 text-sm text-muted">
                <MapPin className="h-4 w-4 text-neon" />
                {profile.location}
              </p>
            ) : null}
          </Reveal>

          {/* decorative terminal */}
          <Reveal delay={0.1}>
            <div className="card overflow-hidden">
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
