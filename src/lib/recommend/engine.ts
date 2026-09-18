import type { Device, SportKey } from "@/lib/catalog/types";

/**
 * Moteur de règles explicable pour « Quel Garmin choisir ? ».
 * Chaque règle ajoute des points ET une raison lisible. Aucun score « scientifique » :
 * le total sert uniquement à ordonner, et chaque raison est affichée.
 */
export type Answers = {
  mainSport: SportKey;
  secondarySports: SportKey[];
  budget: "moins-300" | "300-500" | "500-800" | "plus-800" | "indifferent"; // en EUR (prix constructeur de référence)
  level: "debutant" | "intermediaire" | "confirme";
  frequency: "1-2" | "3-4" | "5-plus";
  priority: "autonomie" | "ecran" | "equilibre";
  size: "compact" | "standard" | "large" | "indifferent";
  maps: "oui" | "non" | "indifferent";
  extras: ("musique" | "paiement" | "solaire" | "lampe" | "triathlon" | "ecg")[];
};

export type Reason = { text: string; kind: "plus" | "minus" | "info" };
export type Recommendation = { device: Device; score: number; reasons: Reason[]; tradeoffs: string[]; relevantFeatures: string[] };

const budgetRanges: Record<Answers["budget"], [number, number]> = {
  "moins-300": [0, 300],
  "300-500": [300, 500],
  "500-800": [500, 800],
  "plus-800": [800, Infinity],
  indifferent: [0, Infinity],
};

function has(v: boolean | null): v is true {
  return v === true;
}

export function scoreDevice(d: Device, a: Answers): Recommendation {
  const reasons: Reason[] = [];
  const tradeoffs: string[] = [];
  const relevant: string[] = [];
  let score = 0;
  const e = d.editorial;
  const s = d.spec;

  // Exclusions franches
  if (d.category === "capteur-accessoire" || d.category === "compteur-velo") {
    if (!(a.mainSport === "cyclisme" && d.category === "compteur-velo")) return { device: d, score: -Infinity, reasons, tradeoffs, relevantFeatures: relevant };
  }

  // Sport principal
  if (e.sports.includes(a.mainSport)) {
    score += 30;
    reasons.push({ kind: "plus", text: `Positionné pour votre sport principal (${a.mainSport}).` });
  } else {
    score -= 15;
    reasons.push({ kind: "minus", text: `Pas positionné en priorité pour ${a.mainSport} selon nos fiches.` });
  }
  const sec = a.secondarySports.filter((sp) => e.sports.includes(sp));
  if (sec.length) {
    score += 5 * sec.length;
    reasons.push({ kind: "plus", text: `Couvre aussi : ${sec.join(", ")}.` });
  }

  // Budget (prix constructeur de référence, pas un prix Maroc)
  const [lo, hi] = budgetRanges[a.budget];
  if (s.price) {
    if (s.price.amount >= lo && s.price.amount <= hi) {
      score += 20;
      reasons.push({ kind: "plus", text: `Prix constructeur de référence (${s.price.amount} ${s.price.currency}, ${s.price.market}) dans votre budget.` });
    } else if (s.price.amount > hi) {
      const over = s.price.amount - hi;
      score -= over > 200 ? 30 : 12;
      reasons.push({ kind: "minus", text: `Au-dessus du budget indiqué (${s.price.amount} ${s.price.currency} de référence).` });
    } else {
      score += 8;
      reasons.push({ kind: "info", text: "Sous le budget indiqué : fonctions possiblement plus limitées." });
    }
  } else {
    reasons.push({ kind: "info", text: "Prix de référence non vérifié : le budget n'a pas pu être pris en compte." });
  }

  // Niveau et fréquence → gamme
  const tier = e.decision.tier;
  const wantsAdvanced = a.level === "confirme" || a.frequency === "5-plus";
  if (wantsAdvanced && (tier === "haut" || tier === "expert")) {
    score += 10;
    reasons.push({ kind: "plus", text: "Gamme adaptée à une pratique soutenue (métriques d'entraînement avancées)." });
  }
  if (a.level === "debutant" && (tier === "entree" || tier === "milieu")) {
    score += 10;
    reasons.push({ kind: "plus", text: "Gamme accessible, suffisante pour débuter sans payer des fonctions inutilisées." });
  }
  if (a.level === "debutant" && tier === "expert") {
    score -= 6;
    tradeoffs.push("Beaucoup de fonctions expertes que vous n'utiliserez peut-être pas au début.");
  }

  // Priorité autonomie / écran
  if (a.priority === "autonomie") {
    if (e.decision.batteryClass === "tres-longue" || e.decision.batteryClass === "longue") {
      score += 15;
      reasons.push({ kind: "plus", text: "Autonomie classée longue à très longue d'après les données constructeur." });
    }
    if (s.display.type?.toUpperCase().includes("AMOLED")) tradeoffs.push("Écran AMOLED : autonomie généralement inférieure à un écran MIP à gamme égale.");
    if (has(s.features.solar)) { score += 5; relevant.push("Recharge solaire"); }
  }
  if (a.priority === "ecran") {
    if (s.display.type?.toUpperCase().includes("AMOLED")) {
      score += 15;
      reasons.push({ kind: "plus", text: "Écran AMOLED, plus lisible et contrasté en intérieur." });
    } else if (s.display.type) {
      tradeoffs.push(`Écran ${s.display.type} : moins lumineux qu'un AMOLED, mais très lisible au soleil.`);
    }
  }

  // Taille
  if (a.size !== "indifferent" && e.decision.sizeClass) {
    if (e.decision.sizeClass === a.size) {
      score += 8;
      reasons.push({ kind: "plus", text: `Format ${a.size} conforme à votre préférence.` });
    } else {
      score -= 4;
      tradeoffs.push(`Format ${e.decision.sizeClass} alors que vous préférez ${a.size}.`);
    }
  }

  // Cartographie
  if (a.maps === "oui") {
    if (has(s.maps.preloadedMaps)) {
      score += 18;
      reasons.push({ kind: "plus", text: "Cartes préchargées vérifiées sur la fiche constructeur." });
      relevant.push("Cartographie intégrée");
    } else if (s.maps.preloadedMaps === false) {
      score -= 20;
      reasons.push({ kind: "minus", text: "Pas de cartes préchargées (suivi de trace possible selon modèle, sans fond de carte)." });
    } else {
      reasons.push({ kind: "info", text: "Cartographie : information non vérifiée." });
    }
  }
  if (a.maps === "non" && has(s.maps.preloadedMaps) && (tier === "haut" || tier === "expert")) {
    tradeoffs.push("Vous payez une cartographie que vous n'avez pas demandée.");
  }

  // Extras
  for (const x of a.extras) {
    const check: Record<typeof x, [boolean | null, string]> = {
      musique: [s.features.musicStorage, "Stockage de musique"],
      paiement: [s.features.garminPay, "Paiement sans contact"],
      solaire: [s.features.solar, "Recharge solaire"],
      lampe: [s.features.flashlight, "Lampe torche LED"],
      triathlon: [e.sports.includes("triathlon") ? true : null, "Profil triathlon / multisport"],
      ecg: [s.features.ecg, "ECG"],
    };
    const [v, label] = check[x];
    if (v === true) { score += 6; relevant.push(label); }
    else if (v === false) { score -= 8; tradeoffs.push(`${label} : absent.`); }
    else reasons.push({ kind: "info", text: `${label} : non vérifié.` });
  }

  // Trail / randonnée : multi-bande et baromètre utiles
  if ((a.mainSport === "trail" || a.mainSport === "randonnee") && has(s.gnss.multiband)) {
    score += 6;
    relevant.push("GPS multi-bande");
  }
  if (a.mainSport === "natation" || a.mainSport === "triathlon") {
    if (s.waterRating) relevant.push(`Étanchéité ${s.waterRating}`);
  }
  if (has(s.features.trainingReadiness)) relevant.push("Préparation à l'entraînement");
  if (has(s.features.bodyBattery)) relevant.push("Body Battery");

  return { device: d, score, reasons, tradeoffs, relevantFeatures: Array.from(new Set(relevant)) };
}

