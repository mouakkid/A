"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { forumCategories, forumReplies, forumTopics, moderationLog, reports, users } from "@/lib/db/schema";
import { getCurrentUser, canModerate } from "@/lib/auth/session";
import { rateLimit } from "@/lib/auth/rate-limit";
import { slugify } from "@/lib/utils/slug";
import { LIMITS, reportReasons } from "./constants";
import { spamCheck, honeypotTriggered } from "./spam";

export type ForumState = { error?: string; fieldErrors?: Record<string, string>; success?: string } | null;

function accountAgeDays(createdAt: Date): number {
  return (Date.now() - createdAt.getTime()) / 86400_000;
}

const topicSchema = z.object({
  categoryId: z.coerce.number().int().positive(),
  title: z.string().trim().min(LIMITS.topicTitleMin, `${LIMITS.topicTitleMin} caractères minimum.`).max(LIMITS.topicTitleMax, `${LIMITS.topicTitleMax} caractères maximum.`),
  body: z.string().trim().min(LIMITS.bodyMin, `${LIMITS.bodyMin} caractères minimum.`).max(LIMITS.bodyMax, `${LIMITS.bodyMax} caractères maximum.`),
  deviceTags: z.string().trim().max(200).optional(),
});

export async function createTopicAction(_prev: ForumState, formData: FormData): Promise<ForumState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Connectez-vous pour publier." };
  if (user.bannedAt) return { error: "Compte suspendu." };
  if (honeypotTriggered(formData.get("website"))) return { error: "Requête refusée." };
  const parsed = topicSchema.safeParse({ categoryId: formData.get("categoryId"), title: formData.get("title"), body: formData.get("body"), deviceTags: formData.get("deviceTags") || undefined });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] = i.message;
    return { fieldErrors };
  }
  const rl = await rateLimit("topic", String(user.id), LIMITS.topicsPerHour, 3600);
  if (!rl.ok) return { error: `Limite atteinte : ${LIMITS.topicsPerHour} sujets par heure. Réessayez dans ${Math.ceil(rl.retryAfterSeconds / 60)} min.` };
  const spam = spamCheck(`${parsed.data.title}\n${parsed.data.body}`, { accountAgeDays: accountAgeDays(user.createdAt) });
  if (spam) return { error: spam };
  const cat = await db.select({ id: forumCategories.id, slug: forumCategories.slug }).from(forumCategories).where(eq(forumCategories.id, parsed.data.categoryId)).limit(1);
  if (!cat[0]) return { fieldErrors: { categoryId: "Catégorie inconnue." } };
  const tags = (parsed.data.deviceTags ?? "").split(",").map((t) => slugify(t)).filter(Boolean).slice(0, 5);
  const base = slugify(parsed.data.title) || "sujet";
  const slug = `${base}-${Date.now().toString(36)}`;
  // Les comptes très récents passent en attente de modération pour leur premier sujet.
  const status = accountAgeDays(user.createdAt) < 1 ? "pending" : "published";
  await db.insert(forumTopics).values({ categoryId: cat[0].id, authorId: user.id, slug, title: parsed.data.title, bodyMd: parsed.data.body, deviceTags: tags, status });
  revalidatePath("/communaute");
  revalidatePath(`/communaute/categorie/${cat[0].slug}`);
  redirect(`/communaute/sujet/${slug}`);
}

const replySchema = z.object({ topicId: z.coerce.number().int().positive(), body: z.string().trim().min(LIMITS.bodyMin, `${LIMITS.bodyMin} caractères minimum.`).max(LIMITS.bodyMax) });

