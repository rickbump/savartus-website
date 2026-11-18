import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { createSession, deleteSession, membership, userForSession, type Role } from "./store";

// Signed-in state for the account space. The cookie holds a random session ID;
// the database holds only its hash, so a session can be ended server-side.

const COOKIE = "savartus_session";

export async function startSession(userId: string) {
  const { id, expires } = await createSession(userId);
  (await cookies()).set(COOKIE, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}

export async function endSession() {
  const store = await cookies();
  const id = store.get(COOKIE)?.value;
  if (id) await deleteSession(id);
  store.delete(COOKIE);
}

// The signed-in person, or undefined. Cached per request.
export const currentUser = cache(async () => {
  const id = (await cookies()).get(COOKIE)?.value;
  return id ? userForSession(id) : undefined;
});

export async function requireUser() {
  const user = await currentUser();
  if (!user) redirect("/account/signin");
  return user;
}

// The signed-in person's membership of a space. Someone who isn't a member
// (or was removed) gets a 404, so space IDs can't be probed.
export async function requireSpace(accountId: string, role?: Role) {
  const user = await requireUser();
  if (!/^[0-9a-f-]{36}$/.test(accountId)) notFound();
  const found = await membership(user.id, accountId);
  if (!found || (role === "admin" && found.role !== "admin")) notFound();
  return { user, ...found };
}

// Same checks for route handlers, answering with a status instead of a page.
export async function spaceForApi(accountId: string, role?: Role) {
  const user = await currentUser();
  if (!user) return { error: Response.json({ error: "Please sign in again." }, { status: 401 }) } as const;
  const found = /^[0-9a-f-]{36}$/.test(accountId) ? await membership(user.id, accountId) : undefined;
  if (!found || (role === "admin" && found.role !== "admin")) {
    return { error: Response.json({ error: "Not found." }, { status: 404 }) } as const;
  }
  return { user, ...found } as const;
}
