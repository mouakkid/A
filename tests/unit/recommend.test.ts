import { describe, it, expect } from "vitest";
import { recommend, type Answers } from "@/lib/recommend/engine";
import { deviceSpecSchema, deviceEditorialSchema, type Device } from "@/lib/catalog/types";

function mk(partial: Partial<Device> & { slug: string; model: string }, spec: Record<string, unknown> = {}, editorial: Record<string, unknown> = {}): Device {
  return {
    id: 1,
    variant: null,
    family: "Test",
    category: "montre-running",
    status: "published",
    officialUrl: null,
    lastVerifiedAt: null,
    sources: [],
    ...partial,
    spec: deviceSpecSchema.parse(spec),
    editorial: deviceEditorialSchema.parse(editorial),
  };
}

const runnerBudget = mk({ slug: "run-basic", model: "Run Basic" }, { price: { amount: 249, currency: "EUR", market: "FR" }, display: { type: "AMOLED" }, maps: { preloadedMaps: false } }, { sports: ["running"], decision: { tier: "entree", sizeClass: "compact", batteryClass: "moyenne" } });
const trailMaps = mk({ slug: "trail-pro", model: "Trail Pro", category: "montre-multisport" }, { price: { amount: 749, currency: "EUR", market: "FR" }, display: { type: "MIP" }, maps: { preloadedMaps: true }, gnss: { multiband: true }, features: { solar: true, flashlight: true } }, { sports: ["trail", "running", "randonnee"], decision: { tier: "expert", sizeClass: "large", batteryClass: "tres-longue" } });
const bike = mk({ slug: "edge-x", model: "Edge X", category: "compteur-velo" }, { price: { amount: 399, currency: "EUR", market: "FR" }, maps: { preloadedMaps: true } }, { sports: ["cyclisme"], decision: { tier: "milieu", sizeClass: null, batteryClass: "longue" } });
const sensor = mk({ slug: "hrm", model: "HRM", category: "capteur-accessoire" }, {}, {});

const base: Answers = { mainSport: "running", secondarySports: [], budget: "moins-300", level: "debutant", frequency: "1-2", priority: "equilibre", size: "indifferent", maps: "indifferent", extras: [] };

describe("moteur de recommandation", () => {
  it("place la montre running d'entrée de gamme devant pour un débutant à petit budget", () => {
    const r = recommend([runnerBudget, trailMaps, bike, sensor], base);
    expect(r.recommendations[0].device.slug).toBe("run-basic");
    expect(r.recommendations[0].reasons.some((x) => x.kind === "plus" && x.text.includes("sport principal"))).toBe(true);
    expect(r.recommendations.every((x) => x.device.category !== "capteur-accessoire")).toBe(true);
  });
  it("exclut les compteurs vélo hors cyclisme et les inclut pour le cyclisme", () => {
    const r1 = recommend([runnerBudget, bike], base);
    expect(r1.recommendations.map((x) => x.device.slug)).not.toContain("edge-x");
    const r2 = recommend([runnerBudget, bike], { ...base, mainSport: "cyclisme", budget: "300-500" });
    expect(r2.recommendations[0].device.slug).toBe("edge-x");
  });
  it("favorise la cartographie et l'autonomie pour un traileur confirmé", () => {
    const r = recommend([runnerBudget, trailMaps], { ...base, mainSport: "trail", level: "confirme", frequency: "5-plus", priority: "autonomie", maps: "oui", budget: "plus-800", extras: ["solaire", "lampe"] });
    expect(r.recommendations[0].device.slug).toBe("trail-pro");
    expect(r.recommendations[0].relevantFeatures).toContain("Cartographie intégrée");
    expect(r.recommendations[0].relevantFeatures).toContain("Recharge solaire");
    const second = r.recommendations[1];
    expect(second.reasons.some((x) => x.kind === "minus" && x.text.includes("cartes"))).toBe(true);
  });
  it("signale des données insuffisantes quand rien ne correspond", () => {
    const r = recommend([sensor], base);
    expect(r.insufficientData).toBe(true);
  });
  it("mentionne un prix non vérifié plutôt que d'inventer", () => {
    const noPrice = mk({ slug: "np", model: "No Price" }, {}, { sports: ["running"] });
    const r = recommend([noPrice, runnerBudget], base);
    const np = r.recommendations.find((x) => x.device.slug === "np")!;
    expect(np.reasons.some((x) => x.text.includes("non vérifié"))).toBe(true);
  });
  it("décrit les différences entre propositions", () => {
    const r = recommend([runnerBudget, trailMaps], { ...base, budget: "indifferent" });
    expect(r.differences.some((d) => d.startsWith("Écrans"))).toBe(true);
    expect(r.differences.some((d) => d.startsWith("Cartes"))).toBe(true);
  });
});
