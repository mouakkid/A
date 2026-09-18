import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedArticle, listPublishedArticles, typeMeta, newsStatusLabels, articlePath, type ArticleType, type ArticleSource } from "@/lib/content/queries";
import { getDevicesBySlugs } from "@/lib/catalog/queries";
import { renderMarkdown, readingTimeMinutes } from "@/lib/content/markdown";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { ArticleJsonLd } from "@/components/seo/json-ld";
import { formatDate, isoDate } from "@/lib/utils/format";
import { DeviceCard } from "@/components/catalog/device-card";
import { ArticleCard } from "@/components/content/article-card";
import { sportLabels, type SportKey } from "@/lib/catalog/types";

export async function articleMetadata(type: ArticleType, slug: string): Promise<Metadata> {
  const a = await getPublishedArticle(type, slug);
  if (!a) return { title: "Article introuvable" };
  return {
    title: a.title,
    description: a.excerpt,
    alternates: { canonical: articlePath(a) },
    openGraph: { type: "article", title: a.title, description: a.excerpt, publishedTime: isoDate(a.publishedAt), modifiedTime: isoDate(a.significantUpdatedAt ?? a.publishedAt) },
  };
}

export async function ArticlePage({ type, slug }: { type: ArticleType; slug: string }) {
  const a = await getPublishedArticle(type, slug);
  if (!a) notFound();
  const meta = typeMeta[type];
  const [{ html, toc }, devices, related] = await Promise.all([renderMarkdown(a.bodyMd), getDevicesBySlugs(a.deviceSlugs), listPublishedArticles(type, 4)]);
  const sources = (a.sources as ArticleSource[]) ?? [];
  const others = related.filter((r) => r.id !== a.id).slice(0, 3);
  const path = articlePath(a);

  return (
    <>
      <ArticleJsonLd title={a.title} description={a.excerpt} url={path} publishedAt={isoDate(a.publishedAt)} updatedAt={isoDate(a.significantUpdatedAt ?? a.publishedAt)} byline={a.byline} type={meta.jsonLd} />
      <div className="border-b border-border bg-bg-muted bg-topo-dark">
        <div className="container-x py-8 sm:py-12">
          <Breadcrumbs items={[{ label: meta.plural, href: meta.path }, { label: a.title }]} />
          <div className="mt-6 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="accent">{meta.label}</Badge>
              {a.newsStatus && <Badge tone={a.newsStatus === "rumeur" ? "warning" : "neutral"}>{newsStatusLabels[a.newsStatus]}</Badge>}
              {a.testedByUs ? <Badge tone="success">Testé par la rédaction</Badge> : <Badge>Analyse documentaire, sans test réel</Badge>}
              {a.sports.map((s) => <Badge key={s}>{sportLabels[s as SportKey] ?? s}</Badge>)}
            </div>
            <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{a.title}</h1>
            <p className="mt-4 text-lg text-fg-muted">{a.excerpt}</p>
            <p className="mt-5 text-sm text-fg-subtle">
              Par <span className="font-medium text-fg">{a.byline}</span> · Publié le <time dateTime={isoDate(a.publishedAt)}>{formatDate(a.publishedAt)}</time>
              {a.significantUpdatedAt && <> · Mise à jour significative le <time dateTime={isoDate(a.significantUpdatedAt)}>{formatDate(a.significantUpdatedAt)}</time></>}
              {" · "}{readingTimeMinutes(a.bodyMd)} min de lecture
            </p>
          </div>
        </div>
      </div>

      <div className="container-x grid gap-12 py-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0">
          {toc.length >= 3 && (
            <nav aria-label="Sommaire" className="mb-8 rounded-2xl border border-border p-5 lg:hidden">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fg-subtle">Sommaire</p>
              <ol className="mt-3 space-y-1.5 text-sm">
                {toc.map((t) => (
                  <li key={t.id} className={t.level === 3 ? "pl-4" : ""}><a href={`#${t.id}`} className="hover:underline">{t.text}</a></li>
                ))}
              </ol>
            </nav>
          )}
          <div className="prose-editorial" dangerouslySetInnerHTML={{ __html: html }} />
          {sources.length > 0 && (
            <section className="mt-12 rounded-2xl border border-border p-6" aria-labelledby="sources">
              <h2 id="sources" className="text-lg font-bold">Sources</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} rel="noopener noreferrer nofollow" target="_blank" className="text-accent-strong underline dark:text-accent">{s.label}</a>
                    {s.accessedAt && <span className="text-fg-subtle"> — consulté le {formatDate(s.accessedAt)}</span>}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {devices.length > 0 && (
            <section className="mt-12" aria-labelledby="devices">
              <h2 id="devices" className="text-xl font-bold">Équipements cités</h2>
              <ul className="mt-5 grid gap-6 sm:grid-cols-2">
                {devices.map((d) => <li key={d.slug}><DeviceCard device={d} className="h-full" /></li>)}
              </ul>
            </section>
          )}
        </div>
        <aside className="space-y-6">
          {toc.length >= 3 && (
            <nav aria-label="Sommaire" className="sticky top-[calc(var(--header-h)+1rem)] hidden rounded-2xl border border-border p-5 lg:block">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fg-subtle">Sommaire</p>
              <ol className="mt-3 space-y-1.5 text-sm">
                {toc.map((t) => (
                  <li key={t.id} className={t.level === 3 ? "pl-4 text-fg-muted" : ""}><a href={`#${t.id}`} className="hover:underline">{t.text}</a></li>
                ))}
              </ol>
            </nav>
          )}
          {others.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fg-subtle">À lire aussi</p>
              <ul className="mt-3 space-y-4">
                {others.map((o) => <li key={o.id}><ArticleCard article={o} showVisual={false} /></li>)}
              </ul>
            </div>
          )}
          <div className="rounded-2xl bg-graphite-900 p-5 text-white bg-topo">
            <p className="font-semibold">Une précision, une erreur ?</p>
            <p className="mt-2 text-sm text-white/70">Nos contenus sont relus avant publication mais restent perfectibles. Signalez-nous toute correction.</p>
            <Link href="/contact" className="mt-3 inline-block text-sm font-semibold underline">Contacter la rédaction</Link>
          </div>
        </aside>
      </div>
    </>
  );
}
