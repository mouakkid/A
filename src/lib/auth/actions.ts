"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { hashPassword, verifyPassword } from "./password";
import { createSession, destroySession, getCurrentUser } from "./session";
import { rateLimit, clientIdentifier } from "./rate-limit";
import { honeypotTriggered } from "@/lib/forum/spam";

export type AuthState = { error?: string; fieldErrors?: Record<string, string> } | null;

const registerSchema = z.object({
  email: z.string().trim().email("Adresse e-mail invalide.").max(190),
  username: z
    .string()
    .trim()
    .min(3, "3 caractères minimum.")
    .max(24, "24 caractères maximum.")
    .regex(/^[a-zA-Z0-9_.-]+$/, "Lettres, chiffres, point, tiret et underscore uniquement."),
  password: z.string().min(10, "10 caractères minimum.").max(200),
  mainSport: z.string().trim().max(40).optional(),
  accept: z.literal("on", { error: "Vous devez accepter les règles communautaires." }),
});

function safeNext(v: FormDataEntryValue | null): string {
  const s = typeof v === "string" ? v : "";
  return s.startsWith("/") && !s.startsWith("//") ? s : "/compte";
}

export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (honeypotTriggered(formData.get("website"))) return { error: "Requête refusée." };
  const rl = await rateLimit("register", await clientIdentifier(), 5, 3600);
  if (!rl.ok) return { error: `Trop de tentatives. Réessayez dans ${Math.ceil(rl.retryAfterSeconds / 60)} min.` };
  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    username: formData.get("username"),
    password: formData.get("password"),
    mainSport: formData.get("mainSport") || undefined,
    accept: formData.get("accept"),
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] = i.message;
    return { fieldErrors };
  }
  const { email, username, password, mainSport } = parsed.data;
  const dupe = await db
    .select({ id: users.id, email: users.email, username: users.username })
    .from(users)
    .where(sql`lower(${users.email}) = lower(${email}) or lower(${users.username}) = lower(${username})`)
    .limit(1);
  if (dupe.length) {
    return dupe[0].email.toLowerCase() === email.toLowerCase() ? { fieldErrors: { email: "Cette adresse est déjà utilisée." } } : { fieldErrors: { username: "Ce pseudonyme est déjà pris." } };
  }
  const [created] = await db.insert(users).values({ email, username, passwordHash: await hashPassword(password), mainSport: mainSport ?? null }).returning({ id: users.id });
  await createSession(created.id);
  redirect(safeNext(formData.get("next")));
}

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (honeypotTriggered(formData.get("website"))) return { error: "Requête refusée." };
  const id = await clientIdentifier();
  const rl = await rateLimit("login", id, 10, 900);
  if (!rl.ok) return { error: `Trop de tentatives. Réessayez dans ${Math.ceil(rl.retryAfterSeconds / 60)} min.` };
  const identifier = String(formData.get("identifier") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!identifier || !password) return { error: "Identifiant et mot de passe requis." };
  const rows = await db
    .select({ id: users.id, passwordHash: users.passwordHash, bannedAt: users.bannedAt })
    .from(users)
    .where(sql`lower(${users.email}) = lower(${identifier}) or lower(${users.username}) = lower(${identifier})`)
    .limit(1);
  const user = rows[0];
  const ok = user ? await verifyPassword(password, user.passwordHash) : await verifyPassword(password, "scrypt$16384$8$1$AAAAAAAAAAAAAAAAAAAAAA==$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=");
  if (!user || !ok) return { error: "Identifiant ou mot de passe incorrect." };
  if (user.bannedAt) return { error: "Ce compte est suspendu. Contactez la modération." };
  await createSession(user.id);
  redirect(safeNext(formData.get("next")));
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}

const profileSchema = z.object({
  displayName: z.string().trim().max(60).optional(),
  bio: z.string().trim().max(400).optional(),
  mainSport: z.string().trim().max(40).optional(),
  devices: z.string().trim().max(300).optional(),
});

export async function updateProfileAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Connectez-vous." };
  const parsed = profileSchema.safeParse({
    displayName: formData.get("displayName") || undefined,
    bio: formData.get("bio") || undefined,
    mainSport: formData.get("mainSport") || undefined,
    devices: formData.get("devices") || undefined,
  });
  if (!parsed.success) return { error: "Formulaire invalide." };
  const devicesList = (parsed.data.devices ?? "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 8);
  await db
    .update(users)
    .set({ displayName: parsed.data.displayName ?? null, bio: parsed.data.bio ?? null, mainSport: parsed.data.mainSport ?? null, devices: devicesList, updatedAt: new Date() })
    .where(sql`${users.id} = ${user.id}`);
  return { error: undefined, fieldErrors: { _success: "Profil mis à jour." } };
}
