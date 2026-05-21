import { Trophy } from "lucide-react";
import { getAchievements } from "@/lib/data";
import {
  AchievementAddForm,
  AchievementRow,
} from "@/components/admin/AchievementManager";

export default async function AdminAchievementsPage() {
  const achievements = await getAchievements();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="font-mono text-sm text-neon">// achievements</p>
        <h1 className="mt-1 text-3xl font-bold">Achievements</h1>
        <p className="mt-1 text-muted">
          Certifications, CTF placements, projects, and milestones.
        </p>
      </header>

      <AchievementAddForm />

      {achievements.length === 0 ? (
        <div className="card flex flex-col items-center gap-2 p-12 text-center">
          <Trophy className="h-8 w-8 text-muted" />
          <p className="text-muted">
            No achievements yet — add your first above.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">
            Your achievements ({achievements.length})
          </p>
          {achievements.map((item) => (
            <AchievementRow key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
