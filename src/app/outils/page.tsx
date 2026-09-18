import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { tools, roadmapV2 } from "@/lib/tools/catalog";
import { PageHeader } from "@/components/ui/page-header";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = {
  title: "Outils gratuits pour fichiers GPX/TCX, allures et zones cardiaques",
  description: "Inspecteur et convertisseur GPX/TCX avec rapport de pertes, confidentialité GPS, calculateur d'allure, zones de fréquence cardiaque, stratégie de course. Tout fonctionne dans votre navigateur.",
  alternates: { canonical: "/outils" },
};

export default function ToolsPage() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Outils" }]} eyebrow="Suite d'outils" title="Outils gratuits Garmin.ma" intro="Chaque outil affiché comme disponible fonctionne réellement, précise ses formats, un exemple, ses limites et ce qu'il fait de vos données." tone="dark" />
      <div className="container-x py-12">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t, i) => (
            <li key={t.slug} className={cn("reveal", i % 3 === 1 && "reveal-delay-1", i % 3 === 2 && "reveal-delay-2")}>
              <Link href={`/outils/${t.slug}`} className="group flex h-full flex-col rounded-2xl border border-border bg-bg-elevated p-6 transition hover:-translate-y-0.5 hover:border-fg hover:shadow-md">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-strong dark:text-accent">Disponible</span>
                <span className="mt-2 text-xl font-bold">{t.title}</span>
                <span className="mt-2 text-sm text-fg-muted">{t.description}</span>
                <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold">Ouvrir<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden /></span>
              </Link>
            </li>
          ))}
        </ul>
        <section id="confidentialite" className="mt-14 rounded-2xl bg-bg-muted p-6 sm:p-8">
          <h2 className="inline-flex items-center gap-2 text-xl font-bold"><ShieldCheck className="size-5 text-accent" aria-hidden />Comment vos fichiers sont traités</h2>
          <ul className="mt-4 grid gap-3 text-sm text-fg-muted sm:grid-cols-2">
            <li>Traitement dans votre navigateur, dans un Web Worker pour ne pas bloquer la page.</li>
            <li>Aucun fichier sportif envoyé sur un serveur par défaut ; aucun contenu de fichier dans nos journaux.</li>
            <li>Limites : 25 Mo et 500 000 points par fichier. DOCTYPE et entités XML refusés (protection XXE).</li>
            <li>Le fichier original est conservé intact ; les outils produisent des copies.</li>
            <li>Les horodatages sont conservés tels quels (UTC) ; l'affichage local utilise Africa/Casablanca.</li>
            <li>L'aperçu cartographique est optionnel et contacte un fournisseur de tuiles externe uniquement si vous l'activez.</li>
          </ul>
          <p className="mt-4 text-sm text-fg-muted">Nous ne demandons jamais vos identifiants Garmin et nous ne supposons l'existence d'aucune API publique : toute intégration future utilisera des mécanismes autorisés et documentés.</p>
        </section>
        <section className="mt-10">
          <h2 className="text-xl font-bold">Roadmap V2</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-fg-muted">
            {roadmapV2.map((r) => <li key={r}>{r}</li>)}
          </ul>
          <p className="mt-3 text-sm text-fg-subtle">Ces outils ne sont pas promis à une date : ils seront publiés une fois leur faisabilité et leurs limites vérifiées.</p>
        </section>
      </div>
    </>
  );
}
