import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { articles } from "@/lib/db/schema";
import { getCurrentUser, canEdit } from "@/lib/auth/session";
import { ArticleForm } from "@/components/admin/article-form";
import { transitionArticleAction } from "@/lib/admin/actions";
import { Badge } from "@/components/ui/badge";
import { articlePath } from "@/lib/content/queries";

export default async function AdminArticleEdit({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!canEdit(user)) redirect("/admin");
  const { id } = await params;
  if (id === "nouveau") {
    return (
      <div>
        <h1 className="text-2xl font-bold">Nouvel article</h1>
        <ArticleForm initial={{ id: 0, slug: "", type: "guide", title: "", excerpt: "", bodyMd: "", byline: "Rédaction Garmin.ma", newsStatus: "", tags: "", deviceSlugs: "", sports: "", sources: "[]", testedByUs: false, significantUpdatedAt: "" }} />
      </div>
    );
  }
  const [a] = await db.select().from(articles).where(eq(articles.id, Number(id))).limit(1);
  if (!a) notFound();
  const transitions: Record<string, { to: string; label: string }[]> = {
    draft: [{ to: "review", label: "Envoyer en relecture" }],
    review: [{ to: "published", label: "Valider et publier" }, { to: "draft", label: "Renvoyer en brouillon" }],
    published: [{ to: "archived", label: "Archiver" }, { to: "draft", label: "Dépublier (brouillon)" }],
    archived: [{ to: "draft", label: "Réouvrir en brouillon" }],
  };
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{a.title}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={a.status === "published" ? "success" : a.status === "review" ? "warning" : "neutral"}>{a.status}</Badge>
          {a.status === "published" && <Link href={articlePath(a)} className="text-sm underline">Voir en ligne</Link>}
          {transitions[a.status].map((t) => (
            <form key={t.to} action={transitionArticleAction}>
              <input type="hidden" name="id" value={a.id} />
              <input type="hidden" name="to" value={t.to} />
              <button type="submit" className="rounded-full border border-border px-3 py-1.5 text-sm font-medium hover:bg-bg-muted">{t.label}</button>
            </form>
          ))}
        </div>
      </div>
      {a.status === "review" && a.authorId === user!.id && <p className="mt-2 text-sm text-warning">Vous êtes l'auteur de cet article : idéalement, une autre personne valide la publication. L'auto-validation est journalisée.</p>}
      <ArticleForm initial={{ id: a.id, slug: a.slug, type: a.type, title: a.title, excerpt: a.excerpt, bodyMd: a.bodyMd, byline: a.byline, newsStatus: a.newsStatus ?? "", tags: a.tags.join(", "), deviceSlugs: a.deviceSlugs.join(", "), sports: a.sports.join(", "), sources: JSON.stringify(a.sources, null, 2), testedByUs: a.testedByUs, significantUpdatedAt: a.significantUpdatedAt ? a.significantUpdatedAt.toISOString().slice(0, 10) : "" }} />
    </div>
  );
}
