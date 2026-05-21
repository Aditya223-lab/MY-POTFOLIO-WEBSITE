import type { Metadata } from "next";
import { getProfile, getSocials } from "@/lib/data";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

// Always render fresh so content edits appear immediately.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return {
    title: {
      default: `${profile.name} · ${profile.headline}`,
      template: `%s · ${profile.name}`,
    },
    description: profile.subheadline || profile.headline,
  };
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, socials] = await Promise.all([
    getProfile(),
    getSocials({ visibleOnly: true }),
  ]);

  return (
    <>
      {/* fixed atmospheric background */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="cyber-grid radial-fade absolute inset-0 opacity-70" />
        <div className="glow-blob -left-32 -top-24 h-[420px] w-[420px] bg-neon/20" />
        <div className="glow-blob -right-40 top-[22%] h-[480px] w-[480px] bg-magenta/15" />
        <div className="glow-blob -bottom-40 left-[8%] h-[420px] w-[420px] bg-violet/15" />
      </div>

      <div className="flex min-h-screen flex-col">
        <Navbar name={profile.name} />
        <main className="flex-1">{children}</main>
        <Footer profile={profile} socials={socials} />
      </div>
    </>
  );
}
