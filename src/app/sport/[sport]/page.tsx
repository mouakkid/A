import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { listPublishedDevices } from "@/lib/catalog/queries";
import { listArticlesForSport } from "@/lib/content/queries";
import { sportKeys, sportLabels, type SportKey } from "@/lib/catalog/types";
import { PageHeader } from "@/components/ui/page-header";
import { DeviceCard } from "@/components/catalog/device-card";
import { ArticleCard } from "@/components/content/article-card";
import { ButtonLink } from "@/components/ui/button";

const sportIntro: Record<SportKey, string> = {
  running: "Route, piste, sorties matinales sur la corniche : choisir une montre running, comprendre ses allures et ses zones, préparer une course.",
  trail: "Sentiers de l'Atlas, dénivelé, navigation et autonomie : les équipements et guides utiles aux traileurs.",
  cyclisme: "Compteurs Edge, capteurs, radar et itinéraires : l'essentiel pour rouler avec un équipement Garmin.",
  triathlon: "Natation, vélo, course et transitions : montres multisports, profils triathlon et natation en eau libre.",
  natation: "Piscine et eau libre : étanchéité, métriques de nage et compatibilités.",
  randonnee: "Cartes, traces, altimètre barométrique et longues autonomies pour la randonnée.",
  fitness: "Suivi quotidien, bien-être, récupération et sommeil.",
  marche: "Marche active et suivi quotidien avec un équipement simple.",
};

export function generateStaticParams() {
  return sportKeys.map((sport) => ({ sport }));
}

export async function generateMetadata({ params }: { params: Promise<{ sport: string }> }): Promise<Metadata> {
  const { sport } = await params;
  if (!sportKeys.includes(sport as SportKey)) return { title: "Sport introuvable" };
  const label = sportLabels[sport as SportKey];
  return { title: `${label} : équipements Garmin et guides`, description: sportIntro[sport as SportKey], alternates: { canonical: `/sport/${sport}` } };
}

export default async function SportPage({ params }: { params: Promise<{ sport: string }> }) {
  const { sport } = await params;
  if (!sportKeys.includes(sport as SportKey)) notFound();
  const key = sport as SportKey;
  const [devices, articles] = await Promise.all([listPublishedDevices(), listArticlesForSport(key)]);
  const matching = devices.filter((d) => d.editorial.sports.includes(key));
  return (
    <>
      <PageHeader crumbs={[{ label: "Par sport" }, { label: sportLabels[key] }]} eyebrow="Entrée par sport" title={sportLabels[key]} intro={sportIntro[key]} tone="dark">
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/quel-garmin-choisir" variant="inverse">Trouver mon Garmin</ButtonLink>
          <ButtonLink href="/comparer" variant="ghost" className="text-white hover:bg-white/10">Comparer des modèles</ButtonLink>
        </div>
      </PageHeader>
      <div className="container-x space-y-14 py-12">
        <section aria-labelledby="sport-devices">
          <h2 id="sport-devices" className="text-2xl font-bold">Équipements positionnés pour {sportLabels[key].toLowerCase()}</h2>
          {matching.length ? (
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {matching.map((d) => <li key={d.slug}><DeviceCard device={d} className="h-full" /></li>)}
            </ul>
          ) : (
            <p className="mt-4 text-fg-muted">Aucune fiche publiée ne cible encore ce sport.</p>
          )}
        </section>
        <section aria-labelledby="sport-articles">
          <h2 id="sport-articles" className="text-2xl font-bold">Guides et articles</h2>
          {articles.length ? (
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => <li key={a.id}><ArticleCard article={a} className="h-full" /></li>)}
            </ul>
          ) : (
            <p className="mt-4 text-fg-muted">Aucun article publié pour ce sport pour l'instant. <Link href="/guides" className="underline">Voir tous les guides</Link>.</p>
          )}
        </section>
      </div>
    </>
  );
}
