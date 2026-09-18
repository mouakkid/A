/**
 * Zones de fréquence cardiaque : estimations basées sur des formules publiques.
 * Aucune de ces formules n'est un diagnostic médical ni une méthode attribuée à Garmin.
 */
export type ZoneMethod = "max-percent" | "karvonen" | "lthr";

export const zoneMethods: { key: ZoneMethod; label: string; formula: string; assumptions: string }[] = [
  {
    key: "max-percent",
    label: "Pourcentage de la FC max",
    formula: "Borne = FCmax × pourcentage",
    assumptions: "Ne tient pas compte de la FC de repos. FCmax mesurée de préférence ; l'estimation 220 − âge est une moyenne de population, très imprécise individuellement.",
  },
  {
    key: "karvonen",
    label: "Réserve cardiaque (Karvonen)",
    formula: "Borne = FCrepos + (FCmax − FCrepos) × pourcentage",
    assumptions: "Nécessite une FC de repos fiable (mesurée au réveil, plusieurs jours). Plus personnalisée que le simple pourcentage de FCmax.",
  },
  {
    key: "lthr",
    label: "Pourcentage du seuil lactique (LTHR)",
    formula: "Borne = FC au seuil × pourcentage",
    assumptions: "Le seuil doit provenir d'un test de terrain (ex. 30 min à intensité maximale soutenable, FC moyenne des 20 dernières minutes). Zones adaptées de la répartition de Joe Friel pour la course à pied.",
  },
];

export type Zone = { index: number; name: string; purpose: string; lowPct: number; highPct: number; low: number; high: number };

const fiveZones: { name: string; purpose: string; pct: [number, number] }[] = [
  { name: "Zone 1 — Récupération", purpose: "Échauffement, retour au calme, récupération active", pct: [0.5, 0.6] },
  { name: "Zone 2 — Endurance fondamentale", purpose: "Base aérobie, sorties longues faciles", pct: [0.6, 0.7] },
  { name: "Zone 3 — Tempo", purpose: "Allure soutenue mais confortable", pct: [0.7, 0.8] },
  { name: "Zone 4 — Seuil", purpose: "Intensité proche du seuil lactique", pct: [0.8, 0.9] },
  { name: "Zone 5 — VO2max", purpose: "Intervalles courts et intenses", pct: [0.9, 1.0] },
];

const lthrZones: { name: string; purpose: string; pct: [number, number] }[] = [
  { name: "Zone 1 — Récupération", purpose: "Très facile", pct: [0.0, 0.85] },
  { name: "Zone 2 — Aérobie", purpose: "Endurance fondamentale", pct: [0.85, 0.89] },
  { name: "Zone 3 — Tempo", purpose: "Allure soutenue", pct: [0.9, 0.94] },
  { name: "Zone 4 — Sous-seuil", purpose: "Juste sous le seuil", pct: [0.95, 0.99] },
  { name: "Zone 5 — Seuil et au-delà", purpose: "Au seuil et intervalles", pct: [1.0, 1.1] },
];

export function estimateMaxHr(age: number): number {
  if (age < 10 || age > 100) throw new RangeError("Âge hors plage (10–100).");
  return 220 - age;
}

export function computeZones(method: ZoneMethod, input: { maxHr?: number; restHr?: number; lthr?: number }): Zone[] {
  if (method === "max-percent") {
    const max = input.maxHr;
    if (!max || max < 100 || max > 230) throw new RangeError("FC max invalide (100–230).");
    return fiveZones.map((z, i) => ({ index: i + 1, name: z.name, purpose: z.purpose, lowPct: z.pct[0], highPct: z.pct[1], low: Math.round(max * z.pct[0]), high: Math.round(max * z.pct[1]) }));
  }
  if (method === "karvonen") {
    const max = input.maxHr, rest = input.restHr;
    if (!max || max < 100 || max > 230) throw new RangeError("FC max invalide (100–230).");
    if (!rest || rest < 30 || rest >= max) throw new RangeError("FC de repos invalide (30 à FCmax−1).");
    const reserve = max - rest;
    return fiveZones.map((z, i) => ({ index: i + 1, name: z.name, purpose: z.purpose, lowPct: z.pct[0], highPct: z.pct[1], low: Math.round(rest + reserve * z.pct[0]), high: Math.round(rest + reserve * z.pct[1]) }));
  }
  const lthr = input.lthr;
  if (!lthr || lthr < 100 || lthr > 220) throw new RangeError("FC au seuil invalide (100–220).");
  return lthrZones.map((z, i) => ({ index: i + 1, name: z.name, purpose: z.purpose, lowPct: z.pct[0], highPct: z.pct[1], low: Math.round(lthr * z.pct[0]), high: Math.round(lthr * z.pct[1]) }));
}
