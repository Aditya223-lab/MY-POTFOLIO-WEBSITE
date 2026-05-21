import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { ADMIN_PATH } from "@/lib/config";

const SESSION_COOKIE = "portfolio_session";

function secretKey(): Uint8Array {
  return new TextEncoder().encode(
    process.env.AUTH_SECRET || "insecure-dev-secret-change-me",
  );
}

async function isAuthed(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, secretKey());
    return true;
  } catch {
    return false;
  }
}

/**
 * Hides the admin panel behind a secret path and gates it with auth.
 *  - the real /admin route is blocked (404) so fuzzers find nothing
 *  - ADMIN_PATH is rewritten internally to /admin
 *  - unauthenticated visitors are bounced to the secret login page
 */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const customised = ADMIN_PATH !== "/admin";

  // 1. Block the predictable /admin path — show a plain 404.
  if (customised && (pathname === "/admin" || pathname.startsWith("/admin/"))) {
    return NextResponse.rewrite(new URL("/admin-unavailable", req.url));
  }

  // 2. Only act on requests inside the (secret) admin area.
  const onAdmin =
    pathname === ADMIN_PATH || pathname.startsWith(`${ADMIN_PATH}/`);
  if (!onAdmin) return NextResponse.next();

  const loginPath = `${ADMIN_PATH}/login`;
  const isLoginPage = pathname === loginPath;
  const authed = await isAuthed(req);

  // 3. Auth gate.
  if (!authed && !isLoginPage) {
    const url = req.nextUrl.clone();
    url.pathname = loginPath;
    return NextResponse.redirect(url);
  }
  if (authed && isLoginPage) {
    const url = req.nextUrl.clone();
    url.pathname = ADMIN_PATH;
    return NextResponse.redirect(url);
  }

  // 4. Rewrite the secret path onto the real /admin route tree.
  const url = req.nextUrl.clone();
  url.pathname = `/admin${pathname.slice(ADMIN_PATH.length)}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|uploads).*)"],
};
