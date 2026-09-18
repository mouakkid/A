import { config } from "dotenv";
// Charge .env.local puis .env (le premier défini l'emporte), comme Next.js.
config({ path: [".env.local", ".env"], quiet: true });
