import { notFound, redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { devices, deviceSources } from "@/lib/db/schema";
import { getCurrentUser, canEdit } from "@/lib/auth/session";
import { DeviceForm } from "@/components/admin/device-form";
import { deviceSpecSchema, deviceEditorialSchema } from "@/lib/catalog/types";

export default async function AdminDeviceEdit({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!canEdit(user)) redirect("/admin");
  const { id } = await params;
  if (id === "nouveau") {
    return (
      <div>
        <h1 className="text-2xl font-bold">Nouvelle fiche équipement</h1>
        <DeviceForm initial={{ id: 0, slug: "", model: "", variant: "", family: "", category: "montre-running", status: "draft", officialUrl: "", lastVerifiedAt: "", spec: JSON.stringify(deviceSpecSchema.parse({}), null, 2), editorial: JSON.stringify(deviceEditorialSchema.parse({}), null, 2), sources: "[]" }} />
      </div>
    );
  }
  const [d] = await db.select().from(devices).where(eq(devices.id, Number(id))).limit(1);
  if (!d) notFound();
  const sources = await db.select({ label: deviceSources.label, url: deviceSources.url, accessedAt: deviceSources.accessedAt }).from(deviceSources).where(eq(deviceSources.deviceId, d.id));
  return (
    <div>
      <h1 className="text-2xl font-bold">{d.model}{d.variant ? ` (${d.variant})` : ""}</h1>
      <p className="mt-1 text-sm text-fg-muted">Les champs « spec » sont des données constructeur : n'y écrivez que ce qui est lu sur une source citée. Une valeur inconnue reste `null`.</p>
      <DeviceForm initial={{ id: d.id, slug: d.slug, model: d.model, variant: d.variant ?? "", family: d.family, category: d.category, status: d.status, officialUrl: d.officialUrl ?? "", lastVerifiedAt: d.lastVerifiedAt ? d.lastVerifiedAt.toISOString().slice(0, 10) : "", spec: JSON.stringify(d.spec, null, 2), editorial: JSON.stringify(d.editorial, null, 2), sources: JSON.stringify(sources.map((s) => ({ ...s, accessedAt: s.accessedAt ? s.accessedAt.toISOString().slice(0, 10) : null })), null, 2) }} />
    </div>
  );
}
