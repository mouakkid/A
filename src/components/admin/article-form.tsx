"use client";
import { useActionState } from "react";
import { saveArticleAction, type AdminState } from "@/lib/admin/actions";
import { Field, Input, Select, Textarea, FormError, FormSuccess } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

type Initial = { id: number; slug: string; type: string; title: string; excerpt: string; bodyMd: string; byline: string; newsStatus: string; tags: string; deviceSlugs: string; sports: string; sources: string; testedByUs: boolean; significantUpdatedAt: string };

export function ArticleForm({ initial }: { initial: Initial }) {
  const [state, action, pending] = useActionState<AdminState, FormData>(saveArticleAction, null);
  return (
    <form action={action} className="mt-6 space-y-5">
      <input type="hidden" name="id" value={initial.id} />
      <FormError message={state?.error} />
      <FormSuccess message={state?.success} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Titre" htmlFor="title" className="lg:col-span-2"><Input id="title" name="title" defaultValue={initial.title} required /></Field>
        <Field label="Slug" htmlFor="slug"><Input id="slug" name="slug" defaultValue={initial.slug} required pattern="[a-z0-9-]+" /></Field>
        <Field label="Type" htmlFor="type"><Select id="type" name="type" defaultValue={initial.type}><option value="news">Actualité</option><option value="guide">Guide</option><option value="feature">Fonctionnalité expliquée</option><option value="comparison">Comparatif</option></Select></Field>
        <Field label="Statut d'actualité (si actualité)" htmlFor="newsStatus"><Select id="newsStatus" name="newsStatus" defaultValue={initial.newsStatus}><option value="">—</option><option value="annonce">Annonce officielle</option><option value="disponibilite">Disponibilité</option><option value="beta">Bêta</option><option value="deploiement">Déploiement progressif</option><option value="rumeur">Rumeur</option></Select></Field>
        <Field label="Signature" htmlFor="byline"><Input id="byline" name="byline" defaultValue={initial.byline} required /></Field>
        <Field label="Tags (virgules)" htmlFor="tags"><Input id="tags" name="tags" defaultValue={initial.tags} /></Field>
        <Field label="Équipements (slugs, virgules)" htmlFor="deviceSlugs"><Input id="deviceSlugs" name="deviceSlugs" defaultValue={initial.deviceSlugs} /></Field>
        <Field label="Sports (clés, virgules)" htmlFor="sports" hint="running, trail, cyclisme, triathlon, natation, randonnee, fitness, marche"><Input id="sports" name="sports" defaultValue={initial.sports} /></Field>
        <Field label="Mise à jour significative" htmlFor="significantUpdatedAt"><Input id="significantUpdatedAt" name="significantUpdatedAt" type="date" defaultValue={initial.significantUpdatedAt} /></Field>
        <label className="flex items-center gap-2 pt-7 text-sm"><input type="checkbox" name="testedByUs" defaultChecked={initial.testedByUs} className="size-4" />Appareil réellement testé par la rédaction</label>
      </div>
      <Field label="Chapô" htmlFor="excerpt"><Textarea id="excerpt" name="excerpt" defaultValue={initial.excerpt} className="min-h-20" required /></Field>
      <Field label="Corps (Markdown)" htmlFor="bodyMd"><Textarea id="bodyMd" name="bodyMd" defaultValue={initial.bodyMd} className="min-h-[28rem] font-mono text-sm" required /></Field>
      <Field label="Sources (JSON)" htmlFor="sources" hint='[{"label":"…","url":"https://…","accessedAt":"2026-09-18"}]'><Textarea id="sources" name="sources" defaultValue={initial.sources} className="min-h-28 font-mono text-xs" /></Field>
      <Button type="submit" disabled={pending}>{pending ? "Enregistrement…" : "Enregistrer"}</Button>
    </form>
  );
}
