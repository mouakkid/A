import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getCurrentUser, canModerate, canEdit } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { PageHeader } from "@/components/ui/page-header";
import { ProfileForm } from "@/components/auth/profile-form";
import { logoutAction } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Mon compte", robots: { index: false } };

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/compte");
  const [full] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
  return (
    <>
      <PageHeader crumbs={[{ label: "Mon compte" }]} eyebrow="Profil" title={full.displayName || full.username} intro={`Membre depuis le ${formatDate(full.createdAt)} · Rôle : ${full.role}`}>
        <div className="mt-6 flex flex-wrap gap-2">
          {(canModerate(user) || canEdit(user)) && (
            <Link href="/admin" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white">Back-office</Link>
          )}
          <form action={logoutAction}>
            <Button type="submit" variant="secondary" size="sm">Se déconnecter</Button>
          </form>
        </div>
      </PageHeader>
      <div className="container-x grid gap-12 py-12 lg:grid-cols-[1fr_20rem]">
        <div className="max-w-xl">
          <h2 className="text-xl font-bold">Profil public</h2>
          <p className="mt-1 text-sm text-fg-muted">Ces informations sont visibles sur le forum. Aucun identifiant Garmin n'est demandé.</p>
          <ProfileForm initial={{ displayName: full.displayName ?? "", bio: full.bio ?? "", mainSport: full.mainSport ?? "", devices: full.devices.join(", ") }} />
        </div>
        <aside className="space-y-4 text-sm">
          <div className="rounded-2xl border border-border p-5">
            <h2 className="font-semibold">Vos données</h2>
            <p className="mt-2 text-fg-muted">Adresse e-mail : {full.email} (jamais affichée).</p>
            <p className="mt-2 text-fg-muted">Pour supprimer votre compte, écrivez-nous via la <Link href="/contact" className="underline">page Contact</Link> : la suppression en libre-service arrivera avec le service d'e-mail.</p>
          </div>
          <div className="rounded-2xl border border-border p-5">
            <h2 className="font-semibold">Participer</h2>
            <Link href="/communaute" className="mt-2 block text-accent-strong underline dark:text-accent">Aller au forum</Link>
          </div>
        </aside>
      </div>
    </>
  );
}
