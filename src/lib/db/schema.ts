import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  serial,
  index,
  uniqueIndex,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

/* ---------------------------------------------------------------------------
   Utilisateurs, sessions, rôles
   --------------------------------------------------------------------------- */
export const userRoleEnum = pgEnum("user_role", ["member", "moderator", "editor", "admin"]);

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    username: text("username").notNull(),
    displayName: text("display_name"),
    passwordHash: text("password_hash").notNull(),
    role: userRoleEnum("role").notNull().default("member"),
    bio: text("bio"),
    mainSport: text("main_sport"),
    devices: text("devices").array().notNull().default(sql`'{}'::text[]`),
    bannedAt: timestamp("banned_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("users_email_idx").on(sql`lower(${t.email})`), uniqueIndex("users_username_idx").on(sql`lower(${t.username})`)],
);

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(), // hash SHA-256 du jeton
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    userAgent: text("user_agent"),
  },
  (t) => [index("sessions_user_idx").on(t.userId)],
);

/* ---------------------------------------------------------------------------
   Catalogue des équipements
   --------------------------------------------------------------------------- */
export const contentStatusEnum = pgEnum("content_status", ["draft", "review", "published", "archived"]);

export const devices = pgTable(
  "devices",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    model: text("model").notNull(),
    variant: text("variant"),
    family: text("family").notNull(),
    category: text("category").notNull(),
    status: contentStatusEnum("status").notNull().default("draft"),
    /** Données constructeur (schéma DeviceSpec, validé par zod) */
    spec: jsonb("spec").notNull(),
    /** Contenu éditorial (schéma DeviceEditorial) */
    editorial: jsonb("editorial").notNull(),
    officialUrl: text("official_url"),
    lastVerifiedAt: timestamp("last_verified_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("devices_slug_idx").on(t.slug), index("devices_category_idx").on(t.category), index("devices_status_idx").on(t.status)],
);

export const deviceSources = pgTable(
  "device_sources",
  {
    id: serial("id").primaryKey(),
    deviceId: integer("device_id").notNull().references(() => devices.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    url: text("url").notNull(),
    accessedAt: timestamp("accessed_at", { withTimezone: true }),
  },
  (t) => [index("device_sources_device_idx").on(t.deviceId)],
);

/* ---------------------------------------------------------------------------
   Contenu éditorial
   --------------------------------------------------------------------------- */
export const articleTypeEnum = pgEnum("article_type", ["news", "guide", "feature", "comparison"]);
export const newsStatusEnum = pgEnum("news_status", ["annonce", "disponibilite", "beta", "deploiement", "rumeur"]);

export const articles = pgTable(
  "articles",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    type: articleTypeEnum("type").notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull(),
    bodyMd: text("body_md").notNull(),
    status: contentStatusEnum("status").notNull().default("draft"),
    authorId: integer("author_id").references(() => users.id, { onDelete: "set null" }),
    /** Signature éditoriale affichée (ex. « Rédaction Garmin.ma ») */
    byline: text("byline").notNull().default("Rédaction Garmin.ma"),
    newsStatus: newsStatusEnum("news_status"),
    tags: text("tags").array().notNull().default(sql`'{}'::text[]`),
    deviceSlugs: text("device_slugs").array().notNull().default(sql`'{}'::text[]`),
    sports: text("sports").array().notNull().default(sql`'{}'::text[]`),
    sources: jsonb("sources").notNull().default(sql`'[]'::jsonb`),
    /** Statut de vérification : true si un test réel a été effectué */
    testedByUs: boolean("tested_by_us").notNull().default(false),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    significantUpdatedAt: timestamp("significant_updated_at", { withTimezone: true }),
    reviewedById: integer("reviewed_by_id").references(() => users.id, { onDelete: "set null" }),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("articles_slug_idx").on(t.slug), index("articles_type_status_idx").on(t.type, t.status), index("articles_published_idx").on(t.publishedAt)],
);

/* ---------------------------------------------------------------------------
   Forum
   --------------------------------------------------------------------------- */
export const forumStatusEnum = pgEnum("forum_status", ["published", "pending", "hidden", "deleted"]);

export const forumCategories = pgTable("forum_categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  position: integer("position").notNull().default(0),
});

