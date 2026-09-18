import { XMLParser, XMLBuilder } from "fast-xml-parser";
import { emptyModel, type ActivityModel, type TrackPoint, type Waypoint } from "./activity-model";
import { isValidLat, isValidLon } from "./geo";
import { MAX_POINTS } from "./xml-safety";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  processEntities: false, // aucune expansion d'entité
  allowBooleanAttributes: true,
  parseTagValue: false, // on convertit nous-mêmes (préserver les chaînes)
  parseAttributeValue: false,
  trimValues: true,
  removeNSPrefix: true, // gpxtpx:hr -> hr
  isArray: (name) => ["trk", "trkseg", "trkpt", "rte", "rtept", "wpt"].includes(name),
});

type AnyObj = Record<string, unknown>;

function num(v: unknown): number | null {
  if (v === undefined || v === null || v === "") return null;
  const n = typeof v === "number" ? v : Number(String(v).trim());
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

function readPoint(p: AnyObj, fields: Set<string>): TrackPoint {
  const lat = num(p["@_lat"]);
  const lon = num(p["@_lon"]);
  const ext = p.extensions as AnyObj | undefined;
  const pt: TrackPoint = {
    lat,
    lon,
    ele: num(p.ele),
    time: str(p.time),
    hr: num(findDeep(ext, "hr")),
    cad: num(findDeep(ext, "cad")),
    power: num(findDeep(ext, "power")),
    temp: num(findDeep(ext, "atemp")),
    distance: null,
    speed: num(findDeep(ext, "speed")),
  };
  if (pt.lat !== null) fields.add("lat");
  if (pt.lon !== null) fields.add("lon");
  if (pt.ele !== null) fields.add("ele");
  if (pt.time !== null) fields.add("time");
  if (pt.hr !== null) fields.add("hr");
  if (pt.cad !== null) fields.add("cad");
  if (pt.power !== null) fields.add("power");
  if (pt.temp !== null) fields.add("temp");
  if (pt.speed !== null) fields.add("speed");
  if (ext) pt.extensionsRaw = ext;
  return pt;
}

export function parseGpx(text: string): ActivityModel {
  const doc = parser.parse(text) as AnyObj;
  const gpx = doc.gpx as AnyObj | undefined;
  if (!gpx) throw new Error("Élément racine <gpx> introuvable.");
  const m = emptyModel("gpx");
  m.creator = str(gpx["@_creator"]);
  const meta = gpx.metadata as AnyObj | undefined;
  m.metadataName = str(meta?.name);
  m.metadataTime = str(meta?.time);

  let count = 0;
  const trks = (gpx.trk as AnyObj[] | undefined) ?? [];
  for (const trk of trks) {
    const segs = (trk.trkseg as AnyObj[] | undefined) ?? [];
    const track = { name: str(trk.name), type: str(trk.type), segments: [] as { points: TrackPoint[] }[] };
    for (const seg of segs) {
      const pts = (seg.trkpt as AnyObj[] | undefined) ?? [];
      const points: TrackPoint[] = [];
      for (const p of pts) {
        count++;
        if (count > MAX_POINTS) throw new Error(`Trop de points (> ${MAX_POINTS}).`);
        points.push(readPoint(p, m.fieldsPresent));
      }
      track.segments.push({ points });
    }
    m.tracks.push(track);
  }
  const rtes = (gpx.rte as AnyObj[] | undefined) ?? [];
  for (const rte of rtes) {
    const pts = (rte.rtept as AnyObj[] | undefined) ?? [];
    m.routes.push({ name: str(rte.name), points: pts.map((p) => readPoint(p, m.fieldsPresent)) });
  }
  const wpts = (gpx.wpt as AnyObj[] | undefined) ?? [];
  for (const w of wpts) {
    const lat = num(w["@_lat"]), lon = num(w["@_lon"]);
    if (lat === null || lon === null) continue;
    const wp: Waypoint = { lat, lon, name: str(w.name), ele: num(w.ele), time: str(w.time) };
    m.waypoints.push(wp);
  }
  if (m.tracks.length) m.kind = m.fieldsPresent.has("time") ? "activity" : "track";
  else if (m.routes.length) m.kind = "route";
  else if (m.waypoints.length) m.kind = "waypoints-only";
  else m.warnings.push("Aucune trace, itinéraire ni point d'intérêt trouvé.");

  // validation de coordonnées
  let invalid = 0;
  for (const t of m.tracks) for (const s of t.segments) for (const p of s.points) if (p.lat === null || p.lon === null || !isValidLat(p.lat) || !isValidLon(p.lon)) invalid++;
  if (invalid) m.warnings.push(`${invalid} point(s) sans coordonnées valides.`);
  return m;
}

/* ------------------------------------------------------------------ écriture */
const builder = new XMLBuilder({ ignoreAttributes: false, attributeNamePrefix: "@_", format: true, suppressEmptyNode: true, processEntities: true });

export type BuildReport = { kept: string[]; transformed: string[]; lost: string[] };

/** Construit un GPX 1.1 à partir du modèle. Retourne le XML et le rapport de champs. */
export function buildGpx(model: ActivityModel, opts: { creator?: string } = {}): { xml: string; report: BuildReport } {
  const report: BuildReport = { kept: [], transformed: [], lost: [] };
  const fields = model.fieldsPresent;
  const hasExt = (k: string) => fields.has(k);

  const trk = model.tracks.map((t) => ({
    ...(t.name ? { name: t.name } : {}),
    ...(t.type ? { type: t.type } : {}),
    trkseg: t.segments.map((s) => ({
      trkpt: s.points
        .filter((p) => p.lat !== null && p.lon !== null)
        .map((p) => {
          const ext: Record<string, unknown> = {};
          if (p.hr !== null) ext["gpxtpx:hr"] = p.hr;
          if (p.cad !== null) ext["gpxtpx:cad"] = p.cad;
          if (p.temp !== null) ext["gpxtpx:atemp"] = p.temp;
          if (p.speed !== null) ext["gpxtpx:speed"] = p.speed;
          const node: Record<string, unknown> = { "@_lat": p.lat, "@_lon": p.lon };
          if (p.ele !== null) node.ele = p.ele;
          if (p.time !== null) node.time = p.time;
          const extNode: Record<string, unknown> = {};
          if (Object.keys(ext).length) extNode["gpxtpx:TrackPointExtension"] = ext;
          if (p.power !== null) extNode["power"] = p.power;
          if (Object.keys(extNode).length) node.extensions = extNode;
          return node;
        }),
    })),
  }));

  const rte = model.routes.map((r) => ({
    ...(r.name ? { name: r.name } : {}),
    rtept: r.points.filter((p) => p.lat !== null && p.lon !== null).map((p) => ({ "@_lat": p.lat, "@_lon": p.lon, ...(p.ele !== null ? { ele: p.ele } : {}), ...(p.time !== null ? { time: p.time } : {}) })),
  }));

  const wpt = model.waypoints.map((w) => ({ "@_lat": w.lat, "@_lon": w.lon, ...(w.ele !== null ? { ele: w.ele } : {}), ...(w.time !== null ? { time: w.time } : {}), ...(w.name ? { name: w.name } : {}) }));

  const doc = {
    "?xml": { "@_version": "1.0", "@_encoding": "UTF-8" },
    gpx: {
      "@_version": "1.1",
      "@_creator": opts.creator ?? "Garmin.ma — outils communautaires",
      "@_xmlns": "http://www.topografix.com/GPX/1/1",
      "@_xmlns:gpxtpx": "http://www.garmin.com/xmlschemas/TrackPointExtension/v1",
      "@_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
      "@_xsi:schemaLocation": "http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd",
      metadata: { ...(model.metadataName ? { name: model.metadataName } : {}), ...(model.metadataTime ? { time: model.metadataTime } : {}) },
      ...(wpt.length ? { wpt } : {}),
      ...(rte.length ? { rte } : {}),
      ...(trk.length ? { trk } : {}),
    },
  };

  for (const k of ["lat", "lon", "ele", "time"]) if (fields.has(k)) report.kept.push(k);
  for (const k of ["hr", "cad", "temp", "speed", "power"]) if (hasExt(k)) report.transformed.push(`${k} (extension GPX TrackPointExtension)`);
  if (fields.has("distance")) report.lost.push("distance cumulée par point (DistanceMeters TCX) — GPX n'a pas d'équivalent standard");
  if (model.laps.length) report.lost.push(`${model.laps.length} tour(s)/lap (résumés par intervalle) — non représentables en GPX 1.1`);
  if (model.sport) report.transformed.push(`sport « ${model.sport} » → <type> de trace`);
  if (model.format === "tcx" && model.kind === "activity") report.transformed.push("activité TCX → trace GPX horodatée");
  if (model.format === "tcx" && model.kind === "course") report.transformed.push("parcours TCX → trace GPX (les CoursePoints deviennent des waypoints si présents)");

  return { xml: builder.build(doc) as string, report };
}
