import { getProfile } from "@/lib/data";
import { ProfileForm } from "@/components/admin/ProfileForm";

export default async function AdminProfilePage() {
  const profile = await getProfile();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="font-mono text-sm text-neon">// profile</p>
        <h1 className="mt-1 text-3xl font-bold">Edit Profile</h1>
        <p className="mt-1 text-muted">
          Your name, photo, and the words that introduce you.
        </p>
      </header>

      <ProfileForm profile={profile} />
    </div>
  );
}
