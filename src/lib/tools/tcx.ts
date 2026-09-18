import { XMLParser, XMLBuilder } from "fast-xml-parser";
import { emptyModel, type ActivityModel, type TrackPoint, type Lap } from "./activity-model";
import { MAX_POINTS } from "./xml-safety";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  processEntities: false,
  parseTagValue: false,
  parseAttributeValue: false,
  trimValues: true,
  removeNSPrefix: true,
  isArray: (name) => ["Activity", "Lap", "Track", "Trackpoint", "Course", "CoursePoint"].includes(name),
});

type AnyObj = Record<string, unknown>;
function num(v: unknown): number | null {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(String(typeof v === "object" ? (v as AnyObj)["#text"] ?? "" : v).trim());
  return Number.isFinite(n) ? n : null;
}
function str(v: unknown): string | null {
  if (v === undefined || v === null) return null;
  if (typeof v === "object") {
    const t = (v as AnyObj)["#text"];
    return t === undefined ? null : String(t);
  }
  return String(v);
}
function findDeep(obj: unknown, key: string): unknown {
  if (!obj || typeof obj !== "object") return undefined;
  const o = obj as AnyObj;
  if (key in o) return o[key];
  for (const v of Object.values(o)) {
    if (v && typeof v === "object") {
      const r = findDeep(v, key);
      if (r !== undefined) return r;
    }
  }
  return undefined;
}

function readTrackpoint(tp: AnyObj, fields: Set<string>): TrackPoint {
  const pos = tp.Position as AnyObj | undefined;
  const ext = tp.Extensions as AnyObj | undefined;
  const p: TrackPoint = {
    lat: num(pos?.LatitudeDegrees),
    lon: num(pos?.LongitudeDegrees),
    ele: num(tp.AltitudeMeters),
    time: str(tp.Time),
    hr: num((tp.HeartRateBpm as AnyObj | undefined)?.Value),
    cad: num(tp.Cadence) ?? num(findDeep(ext, "RunCadence")),
    power: num(findDeep(ext, "Watts")),
    temp: null,
    distance: num(tp.DistanceMeters),
    speed: num(findDeep(ext, "Speed")),
  };
  if (p.lat !== null) fields.add("lat");
  if (p.lon !== null) fields.add("lon");
  if (p.ele !== null) fields.add("ele");
  if (p.time !== null) fields.add("time");
  if (p.hr !== null) fields.add("hr");
  if (p.cad !== null) fields.add("cad");
  if (p.power !== null) fields.add("power");
  if (p.distance !== null) fields.add("distance");
  if (p.speed !== null) fields.add("speed");
  if (ext) p.extensionsRaw = ext;
  return p;
}

export function parseTcx(text: string): ActivityModel {
  const doc = parser.parse(text) as AnyObj;
  const root = doc.TrainingCenterDatabase as AnyObj | undefined;
  if (!root) throw new Error("Élément racine <TrainingCenterDatabase> introuvable.");
  const m = emptyModel("tcx");
  const author = root.Author as AnyObj | undefined;
  m.creator = str(author?.Name);
  let count = 0;

  const activities = ((root.Activities as AnyObj | undefined)?.Activity as AnyObj[] | undefined) ?? [];
  for (const act of activities) {
    m.kind = "activity";
    m.sport = str(act["@_Sport"]) ?? m.sport;
    m.metadataTime = str(act.Id) ?? m.metadataTime;
    const track = { name: str(act.Id), type: m.sport, segments: [] as { points: TrackPoint[] }[] };
    const laps = (act.Lap as AnyObj[] | undefined) ?? [];
    for (const lap of laps) {
      const lapModel: Lap = {
        startTime: str(lap["@_StartTime"]),
        totalTimeSec: num(lap.TotalTimeSeconds),
        distanceM: num(lap.DistanceMeters),
        calories: num(lap.Calories),
        avgHr: num((lap.AverageHeartRateBpm as AnyObj | undefined)?.Value),
        maxHr: num((lap.MaximumHeartRateBpm as AnyObj | undefined)?.Value),
        trackIndices: [],
      };
      const tracks = (lap.Track as AnyObj[] | undefined) ?? [];
      for (const t of tracks) {
        const pts = (t.Trackpoint as AnyObj[] | undefined) ?? [];
        const points: TrackPoint[] = [];
        for (const tp of pts) {
          count++;
          if (count > MAX_POINTS) throw new Error(`Trop de points (> ${MAX_POINTS}).`);
          points.push(readTrackpoint(tp, m.fieldsPresent));
        }
        lapModel.trackIndices.push(track.segments.length);
        track.segments.push({ points });
      }
      m.laps.push(lapModel);
    }
    m.tracks.push(track);
  }

  const courses = ((root.Courses as AnyObj | undefined)?.Course as AnyObj[] | undefined) ?? [];
  for (const c of courses) {
    m.kind = "course";
    m.courseName = str(c.Name);
    const track = { name: str(c.Name), type: null, segments: [] as { points: TrackPoint[] }[] };
    const tracks = (c.Track as AnyObj[] | undefined) ?? [];
    for (const t of tracks) {
      const pts = (t.Trackpoint as AnyObj[] | undefined) ?? [];
      track.segments.push({ points: pts.map((tp) => readTrackpoint(tp, m.fieldsPresent)) });
    }
    m.tracks.push(track);
    const cps = (c.CoursePoint as AnyObj[] | undefined) ?? [];
    for (const cp of cps) {
      const pos = cp.Position as AnyObj | undefined;
      const lat = num(pos?.LatitudeDegrees), lon = num(pos?.LongitudeDegrees);
      if (lat !== null && lon !== null) m.waypoints.push({ lat, lon, name: str(cp.Name), ele: num(cp.AltitudeMeters), time: str(cp.Time) });
    }
  }
  if (!activities.length && !courses.length) m.warnings.push("Aucune activité ni parcours trouvé dans le TCX.");
  return m;
}

