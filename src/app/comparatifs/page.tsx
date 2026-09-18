import type { Metadata } from "next";
import { ArticleListPage } from "@/components/content/article-list-page";

export const metadata: Metadata = {
  title: "Comparatifs éditoriaux",
  description: "Des comparaisons rédigées, avec un vrai raisonnement par profil d'utilisateur. Pour une comparaison brute et instantanée, utilisez le comparateur.",
  alternates: { canonical: "/comparatifs" },
};

export default function Page() {
  return <ArticleListPage type="comparison" title="Comparatifs éditoriaux" intro="Des comparaisons rédigées, avec un vrai raisonnement par profil d'utilisateur. Pour une comparaison brute et instantanée, utilisez le comparateur." emptyText="Les comparatifs éditoriaux demandent des fiches vérifiées et une analyse rédigée ; ils arrivent progressivement." />;
}
