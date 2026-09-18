import { allPoints, type ActivityModel, type TrackPoint } from "./activity-model";
import { haversineM, isValidLat, isValidLon } from "./geo";

export type Anomaly = { severity: "info" | "warning"; message: string };

export type AnalysisSummary = {
  kind: ActivityModel["kind"];
  format: ActivityModel["format"];
  creator: string | null;
  name: string | null;
  sport: string | null;
  pointCount: number;
  trackCount: number;
  segmentCount: number;
  routeCount: number;
  waypointCount: number;
  lapCount: number;
  fields: string[];
  startTime: string | null;
  endTime: string | null;
  durationSec: number | null;
  distanceM: number | null;
  elevationGainM: number | null;
  elevationLossM: number | null;
  minEle: number | null;
  maxEle: number | null;
  avgHr: number | null;
  maxHr: number | null;
  avgCad: number | null;
  avgPower: number | null;
  bbox: { minLat: number; maxLat: number; minLon: number; maxLon: number } | null;
  timezoneNote: string;
  anomalies: Anomaly[];
  warnings: string[];
};

function mean(xs: number[]): number | null {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
}

/** Résumé lisible et détection d'anomalies plausibles (sans modifier les données). */
export function analyzeActivity(model: ActivityModel): AnalysisSummary {
  const points = allPoints(model);
  const anomalies: Anomaly[] = [];
  const valid = points.filter((p): p is TrackPoint & { lat: number; lon: number } => p.lat !== null && p.lon !== null && isValidLat(p.lat) && isValidLon(p.lon));

  // temps
  const times = points.map((p) => (p.time ? Date.parse(p.time) : NaN)).filter((t) => Number.isFinite(t));
  let startTime: string | null = null, endTime: string | null = null, durationSec: number | null = null;
  if (times.length) {
    startTime = new Date(Math.min(...times)).toISOString();
    endTime = new Date(Math.max(...times)).toISOString();
    durationSec = (Math.max(...times) - Math.min(...times)) / 1000;
    let backwards = 0, gaps = 0, dup = 0;
    for (let i = 1; i < times.length; i++) {
      const d = times[i] - times[i - 1];
      if (d < 0) backwards++;
      else if (d === 0) dup++;
      else if (d > 5 * 60 * 1000) gaps++;
    }
    if (backwards) anomalies.push({ severity: "warning", message: `${backwards} horodatage(s) dans le désordre (retour en arrière).` });
    if (dup > points.length * 0.05 && dup > 5) anomalies.push({ severity: "info", message: `${dup} horodatages dupliqués (points enregistrés à la même seconde).` });
    if (gaps) anomalies.push({ severity: "info", message: `${gaps} pause(s) de plus de 5 minutes détectée(s) (arrêt ou perte de signal).` });
  }
  const unparsable = points.filter((p) => p.time && !Number.isFinite(Date.parse(p.time))).length;
  if (unparsable) anomalies.push({ severity: "warning", message: `${unparsable} horodatage(s) illisible(s) (format non ISO 8601).` });

  // distance et vitesse
  let distance = 0, maxSpeedKmh = 0, jumps = 0, zeroMoves = 0;
  for (let i = 1; i < valid.length; i++) {
    const d = haversineM(valid[i - 1], valid[i]);
    distance += d;
    if (d === 0) zeroMoves++;
    const t1 = valid[i - 1].time ? Date.parse(valid[i - 1].time as string) : NaN;
    const t2 = valid[i].time ? Date.parse(valid[i].time as string) : NaN;
    if (Number.isFinite(t1) && Number.isFinite(t2) && t2 > t1) {
      const kmh = (d / ((t2 - t1) / 1000)) * 3.6;
      if (kmh > maxSpeedKmh) maxSpeedKmh = kmh;
      if (kmh > 150) jumps++;
    } else if (d > 2000) jumps++;
  }
  if (jumps) anomalies.push({ severity: "warning", message: `${jumps} saut(s) de position improbable(s) (vitesse > 150 km/h ou bond > 2 km sans horodatage).` });
  if (valid.length > 10 && zeroMoves > valid.length * 0.5) anomalies.push({ severity: "info", message: "Plus de la moitié des points sont immobiles (enregistrement à l'arrêt ?)." });

  // altitude
  const eles = points.map((p) => p.ele).filter((e): e is number => e !== null);
  let gain = 0, loss = 0;
  const smoothed: number[] = [];
  for (let i = 0; i < eles.length; i++) {
    const w = eles.slice(Math.max(0, i - 2), i + 3);
    smoothed.push(w.reduce((a, b) => a + b, 0) / w.length);
  }
  for (let i = 1; i < smoothed.length; i++) {
    const d = smoothed[i] - smoothed[i - 1];
    if (d > 0) gain += d;
    else loss -= d;
  }
  if (eles.some((e) => e < -500 || e > 9000)) anomalies.push({ severity: "warning", message: "Altitudes hors plage plausible (−500 m à 9 000 m)." });
  if (eles.length && eles.length < points.length * 0.5) anomalies.push({ severity: "info", message: "Altitude absente sur plus de la moitié des points." });

  // fréquence cardiaque
  const hrs = points.map((p) => p.hr).filter((h): h is number => h !== null);
  if (hrs.some((h) => h < 25 || h > 240)) anomalies.push({ severity: "warning", message: "Valeurs de fréquence cardiaque hors plage plausible (25–240 bpm)." });
  const cads = points.map((p) => p.cad).filter((c): c is number => c !== null);
  const pows = points.map((p) => p.power).filter((c): c is number => c !== null);

  const bbox = valid.length
    ? { minLat: Math.min(...valid.map((p) => p.lat)), maxLat: Math.max(...valid.map((p) => p.lat)), minLon: Math.min(...valid.map((p) => p.lon)), maxLon: Math.max(...valid.map((p) => p.lon)) }
    : null;
  if (valid.length && valid.length < points.length) anomalies.push({ severity: "warning", message: `${points.length - valid.length} point(s) sans coordonnées valides ignoré(s) dans les calculs.` });
  if (valid.every((p) => p.lat === 0 && p.lon === 0) && valid.length) anomalies.push({ severity: "warning", message: "Tous les points sont à (0, 0) : trace invalide." });

  // rythme moyen implausible
  if (durationSec && distance > 0 && durationSec > 0) {
    const kmh = (distance / durationSec) * 3.6;
    if (model.sport?.toLowerCase().includes("run") && kmh > 30) anomalies.push({ severity: "warning", message: `Vitesse moyenne ${kmh.toFixed(1)} km/h improbable pour une course à pied.` });
  }

  return {
    kind: model.kind,
    format: model.format,
    creator: model.creator,
    name: model.metadataName ?? model.tracks[0]?.name ?? model.routes[0]?.name ?? model.courseName,
    sport: model.sport ?? model.tracks[0]?.type ?? null,
    pointCount: points.length,
    trackCount: model.tracks.length,
    segmentCount: model.tracks.reduce((n, t) => n + t.segments.length, 0),
    routeCount: model.routes.length,
    waypointCount: model.waypoints.length,
    lapCount: model.laps.length,
    fields: Array.from(model.fieldsPresent),
    startTime,
    endTime,
    durationSec,
    distanceM: valid.length > 1 ? distance : null,
    elevationGainM: eles.length > 1 ? gain : null,
    elevationLossM: eles.length > 1 ? loss : null,
    minEle: eles.length ? Math.min(...eles) : null,
    maxEle: eles.length ? Math.max(...eles) : null,
    avgHr: mean(hrs),
    maxHr: hrs.length ? Math.max(...hrs) : null,
    avgCad: mean(cads),
    avgPower: mean(pows),
    bbox,
    timezoneNote: "Les horodatages sont conservés tels quels (normalement en UTC, suffixe Z). L'affichage local utilise le fuseau Africa/Casablanca sans modifier le fichier.",
    anomalies,
    warnings: model.warnings,
  };
}
