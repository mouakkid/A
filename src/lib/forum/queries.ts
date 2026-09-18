import "server-only";
import { cache } from "react";
import { and, desc, eq, ilike, or, sql, inArray } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/lib/db/client";
import { forumCategories, forumReplies, forumTopics, users } from "@/lib/db/schema";

export type ForumCategory = typeof forumCategories.$inferSelect;
export type ForumTopic = typeof forumTopics.$inferSelect;
export type ForumReply = typeof forumReplies.$inferSelect;
export type TopicWithMeta = ForumTopic & { authorName: string; categoryName: string; categorySlug: string };

export const listCategories = cache(async (): Promise<(ForumCategory & { topicCount: number; lastActivity: Date | null })[]> => {
  if (!isDatabaseConfigured()) return [];
  const rows = await db
    .select({
      id: forumCategories.id,
      slug: forumCategories.slug,
      name: forumCategories.name,
      description: forumCategories.description,
      position: forumCategories.position,
      topicCount: sql<number>`count(${forumTopics.id}) filter (where ${forumTopics.status} = 'published')::int`,
      lastActivity: sql<Date | null>`max(coalesce(${forumTopics.lastReplyAt}, ${forumTopics.createdAt})) filter (where ${forumTopics.status} = 'published')`,
    })
    .from(forumCategories)
    .leftJoin(forumTopics, eq(forumTopics.categoryId, forumCategories.id))
    .groupBy(forumCategories.id)
    .orderBy(forumCategories.position);
  return rows.map((r) => ({ ...r, lastActivity: r.lastActivity ? new Date(r.lastActivity) : null }));
});

export const getCategoryBySlug = cache(async (slug: string): Promise<ForumCategory | null> => {
  if (!isDatabaseConfigured()) return null;
  const rows = await db.select().from(forumCategories).where(eq(forumCategories.slug, slug)).limit(1);
  return rows[0] ?? null;
});

const topicSelect = {
  id: forumTopics.id,
  categoryId: forumTopics.categoryId,
  authorId: forumTopics.authorId,
  slug: forumTopics.slug,
  title: forumTopics.title,
  bodyMd: forumTopics.bodyMd,
  status: forumTopics.status,
  deviceTags: forumTopics.deviceTags,
  acceptedReplyId: forumTopics.acceptedReplyId,
  replyCount: forumTopics.replyCount,
  views: forumTopics.views,
  lastReplyAt: forumTopics.lastReplyAt,
  pinned: forumTopics.pinned,
  locked: forumTopics.locked,
  createdAt: forumTopics.createdAt,
  updatedAt: forumTopics.updatedAt,
  authorName: users.username,
  categoryName: forumCategories.name,
  categorySlug: forumCategories.slug,
};

export async function listTopics(opts: { categoryId?: number; limit?: number; offset?: number; status?: "published" | "pending" | "hidden"; tag?: string }): Promise<TopicWithMeta[]> {
  if (!isDatabaseConfigured()) return [];
  const conds = [eq(forumTopics.status, opts.status ?? "published")];
  if (opts.categoryId) conds.push(eq(forumTopics.categoryId, opts.categoryId));
  if (opts.tag) conds.push(sql`${opts.tag} = any(${forumTopics.deviceTags})`);
  return db
    .select(topicSelect)
    .from(forumTopics)
    .innerJoin(users, eq(forumTopics.authorId, users.id))
    .innerJoin(forumCategories, eq(forumTopics.categoryId, forumCategories.id))
    .where(and(...conds))
    .orderBy(desc(forumTopics.pinned), desc(sql`coalesce(${forumTopics.lastReplyAt}, ${forumTopics.createdAt})`))
    .limit(opts.limit ?? 30)
    .offset(opts.offset ?? 0);
}

export async function countTopics(categoryId?: number): Promise<number> {
  if (!isDatabaseConfigured()) return 0;
  const conds = [eq(forumTopics.status, "published")];
  if (categoryId) conds.push(eq(forumTopics.categoryId, categoryId));
  const r = await db.select({ n: sql<number>`count(*)::int` }).from(forumTopics).where(and(...conds));
  return r[0]?.n ?? 0;
}

export const getTopicBySlug = cache(async (slug: string): Promise<TopicWithMeta | null> => {
  if (!isDatabaseConfigured()) return null;
  const rows = await db
    .select(topicSelect)
    .from(forumTopics)
    .innerJoin(users, eq(forumTopics.authorId, users.id))
    .innerJoin(forumCategories, eq(forumTopics.categoryId, forumCategories.id))
    .where(eq(forumTopics.slug, slug))
    .limit(1);
  return rows[0] ?? null;
});

export async function listReplies(topicId: number, includeHidden = false): Promise<(ForumReply & { authorName: string; authorRole: string })[]> {
  const conds = [eq(forumReplies.topicId, topicId)];
  if (!includeHidden) conds.push(eq(forumReplies.status, "published"));
  else conds.push(inArray(forumReplies.status, ["published", "pending", "hidden"]));
  return db
    .select({
      id: forumReplies.id,
      topicId: forumReplies.topicId,
      authorId: forumReplies.authorId,
      bodyMd: forumReplies.bodyMd,
      status: forumReplies.status,
      createdAt: forumReplies.createdAt,
      updatedAt: forumReplies.updatedAt,
      authorName: users.username,
      authorRole: users.role,
    })
    .from(forumReplies)
    .innerJoin(users, eq(forumReplies.authorId, users.id))
    .where(and(...conds))
    .orderBy(forumReplies.createdAt);
}

export async function searchTopics(q: string, limit = 12): Promise<TopicWithMeta[]> {
  if (!isDatabaseConfigured() || !q.trim()) return [];
  const pattern = `%${q.trim().replace(/[%_]/g, "")}%`;
  return db
    .select(topicSelect)
    .from(forumTopics)
    .innerJoin(users, eq(forumTopics.authorId, users.id))
    .innerJoin(forumCategories, eq(forumTopics.categoryId, forumCategories.id))
    .where(and(eq(forumTopics.status, "published"), or(ilike(forumTopics.title, pattern), ilike(forumTopics.bodyMd, pattern))))
    .orderBy(desc(forumTopics.createdAt))
    .limit(limit);
}

export async function listRecentTopics(limit = 5): Promise<TopicWithMeta[]> {
  return listTopics({ limit });
}
