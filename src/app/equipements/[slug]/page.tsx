import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { getDeviceBySlug, getDevicesBySlugs } from "@/lib/catalog/queries";
import { listArticlesForDevice, articlePath } from "@/lib/content/queries";
import { deviceDisplayName, categoryLabels, sportLabels } from "@/lib/catalog/types";
import { buildComparison } from "@/lib/catalog/compare";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Badge, ProvenanceBadge } from "@/components/ui/badge";
import { SpecValue } from "@/components/catalog/spec-value";
import { CompareToggle } from "@/components/compare/compare-toggle";
import { PlaceholderVisual } from "@/components/ui/placeholder-visual";
import { DeviceCard } from "@/components/catalog/device-card";
import { formatDate } from "@/lib/utils/format";
import { ButtonLink } from "@/components/ui/button";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = await getDeviceBySlug(slug);
  if (!d) return { title: "Équipement introuvable" };
  const name = deviceDisplayName(d);
  return {
    title: `${name} : fiche, caractéristiques vérifiées, limites et alternatives`,
    description: `${name} (${categoryLabels[d.category]}) : positionnement, points forts, compromis, autonomie, GNSS, capteurs et sources officielles. ${d.editorial.positioning}`.slice(0, 300),
    alternates: { canonical: `/equipements/${d.slug}` },
  };
}

