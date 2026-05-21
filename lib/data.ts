import "server-only";
import { prisma } from "./prisma";

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
