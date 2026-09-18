import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { listCategories, listRecentTopics } from "@/lib/forum/queries";
import { getCurrentUser } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/format";
import { isDatabaseConfigured } from "@/lib/db/client";

export const metadata: Metadata = {
  title: "Communauté et forum",
  description: "Le forum d'entraide des utilisateurs Garmin au Maroc : bien débuter, choisir son équipement, running, trail, cyclisme, natation et triathlon, synchronisation, parcours et navigation.",
  alternates: { canonical: "/communaute" },
};

export default async function CommunityPage() {
  const [categories, recent, user] = await Promise.all([listCategories().catch(() => []), listRecentTopics(8).catch(() => []), getCurrentUser()]);
  return (
    <>
      <PageHeader crumbs={[{ label: "Communauté" }]} eyebrow="Forum" title="Communauté Garmin.ma" intro="Un forum en français, indépendant, pour s'entraider entre sportifs du Maroc. Posez une question précise, marquez la réponse qui vous a aidé." tone="dark">
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href={user ? "/communaute/nouveau" : "/connexion?next=/communaute/nouveau"} variant="inverse">Ouvrir un sujet</ButtonLink>
          <ButtonLink href="/regles-communautaires" variant="ghost" className="text-white hover:bg-white/10">Règles communautaires</ButtonLink>
        </div>
      </PageHeader>
      <div className="container-x grid gap-12 py-12 lg:grid-cols-[1fr_22rem]">
        <section aria-labelledby="cats">
          <h2 id="cats" className="text-2xl font-bold">Catégories</h2>
          {!isDatabaseConfigured() ? (
            <p className="mt-4 rounded-xl border border-dashed border-border-strong p-6 text-fg-muted">Le forum n'est pas disponible : aucune base de données n'est configurée sur cet environnement.</p>
          ) : (
            <ul className="mt-5 divide-y divide-border rounded-2xl border border-border">
              {categories.map((c) => (
                <li key={c.id} className="flex items-start gap-4 p-5">
                  <MessageSquare className="mt-1 size-5 shrink-0 text-accent" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold"><Link href={`/communaute/categorie/${c.slug}`} className="hover:underline">{c.name}</Link></h3>
                    <p className="mt-1 text-sm text-fg-muted">{c.description}</p>
                  </div>
                  <div className="hidden shrink-0 text-right text-xs text-fg-subtle sm:block">
                    <p>{c.topicCount} sujet{c.topicCount > 1 ? "s" : ""}</p>
                    {c.lastActivity && <p>Dernière activité : {formatDate(c.lastActivity)}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
        <aside>
          <h2 className="text-lg font-bold">Discussions récentes</h2>
          {recent.length ? (
            <ul className="mt-4 space-y-3">
              {recent.map((t) => (
                <li key={t.id} className="rounded-xl border border-border p-3">
                  <Link href={`/communaute/sujet/${t.slug}`} className="text-sm font-medium hover:underline">{t.title}</Link>
                  <p className="mt-1 text-xs text-fg-subtle">{t.categoryName} · {t.authorName} · {t.replyCount} réponse{t.replyCount > 1 ? "s" : ""}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 rounded-xl border border-dashed border-border-strong p-4 text-sm text-fg-muted">Aucune discussion pour l'instant. Le forum vient d'ouvrir : soyez la première personne à poser une question.</p>
          )}
        </aside>
      </div>
    </>
  );
}