export async function createReplyAction(_prev: ForumState, formData: FormData): Promise<ForumState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Connectez-vous pour répondre." };
  if (user.bannedAt) return { error: "Compte suspendu." };
  if (honeypotTriggered(formData.get("website"))) return { error: "Requête refusée." };
  const parsed = replySchema.safeParse({ topicId: formData.get("topicId"), body: formData.get("body") });
  if (!parsed.success) return { fieldErrors: { body: parsed.error.issues[0]?.message ?? "Message invalide." } };
  const rl = await rateLimit("reply", String(user.id), LIMITS.repliesPerTenMinutes, 600);
  if (!rl.ok) return { error: `Limite atteinte : ${LIMITS.repliesPerTenMinutes} réponses par 10 minutes.` };
  const spam = spamCheck(parsed.data.body, { accountAgeDays: accountAgeDays(user.createdAt) });
  if (spam) return { error: spam };
  const topic = await db.select({ id: forumTopics.id, slug: forumTopics.slug, locked: forumTopics.locked, status: forumTopics.status }).from(forumTopics).where(eq(forumTopics.id, parsed.data.topicId)).limit(1);
  if (!topic[0] || topic[0].status !== "published") return { error: "Sujet introuvable." };
  if (topic[0].locked && !canModerate(user)) return { error: "Ce sujet est verrouillé." };
  await db.transaction(async (tx) => {
    await tx.insert(forumReplies).values({ topicId: topic[0].id, authorId: user.id, bodyMd: parsed.data.body });
    await tx.update(forumTopics).set({ replyCount: sql`${forumTopics.replyCount} + 1`, lastReplyAt: new Date() }).where(eq(forumTopics.id, topic[0].id));
  });
  revalidatePath(`/communaute/sujet/${topic[0].slug}`);
  return { success: "Réponse publiée." };
}

export async function acceptReplyAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;
  const topicId = Number(formData.get("topicId"));
  const replyId = Number(formData.get("replyId"));
  const topic = await db.select({ id: forumTopics.id, authorId: forumTopics.authorId, slug: forumTopics.slug, accepted: forumTopics.acceptedReplyId }).from(forumTopics).where(eq(forumTopics.id, topicId)).limit(1);
  if (!topic[0]) return;
  if (topic[0].authorId !== user.id && !canModerate(user)) return;
  const reply = await db.select({ id: forumReplies.id }).from(forumReplies).where(and(eq(forumReplies.id, replyId), eq(forumReplies.topicId, topicId))).limit(1);
  if (!reply[0]) return;
  await db.update(forumTopics).set({ acceptedReplyId: topic[0].accepted === replyId ? null : replyId, updatedAt: new Date() }).where(eq(forumTopics.id, topicId));
  revalidatePath(`/communaute/sujet/${topic[0].slug}`);
}

const reportSchema = z.object({
  targetType: z.enum(["topic", "reply"]),
  targetId: z.coerce.number().int().positive(),
  reason: z.enum(reportReasons.map((r) => r.key) as [string, ...string[]]),
  details: z.string().trim().max(500).optional(),
});

export async function reportAction(_prev: ForumState, formData: FormData): Promise<ForumState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Connectez-vous pour signaler un contenu." };
  const parsed = reportSchema.safeParse({ targetType: formData.get("targetType"), targetId: formData.get("targetId"), reason: formData.get("reason"), details: formData.get("details") || undefined });
  if (!parsed.success) return { error: "Signalement invalide." };
  const rl = await rateLimit("report", String(user.id), LIMITS.reportsPerHour, 3600);
  if (!rl.ok) return { error: "Trop de signalements en peu de temps." };
  const existing = await db
    .select({ id: reports.id })
    .from(reports)
    .where(and(eq(reports.targetType, parsed.data.targetType), eq(reports.targetId, parsed.data.targetId), eq(reports.reporterId, user.id), eq(reports.status, "open")))
    .limit(1);
  if (existing[0]) return { success: "Vous avez déjà signalé ce contenu ; la modération le traitera." };
  await db.insert(reports).values({ targetType: parsed.data.targetType, targetId: parsed.data.targetId, reporterId: user.id, reason: parsed.data.reason, details: parsed.data.details ?? null });
  return { success: "Merci, le signalement a été transmis à la modération." };
}

/* ------------------------------------------------------------------ modération */
async function requireModerator() {
  const user = await getCurrentUser();
  if (!user || !canModerate(user)) throw new Error("Accès refusé.");
  return user;
}

