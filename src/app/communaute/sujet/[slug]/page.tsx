import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Lock } from "lucide-react";
import { getTopicBySlug, listReplies } from "@/lib/forum/queries";
import { getCurrentUser, canModerate } from "@/lib/auth/session";
import { renderMarkdown } from "@/lib/content/markdown";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { ReplyForm } from "@/components/forum/reply-form";
import { ReportButton } from "@/components/forum/report-button";
import { ModerationBar } from "@/components/forum/moderation-bar";
import { acceptReplyAction } from "@/lib/forum/actions";
import { formatDateTime, isoDate } from "@/lib/utils/format";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTopicBySlug(slug);
  if (!t || t.status !== "published") return { title: "Sujet introuvable", robots: { index: false } };
  // Indexation uniquement des discussions publiques avec au moins une réponse (contenu suffisant).
  return { title: `${t.title} — forum`, description: t.bodyMd.slice(0, 160), alternates: { canonical: `/communaute/sujet/${t.slug}` }, robots: t.replyCount >= 1 ? { index: true, follow: true } : { index: false, follow: true } };
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [t, user] = await Promise.all([getTopicBySlug(slug), getCurrentUser()]);
  if (!t) notFound();
  const mod = canModerate(user);
  const isAuthor = user?.id === t.authorId;
  if (t.status !== "published" && !mod && !isAuthor) notFound();
  const [replies, body] = await Promise.all([listReplies(t.id, mod), renderMarkdown(t.bodyMd)]);
  const rendered = await Promise.all(replies.map((r) => renderMarkdown(r.bodyMd)));
  const accepted = replies.find((r) => r.id === t.acceptedReplyId);

  return (
    <div className="container-x py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Communauté", href: "/communaute" }, { label: t.categoryName, href: `/communaute/categorie/${t.categorySlug}` }, { label: t.title }]} />
      {t.status !== "published" && (
        <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          Ce sujet est {t.status === "pending" ? "en attente de relecture par la modération" : t.status === "hidden" ? "masqué" : "supprimé"} : il n'est visible que par vous et la modération.
        </p>
      )}
      <article className="mt-6 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          {t.locked && <Badge tone="neutral"><Lock className="size-3" aria-hidden />Verrouillé</Badge>}
          {t.acceptedReplyId && <Badge tone="success"><CheckCircle2 className="size-3" aria-hidden />Réponse acceptée</Badge>}
          {t.deviceTags.map((d) => <Link key={d} href={`/equipements/${d}`}><Badge tone="accent">{d}</Badge></Link>)}
        </div>
        <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">{t.title}</h1>
        <p className="mt-2 text-sm text-fg-subtle">Par <span className="font-medium text-fg">{t.authorName}</span> · <time dateTime={isoDate(t.createdAt)}>{formatDateTime(t.createdAt)}</time></p>
        <div className="prose-editorial mt-6" dangerouslySetInnerHTML={{ __html: body.html }} />
        <div className="mt-4 flex items-center justify-end gap-4">
          <ReportButton targetType="topic" targetId={t.id} canReport={Boolean(user) && !isAuthor} />
        </div>
        {mod && <ModerationBar kind="topic" id={t.id} status={t.status} locked={t.locked} pinned={t.pinned} />}
      </article>

      {accepted && (
        <section className="mt-10 max-w-3xl rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-900 dark:bg-emerald-950/40" aria-labelledby="accepted">
          <h2 id="accepted" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 dark:text-emerald-300"><CheckCircle2 className="size-4" aria-hidden />Réponse acceptée par l'auteur</h2>
          <div className="prose-editorial mt-3" dangerouslySetInnerHTML={{ __html: rendered[replies.indexOf(accepted)].html }} />
          <p className="mt-2 text-xs text-fg-subtle">Par {accepted.authorName}</p>
        </section>
      )}

      <section className="mt-10 max-w-3xl" aria-labelledby="replies">
        <h2 id="replies" className="text-xl font-bold">{replies.filter((r) => r.status === "published").length} réponse{replies.length > 1 ? "s" : ""}</h2>
        {replies.length === 0 && <p className="mt-3 text-fg-muted">Pas encore de réponse. Si vous connaissez la réponse, partagez-la.</p>}
        <ol className="mt-5 space-y-5">
          {replies.map((r, i) => (
            <li key={r.id} id={`reponse-${r.id}`} className={`rounded-2xl border p-5 ${r.status !== "published" ? "border-dashed border-amber-300 opacity-80" : r.id === t.acceptedReplyId ? "border-emerald-300" : "border-border"}`}>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-fg-subtle">
                <span><span className="font-medium text-fg">{r.authorName}</span>{r.authorRole !== "member" && <Badge className="ml-2">{r.authorRole}</Badge>} · <time dateTime={isoDate(r.createdAt)}>{formatDateTime(r.createdAt)}</time>{r.status !== "published" && ` · ${r.status}`}</span>
                <div className="flex items-center gap-3">
                  {(isAuthor || mod) && r.status === "published" && (
                    <form action={acceptReplyAction}>
                      <input type="hidden" name="topicId" value={t.id} />
                      <input type="hidden" name="replyId" value={r.id} />
                      <button type="submit" className="text-xs font-medium text-success hover:underline">{r.id === t.acceptedReplyId ? "Retirer l'acceptation" : "Marquer comme réponse acceptée"}</button>
                    </form>
                  )}
                  <ReportButton targetType="reply" targetId={r.id} canReport={Boolean(user) && user?.id !== r.authorId} />
                </div>
              </div>
              <div className="prose-editorial mt-3" dangerouslySetInnerHTML={{ __html: rendered[i].html }} />
              {mod && <ModerationBar kind="reply" id={r.id} status={r.status} />}
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10 max-w-3xl" aria-labelledby="reply">
        <h2 id="reply" className="text-xl font-bold">Répondre</h2>
        {!user ? (
          <p className="mt-3 text-fg-muted"><Link href={`/connexion?next=/communaute/sujet/${t.slug}`} className="underline">Connectez-vous</Link> ou <Link href="/inscription" className="underline">créez un compte</Link> pour répondre.</p>
        ) : t.locked && !mod ? (
          <p className="mt-3 text-fg-muted">Ce sujet est verrouillé.</p>
        ) : t.status !== "published" ? (
          <p className="mt-3 text-fg-muted">Les réponses seront possibles une fois le sujet publié.</p>
        ) : (
          <div className="mt-4"><ReplyForm topicId={t.id} /></div>
        )}
      </section>
    </div>
  );
}
