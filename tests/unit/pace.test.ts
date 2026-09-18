import { describe, it, expect } from "vitest";
import { paceSecPerKmFromSpeedKmh, speedKmhFromPaceSecPerKm, paceSecPerMileFromSecPerKm, timeForDistance, paceForTarget, formatDuration, formatPace, parseDuration, splitsForDistance } from "@/lib/tools/pace";

describe("allure / vitesse", () => {
  it("convertit 12 km/h en 5:00 /km", () => {
    expect(paceSecPerKmFromSpeedKmh(12)).toBe(300);
    expect(speedKmhFromPaceSecPerKm(300)).toBe(12);
  });
  it("convertit s/km en s/mile", () => {
    expect(paceSecPerMileFromSecPerKm(300)).toBeCloseTo(482.8, 1);
  });
  it("calcule le temps marathon à 5:00/km", () => {
    expect(formatDuration(timeForDistance(42195, 300))).toBe("3:30:59");
  });
  it("calcule l'allure pour 10 km en 50 min", () => {
    expect(paceForTarget(10000, 3000)).toBe(300);
    expect(formatPace(300)).toBe("5:00 /km");
  });
  it("rejette les valeurs non positives", () => {
    expect(() => paceSecPerKmFromSpeedKmh(0)).toThrow();
    expect(() => paceForTarget(0, 10)).toThrow();
  });
  it("analyse les durées", () => {
    expect(parseDuration("1:30:00")).toBe(5400);
    expect(parseDuration("45:30")).toBe(2730);
    expect(parseDuration("5")).toBe(300);
    expect(parseDuration("abc")).toBeNull();
    expect(parseDuration("1:2:3:4")).toBeNull();
  });
  it("produit des passages avec dernier segment partiel", () => {
    const s = splitsForDistance(2500, 300);
    expect(s).toHaveLength(3);
    expect(s[2].distanceM).toBe(2500);
    expect(s[2].splitSec).toBe(150);
    expect(s[2].cumulativeSec).toBe(750);
  });
});
