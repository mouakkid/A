import type { Metadata } from "next";
import { ArticleListPage } from "@/components/content/article-list-page";

export const metadata: Metadata = {
  title: "Guides et tutoriels",
  description: "Des guides durables pour bien débuter, régler son appareil, préparer une sortie longue, importer un itinéraire ou résoudre un problème de synchronisation.",
  alternates: { canonical: "/guides" },
};

export default function Page() {
  return <ArticleListPage type="guide" title="Guides et tutoriels" intro="Des guides durables pour bien débuter, régler son appareil, préparer une sortie longue, importer un itinéraire ou résoudre un problème de synchronisation." emptyText="Les guides sont rédigés puis relus avant publication." />;
}
