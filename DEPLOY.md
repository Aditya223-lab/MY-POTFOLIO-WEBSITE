# 🚀 Deploying your site to the internet (Vercel)

This guide takes your portfolio from "runs on my laptop" to "live on the web."

It has two halves:

- **Part 1 — Database setup.** Required to run the site at all now (locally or
  hosted), because the site moved from a local file to a cloud database.
- **Part 2 — Going live on Vercel.**

Take it step by step. None of it is hard — most steps are copy/paste.

---

## Part 1 — Set up your database (Neon)

Vercel servers can't keep a database file, so your data lives in a free cloud
PostgreSQL database. **Neon** is the easiest.

### 1.1 — Create the database

1. Go to **https://neon.tech** and sign up (you can use your GitHub account).
2. Click **Create project**. Give it any name (e.g. `portfolio`). Accept the
   defaults and create it.
3. On the project dashboard, find the **connection string**. Make sure the
   **"Pooled connection"** option is selected/toggled on.
4. Copy that string. It looks like:
   ```
   postgresql://user:password@ep-xxxx-pooler.region.aws.neon.tech/dbname?sslmode=require
   ```

### 1.2 — Plug it into your project

1. Open the **`.env`** file in your project.
2. Replace the `DATABASE_URL` line with your Neon string:
   ```
   DATABASE_URL="postgresql://...your real string from Neon..."
   ```
3. Save the file.

### 1.3 — Create the tables and starter content

In a terminal, in your project folder, run:

```bash
npx prisma migrate dev --name init
npm run db:seed
```

The first command builds your tables in Neon; the second fills in starter
content. Now start the site:

```bash
npm run dev
```

Your site works again — this time backed by a real cloud database. ✅

---

## Part 2 — Go live on Vercel

### 2.1 — Put your code on GitHub

Vercel deploys from a GitHub repository.

> Note: your home folder is itself a git repo. The commands below create a
> **separate, clean repo just for this project** — that's what you want.

In a terminal in your project folder:

```bash
git init
git add .
git commit -m "My portfolio site"
```

Then on **https://github.com**, click **New repository**, name it
(e.g. `portfolio`), keep it **Private**, and **don't** add a README. Create it,
then run the commands GitHub shows you — they look like:

```bash
git remote add origin https://github.com/YOUR-USERNAME/portfolio.git
git branch -M main
git push -u origin main
```

Your `.env` file is **not** uploaded (it's git-ignored) — your secrets stay safe.

### 2.2 — Import the project into Vercel

1. Go to **https://vercel.com** and sign up with GitHub.
2. Click **Add New… → Project**.
3. Select your `portfolio` repository → **Import**.
4. Vercel detects Next.js automatically. **Don't deploy yet** — add the
   environment variables first (next step).

### 2.3 — Add your environment variables

In the import screen (or **Project → Settings → Environment Variables**), add
each of these:

| Name | Value |
|---|---|
| `DATABASE_URL` | your Neon pooled connection string |
| `ADMIN_PASSWORD` | a **long, strong** password (see note below) |
| `AUTH_SECRET` | a fresh random string — generate with the command below |
| `ADMIN_PATH` | your secret admin path, e.g. `/x-2296190cac` |

Generate a fresh `AUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> 🔐 **Use a strong `ADMIN_PASSWORD` for the live site.** A short password is
> easy to guess. Aim for 16+ characters, mixed, unique to this site.

### 2.4 — Deploy

Click **Deploy**. Wait ~2 minutes. Vercel gives you a URL like
`https://your-portfolio.vercel.app`.

### 2.5 — Turn on image storage (Vercel Blob)

So you can upload photos on the live site:

1. In your Vercel project → **Storage** tab → **Create Database** →
   choose **Blob**.
2. Create the store and **connect it to this project**. Vercel automatically
   adds a `BLOB_READ_WRITE_TOKEN` environment variable.
3. Go to **Deployments** → on the latest one, **⋯ → Redeploy** so it picks up
   the new variable.

Now image uploads on the live site save to cloud storage. (Locally, with no
token set, they still save to `/public/uploads` — both work automatically.)

---

## ✅ You're live

| Page | URL |
|---|---|
| Your site | `https://your-portfolio.vercel.app` |
| Admin login | `https://your-portfolio.vercel.app/x-2296190cac/login` |

Plain `/admin` returns a 404 — your real panel is only at the secret path.

---

## 🔄 Updating your site later

- **Content** (posts, profile, links): just log into the admin panel — changes
  show instantly. No deploy needed.
- **Code/design changes**: commit and push to GitHub —
  ```bash
  git add .
  git commit -m "what changed"
  git push
  ```
  Vercel rebuilds and redeploys automatically.

---

## 🆘 Troubleshooting

- **Build fails: "Environment variable not found: DATABASE_URL"** — you missed
  a variable in step 2.3. Add it, then redeploy.
- **Login won't work** — check `AUTH_SECRET` and `ADMIN_PASSWORD` are set on
  Vercel and you redeployed afterward.
- **Can't find the admin page** — it's at `<your-site>` + your `ADMIN_PATH` +
  `/login`. Plain `/admin` is meant to 404.
- **Image upload fails on the live site** — finish step 2.5 (Blob storage) and
  redeploy.
