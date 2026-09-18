import "./env";
import { Pool } from "pg";

/** Réinitialise le schéma public (développement uniquement). */
async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL manquant");
  if (process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_SITE_ENV === "production") {
    throw new Error("Refus : db:reset est interdit en production.");
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  await pool.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public; DROP SCHEMA IF EXISTS drizzle CASCADE;");
  await pool.end();
  console.log("Schéma réinitialisé. Lancez npm run db:migrate puis npm run db:seed.");
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
