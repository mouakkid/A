import type { Metadata } from "next";
import Link from "next/link";
import { searchDevices } from "@/lib/catalog/queries";
import { searchArticles, articlePath, typeMeta, type ArticleType } from "@/lib/content/queries";
import { searchTopics } from "@/lib/forum/queries";
import { deviceDisplayName } from "@/lib/catalog/types";
import { PageHeader } from "@/components/ui/page-header";
import { Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Recherche", description: "Rechercher un équipement, un guide, une fonctionnalité ou une discussion sur Garmin.ma.", robots: { index: false, follow: true } };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.trim().slice(0, 100);
  const [devices, articles, topics] = query ? await Promise.all([searchDevices(query), searchArticles(query), searchTopics(query).catch(() => [])]) : [[], [], []];
  const total = devices.length + articles.length + topics.length;
  return (
    <>
      <PageHeader crumbs={[{ label: "Recherche" }]} eyebrow="Recherche" title={query ? `Résultats pour « ${query} »` : "Recherche"} intro="Équipements, guides, fonctionnalités, actualités et discussions du forum.">
        <form action="/recherche" method="get" className="mt-6 flex max-w-xl gap-2" role="search">
          <label htmlFor="q" className="sr-only">Rechercher</label>
          <Input id="q" name="q" defaultValue={query} placeholder="Ex. : Forerunner 265, zones cardiaques, GPX…" autoFocus={!query} />
          <Button type="submit">Rechercher</Button>
        </form>
      </PageHeader>
      <div className="container-x py-10">
        {!query ? (
          <p className="text-fg-muted">Saisissez un terme pour lancer la recherche. Raccourci clavier : « / » depuis n'importe quelle page.</p>
        ) : total === 0 ? (
          <div className="rounded-2xl border border-dashed border-border-strong p-10 text-center">
            <p className="text-lg font-semibold">Aucun résultat.</p>
            <p className="mt-2 text-fg-muted">Essayez un nom de modèle (« fēnix », « Edge »), une fonctionnalité (« VFC », « cartographie ») ou posez votre question sur le <Link href="/communaute" className="underline">forum</Link>.</p>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-3">
            <section aria-labelledby="r-dev">
              <h2 id="r-dev" className="text-lg font-bold">Équipements ({devices.length})</h2>
              <ul className="mt-3 divide-y divide-border rounded-2xl border border-border">
                {devices.map((d) => (
                  <li key={d.slug} className="p-3"><Link href={`/equipements/${d.slug}`} className="font-medium hover:underline">{deviceDisplayName(d)}</Link><span className="block text-xs text-fg-subtle">{d.family}</span></li>
                ))}
                {devices.length === 0 && <li className="p-3 text-sm text-fg-subtle">Aucun équipement.</li>}
              </ul>
            </section>
            <section aria-labelledby="r-art">
              <h2 id="r-art" className="text-lg font-bold">Articles ({articles.length})</h2>
              <ul className="mt-3 divide-y divide-border rounded-2xl border border-border">
                {articles.map((a) => (
                  <li key={a.id} className="p-3"><Badge tone="accent" className="mb-1">{typeMeta[a.type as ArticleType].label}</Badge><Link href={articlePath(a)} className="block font-medium hover:underline">{a.title}</Link></li>
                ))}
                {articles.length === 0 && <li className="p-3 text-sm text-fg-subtle">Aucun article.</li>}
              </ul>
            </section>
            <section aria-labelledby="r-top">
              <h2 id="r-top" className="text-lg font-bold">Forum ({topics.length})</h2>
              <ul className="mt-3 divide-y divide-border rounded-2xl border border-border">
                {topics.map((t) => (
                  <li key={t.id} className="p-3"><Link href={`/communaute/sujet/${t.slug}`} className="font-medium hover:underline">{t.title}</Link><span className="block text-xs text-fg-subtle">{t.categoryName}</span></li>
                ))}
                {topics.length === 0 && <li className="p-3 text-sm text-fg-subtle">Aucune discussion.</li>}
              </ul>
            </section>
          </div>
        )}
      </div>
    </>
  );
}
