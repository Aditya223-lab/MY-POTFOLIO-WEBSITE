# ⚡ Cyberpunk Portfolio

A futuristic personal portfolio with an interactive 3D hero, a searchable blog,
and a **password-protected admin panel** so you can edit everything — your
profile, photo, blog posts, social links, and achievements — without touching
code.

Theme: **Cyberpunk Neon**. Built for a cybersecurity & coding enthusiast.

---

## ⚠️ First-time setup

This project uses a cloud **PostgreSQL** database (so it can be hosted on
Vercel). Before it will run, you need a database connection string.

👉 **Follow [`DEPLOY.md`](./DEPLOY.md) — Part 1** (takes ~5 minutes, it's free).

Once your `.env` has a real `DATABASE_URL`:

```bash
npx prisma migrate dev --name init   # create the tables
npm run db:seed                      # add starter content
npm run dev                          # start the site
```

---

## 🌐 Your URLs

| Page | URL (local) |
|---|---|
| 🌐 Your website | http://localhost:3000 |
| 🔐 Admin panel | http://localhost:3000`<ADMIN_PATH>`/login |

Your **admin path is secret** — it's the `ADMIN_PATH` value in `.env`
(e.g. `/x-2296190cac`). Plain `/admin` deliberately returns **404** so
directory-fuzzing tools find nothing.

**Admin password:** the `ADMIN_PASSWORD` value in `.env`.

---

## ✏️ What you can edit (no code needed)

Log into the admin panel and manage everything:

- **Profile** — name, headline, bio, location, email, and **profile photo**
- **Blog Posts** — write, edit, publish/unpublish, delete (full **Markdown**)
- **Social Links** — GitHub, TryHackMe, Hack The Box, Bugcrowd, HackerOne…
- **Achievements** — certs, CTF placements, milestones

Visitors can **search and filter** your blog by keyword and tag.

---

## 🔒 Security features

- **Hidden admin path** — login lives at a secret URL, not `/admin`
- **Brute-force protection** — failed logins are rate-limited per IP
- **Signed sessions** — httpOnly cookies, server-verified
- **Security headers** — clickjacking / MIME-sniffing / referrer protection
- Every admin action re-checks your login on the server

---

## 🧰 Tech stack

- **Next.js 16** + **React 19** + **TypeScript** — front end *and* back end
- **Three.js** (React Three Fiber) — the draggable 3D hero
- **Tailwind CSS 4** + **Framer Motion** — styling and animation
- **Prisma 7** + **PostgreSQL** — the database
- **Vercel Blob** — image storage in production
- **jose** — secure admin login sessions

---

## 📁 Project structure

```
app/
  (site)/        → your public website (home, searchable blog)
  admin/         → the password-protected backend panel
  generated/     → auto-generated database client (don't edit)
components/      → site, 3D, and admin components
lib/             → database, auth, security, helpers
prisma/          → database schema + seed data
proxy.ts         → hides the admin panel behind the secret path
```

---

## 🛠️ Useful commands

```bash
npm run dev                       # start in development
npm run build                     # production build
npm run db:seed                   # load starter content
npm run db:studio                 # visual database browser
npx prisma migrate dev            # apply database schema changes
```

---

## 🚀 Going live

Ready to put it on the internet? Follow **[`DEPLOY.md`](./DEPLOY.md)** — a full,
beginner-friendly walkthrough for deploying to **Vercel**.
