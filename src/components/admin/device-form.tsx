"use client";
import { useActionState } from "react";
import { saveDeviceAction, type AdminState } from "@/lib/admin/actions";
import { Field, Input, Select, Textarea, FormError, FormSuccess } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { deviceCategories, categoryLabels } from "@/lib/catalog/types";

type Initial = { id: number; slug: string; model: string; variant: string; family: string; category: string; status: string; officialUrl: string; lastVerifiedAt: string; spec: string; editorial: string; sources: string };

export function DeviceForm({ initial }: { initial: Initial }) {
  const [state, action, pending] = useActionState<AdminState, FormData>(saveDeviceAction, null);
  return (
    <form action={action} className="mt-6 space-y-5">
      <input type="hidden" name="id" value={initial.id} />
      <FormError message={state?.error} />
      <FormSuccess message={state?.success} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Modèle" htmlFor="model"><Input id="model" name="model" defaultValue={initial.model} required /></Field>
        <Field label="Variante" htmlFor="variant"><Input id="variant" name="variant" defaultValue={initial.variant} /></Field>
        <Field label="Famille" htmlFor="family"><Input id="family" name="family" defaultValue={initial.family} required /></Field>
        <Field label="Slug" htmlFor="slug"><Input id="slug" name="slug" defaultValue={initial.slug} required pattern="[a-z0-9-]+" /></Field>
        <Field label="Catégorie" htmlFor="category"><Select id="category" name="category" defaultValue={initial.category}>{deviceCategories.map((c) => <option key={c} value={c}>{categoryLabels[c]}</option>)}</Select></Field>
        <Field label="Statut" htmlFor="status"><Select id="status" name="status" defaultValue={initial.status}>{["draft", "review", "published", "archived"].map((s) => <option key={s} value={s}>{s}</option>)}</Select></Field>
        <Field label="URL officielle" htmlFor="officialUrl"><Input id="officialUrl" name="officialUrl" type="url" defaultValue={initial.officialUrl} /></Field>
        <Field label="Dernière vérification" htmlFor="lastVerifiedAt"><Input id="lastVerifiedAt" name="lastVerifiedAt" type="date" defaultValue={initial.lastVerifiedAt} /></Field>
      </div>
      <Field label="Spécifications (JSON, données constructeur)" htmlFor="spec" hint="Schéma DeviceSpec. null = Non vérifié."><Textarea id="spec" name="spec" defaultValue={initial.spec} className="min-h-72 font-mono text-xs" /></Field>
      <Field label="Éditorial (JSON)" htmlFor="editorial" hint="positioning, sports, profiles, strengths, limits, alternatives (slugs), guides, observations, decision."><Textarea id="editorial" name="editorial" defaultValue={initial.editorial} className="min-h-56 font-mono text-xs" /></Field>
      <Field label="Sources (JSON)" htmlFor="sources" hint='[{"label":"…","url":"https://…","accessedAt":"2026-09-18"}]'><Textarea id="sources" name="sources" defaultValue={initial.sources} className="min-h-28 font-mono text-xs" /></Field>
      <Button type="submit" disabled={pending}>{pending ? "Enregistrement…" : "Enregistrer"}</Button>
    </form>
  );
}
