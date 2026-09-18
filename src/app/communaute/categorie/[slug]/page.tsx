import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug, listTopics, countTopics } from "@/lib/forum/queries";
import { getCurrentUser } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button";
import { TopicList } from "@/components/forum/topic-list";

const PAGE = 25;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCategoryBySlug(slug);
  if (!c) return { title: "Catégorie introuvable" };
  return { title: `${c.name} — forum`, description: c.description, alternates: { canonical: `/communaute/categorie/${c.slug}` } };
}

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> }) {
  const { slug } = await params;
  const { page = "1" } = await searchParams;
  const c = await getCategoryBySlug(slug);
  if (!c) notFound();
  const p = Math.max(1, Number(page) || 1);
  const [topics, total, user] = await Promise.all([listTopics({ categoryId: c.id, limit: PAGE, offset: (p - 1) * PAGE }), countTopics(c.id), getCurrentUser()]);
  const pages = Math.max(1, Math.ceil(total / PAGE));
  return (
    <>
      <PageHeader crumbs={[{ label: "Communauté", href: "/communaute" }, { label: c.name }]} eyebrow="Catégorie" title={c.name} intro={c.description}>
        <div className="mt-6"><ButtonLink href={user ? `/communaute/nouveau?categorie=${c.id}` : `/connexion?next=/communaute/nouveau`}>Ouvrir un sujet ici</ButtonLink></div>
      </PageHeader>
      <div className="container-x py-10">
        <TopicList topics={topics} emptyText="Aucun sujet dans cette catégorie. Le vôtre sera le premier." />
        {pages > 1 && (
          <nav aria-label="Pagination" className="mt-8 flex items-center justify-between text-sm">
            {p > 1 ? <Link href={`?page=${p - 1}`} className="underline">Page précédente</Link> : <span />}
            <span className="text-fg-subtle">Page {p} sur {pages}</span>
            {p < pages ? <Link href={`?page=${p + 1}`} className="underline">Page suivante</Link> : <span />}
          </nav>
        )}
      </div>
    </>
  );
}
