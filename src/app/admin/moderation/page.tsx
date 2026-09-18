import Link from "next/link";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { reports, users, forumTopics, forumReplies } from "@/lib/db/schema";
import { getCurrentUser, canModerate } from "@/lib/auth/session";
import { listTopics } from "@/lib/forum/queries";
import { resolveReportAction, moderateTopicAction, moderateReplyAction, banUserAction } from "@/lib/forum/actions";
import { reportReasons } from "@/lib/forum/constants";
import { formatDateTime } from "@/lib/utils/format";

export default async function AdminModeration() {
  const user = await getCurrentUser();
  if (!canModerate(user)) redirect("/admin");
  const [pending, open] = await Promise.all([
    listTopics({ status: "pending", limit: 50 }),
    db.select({ id: reports.id, targetType: reports.targetType, targetId: reports.targetId, reason: reports.reason, details: reports.details, createdAt: reports.createdAt, reporter: users.username }).from(reports).leftJoin(users, eq(reports.reporterId, users.id)).where(eq(reports.status, "open")).orderBy(desc(reports.createdAt)).limit(100),
  ]);
  // Résolution des cibles pour afficher un extrait et l'auteur
  const targets = await Promise.all(
    open.map(async (r) => {
      if (r.targetType === "topic") {
        const [t] = await db.select({ title: forumTopics.title, slug: forumTopics.slug, authorId: forumTopics.authorId, status: forumTopics.status }).from(forumTopics).where(eq(forumTopics.id, r.targetId)).limit(1);
        return t ? { label: t.title, href: `/communaute/sujet/${t.slug}`, authorId: t.authorId, status: t.status } : null;
      }
      const [rp] = await db.select({ body: forumReplies.bodyMd, topicId: forumReplies.topicId, authorId: forumReplies.authorId, status: forumReplies.status }).from(forumReplies).where(eq(forumReplies.id, r.targetId)).limit(1);
      if (!rp) return null;
      const [t] = await db.select({ slug: forumTopics.slug }).from(forumTopics).where(eq(forumTopics.id, rp.topicId)).limit(1);
      return { label: rp.body.slice(0, 120), href: t ? `/communaute/sujet/${t.slug}#reponse-${r.targetId}` : "#", authorId: rp.authorId, status: rp.status };
    }),
  );
  const reasonLabel = (k: string) => reportReasons.find((r) => r.key === k)?.label ?? k;
  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-2xl font-bold">Sujets en attente ({pending.length})</h1>
        <p className="mt-1 text-sm text-fg-muted">Premiers sujets des comptes créés depuis moins de 24 h.</p>
        <ul className="mt-4 divide-y divide-border rounded-2xl border border-border">
          {pending.map((t) => (
            <li key={t.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div><Link href={`/communaute/sujet/${t.slug}`} className="font-medium hover:underline">{t.title}</Link><p className="text-xs text-fg-subtle">{t.categoryName} · {t.authorName} · {formatDateTime(t.createdAt)}</p></div>
              <div className="flex gap-2">
                {["approve", "hide", "delete"].map((a) => (
                  <form key={a} action={moderateTopicAction}><input type="hidden" name="topicId" value={t.id} /><input type="hidden" name="action" value={a} /><button className="rounded-full border border-border px-3 py-1 text-xs hover:bg-bg-muted">{a === "approve" ? "Publier" : a === "hide" ? "Masquer" : "Supprimer"}</button></form>
                ))}
              </div>
            </li>
          ))}
          {pending.length === 0 && <li className="p-4 text-sm text-fg-subtle">Rien en attente.</li>}
        </ul>
      </section>
      <section>
        <h2 className="text-2xl font-bold">Signalements ouverts ({open.length})</h2>
        <ul className="mt-4 divide-y divide-border rounded-2xl border border-border">
          {open.map((r, i) => {
            const tg = targets[i];
            return (
              <li key={r.id} className="space-y-3 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm"><span className="font-semibold">{reasonLabel(r.reason)}</span> · {r.targetType} #{r.targetId} · signalé par {r.reporter ?? "?"} · {formatDateTime(r.createdAt)}</p>
                    {r.details && <p className="mt-1 text-sm text-fg-muted">« {r.details} »</p>}
                    {tg ? <p className="mt-1 text-sm"><Link href={tg.href} className="underline">{tg.label}</Link> <span className="text-xs text-fg-subtle">({tg.status})</span></p> : <p className="mt-1 text-sm text-fg-subtle">Contenu introuvable.</p>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tg && tg.status === "published" && (
                    <form action={r.targetType === "topic" ? moderateTopicAction : moderateReplyAction}><input type="hidden" name={r.targetType === "topic" ? "topicId" : "replyId"} value={r.targetId} /><input type="hidden" name="action" value="hide" /><button className="rounded-full border border-border px-3 py-1 text-xs hover:bg-bg-muted">Masquer le contenu</button></form>
                  )}
                  {tg && (
                    <form action={banUserAction}><input type="hidden" name="userId" value={tg.authorId} /><input type="hidden" name="action" value="ban" /><button className="rounded-full border border-red-200 px-3 py-1 text-xs text-danger hover:bg-red-50">Suspendre l'auteur</button></form>
                  )}
                  <form action={resolveReportAction} className="flex flex-wrap items-center gap-2">
                    <input type="hidden" name="reportId" value={r.id} />
                    <input name="note" placeholder="Note (facultatif)" className="h-8 rounded border border-border bg-bg px-2 text-xs" maxLength={300} />
                    <button name="status" value="resolved" className="rounded-full bg-fg px-3 py-1 text-xs text-bg">Résolu</button>
                    <button name="status" value="dismissed" className="rounded-full border border-border px-3 py-1 text-xs hover:bg-bg-muted">Sans suite</button>
                  </form>
                </div>
              </li>
            );
          })}
          {open.length === 0 && <li className="p-4 text-sm text-fg-subtle">Aucun signalement ouvert.</li>}
        </ul>
      </section>
    </div>
  );
}
