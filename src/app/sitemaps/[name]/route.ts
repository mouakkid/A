import { NextResponse } from "next/server";
import { SITE_URL } from "@/config/site";
import { listPublishedDevices } from "@/lib/catalog/queries";
import { listPublishedArticles, articlePath } from "@/lib/content/queries";
import { listTopics } from "@/lib/forum/queries";
import { sportKeys } from "@/lib/catalog/types";

type Entry = { loc: string; lastmod?: Date | null; changefreq?: string; priority?: number };

function xml(entries: Entry[]): string {
  const body = entries
    .map((e) => `<url><loc>${SITE_URL}${e.loc}</loc>${e.lastmod ? `<lastmod>${e.lastmod.toISOString()}</lastmod>` : ""}${e.changefreq ? `<changefreq>${e.changefreq}</changefreq>` : ""}${e.priority !== undefined ? `<priority>${e.priority}</priority>` : ""}</url>`)
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`;
}

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  let entries: Entry[] = [];
  if (name === "pages.xml") {
    entries = [
      { loc: "/", changefreq: "daily", priority: 1 },
      { loc: "/equipements", changefreq: "weekly", priority: 0.9 },
      { loc: "/comparer", changefreq: "monthly", priority: 0.7 },
      { loc: "/quel-garmin-choisir", changefreq: "monthly", priority: 0.9 },
      { loc: "/guides", changefreq: "weekly", priority: 0.8 },
      { loc: "/actualites", changefreq: "daily", priority: 0.8 },
      { loc: "/fonctionnalites", changefreq: "weekly", priority: 0.8 },
      { loc: "/comparatifs", changefreq: "weekly", priority: 0.7 },
      { loc: "/outils", changefreq: "monthly", priority: 0.9 },
      ...["inspecteur-gpx-tcx", "convertisseur-gpx-tcx", "confidentialite-gps", "allure-vitesse-temps", "zones-frequence-cardiaque", "strategie-de-course"].map((s) => ({ loc: `/outils/${s}`, changefreq: "monthly", priority: 0.8 })),
      ...sportKeys.map((s) => ({ loc: `/sport/${s}`, changefreq: "weekly", priority: 0.7 })),
      { loc: "/communaute", changefreq: "daily", priority: 0.7 },
      { loc: "/a-propos", changefreq: "yearly", priority: 0.4 },
      { loc: "/methodologie", changefreq: "yearly", priority: 0.4 },
      { loc: "/contact", changefreq: "yearly", priority: 0.3 },
      { loc: "/confidentialite", changefreq: "yearly", priority: 0.2 },
      { loc: "/conditions-utilisation", changefreq: "yearly", priority: 0.2 },
      { loc: "/regles-communautaires", changefreq: "yearly", priority: 0.3 },
    ];
  } else if (name === "equipements.xml") {
    const list = await listPublishedDevices();
    entries = list.map((d) => ({ loc: `/equipements/${d.slug}`, lastmod: d.lastVerifiedAt, changefreq: "monthly", priority: 0.8 }));
  } else if (name === "articles.xml") {
    const list = await listPublishedArticles(undefined, 5000);
    entries = list.map((a) => ({ loc: articlePath(a), lastmod: a.significantUpdatedAt ?? a.publishedAt, changefreq: a.type === "news" ? "monthly" : "yearly", priority: 0.7 }));
  } else if (name === "forum.xml") {
    // Uniquement les discussions publiques suffisamment utiles : publiées et avec au moins une réponse.
    const list = await listTopics({ limit: 5000 });
    entries = list.filter((t) => t.replyCount >= 1).map((t) => ({ loc: `/communaute/sujet/${t.slug}`, lastmod: t.lastReplyAt ?? t.createdAt, changefreq: "weekly", priority: 0.5 }));
  } else {
    return new NextResponse("Not found", { status: 404 });
  }
  return new NextResponse(xml(entries), { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
