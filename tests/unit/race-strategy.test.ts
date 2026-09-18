import { describe, it, expect } from "vitest";
import { buildStrategy, strategySummary } from "@/lib/tools/race-strategy";

describe("stratégie de course", () => {
  it("allure régulière : total exact", () => {
    const s = buildStrategy(10000, 3000, "even");
    expect(s).toHaveLength(10);
    expect(strategySummary(s).totalSec).toBeCloseTo(3000, 6);
    expect(s.every((x) => Math.abs(x.secPerKm - 300) < 1e-9)).toBe(true);
  });
  it("negative split : première moitié plus lente, total conservé", () => {
    const s = buildStrategy(10000, 3000, "negative", { negativeSplitPct: 2 });
    const sum = strategySummary(s);
    expect(sum.totalSec).toBeCloseTo(3000, 6);
    expect(sum.firstHalfSec).toBeGreaterThan(sum.secondHalfSec);
  });
  it("gère les distances non multiples", () => {
    const s = buildStrategy(21097.5, 6000, "even");
    expect(s).toHaveLength(22);
    expect(s[21].toM).toBe(21097.5);
    expect(strategySummary(s).totalSec).toBeCloseTo(6000, 6);
  });
  it("applique un ajustement manuel", () => {
    const s = buildStrategy(3000, 900, "even", { manualAdjustments: { 1: 330 } });
    expect(s[1].secPerKm).toBe(330);
    expect(strategySummary(s).totalSec).toBeCloseTo(930, 6);
  });
});
