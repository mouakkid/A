/**
 * Modèle intermédiaire commun entre GPX et TCX.
 * Chaque champ est conservé tel quel ; les pertes lors des conversions sont rapportées explicitement.
 */
export type TrackPoint = {
  lat: number | null;
  lon: number | null;
  ele: number | null;
  time: string | null; // ISO 8601 tel que lu (non réinterprété)
  hr: number | null;
  cad: number | null;
  power: number | null;
  temp: number | null;
  distance: number | null; // TCX DistanceMeters
  speed: number | null;
  extensionsRaw?: Record<string, unknown>;
};

export type Segment = { points: TrackPoint[] };

export type Track = {
  name: string | null;
  type: string | null;
  segments: Segment[];
};

export type Lap = {
  startTime: string | null;
  totalTimeSec: number | null;
  distanceM: number | null;
  calories: number | null;
  avgHr: number | null;
  maxHr: number | null;
  trackIndices: number[]; // segments dans track.segments
};

export type Waypoint = { lat: number; lon: number; name: string | null; ele: number | null; time: string | null };

export type ActivityModel = {
  format: "gpx" | "tcx";
  kind: "activity" | "course" | "track" | "route" | "waypoints-only";
  creator: string | null;
  metadataName: string | null;
  metadataTime: string | null;
  sport: string | null;
  tracks: Track[];
  routes: { name: string | null; points: TrackPoint[] }[];
  waypoints: Waypoint[];
  laps: Lap[];
  courseName: string | null;
  fieldsPresent: Set<string>;
  warnings: string[];
};

export function emptyModel(format: "gpx" | "tcx"): ActivityModel {
  return { format, kind: "track", creator: null, metadataName: null, metadataTime: null, sport: null, tracks: [], routes: [], waypoints: [], laps: [], courseName: null, fieldsPresent: new Set(), warnings: [] };
}

export function allPoints(model: ActivityModel): TrackPoint[] {
  const out: TrackPoint[] = [];
  for (const t of model.tracks) for (const s of t.segments) out.push(...s.points);
  for (const r of model.routes) out.push(...r.points);
  return out;
}
