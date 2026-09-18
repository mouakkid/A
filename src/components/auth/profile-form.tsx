"use client";
import { useActionState } from "react";
import { updateProfileAction, type AuthState } from "@/lib/auth/actions";
import { Field, Input, Textarea, Select, FormError, FormSuccess } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { sportKeys, sportLabels } from "@/lib/catalog/types";

export function ProfileForm({ initial }: { initial: { displayName: string; bio: string; mainSport: string; devices: string } }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(updateProfileAction, null);
  return (
    <form action={action} className="mt-6 space-y-5">
      <FormError message={state?.error} />
      <FormSuccess message={state?.fieldErrors?._success} />
      <Field label="Nom affiché (facultatif)" htmlFor="displayName">
        <Input id="displayName" name="displayName" defaultValue={initial.displayName} maxLength={60} />
      </Field>
      <Field label="Sport principal" htmlFor="mainSport">
        <Select id="mainSport" name="mainSport" defaultValue={initial.mainSport}>
          <option value="">— Choisir —</option>
          {sportKeys.map((k) => (
            <option key={k} value={k}>{sportLabels[k]}</option>
          ))}
        </Select>
      </Field>
      <Field label="Vos équipements Garmin (séparés par des virgules)" htmlFor="devices" hint="Ex. : Forerunner 265, HRM-Pro Plus">
        <Input id="devices" name="devices" defaultValue={initial.devices} maxLength={300} />
      </Field>
      <Field label="Bio (facultatif)" htmlFor="bio" hint="400 caractères maximum. Pas de coordonnées ni d'adresse.">
        <Textarea id="bio" name="bio" defaultValue={initial.bio} maxLength={400} />
      </Field>
      <Button type="submit" disabled={pending}>{pending ? "Enregistrement…" : "Enregistrer"}</Button>
    </form>
  );
}
