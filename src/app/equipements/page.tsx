import type { Metadata } from "next";
import Link from "next/link";
import { listPublishedDevices, countDevicesByCategory } from "@/lib/catalog/queries";
import { deviceCategories, categoryLabels, type DeviceCategory } from "@/lib/catalog/types";
import { PageHeader } from "@/components/ui/page-header";
import { DeviceCard } from "@/components/catalog/device-card";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = {
  title: "Équipements Garmin : fiches vérifiées et sourcées",
  description: "Montres running, multisports, outdoor, bien-être, compteurs vélo et capteurs Garmin : fiches avec données constructeur sourcées, limites, alternatives et date de vérification.",
  alternates: { canonical: "/equipements" },
};

export default async function DevicesPage({ searchParams }: { searchParams: Promise<{ categorie?: string }> }) {
  const { categorie } = await searchParams;
  const cat = deviceCategories.includes(categorie as DeviceCategory) ? (categorie as DeviceCategory) : undefined;
  const [list, counts] = await Promise.all([listPublishedDevices(cat), countDevicesByCategory()]);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return (
    <>
      <PageHeader crumbs={[{ label: "Équipements" }]} eyebrow="Catalogue" title={cat ? categoryLabels[cat] : "Équipements Garmin"} intro="Chaque fiche distingue données constructeur, observations documentées et avis éditoriaux. Une valeur inconnue reste « Non vérifié »." />
      <div className="container-x py-8">
        <nav aria-label="Catégories" className="-mx-4 overflow-x-auto px-4 pb-2">
          <ul className="flex gap-2">
            <li>
              <Link href="/equipements" className={cn("inline-flex h-9 items-center rounded-full border px-4 text-sm font-medium", !cat ? "border-fg bg-fg text-bg" : "border-border hover:border-fg")}>Tous ({total})</Link>
            </li>
            {deviceCategories.map((c) => (
              <li key={c}>
                <Link href={`/equipements?categorie=${c}`} className={cn("inline-flex h-9 items-center whitespace-nowrap rounded-full border px-4 text-sm font-medium", cat === c ? "border-fg bg-fg text-bg" : "border-border hover:border-fg")} aria-current={cat === c ? "page" : undefined}>
                  {categoryLabels[c]} ({counts[c] ?? 0})
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {list.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border-strong p-10 text-center">
            <p className="text-lg font-semibold">Aucune fiche publiée dans cette catégorie pour l'instant.</p>
            <p className="mt-2 text-fg-muted">Le catalogue s'étoffe progressivement, chaque fiche étant vérifiée à la source avant publication.</p>
          </div>
        ) : (
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((d, i) => (
              <li key={d.slug} className={cn("reveal", i % 3 === 1 && "reveal-delay-1", i % 3 === 2 && "reveal-delay-2")}>
                <DeviceCard device={d} className="h-full" />
              </li>
            ))}
          </ul>
        )}
        <p className="mt-10 text-sm text-fg-subtle">Les prix indiqués sont des prix constructeur de référence sur le marché mentionné, à la date de vérification. Ils ne sont pas des prix constatés au Maroc et Garmin.ma ne vend aucun produit.</p>
      </div>
    </>
  );
}
