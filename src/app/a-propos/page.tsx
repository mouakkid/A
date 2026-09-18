import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/config/site";
import { PageHeader } from "@/components/ui/page-header";
import { Prose } from "@/components/ui/prose";

export const metadata: Metadata = {
  title: "À propos",
  description: "Garmin.ma est une communauté indépendante d'utilisateurs Garmin au Maroc : qui nous sommes, ce que nous faisons et ce que nous ne sommes pas.",
  alternates: { canonical: "/a-propos" },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader crumbs={[{ label: "À propos" }]} eyebrow="Le site" title="Une communauté indépendante, pas une boutique" intro={site.independence.short} />
      <div className="container-x py-12">
        <Prose>
          <p className="text-lg">{site.independence.long}</p>
          <h2>Ce que Garmin.ma est</h2>
          <ul>
            <li>Un média spécialisé : actualités vérifiées, guides durables et fonctionnalités expliquées.</li>
            <li>Une communauté d'entraide : un forum en français pour les sportifs du Maroc.</li>
            <li>Un centre de ressources : fiches équipements sourcées, avec date de dernière vérification.</li>
            <li>Une plateforme d'outils sportifs gratuits qui fonctionnent dans votre navigateur.</li>
            <li>Un guide pour choisir et mieux utiliser un équipement Garmin selon son sport et son budget.</li>
          </ul>
          <h2>Ce que Garmin.ma n'est pas</h2>
          <ul>
            <li>Le site officiel de Garmin au Maroc.</li>
            <li>Un représentant, importateur ou distributeur officiel.</li>
            <li>Une boutique : aucun panier, aucun paiement, aucune disponibilité locale annoncée.</li>
            <li>Un service client Garmin : pour une garantie ou un SAV, adressez-vous aux canaux officiels de la marque.</li>
          </ul>
          <h2>Comment nous travaillons</h2>
          <p>
            Chaque fiche distingue les données constructeur, les observations documentées et nos appréciations éditoriales. Une information que nous n'avons pas pu vérifier apparaît « Non vérifié ». Nous ne prétendons jamais avoir testé un appareil sans test réel. Les détails sont dans notre <Link href="/methodologie">méthodologie éditoriale</Link>.
          </p>
          <h2>Langues et localisation</h2>
          <p>Le site est publié en français. Une version arabe avec affichage de droite à gauche est prévue ; elle ne sera mise en ligne qu'une fois complète. Les unités affichées sont le kilomètre, le mètre, le kilogramme et le degré Celsius ; le fuseau horaire de référence est Africa/Casablanca.</p>
          <h2>Nous contacter</h2>
          <p>
            Pour une correction, une suggestion ou une question sur le site : <Link href="/contact">page Contact</Link>.
          </p>
        </Prose>
      </div>
    </>
  );
}
