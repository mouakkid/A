import Link from "next/link";
import { sql, eq, desc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { articles, devices, forumTopics, reports, moderationLog, users } from "@/lib/db/schema";
import { formatDateTime } from "@/lib/utils/format";

export default async function AdminHome() {
  const [[dev], [art], [pend], [rep], log] = await Promise.all([
    db.select({ total: sql<number>`count(*)::int`, published: sql<number>`count(*) filter (where ${devices.status} = 'published')::int` }).from(devices),
    db.select({ total: sql<number>`count(*)::int`, review: sql<number>`count(*) filter (where ${articles.status} = 'review')::int`, published: sql<number>`count(*) filter (where ${articles.status} = 'published')::int` }).from(articles),
    db.select({ n: sql<number>`count(*)::int` }).from(forumTopics).where(eq(forumTopics.status, "pending")),
    db.select({ n: sql<number>`count(*)::int` }).from(reports).where(eq(reports.status, "open")),
    db.select({ id: moderationLog.id, action: moderationLog.action, targetType: moderationLog.targetType, targetId: moderationLog.targetId, note: moderationLog.note, createdAt: moderationLog.createdAt, actor: users.username }).from(moderationLog).leftJoin(users, eq(moderationLog.actorId, users.id)).orderBy(desc(moderationLog.createdAt)).limit(15),
  ]);
  const cards = [
    { href: "/admin/equipements", label: "Équipements", value: `${dev.published} publiés / ${dev.total}` },
    { href: "/admin/articles", label: "Articles", value: `${art.published} publiés · ${art.review} en relecture / ${art.total}` },
    { href: "/admin/moderation", label: "Sujets en attente", value: String(pend.n) },
    { href: "/admin/moderation", label: "Signalements ouverts", value: String(rep.n) },
  ];
  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold">Tableau de bord</h1>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <li key={c.label}><Link href={c.href} className="block rounded-2xl border border-border p-5 hover:border-fg"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-fg-subtle">{c.label}</p><p className="mt-1 font-display text-xl font-bold">{c.value}</p></Link></li>
        ))}
      </ul>
      <section>
        <h2 className="text-lg font-bold">Journal récent</h2>
        <ul className="mt-3 divide-y divide-border rounded-2xl border border-border text-sm">
          {log.map((l) => <li key={l.id} className="flex flex-wrap justify-between gap-2 p-3"><span><span className="font-medium">{l.actor ?? "système"}</span> · {l.action} · {l.targetType} #{l.targetId}{l.note && <span className="text-fg-subtle"> — {l.note}</span>}</span><span className="text-fg-subtle">{formatDateTime(l.createdAt)}</span></li>)}
          {log.length === 0 && <li className="p-3 text-fg-subtle">Aucune action journalisée.</li>}
        </ul>
      </section>
    </div>
  );
}
