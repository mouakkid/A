export const forumCategorySeed = [
  { slug: "bien-debuter", name: "Bien débuter", description: "Premiers pas avec une montre ou un compteur Garmin, application Garmin Connect, réglages de base.", position: 1 },
  { slug: "choisir-son-equipement", name: "Choisir son équipement", description: "Hésitations entre modèles, budget, variantes, accessoires.", position: 2 },
  { slug: "running", name: "Running", description: "Entraînement, allures, plans, courses sur route au Maroc.", position: 3 },
  { slug: "trail", name: "Trail", description: "Sentiers, montagne, navigation, autonomie sur longues sorties.", position: 4 },
  { slug: "cyclisme", name: "Cyclisme", description: "Compteurs Edge, capteurs, radars, itinéraires vélo.", position: 5 },
  { slug: "natation-triathlon", name: "Natation et triathlon", description: "Piscine, eau libre, transitions, profils multisports.", position: 6 },
  { slug: "synchronisation-problemes", name: "Synchronisation et problèmes techniques", description: "Garmin Connect, Bluetooth, mises à jour, GPS, capteurs.", position: 7 },
  { slug: "parcours-navigation", name: "Parcours et navigation", description: "Créer, importer et suivre des parcours ; cartes ; fichiers GPX/TCX/FIT.", position: 8 },
  { slug: "outils-garmin-ma", name: "Outils Garmin.ma", description: "Questions, retours et suggestions sur les outils du site.", position: 9 },
] as const;

export const reportReasons = [
  { key: "spam", label: "Spam ou publicité" },
  { key: "abus", label: "Propos injurieux ou harcèlement" },
  { key: "hors-sujet", label: "Hors sujet" },
  { key: "donnees-personnelles", label: "Données personnelles ou position GPS" },
  { key: "autre", label: "Autre" },
] as const;

export const LIMITS = {
  topicTitleMin: 8,
  topicTitleMax: 140,
  bodyMin: 20,
  bodyMax: 12000,
  topicsPerHour: 3,
  repliesPerTenMinutes: 6,
  reportsPerHour: 10,
  maxLinksNewMember: 2,
};
