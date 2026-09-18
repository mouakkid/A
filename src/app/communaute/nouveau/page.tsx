import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { listCategories } from "@/lib/forum/queries";
import { getCurrentUser } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { TopicForm } from "@/components/forum/topic-form";

export const metadata: Metadata = { title: "Nouveau sujet", robots: { index: false } };

export default async function NewTopicPage({ searchParams }: { searchParams: Promise<{ categorie?: string; tag?: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/communaute/nouveau");
  const { categorie, tag } = await searchParams;
  const categories = await listCategories();
  return (
    <>
      <PageHeader crumbs={[{ label: "Communauté", href: "/communaute" }, { label: "Nouveau sujet" }]} eyebrow="Forum" title="Ouvrir un sujet" intro="Un titre précis, le modèle concerné, ce que vous avez déjà essayé : vous obtiendrez de meilleures réponses." />
      <div className="container-x max-w-3xl py-10">
        <TopicForm categories={categories.map((c) => ({ id: c.id, name: c.name }))} defaultCategoryId={categorie ? Number(categorie) : undefined} defaultTag={tag} />
      </div>
    </>
  );
}
