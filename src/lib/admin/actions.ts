"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { articles, devices, deviceSources, moderationLog, users } from "@/lib/db/schema";
import { getCurrentUser, canEdit, isAdmin } from "@/lib/auth/session";
import { deviceSpecSchema, deviceEditorialSchema, deviceCategories } from "@/lib/catalog/types";
import { slugify } from "@/lib/utils/slug";

export type AdminState = { error?: string; success?: string } | null;

async function requireEditor() {
  const user = await getCurrentUser();
  if (!user || !canEdit(user)) throw new Error("Accès refusé.");
  return user;
}

function parseJson<T>(raw: FormDataEntryValue | null, schema: z.ZodType<T>): { ok: true; data: T } | { ok: false; error: string } {
  try {
    const obj = JSON.parse(String(raw ?? "{}"));
    const r = schema.safeParse(obj);
    if (!r.success) return { ok: false, error: r.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(" ; ") };
    return { ok: true, data: r.data };
  } catch {
    return { ok: false, error: "JSON invalide." };
  }
}

const deviceBase = z.object({
  slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/, "Slug : minuscules, chiffres et tirets."),
  model: z.string().trim().min(1).max(120),
  variant: z.string().trim().max(60).optional(),
  family: z.string().trim().min(1).max(60),
  category: z.enum(deviceCategories),
  status: z.enum(["draft", "review", "published", "archived"]),
  officialUrl: z.string().trim().url().optional().or(z.literal("")),
  lastVerifiedAt: z.string().trim().optional(),
});

export async function saveDeviceAction(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const editor = await requireEditor();
  const id = Number(formData.get("id") || 0);
  const base = deviceBase.safeParse({
    slug: formData.get("slug"),
    model: formData.get("model"),
    variant: formData.get("variant") || undefined,
    family: formData.get("family"),
    category: formData.get("category"),
    status: formData.get("status"),
    officialUrl: formData.get("officialUrl") || "",
    lastVerifiedAt: formData.get("lastVerifiedAt") || undefined,
  });
  if (!base.success) return { error: base.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(" ; ") };
  const spec = parseJson(formData.get("spec"), deviceSpecSchema);
  if (!spec.ok) return { error: `Spécifications : ${spec.error}` };
  const editorial = parseJson(formData.get("editorial"), deviceEditorialSchema);
  if (!editorial.ok) return { error: `Éditorial : ${editorial.error}` };
  const sources = parseJson(formData.get("sources"), z.array(z.object({ label: z.string(), url: z.string().url(), accessedAt: z.string().nullable().optional() })));
  if (!sources.ok) return { error: `Sources : ${sources.error}` };

  const values = {
    slug: base.data.slug,
    model: base.data.model,
    variant: base.data.variant ?? null,
    family: base.data.family,
    category: base.data.category,
    status: base.data.status,
    officialUrl: base.data.officialUrl || null,
    lastVerifiedAt: base.data.lastVerifiedAt ? new Date(base.data.lastVerifiedAt) : null,
    spec: spec.data,
    editorial: editorial.data,
    updatedAt: new Date(),
  };
  let deviceId = id;
  if (id) {
    await db.update(devices).set(values).where(eq(devices.id, id));
  } else {
    const [row] = await db.insert(devices).values(values).returning({ id: devices.id });
    deviceId = row.id;
  }
  await db.delete(deviceSources).where(eq(deviceSources.deviceId, deviceId));
  if (sources.data.length) await db.insert(deviceSources).values(sources.data.map((s) => ({ deviceId, label: s.label, url: s.url, accessedAt: s.accessedAt ? new Date(s.accessedAt) : null })));
  await db.insert(moderationLog).values({ actorId: editor.id, action: id ? "device.update" : "device.create", targetType: "device", targetId: deviceId });
  revalidatePath("/equipements");
  revalidatePath(`/equipements/${values.slug}`);
  revalidatePath("/");
  if (!id) redirect(`/admin/equipements/${deviceId}`);
  return { success: "Équipement enregistré." };
}

const articleSchema = z.object({
  slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9-]+$/, "Slug : minuscules, chiffres et tirets."),
  type: z.enum(["news", "guide", "feature", "comparison"]),
  title: z.string().trim().min(5).max(180),
  excerpt: z.string().trim().min(20).max(400),
  bodyMd: z.string().min(50),
  byline: z.string().trim().min(2).max(80),
  newsStatus: z.enum(["annonce", "disponibilite", "beta", "deploiement", "rumeur"]).optional().or(z.literal("")),
  tags: z.string().optional(),
  deviceSlugs: z.string().optional(),
  sports: z.string().optional(),
  sources: z.string().optional(),
  testedByUs: z.string().optional(),
  significantUpdatedAt: z.string().optional(),
});

