import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";

/** Index de sitemaps segmentés (pages, équipements, articles, forum). */
export default function sitemap(): MetadataRoute.Sitemap {
  return ["pages", "equipements", "articles", "forum"].map((s) => ({ url: `${SITE_URL}/sitemaps/${s}.xml`, lastModified: new Date() }));
}
