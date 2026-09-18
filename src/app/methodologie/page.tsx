import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Prose } from "@/components/ui/prose";
import { ProvenanceBadge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Méthodologie éditoriale",
  description: "Comment Garmin.ma vérifie les caractéristiques, distingue données constructeur et avis éditoriaux, et traite les prix, les nouveautés et les tests.",
  alternates: { canonical: "/methodologie" },
};

export default function MethodologyPage() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Méthodologie éditoriale" }]} eyebrow="Crédibilité" title="Méthodologie éditoriale" intro="Ce que nous vérifions, comment nous le signalons, et ce que nous refusons d'inventer." />
      <div className="container-x py-12">
        <Prose>
          <h2>Trois natures d'information</h2>
          <p>Chaque information publiée sur une fiche ou dans un article appartient à l'une de ces catégories, toujours signalée :</p>
          <div className="not-prose flex flex-wrap gap-2">
            <ProvenanceBadge kind="manufacturer" />
            <ProvenanceBadge kind="observed" />
            <ProvenanceBadge kind="editorial" />
            <ProvenanceBadge kind="unverified" />
          </div>
          <ul>
            <li><strong>Donnée constructeur</strong> : lue sur une page officielle Garmin (fiche produit, spécifications), avec l'URL et la date de consultation.</li>
            <li><strong>Observation documentée</strong> : constatée lors d'un test réel, avec description du protocole. Tant qu'aucun test n'a eu lieu, cette section reste vide.</li>
            <li><strong>Avis éditorial</strong> : notre lecture des données (positionnement, points forts, limites), assumée comme telle.</li>
            <li><strong>Non vérifié</strong> : nous n'avons pas trouvé l'information. Cela ne signifie pas que la fonction est absente.</li>
          </ul>
          <h2>Prix</h2>
          <p>Un prix est toujours accompagné de sa devise, de sa source, de son marché et de sa date. Un prix constructeur en euros n'est jamais converti en dirhams pour simuler un prix marocain. Nous n'annonçons aucune disponibilité locale que nous n'avons pas constatée.</p>
          <h2>Nouveautés</h2>
          <p>Chaque actualité indique son statut : annonce officielle, disponibilité, bêta, déploiement progressif ou rumeur explicitement présentée comme telle. Les compatibilités par modèle ne sont mentionnées que lorsqu'elles sont vérifiées.</p>
          <h2>Tests</h2>
          <p>Nous n'écrivons jamais « nous avons testé » sans test réel. Les articles portent un indicateur explicite lorsqu'un appareil a été utilisé par la rédaction.</p>
          <h2>Comparateur et assistant</h2>
          <p>Le comparateur affiche les différences réelles entre données connues ; une valeur inconnue n'est jamais comptée comme une différence. L'assistant « Quel Garmin choisir ? » applique des règles lisibles et affiche chaque raison. Il n'existe pas de score scientifique caché.</p>
          <h2>Cycle de publication</h2>
          <p>Tout contenu passe par un statut brouillon, puis une relecture, avant publication. Les mises à jour significatives sont datées. Les corrections signalées par la communauté sont bienvenues via le forum ou la page Contact.</p>
          <h2>Ce que nous n'inventons pas</h2>
          <ul>
            <li>Des statistiques de communauté, des témoignages ou des membres fictifs.</li>
            <li>Des avis, notes, offres ou stocks.</li>
            <li>Des pages par ville quasi identiques ou des comparatifs sans valeur ajoutée.</li>
          </ul>
        </Prose>
      </div>
    </>
  );
}
