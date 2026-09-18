"use client";
import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type AuthState } from "@/lib/auth/actions";
import { Field, Input, FormError, Honeypot } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(loginAction, null);
  return (
    <form action={action} className="relative mt-8 space-y-5">
      <Honeypot />
      {next && <input type="hidden" name="next" value={next} />}
      <FormError message={state?.error} />
      <Field label="E-mail ou pseudonyme" htmlFor="identifier">
        <Input id="identifier" name="identifier" autoComplete="username" required />
      </Field>
      <Field label="Mot de passe" htmlFor="password">
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </Field>
      <Button type="submit" disabled={pending} className="w-full">{pending ? "Connexion…" : "Se connecter"}</Button>
      <p className="text-sm text-fg-muted">
        Pas encore de compte ? <Link href={`/inscription${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-medium text-accent-strong underline dark:text-accent">Créer un compte</Link>
      </p>
      <p className="text-xs text-fg-subtle">Mot de passe oublié ? La réinitialisation par e-mail n'est pas encore active (aucun service d'envoi configuré). Contactez-nous via la page Contact.</p>
    </form>
  );
}
