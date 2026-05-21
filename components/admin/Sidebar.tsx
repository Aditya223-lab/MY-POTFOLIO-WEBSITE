"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  User,
  FileText,
  Link2,
  Trophy,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { logout } from "@/app/admin/actions";

const NAV = [
  { suffix: "", label: "Dashboard", icon: LayoutDashboard },
  { suffix: "/profile", label: "Profile", icon: User },
  { suffix: "/blogs", label: "Blog Posts", icon: FileText },
  { suffix: "/socials", label: "Social Links", icon: Link2 },
  { suffix: "/achievements", label: "Achievements", icon: Trophy },
];

export function Sidebar({
  name,
  adminPath,
}: {
  name: string;
  adminPath: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string): boolean {
    if (href === adminPath) return pathname === adminPath;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const nav = (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const Icon = item.icon;
        const href = `${adminPath}${item.suffix}`;
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              active
                ? "border border-neon/40 bg-neon/10 text-neon"
                : "border border-transparent text-muted hover:bg-white/5 hover:text-ink"
            }`}
          >
            <Icon className="h-[18px] w-[18px]" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="flex flex-col gap-1">
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:bg-white/5 hover:text-ink"
      >
        <ExternalLink className="h-[18px] w-[18px]" />
        View live site
      </Link>
      <form action={logout}>
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-magenta transition-colors hover:bg-magenta/10"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Log out
        </button>
      </form>
    </div>
  );

  const brand = (
    <div className="px-2">
      <p className="font-mono text-lg font-bold">
        <span className="text-neon">&gt;</span> admin
        <span className="text-neon">_</span>
      </p>
      <p className="mt-0.5 truncate text-xs text-muted">{name}</p>
    </div>
  );

  return (
    <>
      {/* mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-bg/90 px-5 py-3 backdrop-blur-xl md:hidden">
        {brand}
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg border border-line p-2"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open ? (
        <div className="border-b border-line bg-bg-soft px-5 py-4 md:hidden">
          {nav}
          <div className="mt-4 border-t border-line pt-4">{footer}</div>
        </div>
      ) : null}

      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col justify-between border-r border-line bg-bg-soft p-5 md:flex">
        <div className="flex flex-col gap-7">
          {brand}
          {nav}
        </div>
        {footer}
      </aside>
    </>
  );
}
