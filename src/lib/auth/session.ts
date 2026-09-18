import "server-only";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { unstable_rethrow } from "next/navigation";
import { createHash, randomBytes } from "node:crypto";
import { eq, and, gt } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/lib/db/client";
import { sessions, users } from "@/lib/db/schema";

export const SESSION_COOKIE = "gma_session";
const SESSION_DAYS = 30;

export type Role = "member" | "moderator" | "editor" | "admin";
export type CurrentUser = {
  id: number;
  email: string;
  username: string;
  displayName: string | null;
  role: Role;
  bannedAt: Date | null;
  createdAt: Date;
};

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: number): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400_000);
  const ua = (await headers()).get("user-agent")?.slice(0, 255) ?? null;
  await db.insert(sessions).values({ id: hashToken(token), userId, expiresAt, userAgent: ua });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.delete(sessions).where(eq(sessions.id, hashToken(token)));
  }
  store.delete(SESSION_COOKIE);
}

/** Utilisateur courant (mis en cache par requête). Retourne null sans session valide. */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  if (!isDatabaseConfigured()) return null;
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const rows = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        displayName: users.displayName,
        role: users.role,
        bannedAt: users.bannedAt,
        createdAt: users.createdAt,
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(and(eq(sessions.id, hashToken(token)), gt(sessions.expiresAt, new Date())))
      .limit(1);
    return rows[0] ?? null;
  } catch (e) {
    unstable_rethrow(e); // ne jamais avaler les erreurs internes de Next (bailout dynamique, redirections)
    return null;
  }
});

const ROLE_RANK: Record<Role, number> = { member: 0, moderator: 1, editor: 2, admin: 3 };

export function hasRole(user: { role: Role } | null, minimum: Role): boolean {
  if (!user) return false;
  return ROLE_RANK[user.role] >= ROLE_RANK[minimum];
}

export function canModerate(user: { role: Role } | null): boolean {
  return hasRole(user, "moderator");
}
export function canEdit(user: { role: Role } | null): boolean {
  return user?.role === "editor" || user?.role === "admin";
}
export function isAdmin(user: { role: Role } | null): boolean {
  return user?.role === "admin";
}
