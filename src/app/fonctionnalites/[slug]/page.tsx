import type { Metadata } from "next";
import { ArticlePage, articleMetadata, articleStaticParams } from "@/components/content/article-page";

export async function generateStaticParams() {
  return articleStaticParams("feature");
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return articleMetadata("feature", slug);
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ArticlePage type="feature" slug={slug} />;
}
