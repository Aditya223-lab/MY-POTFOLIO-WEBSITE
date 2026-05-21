/**
 * Seeds the database with starter content so the site looks alive on first run.
 * Run with:  npm run db:seed
 * Safe to re-run — it only fills tables that are still empty.
 */
import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // --- Profile (singleton) -------------------------------------------------
  await prisma.profile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "Aditya Thapa",
      headline: "Cybersecurity & Code Enthusiast",
      subheadline:
        "I break things to understand them — then build them better. Penetration testing, CTFs, and shipping clean code.",
      bio: "I'm a security enthusiast and developer who lives at the intersection of offense and engineering. By day I build software; by night I hunt vulnerabilities, grind CTF boxes, and dig through bug bounty scopes. I believe the best defenders are the ones who know how to attack — so I keep sharpening both edges. This site is my lab notebook: projects, write-ups, and the milestones along the way.",
      location: "Nepal",
      email: "paudel.asal00@gmail.com",
      resumeUrl: "",
      avatarUrl: "",
    },
  });

  // --- Social links --------------------------------------------------------
  if ((await prisma.socialLink.count()) === 0) {
    await prisma.socialLink.createMany({
      data: [
        { platform: "GitHub", label: "@Aditya223-lab", url: "https://github.com/Aditya223-lab", icon: "github", order: 1 },
        { platform: "TryHackMe", label: "My THM profile", url: "https://tryhackme.com/p/your-username", icon: "tryhackme", order: 2 },
        { platform: "Hack The Box", label: "HTB profile", url: "https://app.hackthebox.com/users/your-id", icon: "hackthebox", order: 3 },
        { platform: "Bugcrowd", label: "Bugcrowd researcher", url: "https://bugcrowd.com/your-username", icon: "bugcrowd", order: 4 },
        { platform: "LinkedIn", label: "Connect with me", url: "https://linkedin.com/in/your-username", icon: "linkedin", order: 5 },
        { platform: "Email", label: "paudel.asal00@gmail.com", url: "mailto:paudel.asal00@gmail.com", icon: "mail", order: 6 },
      ],
    });
  }

  // --- Achievements --------------------------------------------------------
  if ((await prisma.achievement.count()) === 0) {
    await prisma.achievement.createMany({
      data: [
        {
          title: "AI-Powered Collaborative Port Defense System",
          description:
            "Final-year project: a real-time, multi-node port-scanning defense platform with an AI threat-scoring engine. Built with Next.js and Spring Boot.",
          date: "2026",
          icon: "shield",
          link: "",
          order: 1,
        },
        {
          title: "CTF Finalist — National Cyber Challenge",
          description:
            "Reached the finals solving web exploitation, reverse engineering, and forensics challenges under time pressure.",
          date: "2025",
          icon: "flag",
          link: "",
          order: 2,
        },
        {
          title: "First Accepted Bug Bounty Report",
          description:
            "Responsibly disclosed an access-control vulnerability and earned my first bounty reward and hall-of-fame mention.",
          date: "2025",
          icon: "bug",
          link: "",
          order: 3,
        },
        {
          title: "Top 5% on TryHackMe",
          description:
            "Climbed into the top percentile by consistently completing rooms across networking, privilege escalation, and offensive security.",
          date: "2024",
          icon: "target",
          link: "",
          order: 4,
        },
      ],
    });
  }

  // --- Blog posts ----------------------------------------------------------
  if ((await prisma.blog.count()) === 0) {
    const posts = [
      {
        title: "Breaking Into Bug Bounty: A Beginner's Field Guide",
        slug: "breaking-into-bug-bounty",
        excerpt:
          "How I went from zero to my first accepted report — the mindset, the tooling, and the mistakes worth skipping.",
        tags: "bug bounty, web security, getting started",
        createdAt: new Date("2026-04-12T10:00:00Z"),
        content: `Bug bounty hunting looks like magic from the outside. It isn't. It's pattern recognition, patience, and a lot of reading.

## Pick one vulnerability class

Don't try to learn everything at once. Start with **access control** issues — they're common, high-impact, and easy to reason about.

## Build a repeatable workflow

Every target gets the same first pass:

\`\`\`bash
# enumerate subdomains, then probe what's alive
subfinder -d target.com -silent | httpx -silent -title -tech-detect
\`\`\`

## Read every report you can

Public disclosures on HackerOne are free training data. Ask of each one:

- What did the hunter *notice* that others missed?
- Could I have found this with my current workflow?

> The gap between you and a top hunter is mostly hours, not talent.

Stay in scope, document everything, and report clearly. The first accepted report changes how the whole thing feels.`,
      },
      {
        title: "A Practical Linux Privilege Escalation Checklist",
        slug: "linux-privilege-escalation-checklist",
        excerpt:
          "You've got a shell. Now what? The enumeration steps I run, in order, to go from a low-priv user to root.",
        tags: "linux, privilege escalation, pentesting",
        createdAt: new Date("2026-04-25T10:00:00Z"),
        content: `Landing a shell is the start, not the finish. Privilege escalation is mostly disciplined enumeration.

## Always start with the basics

\`\`\`bash
id              # who am I, what groups
sudo -l         # what can I run as root?
uname -a        # kernel version
\`\`\`

## The high-value checks

1. **SUID binaries** — \`find / -perm -4000 -type f 2>/dev/null\`
2. **Writable cron jobs** — anything running as root on a schedule
3. **Misconfigured \`sudo\`** rules — \`sudo -l\` is gold
4. **Readable secrets** — config files, history files, \`.env\` leftovers

## Don't skip automation

Tools like \`linpeas\` are great — but only *after* you've looked yourself.
Knowing *why* something is exploitable beats a script flagging it.

> Privilege escalation rewards the patient. Enumerate everything before you exploit anything.`,
      },
      {
        title: "Build Your Own Hacking Lab at Home",
        slug: "build-a-home-hacking-lab",
        excerpt:
          "Practice legally and safely. A simple, free virtual lab setup for sharpening your offensive security skills.",
        tags: "home lab, getting started, pentesting",
        createdAt: new Date("2026-05-08T10:00:00Z"),
        content: `The fastest way to learn offensive security is to *do* it — on machines you're allowed to attack.

## What you need

- A virtualization tool — **VirtualBox** or VMware (both free)
- An attacker VM — **Kali Linux** or Parrot OS
- Target VMs — intentionally vulnerable boxes

## Keep it isolated

Put every lab VM on a **host-only network**. Your practice targets should
never touch the real internet — that keeps things both safe and legal.

\`\`\`text
[ Kali attacker ]  <-->  [ host-only network ]  <-->  [ vulnerable targets ]
\`\`\`

## Good first targets

- **TryHackMe** and **Hack The Box** — guided, browser-friendly
- **VulnHub** boxes — download and run locally
- **OWASP Juice Shop** — a deliberately broken web app

Start easy, take notes, and rebuild your methodology after every box.`,
      },
      {
        title: "Cross-Site Scripting (XSS), Explained Simply",
        slug: "xss-explained-simply",
        excerpt:
          "What XSS really is, the three flavours you'll meet, and how to stop it — without the jargon.",
        tags: "web security, xss, owasp",
        createdAt: new Date("2026-05-15T10:00:00Z"),
        content: `XSS happens when an app lets an attacker's input run as code in someone else's browser.

## The three flavours

1. **Reflected** — the payload bounces straight back in the response
2. **Stored** — the payload is saved (a comment, a profile) and fires later
3. **DOM-based** — client-side JavaScript writes untrusted data into the page

## A classic example

If a search page drops your query into HTML without escaping it:

\`\`\`html
<p>No results for: <script>alert(document.cookie)</script></p>
\`\`\`

…that script runs. Swap the \`alert\` for something nastier and you have account takeover.

## How to stop it

- **Escape output** by context (HTML, attribute, JS, URL)
- Use a **Content-Security-Policy** as a second line of defence
- Treat **every** input as hostile — including data from your own database

> The fix isn't blocking the word "script". It's never trusting input as code.`,
      },
      {
        title: "Why I Built This Portfolio With Next.js + Three.js",
        slug: "building-this-portfolio",
        excerpt:
          "A look under the hood of this site: a 3D hero, a custom CMS, and a fully editable backend — no rebuilds required.",
        tags: "next.js, three.js, web dev",
        createdAt: new Date("2026-05-21T10:00:00Z"),
        content: `I wanted a portfolio I could actually *maintain* — not a static page I'd never touch again.

## The stack

- **Next.js** for the frontend and backend in one project
- **Three.js** for the interactive 3D hero you can drag around
- **Prisma + PostgreSQL** as a real database
- A password-protected **admin panel** to edit everything

## Everything is editable

Blogs, social links, achievements, and even my profile photo all live in a database. I update them from the admin panel — no code, no redeploys.

\`\`\`ts
// every section reads straight from the database
const blogs = await getBlogs({ publishedOnly: true });
\`\`\`

That's the whole idea: a site that grows with me instead of going stale.`,
      },
    ];

    for (const post of posts) {
      await prisma.blog.create({
        data: { ...post, coverUrl: "", published: true },
      });
    }
  }

  console.log("✅ Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
