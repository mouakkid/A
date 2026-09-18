import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Connexion", description: "Connectez-vous à votre compte Garmin.ma pour participer au forum.", robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const user = await getCurrentUser();
  const { next } = await searchParams;
  if (user) redirect(next && next.startsWith("/") ? next : "/compte");
  return (
    <div className="container-x py-12 sm:py-20">
      <div className="mx-auto max-w-md">
        <h1 className="text-3xl font-bold">Connexion</h1>
        <p className="mt-2 text-fg-muted">Votre compte Garmin.ma sert uniquement au forum et à votre profil. Nous ne demandons jamais vos identifiants Garmin Connect.</p>
        <LoginForm next={next} />
      </div>
    </div>
  );
}
