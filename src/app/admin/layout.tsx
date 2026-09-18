import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, canModerate, canEdit, isAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Back-office", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/admin");
  if (!canModerate(user) && !canEdit(user)) redirect("/compte");
  const links = [
    ...(canEdit(user) ? [{ href: "/admin/equipements", label: "Équipements" }, { href: "/admin/articles", label: "Articles" }] : []),
    ...(canModerate(user) ? [{ href: "/admin/moderation", label: "Modération" }] : []),
    ...(isAdmin(user) ? [{ href: "/admin/utilisateurs", label: "Utilisateurs" }] : []),
  ];
  return (
    <div className="container-x py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-strong dark:text-accent">Back-office</p>
          <p className="text-sm text-fg-muted">Connecté en tant que {user.username} ({user.role}). Toutes les actions sont journalisées.</p>
        </div>
        <nav aria-label="Back-office" className="flex flex-wrap gap-1">
          <Link href="/admin" className="rounded-full px-3 py-1.5 text-sm font-medium hover:bg-bg-muted">Tableau de bord</Link>
          {links.map((l) => <Link key={l.href} href={l.href} className="rounded-full px-3 py-1.5 text-sm font-medium hover:bg-bg-muted">{l.label}</Link>)}
        </nav>
      </div>
      {children}
    </div>
  );
}
