import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[60vh] flex-col items-start justify-center py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-strong dark:text-accent">Erreur 404</p>
      <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Cette page n'existe pas.</h1>
      <p className="mt-4 max-w-xl text-lg text-fg-muted">Le lien est peut-être périmé, ou la page a été déplacée. Les fiches et articles conservent des adresses stables ; si vous pensez qu'il s'agit d'une erreur, dites-le-nous.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/">Retour à l'accueil</ButtonLink>
        <ButtonLink href="/recherche" variant="secondary">Rechercher</ButtonLink>
        <Link href="/contact" className="inline-flex h-11 items-center px-3 text-sm font-medium underline-offset-4 hover:underline">Signaler un lien cassé</Link>
      </div>
    </div>
  );
}
