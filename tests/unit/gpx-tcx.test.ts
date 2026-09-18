import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { parseGpx, buildGpx } from "@/lib/tools/gpx";
import { parseTcx, buildTcx } from "@/lib/tools/tcx";
import { analyzeActivity } from "@/lib/tools/analyze";
import { anonymizeStartEnd } from "@/lib/tools/privacy";
import { checkXmlSafety } from "@/lib/tools/xml-safety";
import { allPoints } from "@/lib/tools/activity-model";

const fx = (n: string) => readFileSync(`tests/fixtures/${n}`, "utf8");

describe("sécurité XML", () => {
  it("refuse DOCTYPE/ENTITY", () => {
    const r = checkXmlSafety(fx("malicious-xxe.gpx"), 200);
    expect(r.ok).toBe(false);
  });
  it("refuse un fichier vide et un XML non GPX/TCX", () => {
    expect(checkXmlSafety(fx("empty.gpx"), 0).ok).toBe(false);
    expect(checkXmlSafety(fx("not-gpx.xml"), 50).ok).toBe(false);
  });
  it("refuse un fichier trop gros", () => {
    expect(checkXmlSafety("<gpx/>", 30 * 1024 * 1024).ok).toBe(false);
  });
  it("accepte un GPX valide", () => {
    expect(checkXmlSafety(fx("sample-activity.gpx"), 1000).ok).toBe(true);
  });
});

describe("GPX", () => {
  it("lit une activité avec extensions", () => {
    const m = parseGpx(fx("sample-activity.gpx"));
    expect(m.kind).toBe("activity");
    expect(m.creator).toBe("Fixture Garmin.ma");
    expect(allPoints(m)).toHaveLength(5);
    expect(m.fieldsPresent.has("hr")).toBe(true);
    expect(m.fieldsPresent.has("cad")).toBe(true);
    expect(allPoints(m)[0].hr).toBe(120);
  });
  it("n'expanse pas les entités même si le DOCTYPE passait", () => {
    const m = parseGpx('<gpx version="1.1" creator="x"><metadata><name>&amp;xxe;</name></metadata></gpx>');
    expect(m.metadataName).toContain("xxe");
  });
  it("analyse : distance, dénivelé, anomalies", () => {
    const m = parseGpx(fx("sample-activity.gpx"));
    const a = analyzeActivity(m);
    expect(a.pointCount).toBe(5);
    expect(a.distanceM).toBeGreaterThan(500);
    expect(a.distanceM).toBeLessThan(700);
    expect(a.durationSec).toBe(120);
    expect(a.avgHr).toBeCloseTo(139, 0);
    expect(a.anomalies.filter((x) => x.severity === "warning")).toHaveLength(0);
  });
  it("détecte un saut de position et un horodatage inversé", () => {
    const xml = fx("sample-activity.gpx").replace('lat="33.5990" lon="-7.6740"', 'lat="35.5990" lon="-7.6740"').replace("2026-03-01T06:01:30Z", "2026-03-01T05:59:30Z");
    const a = analyzeActivity(parseGpx(xml));
    expect(a.anomalies.some((x) => x.message.includes("saut"))).toBe(true);
    expect(a.anomalies.some((x) => x.message.includes("désordre"))).toBe(true);
  });
  it("réécrit un GPX sans perte des champs standards", () => {
    const m = parseGpx(fx("sample-activity.gpx"));
    const { xml, report } = buildGpx(m);
    const m2 = parseGpx(xml);
    expect(allPoints(m2)).toHaveLength(5);
    expect(allPoints(m2)[2].hr).toBe(142);
    expect(report.lost).toHaveLength(0);
    expect(xml).toContain("gpxtpx:hr");
  });
});

describe("TCX", () => {
  it("lit une activité avec laps, FC, cadence, extensions", () => {
    const m = parseTcx(fx("sample-activity.tcx"));
    expect(m.kind).toBe("activity");
    expect(m.sport).toBe("Running");
    expect(m.laps).toHaveLength(1);
    expect(m.laps[0].avgHr).toBe(140);
    const pts = allPoints(m);
    expect(pts).toHaveLength(3);
    expect(pts[0].power).toBe(250);
    expect(pts[0].speed).toBe(3);
    expect(pts[1].distance).toBe(145);
  });
  it("lit un parcours (Course) avec CoursePoints", () => {
    const m = parseTcx(fx("sample-course.tcx"));
    expect(m.kind).toBe("course");
    expect(m.courseName).toBe("Boucle Ifrane");
    expect(m.waypoints).toHaveLength(1);
    expect(allPoints(m)).toHaveLength(3);
  });
});

describe("conversions", () => {
  it("GPX activité → TCX activité, rapport de champs", () => {
    const m = parseGpx(fx("sample-activity.gpx"));
    const { xml, report } = buildTcx(m);
    const back = parseTcx(xml);
    expect(back.kind).toBe("activity");
    expect(allPoints(back)).toHaveLength(5);
    expect(allPoints(back)[0].hr).toBe(120);
    expect(report.kept).toContain("hr");
    expect(report.transformed.some((t) => t.includes("DistanceMeters"))).toBe(true);
  });
  it("TCX activité → GPX : laps perdus, distance perdue, signalés", () => {
    const m = parseTcx(fx("sample-activity.tcx"));
    const { xml, report } = buildGpx(m);
    const back = parseGpx(xml);
    expect(allPoints(back)).toHaveLength(3);
    expect(allPoints(back)[0].hr).toBe(130);
    expect(report.lost.some((l) => l.includes("lap"))).toBe(true);
    expect(report.lost.some((l) => l.includes("DistanceMeters"))).toBe(true);
  });
  it("TCX parcours → GPX → TCX parcours (sans horodatage)", () => {
    const m = parseTcx(fx("sample-course.tcx"));
    const g = buildGpx(m);
    const m2 = parseGpx(g.xml);
    expect(m2.waypoints).toHaveLength(1);
    const t = buildTcx(m2);
    const m3 = parseTcx(t.xml);
    expect(m3.kind).toBe("course");
    expect(allPoints(m3)).toHaveLength(3);
    expect(t.report.transformed.some((x) => x.includes("parcours TCX"))).toBe(true);
  });
});

describe("confidentialité GPS", () => {
  it("retire les points proches du départ et de l'arrivée sans modifier l'original", () => {
    const m = parseGpx(fx("sample-activity.gpx"));
    const before = allPoints(m).length;
    const r = anonymizeStartEnd(m, { startRadiusM: 200, endRadiusM: 200 });
    expect(allPoints(m)).toHaveLength(before);
    expect(r.removedStart).toBeGreaterThanOrEqual(1);
    expect(r.removedEnd).toBeGreaterThanOrEqual(1);
    expect(r.kept + r.removedStart + r.removedEnd).toBe(before);
    expect(r.notes.length).toBeGreaterThan(0);
  });
  it("signale quand tout est retiré", () => {
    const m = parseGpx(fx("sample-activity.gpx"));
    const r = anonymizeStartEnd(m, { startRadiusM: 5000, endRadiusM: 5000 });
    expect(r.kept).toBe(0);
    expect(r.notes.some((n) => n.includes("Tous les points"))).toBe(true);
  });
});