/* ------------------------------------------------------------------ écriture */
const builder = new XMLBuilder({ ignoreAttributes: false, attributeNamePrefix: "@_", format: true, suppressEmptyNode: true, processEntities: true });

export type BuildReport = { kept: string[]; transformed: string[]; lost: string[] };

function toTrackpoint(p: TrackPoint): Record<string, unknown> | null {
  if (p.time === null) return null; // TCX exige <Time>
  const node: Record<string, unknown> = { Time: p.time };
  if (p.lat !== null && p.lon !== null) node.Position = { LatitudeDegrees: p.lat, LongitudeDegrees: p.lon };
  if (p.ele !== null) node.AltitudeMeters = p.ele;
  if (p.distance !== null) node.DistanceMeters = p.distance;
  if (p.hr !== null) node.HeartRateBpm = { Value: Math.round(p.hr) };
  if (p.cad !== null) node.Cadence = Math.round(p.cad);
  const tpx: Record<string, unknown> = {};
  if (p.speed !== null) tpx["ns3:Speed"] = p.speed;
  if (p.power !== null) tpx["ns3:Watts"] = Math.round(p.power);
  if (Object.keys(tpx).length) node.Extensions = { "ns3:TPX": tpx };
  return node;
}

/** Construit un TCX. Une activité nécessite des horodatages ; sinon on produit un Course (parcours). */
export function buildTcx(model: ActivityModel, opts: { sport?: string } = {}): { xml: string; report: BuildReport } {
  const report: BuildReport = { kept: [], transformed: [], lost: [] };
  const fields = model.fieldsPresent;
  const hasTime = fields.has("time");
  const sport = opts.sport ?? model.sport ?? "Other";

  const allSegs = model.tracks.flatMap((t) => t.segments);
  const points = allSegs.flatMap((s) => s.points);
  const noTime = points.filter((p) => p.time === null).length;

  let body: Record<string, unknown>;
  if (hasTime && noTime === 0 && model.kind !== "route") {
    // Activité : un Lap par segment (ou par lap d'origine si TCX)
    const laps = allSegs.map((s, i) => {
      const tps = s.points.map(toTrackpoint).filter(Boolean);
      const first = s.points[0]?.time ?? model.metadataTime ?? new Date(0).toISOString();
      const last = s.points[s.points.length - 1]?.time ?? first;
      const totalSec = Math.max(0, (Date.parse(last) - Date.parse(first)) / 1000) || 0;
      const src = model.laps[i];
      let dist = src?.distanceM ?? null;
      if (dist === null) {
        // distance haversine approximative si non fournie
        dist = 0;
        for (let k = 1; k < s.points.length; k++) {
          const a = s.points[k - 1], b = s.points[k];
          if (a.lat !== null && a.lon !== null && b.lat !== null && b.lon !== null) {
            const toRad = (d: number) => (d * Math.PI) / 180;
            const dLat = toRad(b.lat - a.lat), dLon = toRad(b.lon - a.lon);
            const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
            dist += 2 * 6371008.8 * Math.asin(Math.sqrt(h));
          }
        }
        if (i === 0) report.transformed.push("distance des tours (DistanceMeters) estimée par haversine à partir des coordonnées");
      }
      return {
        "@_StartTime": src?.startTime ?? first,
        TotalTimeSeconds: src?.totalTimeSec ?? totalSec,
        DistanceMeters: Math.round(dist * 100) / 100,
        ...(src?.calories !== null && src?.calories !== undefined ? { Calories: src.calories } : { Calories: 0 }),
        ...(src?.avgHr ? { AverageHeartRateBpm: { Value: src.avgHr } } : {}),
        ...(src?.maxHr ? { MaximumHeartRateBpm: { Value: src.maxHr } } : {}),
        Intensity: "Active",
        TriggerMethod: "Manual",
        Track: { Trackpoint: tps },
      };
    });
    body = {
      Activities: {
        Activity: {
          "@_Sport": sport,
          Id: model.metadataTime ?? points[0]?.time ?? new Date(0).toISOString(),
          Lap: laps,
          ...(model.creator ? { Creator: { "@_xsi:type": "Device_t", Name: model.creator } } : {}),
        },
      },
    };
    if (model.format === "gpx") report.transformed.push("trace GPX horodatée → activité TCX (un Lap par segment)");
    if (!model.sport) report.transformed.push(`sport non renseigné → « ${sport} » (modifiable)`);
    if (allSegs.some((s) => !s.points.length)) report.lost.push("segments vides ignorés");
  } else {
    // Parcours (Course) : les horodatages ne sont pas requis ; DistanceMeters cumulée calculée
    let cum = 0;
    const tps: Record<string, unknown>[] = [];
    let prev: TrackPoint | null = null;
    for (const p of points) {
      if (p.lat === null || p.lon === null) continue;
      if (prev && prev.lat !== null && prev.lon !== null) {
        const toRad = (d: number) => (d * Math.PI) / 180;
        const dLat = toRad(p.lat - prev.lat), dLon = toRad(p.lon - prev.lon);
        const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(prev.lat)) * Math.cos(toRad(p.lat)) * Math.sin(dLon / 2) ** 2;
        cum += 2 * 6371008.8 * Math.asin(Math.sqrt(h));
      }
      const node: Record<string, unknown> = { Position: { LatitudeDegrees: p.lat, LongitudeDegrees: p.lon }, DistanceMeters: Math.round(cum * 100) / 100 };
      if (p.time !== null) node.Time = p.time;
      if (p.ele !== null) node.AltitudeMeters = p.ele;
      tps.push(node);
      prev = p;
    }
    const routePoints = model.routes.flatMap((r) => r.points);
    for (const p of routePoints) {
      if (p.lat === null || p.lon === null) continue;
      if (prev && prev.lat !== null && prev.lon !== null) {
        const toRad = (d: number) => (d * Math.PI) / 180;
        const dLat = toRad(p.lat - prev.lat), dLon = toRad(p.lon - prev.lon);
        const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(prev.lat)) * Math.cos(toRad(p.lat)) * Math.sin(dLon / 2) ** 2;
        cum += 2 * 6371008.8 * Math.asin(Math.sqrt(h));
      }
      tps.push({ Position: { LatitudeDegrees: p.lat, LongitudeDegrees: p.lon }, DistanceMeters: Math.round(cum * 100) / 100, ...(p.ele !== null ? { AltitudeMeters: p.ele } : {}) });
      prev = p;
    }
    body = {
      Courses: {
        Course: {
          Name: (model.courseName ?? model.metadataName ?? model.tracks[0]?.name ?? model.routes[0]?.name ?? "Parcours").slice(0, 15),
          Lap: { TotalTimeSeconds: 0, DistanceMeters: Math.round(cum * 100) / 100, Intensity: "Active" },
          Track: { Trackpoint: tps },
          ...(model.waypoints.length
            ? {
                CoursePoint: model.waypoints.map((w) => ({ Name: (w.name ?? "Point").slice(0, 10), Time: w.time ?? new Date(0).toISOString(), Position: { LatitudeDegrees: w.lat, LongitudeDegrees: w.lon }, PointType: "Generic" })),
              }
            : {}),
        },
      },
    };
    report.transformed.push(hasTime ? "trace partiellement horodatée → parcours TCX (Course) ; horodatages incomplets" : "trace/itinéraire sans horodatage → parcours TCX (Course)");
    report.transformed.push("DistanceMeters cumulée calculée par haversine (approximation)");
    report.lost.push("nom du parcours tronqué à 15 caractères (contrainte TCX) le cas échéant");
    if (fields.has("hr") || fields.has("cad") || fields.has("power") || fields.has("speed")) report.lost.push("fréquence cardiaque, cadence, puissance et vitesse (non pertinentes dans un parcours TCX)");
    if (model.waypoints.length) report.transformed.push("waypoints → CoursePoints (nom tronqué à 10 caractères, type « Generic »)");
  }

  for (const k of ["lat", "lon", "ele", "time", "distance"]) if (fields.has(k)) report.kept.push(k);
  if (hasTime && noTime === 0) {
    for (const k of ["hr", "cad"]) if (fields.has(k)) report.kept.push(k);
    for (const k of ["speed", "power"]) if (fields.has(k)) report.transformed.push(`${k} → extension TPX (ns3)`);
    if (fields.has("temp")) report.lost.push("température (aucun champ standard TCX)");
  }
  if (model.waypoints.length && hasTime && noTime === 0) report.lost.push(`${model.waypoints.length} waypoint(s) (non représentables dans une activité TCX)`);

  const doc = {
    "?xml": { "@_version": "1.0", "@_encoding": "UTF-8" },
    TrainingCenterDatabase: {
      "@_xmlns": "http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2",
      "@_xmlns:ns3": "http://www.garmin.com/xmlschemas/ActivityExtension/v2",
      "@_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
      "@_xsi:schemaLocation": "http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2 http://www.garmin.com/xmlschemas/TrainingCenterDatabasev2.xsd",
      ...body,
      Author: { "@_xsi:type": "Application_t", Name: "Garmin.ma — outils communautaires", Build: { Version: { VersionMajor: 1, VersionMinor: 0, BuildMajor: 0, BuildMinor: 0 } }, LangID: "fr", PartNumber: "000-00000-00" },
    },
  };
  return { xml: builder.build(doc) as string, report };
}
