import { config } from "dotenv";
import { Pool } from "pg";

/**
 * Avant les tests de parcours : purge les compteurs de limitation de débit
 * (les inscriptions répétées d'une même IP seraient sinon refusées) et
 * supprime les comptes de test précédents. Base de test uniquement.
 */
export default async function globalSetup() {
  config({ path: [".env.test", ".env.local", ".env"], quiet: true });
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL requis pour les tests e2e");
  if (process.env.NEXT_PUBLIC_SITE_ENV === "production") throw new Error("Refus d'exécuter les e2e contre la production");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  await pool.query("DELETE FROM rate_limits");
  await pool.query("DELETE FROM forum_topics WHERE author_id IN (SELECT id FROM users WHERE username LIKE 'e2e_%')");
  await pool.query("DELETE FROM users WHERE username LIKE 'e2e_%'");
  await pool.end();
}
