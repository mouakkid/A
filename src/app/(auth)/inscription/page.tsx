import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Créer un compte", description: "Rejoignez la communauté Garmin.ma pour poser vos questions et partager votre expérience.", robots: { index: false } };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const user = await getCurrentUser();
  const { next } = await searchParams;
  if (user) redirect("/compte");
  return (
    <div className="container-x py-12 sm:py-20">
      <div className="mx-auto max-w-md">
        <h1 className="text-3xl font-bold">Créer un compte</h1>
        <p className="mt-2 text-fg-muted">Gratuit. Un pseudonyme, une adresse e-mail et un mot de passe suffisent. Aucun identifiant Garmin n'est demandé.</p>
        <RegisterForm next={next} />
      </div>
    </div>
  );
}