export type RecommendationResult = { recommendations: Recommendation[]; insufficientData: boolean; explanation: string; differences: string[] };

export function recommend(devicesList: Device[], a: Answers, max = 3): RecommendationResult {
  const scored = devicesList
    .filter((d) => d.status === "published")
    .map((d) => scoreDevice(d, a))
    .filter((r) => Number.isFinite(r.score))
    .sort((x, y) => y.score - x.score);
  const recs = scored.slice(0, max);
  const insufficient = recs.length < 2 || recs.every((r) => r.score <= 0);
  const differences = describeDifferences(recs);
  return {
    recommendations: recs,
    insufficientData: insufficient,
    explanation:
      "Chaque réponse déclenche des règles simples et visibles : correspondance au sport, budget par rapport au prix constructeur de référence, gamme selon le niveau, priorité autonomie/écran, taille, cartographie et options. Les points ne mesurent pas une qualité absolue : ils ordonnent les modèles qui correspondent le mieux à vos réponses, avec leurs compromis.",
    differences,
  };
}

function describeDifferences(recs: Recommendation[]): string[] {
  if (recs.length < 2) return [];
  const out: string[] = [];
  const n = (r: Recommendation) => (r.device.variant ? `${r.device.model} (${r.device.variant})` : r.device.model);
  const prices = recs.filter((r) => r.device.spec.price);
  if (prices.length >= 2) out.push(`Prix de référence : ${prices.map((r) => `${n(r)} ${r.device.spec.price!.amount} ${r.device.spec.price!.currency}`).join(" · ")}.`);
  const disp = recs.filter((r) => r.device.spec.display.type);
  if (new Set(disp.map((r) => r.device.spec.display.type)).size > 1) out.push(`Écrans : ${disp.map((r) => `${n(r)} ${r.device.spec.display.type}`).join(" · ")}.`);
  const maps = recs.filter((r) => r.device.spec.maps.preloadedMaps !== null);
  if (new Set(maps.map((r) => r.device.spec.maps.preloadedMaps)).size > 1) out.push(`Cartes préchargées : ${maps.map((r) => `${n(r)} ${r.device.spec.maps.preloadedMaps ? "oui" : "non"}`).join(" · ")}.`);
  const w = recs.filter((r) => r.device.spec.weightG !== null);
  if (w.length >= 2) out.push(`Poids : ${w.map((r) => `${n(r)} ${r.device.spec.weightG} g`).join(" · ")}.`);
  return out;
}
