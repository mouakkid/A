import { site, SITE_URL, absoluteUrl } from "@/config/site";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

/** Organisation éditrice : une communauté indépendante, jamais Garmin. */
export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${SITE_URL}/#organisation`,
        name: site.publisher.name,
        alternateName: site.name,
        url: SITE_URL,
        logo: absoluteUrl("/apple-icon.png"),
        description: site.independence.long,
        email: site.publisher.contactEmail,
        areaServed: { "@type": "Country", name: "Maroc" },
        knowsLanguage: ["fr"],
      }}
    />
  );
}

export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: site.name,
        url: SITE_URL,
        inLanguage: "fr",
        publisher: { "@id": `${SITE_URL}/#organisation` },
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/recherche?q={search_term_string}` },
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.label,
          ...(c.href ? { item: absoluteUrl(c.href) } : {}),
        })),
      }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  url,
  publishedAt,
  updatedAt,
  byline,
  type = "Article",
}: {
  title: string;
  description: string;
  url: string;
  publishedAt?: string;
  updatedAt?: string;
  byline: string;
  type?: "Article" | "NewsArticle" | "TechArticle";
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": type,
        headline: title,
        description,
        mainEntityOfPage: absoluteUrl(url),
        inLanguage: "fr",
        ...(publishedAt ? { datePublished: publishedAt } : {}),
        ...(updatedAt ? { dateModified: updatedAt } : {}),
        author: { "@type": "Organization", name: byline, url: SITE_URL },
        publisher: { "@id": `${SITE_URL}/#organisation` },
      }}
    />
  );
}
