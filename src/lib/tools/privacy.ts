import type { ActivityModel, TrackPoint } from "./activity-model";
import { haversineM } from "./geo";

export type PrivacyOptions = { startRadiusM: number; endRadiusM: number; dropWaypoints?: boolean; stripMetadataName?: boolean };
export type PrivacyResult = { model: ActivityModel; removedStart: number; removedEnd: number; removedWaypoints: number; kept: number; notes: string[] };

function clonePoints(pts: TrackPoint[]): TrackPoint[] {
  return pts.map((p) => ({ ...p }));
}

/**
 * Retire les points situés dans un rayon autour du premier et du dernier point de la trace.
 * Produit une COPIE ; le modèle d'origine n'est jamais modifié.
 * Limites : masque une zone, pas un domicile — recoupement possible par les points restants,
 * les horodatages, les autres activités ou des tiers.
 */
export function anonymizeStartEnd(model: ActivityModel, opts: PrivacyOptions): PrivacyResult {
  const notes: string[] = [];
  const out: ActivityModel = {
    ...model,
    tracks: model.tracks.map((t) => ({ ...t, segments: t.segments.map((s) => ({ points: clonePoints(s.points) })) })),
    routes: model.routes.map((r) => ({ ...r, points: clonePoints(r.points) })),
    waypoints: opts.dropWaypoints ? [] : [...model.waypoints],
    laps: model.laps.map((l) => ({ ...l, trackIndices: [...l.trackIndices] })),
    fieldsPresent: new Set(model.fieldsPresent),
    warnings: [...model.warnings],
  };
  if (opts.stripMetadataName) {
    out.metadataName = null;
    out.tracks.forEach((t) => (t.name = null));
  }
  const removedWaypoints = opts.dropWaypoints ? model.waypoints.length : 0;

  const flat: { seg: { points: TrackPoint[] }; idx: number; p: TrackPoint }[] = [];
  for (const t of out.tracks) for (const s of t.segments) s.points.forEach((p, idx) => flat.push({ seg: s, idx, p }));
  const coords = flat.filter((f) => f.p.lat !== null && f.p.lon !== null);
  if (coords.length < 2) {
    notes.push("Pas assez de points géolocalisés pour appliquer un masquage.");
    return { model: out, removedStart: 0, removedEnd: 0, removedWaypoints, kept: flat.length, notes };
  }
  const start = coords[0].p as TrackPoint & { lat: number; lon: number };
  const end = coords[coords.length - 1].p as TrackPoint & { lat: number; lon: number };
  const toDrop = new Set<TrackPoint>();
  let removedStart = 0, removedEnd = 0;
  // Départ : on retire les points consécutifs depuis le début tant qu'ils sont dans le rayon.
  for (const f of coords) {
    const d = haversineM(start, f.p as TrackPoint & { lat: number; lon: number });
    if (d <= opts.startRadiusM) { toDrop.add(f.p); removedStart++; } else break;
  }
  for (let i = coords.length - 1; i >= 0; i--) {
    const f = coords[i];
    if (toDrop.has(f.p)) break;
    const d = haversineM(end, f.p as TrackPoint & { lat: number; lon: number });
    if (d <= opts.endRadiusM) { toDrop.add(f.p); removedEnd++; } else break;
  }
  for (const t of out.tracks) for (const s of t.segments) s.points = s.points.filter((p) => !toDrop.has(p));
  const kept = out.tracks.reduce((n, t) => n + t.segments.reduce((m, s) => m + s.points.length, 0), 0);
  if (kept === 0) notes.push("Tous les points ont été retirés : rayon trop grand pour cette trace.");
  if (haversineM(start, end) < Math.max(opts.startRadiusM, opts.endRadiusM)) notes.push("Départ et arrivée sont proches : une boucle reste identifiable par sa forme générale.");
  notes.push("Les horodatages des points conservés ne sont pas modifiés : l'heure de départ réelle reste déductible.");
  return { model: out, removedStart, removedEnd, removedWaypoints, kept, notes };
}
