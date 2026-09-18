import type { Metadata } from "next";
import { getDevicesBySlugs, listPublishedDevices } from "@/lib/catalog/queries";
import { buildComparison, decisiveDifferences } from "@/lib/catalog/compare";
import { deviceDisplayName } from "@/lib/catalog/types";
import { PageHeader } from "@/components/ui/page-header";
import { ComparePicker } from "@/components/compare/compare-picker";
import { CompareTable } from "@/components/compare/compare-table";
import { SITE_URL } from "@/config/site";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ m?: string }> }): Promise<Metadata> {
  const { m } = await searchParams;
  const slugs = parseSlugs(m);
  if (slugs.length >= 2) {
    const list = await getDevicesBySlugs(slugs);
    if (list.length >= 2) {
      const names = list.map(deviceDisplayName);
      return {
        title: `${names.join(" vs ")} : comparaison des différences`,
        description: `Différences réelles entre ${names.join(", ")} : format, autonomie, GPS, cartographie, capteurs, prix de référence. Sans gagnant universel.`,
        // Les comparaisons dynamiques ne sont pas indexées : les comparatifs SEO ont un vrai contenu éditorial.
        robots: { index: false, follow: true },
        alternates: { canonical: `/comparer?m=${list.map((d) => d.slug).join(",")}` },
      };
    }
  }
  return {
    title: "Comparateur d'équipements Garmin",
    description: "Comparez de 2 à 4 montres ou compteurs Garmin : affichage des différences uniquement, caractéristiques regroupées par besoin, résumé des écarts décisifs, URL partageable.",
    alternates: { canonical: "/comparer" },
  };
}

function parseSlugs(m?: string): string[] {
  if (!m) return [];
  return Array.from(new Set(m.split(",").map((s) => s.trim().toLowerCase()).filter((s) => /^[a-z0-9-]+$/.test(s)))).slice(0, 4);
}

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ m?: string }> }) {
  const { m } = await searchParams;
  const slugs = parseSlugs(m);
  const [selected, all] = await Promise.all([getDevicesBySlugs(slugs), listPublishedDevices()]);
  const groups = selected.length >= 2 ? buildComparison(selected) : [];
  const summary = selected.length >= 2 ? decisiveDifferences(selected) : [];
  const shareUrl = selected.length >= 2 ? `${SITE_URL}/comparer?m=${selected.map((d) => d.slug).join(",")}` : null;
  const options = all.map((d) => ({ slug: d.slug, name: deviceDisplayName(d), family: d.family, category: d.category }));

  return (
    <>
      <PageHeader crumbs={[{ label: "Comparateur" }]} eyebrow="Décider" title="Comparateur" intro="Deux à quatre équipements côte à côte. Par défaut, seules les différences s'affichent. Une valeur inconnue n'est jamais comptée comme une différence.">
        <ComparePicker options={options} selected={selected.map((d) => d.slug)} />
      </PageHeader>
      <div className="container-x py-10">
        {selected.length < 2 ? (
          <div className="rounded-2xl border border-dashed border-border-strong p-10 text-center">
            <p className="text-lg font-semibold">Sélectionnez au moins deux modèles.</p>
            <p className="mt-2 text-fg-muted">Utilisez la recherche ci-dessus ou le bouton « Comparer » sur les fiches équipements. {all.length === 0 && "Aucune fiche n'est encore publiée."}</p>
          </div>
        ) : (
          <CompareTable devices={selected.map((d) => ({ slug: d.slug, name: deviceDisplayName(d), category: d.category }))} groups={groups} summary={summary} shareUrl={shareUrl!} />
        )}
      </div>
    </>
  );
}
