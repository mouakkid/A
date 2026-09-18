import type { Metadata } from "next";
import { ArticleListPage } from "@/components/content/article-list-page";

export const metadata: Metadata = {
  title: "Actualités Garmin vérifiées",
  description: "Nouveautés, mises à jour et disponibilités, avec leur statut ",
  alternates: { canonical: "/actualites" },
};

export default function Page() {
  return <ArticleListPage type="news" title="Actualités Garmin vérifiées" intro="Nouveautés, mises à jour et disponibilités, avec leur statut " emptyText=" annonce officielle, disponibilité, bêta, déploiement progressif ou rumeur explicitement présentée comme telle.:Les actualités sont publiées après vérification de leur source. Aucune rumeur n'est présentée comme un fait." />;
}
