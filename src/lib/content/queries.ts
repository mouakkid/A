import "server-only";
import { cache } from "react";
import { and, desc, eq, ilike, or, arrayContains, sql } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/lib/db/client";
import { articles } from "@/lib/db/schema";

export type ArticleType = "news" | "guide" | "feature" | "comparison";
export type Article = typeof articles.$inferSelect;
export type ArticleSource = { label: string; url: string; accessedAt?: string | null };

export const typeMeta: Record<ArticleType, { path: string; label: string; plural: string; jsonLd: "Article" | "NewsArticle" | "TechArticle" }> = {
  news: { path: "/actualites", label: "Actualité", plural: "Actualités", jsonLd: "NewsArticle" },
  guide: { path: "/guides", label: "Guide", plural: "Guides et tutoriels", jsonLd: "Article" },
  feature: { path: "/fonctionnalites", label: "Fonctionnalité expliquée", plural: "Fonctionnalités expliquées", jsonLd: "TechArticle" },
  comparison: { path: "/comparatifs", label: "Comparatif", plural: "Comparatifs éditoriaux", jsonLd: "Article" },
};

export function articlePath(a: Pick<Article, "type" | "slug">): string {
  return `${typeMeta[a.type as ArticleType].path}/${a.slug}`;
}

export const newsStatusLabels: Record<string, string> = {
  annonce: "Annonce officielle",
  disponibilite: "Disponibilité",
  beta: "Bêta",
  deploiement: "Déploiement progressif",
  rumeur: "Rumeur (non confirmée)",
};

export const listPublishedArticles = cache(async (type?: ArticleType, limit = 50): Promise<Article[]> => {
  if (!isDatabaseConfigured()) return [];
  const where = type ? and(eq(articles.status, "published"), eq(articles.type, type)) : eq(articles.status, "published");
  return db.select().from(articles).where(where).orderBy(desc(articles.publishedAt)).limit(limit);
});

export const getPublishedArticle = cache(async (type: ArticleType, slug: string): Promise<Article | null> => {
  if (!isDatabaseConfigured()) return null;
  const rows = await db.select().from(articles).where(and(eq(articles.slug, slug), eq(articles.type, type), eq(articles.status, "published"))).limit(1);
  return rows[0] ?? null;
});

export const getArticleAnyStatus = cache(async (id: number): Promise<Article | null> => {
  const rows = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
  return rows[0] ?? null;
});

export async function listArticlesForDevice(slug: string, limit = 6): Promise<Article[]> {
  if (!isDatabaseConfigured()) return [];
  return db.select().from(articles).where(and(eq(articles.status, "published"), arrayContains(articles.deviceSlugs, [slug]))).orderBy(desc(articles.publishedAt)).limit(limit);
}

export async function listArticlesForSport(sport: string, limit = 12): Promise<Article[]> {
  if (!isDatabaseConfigured()) return [];
  return db.select().from(articles).where(and(eq(articles.status, "published"), arrayContains(articles.sports, [sport]))).orderBy(desc(articles.publishedAt)).limit(limit);
}

export async function searchArticles(q: string, limit = 12): Promise<Article[]> {
  if (!isDatabaseConfigured() || !q.trim()) return [];
  const pattern = `%${q.trim().replace(/[%_]/g, "")}%`;
  return db
    .select()
    .from(articles)
    .where(and(eq(articles.status, "published"), or(ilike(articles.title, pattern), ilike(articles.excerpt, pattern), ilike(articles.bodyMd, pattern))))
    .orderBy(desc(articles.publishedAt))
    .limit(limit);
}

export async function countPublishedByType(): Promise<Record<string, number>> {
  if (!isDatabaseConfigured()) return {};
  const rows = await db.select({ type: articles.type, count: sql<number>`count(*)::int` }).from(articles).where(eq(articles.status, "published")).groupBy(articles.type);
  return Object.fromEntries(rows.map((r) => [r.type, r.count]));
}
