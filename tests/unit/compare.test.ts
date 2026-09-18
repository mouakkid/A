import { describe, it, expect } from "vitest";
import { buildComparison, decisiveDifferences } from "@/lib/catalog/compare";
import { deviceSpecSchema, deviceEditorialSchema, type Device } from "@/lib/catalog/types";

function mk(slug: string, spec: Record<string, unknown>): Device {
  return { id: 1, slug, model: slug, variant: null, family: "F", category: "montre-running", status: "published", officialUrl: null, lastVerifiedAt: null, sources: [], spec: deviceSpecSchema.parse(spec), editorial: deviceEditorialSchema.parse({}) };
}

describe("comparateur", () => {
  const a = mk("A", { weightG: 47, display: { type: "AMOLED" }, maps: { preloadedMaps: true }, battery: [{ mode: "Montre", claim: "13 jours" }] });
  const b = mk("B", { weightG: 47, display: { type: "MIP" }, maps: { preloadedMaps: false }, battery: [{ mode: "Montre", claim: "13 jours" }] });
  const c = mk("C", { weightG: null, display: { type: "AMOLED" } });

  it("marque uniquement les lignes qui diffèrent (valeurs connues)", () => {
    const g = buildComparison([a, b]);
    const rows = g.flatMap((x) => x.rows);
    expect(rows.find((r) => r.key === "weightG")!.differs).toBe(false);
    expect(rows.find((r) => r.key === "display.type")!.differs).toBe(true);
    expect(rows.find((r) => r.key === "battery")!.differs).toBe(false);
  });
  it("ne considère pas « inconnu » comme une différence", () => {
    const g = buildComparison([a, c]);
    const rows = g.flatMap((x) => x.rows);
    expect(rows.find((r) => r.key === "weightG")!.differs).toBe(false);
    expect(rows.find((r) => r.key === "weightG")!.cells[1].kind).toBe("unknown");
  });
  it("résume les différences décisives sans désigner de gagnant", () => {
    const d = decisiveDifferences([a, b]);
    expect(d.some((x) => x.includes("Cartographie intégrée vérifiée"))).toBe(true);
    expect(d.some((x) => x.toLowerCase().includes("gagnant"))).toBe(false);
  });
});
