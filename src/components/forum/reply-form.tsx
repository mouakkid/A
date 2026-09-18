"use client";
import { useActionState, useEffect, useRef } from "react";
import { createReplyAction, type ForumState } from "@/lib/forum/actions";
import { Field, Textarea, FormError, FormSuccess, Honeypot } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { LIMITS } from "@/lib/forum/constants";

export function ReplyForm({ topicId }: { topicId: number }) {
  const [state, action, pending] = useActionState<ForumState, FormData>(createReplyAction, null);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.success) ref.current?.reset();
  }, [state]);
  return (
    <form ref={ref} action={action} className="relative space-y-4">
      <Honeypot />
      <input type="hidden" name="topicId" value={topicId} />
      <FormError message={state?.error} />
      <FormSuccess message={state?.success} />
      <Field label="Votre réponse" htmlFor="body" error={state?.fieldErrors?.body} hint="Précisez si vous parlez d'expérience ou d'après une lecture.">
        <Textarea id="body" name="body" required minLength={LIMITS.bodyMin} maxLength={LIMITS.bodyMax} rows={6} />
      </Field>
      <Button type="submit" disabled={pending}>{pending ? "Envoi…" : "Répondre"}</Button>
    </form>
  );
}
