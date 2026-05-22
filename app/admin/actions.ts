"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import {
  requireAdmin,
  createSession,
  destroySession,
  checkPassword,
} from "@/lib/auth";
import {
  checkLoginAttempts,
  recordFailedLogin,
  resetLoginAttempts,
} from "@/lib/rate-limit";
import { ADMIN_PATH } from "@/lib/config";
import { slugify } from "@/lib/utils";

export type FormState = { ok: boolean; message: string };
export type UploadResult = { ok: boolean; url?: string; message?: string };

// Keep uploads within the serverless request-body limit.
const MAX_UPLOAD = 4 * 1024 * 1024; // 4 MB

/* ---------- helpers ---------- */
const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const num = (fd: FormData, k: string) => {
  const v = parseInt(String(fd.get(k) ?? ""), 10);
  return Number.isFinite(v) ? v : 0;
};
const bool = (fd: FormData, k: string) =>
  fd.get(k) === "on" || fd.get(k) === "true";

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const root = slugify(base);
  let slug = root;
  let n = 1;
  while (true) {
    const existing = await prisma.blog.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    n += 1;
    slug = `${root}-${n}`;
  }
}

function refreshPublic() {
  revalidatePath("/");
  revalidatePath("/blog");
}

async function clientKey(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
}

/** Store an uploaded file — Vercel Blob in production, local disk in dev. */
async function storeUpload(file: File, ext: string): Promise<string> {
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`uploads/${name}`, file, { access: "public" });
    return blob.url;
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), bytes);
  return `/uploads/${name}`;
}

/* ---------- auth ---------- */
export async function login(
  _prev: FormState,
  fd: FormData,
): Promise<FormState> {
  const key = `login:${await clientKey()}`;

  const limit = checkLoginAttempts(key);
  if (limit.blocked) {
    return {
      ok: false,
      message: `Too many attempts. Try again in ~${limit.retryAfterMin} min.`,
    };
  }

  const password = String(fd.get("password") ?? "");
  if (!checkPassword(password)) {
    recordFailedLogin(key);
    return { ok: false, message: "Incorrect password. Try again." };
  }

  resetLoginAttempts(key);
  await createSession();
  redirect(ADMIN_PATH);
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect(`${ADMIN_PATH}/login`);
}

/* ---------- uploads ---------- */
export async function uploadImage(fd: FormData): Promise<UploadResult> {
  await requireAdmin();
  const file = fd.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "No file selected." };
  }
  if (!file.type.startsWith("image/")) {
    return { ok: false, message: "Please choose an image file." };
  }
  if (file.size > MAX_UPLOAD) {
    return { ok: false, message: "Image must be under 4 MB." };
  }
  const ext =
    (file.name.split(".").pop() || "png")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "") || "png";
  try {
    return { ok: true, url: await storeUpload(file, ext) };
  } catch (err) {
    console.error("uploadImage failed:", err);
    return { ok: false, message: "Upload failed — please try again." };
  }
}

export async function uploadPdf(fd: FormData): Promise<UploadResult> {
  await requireAdmin();
  const file = fd.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "No file selected." };
  }
  if (file.type !== "application/pdf") {
    return { ok: false, message: "Please choose a PDF file." };
  }
  if (file.size > MAX_UPLOAD) {
    return { ok: false, message: "PDF must be under 4 MB." };
  }
  try {
    return { ok: true, url: await storeUpload(file, "pdf") };
  } catch (err) {
    console.error("uploadPdf failed:", err);
    return { ok: false, message: "Upload failed — please try again." };
  }
}

/* ---------- profile ---------- */
export async function updateProfile(
  _prev: FormState,
  fd: FormData,
): Promise<FormState> {
  await requireAdmin();
  const data = {
    name: str(fd, "name") || "Your Name",
    headline: str(fd, "headline"),
    subheadline: str(fd, "subheadline"),
    bio: str(fd, "bio"),
    location: str(fd, "location"),
    email: str(fd, "email"),
    resumeUrl: str(fd, "resumeUrl"),
    avatarUrl: str(fd, "avatarUrl"),
  };
  await prisma.profile.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });
  refreshPublic();
  revalidatePath("/admin/profile");
  return { ok: true, message: "Profile saved." };
}

