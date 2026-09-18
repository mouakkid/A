"use client";
import { useActionState, useState } from "react";
import { Flag } from "lucide-react";
import { reportAction, type ForumState } from "@/lib/forum/actions";
import { reportReasons } from "@/lib/forum/constants";
import { Select, Textarea, FormError, FormSuccess } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export function ReportButton({ targetType, targetId, canReport }: { targetType: "topic" | "reply"; targetId: number; canReport: boolean }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<ForumState, FormData>(reportAction, null);
  if (!canReport) return null;
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="inline-flex items-center gap-1 text-xs text-fg-subtle hover:text-fg">
        <Flag className="size-3.5" aria-hidden />Signaler
      </button>
      {open && (
        <form action={action} className="absolute right-0 z-20 mt-2 w-72 space-y-3 rounded-2xl border border-border bg-bg-elevated p-4 shadow-lg animate-fade">
          <input type="hidden" name="targetType" value={targetType} />
          <input type="hidden" name="targetId" value={targetId} />
          <FormError message={state?.error} />
          <FormSuccess message={state?.success} />
          {!state?.success && (
            <>
              <label htmlFor={`reason-${targetType}-${targetId}`} className="text-sm font-medium">Motif</label>
              <Select id={`reason-${targetType}-${targetId}`} name="reason" defaultValue="spam">
                {reportReasons.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
              </Select>
              <Textarea name="details" placeholder="Précisions (facultatif)" maxLength={500} className="min-h-20" />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>Annuler</Button>
                <Button type="submit" size="sm" disabled={pending}>Envoyer</Button>
              </div>
            </>
          )}
        </form>
      )}
    </div>
  );
}