export async function moderateTopicAction(formData: FormData): Promise<void> {
  const mod = await requireModerator();
  const id = Number(formData.get("topicId"));
  const action = String(formData.get("action"));
  const note = String(formData.get("note") ?? "").slice(0, 300) || null;
  const topic = await db.select({ slug: forumTopics.slug, categoryId: forumTopics.categoryId }).from(forumTopics).where(eq(forumTopics.id, id)).limit(1);
  if (!topic[0]) return;
  const set: Partial<typeof forumTopics.$inferInsert> = { updatedAt: new Date() };
  if (action === "approve") set.status = "published";
  else if (action === "hide") set.status = "hidden";
  else if (action === "delete") set.status = "deleted";
  else if (action === "lock") set.locked = true;
  else if (action === "unlock") set.locked = false;
  else if (action === "pin") set.pinned = true;
  else if (action === "unpin") set.pinned = false;
  else return;
  await db.update(forumTopics).set(set).where(eq(forumTopics.id, id));
  await db.insert(moderationLog).values({ actorId: mod.id, action: `topic.${action}`, targetType: "topic", targetId: id, note });
  revalidatePath("/communaute");
  revalidatePath(`/communaute/sujet/${topic[0].slug}`);
  revalidatePath("/admin/moderation");
}

export async function moderateReplyAction(formData: FormData): Promise<void> {
  const mod = await requireModerator();
  const id = Number(formData.get("replyId"));
  const action = String(formData.get("action"));
  const reply = await db.select({ topicId: forumReplies.topicId, status: forumReplies.status }).from(forumReplies).where(eq(forumReplies.id, id)).limit(1);
  if (!reply[0]) return;
  const status = action === "approve" ? "published" : action === "hide" ? "hidden" : action === "delete" ? "deleted" : null;
  if (!status) return;
  await db.transaction(async (tx) => {
    await tx.update(forumReplies).set({ status, updatedAt: new Date() }).where(eq(forumReplies.id, id));
    const delta = (reply[0].status === "published" ? -1 : 0) + (status === "published" ? 1 : 0);
    if (delta !== 0) await tx.update(forumTopics).set({ replyCount: sql`greatest(0, ${forumTopics.replyCount} + ${delta})` }).where(eq(forumTopics.id, reply[0].topicId));
    await tx.insert(moderationLog).values({ actorId: mod.id, action: `reply.${action}`, targetType: "reply", targetId: id });
  });
  const t = await db.select({ slug: forumTopics.slug }).from(forumTopics).where(eq(forumTopics.id, reply[0].topicId)).limit(1);
  if (t[0]) revalidatePath(`/communaute/sujet/${t[0].slug}`);
  revalidatePath("/admin/moderation");
}

export async function resolveReportAction(formData: FormData): Promise<void> {
  const mod = await requireModerator();
  const id = Number(formData.get("reportId"));
  const status = String(formData.get("status")) === "dismissed" ? "dismissed" : "resolved";
  const note = String(formData.get("note") ?? "").slice(0, 300) || null;
  await db.update(reports).set({ status, resolvedById: mod.id, resolvedAt: new Date(), resolutionNote: note }).where(eq(reports.id, id));
  await db.insert(moderationLog).values({ actorId: mod.id, action: `report.${status}`, targetType: "report", targetId: id, note });
  revalidatePath("/admin/moderation");
}

export async function banUserAction(formData: FormData): Promise<void> {
  const mod = await requireModerator();
  const id = Number(formData.get("userId"));
  const unban = formData.get("action") === "unban";
  const target = await db.select({ role: users.role }).from(users).where(eq(users.id, id)).limit(1);
  if (!target[0] || target[0].role === "admin") return;
  await db.update(users).set({ bannedAt: unban ? null : new Date(), updatedAt: new Date() }).where(eq(users.id, id));
  await db.insert(moderationLog).values({ actorId: mod.id, action: unban ? "user.unban" : "user.ban", targetType: "user", targetId: id });
  revalidatePath("/admin/moderation");
  revalidatePath("/admin/utilisateurs");
}