/* ---------- blogs ---------- */
export async function createBlog(
  _prev: FormState,
  fd: FormData,
): Promise<FormState> {
  await requireAdmin();
  const title = str(fd, "title");
  if (!title) return { ok: false, message: "A title is required." };

  const slug = await uniqueSlug(str(fd, "slug") || title);
  const blog = await prisma.blog.create({
    data: {
      title,
      slug,
      excerpt: str(fd, "excerpt"),
      content: str(fd, "content"),
      coverUrl: str(fd, "coverUrl"),
      pdfUrl: str(fd, "pdfUrl"),
      tags: str(fd, "tags"),
      published: bool(fd, "published"),
    },
  });
  refreshPublic();
  revalidatePath("/admin/blogs");
  redirect(`${ADMIN_PATH}/blogs/${blog.id}`);
}

export async function updateBlog(
  _prev: FormState,
  fd: FormData,
): Promise<FormState> {
  await requireAdmin();
  const id = str(fd, "id");
  const title = str(fd, "title");
  if (!id) return { ok: false, message: "Missing post id." };
  if (!title) return { ok: false, message: "A title is required." };

  const slug = await uniqueSlug(str(fd, "slug") || title, id);
  await prisma.blog.update({
    where: { id },
    data: {
      title,
      slug,
      excerpt: str(fd, "excerpt"),
      content: str(fd, "content"),
      coverUrl: str(fd, "coverUrl"),
      pdfUrl: str(fd, "pdfUrl"),
      tags: str(fd, "tags"),
      published: bool(fd, "published"),
    },
  });
  refreshPublic();
  revalidatePath("/admin/blogs");
  revalidatePath(`/admin/blogs/${id}`);
  revalidatePath(`/blog/${slug}`);
  return { ok: true, message: "Post saved." };
}

export async function deleteBlog(id: string): Promise<void> {
  await requireAdmin();
  await prisma.blog.delete({ where: { id } });
  refreshPublic();
  revalidatePath("/admin/blogs");
  redirect(`${ADMIN_PATH}/blogs`);
}

/* ---------- social links ---------- */
export async function createSocial(
  _prev: FormState,
  fd: FormData,
): Promise<FormState> {
  await requireAdmin();
  const platform = str(fd, "platform");
  const url = str(fd, "url");
  if (!platform || !url) {
    return { ok: false, message: "Platform name and URL are required." };
  }
  await prisma.socialLink.create({
    data: {
      platform,
      url,
      label: str(fd, "label"),
      icon: str(fd, "icon") || "link",
      order: num(fd, "order"),
      visible: true,
    },
  });
  refreshPublic();
  revalidatePath("/admin/socials");
  return { ok: true, message: "Link added." };
}

export async function updateSocial(
  _prev: FormState,
  fd: FormData,
): Promise<FormState> {
  await requireAdmin();
  const id = str(fd, "id");
  if (!id) return { ok: false, message: "Missing link id." };
  await prisma.socialLink.update({
    where: { id },
    data: {
      platform: str(fd, "platform"),
      url: str(fd, "url"),
      label: str(fd, "label"),
      icon: str(fd, "icon") || "link",
      order: num(fd, "order"),
      visible: bool(fd, "visible"),
    },
  });
  refreshPublic();
  revalidatePath("/admin/socials");
  return { ok: true, message: "Link updated." };
}

export async function deleteSocial(id: string): Promise<void> {
  await requireAdmin();
  await prisma.socialLink.delete({ where: { id } });
  refreshPublic();
  revalidatePath("/admin/socials");
}

/* ---------- achievements ---------- */
export async function createAchievement(
  _prev: FormState,
  fd: FormData,
): Promise<FormState> {
  await requireAdmin();
  const title = str(fd, "title");
  if (!title) return { ok: false, message: "A title is required." };
  await prisma.achievement.create({
    data: {
      title,
      description: str(fd, "description"),
      date: str(fd, "date"),
      icon: str(fd, "icon") || "trophy",
      link: str(fd, "link"),
      order: num(fd, "order"),
    },
  });
  refreshPublic();
  revalidatePath("/admin/achievements");
  return { ok: true, message: "Achievement added." };
}

export async function updateAchievement(
  _prev: FormState,
  fd: FormData,
): Promise<FormState> {
  await requireAdmin();
  const id = str(fd, "id");
  if (!id) return { ok: false, message: "Missing achievement id." };
  await prisma.achievement.update({
    where: { id },
    data: {
      title: str(fd, "title"),
      description: str(fd, "description"),
      date: str(fd, "date"),
      icon: str(fd, "icon") || "trophy",
      link: str(fd, "link"),
      order: num(fd, "order"),
    },
  });
  refreshPublic();
  revalidatePath("/admin/achievements");
  return { ok: true, message: "Achievement updated." };
}

export async function deleteAchievement(id: string): Promise<void> {
  await requireAdmin();
  await prisma.achievement.delete({ where: { id } });
  refreshPublic();
  revalidatePath("/admin/achievements");
}
