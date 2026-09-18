/**
 * Conversions allure / vitesse / temps. Fonctions pures, testées.
 * Unités : secondes, mètres, km/h. Les fonctions ne font aucune hypothèse physiologique.
 */
export const MILE_M = 1609.344;

export const standardDistances: { key: string; label: string; meters: number }[] = [
  { key: "5k", label: "5 km", meters: 5000 },
  { key: "10k", label: "10 km", meters: 10000 },
  { key: "semi", label: "Semi-marathon (21,0975 km)", meters: 21097.5 },
  { key: "marathon", label: "Marathon (42,195 km)", meters: 42195 },
];

export function paceSecPerKmFromSpeedKmh(kmh: number): number {
  if (kmh <= 0) throw new RangeError("La vitesse doit être positive.");
  return 3600 / kmh;
}
export function speedKmhFromPaceSecPerKm(secPerKm: number): number {
  if (secPerKm <= 0) throw new RangeError("L'allure doit être positive.");
  return 3600 / secPerKm;
}
export function paceSecPerMileFromSecPerKm(secPerKm: number): number {
  return secPerKm * (MILE_M / 1000);
}
export function paceSecPerKmFromSecPerMile(secPerMile: number): number {
  return secPerMile / (MILE_M / 1000);
}
/** Temps total (s) pour une distance (m) à une allure (s/km). */
export function timeForDistance(distanceM: number, secPerKm: number): number {
  if (distanceM < 0) throw new RangeError("Distance négative.");
  return (distanceM / 1000) * secPerKm;
}
/** Allure (s/km) nécessaire pour couvrir une distance (m) en un temps (s). */
export function paceForTarget(distanceM: number, totalSec: number): number {
  if (distanceM <= 0) throw new RangeError("La distance doit être positive.");
  if (totalSec <= 0) throw new RangeError("Le temps doit être positif.");
  return totalSec / (distanceM / 1000);
}

/** Formatage mm:ss (ou h:mm:ss au-delà d'une heure). */
export function formatDuration(totalSec: number, opts: { forceHours?: boolean } = {}): string {
  const s = Math.round(totalSec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(sec).padStart(2, "0");
  if (h > 0 || opts.forceHours) return `${h}:${mm}:${ss}`;
  return `${m}:${ss}`;
}
export function formatPace(secPerUnit: number, unit = "km"): string {
  const s = Math.round(secPerUnit);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")} /${unit}`;
}

/** Analyse « h:mm:ss », « mm:ss » ou « m » en secondes ; null si invalide. */
export function parseDuration(input: string): number | null {
  const t = input.trim();
  if (!t) return null;
  const parts = t.split(":").map((p) => p.trim());
  if (parts.some((p) => p === "" || !/^\d+([.,]\d+)?$/.test(p))) return null;
  const nums = parts.map((p) => Number(p.replace(",", ".")));
  if (nums.length === 1) return nums[0] * 60;
  if (nums.length === 2) return nums[0] * 60 + nums[1];
  if (nums.length === 3) return nums[0] * 3600 + nums[1] * 60 + nums[2];
  return null;
}

export type Split = { km: number; distanceM: number; splitSec: number; cumulativeSec: number };

/** Tableau de passages à chaque kilomètre (dernier segment partiel inclus). */
export function splitsForDistance(distanceM: number, secPerKm: number, everyM = 1000): Split[] {
  if (everyM <= 0) throw new RangeError("Intervalle invalide.");
  const out: Split[] = [];
  let covered = 0;
  let cumulative = 0;
  let i = 1;
  while (covered < distanceM - 1e-6) {
    const seg = Math.min(everyM, distanceM - covered);
    const t = (seg / 1000) * secPerKm;
    covered += seg;
    cumulative += t;
    out.push({ km: i, distanceM: covered, splitSec: t, cumulativeSec: cumulative });
    i++;
  }
  return out;
}