export default async function DevicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = await getDeviceBySlug(slug);
  if (!d) notFound();
  const name = deviceDisplayName(d);
  const [alternatives, articles] = await Promise.all([getDevicesBySlugs(d.editorial.alternatives), listArticlesForDevice(d.slug)]);
  const groups = buildComparison([d]);
  const themeByCategory = { "montre-running": "littoral", "montre-multisport": "atlas", outdoor: "piste", "bien-etre-fitness": "route", "compteur-velo": "route", "capteur-accessoire": "graphite" } as const;

  return (
    <>
      <div className="border-b border-border bg-bg-muted bg-topo-dark">
        <div className="container-x py-8 sm:py-12">
          <Breadcrumbs items={[{ label: "Équipements", href: "/equipements" }, { label: categoryLabels[d.category], href: `/equipements?categorie=${d.category}` }, { label: name }]} />
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-strong dark:text-accent">{d.family} · {categoryLabels[d.category]}</p>
              <h1 className="mt-2 text-4xl font-bold leading-tight sm:text-5xl">{name}</h1>
              {d.editorial.positioning && <p className="mt-4 max-w-xl text-lg text-fg-muted">{d.editorial.positioning}</p>}
              <div className="mt-5 flex flex-wrap gap-1.5">
                {d.editorial.sports.map((s) => (
                  <Badge key={s} tone="accent">{sportLabels[s]}</Badge>
                ))}
                {d.editorial.profiles.map((p) => (
                  <Badge key={p}>{p}</Badge>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <CompareToggle slug={d.slug} name={name} size="md" />
                <ButtonLink href="/quel-garmin-choisir" variant="secondary">Est-ce le bon choix pour moi ?</ButtonLink>
                {d.officialUrl && (
                  <a href={d.officialUrl} rel="noopener noreferrer nofollow" target="_blank" className="inline-flex items-center gap-1 text-sm font-medium text-fg-muted underline-offset-4 hover:underline">
                    Fiche officielle Garmin <ExternalLink className="size-3.5" aria-hidden />
                  </a>
                )}
              </div>
              <p className="mt-4 text-xs text-fg-subtle">Dernière vérification des données constructeur : {formatDate(d.lastVerifiedAt)}.</p>
            </div>
            <PlaceholderVisual theme={themeByCategory[d.category]} className="aspect-[4/3] w-full rounded-2xl" label="Visuel provisoire — photo produit à fournir" />
          </div>
        </div>
      </div>

      <div className="container-x grid gap-12 py-12 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-12">
          <section aria-labelledby="edito">
            <div className="flex items-center gap-3">
              <h2 id="edito" className="text-2xl font-bold">Points forts et compromis</h2>
              <ProvenanceBadge kind="editorial" />
            </div>
            <div className="mt-5 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-border p-5">
                <h3 className="font-semibold">Points forts</h3>
                {d.editorial.strengths.length ? (
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-fg-muted">
                    {d.editorial.strengths.map((s) => <li key={s}>{s}</li>)}
                  </ul>
                ) : <p className="mt-2 text-sm text-fg-subtle">En cours de rédaction.</p>}
              </div>
              <div className="rounded-2xl border border-border p-5">
                <h3 className="font-semibold">Limites et compromis</h3>
                {d.editorial.limits.length ? (
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-fg-muted">
                    {d.editorial.limits.map((s) => <li key={s}>{s}</li>)}
                  </ul>
                ) : <p className="mt-2 text-sm text-fg-subtle">En cours de rédaction.</p>}
              </div>
            </div>
          </section>

          <section aria-labelledby="obs">
            <div className="flex items-center gap-3">
              <h2 id="obs" className="text-2xl font-bold">Observations documentées</h2>
              <ProvenanceBadge kind="observed" />
            </div>
            {d.editorial.observations.length ? (
              <ul className="mt-4 space-y-3">
                {d.editorial.observations.map((o) => (
                  <li key={o.text} className="rounded-xl border border-border p-4 text-sm">
                    {o.text} <span className="text-fg-subtle">— {o.source}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 rounded-xl border border-dashed border-border-strong p-4 text-sm text-fg-muted">Aucun test réel de cet appareil n'a été réalisé par la rédaction à ce jour. Nous ne publions pas d'observation sans test.</p>
            )}
          </section>

          <section aria-labelledby="specs">
            <div className="flex flex-wrap items-center gap-3">
              <h2 id="specs" className="text-2xl font-bold">Caractéristiques</h2>
              <ProvenanceBadge kind="manufacturer" />
            </div>
            <p className="mt-2 text-sm text-fg-muted">Telles que lues sur la fiche officielle. « Non vérifié » signifie que nous n'avons pas trouvé l'information, pas que la fonction est absente.</p>
            <div className="mt-6 space-y-8">
              {groups.map((g) => (
                <div key={g.key}>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-fg-subtle">{g.title}</h3>
                  <dl className="mt-3 divide-y divide-border rounded-2xl border border-border">
                    {g.rows.map((r) => (
                      <div key={r.key} className="grid gap-1 px-4 py-3 sm:grid-cols-[14rem_1fr] sm:gap-4">
                        <dt className="text-sm text-fg-muted">{r.label}{r.hint && <span className="block text-xs text-fg-subtle">{r.hint}</span>}</dt>
                        <dd className="text-sm"><SpecValue cell={r.cells[0]} /></dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
            {d.spec.rawNotes && (
              <details className="mt-4 rounded-xl border border-border p-4 text-sm text-fg-muted">
                <summary className="cursor-pointer font-medium text-fg">Notes de collecte (texte brut de la fiche officielle)</summary>
                <p className="mt-2 whitespace-pre-line">{d.spec.rawNotes}</p>
              </details>
            )}
          </section>

          {alternatives.length > 0 && (
            <section aria-labelledby="alt">
              <h2 id="alt" className="text-2xl font-bold">Alternatives à considérer</h2>
              <ul className="mt-5 grid gap-6 sm:grid-cols-2">
                {alternatives.map((a) => (
                  <li key={a.slug}><DeviceCard device={a} className="h-full" /></li>
                ))}
              </ul>
              <p className="mt-4 text-sm">
                <Link href={`/comparer?m=${[d.slug, ...alternatives.map((a) => a.slug)].slice(0, 4).join(",")}`} className="font-semibold text-accent-strong underline dark:text-accent">Comparer {name} avec ces alternatives</Link>
              </p>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-border p-5">
            <h2 className="font-semibold">Sources</h2>
            {d.sources.length ? (
              <ul className="mt-3 space-y-2 text-sm">
                {d.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} rel="noopener noreferrer nofollow" target="_blank" className="text-accent-strong underline dark:text-accent">{s.label}</a>
                    {s.accessedAt && <span className="block text-xs text-fg-subtle">Consulté le {formatDate(s.accessedAt)}</span>}
                  </li>
                ))}
              </ul>
            ) : <p className="mt-2 text-sm text-fg-subtle">Aucune source enregistrée.</p>}
          </div>
          <div className="rounded-2xl border border-border p-5">
            <h2 className="font-semibold">Guides associés</h2>
            {articles.length ? (
              <ul className="mt-3 space-y-2 text-sm">
                {articles.map((a) => (
                  <li key={a.id}><Link href={articlePath(a)} className="underline-offset-4 hover:underline">{a.title}</Link></li>
                ))}
              </ul>
            ) : <p className="mt-2 text-sm text-fg-subtle">Aucun guide ne cite encore ce modèle.</p>}
            <Link href="/guides" className="mt-3 block text-sm font-medium text-accent-strong dark:text-accent">Tous les guides</Link>
          </div>
          <div className="rounded-2xl bg-graphite-900 p-5 text-white bg-topo">
            <h2 className="font-semibold">Une question sur ce modèle ?</h2>
            <p className="mt-2 text-sm text-white/70">Le forum est ouvert : d'autres utilisateurs au Maroc pourront répondre.</p>
            <Link href={`/communaute/nouveau?tag=${d.slug}`} className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-graphite-900">Poser une question</Link>
          </div>
        </aside>
      </div>
    </>
  );
}
