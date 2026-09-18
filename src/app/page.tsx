import Link from "next/link";
import { ArrowRight, ShieldCheck, FileSearch, Repeat, EyeOff, Timer, HeartPulse, Flag } from "lucide-react";
import { site } from "@/config/site";
import { listPublishedDevices } from "@/lib/catalog/queries";
import { listPublishedArticles } from "@/lib/content/queries";
import { listRecentTopics } from "@/lib/forum/queries";
import { sportLabels, type SportKey } from "@/lib/catalog/types";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { DeviceCard } from "@/components/catalog/device-card";
import { ArticleCard } from "@/components/content/article-card";
import { HeroVisual } from "@/components/home/hero-visual";
import { formatDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

const sportEntries: { key: SportKey; blurb: string }[] = [
  { key: "running", blurb: "Allures, zones, plans de course" },
  { key: "trail", blurb: "Atlas, dénivelé, navigation" },
  { key: "cyclisme", blurb: "Compteurs, capteurs, radar" },
  { key: "triathlon", blurb: "Multisport et eau libre" },
  { key: "natation", blurb: "Piscine et eau libre" },
  { key: "randonnee", blurb: "Cartes et longues autonomies" },
];

const tools = [
  { href: "/outils/inspecteur-gpx-tcx", icon: FileSearch, title: "Inspecteur GPX / TCX", text: "Points, champs, anomalies, tracé." },
  { href: "/outils/convertisseur-gpx-tcx", icon: Repeat, title: "Convertisseur GPX ↔ TCX", text: "Avec rapport des champs perdus." },
  { href: "/outils/confidentialite-gps", icon: EyeOff, title: "Confidentialité GPS", text: "Masquer départ et arrivée." },
  { href: "/outils/allure-vitesse-temps", icon: Timer, title: "Allure, vitesse et temps", text: "min/km, km/h, passages." },
  { href: "/outils/zones-frequence-cardiaque", icon: HeartPulse, title: "Zones de FC", text: "Trois méthodes, formules visibles." },
  { href: "/outils/strategie-de-course", icon: Flag, title: "Stratégie de course", text: "Régulier ou negative split." },
];

export default async function HomePage() {
  const [devices, news, guides, features, comparisons, topics] = await Promise.all([
    listPublishedDevices(),
    listPublishedArticles("news", 3),
    listPublishedArticles("guide", 3),
    listPublishedArticles("feature", 1),
    listPublishedArticles("comparison", 3),
    listRecentTopics(5).catch(() => []),
  ]);
  const featuredDevices = devices.slice(0, 3);

  return (
    <>
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-graphite-900 text-white">
        <div className="absolute inset-0 bg-topo opacity-80" aria-hidden />
        <div className="container-x relative grid min-h-[calc(100svh-var(--header-h))] items-center gap-10 py-16 lg:grid-cols-[1.1fr_1fr] lg:py-24">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-white/85 animate-fade">
              <ShieldCheck className="size-3.5 text-accent" aria-hidden />
              {site.independence.short}
            </p>
            <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl animate-rise">
              Tout l'univers Garmin.<br />
              <span className="text-accent">Une communauté au Maroc.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/75 animate-rise" style={{ animationDelay: "80ms" }}>
              Choisissez votre équipement, comprenez ses fonctionnalités et profitez d'outils utiles pour aller plus loin dans votre pratique.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 animate-rise" style={{ animationDelay: "160ms" }}>
              <ButtonLink href="/quel-garmin-choisir" size="lg">Trouver mon Garmin<ArrowRight className="size-4" aria-hidden /></ButtonLink>
              <ButtonLink href="/outils" size="lg" variant="inverse">Découvrir les outils</ButtonLink>
            </div>
            <ul className="mt-10 grid max-w-lg grid-cols-3 gap-4 text-sm text-white/70">
              <li><span className="block font-semibold text-white">Fiches sourcées</span>Données constructeur datées</li>
              <li><span className="block font-semibold text-white">Outils locaux</span>Vos fichiers restent chez vous</li>
              <li><span className="block font-semibold text-white">Forum en français</span>Entraide entre sportifs</li>
            </ul>
          </div>
          <HeroVisual />
        </div>
      </section>

      {/* 2. Entrées par sport */}
      <Section eyebrow="Par sport" title="Commencez par votre pratique" intro="Chaque sport a ses priorités : autonomie, navigation, natation, capteurs. Entrez par la vôtre.">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sportEntries.map((s, i) => (
            <li key={s.key} className={cn("reveal", i % 3 === 1 && "reveal-delay-1", i % 3 === 2 && "reveal-delay-2")}>
              <Link href={`/sport/${s.key}`} className="group flex items-center justify-between rounded-2xl border border-border bg-bg-elevated p-5 transition hover:-translate-y-0.5 hover:border-fg hover:shadow-md">
                <span>
                  <span className="block text-lg font-bold">{sportLabels[s.key]}</span>
                  <span className="text-sm text-fg-muted">{s.blurb}</span>
                </span>
                <ArrowRight className="size-5 text-fg-subtle transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* 3. Assistant de choix */}
      <Section tone="dark" eyebrow="Assistant" title="Quel Garmin choisir ? Une réponse expliquée, pas un score magique." intro="Sport, budget, niveau, priorité autonomie ou écran, taille, cartographie, options : neuf questions et jusqu'à trois propositions, chacune avec ses raisons et ses compromis." action={{ label: "Lancer l'assistant", href: "/quel-garmin-choisir" }}>
        <div className="grid gap-4 md:grid-cols-3">
          {["Des règles lisibles : chaque point attribué a une raison affichée.", "Des données vérifiées : une valeur inconnue reste « Non vérifié », jamais un défaut.", "Un lien vers les fiches et le comparateur pour aller plus loin."].map((t, i) => (
            <p key={t} className={cn("rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/80 reveal", i === 1 && "reveal-delay-1", i === 2 && "reveal-delay-2")}>{t}</p>
          ))}
        </div>
      </Section>

      {/* 4. Comparatifs sélectionnés / fiches */}
      <Section eyebrow="Équipements" title="Fiches vérifiées, différences réelles" intro="Données constructeur sourcées et datées, points forts, compromis, alternatives. Ajoutez des modèles au comparateur depuis chaque fiche." action={{ label: "Tout le catalogue", href: "/equipements" }}>
        {featuredDevices.length ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredDevices.map((d, i) => (
              <li key={d.slug} className={cn("reveal", i === 1 && "reveal-delay-1", i === 2 && "reveal-delay-2")}><DeviceCard device={d} className="h-full" /></li>
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl border border-dashed border-border-strong p-8 text-center text-fg-muted">Les premières fiches sont en cours de vérification à la source. Elles apparaîtront ici dès publication.</p>
        )}
        {comparisons.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-bold">Comparatifs éditoriaux</h3>
            <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {comparisons.map((a) => <li key={a.id}><ArticleCard article={a} showVisual={false} className="h-full" /></li>)}
            </ul>
          </div>
        )}
      </Section>

      {/* 5. Actualités */}
      <Section tone="muted" eyebrow="Actualités" title="Nouveautés vérifiées" intro="Chaque actualité indique son statut : annonce officielle, disponibilité, bêta, déploiement progressif ou rumeur." action={{ label: "Toutes les actualités", href: "/actualites" }}>
        {news.length ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((a, i) => <li key={a.id} className={cn("reveal", i === 1 && "reveal-delay-1", i === 2 && "reveal-delay-2")}><ArticleCard article={a} className="h-full" /></li>)}
          </ul>
        ) : (
          <p className="text-fg-muted">Aucune actualité publiée pour l'instant : nous ne publions qu'après vérification de la source.</p>
        )}
      </Section>

      {/* 6. Guides pour débutants */}
      <Section eyebrow="Bien débuter" title="Guides pour commencer du bon pied" intro="Régler sa montre, comprendre ses premiers indicateurs, préparer une sortie longue, importer un itinéraire." action={{ label: "Tous les guides", href: "/guides" }}>
        {guides.length ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((a, i) => <li key={a.id} className={cn("reveal", i === 1 && "reveal-delay-1", i === 2 && "reveal-delay-2")}><ArticleCard article={a} className="h-full" /></li>)}
          </ul>
        ) : (
          <p className="text-fg-muted">Les premiers guides sont en relecture.</p>
        )}
      </Section>

      {/* 7. Outils gratuits */}
      <Section tone="dark" id="outils" eyebrow="Outils gratuits" title="La suite d'outils Garmin.ma" intro="Traités dans votre navigateur : aucun fichier sportif n'est envoyé sur un serveur. Chaque outil précise ses formats, ses limites et ce qu'il fait de vos données." action={{ label: "Tous les outils", href: "/outils" }}>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t, i) => (
            <li key={t.href} className={cn("reveal", i % 3 === 1 && "reveal-delay-1", i % 3 === 2 && "reveal-delay-2")}>
              <Link href={t.href} className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-white/30 hover:bg-white/10">
                <t.icon className="size-6 text-accent" aria-hidden />
                <span className="mt-4 text-base font-bold">{t.title}</span>
                <span className="mt-1 text-sm text-white/65">{t.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* 8. Fonctionnalité expliquée */}
      {features.length > 0 && (
        <Section eyebrow="Fonctionnalité expliquée" title={features[0].title} intro={features[0].excerpt} action={{ label: "Toutes les fonctionnalités", href: "/fonctionnalites" }}>
          <ButtonLink href={`/fonctionnalites/${features[0].slug}`} variant="secondary">Lire l'explication</ButtonLink>
        </Section>
      )}

      {/* 9. Discussions récentes (uniquement si réelles) */}
      {topics.length > 0 && (
        <Section tone="muted" eyebrow="Forum" title="Discussions récentes" action={{ label: "Voir le forum", href: "/communaute" }}>
          <ul className="divide-y divide-border rounded-2xl border border-border bg-bg-elevated">
            {topics.map((t) => (
              <li key={t.id} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between">
                <Link href={`/communaute/sujet/${t.slug}`} className="font-medium hover:underline">{t.title}</Link>
                <span className="text-xs text-fg-subtle">{t.categoryName} · {t.replyCount} réponse{t.replyCount > 1 ? "s" : ""} · {formatDate(t.lastReplyAt ?? t.createdAt)}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* 10. Présentation de la communauté */}
      <Section eyebrow="La communauté" title="Indépendante, en français, ouverte à tous les sportifs du Maroc" intro={site.independence.long}>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/communaute">Rejoindre le forum</ButtonLink>
          <ButtonLink href="/a-propos" variant="secondary">Qui sommes-nous ?</ButtonLink>
          <ButtonLink href="/methodologie" variant="ghost">Notre méthodologie</ButtonLink>
        </div>
      </Section>
    </>
  );
}
