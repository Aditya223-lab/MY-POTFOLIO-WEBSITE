import Link from "next/link";
import {
  FileText,
  Link2,
  Trophy,
  User,
  Plus,
  PenLine,
  ArrowUpRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getProfile } from "@/lib/data";
import { ADMIN_PATH } from "@/lib/config";

export default async function DashboardPage() {
  const [profile, totalPosts, published, socials, achievements] =
    await Promise.all([
      getProfile(),
      prisma.blog.count(),
      prisma.blog.count({ where: { published: true } }),
      prisma.socialLink.count(),
      prisma.achievement.count(),
    ]);

  const stats = [
    { label: "Blog posts", value: totalPosts, sub: `${published} published`, icon: FileText, href: `${ADMIN_PATH}/blogs` },
    { label: "Social links", value: socials, sub: "platforms", icon: Link2, href: `${ADMIN_PATH}/socials` },
    { label: "Achievements", value: achievements, sub: "milestones", icon: Trophy, href: `${ADMIN_PATH}/achievements` },
  ];

  const actions = [
    { label: "Write a new post", href: `${ADMIN_PATH}/blogs/new`, icon: Plus },
    { label: "Edit your profile", href: `${ADMIN_PATH}/profile`, icon: User },
    { label: "Manage social links", href: `${ADMIN_PATH}/socials`, icon: Link2 },
    { label: "Manage achievements", href: `${ADMIN_PATH}/achievements`, icon: Trophy },
  ];

  const firstName = profile.name.trim().split(/\s+/)[0] || "there";

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="font-mono text-sm text-neon">// control panel</p>
        <h1 className="mt-1 text-3xl font-bold">
          Welcome back, {firstName}.
        </h1>
        <p className="mt-1 text-muted">
          Everything on your site is editable from here.
        </p>
      </header>

      {/* stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href} className="card card-hover p-5">
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-neon" />
                <ArrowUpRight className="h-4 w-4 text-muted" />
              </div>
              <p className="mt-3 text-3xl font-bold">{s.value}</p>
              <p className="text-sm text-ink">{s.label}</p>
              <p className="font-mono text-xs text-muted">{s.sub}</p>
            </Link>
          );
        })}
      </div>

      {/* quick actions */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted">
          <PenLine className="h-4 w-4" /> Quick actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {actions.map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.href}
                href={a.href}
                className="group flex items-center gap-3 rounded-xl border border-line bg-panel p-4 transition-colors hover:border-neon/50"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-neon/25 bg-neon/5 text-neon">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="font-medium group-hover:text-neon">
                  {a.label}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="card flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <p className="font-semibold">Your site is live</p>
          <p className="text-sm text-muted">
            Preview every change on the homepage.
          </p>
        </div>
        <Link href="/" target="_blank" className="btn btn-ghost">
          Open site
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
