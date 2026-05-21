import { getProfile } from "@/lib/data";
import { ADMIN_PATH } from "@/lib/config";
import { Sidebar } from "@/components/admin/Sidebar";

// Always render fresh — the panel reflects live database content.
export const dynamic = "force-dynamic";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar name={profile.name} adminPath={ADMIN_PATH} />
      <div className="md:pl-64">
        <main className="mx-auto max-w-4xl px-5 py-8 md:px-8 md:py-12">
          {children}
        </main>
      </div>
    </div>
  );
}
