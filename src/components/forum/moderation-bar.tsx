import { moderateTopicAction, moderateReplyAction } from "@/lib/forum/actions";

/** Actions de modération (visibles uniquement par les modérateurs). Chaque action est journalisée côté serveur. */
export function ModerationBar({ kind, id, status, locked, pinned }: { kind: "topic" | "reply"; id: number; status: string; locked?: boolean; pinned?: boolean }) {
  const action = kind === "topic" ? moderateTopicAction : moderateReplyAction;
  const field = kind === "topic" ? "topicId" : "replyId";
  const buttons: { a: string; label: string }[] = [];
  if (status !== "published") buttons.push({ a: "approve", label: "Publier" });
  if (status !== "hidden") buttons.push({ a: "hide", label: "Masquer" });
  if (status !== "deleted") buttons.push({ a: "delete", label: "Supprimer" });
  if (kind === "topic") {
    buttons.push(locked ? { a: "unlock", label: "Déverrouiller" } : { a: "lock", label: "Verrouiller" });
    buttons.push(pinned ? { a: "unpin", label: "Désépingler" } : { a: "pin", label: "Épingler" });
  }
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-border-strong p-2 text-xs">
      <span className="font-semibold text-fg-subtle">Modération :</span>
      {buttons.map((b) => (
        <form key={b.a} action={action}>
          <input type="hidden" name={field} value={id} />
          <input type="hidden" name="action" value={b.a} />
          <button type="submit" className="rounded-full border border-border px-2.5 py-1 hover:bg-bg-muted">{b.label}</button>
        </form>
      ))}
    </div>
  );
}
