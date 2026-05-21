import { Link2 } from "lucide-react";
import { getSocials } from "@/lib/data";
import { SocialAddForm, SocialRow } from "@/components/admin/SocialManager";

export default async function AdminSocialsPage() {
  const socials = await getSocials();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="font-mono text-sm text-neon">// social links</p>
        <h1 className="mt-1 text-3xl font-bold">Social Links</h1>
        <p className="mt-1 text-muted">
          GitHub, TryHackMe, Hack The Box, Bugcrowd — add, edit, reorder, or
          hide any of them.
        </p>
      </header>

      <SocialAddForm />

      {socials.length === 0 ? (
        <div className="card flex flex-col items-center gap-2 p-12 text-center">
          <Link2 className="h-8 w-8 text-muted" />
          <p className="text-muted">No links yet — add your first above.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">
            Your links ({socials.length})
          </p>
          {socials.map((social) => (
            <SocialRow key={social.id} social={social} />
          ))}
        </div>
      )}
    </div>
  );
}
