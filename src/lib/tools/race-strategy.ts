import { formatDuration } from "./pace";

export type StrategyKind = "even" | "negative";
export type StrategySegment = { index: number; fromM: number; toM: number; secPerKm: number; segmentSec: number; cumulativeSec: number; label: string };

/**
 * Plan de passages pour une distance et un temps cible.
 * - "even" : allure constante.
 * - "negative" : première moitié plus lente de `negativeSplitPct` %, seconde moitié plus rapide, en conservant le temps total.
 * Aucune prédiction de performance : c'est une arithmétique de répartition.
 */
export function buildStrategy(distanceM: number, targetSec: number, kind: StrategyKind, opts: { segmentM?: number; negativeSplitPct?: number; manualAdjustments?: Record<number, number> } = {}): StrategySegment[] {
  if (distanceM <= 0 || targetSec <= 0) throw new RangeError("Distance et temps doivent être positifs.");
  const segmentM = opts.segmentM ?? 1000;
  const pct = Math.min(0.1, Math.max(0, (opts.negativeSplitPct ?? 2) / 100));
  const avg = targetSec / (distanceM / 1000);
  const half = distanceM / 2;

  const segs: StrategySegment[] = [];
  let covered = 0;
  let cumulative = 0;
  let i = 0;
  while (covered < distanceM - 1e-6) {
    const to = Math.min(covered + segmentM, distanceM);
    const mid = (covered + to) / 2;
    let pace = avg;
    if (kind === "negative") pace = mid < half ? avg * (1 + pct) : avg * (1 - pct);
    const adj = opts.manualAdjustments?.[i];
    if (typeof adj === "number" && Number.isFinite(adj)) pace = adj;
    const segmentSec = ((to - covered) / 1000) * pace;
    cumulative += segmentSec;
    segs.push({ index: i, fromM: covered, toM: to, secPerKm: pace, segmentSec, cumulativeSec: cumulative, label: `${(to / 1000).toFixed(to % 1000 === 0 ? 0 : 3).replace(".", ",")} km` });
    covered = to;
    i++;
  }
  return segs;
}

export function strategySummary(segs: StrategySegment[]): { totalSec: number; totalLabel: string; firstHalfSec: number; secondHalfSec: number } {
  const total = segs.length ? segs[segs.length - 1].cumulativeSec : 0;
  const distance = segs.length ? segs[segs.length - 1].toM : 0;
  let first = 0;
  for (const s of segs) {
    if (s.toM <= distance / 2) first += s.segmentSec;
    else if (s.fromM < distance / 2) first += s.segmentSec * ((distance / 2 - s.fromM) / (s.toM - s.fromM));
  }
  return { totalSec: total, totalLabel: formatDuration(total), firstHalfSec: first, secondHalfSec: total - first };
}
