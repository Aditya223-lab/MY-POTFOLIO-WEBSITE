/**
 * The secret URL prefix for the admin panel.
 *
 * Set ADMIN_PATH in your .env to something unguessable (e.g. "/x-9f3a2c").
 * Directory-fuzzing tools use wordlists full of "admin", "login", "dashboard"
 * — a random path keeps your panel off their radar. Plain /admin returns 404.
 *
 * Read by the proxy, server components, and server actions (all server-side).
 */
export const ADMIN_PATH: string =
  process.env.ADMIN_PATH && process.env.ADMIN_PATH.startsWith("/")
    ? process.env.ADMIN_PATH.replace(/\/+$/, "")
    : "/admin";
