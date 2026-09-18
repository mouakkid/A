import { z } from "zod";

/** Une valeur « inconnue » (null) est affichée « Non vérifié » : elle ne signifie jamais « absent ». */
export const nullableBool = z.boolean().nullable();

export const deviceCategories = [
  "montre-running",
  "montre-multisport",
  "outdoor",
  "bien-etre-fitness",
  "compteur-velo",
  "capteur-accessoire",
] as const;
export type DeviceCategory = (typeof deviceCategories)[number];

export const categoryLabels: Record<DeviceCategory, string> = {
  "montre-running": "Montres running",
  "montre-multisport": "Montres multisports",
  outdoor: "Équipements outdoor",
  "bien-etre-fitness": "Montres bien-être et fitness",
  "compteur-velo": "Compteurs vélo",
  "capteur-accessoire": "Capteurs et accessoires",
};

export const sportKeys = ["running", "trail", "cyclisme", "triathlon", "natation", "randonnee", "fitness", "marche"] as const;
export type SportKey = (typeof sportKeys)[number];
export const sportLabels: Record<SportKey, string> = {
  running: "Running",
  trail: "Trail",
  cyclisme: "Cyclisme",
  triathlon: "Triathlon",
  natation: "Natation",
  randonnee: "Randonnée",
  fitness: "Fitness et bien-être",
  marche: "Marche",
};

export const batteryClaimSchema = z.object({ mode: z.string(), claim: z.string() });

/** Données constructeur, telles que lues sur la fiche officielle (jamais interprétées). */
export const deviceSpecSchema = z.object({
  price: z
    .object({ amount: z.number(), currency: z.string(), market: z.string(), note: z.string().optional() })
    .nullable()
    .default(null),
  dimensionsMm: z.string().nullable().default(null),
  weightG: z.number().nullable().default(null),
  display: z
    .object({
      type: z.string().nullable().default(null),
      sizeIn: z.number().nullable().default(null),
      resolution: z.string().nullable().default(null),
      touchscreen: nullableBool.default(null),
    })
    .prefault({}),
  battery: z.array(batteryClaimSchema).default([]),
  gnss: z
    .object({
      systems: z.array(z.string()).nullable().default(null),
      multiband: nullableBool.default(null),
      satiq: nullableBool.default(null),
    })
    .prefault({}),
  maps: z
    .object({
      preloadedMaps: nullableBool.default(null),
      turnByTurnRouting: nullableBool.default(null),
      courses: nullableBool.default(null),
    })
    .prefault({}),
  sensors: z.array(z.string()).nullable().default(null),
  features: z
    .object({
      musicStorage: nullableBool.default(null),
      garminPay: nullableBool.default(null),
      ecg: nullableBool.default(null),
      flashlight: nullableBool.default(null),
      solar: nullableBool.default(null),
      wifi: nullableBool.default(null),
      trainingReadiness: nullableBool.default(null),
      hrvStatus: nullableBool.default(null),
      bodyBattery: nullableBool.default(null),
      morningReport: nullableBool.default(null),
      speakerMic: nullableBool.default(null),
    })
    .prefault({}),
  waterRating: z.string().nullable().default(null),
  connectivity: z.array(z.string()).nullable().default(null),
  materials: z.object({ bezel: z.string().nullable(), lens: z.string().nullable(), case: z.string().nullable() }).nullable().default(null),
  sportProfilesHighlight: z.array(z.string()).nullable().default(null),
  rawNotes: z.string().nullable().default(null),
});
export type DeviceSpec = z.infer<typeof deviceSpecSchema>;

/** Contenu éditorial rédigé par l'équipe (jamais présenté comme donnée constructeur). */
export const deviceEditorialSchema = z.object({
  positioning: z.string().default(""),
  sports: z.array(z.enum(sportKeys)).default([]),
  profiles: z.array(z.string()).default([]),
  strengths: z.array(z.string()).default([]),
  limits: z.array(z.string()).default([]),
  alternatives: z.array(z.string()).default([]), // slugs
  guides: z.array(z.string()).default([]), // slugs d'articles
  /** Observations documentées (tests réels, avec source) — vide tant qu'aucun test n'a été fait. */
  observations: z.array(z.object({ text: z.string(), source: z.string() })).default([]),
  /** Attributs d'aide à la décision, renseignés par l'équipe à partir des données vérifiées */
  decision: z
    .object({
      tier: z.enum(["entree", "milieu", "haut", "expert"]).nullable().default(null),
      sizeClass: z.enum(["compact", "standard", "large"]).nullable().default(null),
      batteryClass: z.enum(["courte", "moyenne", "longue", "tres-longue"]).nullable().default(null),
    })
    .prefault({}),
});
export type DeviceEditorial = z.infer<typeof deviceEditorialSchema>;

export const deviceSourceSchema = z.object({ label: z.string(), url: z.string().url(), accessedAt: z.string().nullable().default(null) });

/** Fichier de données d'un équipement (data/devices/*.json) */
export const deviceFileSchema = z.object({
  slug: z.string(),
  model: z.string(),
  variant: z.string().nullable().default(null),
  family: z.string(),
  category: z.enum(deviceCategories),
  status: z.enum(["draft", "review", "published", "archived"]).default("published"),
  officialUrl: z.string().url().nullable().default(null),
  lastVerifiedAt: z.string().nullable().default(null),
  spec: deviceSpecSchema,
  editorial: deviceEditorialSchema,
  sources: z.array(deviceSourceSchema).default([]),
});
export type DeviceFile = z.infer<typeof deviceFileSchema>;

export type Device = {
  id: number;
  slug: string;
  model: string;
  variant: string | null;
  family: string;
  category: DeviceCategory;
  status: "draft" | "review" | "published" | "archived";
  officialUrl: string | null;
  lastVerifiedAt: Date | null;
  spec: DeviceSpec;
  editorial: DeviceEditorial;
  sources: { label: string; url: string; accessedAt: Date | null }[];
};

export function deviceDisplayName(d: Pick<Device, "model" | "variant">): string {
  return d.variant ? `${d.model} (${d.variant})` : d.model;
}
