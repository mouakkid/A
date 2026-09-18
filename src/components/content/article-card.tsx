import Link from "next/link";
import type { Article } from "@/lib/content/queries";
import { articlePath, typeMeta, newsStatusLabels, type ArticleType } from "@/lib/content/queries";
import { formatDate } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { PlaceholderVisual } from "@/components/ui/placeholder-visual";

export function ArticleCard({ article, showVisual = true, className }: { article: Article; showVisual?: boolean; className?: string }) {
  const meta = typeMeta[article.type as ArticleType];
  const themes = ["atlas", "littoral", "route", "piste"] as const;
  const theme = themes[article.id % themes.length];
  return (
    <article className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-bg-elevated transition hover:-translate-y-0.5 hover:shadow-md ${className ?? ""}`}>
      {showVisual && <PlaceholderVisual theme={theme} className="aspect-[16/9] w-full" />}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Badge tone="accent">{meta.label}</Badge>
          {article.newsStatus && <Badge tone={article.newsStatus === "rumeur" ? "warning" : "neutral"}>{newsStatusLabels[article.newsStatus]}</Badge>}
          {article.testedByUs && <Badge tone="success">Testé par la rédaction</Badge>}
        </div>
        <h3 className="text-lg font-bold leading-snug">
          <Link href={articlePath(article)} className="after:absolute after:inset-0 after:content-['']">{article.title}</Link>
        </h3>
        <p className="line-clamp-3 text-sm text-fg-muted">{article.excerpt}</p>
        <p className="mt-auto pt-2 text-xs text-fg-subtle">
          {article.byline} · {formatDate(article.publishedAt)}
          {article.significantUpdatedAt && ` · mis à jour le ${formatDate(article.significantUpdatedAt)}`}
        </p>
      </div>
    </article>
  );
}
