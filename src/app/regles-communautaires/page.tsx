import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Prose } from "@/components/ui/prose";

export const metadata: Metadata = {
  title: "Règles communautaires",
  description: "Les règles du forum Garmin.ma : respect, entraide, pas de spam, pas de données personnelles ni de coordonnées GPS, modération transparente.",
  alternates: { canonical: "/regles-communautaires" },
};

export default function RulesPage() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Règles communautaires" }]} eyebrow="Forum" title="Règles communautaires" intro="Courtes, claires, appliquées de la même façon pour tout le monde." />
      <div className="container-x py-12">
        <Prose>
          <ol>
            <li><strong>Respect.</strong> Pas d'insultes, de harcèlement ni de discrimination. On peut être en désaccord sur une montre, pas sur la dignité des personnes.</li>
            <li><strong>Entraide avant tout.</strong> Une question mérite une réponse utile, pas une moquerie. Marquez la réponse qui vous a aidé comme « réponse acceptée ».</li>
            <li><strong>Pas de spam ni de publicité.</strong> Les liens commerciaux, codes promo et messages répétés sont supprimés. Les nouveaux comptes sont limités à deux liens par message.</li>
            <li><strong>Vie privée.</strong> Ne publiez pas de coordonnées GPS précises, d'adresses, de numéros de téléphone ni de captures contenant des données personnelles. Utilisez l'outil Confidentialité GPS avant de partager une trace.</li>
            <li><strong>Honnêteté.</strong> Précisez si vous parlez d'expérience ou d'après une lecture. Signalez les rumeurs comme telles.</li>
            <li><strong>Pièces jointes.</strong> Désactivées pour l'instant, le temps de mettre en place leur sécurisation et leur modération. Partagez un lien vers un service tiers si nécessaire.</li>
            <li><strong>Pas de revente.</strong> Le forum n'est pas une place de marché : Garmin.ma ne vend rien et n'héberge pas de petites annonces.</li>
            <li><strong>Modération.</strong> Les modérateurs peuvent masquer un message, verrouiller un sujet ou suspendre un compte. Chaque action est journalisée. Vous pouvez signaler tout contenu via le bouton « Signaler ».</li>
          </ol>
          <p>Ces règles complètent les conditions d'utilisation du site.</p>
        </Prose>
      </div>
    </>
  );
}
