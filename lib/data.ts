import "server-only";
import { prisma } from "./prisma";
import { parseTags } from "./utils";

/** The editable profile singleton. Created with defaults if missing. */
export async function getProfile() {
  const existing = await prisma.profile.findUnique({ where: { id: 1 } });
  if (existing) return existing;
  return prisma.profile.create({ data: { id: 1 } });
}

export function getBlogs(opts?: { publishedOnly?: boolean }) {
  return prisma.blog.findMany({
    where: opts?.publishedOnly ? { published: true } : undefined,
    orderBy: { createdAt: "desc" },
  });
}

export function getBlogBySlug(slug: string) {
  return prisma.blog.findUnique({ where: { slug } });
}

export function getBlogById(id: string) {
  return prisma.blog.findUnique({ where: { id } });
}

/**
 * Every distinct tag used across all posts, sorted — powers the tag picker in
 * the admin post form so new posts reuse the site's existing tags.
 * De-duplicated case-insensitively (keeps the first spelling seen).
 */
export async function getAllBlogTags(): Promise<string[]> {
  const rows = await prisma.blog.findMany({ select: { tags: true } });
  const seen = new Map<string, string>();
  for (const row of rows) {
    for (const tag of parseTags(row.tags)) {
      const key = tag.toLowerCase();
      if (!seen.has(key)) seen.set(key, tag);
    }
  }
  return Array.from(seen.values()).sort((a, b) => a.localeCompare(b));
}

export function getSocials(opts?: { visibleOnly?: boolean }) {
  return prisma.socialLink.findMany({
    where: opts?.visibleOnly ? { visible: true } : undefined,
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export function getAchievements() {
  return prisma.achievement.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
}
