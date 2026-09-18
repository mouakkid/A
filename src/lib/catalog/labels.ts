/** Libellés français des champs de caractéristiques, regroupés par besoin. */
export type SpecGroup = { key: string; title: string; rows: SpecRow[] };
export type SpecRow = { key: string; label: string; hint?: string };

export const specGroups: SpecGroup[] = [
  {
    key: "format",
    title: "Format et confort",
    rows: [
      { key: "dimensionsMm", label: "Dimensions (mm)" },
      { key: "weightG", label: "Poids (g)" },
      { key: "display.type", label: "Type d'écran" },
      { key: "display.sizeIn", label: "Taille d'écran (pouces)" },
      { key: "display.resolution", label: "Résolution" },
      { key: "display.touchscreen", label: "Écran tactile" },
      { key: "materials.lens", label: "Verre" },
      { key: "materials.bezel", label: "Lunette" },
      { key: "waterRating", label: "Étanchéité" },
    ],
  },
  {
    key: "battery",
    title: "Autonomie",
    rows: [{ key: "battery", label: "Autonomies annoncées", hint: "Selon les modes indiqués par le constructeur." }],
  },
  {
    key: "navigation",
    title: "GPS, navigation et cartographie",
    rows: [
      { key: "gnss.systems", label: "Systèmes satellites" },
      { key: "gnss.multiband", label: "Multi-bande (double fréquence)" },
      { key: "gnss.satiq", label: "Sélection automatique du mode GPS (SatIQ)" },
      { key: "maps.preloadedMaps", label: "Cartes préchargées" },
      { key: "maps.turnByTurnRouting", label: "Guidage virage par virage" },
      { key: "maps.courses", label: "Suivi de parcours" },
    ],
  },
  {
    key: "sensors",
    title: "Capteurs",
    rows: [{ key: "sensors", label: "Capteurs intégrés" }],
  },
  {
    key: "training",
    title: "Entraînement et santé",
    rows: [
      { key: "features.trainingReadiness", label: "Préparation à l'entraînement" },
      { key: "features.hrvStatus", label: "Statut VFC" },
      { key: "features.bodyBattery", label: "Body Battery" },
      { key: "features.morningReport", label: "Rapport matinal" },
      { key: "features.ecg", label: "ECG" },
      { key: "sportProfilesHighlight", label: "Profils sportifs mis en avant" },
    ],
  },
  {
    key: "daily",
    title: "Au quotidien",
    rows: [
      { key: "features.musicStorage", label: "Stockage de musique" },
      { key: "features.garminPay", label: "Paiement sans contact" },
      { key: "features.speakerMic", label: "Haut-parleur et micro" },
      { key: "features.flashlight", label: "Lampe torche LED" },
      { key: "features.solar", label: "Recharge solaire" },
      { key: "features.wifi", label: "Wi-Fi" },
      { key: "connectivity", label: "Connectivité" },
    ],
  },
  {
    key: "price",
    title: "Prix de référence",
    rows: [{ key: "price", label: "Prix constructeur", hint: "Marché et date précisés. Pas un prix constaté au Maroc." }],
  },
];

export function getPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, k) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[k] : undefined), obj);
}
