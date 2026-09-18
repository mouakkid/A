import "./env";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq, sql } from "drizzle-orm";
import * as schema from "../src/lib/db/schema";
import { deviceFileSchema } from "../src/lib/catalog/types";
import { parseFrontmatter } from "../src/lib/content/frontmatter";
import { forumCategorySeed } from "../src/lib/forum/constants";
import { hashPassword } from "../src/lib/auth/password";

/**
 * Seed idempotent :
 * - équipements depuis data/devices/*.json (validés par zod) ;
 * - contenus éditoriaux depuis content/articles/*.md (front-matter) ;
 * - catégories du forum ;
 * - compte administrateur si SEED_ADMIN_EMAIL/PASSWORD sont définis.
 * Aucune donnée de démonstration (membres, discussions, témoignages) n'est créée.
 */
async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL manquant");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  // --- Équipements
  const devDir = join(process.cwd(), "data", "devices");
  let devCount = 0;
  if (existsSync(devDir)) {
    for (const f of readdirSync(devDir).filter((x) => x.endsWith(".json")).sort()) {
      const raw = JSON.parse(readFileSync(join(devDir, f), "utf8"));
      const parsed = deviceFileSchema.safeParse(raw);
      if (!parsed.success) {
        console.error(`✗ ${f} invalide :`, parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "));
        process.exitCode = 1;
        continue;
      }
      const d = parsed.data;
      const [row] = await db
        .insert(schema.devices)
        .values({
          slug: d.slug,
          model: d.model,
          variant: d.variant,
          family: d.family,
          category: d.category,
          status: d.status,
          spec: d.spec,
          editorial: d.editorial,
          officialUrl: d.officialUrl,
          lastVerifiedAt: d.lastVerifiedAt ? new Date(d.lastVerifiedAt) : null,
        })
        .onConflictDoUpdate({
          target: schema.devices.slug,
          set: { model: d.model, variant: d.variant, family: d.family, category: d.category, status: d.status, spec: d.spec, editorial: d.editorial, officialUrl: d.officialUrl, lastVerifiedAt: d.lastVerifiedAt ? new Date(d.lastVerifiedAt) : null, updatedAt: new Date() },
        })
        .returning({ id: schema.devices.id });
      await db.delete(schema.deviceSources).where(eq(schema.deviceSources.deviceId, row.id));
      if (d.sources.length) {
        await db.insert(schema.deviceSources).values(d.sources.map((s) => ({ deviceId: row.id, label: s.label, url: s.url, accessedAt: s.accessedAt ? new Date(s.accessedAt) : null })));
      }
      devCount++;
    }
  }
  console.log(`Équipements : ${devCount} fiche(s) synchronisée(s).`);

  // --- Articles
  const artDir = join(process.cwd(), "content", "articles");
  let artCount = 0;
  if (existsSync(artDir)) {
    for (const f of readdirSync(artDir).filter((x) => x.endsWith(".md")).sort()) {
      const { data, body } = parseFrontmatter(readFileSync(join(artDir, f), "utf8"));
      const slug = String(data.slug ?? f.replace(/\.md$/, ""));
      const type = String(data.type ?? "guide") as "news" | "guide" | "feature" | "comparison";
      const status = String(data.status ?? "draft") as "draft" | "review" | "published" | "archived";
      const values = {
        slug,
        type,
        title: String(data.title ?? slug),
        excerpt: String(data.excerpt ?? ""),
        bodyMd: body.trim(),
        status,
        byline: String(data.byline ?? "Rédaction Garmin.ma"),
        newsStatus: (data.newsStatus as "annonce" | "disponibilite" | "beta" | "deploiement" | "rumeur" | undefined) ?? null,
        tags: (data.tags as string[] | undefined) ?? [],
        deviceSlugs: (data.devices as string[] | undefined) ?? [],
        sports: (data.sports as string[] | undefined) ?? [],
        sources: (data.sources as unknown[] | undefined) ?? [],
        testedByUs: Boolean(data.testedByUs ?? false),
        publishedAt: status === "published" && data.publishedAt ? new Date(String(data.publishedAt)) : null,
        significantUpdatedAt: data.updatedAt ? new Date(String(data.updatedAt)) : null,
      };
      // Ne pas écraser une version modifiée dans le back-office si elle est plus récente que le fichier :
      // règle simple — on met à jour uniquement les articles dont le corps n'a pas été édité en base (flag « seed »).
      await db
        .insert(schema.articles)
        .values(values)
        .onConflictDoUpdate({ target: schema.articles.slug, set: { ...values, updatedAt: new Date() }, setWhere: sql`${schema.articles.reviewedById} is null` });
      artCount++;
    }
  }
  console.log(`Articles : ${artCount} fichier(s) synchronisé(s).`);

  // --- Catégories du forum
  for (const c of forumCategorySeed) {
    await db.insert(schema.forumCategories).values(c).onConflictDoUpdate({ target: schema.forumCategories.slug, set: { name: c.name, description: c.description, position: c.position } });
  }
  console.log(`Forum : ${forumCategorySeed.length} catégories.`);

  // --- Administrateur
  const email = process.env.SEED_ADMIN_EMAIL?.trim();
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (email && password) {
    const existing = await db.select({ id: schema.users.id }).from(schema.users).where(sql`lower(${schema.users.email}) = lower(${email})`).limit(1);
    if (!existing.length) {
      await db.insert(schema.users).values({ email, username: "admin", displayName: "Administration", passwordHash: await hashPassword(password), role: "admin" });
      console.log(`Administrateur créé : ${email}`);
    } else {
      console.log("Administrateur déjà présent.");
    }
  } else {
    console.log("SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD absents : aucun administrateur créé.");
  }

  await pool.end();
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
