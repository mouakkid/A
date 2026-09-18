import Link from "next/link";
import { asc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/client";
import { devices } from "@/lib/db/schema";
import { getCurrentUser, canEdit } from "@/lib/auth/session";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/format";
import { ButtonLink } from "@/components/ui/button";

export default async function AdminDevices() {
  const user = await getCurrentUser();
  if (!canEdit(user)) redirect("/admin");
  const list = await db.select({ id: devices.id, slug: devices.slug, model: devices.model, variant: devices.variant, category: devices.category, status: devices.status, lastVerifiedAt: devices.lastVerifiedAt }).from(devices).orderBy(asc(devices.family), asc(devices.model));
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Équipements ({list.length})</h1>
        <ButtonLink href="/admin/equipements/nouveau" size="sm">Nouvelle fiche</ButtonLink>
      </div>
      <table className="mt-6 w-full text-sm">
        <thead className="text-left text-xs uppercase tracking-[0.12em] text-fg-subtle"><tr><th className="py-2">Modèle</th><th className="py-2">Catégorie</th><th className="py-2">Statut</th><th className="py-2">Vérifié le</th></tr></thead>
        <tbody>
          {list.map((d) => (
            <tr key={d.id} className="border-t border-border">
              <td className="py-2"><Link href={`/admin/equipements/${d.id}`} className="font-medium hover:underline">{d.model}{d.variant ? ` (${d.variant})` : ""}</Link><span className="block text-xs text-fg-subtle">{d.slug}</span></td>
              <td className="py-2">{d.category}</td>
              <td className="py-2"><Badge tone={d.status === "published" ? "success" : d.status === "review" ? "warning" : "neutral"}>{d.status}</Badge></td>
              <td className="py-2">{formatDate(d.lastVerifiedAt)}</td>
            </tr>
          ))}
          {list.length === 0 && <tr><td colSpan={4} className="py-6 text-center text-fg-subtle">Aucune fiche. Lancez `npm run db:seed` ou créez une fiche.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
