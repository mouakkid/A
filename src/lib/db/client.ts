import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

declare global {
  var __garminPool: Pool | undefined;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL n'est pas défini. Voir .env.example.");
  }
  return new Pool({ connectionString, max: 10 });
}

const pool: Pool = global.__garminPool ?? createPool();
if (process.env.NODE_ENV !== "production") global.__garminPool = pool;

export const db: NodePgDatabase<typeof schema> = drizzle(pool, { schema });
export { schema };
