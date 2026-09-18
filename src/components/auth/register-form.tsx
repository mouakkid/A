"use client";
import { useActionState } from "react";
import Link from "next/link";
import { registerAction, type AuthState } from "@/lib/auth/actions";
import { Field, Input, Select, FormError, Honeypot } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { sportKeys, sportLabels } from "@/lib/catalog/types";

export function RegisterForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(registerAction, null);
  const fe = state?.fieldErrors ?? {};
  return (
    <form action={action} className="relative mt-8 space-y-5">
      <Honeypot />
      {next && <input type="hidden" name="next" value={next} />}
      <FormError message={state?.error} />
      <Field label="Pseudonyme" htmlFor="username" hint="Visible publiquement sur le forum." error={fe.username}>
        <Input id="username" name="username" autoComplete="username" required minLength={3} maxLength={24} aria-invalid={Boolean(fe.username)} />
      </Field>
      <Field label="Adresse e-mail" htmlFor="email" hint="Jamais affichée. Sert à la connexion." error={fe.email}>
        <Input id="email" name="email" type="email" autoComplete="email" required aria-invalid={Boolean(fe.email)} />
      </Field>
      <Field label="Mot de passe" htmlFor="password" hint="10 caractères minimum." error={fe.password}>
        <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={10} aria-invalid={Boolean(fe.password)} />
      </Field>
      <Field label="Sport principal (facultatif)" htmlFor="mainSport">
        <Select id="mainSport" name="mainSport" defaultValue="">
          <option value="">— Choisir —</option>
          {sportKeys.map((k) => (
            <option key={k} value={k}>{sportLabels[k]}</option>
          ))}
        </Select>
      </Field>
      <div className="flex items-start gap-2">
        <input id="accept" name="accept" type="checkbox" required className="mt-1 size-4" aria-invalid={Boolean(fe.accept)} />
        <label htmlFor="accept" className="text-sm text-fg-muted">
          J'ai lu les <Link href="/regles-communautaires" className="underline">règles communautaires</Link> et la <Link href="/confidentialite" className="underline">politique de confidentialité</Link>.
        </label>
      </div>
      {fe.accept && <p role="alert" className="text-xs font-medium text-danger">{fe.accept}</p>}
      <Button type="submit" disabled={pending} className="w-full">{pending ? "Création…" : "Créer mon compte"}</Button>
      <p className="text-sm text-fg-muted">
        Déjà membre ? <Link href="/connexion" className="font-medium text-accent-strong underline dark:text-accent">Se connecter</Link>
      </p>
    </form>
  );
}
