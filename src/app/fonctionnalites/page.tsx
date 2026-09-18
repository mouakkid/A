import type { Metadata } from "next";
import { ArticleListPage } from "@/components/content/article-list-page";

export const metadata: Metadata = {
  title: "Fonctionnalités expliquées",
  description: "Comprendre ce que mesurent vraiment les indicateurs (récupération, zones cardiaques, GPS, cartographie) et sur quels modèles ils existent, uniquement lorsque c'est vérifié.",
  alternates: { canonical: "/fonctionnalites" },
};

export default function Page() {
  return <ArticleListPage type="feature" title="Fonctionnalités expliquées" intro="Comprendre ce que mesurent vraiment les indicateurs (récupération, zones cardiaques, GPS, cartographie) et sur quels modèles ils existent, uniquement lorsque c'est vérifié." emptyText="Chaque fonctionnalité est expliquée avec ses sources et ses limites." />;
}