export async function saveArticleAction(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const editor = await requireEditor();
  const id = Number(formData.get("id") || 0);
  const parsed = articleSchema.safeParse(Object.fromEntries(["slug", "type", "title", "excerpt", "bodyMd", "byline", "newsStatus", "tags", "deviceSlugs", "sports", "sources", "testedByUs", "significantUpdatedAt"].map((k) => [k, formData.get(k) ?? undefined])));
  if (!parsed.success) return { error: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(" ; ") };
  const d = parsed.data;
  const list = (s?: string) => (s ?? "").split(",").map((x) => x.trim()).filter(Boolean);
  const sources = parseJson(d.sources || "[]", z.array(z.object({ label: z.string(), url: z.string().url(), accessedAt: z.string().nullable().optional() })));
  if (!sources.ok) return { error: `Sources : ${sources.error}` };
  const values = {
    slug: d.slug,
    type: d.type,
    title: d.title,
    excerpt: d.excerpt,
    bodyMd: d.bodyMd,
    byline: d.byline,
    newsStatus: d.type === "news" && d.newsStatus ? d.newsStatus : null,
    tags: list(d.tags),
    deviceSlugs: list(d.deviceSlugs).map(slugify),
    sports: list(d.sports),
    sources: sources.data,
    testedByUs: d.testedByUs === "on",
    significantUpdatedAt: d.significantUpdatedAt ? new Date(d.significantUpdatedAt) : null,
    updatedAt: new Date(),
  };
  let articleId = id;
  if (id) {
    await db.update(articles).set(values).where(eq(articles.id, id));
  } else {
    const [row] = await db.insert(articles).values({ ...values, status: "draft", authorId: editor.id }).returning({ id: articles.id });
    articleId = row.id;
  }
  await db.insert(moderationLog).values({ actorId: editor.id, action: id ? "article.update" : "article.create", targetType: "article", targetId: articleId });
  if (!id) redirect(`/admin/articles/${articleId}`);
  return { success: "Article enregistré (le statut se change via les boutons de workflow)." };
}

/** Workflow éditorial : draft → review → published (validation par un éditeur différent de l'auteur si possible) → archived. */
export async function transitionArticleAction(formData: FormData): Promise<void> {
  const editor = await requireEditor();
  const id = Number(formData.get("id"));
  const to = String(formData.get("to"));
  const [a] = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
  if (!a) return;
  const allowed: Record<string, string[]> = { draft: ["review"], review: ["draft", "published"], published: ["draft", "archived"], archived: ["draft"] };
  if (!allowed[a.status]?.includes(to)) return;
  const set: Partial<typeof articles.$inferInsert> = { status: to as typeof a.status, updatedAt: new Date() };
  if (to === "published") {
    set.reviewedById = editor.id;
    set.reviewedAt = new Date();
    if (!a.publishedAt) set.publishedAt = new Date();
    else set.significantUpdatedAt = a.significantUpdatedAt ?? null;
  }
  await db.update(articles).set(set).where(eq(articles.id, id));
  await db.insert(moderationLog).values({ actorId: editor.id, action: `article.${to}`, targetType: "article", targetId: id, note: a.authorId === editor.id && to === "published" ? "auto-validation (même personne que l'auteur)" : null });
  revalidatePath("/");
  revalidatePath("/actualites");
  revalidatePath("/guides");
  revalidatePath("/fonctionnalites");
  revalidatePath("/comparatifs");
  revalidatePath(`/admin/articles/${id}`);
}

export async function setUserRoleAction(formData: FormData): Promise<void> {
  const admin = await getCurrentUser();
  if (!admin || !isAdmin(admin)) throw new Error("Accès refusé.");
  const id = Number(formData.get("userId"));
  const role = String(formData.get("role"));
  if (!["member", "moderator", "editor", "admin"].includes(role) || id === admin.id) return;
  await db.update(users).set({ role: role as "member" | "moderator" | "editor" | "admin", updatedAt: new Date() }).where(eq(users.id, id));
  await db.insert(moderationLog).values({ actorId: admin.id, action: `user.role.${role}`, targetType: "user", targetId: id });
  revalidatePath("/admin/utilisateurs");
}
