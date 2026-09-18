import Link from "next/link";
import { desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/client";
import { articles } from "@/lib/db/schema";
import { getCurrentUser, canEdit } from "@/lib/auth/session";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/format";
import { ButtonLink } from "@/components/ui/button";

export default async function AdminArticles() {
  const user = await getCurrentUser();
  if (!canEdit(user)) redirect("/admin");
  const list = await db.select({ id: articles.id, slug: articles.slug, type: articles.type, title: articles.title, status: articles.status, publishedAt: articles.publishedAt, updatedAt: articles.updatedAt }).from(articles).orderBy(desc(articles.updatedAt));
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Articles ({list.length})</h1>
        <ButtonLink href="/admin/articles/nouveau" size="sm">Nouvel article</ButtonLink>
      </div>
      <p className="mt-2 text-sm text-fg-muted">Workflow : brouillon → relecture → publié → archivé. Un article n'est visible publiquement qu'une fois publié.</p>
      <table className="mt-6 w-full text-sm">
        <thead className="text-left text-xs uppercase tracking-[0.12em] text-fg-subtle"><tr><th className="py-2">Titre</th><th className="py-2">Type</th><th className="py-2">Statut</th><th className="py-2">Publié</th><th className="py-2">Modifié</th></tr></thead>
        <tbody>
          {list.map((a) => (
            <tr key={a.id} className="border-t border-border">
              <td className="py-2"><Link href={`/admin/articles/${a.id}`} className="font-medium hover:underline">{a.title}</Link><span className="block text-xs text-fg-subtle">{a.slug}</span></td>
              <td className="py-2">{a.type}</td>
              <td className="py-2"><Badge tone={a.status === "published" ? "success" : a.status === "review" ? "warning" : "neutral"}>{a.status}</Badge></td>
              <td className="py-2">{formatDate(a.publishedAt)}</td>
              <td className="py-2">{formatDate(a.updatedAt)}</td>
            </tr>
          ))}
          {list.length === 0 && <tr><td colSpan={5} className="py-6 text-center text-fg-subtle">Aucun article.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
