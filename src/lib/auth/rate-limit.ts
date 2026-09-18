import "server-only";
import { headers } from "next/headers";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { rateLimits } from "@/lib/db/schema";

export type RateLimitResult = { ok: true } | { ok: false; retryAfterSeconds: number };

/**
 * Limitation de débit par clé (utilisateur ou IP) sur fenêtre fixe, stockée en base
 * pour rester valable avec plusieurs instances. Aucune donnée de contenu n'est journalisée.
 */
export async function rateLimit(scope: string, identifier: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
  const key = `${scope}:${identifier}`;
  const now = new Date();
  const windowMs = windowSeconds * 1000;
  const rows = await db
    .insert(rateLimits)
    .values({ key, windowStart: now, count: 1 })
    .onConflictDoUpdate({
      target: rateLimits.key,
      set: {
        count: sql`CASE WHEN ${rateLimits.windowStart} < ${new Date(now.getTime() - windowMs)} THEN 1 ELSE ${rateLimits.count} + 1 END`,
        windowStart: sql`CASE WHEN ${rateLimits.windowStart} < ${new Date(now.getTime() - windowMs)} THEN ${now} ELSE ${rateLimits.windowStart} END`,
      },
    })
    .returning({ count: rateLimits.count, windowStart: rateLimits.windowStart });
  const row = rows[0];
  if (row.count > limit) {
    const retry = Math.max(1, Math.ceil((row.windowStart.getTime() + windowMs - now.getTime()) / 1000));
    return { ok: false, retryAfterSeconds: retry };
  }
  return { ok: true };
}

export async function clientIdentifier(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return fwd || h.get("x-real-ip") || "local";
}
