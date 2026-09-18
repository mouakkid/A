import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/config/site";
import { PageHeader } from "@/components/ui/page-header";
import { Prose } from "@/components/ui/prose";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contacter la rédaction et la modération de Garmin.ma : corrections, suggestions, partenariats éditoriaux, questions sur le site.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Contact" }]} eyebrow="Écrire à l'équipe" title="Contact" intro="Corrections, suggestions d'articles, signalements ou questions sur le fonctionnement du site." />
      <div className="container-x py-12">
        <Prose>
          <p>
            Adresse e-mail de la rédaction et de la modération : <a href={`mailto:${site.publisher.contactEmail}`}>{site.publisher.contactEmail}</a>.
          </p>
          <p>Aucun formulaire de contact n'est proposé pour l'instant : aucun service d'envoi d'e-mails n'est configuré sur cette version du site. Le formulaire sera activé une fois ce service en place, afin de ne pas afficher de faux succès d'envoi.</p>
          <h2>Ce que nous ne pouvons pas faire</h2>
          <ul>
            <li>Assurer le service après-vente, la garantie ou la réparation d'un appareil Garmin : Garmin.ma n'est pas Garmin.</li>
            <li>Vendre, réserver ou indiquer la disponibilité d'un produit.</li>
            <li>Accéder à votre compte Garmin Connect : nous ne demandons jamais vos identifiants.</li>
          </ul>
          <h2>Pour une question technique</h2>
          <p>
            Le <Link href="/communaute">forum</Link> est le meilleur endroit : d'autres utilisateurs pourront répondre et la réponse profitera à tous.
          </p>
        </Prose>
      </div>
    </>
  );
}
