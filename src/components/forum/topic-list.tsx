import Link from "next/link";
import { Pin, Lock, CheckCircle2 } from "lucide-react";
import type { TopicWithMeta } from "@/lib/forum/queries";
import { formatDate } from "@/lib/utils/format";

export function TopicList({ topics, emptyText }: { topics: TopicWithMeta[]; emptyText: string }) {
  if (!topics.length) return <p className="rounded-2xl border border-dashed border-border-strong p-8 text-center text-fg-muted">{emptyText}</p>;
  return (
    <ul className="divide-y divide-border rounded-2xl border border-border">
      {topics.map((t) => (
        <li key={t.id} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {t.pinned && <Pin className="size-3.5 text-accent" aria-label="Épinglé" />}
              {t.locked && <Lock className="size-3.5 text-fg-subtle" aria-label="Verrouillé" />}
              {t.acceptedReplyId && <CheckCircle2 className="size-3.5 text-success" aria-label="Réponse acceptée" />}
              <Link href={`/communaute/sujet/${t.slug}`} className="font-medium hover:underline">{t.title}</Link>
            </div>
            <p className="mt-0.5 text-xs text-fg-subtle">
              {t.categoryName} · par {t.authorName} · {formatDate(t.createdAt)}
              {t.deviceTags.length > 0 && <> · {t.deviceTags.map((d) => <Link key={d} href={`/equipements/${d}`} className="mr-1 underline">{d}</Link>)}</>}
            </p>
          </div>
          <p className="shrink-0 text-xs text-fg-subtle">{t.replyCount} réponse{t.replyCount > 1 ? "s" : ""}{t.lastReplyAt && ` · ${formatDate(t.lastReplyAt)}`}</p>
        </li>
      ))}
    </ul>
  );
}
