import { describe, it, expect } from "vitest";
import { computeZones, estimateMaxHr } from "@/lib/tools/hr-zones";

describe("zones FC", () => {
  it("estime la FC max par 220 − âge", () => {
    expect(estimateMaxHr(40)).toBe(180);
    expect(() => estimateMaxHr(5)).toThrow();
  });
  it("calcule les zones en % de FCmax", () => {
    const z = computeZones("max-percent", { maxHr: 180 });
    expect(z).toHaveLength(5);
    expect(z[1].low).toBe(108);
    expect(z[1].high).toBe(126);
    expect(z[4].high).toBe(180);
  });
  it("applique Karvonen avec la FC de repos", () => {
    const z = computeZones("karvonen", { maxHr: 180, restHr: 60 });
    expect(z[1].low).toBe(60 + 120 * 0.6);
    expect(z[1].high).toBe(60 + 120 * 0.7);
  });
  it("calcule les zones LTHR", () => {
    const z = computeZones("lthr", { lthr: 170 });
    expect(z[4].low).toBe(170);
    expect(z[0].high).toBe(Math.round(170 * 0.85));
  });
  it("valide les entrées", () => {
    expect(() => computeZones("max-percent", { maxHr: 50 })).toThrow();
    expect(() => computeZones("karvonen", { maxHr: 180, restHr: 200 })).toThrow();
    expect(() => computeZones("lthr", {})).toThrow();
  });
});