export const forumTopics = pgTable(
  "forum_topics",
  {
    id: serial("id").primaryKey(),
    categoryId: integer("category_id").notNull().references(() => forumCategories.id),
    authorId: integer("author_id").notNull().references(() => users.id),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    bodyMd: text("body_md").notNull(),
    status: forumStatusEnum("status").notNull().default("published"),
    deviceTags: text("device_tags").array().notNull().default(sql`'{}'::text[]`),
    acceptedReplyId: integer("accepted_reply_id"),
    replyCount: integer("reply_count").notNull().default(0),
    views: integer("views").notNull().default(0),
    lastReplyAt: timestamp("last_reply_at", { withTimezone: true }),
    pinned: boolean("pinned").notNull().default(false),
    locked: boolean("locked").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("forum_topics_slug_idx").on(t.slug), index("forum_topics_category_idx").on(t.categoryId, t.status), index("forum_topics_author_idx").on(t.authorId)],
);

export const forumReplies = pgTable(
  "forum_replies",
  {
    id: serial("id").primaryKey(),
    topicId: integer("topic_id").notNull().references(() => forumTopics.id, { onDelete: "cascade" }),
    authorId: integer("author_id").notNull().references(() => users.id),
    bodyMd: text("body_md").notNull(),
    status: forumStatusEnum("status").notNull().default("published"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("forum_replies_topic_idx").on(t.topicId, t.status)],
);

/* ---------------------------------------------------------------------------
   Modération, signalements, limitation de débit
   --------------------------------------------------------------------------- */
export const reportStatusEnum = pgEnum("report_status", ["open", "resolved", "dismissed"]);

export const reports = pgTable(
  "reports",
  {
    id: serial("id").primaryKey(),
    targetType: text("target_type").notNull(), // "topic" | "reply" | "user"
    targetId: integer("target_id").notNull(),
    reporterId: integer("reporter_id").references(() => users.id, { onDelete: "set null" }),
    reason: text("reason").notNull(),
    details: text("details"),
    status: reportStatusEnum("status").notNull().default("open"),
    resolvedById: integer("resolved_by_id").references(() => users.id, { onDelete: "set null" }),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    resolutionNote: text("resolution_note"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("reports_status_idx").on(t.status), index("reports_target_idx").on(t.targetType, t.targetId)],
);

export const moderationLog = pgTable("moderation_log", {
  id: serial("id").primaryKey(),
  actorId: integer("actor_id").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  targetType: text("target_type").notNull(),
  targetId: integer("target_id"),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const rateLimits = pgTable("rate_limits", {
  key: text("key").primaryKey(),
  windowStart: timestamp("window_start", { withTimezone: true }).notNull(),
  count: integer("count").notNull().default(0),
});

/* ---------------------------------------------------------------------------
   Relations
   --------------------------------------------------------------------------- */
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  topics: many(forumTopics),
  replies: many(forumReplies),
}));
export const devicesRelations = relations(devices, ({ many }) => ({ sources: many(deviceSources) }));
export const deviceSourcesRelations = relations(deviceSources, ({ one }) => ({
  device: one(devices, { fields: [deviceSources.deviceId], references: [devices.id] }),
}));
export const forumTopicsRelations = relations(forumTopics, ({ one, many }) => ({
  category: one(forumCategories, { fields: [forumTopics.categoryId], references: [forumCategories.id] }),
  author: one(users, { fields: [forumTopics.authorId], references: [users.id] }),
  replies: many(forumReplies),
}));
export const forumRepliesRelations = relations(forumReplies, ({ one }) => ({
  topic: one(forumTopics, { fields: [forumReplies.topicId], references: [forumTopics.id] }),
  author: one(users, { fields: [forumReplies.authorId], references: [users.id] }),
}));
export const articlesRelations = relations(articles, ({ one }) => ({
  author: one(users, { fields: [articles.authorId], references: [users.id] }),
}));
