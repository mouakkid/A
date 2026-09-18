"use client";
import { useActionState } from "react";
import Link from "next/link";
import { createTopicAction, type ForumState } from "@/lib/forum/actions";
import { Field, Input, Textarea, Select, FormError, Honeypot } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { LIMITS } from "@/lib/forum/constants";

export function TopicForm({ categories, defaultCategoryId, defaultTag }: { categories: { id: number; name: string }[]; defaultCategoryId?: number; defaultTag?: string }) {
  const [state, action, pending] = useActionState<ForumState, FormData>(createTopicAction, null);
  const fe = state?.fieldErrors ?? {};
  return (
    <form action={action} className="relative space-y-5">
      <Honeypot />
      <FormError message={state?.error} />
      <Field label="Catégorie" htmlFor="categoryId" error={fe.categoryId}>
        <Select id="categoryId" name="categoryId" defaultValue={defaultCategoryId ?? categories[0]?.id} required>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Select>
      </Field>
      <Field label="Titre" htmlFor="title" hint={`${LIMITS.topicTitleMin} à ${LIMITS.topicTitleMax} caractères. Une question précise obtient de meilleures réponses.`} error={fe.title}>
        <Input id="title" name="title" required minLength={LIMITS.topicTitleMin} maxLength={LIMITS.topicTitleMax} aria-invalid={Boolean(fe.title)} />
      </Field>
      <Field label="Message" htmlFor="body" hint="Markdown simple accepté (listes, gras, liens). Pas de coordonnées GPS précises." error={fe.body}>
        <Textarea id="body" name="body" required minLength={LIMITS.bodyMin} maxLength={LIMITS.bodyMax} rows={10} aria-invalid={Boolean(fe.body)} />
      </Field>
      <Field label="Équipements concernés (facultatif)" htmlFor="deviceTags" hint="Slugs séparés par des virgules, ex. forerunner-265, edge-540. Jusqu'à 5.">
        <Input id="deviceTags" name="deviceTags" defaultValue={defaultTag ?? ""} maxLength={200} />
      </Field>
      <p className="text-xs text-fg-subtle">Pièces jointes désactivées pour l'instant. Les premiers sujets d'un compte créé il y a moins de 24 h passent en relecture avant publication. En publiant, vous acceptez les <Link href="/regles-communautaires" className="underline">règles communautaires</Link>.</p>
      <Button type="submit" disabled={pending}>{pending ? "Publication…" : "Publier le sujet"}</Button>
    </form>
  );
}
