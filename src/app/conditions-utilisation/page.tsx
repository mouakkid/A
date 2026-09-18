import type { Metadata } from "next";
import { site } from "@/config/site";
import { PageHeader } from "@/components/ui/page-header";
import { Prose } from "@/components/ui/prose";

export const metadata: Metadata = {
  title: "Conditions d'utilisation",
  description: "Conditions d'utilisation du site communautaire Garmin.ma : statut indépendant, contenus, outils, comptes et responsabilité.",
  alternates: { canonical: "/conditions-utilisation" },
};

export default function TermsPage() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Conditions d'utilisation" }]} eyebrow="Cadre" title="Conditions d'utilisation" intro="Dernière mise à jour : 18 septembre 2026." />
      <div className="container-x py-12">
        <Prose>
          <h2>1. Éditeur et statut</h2>
          <p>{site.independence.long}</p>
          <h2>2. Contenus</h2>
          <p>Les contenus éditoriaux sont fournis à titre informatif. Les caractéristiques techniques proviennent de sources indiquées et datées ; malgré nos vérifications, une erreur reste possible. Vérifiez toujours les informations importantes auprès de la documentation officielle avant un achat.</p>
          <h2>3. Outils</h2>
          <p>Les outils sont fournis gratuitement, sans garantie de résultat. Les conversions de fichiers peuvent perdre des informations, ce qui est signalé dans un rapport. Les calculs d'allure, de zones de fréquence cardiaque et de stratégie de course sont des estimations et ne constituent ni un diagnostic médical ni une prédiction de performance.</p>
          <h2>4. Comptes et forum</h2>
          <p>La participation au forum implique l'acceptation des règles communautaires. Vous restez responsable des contenus que vous publiez et accordez à Garmin.ma le droit de les afficher sur le site. La modération peut masquer ou supprimer un contenu contraire aux règles et suspendre un compte.</p>
          <h2>5. Propriété intellectuelle</h2>
          <p>Les marques et logos cités appartiennent à leurs propriétaires respectifs. Les textes originaux de Garmin.ma ne peuvent être reproduits sans autorisation, à l'exception de courtes citations avec lien vers la source.</p>
          <h2>6. Évolution</h2>
          <p>Ces conditions peuvent évoluer ; la date de mise à jour figure en tête de page.</p>
        </Prose>
      </div>
    </>
  );
}
