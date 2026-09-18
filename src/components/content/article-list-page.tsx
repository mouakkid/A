import { listPublishedArticles, typeMeta, type ArticleType } from "@/lib/content/queries";
import { PageHeader } from "@/components/ui/page-header";
import { ArticleCard } from "@/components/content/article-card";
import { cn } from "@/lib/utils/cn";

export async function ArticleListPage({ type, title, intro, emptyText }: { type: ArticleType; title: string; intro: string; emptyText: string }) {
  const list = await listPublishedArticles(type);
  const meta = typeMeta[type];
  return (
    <>
      <PageHeader crumbs={[{ label: meta.plural }]} eyebrow={meta.plural} title={title} intro={intro} />
      <div className="container-x py-10">
        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border-strong p-10 text-center">
            <p className="text-lg font-semibold">Rien de publié pour l'instant.</p>
            <p className="mt-2 text-fg-muted">{emptyText}</p>
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((a, i) => (
              <li key={a.id} className={cn("reveal", i % 3 === 1 && "reveal-delay-1", i % 3 === 2 && "reveal-delay-2")}>
                <ArticleCard article={a} className="h-full" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
