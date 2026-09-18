/**
 * Configuration centrale du site. Toute URL absolue, tout libellé de marque
 * et toute mention légale récurrente doit venir d'ici.
 */
const rawUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";

export const SITE_URL = rawUrl.replace(/\/+$/, "");
export const SITE_ENV = process.env.NEXT_PUBLIC_SITE_ENV?.trim() || "development";
export const IS_PRODUCTION_SITE = SITE_ENV === "production";

export const site = {
  name: "Garmin.ma",
  domain: "garmin.ma",
  productionUrl: "https://garmin.ma",
  tagline: "La communauté Garmin au Maroc",
  description:
    "Garmin.ma est la communauté indépendante des utilisateurs Garmin au Maroc : guides, comparateur, assistant de choix, outils GPX/TCX gratuits et forum d'entraide pour coureurs, traileurs, cyclistes, triathlètes, nageurs et randonneurs.",
  locale: "fr-MA",
  language: "fr",
  direction: "ltr" as const,
  timeZone: "Africa/Casablanca",
  currency: "MAD",
  independence: {
    short: "Communauté indépendante — Non affiliée à Garmin",
    long: "Garmin.ma est un site communautaire indépendant consacré aux utilisateurs Garmin au Maroc. Il n'est ni affilié à Garmin, ni agréé ou sponsorisé par Garmin. Le site ne vend pas de produits Garmin. Les marques et logos cités appartiennent à leurs propriétaires respectifs.",
  },
  publisher: {
    name: "Garmin.ma — Communauté Maroc",
    type: "Organisation communautaire indépendante",
    contactEmail: "contact@garmin.ma",
  },
  social: {
    // Aucun compte social n'est vérifié à ce stade : ne pas afficher de liens factices.
  },
} as const;

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
