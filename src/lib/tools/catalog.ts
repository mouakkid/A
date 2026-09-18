export type ToolMeta = {
  slug: string;
  title: string;
  short: string;
  description: string;
  formats: string;
  example: string;
  limits: string[];
  dataHandling: string;
  status: "available" | "roadmap";
};

export const tools: ToolMeta[] = [
  {
    slug: "inspecteur-gpx-tcx",
    title: "Inspecteur GPX / TCX",
    short: "Points, champs, anomalies, tracé.",
    description: "Analyse un fichier GPX ou TCX : nombre de points, horodatages, champs disponibles (altitude, FC, cadence, puissance…), distance et dénivelé, tracé, anomalies plausibles.",
    formats: "GPX 1.0/1.1 (trace, itinéraire, waypoints) et TCX (activité, parcours). Jusqu'à 25 Mo et 500 000 points.",
    example: "Glissez un export d'activité Garmin Connect (.gpx ou .tcx) pour vérifier qu'il contient bien la fréquence cardiaque avant de l'importer ailleurs.",
    limits: ["Les fichiers FIT ne sont pas encore pris en charge (roadmap V2).", "Les anomalies signalées sont des hypothèses, pas des diagnostics.", "Le dénivelé est calculé après un léger lissage : il peut différer de celui affiché par la montre."],
    dataHandling: "Traitement intégral dans votre navigateur (Web Worker). Aucun envoi sur un serveur. L'affichage cartographique optionnel contacte un fournisseur de tuiles.",
    status: "available",
  },
  {
    slug: "convertisseur-gpx-tcx",
    title: "Convertisseur GPX ↔ TCX",
    short: "Conversion avec rapport de pertes.",
    description: "Convertit une activité, une trace ou un parcours entre GPX et TCX, et liste précisément les champs conservés, transformés ou perdus.",
    formats: "Entrée GPX ou TCX ; sortie GPX 1.1 ou TCX v2. Jusqu'à 25 Mo.",
    example: "Convertir un parcours TCX en GPX pour l'ouvrir dans une application qui ne lit pas le TCX.",
    limits: ["Aucune conversion n'est sans perte : les tours (laps) TCX n'existent pas en GPX ; la température GPX n'a pas d'équivalent TCX.", "Un GPX sans horodatage devient un parcours TCX (Course), pas une activité.", "Le nom d'un parcours TCX est tronqué à 15 caractères (contrainte du format)."],
    dataHandling: "Traitement dans votre navigateur. Le fichier original n'est jamais modifié ; vous téléchargez une copie convertie.",
    status: "available",
  },
  {
    slug: "confidentialite-gps",
    title: "Confidentialité GPS",
    short: "Masquer départ et arrivée.",
    description: "Retire les points situés dans un rayon configurable autour du départ et de l'arrivée d'une trace, avec aperçu avant/après, puis exporte une copie.",
    formats: "GPX ou TCX ; export dans le même format.",
    example: "Avant de partager une sortie sur le forum, masquer 300 m autour de votre point de départ.",
    limits: ["Masquer une zone ne rend pas un parcours anonyme : forme de la boucle, horaires et autres activités peuvent le recouper.", "Les horodatages des points conservés ne sont pas modifiés.", "Les tours (laps) TCX conservent leurs résumés d'origine."],
    dataHandling: "Traitement dans votre navigateur. Aucun envoi. L'original est conservé intact.",
    status: "available",
  },
  {
    slug: "allure-vitesse-temps",
    title: "Allure, vitesse et temps",
    short: "min/km, km/h, min/mile, passages.",
    description: "Convertit allures et vitesses, calcule le temps pour une distance ou l'allure pour un temps cible, et génère un tableau de passages.",
    formats: "Saisie manuelle. Distances standard ou libres.",
    example: "Quelle allure pour un semi-marathon en 1 h 45 ? Quel temps au 10 km à 12 km/h ?",
    limits: ["Arithmétique pure : aucune prise en compte du dénivelé, de la chaleur ou de la fatigue."],
    dataHandling: "Aucune donnée n'est envoyée. Le lien partageable ne contient que les paramètres saisis.",
    status: "available",
  },
  {
    slug: "zones-frequence-cardiaque",
    title: "Zones de fréquence cardiaque",
    short: "Trois méthodes, formules visibles.",
    description: "Calcule cinq zones selon trois méthodes nommées (pourcentage de FC max, réserve cardiaque de Karvonen, pourcentage du seuil), avec formules et hypothèses affichées.",
    formats: "Saisie manuelle : âge ou FC max mesurée, FC de repos, FC au seuil.",
    example: "Comparer les zones obtenues avec une FC max estimée et avec une FC max mesurée en côte.",
    limits: ["Ce sont des estimations, pas un diagnostic médical et pas la méthode utilisée par votre appareil.", "L'estimation 220 − âge est très imprécise individuellement."],
    dataHandling: "Calcul local, aucune donnée transmise.",
    status: "available",
  },
  {
    slug: "strategie-de-course",
    title: "Stratégie de course",
    short: "Régulier ou negative split.",
    description: "Construit un tableau de passages pour une distance et un temps cible, en allure constante ou en negative split, avec ajustements manuels par kilomètre.",
    formats: "Saisie manuelle.",
    example: "Un marathon en 3 h 45 avec une seconde moitié 2 % plus rapide.",
    limits: ["Aucune prédiction de performance : l'outil répartit un temps que vous choisissez."],
    dataHandling: "Calcul local, aucune donnée transmise.",
    status: "available",
  },
];

export function getTool(slug: string): ToolMeta | undefined {
  return tools.find((t) => t.slug === slug);
}

export const roadmapV2 = [
  "Lecture de fichiers FIT (après vérification d'une bibliothèque, de sa licence, de sa maintenance et des pertes possibles).",
  "Conversion FIT → GPX/TCX.",
  "Découpage et fusion d'activités.",
  "Création de parcours.",
  "Analyse de couverture des données (champs manquants par segment).",
];
