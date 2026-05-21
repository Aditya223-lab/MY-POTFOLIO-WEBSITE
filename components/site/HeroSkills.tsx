import { Crosshair, Bug, Flag, Code2 } from "lucide-react";

// What you do, shown as a tidy grid in the hero. Static and instant.
const SKILLS = [
  {
    icon: Crosshair,
    title: "Penetration Testing",
    desc: "Probing systems to find the gaps before attackers do.",
  },
  {
    icon: Bug,
    title: "Bug Bounty",
    desc: "Finding and responsibly disclosing real-world vulnerabilities.",
  },
  {
    icon: Flag,
    title: "CTF Competitions",
    desc: "Reverse engineering, web exploitation, and forensics.",
  },
  {
    icon: Code2,
    title: "Secure Development",
    desc: "Writing clean code that's built to hold up.",
  },
];

export function HeroSkills() {
  return (
    <div className="w-full max-w-[440px]">
      <p className="mb-3 font-mono text-xs text-muted">// what i do</p>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {SKILLS.map((skill) => {
          const Icon = skill.icon;
          return (
            <div key={skill.title} className="card p-4 sm:p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-neon/25 bg-neon/5 text-neon">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 text-sm font-bold leading-tight text-ink">
                {skill.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">
                {skill.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
