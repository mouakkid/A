import type { Metadata } from "next";
import { listPublishedDevices } from "@/lib/catalog/queries";
import { PageHeader } from "@/components/ui/page-header";
import { Advisor } from "@/components/recommend/advisor";

export const metadata: Metadata = {
  title: "Quel Garmin choisir ? Assistant explicable selon votre sport et votre budget",
  description: "Répondez à neuf questions (sport, budget, niveau, autonomie ou écran, taille, cartographie, options) et obtenez jusqu'à trois recommandations expliquées, avec leurs compromis.",
  alternates: { canonical: "/quel-garmin-choisir" },
};

export default async function AdvisorPage() {
  const devices = await listPublishedDevices();
  return (
    <>
      <PageHeader crumbs={[{ label: "Quel Garmin choisir ?" }]} eyebrow="Assistant" title="Quel Garmin choisir ?" intro="Neuf questions courtes. Un moteur de règles lisible : chaque recommandation affiche ses raisons et ses compromis. Aucun score caché." tone="dark" />
      <div className="container-x py-10">
        <Advisor devices={devices} />
      </div>
    </>
  );
}
